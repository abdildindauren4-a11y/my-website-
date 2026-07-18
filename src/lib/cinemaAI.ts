// filepath: src/lib/cinemaAI.ts
// LinguaCinema AI — субтитрден толық сабақ құру.
// 1) Субтитр жолдарын қазақшаға аудару
// 2) Негізгі сөздік (8-12 сөз) + түсіну тесті (4-5 сұрақ) жасау
// Жеңіл fetch қолданылады (SDK емес) — cinema chunk-і кіші болып қалады.

import { getGeminiKey } from "./gemini";
import type { SubtitleLine, VocabWord, ComprehensionQuestion } from "@/types/cinema";

const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

async function callGemini(prompt: string, maxTokens = 4000): Promise<string | null> {
  const apiKey = getGeminiKey();
  if (!apiKey) return null;
  try {
    const res = await fetch(`${API_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.3, maxOutputTokens: maxTokens, thinkingConfig: { thinkingBudget: 0 } },
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || null;
  } catch {
    return null;
  }
}

// Жауаптан JSON бөлігін алу
function extractJSON<T>(text: string): T | null {
  const m = text.match(/\[[\s\S]*\]|\{[\s\S]*\}/);
  if (!m) return null;
  try { return JSON.parse(m[0]) as T; } catch { return null; }
}

// ── 1. Субтитрлерді қазақшаға аудару (чанкпен) ──
export async function translateSubtitlesToKk(
  lines: SubtitleLine[],
  lang: "en" | "zh",
  onProgress?: (done: number, total: number) => void
): Promise<SubtitleLine[] | null> {
  const srcLang = lang === "en" ? "English" : "Chinese";
  const CHUNK = 35;
  const result = [...lines];

  for (let i = 0; i < lines.length; i += CHUNK) {
    const chunk = lines.slice(i, i + CHUNK);
    const numbered = chunk.map((l, j) => `${j + 1}. ${l.en}`).join("\n");
    const prompt = `Translate these ${srcLang} subtitle lines into natural, fluent KAZAKH.
Keep the meaning and tone. Respond ONLY with a JSON array of strings in the SAME ORDER, one translation per line, no numbering, no extra text.

LINES:
${numbered}`;

    const text = await callGemini(prompt);
    if (!text) return null;
    const arr = extractJSON<string[]>(text);
    if (!arr || arr.length === 0) return null;

    chunk.forEach((line, j) => {
      const kk = (arr[j] || "").trim();
      const idx = i + j;
      if (kk) result[idx] = { ...line, kk };
    });
    onProgress?.(Math.min(i + CHUNK, lines.length), lines.length);
  }

  return result;
}

// ── 2. Сөздік + тест жасау ──
export interface GeneratedLesson {
  vocabulary: VocabWord[];
  questions: ComprehensionQuestion[];
}

export async function generateLessonFromSubtitles(
  lines: SubtitleLine[],
  level: string,
  lang: "en" | "zh"
): Promise<GeneratedLesson | null> {
  const srcLang = lang === "en" ? "English" : "Chinese";
  // Транскрипт (тым ұзақ болса — қысқарту)
  const transcript = lines.map((l) => l.en).join(" ").slice(0, 8000);

  const prompt = `You are an expert ${srcLang} teacher creating a lesson for a Kazakh-speaking ${level} student from this video transcript.

TRANSCRIPT:
${transcript}

Create:
1. "vocabulary": the 8-12 most useful words/phrases FROM the transcript for a ${level} learner. For each: "word", "phonetic" (IPA for English, pinyin for Chinese), "partOfSpeech", "definition" (short, simple ${srcLang}), "translationKk" (Kazakh translation).
2. "questions": 4-5 comprehension questions about the transcript content. For each: "question" (in ${srcLang}), "questionKk" (same question in Kazakh), "options" (exactly 4 strings), "correctIndex" (0-3), "explanation" (one short sentence).

Respond ONLY with valid JSON:
{"vocabulary":[...],"questions":[...]}`;

  const text = await callGemini(prompt, 6000);
  if (!text) return null;

  const parsed = extractJSON<{ vocabulary?: any[]; questions?: any[] }>(text);
  if (!parsed) return null;

  const vocabulary: VocabWord[] = (parsed.vocabulary || [])
    .filter((v) => v && typeof v.word === "string" && v.word.trim())
    .slice(0, 14)
    .map((v, i) => ({
      id: `aiv-${i}`,
      word: String(v.word).trim(),
      phonetic: v.phonetic ? String(v.phonetic) : undefined,
      partOfSpeech: String(v.partOfSpeech || ""),
      definition: String(v.definition || ""),
      translationKk: String(v.translationKk || ""),
      mastery: 0,
    }));

  const questions: ComprehensionQuestion[] = (parsed.questions || [])
    .filter((q) =>
      q && typeof q.question === "string" &&
      Array.isArray(q.options) && q.options.length === 4 &&
      typeof q.correctIndex === "number" && q.correctIndex >= 0 && q.correctIndex <= 3
    )
    .slice(0, 6)
    .map((q, i) => ({
      id: `aiq-${i}`,
      question: String(q.question).trim(),
      questionKk: String(q.questionKk || q.question).trim(),
      options: q.options.map((o: unknown) => String(o)),
      correctIndex: q.correctIndex,
      explanation: q.explanation ? String(q.explanation) : undefined,
    }));

  if (vocabulary.length === 0 && questions.length === 0) return null;
  return { vocabulary, questions };
}

// ── 3. Сөйлем грамматикасын түсіндіру ──
// Субтитрдегі сөйлем неге солай құрылғанын қазақша түсіндіреді
// (ереже, шақ, сөз тәртібі + ұқсас мысал). Кэштеледі — қайта сұрау тегін.

const GRAMMAR_CACHE_KEY = "linguafast_grammar_cache";
const GRAMMAR_CACHE_MAX = 200;

function loadGrammarCache(): Record<string, string> {
  try { return JSON.parse(localStorage.getItem(GRAMMAR_CACHE_KEY) || "{}"); } catch { return {}; }
}

function saveGrammarCache(cache: Record<string, string>) {
  try {
    const keys = Object.keys(cache);
    // Кэш тым өссе — ескілерін тастап, жаңаларын қалдырамыз
    if (keys.length > GRAMMAR_CACHE_MAX) {
      const trimmed: Record<string, string> = {};
      keys.slice(-GRAMMAR_CACHE_MAX).forEach((k) => { trimmed[k] = cache[k]; });
      cache = trimmed;
    }
    localStorage.setItem(GRAMMAR_CACHE_KEY, JSON.stringify(cache));
  } catch { /* */ }
}

export async function explainSentence(sentence: string, lang: "en" | "zh"): Promise<string | null> {
  const clean = sentence.trim();
  if (!clean) return null;

  const cacheId = `${lang}:${clean.toLowerCase()}`;
  const cache = loadGrammarCache();
  if (cache[cacheId]) return cache[cacheId];

  const srcLang = lang === "en" ? "English" : "Chinese";
  const prompt = `You are a ${srcLang} grammar teacher for a Kazakh-speaking student.
Explain IN KAZAKH why this ${srcLang} sentence is built the way it is:

"${clean}"

Cover briefly:
- сөйлемнің құрылымы (кім не істейді, сөз тәртібі)
- қолданылған негізгі грамматикалық ереже (шақ, көмекші етістік, шылау т.б.) және НЕГЕ дәл осы форма
- 1 ұқсас мысал сөйлем (${srcLang}) қазақша аудармасымен

Rules: explain in simple Kazakh, use light Markdown (**bold** for grammar terms, bullet list), max 130 words. No greetings, start directly.`;

  const text = await callGemini(prompt, 1500);
  if (!text) return null;

  const result = text.trim();
  cache[cacheId] = result;
  saveGrammarCache(cache);
  return result;
}
