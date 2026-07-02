// filepath: src/store/cinemaProgressStore.ts
// LinguaCinema сабақ прогресі — көрілген %, тест нәтижесі, аяқталу.
// localStorage-та сақталады. Видео 85%+ көрілсе немесе тест тапсырылса — аяқталды.

import { useState, useCallback } from "react";
import type { LessonProgress } from "@/types/cinema";

const STORAGE_KEY = "linguafast_cinema_progress";
const COMPLETE_WATCH_PCT = 85;

type ProgressMap = Record<string, LessonProgress>;

function load(): ProgressMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* */ }
  return {};
}

function save(map: ProgressMap) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch { /* */ }
}

export function useCinemaProgress() {
  const [progressMap, setProgressMap] = useState<ProgressMap>(load);

  const getProgress = useCallback(
    (lessonId: string): LessonProgress | undefined => progressMap[lessonId],
    [progressMap]
  );

  // Көрілген пайызды жаңарту (тек өссе)
  const updateWatched = useCallback((lessonId: string, percent: number) => {
    setProgressMap((prev) => {
      const cur = prev[lessonId];
      const pct = Math.min(100, Math.round(percent));
      if (cur && pct <= cur.watchedPercent) return prev;
      const next: ProgressMap = {
        ...prev,
        [lessonId]: {
          lessonId,
          watchedPercent: pct,
          completed: (cur?.completed || false) || pct >= COMPLETE_WATCH_PCT,
          quizScore: cur?.quizScore,
          wordsLearned: cur?.wordsLearned || 0,
          lastWatched: Date.now(),
        },
      };
      save(next);
      return next;
    });
  }, []);

  // Тест нәтижесін сақтау. true қайтарса — сабақ АЛҒАШ РЕТ аяқталды (XP беру үшін)
  const setQuizScore = useCallback((lessonId: string, score: number): boolean => {
    const passed = score >= 60;
    const firstComplete = passed && !load()[lessonId]?.completed;
    setProgressMap((prev) => {
      const cur = prev[lessonId];
      const next: ProgressMap = {
        ...prev,
        [lessonId]: {
          lessonId,
          watchedPercent: cur?.watchedPercent || 0,
          completed: (cur?.completed || false) || passed,
          quizScore: Math.max(score, cur?.quizScore || 0),
          wordsLearned: cur?.wordsLearned || 0,
          lastWatched: Date.now(),
        },
      };
      save(next);
      return next;
    });
    return firstComplete;
  }, []);

  // Видео өшірілгенде прогресін де тазалау
  const removeProgress = useCallback((lessonId: string) => {
    setProgressMap((prev) => {
      if (!prev[lessonId]) return prev;
      const next = { ...prev };
      delete next[lessonId];
      save(next);
      return next;
    });
  }, []);

  return { getProgress, updateWatched, setQuizScore, removeProgress };
}
