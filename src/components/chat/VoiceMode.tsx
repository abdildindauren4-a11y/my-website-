// filepath: src/components/chat/VoiceMode.tsx
// Дауыспен сөйлесу режимі — ChatGPT-дегідей толық экран.
// Ортада тірі анимациялы домалақ «жан»: тыңдау → ойлану → сөйлеу күйлерін көрсетеді.
// Домалақты бассаң — тыңдай бастайды; қайта бассаң — жауап береді (дауыспен).

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/contexts/LangContext";
import { startMicRecording, type MicRecorder } from "@/lib/micRecorder";
import { transcribeAudio } from "@/lib/gemini";
import { generateSpeech } from "@/lib/geminiTTS";
import { speakSmart, stopSpeaking, unlockSpeech } from "@/lib/speech";
import { X, Mic } from "lucide-react";

type Phase = "idle" | "listening" | "thinking" | "speaking";

interface Props {
  // Хабарлама жіберіп, AI жауабын (таза мәтін) қайтарады
  onSend: (text: string) => Promise<string | null>;
  onClose: () => void;
}

// Markdown/эмодзи тазалау (дауыстап оқу үшін) — ChatPage-тегі stripMarkdown-мен бірдей
function clean(text: string): string {
  return text
    .replace(/\*\*|\*|`|_{1,2}/g, "")
    .replace(/^#+\s*/gm, "")
    .replace(/^\s*[-•]\s*/gm, "")
    .replace(/\u{FE0F}/gu, "")
    .replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2190}-\u{21FF}]/gu, "");
}

export default function VoiceMode({ onSend, onClose }: Props) {
  const { t } = useLang();
  const [phase, setPhase] = useState<Phase>("idle");
  const [level, setLevel] = useState(0);      // микрофон/дауыс амплитудасы 0..1
  const [caption, setCaption] = useState(""); // соңғы AI жауабы (титр)
  const micRef = useRef<MicRecorder | null>(null);
  const rafRef = useRef<number>(0);
  const phaseRef = useRef<Phase>("idle");
  // Web Audio — iOS-та сенімді ойнату үшін (speechSynthesis емес)
  const audioCtxRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);

  const setPh = (p: Phase) => { phaseRef.current = p; setPhase(p); };

  // AudioContext-ті нақты басу кезінде ашу/жалғастыру (iOS талабы)
  const ensureAudioCtx = () => {
    if (!audioCtxRef.current) {
      const AC = window.AudioContext || (window as any).webkitAudioContext;
      if (AC) audioCtxRef.current = new AC();
    }
    if (audioCtxRef.current?.state === "suspended") audioCtxRef.current.resume();
    return audioCtxRef.current;
  };

  // Ағымдағы ойнап жатқан аудионы тоқтату
  const stopAudio = () => {
    try { sourceRef.current?.stop(); } catch { /* */ }
    sourceRef.current = null;
    stopSpeaking();
  };

  // Gemini дауысын ойнату (сәтсіз болса — браузер TTS-ке қайту)
  const playReply = async (spoken: string) => {
    const buf = await generateSpeech(spoken);
    const ctx = audioCtxRef.current;
    if (buf && ctx) {
      try {
        const audioBuf = await ctx.decodeAudioData(buf.slice(0));
        if (phaseRef.current !== "speaking") return;
        const src = ctx.createBufferSource();
        src.buffer = audioBuf;
        src.connect(ctx.destination);
        src.onended = () => { if (phaseRef.current === "speaking") setPh("idle"); };
        sourceRef.current = src;
        src.start();
        return;
      } catch { /* декод сәтсіз — төмендегі fallback */ }
    }
    // Қосалқы: браузер TTS
    speakSmart(spoken, () => { if (phaseRef.current === "speaking") setPh("idle"); });
  };

  // Микрофон деңгейін тірі көрсету
  const levelLoop = useCallback(() => {
    setLevel(micRef.current?.getLevel() || 0);
    rafRef.current = requestAnimationFrame(levelLoop);
  }, []);
  const stopLevelLoop = () => { cancelAnimationFrame(rafRef.current); setLevel(0); };

  // Тыңдауды бастау
  const startListening = async () => {
    stopSpeaking();
    setCaption("");
    try {
      micRef.current = await startMicRecording();
    } catch {
      setCaption(t("voice.micError"));
      return;
    }
    setPh("listening");
    levelLoop();
  };

  // Тыңдауды тоқтатып, жауап алу
  const stopAndRespond = async () => {
    stopLevelLoop();
    const rec = await micRef.current?.stop();
    micRef.current = null;
    if (!rec) { setPh("idle"); return; }

    setPh("thinking");
    const text = await transcribeAudio(rec.blob, rec.mimeType);
    URL.revokeObjectURL(rec.url);
    if (!text) { setPh("idle"); setCaption(t("voice.noSpeech")); return; }

    // Транскрипцияны чатқа жіберіп, жауап алу
    const reply = await onSend(text);
    if (!reply) { setPh("idle"); return; }

    // Жауапты дауыстап оқу (Gemini дауысы — iOS-та сенімді)
    const spoken = clean(reply);
    setCaption(spoken);
    setPh("speaking");
    playReply(spoken);
  };

  // Домалақты басу — күйге қарай әрекет
  const handleTap = () => {
    ensureAudioCtx(); // iOS: нақты басу — аудио жүйесін ашамыз
    unlockSpeech();   // қосалқы браузер TTS үшін
    if (phase === "idle") startListening();
    else if (phase === "listening") stopAndRespond();
    else if (phase === "speaking") { stopAudio(); setPh("idle"); } // үзіп, қайта сөйлеуге дайын
    // thinking кезінде — күтеміз
  };

  // Тазалау
  useEffect(() => () => {
    cancelAnimationFrame(rafRef.current);
    micRef.current?.cancel();
    stopAudio();
    audioCtxRef.current?.close().catch(() => { /* */ });
  }, []);

  // Күй мәтіні
  const statusText =
    phase === "listening" ? t("voice.listening") :
    phase === "thinking" ? t("voice.thinking") :
    phase === "speaking" ? t("voice.speaking") :
    t("voice.tapToSpeak");

  // Анимация параметрлері
  const orbScale = phase === "listening" ? 1 + level * 0.35 : phase === "speaking" ? 1.08 : 1;
  const ringColor =
    phase === "listening" ? "#EF4444" :
    phase === "thinking" ? "#8B5CF6" :
    phase === "speaking" ? "#0EA5E9" : "#16A34A";

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex flex-col items-center justify-center"
      style={{ background: "radial-gradient(circle at 50% 40%, #0f2419 0%, #0a0f0d 70%)" }}
    >
      {/* Жабу */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 w-11 h-11 rounded-full bg-white/10 backdrop-blur-sm text-white/80 hover:text-white hover:bg-white/20 flex items-center justify-center transition-all"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Тақырып */}
      <p className="absolute top-7 left-1/2 -translate-x-1/2 text-white/50 text-sm font-medium">
        {t("voice.title")}
      </p>

      {/* ── Домалақ «жан» ── */}
      <div className="relative flex items-center justify-center" style={{ width: 320, height: 320 }}>
        {/* Сыртқы пульс сақиналары (тыңдау/сөйлеу кезінде) */}
        {(phase === "listening" || phase === "speaking") && [0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="absolute rounded-full"
            style={{ border: `2px solid ${ringColor}`, opacity: 0.3 }}
            initial={{ width: 200, height: 200, opacity: 0.4 }}
            animate={{ width: [200, 300], height: [200, 300], opacity: [0.4, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.6, ease: "easeOut" }}
          />
        ))}

        {/* Ойлану — айналатын доға */}
        {phase === "thinking" && (
          <motion.span
            className="absolute rounded-full"
            style={{ width: 230, height: 230, border: "3px solid transparent", borderTopColor: ringColor, borderRightColor: ringColor }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        )}

        {/* Негізгі домалақ */}
        <motion.button
          onClick={handleTap}
          disabled={phase === "thinking"}
          animate={{
            scale: orbScale,
            boxShadow: `0 0 ${40 + level * 60}px ${ringColor}66, inset 0 0 60px ${ringColor}44`,
          }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="relative w-48 h-48 rounded-full flex items-center justify-center cursor-pointer"
          style={{
            background: `radial-gradient(circle at 35% 30%, ${ringColor}dd, ${ringColor}55 60%, ${ringColor}22)`,
          }}
        >
          {/* Ішкі жылтыр қабат — тірідей толқиды */}
          <motion.span
            className="absolute inset-3 rounded-full"
            style={{ background: `radial-gradient(circle at 40% 35%, #ffffff55, transparent 55%)` }}
            animate={{
              scale: phase === "speaking" ? [1, 1.06, 1] : phase === "listening" ? [1, 1 + level * 0.15, 1] : [1, 1.03, 1],
            }}
            transition={{ duration: phase === "speaking" ? 0.6 : 2.5, repeat: Infinity, ease: "easeInOut" }}
          />
          {phase === "idle" && <Mic className="w-12 h-12 text-white/90 relative" />}
        </motion.button>
      </div>

      {/* Күй мәтіні */}
      <motion.p
        key={statusText}
        initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        className="mt-10 text-white text-lg font-medium"
      >
        {statusText}
      </motion.p>

      {/* Титр — AI не деді (сөйлеу кезінде) */}
      <AnimatePresence>
        {caption && (phase === "speaking" || phase === "idle") && (
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="absolute bottom-24 left-1/2 -translate-x-1/2 w-[85%] max-w-md text-center"
          >
            <p className="text-white/70 text-sm leading-relaxed max-h-24 overflow-y-auto">{caption}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Нұсқау */}
      <p className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40 text-xs text-center px-6">
        {phase === "listening" ? t("voice.hintStop") : t("voice.hint")}
      </p>
    </motion.div>
  );
}
