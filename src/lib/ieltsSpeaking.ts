// filepath: src/lib/ieltsSpeaking.ts
// IELTS Speaking — микрофон тану + Gemini бағалау.
// Сөйлеуді мәтінге айналдырып (Web Speech Recognition), AI бағалайды.

import { getGeminiKey } from "./gemini";

// Speaking тапсырмалары (3 бөлім)
export interface SpeakingQuestion {
  id: string;
  part: 1 | 2 | 3;
  question: string;
  questionKk: string;
  prepSeconds?: number;   // Part 2 — дайындық уақыты
  speakSeconds?: number;  // жауап уақыты
  cueCard?: string[];     // Part 2 — карточка тармақтары
}

export interface SpeakingTest {
  id: string;
  title: string;
  titleKk: string;
  topic: string;
  questions: SpeakingQuestion[];
}

export interface SpeakingEvaluation {
  overallBand: number;
  criteria: {
    fluencyCoherence: { band: number; feedback: string };
    lexicalResource: { band: number; feedback: string };
    grammaticalRange: { band: number; feedback: string };
    pronunciation: { band: number; feedback: string };
  };
  strengths: string[];
  improvements: string[];
  wordCount: number;
}

// ── Микрофон тану (Web Speech Recognition) ──
export function isSpeechRecognitionSupported(): boolean {
  return typeof window !== "undefined" &&
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);
}

export interface RecognitionController {
  start: () => void;
  stop: () => void;
}

// Тануды бастау. onResult — мәтін, onEnd — аяқталды
export function createRecognition(
  onResult: (transcript: string, isFinal: boolean) => void,
  onEnd: () => void,
  onError?: (error: string) => void
): RecognitionController | null {
  if (!isSpeechRecognitionSupported()) return null;

  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.continuous = true;
  recognition.interimResults = true;

  let finalTranscript = "";
  let manualStop = false;   // қолданушы өзі тоқтатты ма
  let running = false;

  recognition.onresult = (event: any) => {
    let interim = "";
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        finalTranscript += transcript + " ";
        onResult(finalTranscript.trim(), true);
      } else {
        interim += transcript;
        onResult((finalTranscript + interim).trim(), false);
      }
    }
  };

  recognition.onerror = (event: any) => {
    // "no-speech"/"aborted" — үнсіздік, қате емес: жалғастырамыз
    if (event.error === "no-speech" || event.error === "aborted") return;
    if (onError) onError(event.error);
  };

  // Үнсіздікте браузер тоқтатса — автоматты қайта қосу (жауап үзілмеуі үшін)
  recognition.onend = () => {
    if (manualStop) {
      running = false;
      onEnd();
    } else {
      try { recognition.start(); } catch { /* кейде "already started" — елемейміз */ }
    }
  };

  return {
    start: () => { manualStop = false; if (running) return; running = true; finalTranscript = ""; try { recognition.start(); } catch { /* */ } },
    stop: () => { manualStop = true; try { recognition.stop(); } catch { /* */ } },
  };
}

// ── Сөйлеуді бағалау (Gemini) ──
export async function evaluateSpeaking(
  questions: { question: string; answer: string }[],
  lang: "kk" | "en"
): Promise<SpeakingEvaluation> {
  const apiKey = getGeminiKey();
  if (!apiKey) throw new Error("NO_API_KEY");

  const allText = questions.map((q) => q.answer).join(" ");
  const wordCount = allText.trim().split(/\s+/).filter(Boolean).length;
  const feedbackLang = lang === "kk" ? "Kazakh" : "English";

  const qaText = questions.map((q, i) => `Q${i + 1}: ${q.question}\nA${i + 1}: ${q.answer}`).join("\n\n");

  const systemPrompt = `You are an experienced IELTS Speaking examiner. Evaluate the following spoken responses (transcribed from audio) according to the official IELTS Speaking band descriptors.

Note: The text was transcribed by speech recognition, so ignore minor transcription errors and focus on the content, vocabulary, and grammar.

Assess on the four official criteria, each scored from 1.0 to 9.0 (in 0.5 increments):
1. Fluency and Coherence — flow, logical connection of ideas
2. Lexical Resource — vocabulary range and accuracy
3. Grammatical Range and Accuracy — grammar variety and correctness
4. Pronunciation — (estimate based on text complexity; note this is limited from transcription)

Write all feedback in ${feedbackLang}. The overall band is the average, rounded to the nearest 0.5.

Respond ONLY with valid JSON (no markdown):
{
  "overallBand": 6.5,
  "criteria": {
    "fluencyCoherence": { "band": 6.5, "feedback": "..." },
    "lexicalResource": { "band": 6.0, "feedback": "..." },
    "grammaticalRange": { "band": 7.0, "feedback": "..." },
    "pronunciation": { "band": 6.5, "feedback": "..." }
  },
  "strengths": ["...", "..."],
  "improvements": ["...", "..."]
}`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: systemPrompt + "\n\nRESPONSES:\n" + qaText }] }],
        generationConfig: { temperature: 0.3, maxOutputTokens: 1500 },
      }),
    }
  );

  if (!response.ok) throw new Error("API_ERROR");

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("PARSE_ERROR");

  const result = JSON.parse(jsonMatch[0]);
  return { ...result, wordCount };
}

// ── Speaking тест базасы ──
export const speakingTests: SpeakingTest[] = [
  {
    id: "s-1",
    title: "Hometown and Daily Life",
    titleKk: "Туған қала және күнделікті өмір",
    topic: "Personal",
    questions: [
      // Part 1 — таныстыру сұрақтары
      { id: "s1p1q1", part: 1, question: "Where is your hometown and what is it like?", questionKk: "Туған қалаңыз қайда және ол қандай?", speakSeconds: 40 },
      { id: "s1p1q2", part: 1, question: "What do you usually do in your free time?", questionKk: "Бос уақытыңызда әдетте не істейсіз?", speakSeconds: 40 },
      { id: "s1p1q3", part: 1, question: "Do you prefer mornings or evenings? Why?", questionKk: "Таңертеңді ме, әлде кешті ме жақсы көресіз? Неге?", speakSeconds: 40 },
      // Part 2 — cue card (монолог)
      {
        id: "s1p2q1", part: 2,
        question: "Describe a place you like to visit. You should say where it is, how often you go there, what you do there, and explain why you like it.",
        questionKk: "Баруды ұнататын жеріңізді сипаттаңыз. Қайда екенін, қаншалықты жиі баратыныңызды, не істейтініңізді айтып, неге ұнататыныңызды түсіндіріңіз.",
        prepSeconds: 60, speakSeconds: 120,
        cueCard: ["where it is", "how often you go there", "what you do there", "why you like it"],
      },
      // Part 3 — тереңірек талқылау
      { id: "s1p3q1", part: 3, question: "How have people's leisure activities changed over the past few decades?", questionKk: "Соңғы онжылдықтарда адамдардың демалыс әрекеттері қалай өзгерді?", speakSeconds: 60 },
      { id: "s1p3q2", part: 3, question: "Do you think it is important for people to have hobbies? Why?", questionKk: "Сіздіңше, адамдарда хобби болуы маңызды ма? Неге?", speakSeconds: 60 },
    ],
  },
];
