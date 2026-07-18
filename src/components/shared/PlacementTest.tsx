// filepath: src/components/shared/PlacementTest.tsx
// Деңгей анықтау тесті — onboarding пен профильден шақырылады.
// Бейімделгіш: белдеуден өтпесе ерте тоқтайды (3-18 сұрақ).

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/contexts/LangContext";
import { getPlacementQuestions, evaluatePlacement, nextQuestionIndex } from "@/lib/placementTest";
import { cefrMeta, type CefrLevel } from "@/lib/cefr";
import { Target, Check, ArrowRight } from "lucide-react";

interface Props {
  lang: "en" | "zh";                      // үйрену тілі
  onDone: (level: CefrLevel) => void;     // нәтиже
  onSkip?: () => void;                    // тестен бас тарту
}

export default function PlacementTest({ lang, onDone, onSkip }: Props) {
  const { t } = useLang();
  const questions = useMemo(() => getPlacementQuestions(lang), [lang]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [result, setResult] = useState<CefrLevel | null>(null);

  const currentIdx = result === null ? nextQuestionIndex(questions, answers) : null;
  const q = currentIdx !== null ? questions[currentIdx] : null;
  const answeredCount = Object.keys(answers).length;

  const pick = (option: string) => {
    if (currentIdx === null) return;
    const nextAnswers = { ...answers, [currentIdx]: option };
    setAnswers(nextAnswers);
    // Тест бітті ме?
    if (nextQuestionIndex(questions, nextAnswers) === null) {
      const { level } = evaluatePlacement(questions, nextAnswers);
      setResult(level);
    }
  };

  // ── НӘТИЖЕ ──
  if (result) {
    const meta = cefrMeta(result);
    return (
      <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
        <div
          className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl"
          style={{ backgroundColor: meta.color + "22", border: `3px solid ${meta.color}` }}
        >
          {meta.emoji}
        </div>
        <p className="text-sm text-text-secondary mb-1">{t("place.yourLevel")}</p>
        <h2 className="text-4xl font-display font-bold mb-1" style={{ color: meta.color }}>
          {meta.level}
        </h2>
        <p className="font-medium mb-2">{meta.titleKk}</p>
        <p className="text-sm text-text-secondary max-w-sm mx-auto mb-2">{meta.descKk}</p>
        {lang === "zh" && <p className="text-xs text-text-muted mb-4">≈ {meta.hsk}</p>}
        <button
          onClick={() => onDone(result)}
          className="btn-primary w-full max-w-xs mx-auto flex items-center justify-center gap-2 mt-4"
        >
          <Check className="w-5 h-5" /> {t("place.continue")}
        </button>
      </motion.div>
    );
  }

  if (!q) return null;

  // ── СҰРАҚ ──
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <Target className="w-5 h-5 text-accent-blue" />
        <h2 className="text-lg font-display font-bold">{t("place.title")}</h2>
      </div>
      <p className="text-xs text-text-secondary mb-4">{t("place.hint")}</p>

      {/* Прогресс: жауап берілген сұрақ саны (макс 18) */}
      <div className="h-1.5 rounded-full bg-border overflow-hidden mb-5">
        <motion.div
          className="h-full bg-gradient-to-r from-accent-blue to-accent-purple rounded-full"
          animate={{ width: `${Math.min(100, (answeredCount / 18) * 100)}%` }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIdx}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          <div className="card p-5 mb-4">
            <p className="font-medium text-lg leading-relaxed">{q.prompt}</p>
          </div>
          <div className="space-y-2.5">
            {q.options.map((option) => (
              <button
                key={option}
                onClick={() => pick(option)}
                className="card p-4 w-full text-left hover:border-accent-blue/50 hover:bg-accent-blue/5 transition-all flex items-center justify-between group"
              >
                <span>{option}</span>
                <ArrowRight className="w-4 h-4 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {onSkip && (
        <button onClick={onSkip} className="text-sm text-text-muted hover:text-text-secondary mt-5 mx-auto block">
          {t("place.skip")}
        </button>
      )}
    </div>
  );
}
