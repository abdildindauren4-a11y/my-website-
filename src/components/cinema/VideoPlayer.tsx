// filepath: src/components/cinema/VideoPlayer.tsx
// YouTube видео ойнатқыш + субтитр синхрондау.
// YouTube IFrame API арқылы уақытты бақылап, дұрыс субтитрді көрсетеді.

import { useEffect, useRef, useState } from "react";
import { useLang } from "@/contexts/LangContext";
import { Play, Pause, RotateCcw, Volume2, Maximize, Subtitles, Bookmark, FileText } from "lucide-react";
import SubtitleOverlay from "./SubtitleOverlay";
import type { CinemaLesson, SubtitleLine } from "@/types/cinema";

// YouTube IFrame API типтері (қарапайым)
declare global {
  interface Window {
    YT?: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

interface Props {
  lesson: CinemaLesson;
  onSaveWord?: () => void;
  onShowTranscript?: () => void;
  onAddWord?: (word: string, definition: string, phonetic?: string) => void;
}

export default function VideoPlayer({ lesson, onShowTranscript, onAddWord }: Props) {
  const { t } = useLang();
  const playerRef = useRef<any>(null);
  const containerId = "yt-player";
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [showSubs, setShowSubs] = useState(true);

  // Ағымдағы субтитрді табу (уақыт бойынша)
  const currentLine: SubtitleLine | null =
    showSubs ? lesson.subtitles.find((s) => currentTime >= s.start && currentTime < s.end) || null : null;

  // YouTube API жүктеу
  useEffect(() => {
    const initPlayer = () => {
      if (!window.YT || !window.YT.Player) return;
      playerRef.current = new window.YT.Player(containerId, {
        videoId: lesson.youtubeIdEn,
        playerVars: { controls: 0, modestbranding: 1, rel: 0, cc_load_policy: 0 },
        events: {
          onReady: () => setReady(true),
          onStateChange: (e: any) => {
            // 1 = playing, 2 = paused
            setPlaying(e.data === 1);
          },
        },
      });
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      // API скриптін жүктеу
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
      window.onYouTubeIframeAPIReady = initPlayer;
    }

    return () => {
      if (playerRef.current?.destroy) playerRef.current.destroy();
    };
  }, [lesson.youtubeIdEn]);

  // Уақытты бақылау (субтитр синхрондау)
  useEffect(() => {
    if (!ready) return;
    const interval = setInterval(() => {
      if (playerRef.current?.getCurrentTime) {
        setCurrentTime(playerRef.current.getCurrentTime());
      }
    }, 250);
    return () => clearInterval(interval);
  }, [ready]);

  // Басқару
  const togglePlay = () => {
    if (!playerRef.current) return;
    playing ? playerRef.current.pauseVideo() : playerRef.current.playVideo();
  };
  const rewind = () => {
    if (!playerRef.current) return;
    playerRef.current.seekTo(Math.max(0, currentTime - 10), true);
  };
  // Ағымдағы сөйлемді қайталау
  const repeatLine = () => {
    if (!playerRef.current || !currentLine) return;
    playerRef.current.seekTo(currentLine.start, true);
    playerRef.current.playVideo();
  };

  const fmt = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };
  const progress = lesson.duration > 0 ? (currentTime / lesson.duration) * 100 : 0;

  return (
    <div>
      {/* Видео контейнері */}
      <div className="relative rounded-card overflow-hidden bg-black aspect-video">
        {/* YouTube iframe осында рендерленеді */}
        <div id={containerId} className="w-full h-full" />

        {/* Субтитр overlay */}
        <SubtitleOverlay line={currentLine} lang={lesson.lang} onAddWord={onAddWord} />

        {/* Жоғарғы оң: CC + баптау */}
        <div className="absolute top-3 right-3 flex gap-2">
          <button
            onClick={() => setShowSubs(!showSubs)}
            className={`w-9 h-9 rounded-lg flex items-center justify-center backdrop-blur-sm transition-all ${showSubs ? "bg-accent-blue text-white" : "bg-black/50 text-white/70 hover:text-white"}`}
            title={t("cinema.subtitlesBoth")}
          >
            <Subtitles className="w-4 h-4" />
          </button>
        </div>

        {/* Төменгі басқару панелі */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-12">
          {/* Прогресс жолағы */}
          <div className="h-1 rounded-full bg-white/20 mb-3 cursor-pointer overflow-hidden">
            <div className="h-full bg-accent-blue rounded-full" style={{ width: `${progress}%` }} />
          </div>
          <div className="flex items-center gap-3">
            <button onClick={togglePlay} className="text-white hover:text-accent-blue transition-colors">
              {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" fill="currentColor" />}
            </button>
            <button onClick={rewind} className="text-white hover:text-accent-blue transition-colors" title="-10s">
              <RotateCcw className="w-5 h-5" />
            </button>
            <Volume2 className="w-5 h-5 text-white" />
            <span className="text-white text-xs font-mono">{fmt(currentTime)} / {fmt(lesson.duration)}</span>
            <div className="flex-1" />
            <button className="text-white hover:text-accent-blue transition-colors">
              <Maximize className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Жүктелу күйі */}
        {!ready && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="text-white/70 text-sm">{t("common.loading")}</div>
          </div>
        )}
      </div>

      {/* Әрекет батырмалары (видео астында) */}
      <div className="flex gap-3 mt-4 flex-wrap">
        <button className="btn-ghost flex items-center gap-2">
          <Bookmark className="w-4 h-4" /> {t("cinema.saveWord")}
        </button>
        <button onClick={repeatLine} className="btn-ghost flex items-center gap-2">
          <RotateCcw className="w-4 h-4" /> {t("cinema.repeatLine")}
        </button>
        <button onClick={onShowTranscript} className="btn-ghost flex items-center gap-2">
          <FileText className="w-4 h-4" /> {t("cinema.showTranscript")}
        </button>
      </div>
    </div>
  );
}
