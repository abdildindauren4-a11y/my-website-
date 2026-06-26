// filepath: src/lib/dictionary.ts
// Үлкен сөздік қоры — іздеу үшін (168,000+ сөз қолжетімді).
// Жиі сөздер бірден жүктеледі (16,000). Толық база — болашақта бөлек жүктеу.
//
// Дереккөздер:
//   Қытай: CC-CEDICT (ашық лицензия, 124,000 жазба)
//   Ағылшын: WordNet (Princeton, 44,000 сөз) + Google frequency

import enCommon from "@/data/dict/english_common.json";
import zhCommon from "@/data/dict/chinese_common.json";

// Сөздік жазбасы (ықшам формат)
export interface DictEntry {
  t: string;        // сөз (term)
  d: string;        // анықтама (definition)
  p?: string;       // пиньинь (қытай үшін)
  pos?: string;     // сөз табы (ағылшын үшін)
}

// Жүктелген базалар
const english = enCommon as DictEntry[];
const chinese = zhCommon as DictEntry[];

// Жалпы статистика
export const dictStats = {
  english: english.length,
  chinese: chinese.length,
  total: english.length + chinese.length,
  // Толық қолжетімді (болашақта)
  fullEnglish: 44464,
  fullChinese: 123799,
  fullTotal: 168263,
};

// Сөздіктен іздеу (тіл бойынша)
export function searchDictionary(
  query: string,
  lang: "en" | "zh",
  limit = 50
): DictEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const source = lang === "en" ? english : chinese;
  const results: DictEntry[] = [];

  // 1) Дәл басталатындар (жоғары басымдық)
  for (const entry of source) {
    if (results.length >= limit) break;
    const term = entry.t.toLowerCase();
    if (term.startsWith(q)) results.push(entry);
  }

  // 2) Ішінде кездесетіндер (анықтамада да)
  if (results.length < limit) {
    for (const entry of source) {
      if (results.length >= limit) break;
      const term = entry.t.toLowerCase();
      if (!term.startsWith(q) && (term.includes(q) || entry.d.toLowerCase().includes(q))) {
        results.push(entry);
      }
    }
  }

  return results;
}

// Нақты сөзді табу (карта қосу үшін)
export function lookupWord(term: string, lang: "en" | "zh"): DictEntry | null {
  const source = lang === "en" ? english : chinese;
  const found = source.find((e) => e.t.toLowerCase() === term.toLowerCase());
  return found || null;
}

// ── Толық база (168,000 сөз) — қажет болғанда fetch арқылы жүктеледі ──
let fullEn: DictEntry[] | null = null;
let fullZh: DictEntry[] | null = null;

// Толық базаны жүктеу (бір рет)
export async function loadFullDictionary(lang: "en" | "zh"): Promise<DictEntry[]> {
  if (lang === "en" && fullEn) return fullEn;
  if (lang === "zh" && fullZh) return fullZh;

  const url = lang === "en" ? "./dict/english_full.json" : "./dict/chinese_full.json";
  try {
    const res = await fetch(url);
    const data = (await res.json()) as DictEntry[];
    if (lang === "en") fullEn = data;
    else fullZh = data;
    return data;
  } catch {
    // Сәтсіз болса — жиі базаны қайтарамыз
    return lang === "en" ? english : chinese;
  }
}

// Толық базадан іздеу (асинхронды — 168,000 сөз)
export async function searchFullDictionary(
  query: string,
  lang: "en" | "zh",
  limit = 50
): Promise<DictEntry[]> {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const source = await loadFullDictionary(lang);

  const starts: DictEntry[] = [];
  const includes: DictEntry[] = [];
  for (const entry of source) {
    if (starts.length >= limit) break;
    const term = entry.t.toLowerCase();
    if (term.startsWith(q)) starts.push(entry);
    else if (includes.length < limit && term.includes(q)) includes.push(entry);
  }
  return [...starts, ...includes].slice(0, limit);
}

export function isFullLoaded(lang: "en" | "zh"): boolean {
  return lang === "en" ? fullEn !== null : fullZh !== null;
}
