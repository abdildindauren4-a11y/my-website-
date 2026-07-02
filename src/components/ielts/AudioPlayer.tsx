// filepath: src/components/ielts/AudioPlayer.tsx
// Listening аудио ойнатқыш.
// Екі режим: 1) Студиялық AI дауыс (Gemini TTS — табиғи адам дауысы, ұсынылады)
//            2) Браузер дауысы (TTS — қосалқы, кілтсіз жұмыс істейді)

import { useState, useEffect, useRef } from "react";
import { useLang } from "@/contexts/LangContext";
import { ListeningPlayer, type AudioPlayerState } from "@/lib/listeningAudio";
import { generateSectionAudio, isStudioVoiceAvailable } from "@/lib/geminiTTS";
import { Play, Pause, RotateCcw, Volume2, AlertCircle, Sparkles, Loader2 } from "lucide-react";
import type { AudioLine } from "@/types/ielts";

interface Props {
  audioLines: AudioLine[];
}

const fmt = (s: number) => {
  if (!isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  return `${m}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
};

export default function AudioPlayer({ audioLines }: Props) {
  const { t } = useLang();

  // ── Студиялық AI аудио күйі ──
  const studioAvailable = isStudioVoiceAvailable();
  const [aiUrl, setAiUrl] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(false);
  const [aiPlaying, setAiPlaying] = useState(false);
  const [aiTime, setAiTime] = useState(0);
  const [aiDuration, setAiDuration] = useState(0);
  const [aiRate, setAiRate] = useState(1);
  const audioRef = useRef<HTMLAudioElement>(null);

  // ── Браузер TTS күйі (қосалқы) ──
  const playerRef = useRef<ListeningPlayer | null>(null);
  const [state, setState] = useState<AudioPlayerState>({ playing: false, currentLine: 0, totalLines: audioLines.length, finished: false });
  const [rate, setRate] = useState(0.95);
  const [voiceList, setVoiceList] = useState<{ name: string; lang: string }[]>([]);
  const [showTts, setShowTts] = useState(!studioAvailable);
  const [voiceName, setVoiceName] = useState<string>(() => {
    try { return localStorage.getItem("linguafast_tts_voice") || ""; } catch { return ""; }
  });

  // Бөлім ауысқанда — бәрін тазалау
  useEffect(() => {
    setAiUrl(null);
    setAiError(false);
    setAiPlaying(false);
    setAiTime(0);
    setAiDuration(0);

    const player = new ListeningPlayer(audioLines, rate);
    if (voiceName) player.setPreferredVoice(voiceName);
    playerRef.current = player;
    const unsub = player.subscribe(setState);
    return () => {
      unsub();
      player.destroy();
    };
    // eslint-disable-next-line
  }, [audioLines]);

  // Қолжетімді браузер дауыстары (таңдағыш үшін)
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const refresh = () => {
      const list = playerRef.current?.getVoiceList() || [];
      if (list.length) setVoiceList(list);
    };
    refresh();
    window.speechSynthesis.onvoiceschanged = refresh;
    const timer = setTimeout(refresh, 300);
    return () => clearTimeout(timer);
  }, []);

  // ── Студиялық аудионы жасау ──
  const generateStudio = async () => {
    setAiLoading(true);
    setAiError(false);
    playerRef.current?.pause();
    const url = await generateSectionAudio(audioLines);
    setAiLoading(false);
    if (url) {
      setAiUrl(url);
    } else {
      setAiError(true);
      setShowTts(true);
    }
  };

  const toggleAiPlay = () => {
    const el = audioRef.current;
    if (!el) return;
    if (aiPlaying) el.pause();
    else el.play();
  };

  const seekAi = (v: number) => {
    const el = audioRef.current;
    if (!el) return;
    el.currentTime = v;
    setAiTime(v);
  };

  const changeAiRate = (r: number) => {
    setAiRate(r);
    if (audioRef.current) audioRef.current.playbackRate = r;
  };

  // ── Браузер TTS басқару ──
  const togglePlay = () => {
    if (!playerRef.current) return;
    if (state.playing) playerRef.current.pause();
    else playerRef.current.play();
  };

  const replay = () => {
    if (!playerRef.current) return;
    playerRef.current.restart();
    setTimeout(() => playerRef.current?.play(), 100);
  };

  const changeRate = (r: number) => {
    setRate(r);
    playerRef.current?.setRate(r);
  };

  const changeVoice = (name: string) => {
    setVoiceName(name);
    try { localStorage.setItem("linguafast_tts_voice", name); } catch { /* */ }
    playerRef.current?.setPreferredVoice(name || null);
  };

  const progress = state.totalLines > 0 ? (state.currentLine / state.totalLines) * 100 : 0;

  return (
    <div className="card p-5 bg-gradient-to-br from-accent-blue/5 to-accent-green/5">
      {/* ═══ СТУДИЯЛЫҚ AI ДАУЫС ═══ */}
      {studioAvailable && !aiUrl && (
        <div className="flex items-center gap-3 mb-4 p-3 rounded-card border border-accent-purple/30 bg-accent-purple/5">
          <div className="w-10 h-10 rounded-card bg-accent-purple/15 flex items-center justify-center shrink-0">
            {aiLoading ? <Loader2 className="w-5 h-5 text-accent-purple animate-spin" /> : <Sparkles className="w-5 h-5 text-accent-purple" />}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm">{aiLoading ? t("listen.aiGenerating") : t("listen.aiVoice")}</p>
            <p className="text-xs text-text-secondary">{aiLoading ? t("listen.aiWait") : aiError ? t("listen.aiError") : t("listen.aiVoiceDesc")}</p>
          </div>
          {!aiLoading && (
            <button onClick={generateStudio} className="btn-primary text-sm py-2 px-3 shrink-0 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> {aiError ? t("quiz.retry") : t("listen.aiGenerate")}
            </button>
          )}
        </div>
      )}

      {/* Студиялық ойнатқыш */}
      {aiUrl && (
        <div className="mb-4">
          <audio
            ref={audioRef}
            src={aiUrl}
            onPlay={() => setAiPlaying(true)}
            onPause={() => setAiPlaying(false)}
            onEnded={() => setAiPlaying(false)}
            onTimeUpdate={(e) => setAiTime((e.target as HTMLAudioElement).currentTime)}
            onLoadedMetadata={(e) => setAiDuration((e.target as HTMLAudioElement).duration)}
          />
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-accent-purple/15 text-accent-purple px-2 py-0.5 rounded-full">
              <Sparkles className="w-3 h-3" /> {t("listen.aiReady")}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleAiPlay}
              className="w-14 h-14 rounded-full bg-accent-purple text-white flex items-center justify-center shrink-0 hover:bg-accent-purple/90 transition-colors shadow-card"
            >
              {aiPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
            </button>
            <div className="flex-1">
              <input
                type="range"
                min={0}
                max={aiDuration || 0}
                step={0.1}
                value={aiTime}
                onChange={(e) => seekAi(parseFloat(e.target.value))}
                className="w-full accent-accent-purple"
                style={{ accentColor: "#8B5CF6" }}
              />
              <div className="flex items-center justify-between text-xs text-text-muted font-mono">
                <span>{fmt(aiTime)}</span>
                <span>{fmt(aiDuration)}</span>
              </div>
            </div>
          </div>
          {/* Жылдамдық */}
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-text-muted">{t("listen.speed")}:</span>
            {[0.75, 1, 1.25].map((r) => (
              <button
                key={r}
                onClick={() => changeAiRate(r)}
                className={`text-xs px-2 py-1 rounded-btn font-medium transition-colors ${
                  aiRate === r ? "bg-accent-purple text-white" : "bg-surface-2 text-text-secondary hover:bg-surface"
                }`}
              >
                {r}x
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ═══ БРАУЗЕР ДАУЫСЫ (қосалқы) ═══ */}
      {aiUrl && !showTts ? (
        <button onClick={() => setShowTts(true)} className="text-xs text-text-muted hover:text-text-secondary">
          {t("listen.useBrowserTts")} ↓
        </button>
      ) : (
        <>
          {aiUrl && <p className="text-xs font-semibold text-text-muted mb-2">{t("listen.useBrowserTts")}</p>}
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={togglePlay}
              className="w-14 h-14 rounded-full bg-accent-green text-white flex items-center justify-center shrink-0 hover:bg-accent-green/90 transition-colors shadow-card"
            >
              {state.playing ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
            </button>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1.5">
                <Volume2 className={`w-4 h-4 ${state.playing ? "text-accent-green" : "text-text-muted"}`} />
                <span className="text-sm font-medium">
                  {state.finished ? t("listen.finished") : state.playing ? t("listen.playing") : t("listen.notStarted")}
                </span>
              </div>
              <div className="h-2 rounded-full bg-border overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-accent-blue to-accent-green rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            <button
              onClick={replay}
              className="w-10 h-10 rounded-full bg-surface-2 flex items-center justify-center shrink-0 hover:bg-surface transition-colors"
              title={t("listen.replay")}
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Жылдамдық */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs text-text-muted">{t("listen.speed")}:</span>
            {[0.75, 0.95, 1.15].map((r) => (
              <button
                key={r}
                onClick={() => changeRate(r)}
                className={`text-xs px-2 py-1 rounded-btn font-medium transition-colors ${
                  rate === r ? "bg-accent-green text-white" : "bg-surface-2 text-text-secondary hover:bg-surface"
                }`}
              >
                {r === 0.75 ? "0.75x" : r === 0.95 ? "1x" : "1.25x"}
              </button>
            ))}
          </div>

          {/* Дауыс таңдағыш */}
          {voiceList.length > 0 && (
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs text-text-muted shrink-0">{t("listen.voice")}:</span>
              <select
                value={voiceName}
                onChange={(e) => changeVoice(e.target.value)}
                className="flex-1 min-w-0 bg-surface-2 border border-border rounded-btn px-2 py-1.5 text-xs focus:outline-none focus:border-accent-green/50"
              >
                <option value="">{t("listen.voiceAuto")}</option>
                {voiceList.map((v) => (
                  <option key={v.name} value={v.name}>{v.name} ({v.lang})</option>
                ))}
              </select>
            </div>
          )}

          {/* TTS ескерту */}
          {!aiUrl && (
            <div className="flex items-start gap-2 text-xs text-text-muted bg-surface-2/50 rounded-card p-2">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>{studioAvailable ? t("listen.robotNote") : t("listen.aiNeedKey")}</span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
