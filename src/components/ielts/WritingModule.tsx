// filepath: src/components/ielts/WritingModule.tsx
// IELTS Writing модулі — тапсырма → эссе жазу → AI бағалау.

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useLang } from "@/contexts/LangContext";
import { useProgress } from "@/store/progressStore";
import { writingTasks, evaluateWriting, type WritingTask, type WritingEvaluation } from "@/lib/ieltsWriting";
import { isGeminiConfigured } from "@/lib/gemini";
import { bandDescription } from "@/types/ielts";
import EvaluationResult from "./EvaluationResult";
import { PenTool, Clock, ArrowLeft, ChevronRight, AlertCircle, Loader2, Sparkles } from "lucide-react";

type View = "list" | "writing" | "evaluating" | "result";

export default function WritingModule({ onBack }: { onBack: () => void }) {
  const { t, lang } = useLang();
  const { addXP } = useProgress();
  const [view, setView] = useState<View>("list");
  const [task, setTask] = useState<WritingTask | null>(null);
  const [essay, setEssay] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [evaluation, setEvaluation] = useState<WritingEvaluation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const startRef = useRef(0);

  const wordCount = essay.trim().split(/\s+/).filter(Boolean).length;

  // Таймер
  useEffect(() => {
    if (view !== "writing" || timeLeft <= 0) return;
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, view]);

  const startTask = (tk: WritingTask) => {
    setTask(tk);
    setEssay("");
    setTimeLeft(tk.timeMinutes * 60);
    setEvaluation(null);
    setError(null);
    startRef.current = Date.now();
    setView("writing");
  };

  const submit = async () => {
    if (!task) return;
    if (!isGeminiConfigured()) { setError("NO_KEY"); return; }
    if (wordCount < task.minWords * 0.5) { setError("TOO_SHORT"); return; }

    setView("evaluating");
    setError(null);
    try {
      const result = await evaluateWriting(task, essay, lang);
      setEvaluation(result);
      addXP(Math.round(result.overallBand * 10));
      setView("result");
    } catch (e: any) {
      setError(e.message === "NO_API_KEY" ? "NO_KEY" : "EVAL_ERROR");
      setView("writing");
    }
  };

  // ── ТІЗІМ ──
  if (view === "list") {
    return (
      <div className="max-w-3xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary mb-4">
          <ArrowLeft className="w-4 h-4" /> {t("ielts.backToTests")}
        </button>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-card bg-accent-purple/15 flex items-center justify-center">
            <PenTool className="w-6 h-6 text-accent-purple" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold">{t("ielts.writing")}</h1>
            <p className="text-sm text-text-secondary">{t("write.aiNote")}</p>
          </div>
        </div>

        {!isGeminiConfigured() && (
          <div className="card p-4 mb-4 border-accent-gold/30 bg-accent-gold/5 flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-accent-gold shrink-0 mt-0.5" />
            <p className="text-sm text-text-secondary">{t("write.needApiKey")}</p>
          </div>
        )}

        <div className="space-y-3">
          {writingTasks.map((tk) => (
            <motion.button
              key={tk.id} whileHover={{ y: -2 }} onClick={() => startTask(tk)}
              className="card p-5 w-full text-left flex items-center justify-between hover:border-accent-purple/40 transition-colors"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold bg-accent-purple/15 text-accent-purple px-2 py-0.5 rounded">Task {tk.taskType}</span>
                  <h3 className="font-display font-bold">{lang === "kk" ? tk.titleKk : tk.title}</h3>
                </div>
                <p className="text-sm text-text-secondary">{tk.minWords}+ {t("write.words")} · {tk.timeMinutes} {t("ielts.minutes")}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-accent-purple shrink-0" />
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  // ── ЭССЕ ЖАЗУ ──
  if (view === "writing" && task) {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const enoughWords = wordCount >= task.minWords;

    return (
      <div className="max-w-4xl mx-auto">
        <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-border -mx-4 px-4 py-3 mb-4">
          <div className="flex items-center justify-between gap-4">
            <button onClick={() => setView("list")} className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary">
              <ArrowLeft className="w-4 h-4" /> {t("ielts.backToTests")}
            </button>
            <div className="flex items-center gap-4">
              <span className={`text-sm font-medium ${enoughWords ? "text-accent-green" : "text-text-muted"}`}>
                {wordCount} / {task.minWords} {t("write.words")}
              </span>
              <div className={`flex items-center gap-1.5 font-display font-bold ${timeLeft <= 120 ? "text-accent-red" : ""}`}>
                <Clock className="w-4 h-4" />
                <span className="tabular-nums">{minutes}:{String(seconds).padStart(2, "0")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Тапсырма */}
        <div className="card p-5 mb-4 bg-accent-purple/5 border-accent-purple/20">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold bg-accent-purple/15 text-accent-purple px-2 py-0.5 rounded">Task {task.taskType}</span>
            <h2 className="font-display font-bold">{lang === "kk" ? task.titleKk : task.title}</h2>
          </div>
          <p className="text-sm leading-relaxed mb-2">{task.prompt}</p>
          <details className="text-xs text-text-muted">
            <summary className="cursor-pointer">{lang === "kk" ? "Қазақша аударма" : "Translation"}</summary>
            <p className="mt-2 leading-relaxed">{task.promptKk}</p>
          </details>
        </div>

        {/* Қателер */}
        {error && (
          <div className="card p-3 mb-3 border-accent-red/30 bg-accent-red/5 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-accent-red shrink-0 mt-0.5" />
            <p className="text-sm text-accent-red">
              {error === "NO_KEY" ? t("write.needApiKey") : error === "TOO_SHORT" ? `${t("write.tooShort")} ${task.minWords} ${t("write.words")}` : t("write.error")}
            </p>
          </div>
        )}

        {/* Эссе енгізу */}
        <textarea
          value={essay}
          onChange={(e) => setEssay(e.target.value)}
          placeholder={t("write.startWriting")}
          className="w-full h-80 bg-surface border border-border rounded-card p-4 text-sm leading-relaxed focus:outline-none focus:border-accent-purple/50 resize-none mb-4"
        />

        <button onClick={submit} disabled={wordCount < 20} className="btn-primary w-full disabled:opacity-40 flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4" /> {t("write.submit")}
        </button>
      </div>
    );
  }

  // ── БАҒАЛАП ЖАТЫР ──
  if (view === "evaluating") {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="inline-block mb-4">
          <Loader2 className="w-12 h-12 text-accent-purple" />
        </motion.div>
        <h3 className="text-xl font-display font-bold mb-2">{t("write.evaluating")}</h3>
        <p className="text-sm text-text-secondary">{t("write.evaluatingSub")}</p>
      </div>
    );
  }

  // ── НӘТИЖЕ ──
  if (view === "result" && evaluation) {
    return (
      <EvaluationResult
        overallBand={evaluation.overallBand}
        criteria={[
          { ...evaluation.criteria.taskAchievement, label: t("write.taskAchievement") },
          { ...evaluation.criteria.coherenceCohesion, label: t("write.coherence") },
          { ...evaluation.criteria.lexicalResource, label: t("write.lexical") },
          { ...evaluation.criteria.grammaticalRange, label: t("write.grammar") },
        ]}
        strengths={evaluation.strengths}
        improvements={evaluation.improvements}
        wordCount={evaluation.wordCount}
        accentColor="accent-purple"
        bandDescription={bandDescription(evaluation.overallBand, lang)}
        onRetry={() => task && startTask(task)}
        onBack={() => setView("list")}
      />
    );
  }

  return null;
}
