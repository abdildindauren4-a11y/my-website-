// filepath: src/components/cinema/VideoPlayer.tsx
// YouTube видео ойнатқыш + субтитр синхрондау.
// Толық басқару: play/pause, seek (прогресс жолағын басу), -10с, дыбыс,
// жылдамдық (0.75×/1×), fullscreen. Көру прогресі мен минуттар есептеледі.

import { useEffect, useRef, useState, useCallback } from "react";
import { useLang } from "@/contexts/LangContext";
import { Play, Pause, RotateCcw, Volume2, VolumeX, Maximize, Subtitles, FileText, Gauge } from "lucide-react";
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
  onShowTranscript?: () => void;
  onAddWord?: (word: string, definition: string, phonetic?: string) => void;
  onDuration?: (seconds: number) => void;       // нақты ұзақтық белгілі болғанда
  onWatchedPercent?: (percent: number) => void; // көрілген % (прогресс үшін)
  onMinuteWatched?: () => void;                 // әр толық көрілген минут сайын
}

export default function VideoPlayer({ lesson, onShowTranscript, onAddWord, onDuration, onWatchedPercent, onMinuteWatched }: Props) {
  const { t } = useLang();
  const playerRef = useRef<any>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerId = "yt-player";
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(lesson.duration || 0);
  const [showSubs, setShowSubs] = useState(true);
  const [muted, setMuted] = useState(false);
  const [speed, setSpeed] = useState(1);
  const watchSecondsRef = useRef(0); // көрілген секунд жинағышы (минут есебі)

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
          onReady: () => {
            setReady(true);
            // Нақты ұзақтықты алу
            const d = playerRef.current?.getDuration?.() || 0;
            if (d > 0) {
              setDuration(d);
              onDuration?.(Math.round(d));
            }
          },
          onStateChange: (e: any) => {
            // 1 = playing, 2 = paused
            setPlaying(e.data === 1);
            // Ойнатылғанда ұзақтық нақтылануы мүмкін
            const d = playerRef.current?.getDuration?.() || 0;
            if (d > 0) setDuration((prev) => (Math.abs(prev - d) > 1 ? d : prev));
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson.youtubeIdEn]);

  // Уақытты бақылау: субтитр синхрондау + көру прогресі + минут есебі
  useEffect(() => {
    if (!ready) return;
    const interval = setInterval(() => {
      if (!playerRef.current?.getCurrentTime) return;
      const time = playerRef.current.getCurrentTime();
      setCurrentTime(time);

      if (playing) {
        // Минут жинағышы (дәл ойнап тұрғанда ғана)
        watchSecondsRef.current += 0.25;
        if (watchSecondsRef.current >= 60) {
          watchSecondsRef.current = 0;
          onMinuteWatched?.();
        }
        // Көрілген %
        const d = playerRef.current.getDuration?.() || 0;
        if (d > 0) onWatchedPercent?.((time / d) * 100);
      }
    }, 250);
    return () => clearInterval(interval);
  }, [ready, playing, onWatchedPercent, onMinuteWatched]);

  // Басқару
  const togglePlay = () => {
    if (!playerRef.current) return;
    if (playing) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
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
  // Прогресс жолағын басу → сол жерге өту
  const handleSeek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!playerRef.current || duration <= 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const fraction = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    playerRef.current.seekTo(fraction * duration, true);
    setCurrentTime(fraction * duration);
  }, [duration]);
  // Дыбыс қосу/өшіру
  const toggleMute = () => {
    if (!playerRef.current) return;
    if (muted) {
      playerRef.current.unMute();
    } else {
      playerRef.current.mute();
    }
    setMuted(!muted);
  };
  // Жылдамдық: 0.75× (баяу, үйренуге) ↔ 1×
  const toggleSpeed = () => {
    if (!playerRef.current?.setPlaybackRate) return;
    const next = speed === 1 ? 0.75 : 1;
    playerRef.current.setPlaybackRate(next);
    setSpeed(next);
  };
  // Fullscreen (видео + субтитр бірге)
  const toggleFullscreen = () => {
    const el = wrapperRef.current;
    if (!el) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      el.requestFullscreen?.();
    }
  };

  const fmt = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div>
      {/* Видео контейнері */}
      <div ref={wrapperRef} className="relative rounded-card overflow-hidden bg-black aspect-video">
        {/* YouTube iframe осында рендерленеді */}
        <div id={containerId} className="w-full h-full" />

        {/* Субтитр overlay */}
        <SubtitleOverlay
          line={currentLine}
          lang={lesson.lang}
          onAddWord={onAddWord}
          onPauseRequest={() => playerRef.current?.pauseVideo?.()}
        />

        {/* Жоғарғы оң: CC қосу/өшіру */}
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
          {/* Прогресс жолағы (басуға болады — seek) */}
          <div className="h-2 -my-0.5 flex items-center cursor-pointer group/bar mb-2" onClick={handleSeek}>
            <div className="h-1 group-hover/bar:h-1.5 w-full rounded-full bg-white/20 overflow-hidden transition-all">
              <div className="h-full bg-accent-blue rounded-full" style={{ width: `${progress}%` }} />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={togglePlay} className="text-white hover:text-accent-blue transition-colors">
              {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" fill="currentColor" />}
            </button>
            <button onClick={rewind} className="text-white hover:text-accent-blue transition-colors" title="-10s">
              <RotateCcw className="w-5 h-5" />
            </button>
            <button onClick={toggleMute} className="text-white hover:text-accent-blue transition-colors">
              {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
            <span className="text-white text-xs font-mono">{fmt(currentTime)} / {fmt(duration)}</span>
            <div className="flex-1" />
            {/* Жылдамдық — баяулатып тыңдау */}
            <button
              onClick={toggleSpeed}
              className={`flex items-center gap-1 text-xs font-mono rounded px-1.5 py-0.5 transition-colors ${speed !== 1 ? "bg-accent-blue text-white" : "text-white hover:text-accent-blue"}`}
              title={t("cinema.speed")}
            >
              <Gauge className="w-4 h-4" /> {speed}×
            </button>
            <button onClick={toggleFullscreen} className="text-white hover:text-accent-blue transition-colors">
              <Maximize className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Жүктелу күйі (ақпараттық — астындағы батырмаларға кедергі жасамайды) */}
        {!ready && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 pointer-events-none">
            <div className="text-white/70 text-sm">{t("common.loading")}</div>
          </div>
        )}
      </div>

      {/* Әрекет батырмалары (видео астында) */}
      <div className="flex gap-3 mt-4 flex-wrap">
        <button onClick={repeatLine} disabled={!currentLine} className="btn-ghost flex items-center gap-2 disabled:opacity-40">
          <RotateCcw className="w-4 h-4" /> {t("cinema.repeatLine")}
        </button>
        {lesson.subtitles.length > 0 && (
          <button onClick={onShowTranscript} className="btn-ghost flex items-center gap-2">
            <FileText className="w-4 h-4" /> {t("cinema.showTranscript")}
          </button>
        )}
      </div>
    </div>
  );
}
