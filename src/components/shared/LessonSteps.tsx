// filepath: src/components/shared/LessonSteps.tsx
// Сабақ қадамдары — UI blueprint-тегі төменгі прогресс жолы.
// Аяқталған (жасыл ✓), орындалуда (көк сан), жабық (сұр).

import { Check, Lock, Gift } from "lucide-react";
import { useLang } from "@/contexts/LangContext";
import type { TransKey } from "@/i18n/translations";

type StepStatus = "completed" | "current" | "locked";

interface Step {
  num: number;
  key: TransKey;
  status: StepStatus;
}

const steps: Step[] = [
  { num: 1, key: "step.warmup", status: "completed" },
  { num: 2, key: "step.watch", status: "completed" },
  { num: 3, key: "step.vocabulary", status: "current" },
  { num: 4, key: "step.practice", status: "locked" },
  { num: 5, key: "step.speaking", status: "locked" },
  { num: 6, key: "step.review", status: "locked" },
];

export default function LessonSteps() {
  const { t } = useLang();

  const statusLabel = (s: StepStatus) =>
    s === "completed" ? t("step.completed") : s === "current" ? t("step.inProgress") : t("step.locked");

  return (
    <div className="flex items-start justify-between gap-1">
      {steps.map((step, i) => {
        const isLast = i === steps.length - 1;
        return (
          <div key={step.num} className="flex-1 flex flex-col items-center relative">
            {/* Қосылу сызығы (келесіге) */}
            {!isLast && (
              <div className="absolute top-5 left-1/2 w-full h-0.5 -z-0">
                <div
                  className={`h-full ${
                    step.status === "completed" ? "bg-accent-green" : "bg-border"
                  }`}
                />
              </div>
            )}
            {/* Дөңгелек */}
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center z-10 border-2 transition-all ${
                step.status === "completed"
                  ? "bg-accent-green/20 border-accent-green text-accent-green"
                  : step.status === "current"
                  ? "bg-accent-blue/20 border-accent-blue text-accent-blue shadow-glow"
                  : "bg-surface-2 border-border text-text-muted"
              }`}
            >
              {step.status === "completed" ? (
                <Check className="w-5 h-5" />
              ) : step.status === "locked" ? (
                <Lock className="w-4 h-4" />
              ) : (
                <span className="font-display font-bold text-sm">{step.num}</span>
              )}
            </div>
            {/* Атауы + статус */}
            <span className={`text-xs font-medium mt-2 text-center ${step.status === "locked" ? "text-text-muted" : "text-text-primary"}`}>
              {t(step.key)}
            </span>
            <span
              className={`text-[10px] mt-0.5 ${
                step.status === "completed" ? "text-accent-green" : step.status === "current" ? "text-accent-blue" : "text-text-muted"
              }`}
            >
              {statusLabel(step.status)}
            </span>
          </div>
        );
      })}

      {/* Сыйлық (соңы) */}
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 rounded-full bg-accent-gold/20 border-2 border-accent-gold flex items-center justify-center">
          <Gift className="w-5 h-5 text-accent-gold" />
        </div>
        <span className="text-xs font-medium mt-2 text-accent-gold text-center">{t("step.reward")}</span>
        <span className="text-[10px] mt-0.5 text-text-muted text-center">{t("step.completeAll")}</span>
      </div>
    </div>
  );
}
