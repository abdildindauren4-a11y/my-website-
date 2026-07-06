// filepath: src/types/exercise.ts
// ExerciseSpec — БАРЛЫҚ жаттығудың ортақ тілі (ROADMAP 0.2).
// Сабақ қозғалтқышы, checkpoint, жаттығу беті, ойындар — бәрі осы бір
// форматпен жұмыс істейді: бір рет жасалған жаттығу барлық жерде жүреді.

import type { LearnLang } from "./vocabulary";

// 8 негізгі түр + "present" (жаңа сөзді таныстыру картасы, бағаланбайды)
export type ExerciseSpecType =
  | "choice"        // дұрыс жауапты таңдау
  | "translate"     // аударманы теру (екі бағытта)
  | "listen-type"   // тыңдап теру (диктант)
  | "listen-choice" // тыңдап таңдау
  | "speak"         // айтып қайталау (тану + ұқсастық)
  | "match"         // жұп сәйкестендіру
  | "order"         // сөздерді ретімен құрау
  | "fill"          // бос орынды толтыру
  | "present";      // жаңа сөз/ереже картасы (жауап жоқ, тек «Түсіндім»)

export interface ExerciseSpec {
  id: string;
  type: ExerciseSpecType;
  lang: LearnLang;               // жаттығу тілі (TTS/тану дауысы осыдан)
  prompt: string;                // тапсырма/сұрақ
  promptKk?: string;             // қазақша тапсырма
  text?: string;                 // жаттығу мәтіні: айтылатын/оқылатын сөз-сөйлем
  phonetic?: string;             // транскрипция/пиньинь (present, speak)
  options?: string[];            // choice / listen-choice нұсқалары
  answer: string;                // дұрыс жауап (present-те бос болуы мүмкін)
  acceptableAnswers?: string[];  // балама дұрыс жауаптар
  pairs?: { a: string; b: string }[]; // match жұптары
  words?: string[];              // order: құрайтын сөздер (дұрыс ретте — көрсетуде араластырылады)
  hint?: string;                 // көмек
  explanation?: string;          // қате болғанда көрсетілетін түсіндірме
  xp?: number;                   // дұрыс жауап XP-і (әдепкі: қозғалтқыш шешеді)
}

// Жаттығу нәтижесі — learnEvents журналына кететін бірлік
export interface ExerciseResult {
  specId: string;
  correct: boolean;
  userAnswer?: string;
  ms?: number; // жауап уақыты
}
