// filepath: src/pages/CoursesPage.tsx
// Курстар беті — деңгей → бөлімдер → сабақтар (прогресспен).

import { useState } from "react";
import { motion } from "framer-motion";
import { useLang } from "@/contexts/LangContext";
import { useUserPrefs } from "@/store/userPrefs";
import { useCourseProgress } from "@/store/courseStore";
import { getCoursesByLang } from "@/data/courses";
import LessonPlayer from "@/components/courses/LessonPlayer";
import type { Lesson, Unit } from "@/types/course";
import {
  GraduationCap, BookOpen, FileText, Dumbbell, MessageSquare, CheckCircle2, Lock,
  Hand, Users, Hash, Star, Play,
} from "lucide-react";

// Иконка картасы
const iconMap: Record<string, typeof Hand> = { Hand, Users, Hash, BookOpen };
const lessonIcons: Record<string, typeof BookOpen> = {
  vocabulary: BookOpen, grammar: FileText, practice: Dumbbell, dialogue: MessageSquare,
};

export default function CoursesPage() {
  const { lang } = useLang();
  const { prefs } = useUserPrefs();
  const { isLessonCompleted, getLessonScore } = useCourseProgress();
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);

  const courses = getCoursesByLang(prefs.learningLang);
  const course = courses[0]; // бастауыш деңгей

  if (!course) {
    return (
      <div className="max-w-4xl mx-auto text-center py-16">
        <GraduationCap className="w-12 h-12 text-text-muted mx-auto mb-3" />
        <p className="text-text-secondary">{lang === "kk" ? "Бұл тіл үшін курс әзірленуде" : "Course for this language is coming soon"}</p>
      </div>
    );
  }

  // Барлық сабақтарды реттеп жинау (құлып логикасы үшін)
  const allLessonsInOrder: { unit: Unit; lesson: Lesson; idx: number }[] = [];
  course.units.forEach((unit) => {
    unit.lessons.forEach((lesson, idx) => {
      allLessonsInOrder.push({ unit, lesson, idx });
    });
  });

  const getLessonGlobalIdx = (lessonId: string) => allLessonsInOrder.findIndex((l) => l.lesson.id === lessonId);
  const isLocked = (lessonId: string): boolean => {
    const idx = getLessonGlobalIdx(lessonId);
    if (idx === 0) return false;
    const prevLesson = allLessonsInOrder[idx - 1];
    return !isLessonCompleted(prevLesson.lesson.id);
  };

  // Жалпы прогресс
  const totalLessons = allLessonsInOrder.length;
  const completedCount = allLessonsInOrder.filter((l) => isLessonCompleted(l.lesson.id)).length;
  const overallPercent = Math.round((completedCount / totalLessons) * 100);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Тақырып */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-11 h-11 rounded-card bg-accent-green/15 flex items-center justify-center">
          <GraduationCap className="w-6 h-6 text-accent-green" />
        </div>
        <div>
          <h1 className="text-2xl font-display font-bold">{lang === "kk" ? course.titleKk : course.title}</h1>
          <p className="text-sm text-text-secondary">{lang === "kk" ? course.descriptionKk : course.description}</p>
        </div>
      </div>

      {/* Жалпы прогресс */}
      <div className="card p-5 mb-6 bg-gradient-to-br from-accent-green/5 to-accent-blue/5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">{lang === "kk" ? "Курс барысы" : "Course progress"}</span>
          <span className="text-sm font-bold text-accent-green">{completedCount}/{totalLessons} {lang === "kk" ? "сабақ" : "lessons"}</span>
        </div>
        <div className="h-2.5 rounded-full bg-border overflow-hidden">
          <motion.div className="h-full bg-gradient-to-r from-accent-green to-accent-blue rounded-full" initial={{ width: 0 }} animate={{ width: `${overallPercent}%` }} />
        </div>
      </div>

      {/* Бөлімдер */}
      <div className="space-y-6">
        {course.units.map((unit) => {
          const UnitIcon = iconMap[unit.icon] || BookOpen;
          const unitLessons = unit.lessons;
          const unitCompleted = unitLessons.filter((l) => isLessonCompleted(l.id)).length;

          return (
            <div key={unit.id}>
              {/* Бөлім тақырыбы */}
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-card bg-${unit.color}/15 flex items-center justify-center`}>
                  <UnitIcon className={`w-5 h-5 text-${unit.color}`} />
                </div>
                <div className="flex-1">
                  <h2 className="font-display font-bold">{unit.number}. {lang === "kk" ? unit.titleKk : unit.title}</h2>
                  <p className="text-xs text-text-secondary">{unitCompleted}/{unitLessons.length} {lang === "kk" ? "аяқталды" : "completed"}</p>
                </div>
              </div>

              {/* Сабақтар */}
              <div className="space-y-2 ml-5 pl-8 border-l-2 border-border">
                {unitLessons.map((lesson) => {
                  const LessonIcon = lessonIcons[lesson.type] || BookOpen;
                  const completed = isLessonCompleted(lesson.id);
                  const locked = isLocked(lesson.id);
                  const score = getLessonScore(lesson.id);
                  const stars = score >= 90 ? 3 : score >= 60 ? 2 : score > 0 ? 1 : 0;

                  return (
                    <motion.button
                      key={lesson.id}
                      whileHover={{ x: locked ? 0 : 3 }}
                      onClick={() => !locked && setActiveLesson(lesson)}
                      disabled={locked}
                      className={`card p-4 w-full text-left flex items-center gap-3 relative ${
                        locked ? "opacity-50 cursor-not-allowed" : "hover:border-accent-green/40 transition-colors"
                      }`}
                    >
                      {/* Иконка */}
                      <div className={`w-10 h-10 rounded-card flex items-center justify-center shrink-0 ${
                        completed ? "bg-accent-green/15" : locked ? "bg-surface-2" : `bg-${unit.color}/10`
                      }`}>
                        {completed ? <CheckCircle2 className="w-5 h-5 text-accent-green" /> :
                         locked ? <Lock className="w-4 h-4 text-text-muted" /> :
                         <LessonIcon className={`w-5 h-5 text-${unit.color}`} />}
                      </div>

                      {/* Мәтін */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-medium text-text-muted uppercase">
                            {lesson.type === "vocabulary" ? (lang === "kk" ? "Сөздік" : "Vocab") :
                             lesson.type === "grammar" ? (lang === "kk" ? "Грамматика" : "Grammar") :
                             lesson.type === "practice" ? (lang === "kk" ? "Жаттығу" : "Practice") : (lang === "kk" ? "Диалог" : "Dialogue")}
                          </span>
                          <span className="text-[10px] text-text-muted">· {lesson.estimatedMinutes} {lang === "kk" ? "мин" : "min"}</span>
                        </div>
                        <h3 className="font-medium truncate">{lang === "kk" ? lesson.titleKk : lesson.title}</h3>
                      </div>

                      {/* Жұлдыздар / ойнату */}
                      <div className="shrink-0">
                        {completed ? (
                          <div className="flex gap-0.5">
                            {[1, 2, 3].map((s) => (
                              <Star key={s} className={`w-3.5 h-3.5 ${s <= stars ? "text-accent-gold fill-accent-gold" : "text-border"}`} />
                            ))}
                          </div>
                        ) : !locked ? (
                          <div className="w-8 h-8 rounded-full bg-accent-green/10 flex items-center justify-center">
                            <Play className="w-4 h-4 text-accent-green ml-0.5" />
                          </div>
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

      {/* Сабақ ойнатқыш */}
      {activeLesson && (
        <LessonPlayer
          lesson={activeLesson}
          onClose={() => setActiveLesson(null)}
          onComplete={() => setActiveLesson(null)}
        />
      )}
    </div>
  );
}
