// filepath: src/types/course.ts
// Курстар модулі типтері — құрылымды сабақтар.
// Деңгей → Бөлім → Сабақ → Жаттығу.

import type { LearnLang } from "./vocabulary";

// Жаттығу түрлері (сабақ ішінде)
export type ExerciseType =
  | "flashcard"        // сөз карточкасы (көрсету + аударма)
  | "multiple-choice"  // дұрыс жауап таңдау
  | "translation"      // аударма жазу
  | "fill-blank"       // бос орынды толтыру
  | "match-pairs"      // жұптау
  | "word-order"       // сөздерді ретпен қою
  | "listening";       // тыңдап жазу

// Бір жаттығу
export interface Exercise {
  id: string;
  type: ExerciseType;
  prompt: string;          // сұрақ/тапсырма
  promptKk?: string;
  // Сөз/аударма (flashcard, translation)
  term?: string;
  translation?: string;
  phonetic?: string;
  // Нұсқалар (multiple-choice)
  options?: string[];
  answer: string;          // дұрыс жауап
  acceptableAnswers?: string[];
  // Бос орын толтыру
  sentence?: string;       // "I ___ to school" (___ = бос орын)
  hint?: string;
  audioText?: string;      // listening үшін
}

// Сабақ түрлері
export type LessonType = "vocabulary" | "grammar" | "practice" | "dialogue";

// Бір сабақ
export interface Lesson {
  id: string;
  type: LessonType;
  title: string;
  titleKk: string;
  description: string;
  descriptionKk: string;
  xpReward: number;        // аяқтағанда берілетін XP
  // Грамматика сабағы үшін — теория
  theory?: {
    explanation: string;
    explanationKk: string;
    examples: { text: string; translation: string }[];
  };
  // Жаттығулар
  exercises: Exercise[];
  estimatedMinutes: number;
}

// Бөлім (бірнеше сабақ)
export interface Unit {
  id: string;
  number: number;
  title: string;
  titleKk: string;
  description: string;
  descriptionKk: string;
  icon: string;            // lucide icon
  color: string;           // тема түсі
  lessons: Lesson[];
}

// Курс деңгейі
export interface CourseLevel {
  id: string;
  level: "beginner" | "intermediate" | "advanced";
  title: string;
  titleKk: string;
  description: string;
  descriptionKk: string;
  lang: LearnLang;
  units: Unit[];
}

// Прогресс (localStorage)
export interface CourseProgress {
  completedLessons: string[];   // аяқталған сабақ id-лері
  lessonScores: Record<string, number>; // сабақ → ұпай (%)
  lastLessonId?: string;
}
