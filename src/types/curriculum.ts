// filepath: src/types/curriculum.ts
// Мазмұн моделі (ROADMAP 0.2): Curriculum → Level → Unit →
// (vocabSet + grammarPoint + lessons + dialogue + checkpoint).
// 2-кезеңдегі оқу жолы (path) және 4-кезеңдегі A1/A2/HSK1 контенті
// ТОЛЫҚ осы форматта жасалады.

import type { CefrLevel } from "@/lib/cefr";
import type { ExerciseSpec } from "./exercise";
import type { LearnLang } from "./vocabulary";

// Юниттің жаңа сөзі — vocabSeed-пен үйлесімді (SRS-ке автоқосылады,
// ойындар материал қоры автоматты байиды)
export interface CurriculumWord {
  term: string;          // сөз (en/zh — иероглиф)
  translation: string;   // қазақша аудармасы
  phonetic?: string;     // транскрипция / пиньинь
  example?: string;      // мысал сөйлем (үйрену тілінде)
  exampleKk?: string;    // мысалдың қазақшасы
}

// Юниттің грамматика ережесі (теория)
export interface UnitGrammarPoint {
  title: string;
  titleKk: string;
  explanationKk: string; // қазақша түсіндірме (негізгі оқу тілі)
  examples: { text: string; translationKk: string }[];
  keyPoints?: string[];  // қысқа тұжырымдар (қазақша)
}

// Юнит ішіндегі бір сабақ — ExerciseSpec тізбегі
export interface CurriculumLesson {
  id: string;
  title: string;
  titleKk: string;
  exercises: ExerciseSpec[];
  xpReward: number;
}

// Тыңдалатын диалог (студиялық AI дауыспен оқылады)
export interface DialogueLine {
  speaker: "A" | "B";
  text: string;          // үйрену тілінде
  translationKk: string;
}

// Юнит — оқу жолындағы бір түйін
export interface CurriculumUnit {
  id: string;
  number: number;        // деңгей ішіндегі реті
  title: string;
  titleKk: string;
  emoji: string;         // жолдағы белгісі
  color: string;         // тема түсі (accent-*)
  descriptionKk: string;
  vocabSet: CurriculumWord[];        // 8-12 жаңа сөз
  grammar?: UnitGrammarPoint;        // ереже (болмауы мүмкін — сөздік юниттер)
  lessons: CurriculumLesson[];       // 4-6 сабақ
  dialogue?: DialogueLine[];         // қорытынды диалог
  checkpoint: ExerciseSpec[];        // юнит тесті: 10-12 сұрақ, өту ≥80%
}

// Бір CEFR/HSK деңгейінің толық бағдарламасы
export interface CurriculumLevel {
  lang: LearnLang;
  cefr: CefrLevel;       // A1…C2 (қытайда HSK-ға сәйкестендірілген)
  hsk?: number;          // қытай үшін HSK нөмірі
  titleKk: string;       // «Бастапқы деңгей» т.б.
  units: CurriculumUnit[];
}
