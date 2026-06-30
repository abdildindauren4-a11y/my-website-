// filepath: src/components/ielts/AudioPlayer.tsx
// Listening аудио ойнатқыш UI — TTS негізінде.

import { useState, useEffect, useRef } from "react";
import { useLang } from "@/contexts/LangContext";
import { ListeningPlayer, type AudioPlayerState } from "@/lib/listeningAudio";
import { Play, Pause, RotateCcw, Volume2, AlertCircle } from "lucide-react";
import type { AudioLine } from "@/types/ielts";

interface Props {
  audioLines: AudioLine[];
}

export default function AudioPlayer({ audioLines }: Props) {
  const { t } = useLang();
  const playerRef = useRef<ListeningPlayer | null>(null);
  const [state, setState] = useState<AudioPlayerState>({ playing: false, currentLine: 0, totalLines: audioLines.length, finished: false });
  const [rate, setRate] = useState(0.95);
  const [voiceList, setVoiceList] = useState<{ name: string; lang: string }[]>([]);
  const [voiceName, setVoiceName] = useState<string>(() => {
    try { return localStorage.getItem("linguafast_tts_voice") || ""; } catch { return ""; }
  });

  useEffect(() => {
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

  // Қолжетімді дауыстарды жинау (таңдағыш үшін)
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const refresh = () => {
      const list = playerRef.current?.getVoiceList() || [];
      if (list.length) setVoiceList(list);
    };
    refresh();
    window.speechSynthesis.onvoiceschanged = refresh;
    const t = setTimeout(refresh, 300);
    return () => clearTimeout(t);
  }, []);

  const changeVoice = (name: string) => {
    setVoiceName(name);
    try { localStorage.setItem("linguafast_tts_voice", name); } catch { /* */ }
    playerRef.current?.setPreferredVoice(name || null);
  };

  const testVoice = () => {
    playerRef.current?.restart();
    const u = new SpeechSynthesisUtterance("Hello, this is how the listening voice sounds.");
    const v = (window.speechSynthesis.getVoices() || []).find((x) => x.name === voiceName);
    if (v) { u.voice = v; u.lang = v.lang; }
    u.rate = rate; u.pitch = 1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  };

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

  const progress = state.totalLines > 0 ? (state.currentLine / state.totalLines) * 100 : 0;

  return (
    <div className="card p-5 bg-gradient-to-br from-accent-blue/5 to-accent-green/5">
      {/* Аудио визуализация */}
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
          {/* Прогресс жолағы */}
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

      {/* Жылдамдық басқару */}
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
          <button onClick={testVoice} className="text-xs px-2 py-1.5 rounded-btn bg-surface-2 text-text-secondary hover:bg-surface shrink-0">
            {t("listen.testVoice")}
          </button>
        </div>
      )}

      {/* TTS ескерту */}
      <div className="flex items-start gap-2 text-xs text-text-muted bg-surface-2/50 rounded-card p-2">
        <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
        <span>{t("listen.robotNote")}</span>
      </div>
    </div>
  );
}
