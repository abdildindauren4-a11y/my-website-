// filepath: src/lib/geminiTTS.ts
// Студиялық сапалы дауыс — Gemini TTS (gemini-2.5-flash-preview-tts).
// Браузердің робот-дауысының орнына табиғи адам дауысын генерациялайды.
// Диалогтарда екі бөлек дауыс (әйел/ер) қолданылады.
// Нәтиже WAV болып қайтады және сессия ішінде кэштеледі.

import { getGeminiKey } from "./gemini";
import type { AudioLine } from "@/types/ielts";

const TTS_MODEL = "gemini-2.5-flash-preview-tts";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${TTS_MODEL}:generateContent`;

// Дауыстар: әйел (анық, байсалды) және ер (жылы) — IELTS стиліне сай
const FEMALE_VOICE = "Kore";
const MALE_VOICE = "Puck";
const NARRATOR_VOICE = "Charon"; // жалғыз оқушы (дәріс/монолог)

// Сессия кэші: мазмұн кілті → object URL
const audioCache = new Map<string, string>();

function cacheKey(lines: AudioLine[]): string {
  return lines.map((l) => `${l.speaker || ""}:${l.text}`).join("|");
}

// ── PCM (16-бит, 24кГц, моно) → WAV ──
function pcmToWav(pcmBase64: string, sampleRate = 24000): Blob {
  const pcm = Uint8Array.from(atob(pcmBase64), (c) => c.charCodeAt(0));
  const header = new ArrayBuffer(44);
  const dv = new DataView(header);
  const writeStr = (off: number, s: string) => { for (let i = 0; i < s.length; i++) dv.setUint8(off + i, s.charCodeAt(i)); };

  writeStr(0, "RIFF");
  dv.setUint32(4, 36 + pcm.length, true);
  writeStr(8, "WAVE");
  writeStr(12, "fmt ");
  dv.setUint32(16, 16, true);          // fmt блок өлшемі
  dv.setUint16(20, 1, true);           // PCM
  dv.setUint16(22, 1, true);           // моно
  dv.setUint32(24, sampleRate, true);
  dv.setUint32(28, sampleRate * 2, true); // байт/сек
  dv.setUint16(32, 2, true);           // блок өлшемі
  dv.setUint16(34, 16, true);          // бит/үлгі
  writeStr(36, "data");
  dv.setUint32(40, pcm.length, true);

  return new Blob([header, pcm], { type: "audio/wav" });
}

// mimeType ішінен sample rate алу (мыс. "audio/L16;codec=pcm;rate=24000")
function rateFromMime(mime: string | undefined): number {
  const m = mime?.match(/rate=(\d+)/);
  return m ? parseInt(m[1]) : 24000;
}

export function isStudioVoiceAvailable(): boolean {
  return !!getGeminiKey();
}

// ── Жалғыз мәтінді дауысқа айналдыру (чат дауыс режимі) ──
// Тілді автоматты таниды (қазақша/ағылшынша/қытайша). WAV ArrayBuffer қайтарады.
// iOS-та браузердің speechSynthesis-і сенімсіз, сондықтан нағыз аудио қолданамыз.
export async function generateSpeech(text: string): Promise<ArrayBuffer | null> {
  const apiKey = getGeminiKey();
  const clean = text.trim();
  if (!apiKey || !clean) return null;

  try {
    const res = await fetch(`${API_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `Say this naturally in a warm, friendly voice: ${clean}` }] }],
        generationConfig: {
          responseModalities: ["AUDIO"],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: FEMALE_VOICE } } },
        },
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const part = data.candidates?.[0]?.content?.parts?.[0];
    const b64 = part?.inlineData?.data;
    if (!b64) return null;
    const wav = pcmToWav(b64, rateFromMime(part.inlineData.mimeType));
    return await wav.arrayBuffer();
  } catch {
    return null;
  }
}

// ── Бөлім аудиосын жасау ──
// Диалог: сөйлеушілерге бөлек дауыс. Монолог: бір дауыс.
// Сәтті болса — ойнатуға дайын object URL, қате болса null.
export async function generateSectionAudio(lines: AudioLine[]): Promise<string | null> {
  const key = cacheKey(lines);
  const cached = audioCache.get(key);
  if (cached) return cached;

  const apiKey = getGeminiKey();
  if (!apiKey || lines.length === 0) return null;

  // Бірегей сөйлеушілер (диалог пе, монолог па)
  const speakers = [...new Set(lines.map((l) => l.speaker).filter(Boolean))] as string[];
  const isDialogue = speakers.length === 2;

  // Транскрипт мәтіні
  const transcript = lines
    .map((l) => (l.speaker ? `${l.speaker}: ${l.text}` : l.text))
    .join("\n");

  const speechConfig = isDialogue
    ? {
        multiSpeakerVoiceConfig: {
          speakerVoiceConfigs: [
            { speaker: speakers[0], voiceConfig: { prebuiltVoiceConfig: { voiceName: FEMALE_VOICE } } },
            { speaker: speakers[1], voiceConfig: { prebuiltVoiceConfig: { voiceName: MALE_VOICE } } },
          ],
        },
      }
    : { voiceConfig: { prebuiltVoiceConfig: { voiceName: NARRATOR_VOICE } } };

  const prompt = isDialogue
    ? `TTS the following conversation between ${speakers[0]} and ${speakers[1]}. Speak naturally at a calm, clear pace suitable for an English listening exam:\n\n${transcript}`
    : `Read the following aloud naturally at a calm, clear pace suitable for an English listening exam:\n\n${transcript}`;

  try {
    const res = await fetch(`${API_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseModalities: ["AUDIO"],
          speechConfig,
        },
      }),
    });
    if (!res.ok) return null;

    const data = await res.json();
    const part = data.candidates?.[0]?.content?.parts?.[0];
    const b64 = part?.inlineData?.data;
    if (!b64) return null;

    const wav = pcmToWav(b64, rateFromMime(part.inlineData.mimeType));
    const url = URL.createObjectURL(wav);
    audioCache.set(key, url);
    return url;
  } catch {
    return null;
  }
}
