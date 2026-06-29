// filepath: src/store/progressStore.ts
// Нақты прогресс жүйесі — XP, деңгей, серия (streak), белсенділік.
// localStorage-та сақталады (Firebase кейін).
// DEMO сандарды алмастырады — енді бәрі нақты есептеледі.

import { useState, useEffect, useCallback } from "react";

export interface ProgressData {
  xp: number;                 // жалпы XP
  streakDays: number;         // қатарынан күн (серия)
  lastActiveDate: string;     // соңғы белсенді күн (YYYY-MM-DD)
  minutesToday: number;       // бүгінгі минут
  minutesDate: string;        // қай күннің минуты
  totalWordsLearned: number;  // үйренген сөз (SRS-те меңгерілген)
  lessonsCompleted: number;   // аяқталған сабақ
  // Апталық белсенділік (соңғы 7 күн минут)
  weeklyMinutes: Record<string, number>; // {YYYY-MM-DD: minutes}
}

const STORAGE_KEY = "linguafast_progress";

const DEFAULT_PROGRESS: ProgressData = {
  xp: 0,
  streakDays: 0,
  lastActiveDate: "",
  minutesToday: 0,
  minutesDate: "",
  totalWordsLearned: 0,
  lessonsCompleted: 0,
  weeklyMinutes: {},
};

// Бүгінгі күн (YYYY-MM-DD)
function today(): string {
  return new Date().toISOString().slice(0, 10);
}

// Екі күн арасындағы айырма (күнмен)
function daysBetween(date1: string, date2: string): number {
  if (!date1 || !date2) return 999;
  const d1 = new Date(date1).getTime();
  const d2 = new Date(date2).getTime();
  return Math.round((d2 - d1) / (24 * 60 * 60 * 1000));
}

// ── XP → Деңгей формуласы ──
// Әр деңгей сайын көбірек XP керек (прогрессивті).
// Деңгей N үшін: N*N*100 XP жинау керек
export function levelFromXP(xp: number): number {
  return Math.floor(Math.sqrt(xp / 100)) + 1;
}

// Келесі деңгейге дейінгі XP шегі
export function xpForLevel(level: number): number {
  return (level - 1) * (level - 1) * 100;
}

// Ағымдағы деңгейдегі прогресс (0-100%)
export function levelProgress(xp: number): { level: number; current: number; needed: number; percent: number } {
  const level = levelFromXP(xp);
  const currentLevelXP = xpForLevel(level);
  const nextLevelXP = xpForLevel(level + 1);
  const current = xp - currentLevelXP;
  const needed = nextLevelXP - currentLevelXP;
  const percent = Math.round((current / needed) * 100);
  return { level, current, needed, percent };
}

function loadProgress(): ProgressData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULT_PROGRESS, ...JSON.parse(raw) };
  } catch { /* ignore */ }
  return DEFAULT_PROGRESS;
}

function saveProgress(data: ProgressData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch { /* ignore */ }
}

// Серияны (streak) жаңарту логикасы
function updateStreak(data: ProgressData): ProgressData {
  const t = today();
  const gap = daysBetween(data.lastActiveDate, t);

  if (data.lastActiveDate === t) {
    // Бүгін бұрын белсенді болған — серия сол қалады
    return data;
  } else if (gap === 1) {
    // Кеше белсенді еді — серия +1
    return { ...data, streakDays: data.streakDays + 1, lastActiveDate: t };
  } else if (gap > 1 || !data.lastActiveDate) {
    // Үзіліс болды немесе алғаш рет — серия 1-ден басталады
    return { ...data, streakDays: 1, lastActiveDate: t };
  }
  return data;
}

// Прогресс hook
export function useProgress() {
  const [progress, setProgress] = useState<ProgressData>(DEFAULT_PROGRESS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let data = loadProgress();
    // Бүгінгі минут басқа күннен болса — нөлдеу
    if (data.minutesDate !== today()) {
      data = { ...data, minutesToday: 0, minutesDate: today() };
    }
    setProgress(data);
    setLoaded(true);
  }, []);

  // XP қосу (әрекет жасағанда)
  const addXP = useCallback((amount: number) => {
    setProgress((prev) => {
      let next = updateStreak({ ...prev, xp: prev.xp + amount });
      saveProgress(next);
      return next;
    });
  }, []);

  // Белсенділік минуттарын қосу
  const addMinutes = useCallback((mins: number) => {
    setProgress((prev) => {
      const t = today();
      const next = updateStreak({
        ...prev,
        minutesToday: (prev.minutesDate === t ? prev.minutesToday : 0) + mins,
        minutesDate: t,
        weeklyMinutes: { ...prev.weeklyMinutes, [t]: ((prev.weeklyMinutes[t] || 0) + mins) },
      });
      saveProgress(next);
      return next;
    });
  }, []);

  // Сабақ аяқталды
  const completeLesson = useCallback(() => {
    setProgress((prev) => {
      const next = updateStreak({ ...prev, lessonsCompleted: prev.lessonsCompleted + 1, xp: prev.xp + 50 });
      saveProgress(next);
      return next;
    });
  }, []);

  // Үйренген сөз санын орнату (сөздіктен синхрондау)
  const setWordsLearned = useCallback((count: number) => {
    setProgress((prev) => {
      if (prev.totalWordsLearned === count) return prev;
      const next = { ...prev, totalWordsLearned: count };
      saveProgress(next);
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    saveProgress(DEFAULT_PROGRESS);
    setProgress(DEFAULT_PROGRESS);
  }, []);

  return { progress, loaded, addXP, addMinutes, completeLesson, setWordsLearned, reset };
}
