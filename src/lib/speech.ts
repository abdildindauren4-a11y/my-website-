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
