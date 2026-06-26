// filepath: src/lib/knowledge/types.ts
// Білім базасының негізгі типтері.

export type Skill = "grammar" | "vocabulary" | "speaking" | "listening" | "writing" | "reading" | "ielts";
export type Level = "beginner" | "intermediate" | "advanced";

// Оқыту әдістемесі (мысалы CLT, TPR)
export interface TeachingMethod {
  id: string;
  name: string;          // атауы
  origin: string;        // авторы/шығу тегі
  principle: string;     // негізгі қағидасы
  whenToUse: string;     // қашан қолдану
  howToApply: string;    // AI-ге: қалай қолдану
  example: string;       // нақты мысал
  bestFor: Skill[];      // қай дағдыға
  levels: Level[];       // қай деңгейге
}

// Грамматика тақырыбы + жиі қателер
export interface GrammarPoint {
  id: string;
  topic: string;             // тақырып (мыс. Past Simple)
  rule: string;              // ереже
  commonErrors: string[];    // жиі қателер
  correction: string;        // түзету жолы
  example: { wrong: string; right: string }; // қате → дұрыс
  level: Level;
  miniExplanation: string;   // қысқа түсіндірме (AI қолданады)
}

// Сөздік/айтылым/тыңдау техникасы
export interface Technique {
  id: string;
  name: string;
  skill: Skill;
  description: string;   // не істейді
  howTo: string;         // AI-ге: қалай қолдану
  example: string;
  levels: Level[];
}

// Жиі қате үлгісі (қолданушы қателерін тану үшін)
export interface ErrorPattern {
  id: string;
  category: string;        // санат (verb tense, articles, т.б.)
  pattern: string;         // қате үлгісі
  why: string;             // неге қате
  fix: string;             // қалай түзету
  example: { wrong: string; right: string };
  forL1Kazakh?: boolean;   // қазақ тілінен ауысатын қате ме
}
