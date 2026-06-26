// filepath: src/store/vocabStore.ts
// Сөздік қоры — карталарды сақтайды (localStorage, кейін Firebase).
// React hook арқылы қолданылады.

import { useState, useEffect, useCallback } from "react";
import type { VocabCard, ReviewResult } from "@/types/vocabulary";
import { createCard, applyReview } from "@/lib/srs";
import { vocabSeed } from "@/data/vocabSeed";

const STORAGE_KEY = "linguafast_vocab";

// Бастапқы сөздік қоры — толық база (ағылшын + қытай, тақырыптармен)
function seedCards(): VocabCard[] {
  return vocabSeed.map((w) => createCard({
    lang: w.lang,
    term: w.term,
    translation: w.translation,
    phonetic: w.phonetic,
    partOfSpeech: w.partOfSpeech,
    example: w.example,
    tags: w.tags,
    source: "starter",
  }));
}

function loadCards(): VocabCard[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  // Алғаш рет — демо карталар
  const seeded = seedCards();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
  return seeded;
}

function saveCards(cards: VocabCard[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
  } catch { /* ignore */ }
}

// Сөздік hook
export function useVocab() {
  const [cards, setCards] = useState<VocabCard[]>([]);

  useEffect(() => {
    setCards(loadCards());
  }, []);

  // Карталарды жаңарту әрі сақтау
  const update = useCallback((next: VocabCard[]) => {
    setCards(next);
    saveCards(next);
  }, []);

  // Жаңа сөз қосу
  const addCard = useCallback((data: Pick<VocabCard, "lang" | "term" | "translation"> & Partial<VocabCard>) => {
    setCards((prev) => {
      const next = [...prev, createCard(data)];
      saveCards(next);
      return next;
    });
  }, []);

  // Сөзді өшіру
  const removeCard = useCallback((id: string) => {
    setCards((prev) => {
      const next = prev.filter((c) => c.id !== id);
      saveCards(next);
      return next;
    });
  }, []);

  // Қайталау нәтижесін қолдану (SRS)
  const reviewCard = useCallback((id: string, result: ReviewResult) => {
    setCards((prev) => {
      const next = prev.map((c) => (c.id === id ? applyReview(c, result) : c));
      saveCards(next);
      return next;
    });
  }, []);

  return { cards, update, addCard, removeCard, reviewCard };
}
