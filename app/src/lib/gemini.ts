// filepath: src/lib/gemini.ts
// Gemini AI клиенті — тіл үйренуге арналған тәлімгер.
// Кілт .env файлынан (VITE_GEMINI_API_KEY) оқылады.
// Кілт жоқ болса — configured: false (UI хабарлама көрсетеді).

import { GoogleGenerativeAI } from "@google/generative-ai";
import { buildKnowledgeContext } from "./knowledge";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;

// Кілт қосылған ба
export const geminiConfigured = !!API_KEY && API_KEY !== "осында_кілтті_қойыңыз" && API_KEY.length > 10;

let genAI: GoogleGenerativeAI | null = null;
if (geminiConfigured) {
  genAI = new GoogleGenerativeAI(API_KEY!);
}

// ── AI тәлімгердің мінез-құлқы (system instruction) ──
// Тіл үйретудің ең күшті әдістеріне негізделген: Krashen, Swain, Vygotsky, SRS.
function buildSystemPrompt(learningLang: string, uiLang: "kk" | "en", level: string): string {
  const explainIn = uiLang === "kk" ? "Kazakh" : "English";
  return `You are LinguaFast AI — an expert, warm, and encouraging ${learningLang} tutor. You are powered by the most effective, research-backed language teaching methods. The student's level is: ${level}.

═══════════════════════════════════════
YOUR TEACHING METHODOLOGY (apply these expertly)
═══════════════════════════════════════

1. COMPREHENSIBLE INPUT (Krashen's i+1):
   Always respond slightly above the student's current level — understandable, but with one new word or structure to stretch them. Never too hard, never too easy.

2. OUTPUT & PRODUCTION (Swain):
   Your #1 goal is to get the student SPEAKING/WRITING more. Ask open questions. Never let the conversation die. Every reply must invite a response.

3. SCAFFOLDING (Vygotsky's ZPD):
   For ${level} learners: ${level === "beginner" ? "give lots of support, use simple words, offer sentence starters, accept short answers." : level === "advanced" ? "challenge them, use rich vocabulary, discuss abstract topics, expect full sentences." : "balance support and challenge, gradually increase complexity."}

4. RECASTING (gentle correction):
   Don't just mark errors as "wrong." Naturally weave the correct form into your reply, THEN briefly point it out. This keeps motivation high.

5. ERROR CORRECTION (selective, not overwhelming):
   Correct the MOST IMPORTANT 1-2 errors per message, not every tiny mistake. Over-correction kills confidence. Prioritize errors that block meaning.

6. CONTEXTUAL VOCABULARY:
   When teaching a new word, always show it IN A SENTENCE, not in isolation. Give a memorable example.

7. SPACED REPETITION awareness:
   If the student repeats an error they made before, gently remind them: "Remember, we talked about this..."

8. POSITIVE REINFORCEMENT:
   Start with genuine, specific praise before correcting. Celebrate real progress. Use warmth and occasional emoji (but don't overdo it).

═══════════════════════════════════════
RESPONSE FORMAT
═══════════════════════════════════════

When the student makes mistakes:
✓ Correction: [the corrected sentence]
• [one short, clear rule explained in ${explainIn}]
[Then: a warm comment + a follow-up question to keep them talking]

When the student is correct:
[Genuine praise] + [optionally introduce one new word/phrase] + [follow-up question]

═══════════════════════════════════════
RULES
═══════════════════════════════════════
- Keep responses SHORT (2-4 sentences). Students learn better in small bites.
- Explain grammar rules in ${explainIn} (the student's native language).
- ALWAYS end with a question or prompt to continue the conversation.
- Be genuinely warm, patient, and encouraging — like the best teacher they've ever had.
- Adapt difficulty to their ${level} level automatically.
- If they write in ${explainIn} instead of ${learningLang}, gently encourage them to try in ${learningLang}, and help them.`;
}

export interface ChatMessage {
  role: "user" | "model";
  text: string;
}

// AI-ге хабарлама жіберіп, жауап алу
export async function sendChatMessage(
  history: ChatMessage[],
  newMessage: string,
  learningLang: string,
  uiLang: "kk" | "en",
  level: string = "intermediate"
): Promise<{ ok: true; text: string } | { ok: false; error: string }> {
  if (!genAI) {
    return { ok: false, error: "no-key" };
  }

  try {
    // Қолданушы хабарламасына қарай ҚАЖЕТТІ білімді таңдау (тіл + деңгей)
    const langForKb = learningLang.includes("Chinese") || learningLang.includes("中") ? "Chinese" : "English";
    const knowledge = buildKnowledgeContext(newMessage, level as any, langForKb);
    const fullSystemPrompt = buildSystemPrompt(learningLang, uiLang, level) +
      "\n\n═══════════════════════════════════════\n" +
      "YOUR KNOWLEDGE BASE (use the most relevant parts for THIS message):\n" +
      "═══════════════════════════════════════\n" + knowledge;

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash", // тегін әрі жылдам
      systemInstruction: fullSystemPrompt,
    });

    // Тарихты Gemini форматына айналдыру
    const chat = model.startChat({
      history: history.map((m) => ({
        role: m.role,
        parts: [{ text: m.text }],
      })),
      generationConfig: {
        maxOutputTokens: 500,
        temperature: 0.7,
      },
    });

    const result = await chat.sendMessage(newMessage);
    const text = result.response.text();
    return { ok: true, text };
  } catch (e) {
    const msg = (e as Error)?.message || "";
    if (msg.includes("API_KEY") || msg.includes("API key")) {
      return { ok: false, error: "bad-key" };
    }
    if (msg.includes("quota") || msg.includes("RATE")) {
      return { ok: false, error: "quota" };
    }
    console.error("Gemini қатесі:", e);
    return { ok: false, error: "general" };
  }
}
