// filepath: src/lib/vocabFix.ts
// Сөздік карталарын фондық түзету.
// Мәселе: сөздіктен/кинодан қосылған сөздердің "аудармасы" ағылшынша
// анықтама болып қалатын. Бұл функция сондай карталарды тауып,
// Gemini арқылы қазақшаға аударады (кэш қолданылады, кілт жоқ болса — үнсіз өтеді).

import { translateBatchToKk, getCachedKk } from "./translate";
import type { VocabCard } from "@/types/vocabulary";

const CYRILLIC = /[Ѐ-ӿ]/;

// Аудармасы қазақша емес пе (кириллица жоқ)
export function needsKazakh(card: VocabCard): boolean {
  return !CYRILLIC.test(card.translation || "");
}

// Барлық "бұзылған" карталарды түзетуге тырысу.
// Өзгеріс болса — жаңа массив, болмаса — null қайтарады.
export async function fixEnglishTranslations(cards: VocabCard[]): Promise<VocabCard[] | null> {
  const broken = cards.filter(needsKazakh);
  if (broken.length === 0) return null;

  const updates = new Map<string, string>(); // "lang:term" -> қазақша
  const keyOf = (c: { lang: string; term: string }) => `${c.lang}:${c.term.toLowerCase()}`;

  for (const lang of ["en", "zh"] as const) {
    const list = broken.filter((c) => c.lang === lang);
    if (list.length === 0) continue;

    // Алдымен кэштен
    const uncached: VocabCard[] = [];
    for (const c of list) {
      const cached = getCachedKk(c.term, lang);
      if (cached) updates.set(keyOf(c), cached);
      else uncached.push(c);
    }

    // Қалғанын Gemini-мен (бір сессияда 40-қа дейін; ағылшын анықтама — мағына нұсқауы)
    if (uncached.length > 0) {
      const batch = uncached.slice(0, 40).map((c) => ({ t: c.term, d: c.translation }));
      const map = await translateBatchToKk(batch, lang);
      for (const [term, kk] of Object.entries(map)) {
        updates.set(`${lang}:${term.toLowerCase()}`, kk);
      }
    }
  }

  if (updates.size === 0) return null;
  return cards.map((c) => {
    const kk = updates.get(keyOf(c));
    return kk && needsKazakh(c) ? { ...c, translation: kk } : c;
  });
}
