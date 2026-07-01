// filepath: src/pages/CoursesPage.tsx
// Кәсіби курстар (Coursera тәрізді): каталог → курс беті (модульдер) → сертификат.

import { useState } from "react";
import { motion } from "framer-motion";
import { useLang } from "@/contexts/LangContext";
import { useUserPrefs } from "@/store/userPrefs";
import { useCourseProgress } from "@/store/courseStore";
import { getCoursesByLang } from "@/data/courses";
import LessonPlayer from "@/components/courses/LessonPlayer";
import Certificate from "@/components/courses/Certificate";
import type { CourseLevel, Lesson, Unit } from "@/types/course";
import {
  GraduationCap, BookOpen, FileText, Dumbbell, MessageSquare, CheckCircle2, Lock,
  Star, Play, ArrowLeft, Clock, Award, Layers, ChevronRight,
} from "lucide-react";

const lessonIcons: Record<string, typeof BookOpen> = {
  vocabulary: BookOpen, grammar: FileText, practice: Dumbbell, dialogue: MessageSquare,
};

type View = "catalog" | "course" | "certificate";

export default function CoursesPage() {
  const { lang } = useLang();
  const { prefs } = useUserPrefs();
  const { isLessonCompleted, getLessonScore } = useCourseProgress();
  const [view, setView] = useState<View>("catalog");
  const [course, setCourse] = useState<CourseLevel | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);

  const courses = getCoursesByLang(prefs.learningLang);

  // Курс бойынша барлық сабақтар (реттелген)
  const lessonsOf = (c: CourseLevel): Lesson[] => c.units.flatMap((u) => u.lessons);
  const courseCompletion = (c: CourseLevel) => {
    const all = lessonsOf(c);
    const done = all.filter((l) => isLessonCompleted(l.id)).length;
    return { done, total: all.length, percent: all.length ? Math.round((done / all.length) * 100) : 0 };
  };

  // ═══════════ КАТАЛОГ ═══════════
  if (view === "catalog") {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-card bg-accent-green/15 flex items-center justify-center">
            <GraduationCap className="w-7 h-7 text-accent-green" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold">{lang === "kk" ? "Кәсіби курстар" : "Professional Courses"}</h1>
            <p className="text-sm text-text-secondary">{lang === "kk" ? "Сертификатпен аяқталатын құрылымды курстар" : "Structured courses with a certificate"}</p>
          </div>
        </div>

        {courses.length === 0 ? (
          <div className="card p-12 text-center">
            <GraduationCap className="w-12 h-12 text-text-muted mx-auto mb-3" />
            <p className="text-text-secondary">{lang === "kk" ? "Бұл тіл үшін курстар әзірленуде" : "Courses for this language are coming soon"}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {courses.map((c, i) => {
              const comp = courseCompletion(c);
              const color = c.color || "accent-green";
              return (
                <motion.button
                  key={c.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                  whileHover={{ y: -4 }} onClick={() => { setCourse(c); setView("course"); }}
                  className="card overflow-hidden text-left hover:shadow-lg transition-shadow group flex flex-col"
                >
                  {/* Жоғарғы баннер */}
                  <div className={`h-24 bg-gradient-to-br from-${color}/20 to-${color}/5 flex items-center justify-between px-5`}>
                    <span className="text-4xl">{c.emoji || "📘"}</span>
                    {c.certificate && (
                      <span className="flex items-center gap-1 text-[10px] font-bold bg-white/70 text-slate-600 px-2 py-1 rounded-full">
                        <Award className="w-3 h-3" /> {lang === "kk" ? "Сертификат" : "Certificate"}
                      </span>
                    )}
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    {c.category && (
                      <span className={`text-[10px] font-bold text-${color} uppercase tracking-wide mb-1`}>
                        {lang === "kk" ? (c.categoryKk || c.category) : c.category}
                      </span>
                    )}
                    <h3 className="font-display font-bold text-lg leading-tight mb-1">{lang === "kk" ? c.titleKk : c.title}</h3>
                    <p className="text-sm text-text-secondary line-clamp-2 mb-3">{lang === "kk" ? c.descriptionKk : c.description}</p>
                    <div className="flex items-center gap-3 text-xs text-text-muted mt-auto mb-3">
                      <span className="flex items-center gap-1"><Layers className="w-3.5 h-3.5" /> {c.units.length} {lang === "kk" ? "модуль" : "modules"}</span>
                      {c.hours && <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {c.hours} {lang === "kk" ? "сағат" : "h"}</span>}
                      <span className="capitalize">{c.level}</span>
                    </div>
                    {/* Прогресс */}
                    <div className="h-1.5 rounded-full bg-border overflow-hidden">
                      <div className={`h-full bg-${color} rounded-full`} style={{ width: `${comp.percent}%` }} />
                    </div>
                    <p className="text-[11px] text-text-muted mt-1">{comp.done}/{comp.total} · {comp.percent}%</p>
                  </div>
                </motion.button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // ═══════════ КУРС БЕТІ (модульдер) ═══════════
  if (view === "course" && course) {
    const all = lessonsOf(course);
    const comp = courseCompletion(course);
    const color = course.color || "accent-green";
    const isLocked = (lessonId: string): boolean => {
      const idx = all.findIndex((l) => l.id === lessonId);
      if (idx <= 0) return false;
      return !isLessonCompleted(all[idx - 1].id);
    };
    const skills = lang === "kk" ? (course.skillsKk || course.skills) : course.skills;

    return (
      <div className="max-w-3xl mx-auto">
        <button onClick={() => setView("catalog")} className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary mb-4">
          <ArrowLeft className="w-4 h-4" /> {lang === "kk" ? "Курстар" : "Courses"}
        </button>

        {/* Hero */}
        <div className={`card p-6 mb-5 bg-gradient-to-br from-${color}/10 to-${color}/5 border-${color}/20`}>
          <div className="flex items-start gap-4">
            <span className="text-5xl">{course.emoji || "📘"}</span>
            <div className="flex-1 min-w-0">
              {course.category && <span className={`text-[11px] font-bold text-${color} uppercase tracking-wide`}>{lang === "kk" ? (course.categoryKk || course.category) : course.category}</span>}
              <h1 className="text-2xl font-display font-bold leading-tight">{lang === "kk" ? course.titleKk : course.title}</h1>
              <p className="text-sm text-text-secondary mt-1">{lang === "kk" ? course.descriptionKk : course.description}</p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-text-muted mt-3">
                <span className="flex items-center gap-1"><Layers className="w-3.5 h-3.5" /> {course.units.length} {lang === "kk" ? "модуль" : "modules"}</span>
                <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" /> {all.length} {lang === "kk" ? "сабақ" : "lessons"}</span>
                {course.hours && <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {course.hours} {lang === "kk" ? "сағат" : "h"}</span>}
                {course.instructor && <span>· {course.instructor}</span>}
              </div>
            </div>
          </div>

          {/* Не үйренесіз */}
          {skills && skills.length > 0 && (
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-xs font-semibold mb-2">{lang === "kk" ? "Нені үйренесіз:" : "What you'll learn:"}</p>
              <div className="grid sm:grid-cols-2 gap-x-4 gap-y-1.5">
                {skills.map((s, i) => (
                  <div key={i} className="text-sm text-text-secondary flex gap-2"><CheckCircle2 className={`w-4 h-4 text-${color} shrink-0 mt-0.5`} /> {s}</div>
                ))}
              </div>
            </div>
          )}

          {/* Прогресс */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-medium">{lang === "kk" ? "Курс барысы" : "Course progress"}</span>
              <span className={`font-bold text-${color}`}>{comp.percent}%</span>
            </div>
            <div className="h-2 rounded-full bg-border overflow-hidden">
              <motion.div className={`h-full bg-${color} rounded-full`} initial={{ width: 0 }} animate={{ width: `${comp.percent}%` }} />
            </div>
          </div>
        </div>

        {/* Модульдер */}
        <div className="space-y-5">
          {course.units.map((unit: Unit) => {
            const unitDone = unit.lessons.filter((l) => isLessonCompleted(l.id)).length;
            return (
              <div key={unit.id}>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-9 h-9 rounded-card bg-${color}/15 flex items-center justify-center font-display font-bold text-${color} shrink-0`}>{unit.number}</div>
                  <div className="flex-1 min-w-0">
                    <h2 className="font-display font-bold">{lang === "kk" ? unit.titleKk : unit.title}</h2>
                    <p className="text-xs text-text-secondary">{unitDone}/{unit.lessons.length} · {lang === "kk" ? unit.descriptionKk : unit.description}</p>
                  </div>
                </div>

                <div className="space-y-2 ml-4 pl-8 border-l-2 border-border">
                  {unit.lessons.map((lesson) => {
                    const LessonIcon = lessonIcons[lesson.type] || BookOpen;
                    const completed = isLessonCompleted(lesson.id);
                    const locked = isLocked(lesson.id);
                    const score = getLessonScore(lesson.id);
                    const stars = score >= 90 ? 3 : score >= 60 ? 2 : score > 0 ? 1 : 0;
                    return (
                      <motion.button
                        key={lesson.id} whileHover={{ x: locked ? 0 : 3 }}
                        onClick={() => !locked && setActiveLesson(lesson)} disabled={locked}
                        className={`card p-4 w-full text-left flex items-center gap-3 relative ${locked ? "opacity-50 cursor-not-allowed" : `hover:border-${color}/40 transition-colors`}`}
                      >
                        <div className={`w-10 h-10 rounded-card flex items-center justify-center shrink-0 ${completed ? `bg-${color}/15` : locked ? "bg-surface-2" : `bg-${color}/10`}`}>
                          {completed ? <CheckCircle2 className={`w-5 h-5 text-${color}`} /> : locked ? <Lock className="w-4 h-4 text-text-muted" /> : <LessonIcon className={`w-5 h-5 text-${color}`} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-medium text-text-muted uppercase">
                              {lesson.type === "vocabulary" ? (lang === "kk" ? "Сөздік" : "Vocab") : lesson.type === "grammar" ? (lang === "kk" ? "Теория" : "Theory") : lesson.type === "practice" ? (lang === "kk" ? "Жаттығу" : "Practice") : (lang === "kk" ? "Диалог" : "Dialogue")}
                            </span>
                            <span className="text-[10px] text-text-muted">· {lesson.estimatedMinutes} {lang === "kk" ? "мин" : "min"}</span>
                          </div>
                          <h3 className="font-medium truncate">{lang === "kk" ? lesson.titleKk : lesson.title}</h3>
                        </div>
                        <div className="shrink-0">
                          {completed ? (
                            <div className="flex gap-0.5">{[1, 2, 3].map((s) => <Star key={s} className={`w-3.5 h-3.5 ${s <= stars ? "text-accent-gold fill-accent-gold" : "text-border"}`} />)}</div>
                          ) : !locked ? (
                            <div className={`w-8 h-8 rounded-full bg-${color}/10 flex items-center justify-center`}><Play className={`w-4 h-4 text-${color} ml-0.5`} /></div>
                          ) : null}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Сертификат картасы */}
        {course.certificate && (
          <div className={`card p-5 mt-6 flex items-center gap-4 ${comp.percent >= 100 ? `bg-gradient-to-br from-accent-gold/15 to-${color}/5 border-accent-gold/40` : ""}`}>
            <div className={`w-12 h-12 rounded-card flex items-center justify-center shrink-0 ${comp.percent >= 100 ? "bg-accent-gold/20" : "bg-surface-2"}`}>
              <Award className={`w-7 h-7 ${comp.percent >= 100 ? "text-accent-gold" : "text-text-muted"}`} />
            </div>
            <div className="flex-1">
              <h3 className="font-display font-bold">{lang === "kk" ? "Аяқтау сертификаты" : "Certificate of Completion"}</h3>
              <p className="text-xs text-text-secondary">
                {comp.percent >= 100 ? (lang === "kk" ? "Құттықтаймыз! Сертификатыңыз дайын." : "Congratulations! Your certificate is ready.") : (lang === "kk" ? `Барлық сабақты аяқтаңыз (${comp.done}/${comp.total})` : `Complete all lessons (${comp.done}/${comp.total})`)}
              </p>
            </div>
            <button
              onClick={() => comp.percent >= 100 && setView("certificate")}
              disabled={comp.percent < 100}
              className="btn-primary flex items-center gap-2 text-sm disabled:opacity-40 shrink-0"
            >
              {comp.percent >= 100 ? <>{lang === "kk" ? "Алу" : "Get it"} <ChevronRight className="w-4 h-4" /></> : <Lock className="w-4 h-4" />}
            </button>
          </div>
        )}

        {/* Сабақ ойнатқыш */}
        {activeLesson && (
          <LessonPlayer lesson={activeLesson} onClose={() => setActiveLesson(null)} onComplete={() => setActiveLesson(null)} />
        )}
      </div>
    );
  }

  // ═══════════ СЕРТИФИКАТ ═══════════
  if (view === "certificate" && course) {
    return <Certificate course={course} onBack={() => setView("course")} />;
  }

  return null;
}
