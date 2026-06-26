// filepath: src/types/vocabulary.ts
// Сөздік + SRS (Spaced Repetition System) деректер құрылымы.

// Үйренетін тіл
export type LearnLang = "en" | "zh";

// SRS меңгеру деңгейі (0 = жаңа, 5 = толық меңгерілген)
export type SrsLevel = 0 | 1 | 2 | 3 | 4 | 5;

// Сөздік картасы (бір сөз)
export interface VocabCard {
  id: string;
  lang: LearnLang;          // қай тіл (en/zh)
  term: string;             // сөз (ағылшынша немесе иероглиф)
  phonetic?: string;        // фонетика немесе пиньинь
  translation: string;      // қазақша аудармасы
  definition?: string;      // анықтама (тіл ішінде)
  example?: string;         // мысал сөйлем
  partOfSpeech?: string;    // сөз табы
  tags?: string[];          // тегтер (тақырып, көзі)

  // ── SRS деректері ──
  srsLevel: SrsLevel;       // меңгеру деңгейі
  nextReview: number;       // келесі қайталау уақыты (timestamp)
  lastReview?: number;      // соңғы қайталау
  correctCount: number;     // дұрыс жауап саны
  wrongCount: number;       // қате жауап саны
  createdAt: number;        // қосылған уақыт
  source?: string;          // көзі (cinema, chat, manual)
}

// Қайталау нәтижесі (карта режимінде)
export type ReviewResult = "again" | "hard" | "good" | "easy";

// Сөздік статистикасы
export interface VocabStats {
  total: number;            // барлық сөз
  new: number;              // жаңа (деңгей 0)
  learning: number;         // үйренілуде (1-3)
  mastered: number;         // меңгерілген (4-5)
  dueToday: number;         // бүгін қайталау керек
}
