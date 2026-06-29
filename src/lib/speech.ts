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

// Тілге сай ең жақсы дауысты табу
function pickVoice(lang: "en" | "zh"): SpeechSynthesisVoice | null {
  const voices = loadVoices();
  if (!voices.length) return null;

  // Тіл коды: en-US / zh-CN
  const langPrefix = lang === "zh" ? "zh" : "en";

  // 1) Дәл тілге сай дауыс
  const match = voices.find((v) => v.lang.toLowerCase().startsWith(langPrefix));
  if (match) return match;

  return null;
}

// Сөзді дауыстап оқу
export function speak(text: string, lang: "en" | "zh" = "en"): void {
  if (!isSpeechSupported() || !text.trim()) return;

  // Алдыңғы оқуды тоқтату (қабаттаспау үшін)
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  const voice = pickVoice(lang);
  if (voice) utterance.voice = voice;
  utterance.lang = lang === "zh" ? "zh-CN" : "en-US";

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
