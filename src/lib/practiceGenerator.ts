// filepath: src/lib/practiceGenerator.ts
// Жаттығу генераторы — әртүрлі деректен жылдам жаттығу жасайды.
// Сөздік, грамматика, аралас. Курстан өзгеше — еркін, қайталанбалы.

import { vocabSeed } from "@/data/vocabSeed";
import { grammarPoints } from "@/lib/knowledge/grammar";
import { shuffle } from "@/lib/gamesData";
import type { LearnLang, VocabCard } from "@/types/vocabulary";

// Жаттығу сұрағы (қарапайым, бірыңғай формат)
export interface PracticeQuestion {
  id: string;
  kind: "vocab-to-kk" | "vocab-to-en" | "grammar-error" | "grammar-correct";
  prompt: string;          // сұрақ
  promptKk?: string;
  term?: string;           // сөз (дыбыс үшін)
  options: string[];       // 4 нұсқа
  answer: string;          // дұрыс жауап
  explanation?: string;    // түсіндірме
  lang: LearnLang;
}

// ── Сөздік жаттығу (дайын + қолданушы сөздері) ──
export function generateVocabQuestions(
  lang: LearnLang,
  count: number,
  userCards: VocabCard[] = []
): PracticeQuestion[] {
  // Дайын сөздер + қолданушы сөздері
  const seedWords = vocabSeed.filter((w) => w.lang === lang).map((w) => ({ term: w.term, translation: w.translation }));
  const userWords = userCards.filter((c) => c.lang === lang).map((c) => ({ term: c.term, translation: c.translation }));
  const allWords = [...userWords, ...seedWords];

  if (allWords.length < 4) return [];

  const selected = shuffle(allWords).slice(0, count);
  const questions: PracticeQuestion[] = [];

  selected.forEach((word, i) => {
    // Кездейсоқ бағыт: сөз→аударма немесе аударма→сөз
    const toKk = Math.random() > 0.5;
    const correct = toKk ? word.translation : word.term;
    const wrongOptions = shuffle(allWords.filter((w) => w.translation !== word.translation))
      .slice(0, 3)
      .map((w) => (toKk ? w.translation : w.term));

    questions.push({
      id: `v${i}`,
      kind: toKk ? "vocab-to-kk" : "vocab-to-en",
      prompt: toKk ? word.term : word.translation,
      term: toKk ? word.term : undefined,
      options: shuffle([correct, ...wrongOptions]),
      answer: correct,
      lang,
    });
  });

  return questions;
}

// ── Грамматика жаттығу (қатені тап / дұрысын таңда) ──
export function generateGrammarQuestions(
  level: "beginner" | "intermediate" | "advanced" | "all",
  count: number
): PracticeQuestion[] {
  // Деңгейге сай тақырыптар
  let points = grammarPoints;
  if (level !== "all") {
    points = grammarPoints.filter((p) => p.level === level);
  }
  if (points.length === 0) points = grammarPoints;

  const selected = shuffle(points).slice(0, count);
  const questions: PracticeQuestion[] = [];

  selected.forEach((point, i) => {
    // "Дұрысын таңда" жаттығуы (қате vs дұрыс)
    const correct = point.example.right;
    const wrong = point.example.wrong;

    // Тағы 2 жалған нұсқа (басқа тақырыптардан)
    const otherWrongs = shuffle(grammarPoints.filter((p) => p.id !== point.id))
      .slice(0, 2)
      .map((p) => p.example.wrong);

    questions.push({
      id: `g${i}`,
      kind: "grammar-correct",
      prompt: `${point.topic}: Choose the correct sentence`,
      promptKk: `${point.topic}: Дұрыс сөйлемді таңдаңыз`,
      options: shuffle([correct, wrong, ...otherWrongs]),
      answer: correct,
      explanation: point.miniExplanation,
      lang: "en",
    });
  });

  return questions;
}

// ── Аралас жаттығу ──
export function generateMixedQuestions(
  lang: LearnLang,
  count: number,
  userCards: VocabCard[] = []
): PracticeQuestion[] {
  const half = Math.ceil(count / 2);
  const vocab = generateVocabQuestions(lang, half, userCards);
  const grammar = lang === "en" ? generateGrammarQuestions("all", count - half) : [];
  // Қытай үшін грамматика жоқ — тек сөздік
  const combined = lang === "en" ? [...vocab, ...grammar] : generateVocabQuestions(lang, count, userCards);
  return shuffle(combined);
}

// Жаттығу режимдері (хаб үшін)
export interface PracticeMode {
  id: string;
  titleKk: string;
  titleEn: string;
  descKk: string;
  descEn: string;
  icon: string;
  color: string;
  enLonly?: boolean; // тек ағылшын
}

export const practiceModes: PracticeMode[] = [
  {
    id: "vocab",
    titleKk: "Сөздік жаттығу",
    titleEn: "Vocabulary",
    descKk: "Білген сөздеріңізді бекітіңіз",
    descEn: "Reinforce your vocabulary",
    icon: "BookOpen",
    color: "accent-green",
  },
  {
    id: "grammar",
    titleKk: "Грамматика",
    titleEn: "Grammar",
    descKk: "Дұрыс сөйлемді табыңыз",
    descEn: "Find the correct sentence",
    icon: "FileText",
    color: "accent-purple",
    enLonly: true,
  },
  {
    id: "mixed",
    titleKk: "Аралас жаттығу",
    titleEn: "Mixed Practice",
    descKk: "Сөздік пен грамматика бірге",
    descEn: "Vocabulary and grammar together",
    icon: "Shuffle",
    color: "accent-blue",
  },
  {
    id: "srs",
    titleKk: "Қайталау (SRS)",
    titleEn: "Review (SRS)",
    descKk: "Ұмытуға жақын сөздерді қайталаңыз",
    descEn: "Review words you're about to forget",
    icon: "RotateCcw",
    color: "accent-gold",
  },
];
