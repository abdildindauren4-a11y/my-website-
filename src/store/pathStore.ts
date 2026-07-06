// filepath: src/store/pathStore.ts
// Оқу жолының күйі (ROADMAP 0.3): юнит күйлері, ашылу ережесі,
// checkpoint нәтижелері, деңгей прогресі.
// Сақталатыны — тек ФАКТІЛЕР (checkpoint нәтижелері); күйлер (locked/active/
// completed/gold) әрқашан фактілер + placement деңгейінен ЕСЕПТЕЛЕДІ —
// learnEvents философиясымен бірдей: бір көз, алшақтамайтын сандар.

import { useCallback, useSyncExternalStore } from "react";
import { logEvent } from "@/store/learnEvents";
import { getCurriculum } from "@/data/curriculum";
import { CEFR_LEVELS, type CefrLevel } from "@/lib/cefr";
import type { CurriculumLevel, CurriculumUnit } from "@/types/curriculum";
import type { LearnLang } from "@/types/vocabulary";

export const PASS_SCORE = 80;   // checkpoint өту шегі (%)
export const GOLD_SCORE = 100;  // алтын юнит — қатесіз

export type UnitStatus = "locked" | "active" | "completed" | "gold";

// Сақталатын факт: юнит checkpoint нәтижесі
export interface CheckpointRecord {
  best: number;        // ең жақсы ұпай (%)
  attempts: number;
  passedAt?: number;   // алғаш өткен уақыт (ts)
}

interface PathData {
  checkpoints: Record<string, CheckpointRecord>; // unitId → нәтиже
}

const STORAGE_KEY = "linguafast_path";

let data: PathData | null = null;
let version = 0;
const listeners = new Set<() => void>();

function load(): PathData {
  if (data) return data;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    data = raw ? (JSON.parse(raw) as PathData) : { checkpoints: {} };
  } catch {
    data = { checkpoints: {} };
  }
  return data;
}

function save() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch { /* ignore */ }
  version++;
  listeners.forEach((fn) => fn());
}

function subscribe(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

// ── Checkpoint нәтижесін жазу (жалғыз жазу нүктесі) ──
export function recordCheckpoint(unitId: string, score: number) {
  const d = load();
  const prev = d.checkpoints[unitId];
  const passedNow = score >= PASS_SCORE;
  const firstPass = passedNow && !prev?.passedAt;

  d.checkpoints[unitId] = {
    best: Math.max(prev?.best ?? 0, score),
    attempts: (prev?.attempts ?? 0) + 1,
    passedAt: prev?.passedAt ?? (passedNow ? Date.now() : undefined),
  };
  save();

  // Орталық журналға: checkpoint оқиғасы + алғаш өткенде юнит аяқталды
  logEvent("checkpoint", "path", passedNow ? 20 : 5, { unitId, score, passed: passedNow });
  if (firstPass) logEvent("unit-complete", "path", 30, { unitId });
}

// ── Күйлерді есептеу ──
export interface PathUnit {
  unit: CurriculumUnit;
  cefr: CefrLevel;
  status: UnitStatus;
  score?: number;              // ең жақсы checkpoint ұпайы
  byPlacement?: boolean;       // placement тестімен аттап өтілген
}

export interface PathLevel {
  cefr: CefrLevel;
  hsk?: number;
  titleKk: string;
  units: PathUnit[];
  completed: number;           // өтілген юнит саны
  pct: number;                 // деңгей прогресі (%)
}

const cefrIndex = (c: CefrLevel) => CEFR_LEVELS.findIndex((l) => l.level === c);

// Толық жолды есептеу: деңгейлер + юнит күйлері + ағымдағы юнит
export function computePath(lang: LearnLang, placement?: CefrLevel): { levels: PathLevel[]; current?: PathUnit } {
  const d = load();
  const placeIdx = placement ? cefrIndex(placement) : 0;
  let activeAssigned = false;
  let current: PathUnit | undefined;

  const levels = getCurriculum(lang).map((lvl: CurriculumLevel) => {
    const skippedByPlacement = cefrIndex(lvl.cefr) < placeIdx;
    const units: PathUnit[] = lvl.units.map((unit) => {
      const rec = d.checkpoints[unit.id];
      const passed = (rec?.best ?? 0) >= PASS_SCORE;
      const gold = (rec?.best ?? 0) >= GOLD_SCORE;

      let status: UnitStatus;
      let byPlacement = false;
      if (gold) status = "gold";
      else if (passed) status = "completed";
      else if (skippedByPlacement) { status = "completed"; byPlacement = true; }
      else if (!activeAssigned) { status = "active"; activeAssigned = true; }
      else status = "locked";

      const pu: PathUnit = { unit, cefr: lvl.cefr, status, score: rec?.best, byPlacement };
      if (status === "active") current = pu;
      return pu;
    });

    const completed = units.filter((u) => u.status === "completed" || u.status === "gold").length;
    return {
      cefr: lvl.cefr, hsk: lvl.hsk, titleKk: lvl.titleKk, units,
      completed,
      pct: units.length ? Math.round((completed / units.length) * 100) : 0,
    };
  });

  return { levels, current };
}

// «Секіру тесті» өткенде: юнитке дейінгі барлық юнитті өтті деп белгілеу
export function skipToUnit(lang: LearnLang, unitId: string, placement?: CefrLevel) {
  const { levels } = computePath(lang, placement);
  const d = load();
  let changed = false;
  outer: for (const lvl of levels) {
    for (const u of lvl.units) {
      if (u.unit.id === unitId) break outer;
      if (u.status === "locked" || u.status === "active") {
        d.checkpoints[u.unit.id] = { best: PASS_SCORE, attempts: 0, passedAt: Date.now() };
        changed = true;
      }
    }
  }
  if (changed) {
    save();
    logEvent("checkpoint", "path", 10, { unitId, skip: true });
  }
}

// Жолды нөлдеу (профильді тазарту)
export function resetPath() {
  data = { checkpoints: {} };
  save();
}

// ── React hook ──
export function useLearningPath(lang: LearnLang, placement?: CefrLevel) {
  const snapshot = useSyncExternalStore(subscribe, () => version);
  void snapshot; // version өзгергенде қайта есептеу үшін
  const path = computePath(lang, placement);

  const record = useCallback((unitId: string, score: number) => {
    recordCheckpoint(unitId, score);
  }, []);

  return { ...path, record };
}
