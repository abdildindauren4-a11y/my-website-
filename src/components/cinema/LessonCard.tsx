// filepath: src/components/cinema/LessonCard.tsx
// Сабақ карточкасы — кітапханада көрінеді.
// Деңгей, категория, ұзақтық, сөз саны, прогресс.

import { useLang } from "@/contexts/LangContext";
import { Play, Clock, BookOpen, CheckCircle2, GraduationCap } from "lucide-react";
import type { CinemaLesson, LessonProgress } from "@/types/cinema";

interface Props {
  lesson: CinemaLesson;
  progress?: LessonProgress;
  onClick: () => void;
}

// Деңгей түсі
const levelColors: Record<string, string> = {
  beginner: "bg-accent-green/15 text-accent-green",
  intermediate: "bg-accent-gold/15 text-accent-gold",
  advanced: "bg-accent-red/15 text-accent-red",
};

export default function LessonCard({ lesson, progress, onClick }: Props) {
  const { t, lang } = useLang();
  const title = lang === "kk" && lesson.titleKk ? lesson.titleKk : lesson.title;
  const desc = lang === "kk" && lesson.descriptionKk ? lesson.descriptionKk : lesson.description;
  const mins = Math.round(lesson.duration / 60);
  const levelLabel = t(`cinema.${lesson.level}` as any);
  const completed = progress?.completed;
  const watchedPct = progress?.watchedPercent || 0;

  return (
    <button
      onClick={onClick}
      className="card overflow-hidden text-left hover:border-accent-blue/40 transition-all group w-full"
    >
      {/* Thumbnail (видео превью) */}
      <div className="relative aspect-video bg-gradient-to-br from-surface-2 to-surface overflow-hidden">
        {/* YouTube thumbnail */}
        <img
          src={`https://img.youtube.com/vi/${lesson.youtubeIdEn}/mqdefault.jpg`}
          alt={title}
          className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
        />
        {/* Play түймесі */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-accent-blue/90 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Play className="w-6 h-6 text-white ml-1" fill="currentColor" />
          </div>
        </div>
        {/* Ұзақтық (белгілі болса) */}
        {mins > 0 && (
          <div className="absolute bottom-2 right-2 bg-black/70 rounded px-2 py-0.5 text-xs text-white flex items-center gap-1">
            <Clock className="w-3 h-3" /> {mins} {t("cinema.minutes")}
          </div>
        )}
        {/* Аяқталған белгісі */}
        {completed && (
          <div className="absolute top-2 right-2 bg-accent-green rounded-full p-1">
            <CheckCircle2 className="w-4 h-4 text-white" />
          </div>
        )}
        {/* Прогресс жолағы */}
        {watchedPct > 0 && !completed && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/40">
            <div className="h-full bg-accent-blue" style={{ width: `${watchedPct}%` }} />
          </div>
        )}
        {/* Тіл белгісі */}
        <div className="absolute top-2 left-2 bg-black/70 rounded px-2 py-0.5 text-xs font-bold text-white">
          {lesson.lang === "en" ? "EN" : "中文"}
        </div>
      </div>

      {/* Мәтін */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${levelColors[lesson.level]}`}>
            {levelLabel}
          </span>
          <span className="text-[10px] text-text-muted">{lesson.category}</span>
        </div>
        <h3 className="font-display font-bold mb-1 group-hover:text-accent-blue transition-colors">{title}</h3>
        {desc && <p className="text-sm text-text-secondary line-clamp-2 mb-3">{desc}</p>}
        {/* Метадеректер */}
        <div className="flex items-center gap-3 text-xs text-text-muted">
          <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" /> {lesson.vocabulary.length} {t("cinema.words")}</span>
          {lesson.questions && (
            <span className="flex items-center gap-1"><GraduationCap className="w-3.5 h-3.5" /> {lesson.questions.length} {t("cinema.questions")}</span>
          )}
        </div>
      </div>
    </button>
  );
}
