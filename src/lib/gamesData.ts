// filepath: src/lib/gamesData.ts
// Ойындар үшін деректер мен ортақ көмекші функциялар.
// Сөздер vocabSeed-тен алынады (нақты сөздік қор).

import { vocabSeed } from "@/data/vocabSeed";
import type { LearnLang } from "@/types/vocabulary";

export interface GameWord {
  term: string;        // сөз (ағылшын/қытай)
  translation: string; // қазақша
  phonetic?: string;
  lang: LearnLang;
}

// Тілге сай сөздерді алу
export function getGameWords(lang: LearnLang, count?: number): GameWord[] {
  const words = vocabSeed
    .filter((w) => w.lang === lang)
    .map((w) => ({
      term: w.term,
      translation: w.translation,
      phonetic: w.phonetic,
      lang: w.lang,
    }));
  const shuffled = shuffle(words);
  return count ? shuffled.slice(0, count) : shuffled;
}

// Массивті араластыру (Fisher-Yates)
export function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Бір сөзге жалған жауаптар жасау (викторина үшін)
export function makeOptions(correct: GameWord, allWords: GameWord[], count = 4): string[] {
  const wrong = shuffle(allWords.filter((w) => w.translation !== correct.translation))
    .slice(0, count - 1)
    .map((w) => w.translation);
  return shuffle([correct.translation, ...wrong]);
}

// Ойын метадеректері (хаб үшін)
export interface GameMeta {
  id: string;
  titleKk: string;
  titleEn: string;
  descKk: string;
  descEn: string;
  icon: string;       // lucide icon аты
  gradient: string;   // фон градиенті (tailwind)
  accent: string;     // екпін түсі
}

export const gamesList: GameMeta[] = [
  {
    id: "word-match",
    titleKk: "Сөз сәйкестігі",
    titleEn: "Word Match",
    descKk: "Сөз бен аудармасын жұптаңыз",
    descEn: "Match words with translations",
    icon: "Grid3x3",
    gradient: "from-violet-500 to-purple-600",
    accent: "#8B5CF6",
  },
  {
    id: "speed-quiz",
    titleKk: "Жылдам викторина",
    titleEn: "Speed Quiz",
    descKk: "Уақытқа қарсы аударыңыз",
    descEn: "Translate against the clock",
    icon: "Zap",
    gradient: "from-amber-400 to-orange-500",
    accent: "#F59E0B",
  },
  {
    id: "word-rain",
    titleKk: "Сөз жаңбыры",
    titleEn: "Word Rain",
    descKk: "Түсіп жатқан сөздерді ұстаңыз",
    descEn: "Catch the falling words",
    icon: "CloudRain",
    gradient: "from-sky-400 to-blue-600",
    accent: "#0EA5E9",
  },
  {
    id: "hangman",
    titleKk: "Әріп табу",
    titleEn: "Hangman",
    descKk: "Жасырын сөзді әріптеп табыңыз",
    descEn: "Guess the hidden word",
    icon: "SpellCheck",
    gradient: "from-emerald-400 to-green-600",
    accent: "#16A34A",
  },
  {
    id: "sentence-builder",
    titleKk: "Сөйлем құрау",
    titleEn: "Sentence Builder",
    descKk: "Сөздерді дұрыс ретпен қойыңыз",
    descEn: "Arrange words in order",
    icon: "ListOrdered",
    gradient: "from-rose-400 to-pink-600",
    accent: "#EC4899",
  },
  {
    id: "memory-duel",
    titleKk: "Жады дуэлі",
    titleEn: "Memory Duel",
    descKk: "Жұптарды есте сақтаңыз",
    descEn: "Remember the pairs",
    icon: "Brain",
    gradient: "from-cyan-400 to-teal-600",
    accent: "#06B6D4",
  },
];
