// filepath: src/store/learnEvents.ts
// ОҚУ ОҚИҒАЛАРЫ ЖУРНАЛЫ — бүкіл жүйенің жүрегі (ROADMAP 0.1).
// Әрбір оқу әрекеті (сабақ, жаттығу, қайталау, ойын, кино, IELTS, чат…)
// осы бір орталық журналға жазылады. XP, серия, минут, квесттер, лига,
// статистика — БӘРІ осы бір көзден есептеледі → сандар еш жерде алшақтамайды.

export type LearnEventType =
  | "lesson"        // сабақ аяқталды
  | "exercise"      // жаттығу/практика сессиясы
  | "review"        // сөздік қайталауы (SRS)
  | "game"          // ойын аяқталды
  | "cinema-min"    // кино көру минуты
  | "quiz"          // кино/юнит тесті
  | "ielts"         // IELTS модулі (тест/жазылым/сөйлеу)
  | "chat-msg"      // чаттағы хабарлама
  | "checkpoint"    // юнит checkpoint нәтижесі
  | "quest"         // күнделікті тапсырма орындалды
  | "unit-complete"; // юнит толық аяқталды

export interface LearnEvent {
  ts: number;                     // уақыт (Date.now)
  type: LearnEventType;
  module: string;                 // қай модуль: courses/games/cinema/ielts/chat/dictionary/practice
  xp: number;                     // берілген XP (0 болуы мүмкін)
  meta?: Record<string, unknown>; // деталь: unitId, score, minutes, game…
}

const STORAGE_KEY = "linguafast_learn_events";
const MAX_EVENTS = 4000;          // журнал шексіз өспейді
const MAX_AGE_DAYS = 92;          // ~3 ай сақталады (статистика/лига жеткілікті)

// ── Ішкі күй: жадыдағы кэш + жазылушылар ──
let events: LearnEvent[] | null = null;
let version = 0;
const listeners = new Set<() => void>();

function load(): LearnEvent[] {
  if (events) return events;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    events = raw ? (JSON.parse(raw) as LearnEvent[]) : [];
  } catch {
    events = [];
  }
  return events;
}

function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events ?? []));
  } catch { /* ignore */ }
}

function notify() {
  version++;
  listeners.forEach((fn) => fn());
}

// Ескі оқиғаларды қысқарту (жасы/саны бойынша)
function prune(list: LearnEvent[]): LearnEvent[] {
  const cutoff = Date.now() - MAX_AGE_DAYS * 24 * 60 * 60 * 1000;
  let out = list.filter((e) => e.ts >= cutoff);
  if (out.length > MAX_EVENTS) out = out.slice(out.length - MAX_EVENTS);
  return out;
}

// ── Жазу API ──
export function logEvent(type: LearnEventType, module: string, xp = 0, meta?: Record<string, unknown>) {
  const list = load();
  list.push({ ts: Date.now(), type, module, xp, ...(meta ? { meta } : {}) });
  events = prune(list);
  save();
  notify();
}

// Журналды толық тазарту (профильді нөлдеу үшін)
export function clearEvents() {
  events = [];
  save();
  notify();
}

// ── Оқу API (useSyncExternalStore-ға дайын) ──
export function subscribeLearnEvents(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function getEventsVersion(): number {
  return version;
}

export function getEvents(): readonly LearnEvent[] {
  return load();
}

// ── Селекторлар (күн кілті: YYYY-MM-DD, жергілікті уақыт емес — ISO,
//    progressStore-дың бұрынғы тәртібімен бірдей) ──
export function dayKey(ts: number): string {
  return new Date(ts).toISOString().slice(0, 10);
}

export function todayKey(): string {
  return dayKey(Date.now());
}

// Барлық XP қосындысы
export function totalXp(): number {
  return load().reduce((s, e) => s + e.xp, 0);
}

// Белгілі күндегі минуттар (meta.minutes қосындысы)
export function minutesOn(day: string): number {
  return load().reduce((s, e) => {
    if (dayKey(e.ts) !== day) return s;
    const m = e.meta?.minutes;
    return s + (typeof m === "number" ? m : 0);
  }, 0);
}

// Күн → минут картасы (апталық график үшін)
export function minutesByDay(): Record<string, number> {
  const out: Record<string, number> = {};
  for (const e of load()) {
    const m = e.meta?.minutes;
    if (typeof m === "number" && m > 0) {
      const d = dayKey(e.ts);
      out[d] = (out[d] || 0) + m;
    }
  }
  return out;
}

// Түрі бойынша оқиға саны
export function countByType(type: LearnEventType): number {
  return load().filter((e) => e.type === type).length;
}

// Белсенді күндер тізімі (өсу ретімен, қайталанбайды)
export function activeDays(): string[] {
  const set = new Set<string>();
  for (const e of load()) set.add(dayKey(e.ts));
  return [...set].sort();
}
