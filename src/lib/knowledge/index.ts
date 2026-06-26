// filepath: src/lib/knowledge/index.ts
// Білім базасының миы — AI үшін динамикалық промпт құрастырады.
// Қолданушының хабарламасын талдап, ҚАЖЕТТІ әдістерді ғана таңдайды
// (бәрін бірден беру — токенді ысырап етеді әрі AI-ды шатастырады).

import { teachingMethods } from "./methods";
import { errorPatterns, kazakhSpecificErrors } from "./errorPatterns";
import { techniques } from "./techniques";
import { ieltsStrategies } from "./ielts";
import { grammarPoints } from "./grammar";
import { chinesePoints, chineseForKazakh } from "./chinese";
import { hskStrategies, conversationScenarios } from "./hsk";
import { phrasalVerbs, collocations } from "./phrasalVerbs";
import { academicVocab, discourseMarkers } from "./academicVocab";
import { hskVocab, pronunciationPoints } from "./chineseVocab";
import type { Level } from "./types";

export * from "./types";
export { teachingMethods, errorPatterns, techniques, ieltsStrategies, kazakhSpecificErrors, grammarPoints, chinesePoints, hskStrategies, conversationScenarios, phrasalVerbs, collocations, academicVocab, discourseMarkers, hskVocab, pronunciationPoints };

// Базаның жалпы статистикасы (UI-де көрсетуге)
export const knowledgeStats = {
  methods: teachingMethods.length,
  errorPatterns: errorPatterns.length,
  techniques: techniques.length,
  ieltsStrategies: ieltsStrategies.length,
  grammarPoints: grammarPoints.length,
  chinesePoints: chinesePoints.length,
  hskStrategies: hskStrategies.length,
  scenarios: conversationScenarios.length,
  phrasalVerbs: phrasalVerbs.length,
  collocations: collocations.length,
  academicVocab: academicVocab.length,
  hskVocab: hskVocab.length,
  pronunciation: pronunciationPoints.length,
  total:
    teachingMethods.length + errorPatterns.length + techniques.length +
    ieltsStrategies.length + grammarPoints.length + chinesePoints.length +
    hskStrategies.length + conversationScenarios.length + phrasalVerbs.length +
    collocations.length + academicVocab.length + hskVocab.length + pronunciationPoints.length,
};

// ── Қолданушы хабарламасынан контекст анықтау ──
interface MessageContext {
  mentionsIelts: boolean;
  mentionsHsk: boolean;
  mentionsSpeaking: boolean;
  mentionsVocab: boolean;
  mentionsGrammar: boolean;
  isQuestion: boolean;
}

function analyzeMessage(msg: string): MessageContext {
  const lower = msg.toLowerCase();
  return {
    mentionsIelts: /ielts|exam|band|test|emtihan/i.test(lower),
    mentionsHsk: /hsk|汉语|chinese exam|tone|pinyin|character|иероглиф|тон/i.test(lower),
    mentionsSpeaking: /speak|talk|pronounce|conversation|сөйлеу/i.test(lower),
    mentionsVocab: /word|vocabulary|mean|сөз|сөздік/i.test(lower),
    mentionsGrammar: /grammar|tense|rule|грамматика/i.test(lower),
    isQuestion: lower.includes("?") || /^(what|how|why|when|where|can|do|does|is|are)/i.test(lower),
  };
}

// ── Грамматика тақырыптарын таңдау (контекске сай) ──
function selectGrammar(level: Level, ctx: MessageContext): string {
  let relevant = grammarPoints.filter((g) => g.level === level);
  // Егер нақты грамматика сұралса — бәрін қарастырамыз
  if (ctx.mentionsGrammar) relevant = grammarPoints;
  return relevant.slice(0, 5)
    .map((g) => `• ${g.topic}: ${g.miniExplanation} (e.g. "${g.example.wrong}" → "${g.example.right}")`)
    .join("\n");
}

// ── Қытай тілі білімін таңдау ──
function selectChinese(level: Level, ctx: MessageContext): string {
  const cnLevel = level === "beginner" ? "HSK1-2" : level === "intermediate" ? "HSK3-4" : "HSK5-6";
  let relevant = chinesePoints.filter((c) => c.level === cnLevel || c.level === "HSK1-2");
  // Тон/иероглиф сұралса — соған басымдық
  if (ctx.mentionsHsk) relevant = chinesePoints;
  return relevant.slice(0, 6)
    .map((c) => `• [${c.topic}]: ${c.howToTeach} Example: ${c.example}`)
    .join("\n");
}

// ── Деңгейге сай әдістерді таңдау ──
function selectMethods(level: Level, ctx: MessageContext): string {
  let relevant = teachingMethods.filter((m) => m.levels.includes(level));

  // Контекске қарай басымдық
  if (ctx.mentionsSpeaking) {
    relevant = relevant.filter((m) => m.bestFor.includes("speaking")).concat(relevant);
  }
  if (ctx.mentionsVocab) {
    relevant = relevant.filter((m) => m.bestFor.includes("vocabulary")).concat(relevant);
  }

  // Қайталанбайтын алғашқы 4
  const seen = new Set<string>();
  const top = relevant.filter((m) => !seen.has(m.id) && seen.add(m.id)).slice(0, 4);

  return top
    .map((m) => `• ${m.name}: ${m.principle} HOW: ${m.howToApply}`)
    .join("\n");
}

// ── Қазақ тіліне тән қателер (әрқашан қосамыз — өте құнды) ──
function buildKazakhErrors(): string {
  return kazakhSpecificErrors
    .map((e) => `• ${e.category}: "${e.example.wrong}" → "${e.example.right}" (${e.fix})`)
    .join("\n");
}

// ── Контекске сай техникалар ──
function selectTechniques(level: Level, ctx: MessageContext): string {
  let relevant = techniques.filter((t) => t.levels.includes(level));
  if (ctx.mentionsSpeaking) relevant = relevant.filter((t) => t.skill === "speaking");
  else if (ctx.mentionsVocab) relevant = relevant.filter((t) => t.skill === "vocabulary");

  return relevant.slice(0, 4)
    .map((t) => `• ${t.name}: ${t.howTo}`)
    .join("\n");
}

// ── IELTS стратегиялары (тек сұралса) ──
function buildIeltsBlock(): string {
  return ieltsStrategies.slice(0, 8)
    .map((s) => `• [${s.section}] ${s.title}: ${s.strategy}`)
    .join("\n");
}

// ════════════════════════════════════════════════════
// НЕГІЗГІ ФУНКЦИЯ: AI үшін білім блогын құрастыру
// Тіл (ағылшын/қытай) мен деңгейге қарай ҚАЖЕТТІ білімді таңдайды.
// ════════════════════════════════════════════════════
export function buildKnowledgeContext(
  userMessage: string,
  level: Level,
  learningLang: "English" | "Chinese" = "English"
): string {
  const ctx = analyzeMessage(userMessage);
  const blocks: string[] = [];

  // 1. Таңдалған әдістемелер (екі тілге де ортақ)
  blocks.push(`RELEVANT TEACHING METHODS (apply these expertly):\n${selectMethods(level, ctx)}`);

  if (learningLang === "Chinese") {
    // ── ҚЫТАЙ ТІЛІ ──
    blocks.push(`CHINESE LANGUAGE KNOWLEDGE (tones, characters, grammar — use what fits):\n${selectChinese(level, ctx)}`);
    // Негізгі HSK сөздер
    const cnWords = hskVocab.slice(0, 12).map((w) => `${w.hanzi} (${w.pinyin}) = ${w.meaning}`).join(", ");
    blocks.push(`CORE HSK VOCABULARY you can use: ${cnWords}`);
    // Қытай айтылымы (қазаққа қиын)
    const cnPron = pronunciationPoints.filter((p) => p.language === "Chinese");
    blocks.push(`CHINESE PRONUNCIATION challenges for Kazakh speakers:\n${cnPron.map((p) => `• ${p.sound}: ${p.howToFix} (${p.example})`).join("\n")}`);
    // Қазақ үйренушіге қытай тілінің ерекшеліктері
    blocks.push(`FOR KAZAKH SPEAKERS learning Chinese:\nAdvantages: ${chineseForKazakh.advantages.join("; ")}.\nChallenges to watch: ${chineseForKazakh.challenges.join("; ")}.`);
    // HSK (сұралса)
    if (ctx.mentionsHsk) {
      blocks.push(`HSK EXAM STRATEGIES:\n${hskStrategies.slice(0, 6).map((h) => `• [${h.level}] ${h.title}: ${h.strategy}`).join("\n")}`);
    }
  } else {
    // ── АҒЫЛШЫН ТІЛІ ──
    // Қазақ тіліне тән қателер
    blocks.push(`COMMON ERRORS FOR KAZAKH SPEAKERS (watch for these specifically):\n${buildKazakhErrors()}`);
    // Грамматика
    blocks.push(`RELEVANT GRAMMAR POINTS:\n${selectGrammar(level, ctx)}`);
    // Фразалық етістіктер (деңгейге сай)
    const phrasals = phrasalVerbs.filter((p) => p.level === level).slice(0, 8);
    if (phrasals.length) blocks.push(`USEFUL PHRASAL VERBS to teach naturally: ${phrasals.map((p) => `${p.verb} (${p.meaning})`).join(", ")}`);
    // Сөз тіркестері (collocations)
    blocks.push(`KEY COLLOCATIONS (correct word partnerships):\n${collocations.slice(0, 4).map((c) => `• ${c.base}: ${c.combinations.slice(0, 4).join(", ")}. Note: ${c.commonError}`).join("\n")}`);
    // Айтылым (қазаққа қиын)
    const enPron = pronunciationPoints.filter((p) => p.language === "English");
    if (ctx.mentionsSpeaking) {
      blocks.push(`ENGLISH PRONUNCIATION challenges for Kazakh speakers:\n${enPron.map((p) => `• ${p.sound}: ${p.howToFix}`).join("\n")}`);
    }
    // Жоғары деңгейге — академиялық сөздік
    if (level === "advanced" || ctx.mentionsIelts) {
      blocks.push(`ACADEMIC VOCABULARY upgrades (simple → academic):\n${academicVocab.slice(0, 10).map((a) => `${a.simple} → ${a.academic.slice(0, 3).join("/")}`).join("; ")}`);
    }
    // IELTS (сұралса)
    if (ctx.mentionsIelts) {
      blocks.push(`IELTS STRATEGIES (the student is asking about IELTS):\n${buildIeltsBlock()}`);
      blocks.push(`DISCOURSE MARKERS for essays:\nContrast: ${discourseMarkers.contrasting.slice(0, 3).join(", ")}. Cause: ${discourseMarkers.causeEffect.slice(0, 3).join(", ")}. Adding: ${discourseMarkers.adding.slice(0, 3).join(", ")}.`);
    }
  }

  // 2. Контекске сай техникалар (екі тілге де)
  const techBlock = selectTechniques(level, ctx);
  if (techBlock) blocks.push(`USEFUL TECHNIQUES for this situation:\n${techBlock}`);

  return blocks.join("\n\n");
}
