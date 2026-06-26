// filepath: src/pages/CinemaPage.tsx
// LinguaCinema — кино арқылы оқу.
// Екі көрініс: Кітапхана (сабақтар таңдау) және Сабақ (видео + сөздік + тест).

import { useState, useMemo } from "react";
import { useLang } from "@/contexts/LangContext";
import VideoPlayer from "@/components/cinema/VideoPlayer";
import VocabPanel from "@/components/cinema/VocabPanel";
import LessonCard from "@/components/cinema/LessonCard";
import ComprehensionQuiz from "@/components/cinema/ComprehensionQuiz";
import { cinemaLessons, categories } from "@/lib/cinemaData";
import { Film, X, ArrowLeft, Play, GraduationCap } from "lucide-react";
import type { CinemaLesson } from "@/types/cinema";

type Level = "all" | "beginner" | "intermediate" | "advanced";
type LessonTab = "watch" | "quiz";

export default function CinemaPage() {
  const { t, lang } = useLang();
  const [activeLesson, setActiveLesson] = useState<CinemaLesson | null>(null);
  const [showTranscript, setShowTranscript] = useState(false);
  const [lessonTab, setLessonTab] = useState<LessonTab>("watch");
  const [category, setCategory] = useState("all");
  const [level, setLevel] = useState<Level>("all");

  // Сүзілген сабақтар
  const filtered = useMemo(() => {
    return cinemaLessons.filter((l) => {
      if (category !== "all" && l.category !== category) return false;
      if (level !== "all" && l.level !== level) return false;
      return true;
    });
  }, [category, level]);

  // ════════ САБАҚ КӨРІНІСІ ════════
  if (activeLesson) {
    const hasQuiz = activeLesson.questions && activeLesson.questions.length > 0;
    return (
      <div className="max-w-7xl mx-auto">
        {/* Артқа */}
        <button
          onClick={() => { setActiveLesson(null); setShowTranscript(false); setLessonTab("watch"); }}
          className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> {t("cinema.backToLibrary")}
        </button>

        {/* Сабақ атауы */}
        <div className="mb-4">
          <h1 className="text-xl font-display font-bold">
            {lang === "kk" && activeLesson.titleKk ? activeLesson.titleKk : activeLesson.title}
          </h1>
          {activeLesson.description && (
            <p className="text-text-secondary text-sm mt-1">
              {lang === "kk" && activeLesson.descriptionKk ? activeLesson.descriptionKk : activeLesson.description}
            </p>
          )}
        </div>

        {/* Табтар: Видео / Тест */}
        {hasQuiz && (
          <div className="flex items-center gap-2 border-b border-border mb-5">
            <button
              onClick={() => setLessonTab("watch")}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-all flex items-center gap-1.5 ${lessonTab === "watch" ? "border-accent-pink text-text-primary" : "border-transparent text-text-secondary hover:text-text-primary"}`}
            >
              <Play className="w-3.5 h-3.5" /> {t("cinema.title")}
            </button>
            <button
              onClick={() => setLessonTab("quiz")}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-all flex items-center gap-1.5 ${lessonTab === "quiz" ? "border-accent-purple text-text-primary" : "border-transparent text-text-secondary hover:text-text-primary"}`}
            >
              <GraduationCap className="w-3.5 h-3.5" /> {t("quiz.tab")} ({activeLesson.questions!.length})
            </button>
          </div>
        )}

        {/* Контент: видео немесе тест */}
        {lessonTab === "quiz" && hasQuiz ? (
          <div className="max-w-2xl mx-auto">
            <ComprehensionQuiz questions={activeLesson.questions!} />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2">
              <VideoPlayer lesson={activeLesson} onShowTranscript={() => setShowTranscript(true)} />
              {/* Тестке өту шақыруы */}
              {hasQuiz && (
                <button
                  onClick={() => setLessonTab("quiz")}
                  className="card p-4 mt-4 w-full flex items-center justify-between hover:border-accent-purple/40 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-card bg-accent-purple/15 flex items-center justify-center">
                      <GraduationCap className="w-5 h-5 text-accent-purple" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-sm">{t("quiz.title")}</p>
                      <p className="text-xs text-text-secondary">{activeLesson.questions!.length} {t("cinema.questions")}</p>
                    </div>
                  </div>
                  <span className="text-accent-purple text-sm font-medium group-hover:translate-x-1 transition-transform">→</span>
                </button>
              )}
            </div>
            <div className="lg:col-span-1 h-[600px]">
              <VocabPanel words={activeLesson.vocabulary} />
            </div>
          </div>
        )}

        {/* Транскрипт модалі */}
        {showTranscript && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowTranscript(false)}>
            <div className="card max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h3 className="font-display font-semibold">{t("cinema.transcript")}</h3>
                <button onClick={() => setShowTranscript(false)} className="text-text-secondary hover:text-text-primary">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="overflow-y-auto p-4 space-y-3">
                {activeLesson.subtitles.map((s) => (
                  <div key={s.id} className="card bg-surface-2 p-3 border-border">
                    <p className="text-text-primary text-sm mb-1">{s.en}</p>
                    <p className="text-text-secondary text-sm">{s.kk}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ════════ КІТАПХАНА КӨРІНІСІ ════════
  return (
    <div className="max-w-7xl mx-auto">
      {/* Тақырып */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-11 h-11 rounded-card bg-accent-pink/15 flex items-center justify-center">
          <Film className="w-6 h-6 text-accent-pink" />
        </div>
        <div>
          <h1 className="text-2xl font-display font-bold">{t("cinema.title")}</h1>
          <p className="text-sm text-text-secondary">{filtered.length} {t("cinema.lessonsCount")} · {t("cinema.subtitle")}</p>
        </div>
      </div>

      {/* Сүзгілер */}
      <div className="space-y-3 mb-6">
        {/* Категория */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setCategory(c.id)}
              className={`px-3 py-1.5 rounded-btn text-sm font-medium whitespace-nowrap transition-all ${category === c.id ? "bg-accent-blue text-white" : "bg-surface-2 text-text-secondary hover:text-text-primary"}`}
            >
              {lang === "kk" ? c.labelKk : c.labelEn}
            </button>
          ))}
        </div>
        {/* Деңгей */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {([["all", t("cinema.allLevels")], ["beginner", t("cinema.beginner")], ["intermediate", t("cinema.intermediate")], ["advanced", t("cinema.advanced")]] as const).map(([val, label]) => (
            <button
              key={val}
              onClick={() => setLevel(val)}
              className={`px-3 py-1.5 rounded-btn text-xs font-medium whitespace-nowrap transition-all border ${level === val ? "border-accent-blue text-accent-blue" : "border-border text-text-muted hover:text-text-secondary"}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Сабақтар торы */}
      {filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <Film className="w-12 h-12 text-text-muted mx-auto mb-3" />
          <p className="text-text-secondary">{t("cinema.noVideo")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((lesson) => (
            <LessonCard key={lesson.id} lesson={lesson} onClick={() => setActiveLesson(lesson)} />
          ))}
        </div>
      )}
    </div>
  );
}
