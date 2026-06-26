// filepath: src/components/cinema/ComprehensionQuiz.tsx
// Түсіну тесті — видеодан кейінгі сұрақтар.
// Жауап таңдау → бірден кері байланыс → соңында нәтиже.

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/contexts/LangContext";
import { Check, X, GraduationCap, Trophy, RotateCcw } from "lucide-react";
import type { ComprehensionQuestion } from "@/types/cinema";

interface Props {
  questions: ComprehensionQuestion[];
  onComplete?: (score: number) => void;
}

export default function ComprehensionQuiz({ questions, onComplete }: Props) {
  const { t, lang } = useLang();
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  const q = questions[current];
  const isCorrect = selected === q?.correctIndex;

  // Жауап таңдау
  const handleSelect = (index: number) => {
    if (answered) return;
    setSelected(index);
    setAnswered(true);
    if (index === q.correctIndex) setCorrectCount((c) => c + 1);
  };

  // Келесі сұрақ
  const handleNext = () => {
    if (current + 1 < questions.length) {
      setCurrent(current + 1);
      setSelected(null);
      setAnswered(false);
    } else {
      setFinished(true);
      onComplete?.(Math.round((correctCount / questions.length) * 100));
    }
  };

  // Қайта бастау
  const restart = () => {
    setCurrent(0); setSelected(null); setAnswered(false);
    setCorrectCount(0); setFinished(false);
  };

  // ── Нәтиже экраны ──
  if (finished) {
    const score = Math.round((correctCount / questions.length) * 100);
    const passed = score >= 60;
    return (
      <div className="card p-8 text-center">
        <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${passed ? "bg-accent-green/15" : "bg-accent-gold/15"}`}>
          <Trophy className={`w-8 h-8 ${passed ? "text-accent-green" : "text-accent-gold"}`} />
        </div>
        <h3 className="text-2xl font-display font-bold mb-1">{score}%</h3>
        <p className="text-text-secondary mb-1">
          {correctCount} / {questions.length} {t("quiz.correct")}
        </p>
        <p className={`text-sm font-medium mb-6 ${passed ? "text-accent-green" : "text-accent-gold"}`}>
          {passed ? t("quiz.passed") : t("quiz.tryAgain")}
        </p>
        <button onClick={restart} className="btn-ghost inline-flex items-center gap-2">
          <RotateCcw className="w-4 h-4" /> {t("quiz.retry")}
        </button>
      </div>
    );
  }

  // ── Сұрақ экраны ──
  return (
    <div className="card p-6">
      {/* Тақырып + прогресс */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-accent-purple" />
          <span className="font-display font-semibold">{t("quiz.title")}</span>
        </div>
        <span className="text-sm text-text-secondary">{current + 1} / {questions.length}</span>
      </div>

      {/* Прогресс жолағы */}
      <div className="h-1.5 rounded-full bg-border mb-6 overflow-hidden">
        <div className="h-full bg-accent-purple rounded-full transition-all" style={{ width: `${((current + 1) / questions.length) * 100}%` }} />
      </div>

      {/* Сұрақ */}
      <h4 className="text-lg font-medium mb-5">
        {lang === "kk" ? q.questionKk : q.question}
      </h4>

      {/* Жауап нұсқалары */}
      <div className="space-y-2.5 mb-4">
        {q.options.map((option, i) => {
          let style = "border-border bg-surface-2 hover:border-accent-blue/40";
          if (answered) {
            if (i === q.correctIndex) style = "border-accent-green bg-accent-green/10";
            else if (i === selected) style = "border-accent-red bg-accent-red/10";
            else style = "border-border bg-surface-2 opacity-50";
          }
          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={answered}
              className={`w-full text-left p-4 rounded-card border transition-all flex items-center justify-between gap-3 ${style}`}
            >
              <span className="text-sm">{option}</span>
              {answered && i === q.correctIndex && <Check className="w-5 h-5 text-accent-green shrink-0" />}
              {answered && i === selected && i !== q.correctIndex && <X className="w-5 h-5 text-accent-red shrink-0" />}
            </button>
          );
        })}
      </div>

      {/* Түсіндірме + келесі */}
      <AnimatePresence>
        {answered && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            {q.explanation && (
              <div className={`p-3 rounded-card mb-4 text-sm ${isCorrect ? "bg-accent-green/10 text-accent-green" : "bg-accent-gold/10 text-text-secondary"}`}>
                <span className="font-medium">{isCorrect ? `✓ ${t("quiz.right")}` : `${t("quiz.explanation")}: `}</span>
                {q.explanation}
              </div>
            )}
            <button onClick={handleNext} className="btn-primary w-full">
              {current + 1 < questions.length ? t("quiz.next") : t("quiz.finish")}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
