// filepath: src/lib/speech.ts
// Дыбыс (Text-to-Speech) — сөздерді дауыстап оқу.
// Web Speech API қолданады (браузерде бар, тегін, орнатудың қажеті жоқ).
// Ағылшын да, қытай да оқиды.

// Браузер дыбысты қолдай ма
export function isSpeechSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

// Қол жетімді дауыстарды алу (кейде кешігіп жүктеледі)
let cachedVoices: SpeechSynthesisVoice[] = [];
function loadVoices(): SpeechSynthesisVoice[] {
  if (!isSpeechSupported()) return [];
  const voices = window.speechSynthesis.getVoices();
  if (voices.length) cachedVoices = voices;
  return cachedVoices;
}

// Дауыстар жүктелгенде кэштеу
if (isSpeechSupported()) {
  loadVoices();
  window.speechSynthesis.onvoiceschanged = loadVoices;
}

// Жағымсыз/новелти дауыстар — ешқашан таңдалмайды
const BAD_VOICES = /albert|bad news|bahh|bells|boing|bubbles|cellos|wobble|jester|organ|trinoids|whisper|zarvox|superstar|junior|ralph|fred|kathy|deranged|hysterical|pipe|good news|grandma|grandpa|googoo|novelty/i;

// Сапалы дауыстар — басымдық реті (жоғарғысы бірінші)
const PREFERRED_EN = [
  "google us english", "google uk english female", "google uk english male",
  "microsoft aria", "microsoft jenny", "microsoft guy", "microsoft michelle", "microsoft sonia",
  "samantha", "ava", "zoe", "allison", "susan", "daniel", "karen", "moira", "tessa", "serena", "aaron", "nicky", "alex",
];
const PREFERRED_ZH = ["google 普通话", "tingting", "婷婷", "meijia", "microsoft xiaoxiao", "microsoft yunxi", "sinji"];

// Тілге сай ең САПАЛЫ дауысты табу (робот-дауыстардан қашу)
export function pickBestVoice(lang: "en" | "zh"): SpeechSynthesisVoice | null {
  const voices = loadVoices();
  if (!voices.length) return null;

  const langPrefix = lang === "zh" ? "zh" : "en";
  const candidates = voices.filter((v) => v.lang.toLowerCase().startsWith(langPrefix) && !BAD_VOICES.test(v.name));
  if (!candidates.length) return voices.find((v) => v.lang.toLowerCase().startsWith(langPrefix)) || null;

  const preferred = lang === "zh" ? PREFERRED_ZH : PREFERRED_EN;
  const score = (v: SpeechSynthesisVoice): number => {
    const n = v.name.toLowerCase();
    const idx = preferred.findIndex((p) => n.includes(p));
    let s = idx >= 0 ? 100 - idx : 0;
    // Табиғи/премиум/нейрондық дауыстарға бонус
    if (/natural|neural|premium|enhanced/i.test(v.name)) s += 20;
    if (!v.localService) s += 5; // бұлттық дауыстар әдетте сапалырақ
    return s;
  };

  return [...candidates].sort((a, b) => score(b) - score(a))[0];
}

// Сөзді дауыстап оқу
export function speak(text: string, lang: "en" | "zh" = "en"): void {
  if (!isSpeechSupported() || !text.trim()) return;

  // Алдыңғы оқуды тоқтату (қабаттаспау үшін)
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  const voice = pickBestVoice(lang);
  if (voice) {
    utterance.voice = voice;
    utterance.lang = voice.lang;
  } else {
    utterance.lang = lang === "zh" ? "zh-CN" : "en-US";
  }

  // Жылдамдық: қытай сәл баяу (иероглиф анық естілуі үшін)
  utterance.rate = lang === "zh" ? 0.85 : 0.9;
  utterance.pitch = 1.0;
  utterance.volume = 1.0;

  window.speechSynthesis.speak(utterance);
}

// Оқуды тоқтату
export function stopSpeaking(): void {
  if (isSpeechSupported()) window.speechSynthesis.cancel();
}

// ── Курс мысалдарын оқу ──
// Қытай курсында мәтін аралас келеді: "mā 妈 (1st) = mother".
// Пиньинді (латын) қытай/ағылшын дауысымен оқу мүлде қате естіледі,
// сондықтан ИЕРОГЛИФ бөлігін ғана қытай дауысымен оқимыз.
export function speakLesson(text: string, courseLang: "en" | "zh"): void {
  if (courseLang === "zh") {
    const hanzi = text.match(/[一-鿿㐀-䶿]+/g);
    if (hanzi && hanzi.length > 0) {
      speak(hanzi.join("，"), "zh"); // тек қытайша бөлігі — дұрыс айтылым
      return;
    }
    speak(text, "zh");
    return;
  }
  speak(text, "en");
}

// ═══════════════════════════════════════════
// КӨПТІЛДІ ОҚУ — мәтінді тілдік бөліктерге бөліп,
// әрқайсысын өз дауысымен оқиды:
// қазақша (кириллица) → қазақ/орыс дауысы,
// ағылшынша → ағылшын дауысы, қытайша → қытай дауысы.
// ═══════════════════════════════════════════

type Script = "latin" | "cyrillic" | "han";

function charScript(ch: string): Script | null {
  if (/[一-鿿㐀-䶿]/.test(ch)) return "han";
  if (/[Ѐ-ӿ]/.test(ch)) return "cyrillic";
  if (/[a-zA-Z]/.test(ch)) return "latin";
  return null; // тыныс белгісі/сан — ағымдағы бөлікке жалғасады
}

// Мәтінді тілдік бөліктерге бөлу
export function splitByScript(text: string): { script: Script; text: string }[] {
  const segments: { script: Script; text: string }[] = [];
  let current: Script | null = null;
  let buf = "";

  for (const ch of text) {
    const s = charScript(ch);
    if (s === null || s === current) {
      buf += ch;
    } else {
      if (current !== null && buf.trim()) segments.push({ script: current, text: buf.trim() });
      // Жаңа бөлік — бейтарап таңбалар алдыңғысында қалады
      current = s;
      buf = ch;
    }
    if (current === null && s !== null) current = s;
  }
  if (current !== null && buf.trim()) segments.push({ script: current, text: buf.trim() });

  // Тым қысқа бөліктерді (1-2 таңба) көршісіне қосу — үзік-үзік оқымау үшін
  const merged: { script: Script; text: string }[] = [];
  for (const seg of segments) {
    const prev = merged[merged.length - 1];
    if (prev && (seg.text.length <= 2 || prev.script === seg.script)) {
      prev.text += " " + seg.text;
    } else {
      merged.push({ ...seg });
    }
  }
  return merged;
}

// Кириллица (қазақша) үшін дауыс: алдымен қазақ, сосын орыс дауысы
function pickCyrillicVoice(): SpeechSynthesisVoice | null {
  const voices = loadVoices();
  if (!voices.length) return null;
  const kk = voices.find((v) => v.lang.toLowerCase().startsWith("kk") || /kazakh/i.test(v.name));
  if (kk) return kk;
  const ruPreferred = ["google русский", "milena", "katya", "microsoft svetlana", "microsoft dmitry", "yuri"];
  const ru = voices.filter((v) => v.lang.toLowerCase().startsWith("ru") && !BAD_VOICES.test(v.name));
  if (!ru.length) return null;
  return [...ru].sort((a, b) => {
    const ai = ruPreferred.findIndex((p) => a.name.toLowerCase().includes(p));
    const bi = ruPreferred.findIndex((p) => b.name.toLowerCase().includes(p));
    return (bi >= 0 ? 100 - bi : 0) - (ai >= 0 ? 100 - ai : 0);
  })[0];
}

// Аралас тілді мәтінді мәнерлеп оқу — әр бөлік өз дауысымен.
// speechSynthesis кезекті өзі басқарады (бөліктер бірінен соң бірі оқылады).
export function speakSmart(text: string): void {
  if (!isSpeechSupported() || !text.trim()) return;
  window.speechSynthesis.cancel();

  const segments = splitByScript(text);
  for (const seg of segments) {
    const u = new SpeechSynthesisUtterance(seg.text);
    if (seg.script === "han") {
      const v = pickBestVoice("zh");
      if (v) { u.voice = v; u.lang = v.lang; } else u.lang = "zh-CN";
      u.rate = 0.85;
    } else if (seg.script === "cyrillic") {
      const v = pickCyrillicVoice();
      if (v) { u.voice = v; u.lang = v.lang; } else u.lang = "ru-RU";
      u.rate = 0.95;
    } else {
      const v = pickBestVoice("en");
      if (v) { u.voice = v; u.lang = v.lang; } else u.lang = "en-US";
      u.rate = 0.95;
    }
    u.pitch = 1.0;
    u.volume = 1.0;
    window.speechSynthesis.speak(u); // кезекке қосылады
  }
}
