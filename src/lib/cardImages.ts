// filepath: src/lib/cardImages.ts
// Карточка суреттері — үш қабатты жүйе:
//   1) Сайт кодындағы суреттер: public/cards/{lang}-{slug}.jpg — репозиторийге
//      қосылған сурет БАРЛЫҚ қолданушыға тұрақты көрінеді.
//   2) Құрылғы қоймасы (IndexedDB): Gemini жасаған сурет осында сақталады —
//      қайта кірген сайын қайта жасалмайды, квота үнемделеді.
//   3) Gemini генерациясы: сурет жоқ болса, «Сурет жасау» батырмасы постер
//      стиліндегі (жұмсақ 3D-мультяш) сурет жасайды.
// Осылай уақыт өте келе карталар суреттермен «толып», сайт әсемделе береді.

import { getGeminiKey } from "./gemini";

// Модельдер кезекпен тексеріледі (кілтке қайсысы қолжетімді болса — сол)
const IMAGE_MODELS = [
  "gemini-2.5-flash-image",      // Nano Banana (кең таралған)
  "gemini-3.1-flash-lite-image", // Nano Banana 2 Lite (жаңа, жеңіл)
  "gemini-3.1-flash-image",      // Nano Banana 2
];
const IMG_SIZE = 384; // сақталатын өлшем (жеткілікті әрі жеңіл, ~30-60КБ)

export type ImageGenError = "quota" | "unavailable" | "general";
export type ImageGenResult = { ok: true; url: string } | { ok: false; error: ImageGenError };

// ── Сөзден қауіпсіз файл атауы ──
// Ағылшын: әріп/сан ғана. Қытай: иероглифтің Unicode коды (u4f60u597d).
export function cardSlug(term: string): string {
  const clean = term.trim().toLowerCase();
  const latin = clean.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  if (latin.length >= 2) return latin;
  return [...clean].map((c) => "u" + c.codePointAt(0)!.toString(16)).join("");
}

const keyOf = (term: string, lang: string) => `${lang}:${term.trim().toLowerCase()}`;

// ═══════════ IndexedDB қоймасы ═══════════
const DB_NAME = "linguafast";
const STORE = "cardImages";

function openDB(): Promise<IDBDatabase | null> {
  return new Promise((resolve) => {
    try {
      const req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = () => {
        if (!req.result.objectStoreNames.contains(STORE)) {
          req.result.createObjectStore(STORE);
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

async function idbGet(key: string): Promise<Blob | null> {
  const db = await openDB();
  if (!db) return null;
  return new Promise((resolve) => {
    const tx = db.transaction(STORE, "readonly").objectStore(STORE).get(key);
    tx.onsuccess = () => resolve(tx.result instanceof Blob ? tx.result : null);
    tx.onerror = () => resolve(null);
  });
}

async function idbSet(key: string, blob: Blob): Promise<void> {
  const db = await openDB();
  if (!db) return;
  return new Promise((resolve) => {
    const tx = db.transaction(STORE, "readwrite").objectStore(STORE).put(blob, key);
    tx.onsuccess = () => resolve();
    tx.onerror = () => resolve();
  });
}

async function idbDelete(key: string): Promise<void> {
  const db = await openDB();
  if (!db) return;
  return new Promise((resolve) => {
    const tx = db.transaction(STORE, "readwrite").objectStore(STORE).delete(key);
    tx.onsuccess = () => resolve();
    tx.onerror = () => resolve();
  });
}

// Сессия ішіндегі object URL кэші (қайта жасамау үшін)
const urlCache = new Map<string, string | null>();

// ── Репо суретін тексеру ──
// Ескерту: SPA rewrite бәріне 200 қайтарады, сондықтан статусқа сенбей,
// нағыз сурет ретінде жүктелетінін Image() арқылы тексереміз.
function tryRepoImage(term: string, lang: string): Promise<string | null> {
  return new Promise((resolve) => {
    const url = `/cards/${lang}-${cardSlug(term)}.jpg`;
    const img = new Image();
    img.onload = () => resolve(url);
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

// ═══════════ Сақталған суретті алу ═══════════
// Репо → IndexedDB → null (жоқ болса UI «жасау» батырмасын көрсетеді)
export async function getCardImage(term: string, lang: string): Promise<string | null> {
  const key = keyOf(term, lang);
  if (urlCache.has(key)) return urlCache.get(key)!;

  // 1) Сайт кодындағы сурет (барлығына ортақ)
  const repoUrl = await tryRepoImage(term, lang);
  if (repoUrl) {
    urlCache.set(key, repoUrl);
    return repoUrl;
  }

  // 2) Құрылғыда сақталған (бұрын генерацияланған)
  const blob = await idbGet(key);
  if (blob) {
    const url = URL.createObjectURL(blob);
    urlCache.set(key, url);
    return url;
  }

  return null;
}

// Сурет жасау әрқашан қолжетімді: Gemini кілті болса — сол,
// болмаса/лимит болса — тегін қосалқы генератор (Pollinations, кілтсіз).
export function canGenerateImages(): boolean {
  return true;
}

// ── Ұнамаған суретті өшіру ──
// Құрылғы қоймасынан жойылады; кейін қайта жасауға болады.
export async function deleteCardImage(term: string, lang: string): Promise<void> {
  const key = keyOf(term, lang);
  const url = urlCache.get(key);
  if (url && url.startsWith("blob:")) URL.revokeObjectURL(url);
  urlCache.delete(key);
  await idbDelete(key);
}

// ── base64 суретті кішірейтіп, жеңіл JPEG-ке айналдыру ──
function downscale(base64: string, mime: string): Promise<Blob | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = IMG_SIZE;
      canvas.height = IMG_SIZE;
      const ctx = canvas.getContext("2d");
      if (!ctx) { resolve(null); return; }
      // Ортасынан шаршы қиып, толтыра саламыз
      const side = Math.min(img.width, img.height);
      const sx = (img.width - side) / 2;
      const sy = (img.height - side) / 2;
      ctx.drawImage(img, sx, sy, side, side, 0, 0, IMG_SIZE, IMG_SIZE);
      canvas.toBlob((b) => resolve(b), "image/jpeg", 0.85);
    };
    img.onerror = () => resolve(null);
    img.src = `data:${mime};base64,${base64}`;
  });
}

// Бір модельмен сурет жасап көру
async function tryModel(model: string, apiKey: string, prompt: string): Promise<
  { ok: true; base64: string; mime: string } | { ok: false; status: number }
> {
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseModalities: ["TEXT", "IMAGE"] },
        }),
      }
    );
    if (!res.ok) return { ok: false, status: res.status };
    const data = await res.json();
    const parts: any[] = data.candidates?.[0]?.content?.parts || [];
    const imgPart = parts.find((p) => p.inlineData?.data);
    if (!imgPart) return { ok: false, status: 500 };
    return { ok: true, base64: imgPart.inlineData.data, mime: imgPart.inlineData.mimeType || "image/png" };
  } catch {
    return { ok: false, status: 0 };
  }
}

// ── Қосалқы ТЕГІН генератор (Pollinations.ai — кілт керек емес) ──
// Gemini сурет модельдері тегін тарифте жабық болуы мүмкін (жаңа кілтте де 429).
// Бұл қызмет кілтсіз, тікелей суреттің өзін қайтарады.
async function tryPollinations(prompt: string): Promise<Blob | null> {
  try {
    const url =
      "https://image.pollinations.ai/prompt/" +
      encodeURIComponent(prompt) +
      "?width=512&height=512&nologo=true";
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 60000); // генерация 10-40 сек алуы мүмкін
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) return null;
    const blob = await res.blob();
    return blob.type.startsWith("image/") ? blob : null;
  } catch {
    return null;
  }
}

// Blob-ты кішірейту (canvas арқылы) — сақтауға жеңіл болуы үшін
function downscaleBlob(blob: Blob): Promise<Blob | null> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement("canvas");
      canvas.width = IMG_SIZE;
      canvas.height = IMG_SIZE;
      const ctx = canvas.getContext("2d");
      if (!ctx) { resolve(blob); return; }
      const side = Math.min(img.width, img.height);
      ctx.drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, IMG_SIZE, IMG_SIZE);
      canvas.toBlob((b) => resolve(b || blob), "image/jpeg", 0.85);
    };
    img.onerror = () => { URL.revokeObjectURL(url); resolve(blob); };
    img.src = url;
  });
}

// ═══════════ Сурет жасау ═══════════
// Постер-стилі: жұмсақ 3D-мультяш, ашық пастель фон (сайттың безендіру үлгісіне сай).
// Тәртібі: Gemini модельдері (кілт болса) → тегін Pollinations → қате.
export async function generateCardImage(
  term: string,
  translation: string,
  lang: string
): Promise<ImageGenResult> {
  const meaningHint = translation ? ` (its meaning: "${translation}")` : "";
  // Абстракт сөздерде (use, find, think…) сөздің жазуын емес, МАҒЫНАСЫН
  // көрсететін көрініс сұраймыз. Фон — таза ақ (картаға сіңіп кетуі үшін).
  const prompt =
    `Beautiful 3D Disney-Pixar animation style illustration for a children's language flashcard. ` +
    `Depict the MEANING of the word "${term}"${meaningHint} as ONE simple, concrete scene a child instantly understands. ` +
    `If the word is abstract or a verb (like "use", "find", "think"), show a cute expressive character clearly PERFORMING that action with an object. ` +
    `Style: gorgeous Disney-Pixar 3D render, soft cinematic lighting, adorable big-eyed character, vibrant colors, high quality. ` +
    `CRITICAL: subject isolated on a PURE WHITE background, no frame, no border, no ground shadow box. ` +
    `Absolutely NO text, NO letters, NO numbers, NO words anywhere in the image.`;

  const key = keyOf(term, lang);
  const save = async (blob: Blob): Promise<ImageGenResult> => {
    await idbSet(key, blob);
    const url = URL.createObjectURL(blob);
    urlCache.set(key, url);
    return { ok: true, url };
  };

  // 1) Gemini (кілт болса) — стиль дәлірек
  const apiKey = getGeminiKey();
  if (apiKey) {
    for (const model of IMAGE_MODELS) {
      const r = await tryModel(model, apiKey, prompt);
      if (r.ok) {
        const blob = await downscale(r.base64, r.mime);
        if (blob) return save(blob);
      }
      // 429/404/400 — келесі модель, соңында тегін генераторға өтеміз
    }
  }

  // 2) Тегін қосалқы генератор (кілтсіз жұмыс істейді)
  const pBlob = await tryPollinations(prompt);
  if (pBlob) {
    const small = await downscaleBlob(pBlob);
    if (small) return save(small);
  }

  return { ok: false, error: "general" };
}
