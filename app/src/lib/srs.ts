// filepath: src/lib/srs.ts
// SRS (Spaced Repetition System) алгоритмі.
// Ғылыми негізделген — SuperMemo/Anki принципі.
// Дұрыс жауап → интервал ұзарады. Қате → қысқарады.
// Бұл — ұмытудың алдын алудың ең тиімді әдісі (Ebbinghaus forgetting curve).

import type { VocabCard, ReviewResult, SrsLevel, VocabStats } from "@/types/vocabulary";

const DAY = 24 * 60 * 60 * 1000; // бір күн (мс)

// Әр деңгейдегі қайталау интервалы (күнмен)
// Деңгей: 0(жаңа) 1   2   3    4     5
const INTERVALS = [0, 1, 3, 7, 16, 35]; // күн

// Қайталау нәтижесіне қарай жаңа деңгей мен интервалды есептеу
export function calculateNextReview(
  card: VocabCard,
  result: ReviewResult
): { srsLevel: SrsLevel; nextReview: number; correct: boolean } {
  const now = Date.now();
  let level = card.srsLevel;
  let correct = true;

  switch (result) {
    case "again": // мүлдем білмеді — басына қайтару
      level = 0;
      correct = false;
      // 10 минуттан кейін қайта көрсету
      return { srsLevel: 0, nextReview: now + 10 * 60 * 1000, correct };

    case "hard": // қиын болды — деңгей сол қалады немесе сәл артады
      level = Math.min(5, Math.max(1, level)) as SrsLevel;
      break;

    case "good": // дұрыс — келесі деңгейге
      level = Math.min(5, level + 1) as SrsLevel;
      break;

    case "easy": // оңай — екі деңгей секіру
      level = Math.min(5, level + 2) as SrsLevel;
      break;
  }

  const intervalDays = INTERVALS[level] || 1;
  const nextReview = now + intervalDays * DAY;

  return { srsLevel: level, nextReview, correct };
}

// Картаны қайталаудан кейін жаңарту
export function applyReview(card: VocabCard, result: ReviewResult): VocabCard {
  const { srsLevel, nextReview, correct } = calculateNextReview(card, result);
  return {
    ...card,
    srsLevel,
    nextReview,
    lastReview: Date.now(),
    correctCount: card.correctCount + (correct ? 1 : 0),
    wrongCount: card.wrongCount + (correct ? 0 : 1),
  };
}

// Бүгін қайталау керек карталар (nextReview өтіп кеткен)
export function getDueCards(cards: VocabCard[]): VocabCard[] {
  const now = Date.now();
  return cards
    .filter((c) => c.nextReview <= now)
    .sort((a, b) => a.nextReview - b.nextReview); // ескісі бірінші
}

// Жаңа карта жасау (әдепкі SRS мәндерімен)
export function createCard(
  data: Pick<VocabCard, "lang" | "term" | "translation"> & Partial<VocabCard>
): VocabCard {
  const now = Date.now();
  return {
    id: `card-${now}-${Math.random().toString(36).slice(2, 8)}`,
    phonetic: data.phonetic,
    definition: data.definition,
    example: data.example,
    partOfSpeech: data.partOfSpeech,
    tags: data.tags || [],
    srsLevel: 0,
    nextReview: now, // бірден қайталауға дайын
    correctCount: 0,
    wrongCount: 0,
    createdAt: now,
    source: data.source || "manual",
    lang: data.lang,
    term: data.term,
    translation: data.translation,
  };
}

// Статистика есептеу
export function calcStats(cards: VocabCard[]): VocabStats {
  const now = Date.now();
  return {
    total: cards.length,
    new: cards.filter((c) => c.srsLevel === 0).length,
    learning: cards.filter((c) => c.srsLevel >= 1 && c.srsLevel <= 3).length,
    mastered: cards.filter((c) => c.srsLevel >= 4).length,
    dueToday: cards.filter((c) => c.nextReview <= now).length,
  };
}

// Меңгеру пайызы (карта үшін)
export function masteryPercent(card: VocabCard): number {
  return Math.round((card.srsLevel / 5) * 100);
}

// Келесі қайталауға дейін қанша уақыт (адам оқитын формат)
export function timeUntilReview(card: VocabCard, lang: "kk" | "en"): string {
  const now = Date.now();
  const diff = card.nextReview - now;
  if (diff <= 0) return lang === "kk" ? "қазір" : "now";

  const days = Math.ceil(diff / DAY);
  const hours = Math.ceil(diff / (60 * 60 * 1000));

  if (days >= 1) return lang === "kk" ? `${days} күн` : `${days}d`;
  return lang === "kk" ? `${hours} сағат` : `${hours}h`;
}
