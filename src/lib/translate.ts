// filepath: src/lib/translate.ts
// Сөздерді қазақшаға аудару — сұраныс бойынша (Gemini) + localStorage кэш.
// 168 000 сөзді алдын ала аудару мүмкін емес, сондықтан көрінген сөздер
// ғана аударылып, кэште сақталады (қайта іздегенде тегін әрі лезде).

import { getGeminiKey } from "./gemini";

const CACHE_KEY = "linguafast_kk_cache";

type Cache = Record<string, string>; // "en:word" -> "қазақша"

function loadCache(): Cache {
  try { return JSON.parse(localStorage.getItem(CACHE_KEY) || "{}"); } catch { return {}; }
}
function saveCache(c: Cache) {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(c)); } catch { /* */ }
}

const keyOf = (term: string, lang: "en" | "zh") => `${lang}:${term.toLowerCase()}`;

// Кэштен алу (болмаса null)
export function getCachedKk(term: string, lang: "en" | "zh"): string | null {
  return loadCache()[keyOf(term, lang)] || null;
}

// Батчпен аудару. entries: {t, d}. Қайтарады: {term -> қазақша}
export async function translateBatchToKk(
  entries: { t: string; d?: string }[],
  lang: "en" | "zh"
): Promise<Record<string, string>> {
  const cache = loadCache();
  const out: Record<string, string> = {};
  const need: { t: string; d?: string }[] = [];

  for (const e of entries) {
    const cached = cache[keyOf(e.t, lang)];
    if (cached) out[e.t] = cached;
    else need.push(e);
  }
  if (need.length === 0) return out;

  const apiKey = getGeminiKey();
  if (!apiKey) return out; // кілт жоқ — тек кэштегілер

  // Бір сұранымда 40-қа дейін
  const batch = need.slice(0, 40);
  const srcLangName = lang === "en" ? "English" : "Chinese";
  const list = batch.map((e, i) => `${i + 1}. ${e.t}${e.d ? ` — (${e.d.slice(0, 60)})` : ""}`).join("\n");
  const prompt = `Translate the meaning of these ${srcLangName} words into KAZAKH. Give a short, natural Kazakh translation (1-3 words) for each. Use the English hint in brackets to pick the right meaning.
Respond ONLY with a JSON array of strings, in the SAME ORDER, no numbering, no extra text. Example: ["сөз1","сөз2"].

WORDS:
${list}`;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.2, maxOutputTokens: 2000 },
        }),
      }
    );
    if (!res.ok) return out;
    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const m = text.match(/\[[\s\S]*\]/);
    if (!m) return out;
    const arr = JSON.parse(m[0]) as string[];
    batch.forEach((e, i) => {
      const kk = (arr[i] || "").trim();
      if (kk) {
        out[e.t] = kk;
        cache[keyOf(e.t, lang)] = kk;
      }
    });
    saveCache(cache);
  } catch { /* желі қатесі — тек кэш */ }

  return out;
}
