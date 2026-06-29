// filepath: src/components/ielts/EvaluationResult.tsx
// Writing/Speaking бағалау нәтижесі — 4 критерий, band, кері байланыс.

import { motion } from "framer-motion";
import { useLang } from "@/contexts/LangContext";
import { CheckCircle2, TrendingUp, Trophy } from "lucide-react";

interface Criterion {
  band: number;
  feedback: string;
  label: string;
}

interface Props {
  overallBand: number;
  criteria: Criterion[];
  strengths: string[];
  improvements: string[];
  wordCount: number;
  accentColor: string; // "accent-purple" (writing) / "accent-gold" (speaking)
  bandDescription: string;
  onRetry: () => void;
  onBack: () => void;
}

export default function EvaluationResult({
  overallBand, criteria, strengths, improvements, wordCount, accentColor, bandDescription, onRetry, onBack,
}: Props) {
  const { t } = useLang();

  return (
    <div className="max-w-3xl mx-auto">
      {/* Жалпы band */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        className={`card p-8 text-center mb-5 bg-gradient-to-br from-${accentColor}/10 to-accent-blue/5 border-${accentColor}/30`}
      >
        <Trophy className="w-14 h-14 text-accent-gold mx-auto mb-3" />
        <p className="text-text-secondary mb-1">{t("write.overallBand")}</p>
        <div className={`text-6xl font-display font-bold text-${accentColor} mb-2`}>{overallBand.toFixed(1)}</div>
        <p className="text-sm text-text-secondary">{bandDescription}</p>
      </motion.div>

      {/* 4 критерий */}
      <div className="space-y-3 mb-5">
        {criteria.map((c, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
            className="card p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-display font-semibold text-sm">{c.label}</h3>
              <div className={`px-3 py-1 rounded-full bg-${accentColor}/15 text-${accentColor} font-bold text-sm`}>
                {c.band.toFixed(1)}
              </div>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed">{c.feedback}</p>
          </motion.div>
        ))}
      </div>

      {/* Күшті жақтар */}
      {strengths.length > 0 && (
        <div className="card p-5 mb-4 border-accent-green/20 bg-accent-green/5">
          <h3 className="font-display font-semibold mb-2 text-sm flex items-center gap-2 text-accent-green">
            <CheckCircle2 className="w-4 h-4" /> {t("write.strengths")}
          </h3>
          <ul className="space-y-1.5">
            {strengths.map((s, i) => (
              <li key={i} className="text-sm text-text-secondary flex gap-2">
                <span className="text-accent-green">•</span> {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Жақсартуға болады */}
      {improvements.length > 0 && (
        <div className="card p-5 mb-4 border-accent-gold/20 bg-accent-gold/5">
          <h3 className="font-display font-semibold mb-2 text-sm flex items-center gap-2 text-accent-gold">
            <TrendingUp className="w-4 h-4" /> {t("write.improvements")}
          </h3>
          <ul className="space-y-1.5">
            {improvements.map((s, i) => (
              <li key={i} className="text-sm text-text-secondary flex gap-2">
                <span className="text-accent-gold">•</span> {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Сөз саны + AI ескерту */}
      <p className="text-xs text-text-muted text-center mb-4">
        {wordCount} {t("write.words")} · {t("write.aiNote")}
      </p>

      {/* Әрекеттер */}
      <div className="flex gap-3">
        <button onClick={onBack} className="btn-ghost flex-1">{t("ielts.backToTests")}</button>
        <button onClick={onRetry} className="btn-primary flex-1">{t("ielts.tryAgain")}</button>
      </div>
    </div>
  );
}
