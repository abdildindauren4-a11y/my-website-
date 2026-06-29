// filepath: src/pages/PracticePage.tsx
// Жаттығулар беті — режим таңдау → жаттығу → нәтиже.
// Курстан өзгеше: еркін, жылдам, қайталанбалы.

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/contexts/LangContext";
import { useUserPrefs } from "@/store/userPrefs";
import { useProgress } from "@/store/progressStore";
import { useVocab } from "@/store/vocabStore";
import { getDueCards } from "@/lib/srs";
import {
  practiceModes, generateVocabQuestions, generateGrammarQuestions, generateMixedQuestions,
  type PracticeQuestion,
} from "@/lib/practiceGenerator";
import { celebrate } from "@/lib/celebrate";
import { speak } from "@/lib/speech";
import { playMatch, playWrong, playTap, playWin } from "@/lib/soundFX";
import {
  Dumbbell, BookOpen, FileText, Shuffle, RotateCcw, Volume2, Check, X,
  ArrowRight, Trophy, Flame, Star, ArrowLeft, Lock,
} from "lucide-react";

const iconMap: Record<string, typeof BookOpen> = { BookOpen, FileText, Shuffle, RotateCcw };
const LENGTHS = [
  { id: "quick", count: 5, labelKk: "Жылдам", labelEn: "Quick" },
  { id: "normal", count: 10, labelKk: "Қалыпты", labelEn: "Normal" },
  { id: "long", count: 20, labelKk: "Ұзақ", labelEn: "Long" },
];

type View = "modes" | "length" | "practice" | "result";

export default function PracticePage() {
  const { t, lang } = useLang();
  const { prefs } = useUserPrefs();
  const { addXP } = useProgress();
  const { cards, reviewCard } = useVocab();

  const [view, setView] = useState<View>("modes");
  const [mode, setMode] = useState<string | null>(null);
  const [questions, setQuestions] = useState<PracticeQuestion[]>([]);
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const selectMode = (modeId: string) => {
    setMode(modeId);
    setError(null);
    // SRS — ұзындық таңдаусыз бірден
    if (modeId === "srs") {
      startSrs();
    } else {
      setView("length");
    }
  };

  const startSrs = () => {
    const due = getDueCards(cards.filter((c) => c.lang === prefs.learningLang));
    if (due.length === 0) {
      setError("NO_SRS");
      setView("modes");
      return;
    }
    // SRS карталарынан сұрақ жасау
    const srsQuestions: PracticeQuestion[] = due.slice(0, 15).map((card, i) => {
      const others = cards.filter((c) => c.translation !== card.translation);
      const wrongOpts = others.sort(() => Math.random() - 0.5).slice(0, 3).map((c) => c.translation);
      return {
        id: `srs${i}`,
        kind: "vocab-to-kk" as const,
        prompt: card.term,
        term: card.term,
        options: [card.translation, ...wrongOpts].sort(() => Math.random() - 0.5),
        answer: card.translation,
        lang: card.lang,
      };
    });
    setQuestions(srsQuestions);
    beginPractice();
  };

  const startPractice = (count: number) => {
    let generated: PracticeQuestion[] = [];
    if (mode === "vocab") generated = generateVocabQuestions(prefs.learningLang, count, cards);
    else if (mode === "grammar") generated = generateGrammarQuestions("all", count);
    else if (mode === "mixed") generated = generateMixedQuestions(prefs.learningLang, count, cards);

    if (generated.length === 0) {
      setError("NO_WORDS");
      setView("modes");
      return;
    }
    setQuestions(generated);
    beginPractice();
  };

  const beginPractice = () => {
    setQIdx(0);
    setSelected(null);
    setAnswered(false);
    setCorrectCount(0);
    setStreak(0);
    setMaxStreak(0);
    setView("practice");
  };

  const answer = (option: string) => {
    if (answered) return;
    playTap();
    const q = questions[qIdx];
    const isCorrect = option === q.answer;
    setSelected(option);
    setAnswered(true);

    if (isCorrect) {
      setCorrectCount((c) => c + 1);
      setStreak((s) => { const ns = s + 1; setMaxStreak((m) => Math.max(m, ns)); return ns; });
      playMatch();
    } else {
      setStreak(0);
      playWrong();
    }
  };

  const next = () => {
    const q = questions[qIdx];
    // SRS болса — нәтижені жазу
    if (mode === "srs") {
      const card = cards.find((c) => c.term === q.term);
      if (card) reviewCard(card.id, selected === q.answer ? "good" : "again");
    }

    if (qIdx + 1 >= questions.length) {
      // Аяқталды
      const finalCorrect = correctCount;
      addXP(finalCorrect * 3);
      playWin();
      if (finalCorrect / questions.length >= 0.8) celebrate();
      setView("result");
    } else {
      setQIdx((i) => i + 1);
      setSelected(null);
      setAnswered(false);
    }
  };

  // ── РЕЖИМ ТАҢДАУ ──
  if (view === "modes") {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-card bg-accent-blue/15 flex items-center justify-center">
            <Dumbbell className="w-6 h-6 text-accent-blue" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold">{t("practice.title")}</h1>
            <p className="text-sm text-text-secondary">{t("practice.subtitle")}</p>
          </div>
        </div>

        {error && (
          <div className="card p-4 mb-4 border-accent-gold/30 bg-accent-gold/5">
            <p className="text-sm text-text-secondary">{error === "NO_WORDS" ? t("practice.noWords") : t("practice.noSrs")}</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {practiceModes.map((m, i) => {
            const Icon = iconMap[m.icon] || BookOpen;
            const disabled = m.enLonly && prefs.learningLang !== "en";
            return (
              <motion.button
                key={m.id}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                whileHover={{ y: disabled ? 0 : -3 }}
                onClick={() => !disabled && selectMode(m.id)}
                disabled={disabled}
                className={`card p-5 text-left relative ${disabled ? "opacity-50 cursor-not-allowed" : "hover:border-accent-blue/40 transition-colors"}`}
              >
                <div className={`w-12 h-12 rounded-card bg-${m.color}/15 flex items-center justify-center mb-3`}>
                  <Icon className={`w-6 h-6 text-${m.color}`} />
                </div>
                <h3 className="font-display font-bold mb-1">{lang === "kk" ? m.titleKk : m.titleEn}</h3>
                <p className="text-sm text-text-secondary">{lang === "kk" ? m.descKk : m.descEn}</p>
                {disabled && (
                  <span className="absolute top-4 right-4 text-[10px] flex items-center gap-1 text-text-muted">
                    <Lock className="w-3 h-3" /> {t("practice.enOnly")}
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    );
  }

  // ── ҰЗЫНДЫҚ ТАҢДАУ ──
  if (view === "length") {
    const modeMeta = practiceModes.find((m) => m.id === mode);
    return (
      <div className="max-w-md mx-auto">
        <button onClick={() => setView("modes")} className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary mb-6">
          <ArrowLeft className="w-4 h-4" /> {t("practice.backToModes")}
        </button>
        <div className="text-center mb-6">
          <h2 className="text-xl font-display font-bold mb-1">{lang === "kk" ? modeMeta?.titleKk : modeMeta?.titleEn}</h2>
          <p className="text-sm text-text-secondary">{t("practice.chooseLength")}</p>
        </div>
        <div className="space-y-3">
          {LENGTHS.map((len) => (
            <motion.button
              key={len.id}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={() => startPractice(len.count)}
              className="card p-5 w-full flex items-center justify-between hover:border-accent-blue/40 transition-colors"
            >
              <span className="font-display font-bold">{lang === "kk" ? len.labelKk : len.labelEn}</span>
              <span className="text-sm text-text-secondary">{len.count} {t("practice.questions")}</span>
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  // ── ЖАТТЫҒУ ──
  if (view === "practice") {
    const q = questions[qIdx];
    const progress = (qIdx / questions.length) * 100;

    return (
      <div className="max-w-2xl mx-auto">
        {/* Прогресс панель */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setView("modes")} className="text-text-secondary hover:text-text-primary shrink-0">
            <X className="w-6 h-6" />
          </button>
          <div className="flex-1 h-2.5 rounded-full bg-border overflow-hidden">
            <motion.div className="h-full bg-gradient-to-r from-accent-blue to-accent-green rounded-full" animate={{ width: `${progress}%` }} />
          </div>
          {streak > 1 && (
            <div className="flex items-center gap-1 text-accent-gold font-bold text-sm shrink-0">
              <Flame className="w-4 h-4" /> {streak}
            </div>
          )}
          <span className="text-sm font-medium text-text-muted tabular-nums shrink-0">{qIdx + 1}/{questions.length}</span>
        </div>

        {/* Сұрақ */}
        <AnimatePresence mode="wait">
          <motion.div key={qIdx} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="card p-6 mb-4 text-center">
              {q.promptKk && lang === "kk" && <p className="text-xs text-text-muted mb-2">{q.promptKk}</p>}
              {q.term ? (
                <button onClick={() => speak(q.term!, q.lang)} className="inline-flex items-center gap-2 hover:text-accent-blue transition-colors">
                  <span className={`font-display font-bold ${q.lang === "zh" ? "text-4xl" : "text-2xl"}`}>{q.prompt}</span>
                  <Volume2 className="w-5 h-5 text-text-muted" />
                </button>
              ) : (
                <p className="font-display font-bold text-lg">{q.prompt}</p>
              )}
            </div>

            {/* Нұсқалар */}
            <div className="grid grid-cols-1 gap-2.5">
              {q.options.map((opt) => {
                const isCorrectOpt = answered && opt === q.answer;
                const isWrongSelected = answered && selected === opt && opt !== q.answer;
                return (
                  <motion.button
                    key={opt}
                    onClick={() => answer(opt)}
                    whileTap={{ scale: answered ? 1 : 0.98 }}
                    disabled={answered}
                    className={`card p-4 text-left font-medium transition-all ${
                      isCorrectOpt ? "border-accent-green bg-accent-green/10 text-accent-green" :
                      isWrongSelected ? "border-accent-red bg-accent-red/10 text-accent-red" :
                      answered ? "opacity-50" : "hover:border-accent-blue/40 hover:bg-surface-2"
                    } ${q.kind === "grammar-correct" ? "text-sm" : ""}`}
                  >
                    <span className="flex items-center justify-between">
                      {opt}
                      {isCorrectOpt && <Check className="w-5 h-5 shrink-0" />}
                      {isWrongSelected && <X className="w-5 h-5 shrink-0" />}
                    </span>
                  </motion.button>
                );
              })}
            </div>

            {/* Жалғастыру */}
            {answered && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
                {q.explanation && (
                  <div className="card p-3 mb-3 bg-surface-2/50 text-sm text-text-secondary">
                    💡 {q.explanation}
                  </div>
                )}
                <button onClick={next} className="btn-primary w-full flex items-center justify-center gap-2">
                  {qIdx + 1 >= questions.length ? t("practice.finish") : t("practice.continue")} <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  // ── НӘТИЖЕ ──
  if (view === "result") {
    const percent = Math.round((correctCount / questions.length) * 100);
    const stars = percent >= 90 ? 3 : percent >= 60 ? 2 : 1;
    const messageKey = percent >= 90 ? "practice.perfect" : percent >= 60 ? "practice.great" : "practice.keepPracticing";

    return (
      <div className="max-w-md mx-auto text-center py-8">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.1 }}>
          <Trophy className="w-20 h-20 text-accent-gold mx-auto mb-4" />
        </motion.div>
        <h2 className="text-2xl font-display font-bold mb-1">{t(messageKey as any)}</h2>

        <div className="flex items-center justify-center gap-2 my-4">
          {[1, 2, 3].map((s) => (
            <motion.div key={s} initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.2 + s * 0.15 }}>
              <Star className={`w-9 h-9 ${s <= stars ? "text-accent-gold fill-accent-gold" : "text-border"}`} />
            </motion.div>
          ))}
        </div>

        <div className="card p-5 mb-5">
          <div className="flex items-center justify-around">
            <div>
              <div className="text-2xl font-display font-bold text-accent-green">{correctCount}/{questions.length}</div>
              <div className="text-xs text-text-muted">{t("practice.score")}</div>
            </div>
            <div>
              <div className="text-2xl font-display font-bold">{percent}%</div>
              <div className="text-xs text-text-muted">{t("practice.accuracy")}</div>
            </div>
            <div>
              <div className="text-2xl font-display font-bold text-accent-gold flex items-center gap-1">
                <Flame className="w-5 h-5" />{maxStreak}
              </div>
              <div className="text-xs text-text-muted">{t("practice.streak")}</div>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={() => setView("modes")} className="btn-ghost flex-1">{t("practice.backToModes")}</button>
          <button onClick={() => mode && selectMode(mode)} className="btn-primary flex-1">{t("practice.tryAgain")}</button>
        </div>
      </div>
    );
  }

  return null;
}
