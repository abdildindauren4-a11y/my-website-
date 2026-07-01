// filepath: src/components/courses/LessonPlayer.tsx
// Сабақ ойнатқыш — теория + жаттығулар + аяқталу.

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/contexts/LangContext";
import { useProgress } from "@/store/progressStore";
import { useCourseProgress } from "@/store/courseStore";
import { celebrate } from "@/lib/celebrate";
import { playWin } from "@/lib/soundFX";
import { speak } from "@/lib/speech";
import ExercisePlayer from "./ExercisePlayer";
import type { Lesson } from "@/types/course";
import { X, BookOpen, Volume2, Trophy, ArrowRight, Star } from "lucide-react";

interface Props {
  lesson: Lesson;
  onClose: () => void;
  onComplete: () => void;
}

export default function LessonPlayer({ lesson, onClose, onComplete }: Props) {
  const { lang } = useLang();
  const { addXP } = useProgress();
  const { completeLesson } = useCourseProgress();

  // Алдымен оқу материалы (теория бар болса — кез келген сабақ түрінде)
  const [showTheory, setShowTheory] = useState(!!lesson.theory);
  const [exerciseIdx, setExerciseIdx] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  const totalExercises = lesson.exercises.length;
  const progress = (exerciseIdx / totalExercises) * 100;

  const handleAnswer = (correct: boolean) => {
    if (correct) setCorrectCount((c) => c + 1);

    if (exerciseIdx + 1 >= totalExercises) {
      // Сабақ аяқталды
      const scorePercent = Math.round(((correct ? correctCount + 1 : correctCount) / totalExercises) * 100);
      setFinished(true);
      completeLesson(lesson.id, scorePercent);
      addXP(lesson.xpReward);
      playWin();
      celebrate();
    } else {
      setExerciseIdx((i) => i + 1);
    }
  };

  // ── ТЕОРИЯ (грамматика) ──
  if (showTheory && lesson.theory) {
    return (
      <div className="fixed inset-0 z-50 bg-background overflow-y-auto">
        <div className="max-w-2xl mx-auto p-4">
          {/* Жоғарғы панель */}
          <div className="flex items-center justify-between py-3 mb-4">
            <button onClick={onClose} className="text-text-secondary hover:text-text-primary">
              <X className="w-6 h-6" />
            </button>
            <span className="text-sm font-medium text-text-secondary">{lang === "kk" ? lesson.titleKk : lesson.title}</span>
            <div className="w-6" />
          </div>

          <div className="flex items-center gap-3 mb-5">
            <div className="w-11 h-11 rounded-card bg-accent-purple/15 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-accent-purple" />
            </div>
            <h2 className="text-xl font-display font-bold">{lang === "kk" ? lesson.titleKk : lesson.title}</h2>
          </div>

          {/* Түсіндірме */}
          <div className="card p-5 mb-4">
            <p className="leading-relaxed mb-2">{lesson.theory.explanation}</p>
            <p className="text-sm text-text-secondary leading-relaxed pt-2 border-t border-border">{lesson.theory.explanationKk}</p>
          </div>

          {/* Кәсіби материал бөлімдері */}
          {lesson.theory.sections && lesson.theory.sections.length > 0 && (
            <div className="space-y-3 mb-4">
              {lesson.theory.sections.map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="card p-5">
                  <h4 className="font-display font-bold mb-2">{s.heading}</h4>
                  <p className="text-sm leading-relaxed text-text-secondary whitespace-pre-line">{s.body}</p>
                </motion.div>
              ))}
            </div>
          )}

          {/* Негізгі тұжырымдар */}
          {lesson.theory.keyPoints && lesson.theory.keyPoints.length > 0 && (
            <div className="card p-5 mb-4 bg-accent-green/5 border-accent-green/20">
              <h4 className="font-display font-semibold mb-2 text-sm flex items-center gap-2">
                <Star className="w-4 h-4 text-accent-green" /> {lang === "kk" ? "Негізгі тұжырымдар" : "Key takeaways"}
              </h4>
              <ul className="space-y-1.5">
                {lesson.theory.keyPoints.map((k, i) => (
                  <li key={i} className="text-sm text-text-secondary flex gap-2"><span className="text-accent-green shrink-0">✓</span> {k}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Мысалдар */}
          <h3 className="font-display font-semibold mb-3 text-sm">{lang === "kk" ? "Мысалдар" : "Examples"}</h3>
          <div className="space-y-2 mb-6">
            {lesson.theory.examples.map((ex, i) => (
              <motion.div
                key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                className="card p-4 flex items-center justify-between"
              >
                <div>
                  <p className="font-medium">{ex.text}</p>
                  <p className="text-sm text-text-secondary">{ex.translation}</p>
                </div>
                <button onClick={() => speak(ex.text, "en")} className="text-text-muted hover:text-accent-blue shrink-0">
                  <Volume2 className="w-5 h-5" />
                </button>
              </motion.div>
            ))}
          </div>

          <button onClick={() => setShowTheory(false)} className="btn-primary w-full flex items-center justify-center gap-2">
            {lang === "kk" ? "Жаттығуға өту" : "Start exercises"} <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // ── АЯҚТАЛУ ──
  if (finished) {
    const scorePercent = Math.round((correctCount / totalExercises) * 100);
    const stars = scorePercent >= 90 ? 3 : scorePercent >= 60 ? 2 : 1;
    return (
      <div className="fixed inset-0 z-50 bg-background flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.1 }}>
            <Trophy className="w-20 h-20 text-accent-gold mx-auto mb-4" />
          </motion.div>
          <h2 className="text-2xl font-display font-bold mb-2">{lang === "kk" ? "Сабақ аяқталды!" : "Lesson complete!"}</h2>

          {/* Жұлдыздар */}
          <div className="flex items-center justify-center gap-2 mb-4">
            {[1, 2, 3].map((s) => (
              <motion.div key={s} initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.2 + s * 0.15 }}>
                <Star className={`w-10 h-10 ${s <= stars ? "text-accent-gold fill-accent-gold" : "text-border"}`} />
              </motion.div>
            ))}
          </div>

          <div className="card p-5 mb-5">
            <div className="flex items-center justify-around">
              <div>
                <div className="text-2xl font-display font-bold text-accent-green">{correctCount}/{totalExercises}</div>
                <div className="text-xs text-text-muted">{lang === "kk" ? "Дұрыс" : "Correct"}</div>
              </div>
              <div>
                <div className="text-2xl font-display font-bold text-accent-gold">+{lesson.xpReward}</div>
                <div className="text-xs text-text-muted">XP</div>
              </div>
              <div>
                <div className="text-2xl font-display font-bold">{scorePercent}%</div>
                <div className="text-xs text-text-muted">{lang === "kk" ? "Нәтиже" : "Score"}</div>
              </div>
            </div>
          </div>

          <button onClick={onComplete} className="btn-primary w-full">
            {lang === "kk" ? "Жалғастыру" : "Continue"}
          </button>
        </motion.div>
      </div>
    );
  }

  // ── ЖАТТЫҒУ ──
  const exercise = lesson.exercises[exerciseIdx];
  return (
    <div className="fixed inset-0 z-50 bg-background overflow-y-auto">
      <div className="max-w-2xl mx-auto p-4">
        {/* Жоғарғы панель — прогресс */}
        <div className="flex items-center gap-3 py-3 mb-6">
          <button onClick={onClose} className="text-text-secondary hover:text-text-primary shrink-0">
            <X className="w-6 h-6" />
          </button>
          <div className="flex-1 h-2.5 rounded-full bg-border overflow-hidden">
            <motion.div className="h-full bg-gradient-to-r from-accent-green to-accent-blue rounded-full" animate={{ width: `${progress}%` }} />
          </div>
          <span className="text-sm font-medium text-text-muted tabular-nums shrink-0">{exerciseIdx + 1}/{totalExercises}</span>
        </div>

        {/* Жаттығу */}
        <AnimatePresence mode="wait">
          <motion.div key={exerciseIdx} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <ExercisePlayer exercise={exercise} onAnswer={handleAnswer} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
