// filepath: src/components/ielts/QuickTest.tsx
// IELTS жылдам тест — 1000+ сұрақ қорынан кездейсоқ (ауыспалы) тест.
// Лезде тексеру (дұрыс/қате + түсіндірме), қорытынды балл.

import { useState } from "react";
import { motion } from "framer-motion";
import { useLang } from "@/contexts/LangContext";
import { useProgress } from "@/store/progressStore";
import { generateQuiz, CATEGORY_LABELS, BANK_SIZE, type BankQuestion, type QCategory } from "@/lib/ielts/questionBank";
import { ArrowLeft, CheckCircle2, XCircle, Zap, Trophy, RotateCcw } from "lucide-react";

type Phase = "setup" | "run" | "done";

export default function QuickTest({ onBack }: { onBack: () => void }) {
  const { lang } = useLang();
  const { addXP } = useProgress();
  const [phase, setPhase] = useState<Phase>("setup");
  const [count, setCount] = useState(10);
  const [category, setCategory] = useState<QCategory | "all">("all");
  const [questions, setQuestions] = useState<BankQuestion[]>([]);
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);

  const start = () => {
    const qs = generateQuiz(count, category === "all" ? undefined : category);
    setQuestions(qs);
    setIdx(0);
    setSelected(null);
    setCorrectCount(0);
    setPhase("run");
  };

  const q = questions[idx];

  const choose = (opt: string) => {
    if (selected) return;
    setSelected(opt);
    if (opt === q.answer) setCorrectCount((c) => c + 1);
  };

  const next = () => {
    if (idx + 1 >= questions.length) {
      addXP(correctCount * 5);
      setPhase("done");
    } else {
      setIdx((i) => i + 1);
      setSelected(null);
    }
  };

  // ── ОРНАТУ ──
  if (phase === "setup") {
    const cats: (QCategory | "all")[] = ["all", "synonym", "definition", "preposition", "collocation", "phrasal", "linker", "grammar", "academic"];
    return (
      <div className="max-w-2xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary mb-4">
          <ArrowLeft className="w-4 h-4" /> {lang === "kk" ? "IELTS дайындық" : "IELTS prep"}
        </button>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-card bg-accent-purple/15 flex items-center justify-center">
            <Zap className="w-7 h-7 text-accent-purple" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold">{lang === "kk" ? "Жылдам тест" : "Quick Test"}</h1>
            <p className="text-sm text-text-secondary">{BANK_SIZE}+ {lang === "kk" ? "сұрақ · әр жолы әртүрлі" : "questions · different every time"}</p>
          </div>
        </div>

        {/* Сұрақ саны */}
        <div className="card p-5 mb-4">
          <h3 className="font-medium mb-3">{lang === "kk" ? "Сұрақ саны" : "Number of questions"}</h3>
          <div className="flex gap-2">
            {[10, 20, 40].map((n) => (
              <button key={n} onClick={() => setCount(n)}
                className={`flex-1 p-3 rounded-card border text-sm font-medium transition-all ${count === n ? "border-accent-purple bg-accent-purple/10 text-accent-purple" : "border-border hover:border-accent-purple/40"}`}>
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Категория */}
        <div className="card p-5 mb-5">
          <h3 className="font-medium mb-3">{lang === "kk" ? "Тақырып" : "Topic"}</h3>
          <div className="flex flex-wrap gap-2">
            {cats.map((c) => (
              <button key={c} onClick={() => setCategory(c)}
                className={`px-3 py-1.5 rounded-btn text-sm font-medium transition-all ${category === c ? "bg-accent-purple text-white" : "bg-surface-2 text-text-secondary hover:text-text-primary"}`}>
                {c === "all" ? (lang === "kk" ? "Барлығы" : "All") : CATEGORY_LABELS[c][lang]}
              </button>
            ))}
          </div>
        </div>

        <button onClick={start} className="btn-primary w-full">{lang === "kk" ? "Бастау" : "Start"}</button>
      </div>
    );
  }

  // ── ТЕСТ ──
  if (phase === "run" && q) {
    const answered = selected !== null;
    return (
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => setPhase("setup")} className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary">
            <ArrowLeft className="w-4 h-4" /> {lang === "kk" ? "Тоқтату" : "Quit"}
          </button>
          <span className="text-sm font-medium text-text-secondary">{idx + 1} / {questions.length}</span>
        </div>

        {/* Прогресс */}
        <div className="h-2 rounded-full bg-border overflow-hidden mb-5">
          <div className="h-full bg-accent-purple rounded-full transition-all" style={{ width: `${((idx) / questions.length) * 100}%` }} />
        </div>

        <div className="card p-6 mb-4">
          <span className="text-[11px] font-bold bg-accent-purple/15 text-accent-purple px-2 py-0.5 rounded-full">
            {CATEGORY_LABELS[q.category][lang]}
          </span>
          <p className="text-lg font-medium mt-3 mb-1">{q.prompt}</p>
          <p className="text-xs text-text-muted mb-5">{q.promptKk}</p>

          <div className="space-y-2.5">
            {q.options.map((opt) => {
              const isAnswer = opt === q.answer;
              const isChosen = opt === selected;
              let cls = "border-border hover:border-accent-purple/40";
              if (answered && isAnswer) cls = "border-accent-green bg-accent-green/10 text-accent-green";
              else if (answered && isChosen) cls = "border-accent-red bg-accent-red/10 text-accent-red";
              else if (answered) cls = "border-border opacity-60";
              return (
                <button key={opt} onClick={() => choose(opt)} disabled={answered}
                  className={`w-full text-left p-3.5 rounded-card border font-medium transition-all flex items-center justify-between ${cls}`}>
                  <span>{opt}</span>
                  {answered && isAnswer && <CheckCircle2 className="w-5 h-5 text-accent-green shrink-0" />}
                  {answered && isChosen && !isAnswer && <XCircle className="w-5 h-5 text-accent-red shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Түсіндірме */}
          {answered && q.explanation && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
              className="mt-4 p-3 rounded-card bg-surface-2 text-sm text-text-secondary">
              💡 {q.explanation}
            </motion.div>
          )}
        </div>

        {answered && (
          <button onClick={next} className="btn-primary w-full">
            {idx + 1 >= questions.length ? (lang === "kk" ? "Нәтиже" : "See results") : (lang === "kk" ? "Келесі" : "Next")}
          </button>
        )}
      </div>
    );
  }

  // ── НӘТИЖЕ ──
  if (phase === "done") {
    const pct = Math.round((correctCount / questions.length) * 100);
    const msg = pct >= 90 ? (lang === "kk" ? "Тамаша!" : "Excellent!") : pct >= 70 ? (lang === "kk" ? "Жарайсыз!" : "Great job!") : pct >= 50 ? (lang === "kk" ? "Жақсы бастама!" : "Good start!") : (lang === "kk" ? "Жаттыға беріңіз!" : "Keep practicing!");
    return (
      <div className="max-w-md mx-auto">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="card p-8 text-center mb-5 bg-gradient-to-br from-accent-purple/10 to-accent-blue/5 border-accent-purple/30">
          <Trophy className="w-14 h-14 text-accent-gold mx-auto mb-3" />
          <p className="text-text-secondary mb-1">{msg}</p>
          <div className="text-5xl font-display font-bold text-accent-purple mb-1">{correctCount}/{questions.length}</div>
          <p className="text-sm text-text-secondary">{pct}% · +{correctCount * 5} XP</p>
        </motion.div>
        <div className="flex gap-3">
          <button onClick={() => setPhase("setup")} className="btn-ghost flex-1">{lang === "kk" ? "Артқа" : "Back"}</button>
          <button onClick={start} className="btn-primary flex-1 flex items-center justify-center gap-2">
            <RotateCcw className="w-4 h-4" /> {lang === "kk" ? "Тағы" : "Again"}
          </button>
        </div>
      </div>
    );
  }

  return null;
}
