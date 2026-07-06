// filepath: src/store/progressStore.ts
// Прогресс жүйесі — енді learnEvents журналының ҮСТІНДЕГІ КӨРІНІС (ROADMAP 1.5).
// XP, серия (streak), минуттар — бәрі орталық оқиға журналынан есептеледі.
// Ескі деректер бір реттік көшірумен (migration) baseline ретінде сақталады,
// сондықтан бұрынғы XP/серия сандары жоғалмайды.

import { useCallback, useSyncExternalStore } from "react";
import {
  logEvent, clearEvents, subscribeLearnEvents, getEventsVersion,
  totalXp, minutesByDay, countByType, activeDays, todayKey,
  type LearnEventType,
} from "@/store/learnEvents";

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

// Ескі жүйеден көшірілген бастапқы нүкте (журналға дейінгі жетістіктер)
interface ProgressBaseline {
  xp: number;
  streakDays: number;
  lastActiveDate: string;
  minutesToday: number;
  minutesDate: string;
  totalWordsLearned: number;
  lessonsCompleted: number;
  weeklyMinutes: Record<string, number>;
}

const LEGACY_KEY = "linguafast_progress";
const BASE_KEY = "linguafast_progress_base";

const EMPTY_BASE: ProgressBaseline = {
  xp: 0, streakDays: 0, lastActiveDate: "", minutesToday: 0, minutesDate: "",
  totalWordsLearned: 0, lessonsCompleted: 0, weeklyMinutes: {},
};

// ── XP → Деңгей формуласы (өзгеріссіз) ──
export function levelFromXP(xp: number): number {
  return Math.floor(Math.sqrt(xp / 100)) + 1;
}

export function xpForLevel(level: number): number {
  return (level - 1) * (level - 1) * 100;
}

export function levelProgress(xp: number): { level: number; current: number; needed: number; percent: number } {
  const level = levelFromXP(xp);
  const currentLevelXP = xpForLevel(level);
  const nextLevelXP = xpForLevel(level + 1);
  const current = xp - currentLevelXP;
  const needed = nextLevelXP - currentLevelXP;
  const percent = Math.round((current / needed) * 100);
  return { level, current, needed, percent };
}

// ── Baseline: жүктеу + бір реттік migration ──
let baseline: ProgressBaseline | null = null;
let baseVersion = 0;
const baseListeners = new Set<() => void>();

function loadBaseline(): ProgressBaseline {
  if (baseline) return baseline;
  try {
    const raw = localStorage.getItem(BASE_KEY);
    if (raw) {
      baseline = { ...EMPTY_BASE, ...(JSON.parse(raw) as Partial<ProgressBaseline>) };
      return baseline!;
    }
    // Migration: ескі progressStore деректері бар болса — baseline етеміз
    const legacy = localStorage.getItem(LEGACY_KEY);
    if (legacy) {
      baseline = { ...EMPTY_BASE, ...(JSON.parse(legacy) as Partial<ProgressBaseline>) };
      localStorage.setItem(BASE_KEY, JSON.stringify(baseline));
      return baseline!;
    }
  } catch { /* ignore */ }
  baseline = { ...EMPTY_BASE };
  return baseline;
}

function saveBaseline(next: ProgressBaseline) {
  baseline = next;
  try { localStorage.setItem(BASE_KEY, JSON.stringify(next)); } catch { /* ignore */ }
  baseVersion++;
  baseListeners.forEach((fn) => fn());
}

// Екі күн арасындағы айырма (күнмен)
function daysBetween(date1: string, date2: string): number {
  if (!date1 || !date2) return 999;
  const d1 = new Date(date1).getTime();
  const d2 = new Date(date2).getTime();
  return Math.round((d2 - d1) / (24 * 60 * 60 * 1000));
}

// ── Есептелген көрініс: baseline + журнал оқиғалары ──
function computeProgress(): ProgressData {
  const base = loadBaseline();
  const t = todayKey();

  // Серия: baseline-нан кейінгі белсенді күндерді ретімен жинақтаймыз
  let streak = base.streakDays;
  let last = base.lastActiveDate;
  for (const day of activeDays()) {
    if (last && day <= last) continue; // baseline-ға дейінгі/сол күнгі
    const gap = daysBetween(last, day);
    if (gap === 1) streak += 1;
    else streak = 1; // үзіліс немесе алғашқы белсенділік
    last = day;
  }

  // Минуттар: baseline (бүгін болса) + журналдағы minutes
  const baseToday = base.minutesDate === t ? base.minutesToday : 0;
  const weekly: Record<string, number> = { ...base.weeklyMinutes };
  const evMinutes = minutesByDay();
  for (const [day, m] of Object.entries(evMinutes)) {
    weekly[day] = (weekly[day] || 0) + m;
  }

  return {
    xp: base.xp + totalXp(),
    streakDays: streak,
    lastActiveDate: last,
    minutesToday: baseToday + (evMinutes[t] || 0),
    minutesDate: t,
    totalWordsLearned: base.totalWordsLearned,
    lessonsCompleted: base.lessonsCompleted + countByType("lesson"),
    weeklyMinutes: weekly,
  };
}

// useSyncExternalStore үшін кэштелген snapshot (референс тұрақтылығы)
let cachedSnapshot: ProgressData | null = null;
let cachedKey = "";

function getSnapshot(): ProgressData {
  const key = `${getEventsVersion()}:${baseVersion}:${todayKey()}`;
  if (!cachedSnapshot || cachedKey !== key) {
    cachedSnapshot = computeProgress();
    cachedKey = key;
  }
  return cachedSnapshot;
}

function subscribe(fn: () => void): () => void {
  const unsub = subscribeLearnEvents(fn);
  baseListeners.add(fn);
  return () => {
    unsub();
    baseListeners.delete(fn);
  };
}

// XP қосу опциялары — оқиғаның түрі/модулі (байланыс картасы үшін)
export interface XpOptions {
  type?: LearnEventType;
  module?: string;
  meta?: Record<string, unknown>;
}

// Прогресс hook — API бұрынғыдай, іші журналға жазады
export function useProgress() {
  const progress = useSyncExternalStore(subscribe, getSnapshot);

  // XP қосу (әрекет жасағанда) — журналға оқиға болып түседі
  const addXP = useCallback((amount: number, opts?: XpOptions) => {
    logEvent(opts?.type ?? "exercise", opts?.module ?? "app", amount, opts?.meta);
  }, []);

  // Белсенділік минуттарын қосу (кино және т.б.)
  const addMinutes = useCallback((mins: number, module = "cinema") => {
    logEvent("cinema-min", module, 0, { minutes: mins });
  }, []);

  // Сабақ аяқталды (+50 XP)
  const completeLesson = useCallback((meta?: Record<string, unknown>) => {
    logEvent("lesson", "courses", 50, meta);
  }, []);

  // Үйренген сөз санын орнату (сөздіктен синхрондау) — оқиға емес, күй
  const setWordsLearned = useCallback((count: number) => {
    const base = loadBaseline();
    if (base.totalWordsLearned === count) return;
    saveBaseline({ ...base, totalWordsLearned: count });
  }, []);

  const reset = useCallback(() => {
    clearEvents();
    saveBaseline({ ...EMPTY_BASE });
    try { localStorage.removeItem(LEGACY_KEY); } catch { /* ignore */ }
  }, []);

  return { progress, loaded: true, addXP, addMinutes, completeLesson, setWordsLearned, reset };
}
