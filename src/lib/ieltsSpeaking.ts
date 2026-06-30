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
  {
    id: "s-2", title: "Work and Study", titleKk: "Жұмыс және оқу", topic: "Work",
    questions: [
      { id: "s2p1q1", part: 1, question: "Do you work or are you a student?", questionKk: "Сіз жұмыс істейсіз бе, әлде студентсіз бе?", speakSeconds: 40 },
      { id: "s2p1q2", part: 1, question: "What do you find most difficult about your work or studies?", questionKk: "Жұмысыңызда/оқуыңызда ең қиыны не?", speakSeconds: 40 },
      { id: "s2p1q3", part: 1, question: "Would you like to change your job or field of study in the future?", questionKk: "Болашақта жұмысыңызды/мамандығыңызды өзгерткіңіз келе ме?", speakSeconds: 40 },
      { id: "s2p2q1", part: 2, question: "Describe a skill you would like to learn. You should say what it is, why you want to learn it, how you would learn it, and how it would help you.", questionKk: "Үйренгіңіз келетін дағдыны сипаттаңыз: ол не, неге, қалай үйренесіз, ол қалай көмектеседі.", prepSeconds: 60, speakSeconds: 120, cueCard: ["what the skill is", "why you want to learn it", "how you would learn it", "how it would help you"] },
      { id: "s2p3q1", part: 3, question: "Do you think practical skills are more important than academic knowledge?", questionKk: "Сіздіңше, практикалық дағды академиялық біліммен салыстырғанда маңыздырақ па?", speakSeconds: 60 },
      { id: "s2p3q2", part: 3, question: "How might the way people work change in the future?", questionKk: "Болашақта адамдардың жұмыс істеу тәсілі қалай өзгеруі мүмкін?", speakSeconds: 60 },
    ],
  },
  {
    id: "s-3", title: "Technology", titleKk: "Технология", topic: "Technology",
    questions: [
      { id: "s3p1q1", part: 1, question: "How often do you use the internet?", questionKk: "Интернетті қаншалықты жиі қолданасыз?", speakSeconds: 40 },
      { id: "s3p1q2", part: 1, question: "What is your favourite app or website, and why?", questionKk: "Сүйікті қосымшаңыз немесе сайтыңыз қандай, неге?", speakSeconds: 40 },
      { id: "s3p1q3", part: 1, question: "Has technology changed the way you study or work?", questionKk: "Технология оқу/жұмыс тәсіліңізді өзгертті ме?", speakSeconds: 40 },
      { id: "s3p2q1", part: 2, question: "Describe a piece of technology you find useful. You should say what it is, how you use it, how often you use it, and why it is useful.", questionKk: "Пайдалы деп санайтын технологияны сипаттаңыз: ол не, қалай, қаншалықты жиі қолданасыз, неге пайдалы.", prepSeconds: 60, speakSeconds: 120, cueCard: ["what it is", "how you use it", "how often you use it", "why it is useful"] },
      { id: "s3p3q1", part: 3, question: "Do you think people rely too much on technology nowadays?", questionKk: "Сіздіңше, бүгінде адамдар технологияға тым тәуелді ме?", speakSeconds: 60 },
      { id: "s3p3q2", part: 3, question: "What are the disadvantages of social media?", questionKk: "Әлеуметтік желінің кемшіліктері қандай?", speakSeconds: 60 },
    ],
  },
  {
    id: "s-4", title: "Travel and Places", titleKk: "Саяхат және орындар", topic: "Travel",
    questions: [
      { id: "s4p1q1", part: 1, question: "Do you enjoy travelling? Why or why not?", questionKk: "Саяхаттауды ұнатасыз ба? Неге?", speakSeconds: 40 },
      { id: "s4p1q2", part: 1, question: "What kind of places do you like to visit?", questionKk: "Қандай орындарға баруды ұнатасыз?", speakSeconds: 40 },
      { id: "s4p1q3", part: 1, question: "Do you prefer travelling alone or with others?", questionKk: "Жалғыз ба, әлде біреумен бірге саяхаттағанды ұнатасыз ба?", speakSeconds: 40 },
      { id: "s4p2q1", part: 2, question: "Describe a memorable journey you have taken. You should say where you went, who you went with, what you did, and why it was memorable.", questionKk: "Есте қалған саяхатты сипаттаңыз: қайда, кіммен, не істедіңіз, неге есте қалды.", prepSeconds: 60, speakSeconds: 120, cueCard: ["where you went", "who you went with", "what you did", "why it was memorable"] },
      { id: "s4p3q1", part: 3, question: "How has tourism affected your country?", questionKk: "Туризм еліңізге қалай әсер етті?", speakSeconds: 60 },
      { id: "s4p3q2", part: 3, question: "Do you think people travel more now than in the past? Why?", questionKk: "Сіздіңше, адамдар бұрынғыдан көбірек саяхаттай ма? Неге?", speakSeconds: 60 },
    ],
  },
  {
    id: "s-5", title: "Food and Health", titleKk: "Тамақ және денсаулық", topic: "Health",
    questions: [
      { id: "s5p1q1", part: 1, question: "What kind of food do you like to eat?", questionKk: "Қандай тамақ ұнайды?", speakSeconds: 40 },
      { id: "s5p1q2", part: 1, question: "Do you prefer eating at home or in restaurants?", questionKk: "Үйде ме, мейрамханада ма тамақтанғанды ұнатасыз?", speakSeconds: 40 },
      { id: "s5p1q3", part: 1, question: "How do you usually stay healthy?", questionKk: "Денсаулығыңызды әдетте қалай сақтайсыз?", speakSeconds: 40 },
      { id: "s5p2q1", part: 2, question: "Describe a healthy habit you have. You should say what it is, when you started it, how you maintain it, and how it benefits you.", questionKk: "Пайдалы әдетіңізді сипаттаңыз: ол не, қашан бастадыңыз, қалай ұстанасыз, қандай пайдасы бар.", prepSeconds: 60, speakSeconds: 120, cueCard: ["what the habit is", "when you started it", "how you maintain it", "how it benefits you"] },
      { id: "s5p3q1", part: 3, question: "Why do you think obesity is increasing in many countries?", questionKk: "Сіздіңше, көп елде семіздік неге артып барады?", speakSeconds: 60 },
      { id: "s5p3q2", part: 3, question: "Should governments do more to encourage healthy eating?", questionKk: "Үкімет дұрыс тамақтануды көбірек насихаттауы керек пе?", speakSeconds: 60 },
    ],
  },
  {
    id: "s-6", title: "Environment", titleKk: "Қоршаған орта", topic: "Environment",
    questions: [
      { id: "s6p1q1", part: 1, question: "Do you do anything to protect the environment?", questionKk: "Қоршаған ортаны қорғау үшін бірдеңе істейсіз бе?", speakSeconds: 40 },
      { id: "s6p1q2", part: 1, question: "Is your city or town clean?", questionKk: "Қалаңыз таза ма?", speakSeconds: 40 },
      { id: "s6p1q3", part: 1, question: "Did you learn about the environment at school?", questionKk: "Мектепте қоршаған орта туралы оқыдыңыз ба?", speakSeconds: 40 },
      { id: "s6p2q1", part: 2, question: "Describe an environmental problem in your area. You should say what it is, what causes it, how it affects people, and what could be done about it.", questionKk: "Аймағыңыздағы экологиялық мәселені сипаттаңыз: ол не, себебі, әсері, шешімі.", prepSeconds: 60, speakSeconds: 120, cueCard: ["what the problem is", "what causes it", "how it affects people", "what could be done"] },
      { id: "s6p3q1", part: 3, question: "Whose responsibility is it to protect the environment — individuals or governments?", questionKk: "Қоршаған ортаны қорғау кімнің міндеті — жеке адамдар ма, үкімет пе?", speakSeconds: 60 },
      { id: "s6p3q2", part: 3, question: "Do you think electric cars are a good solution to pollution?", questionKk: "Сіздіңше, электромобиль ластануға жақсы шешім бе?", speakSeconds: 60 },
    ],
  },
];
