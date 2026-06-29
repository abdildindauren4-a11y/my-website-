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

  useEffect(() => {
    const player = new ListeningPlayer(audioLines, rate);
    playerRef.current = player;
    const unsub = player.subscribe(setState);
    return () => {
      unsub();
      player.destroy();
    };
    // eslint-disable-next-line
  }, [audioLines]);

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

      {/* TTS ескерту */}
      <div className="flex items-start gap-2 text-xs text-text-muted bg-surface-2/50 rounded-card p-2">
        <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
        <span>{t("listen.robotNote")}</span>
      </div>
    </div>
  );
}
