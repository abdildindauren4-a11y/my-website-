// filepath: src/components/games/SpeedQuizGame.tsx
// Жылдам викторина — ЭТАЛОН ДЕҢГЕЙ.
// Дыбыс әсерлері, power-up (қалқан + 2x ұпай), уақыт бонусы,
// жылдамдық бонусы, әсем анимация, дәлдік статистикасы.

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/contexts/LangContext";
import { useUserPrefs } from "@/store/userPrefs";
import { useProgress } from "@/store/progressStore";
import { getGameWords, makeOptions, shuffle, type GameWord } from "@/lib/gamesData";
import { celebrate, celebrateBig } from "@/lib/celebrate";
import { speak } from "@/lib/speech";
import {
  playMatch, playWrong, playCombo, playWin, playGameOver, playTick, playLevelUp,
  isSoundEnabled, setSoundEnabled,
} from "@/lib/soundFX";
import { Zap, Timer, Flame, RotateCcw, Volume2, VolumeX, Trophy, Shield, Sparkles, Target } from "lucide-react";

const GAME_TIME = 60;
const FREEZE_COMBO = 5;   // қалқан ашылатын комбо
const DOUBLE_COMBO = 10;  // 2x ұпай ашылатын комбо

export default function SpeedQuizGame() {
  const { t, lang } = useLang();
  const { prefs } = useUserPrefs();
  const { addXP } = useProgress();

  const [phase, setPhase] = useState<"ready" | "playing" | "over">("ready");
  const [words, setWords] = useState<GameWord[]>([]);
  const [index, setIndex] = useState(0);
  const [options, setOptions] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_TIME);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [hasFreeze, setHasFreeze] = useState(false);
  const [freezeUsed, setFreezeUsed] = useState(false);
  const [doubleMode, setDoubleMode] = useState(false);
  const [floatPoints, setFloatPoints] = useState<{ id: number; text: string; color: string }[]>([]);
  const [soundOn, setSoundOn] = useState(true);
  const [toast, setToast] = useState<{ text: string; icon: "shield" | "double" } | null>(null);

  const allWordsRef = useRef<GameWord[]>([]);
  const questionStartRef = useRef<number>(0);
  const pointIdRef = useRef(0);

  const bestKey = `linguafast_game_speedquiz_${prefs.learningLang}`;
  const [best, setBest] = useState(() => {
    try { return parseInt(localStorage.getItem(bestKey) || "0"); } catch { return 0; }
  });

  useEffect(() => { setSoundOn(isSoundEnabled()); }, []);

  const start = () => {
    const all = getGameWords(prefs.learningLang);
    allWordsRef.current = all;
    setWords(shuffle(all));
    setIndex(0);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setTimeLeft(GAME_TIME);
    setFeedback(null);
    setSelectedOption(null);
    setCorrectCount(0);
    setTotalAnswered(0);
    setHasFreeze(false);
    setFreezeUsed(false);
    setDoubleMode(false);
    setPhase("playing");
  };

  // Сұрақ дайындау
  useEffect(() => {
    if (phase === "playing" && words.length > 0) {
      const current = words[index % words.length];
      setOptions(makeOptions(current, allWordsRef.current, 4));
      speak(current.term, current.lang);
      questionStartRef.current = Date.now();
    }
    // eslint-disable-next-line
  }, [index, phase, words]);

  // Таймер
  useEffect(() => {
    if (phase !== "playing") return;
    if (timeLeft <= 0) { endGame(); return; }
    if (timeLeft <= 5) playTick();
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line
  }, [timeLeft, phase]);

  const endGame = () => {
    setPhase("over");
    playGameOver();
    if (score > best) {
      setBest(score);
      try { localStorage.setItem(bestKey, String(score)); } catch { /* */ }
      setTimeout(() => { playWin(); celebrateBig(); }, 300);
    } else if (score > 0) {
      celebrate();
    }
    addXP(Math.floor(score / 2));
  };

  // Жүзіп шығатын ұпай
  const float = (text: string, color: string) => {
    const id = pointIdRef.current++;
    setFloatPoints((prev) => [...prev, { id, text, color }]);
    setTimeout(() => setFloatPoints((prev) => prev.filter((p) => p.id !== id)), 900);
  };

  const showToast = (text: string, icon: "shield" | "double") => {
    setToast({ text, icon });
    setTimeout(() => setToast(null), 1500);
  };

  const answer = (option: string) => {
    if (feedback) return;
    const current = words[index % words.length];
    const correct = option === current.translation;
    const responseTime = Date.now() - questionStartRef.current;
    setSelectedOption(option);
    setTotalAnswered((n) => n + 1);

    if (correct) {
      setCorrectCount((n) => n + 1);
      const newCombo = combo + 1;
      setCombo(newCombo);
      setMaxCombo((m) => Math.max(m, newCombo));

      // Жылдамдық бонусы (2 секундтан тез → бонус)
      const fast = responseTime < 2000;
      const basePoints = 10 + combo * 2;
      const speedBonus = fast ? 5 : 0;
      const mult = doubleMode ? 2 : 1;
      const points = (basePoints + speedBonus) * mult;
      setScore((s) => s + points);

      // Уақыт бонусы (дұрыс → +1с)
      setTimeLeft((tt) => Math.min(tt + 1, GAME_TIME));

      float(`+${points}${fast ? " ⚡" : ""}`, "#16A34A");

      // Power-up тексеру
      if (newCombo === FREEZE_COMBO && !hasFreeze) {
        setHasFreeze(true);
        showToast(t("quiz.freezeReady"), "shield");
        playLevelUp();
      } else if (newCombo === DOUBLE_COMBO) {
        setDoubleMode(true);
        showToast(t("quiz.doubleScore"), "double");
        playLevelUp();
      } else if (newCombo >= 2) {
        playCombo(newCombo);
      } else {
        playMatch();
      }
      setFeedback("correct");
    } else {
      // Қате — қалқан бар ма
      if (hasFreeze) {
        setHasFreeze(false);
        setFreezeUsed(true);
        showToast(t("quiz.freezeUsed"), "shield");
        playLevelUp();
        setFeedback("correct"); // қалқан қорғады, комбо сақталады
        setTimeout(() => setFreezeUsed(false), 800);
      } else {
        setCombo(0);
        setDoubleMode(false);
        playWrong();
        float("✗", "#EF4444");
        setFeedback("wrong");
      }
    }

    setTimeout(() => {
      setFeedback(null);
      setSelectedOption(null);
      setIndex((i) => i + 1);
    }, 550);
  };

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
  };

  const current = words[index % words.length];
  const timePercent = (timeLeft / GAME_TIME) * 100;
  const accuracy = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0;

  // ── ДАЙЫНДЫҚ ──
  if (phase === "ready") {
    return (
      <GameIntro
        icon={<Zap className="w-8 h-8 text-white" />}
        gradient="from-amber-400 to-orange-500"
        title={lang === "kk" ? "Жылдам викторина" : "Speed Quiz"}
        rule={t("games.quizRule")}
        best={best}
        bestLabel={t("games.best")}
        onStart={start}
        startLabel={t("games.start")}
        extras={
          <div className="flex items-center justify-center gap-3 mb-4 text-xs">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-btn bg-sky-50 text-sky-600">
              <Shield className="w-3.5 h-3.5" /> {FREEZE_COMBO}x → {lang === "kk" ? "қалқан" : "shield"}
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-btn bg-amber-50 text-amber-600">
              <Sparkles className="w-3.5 h-3.5" /> {DOUBLE_COMBO}x → 2x
            </div>
          </div>
        }
      />
    );
  }

  // ── АЯҚТАЛУ ──
  if (phase === "over") {
    const isRecord = score >= best && score > 0;
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        className="card p-8 text-center bg-gradient-to-br from-amber-400/10 to-orange-500/5 border-amber-400/30"
      >
        <Trophy className="w-16 h-16 text-accent-gold mx-auto mb-3" />
        <h3 className="text-4xl font-display font-bold mb-1">{score}</h3>
        <p className="text-text-secondary mb-2">{t("games.finalScore")}</p>
        {isRecord && (
          <motion.p initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-accent-gold font-semibold mb-3">
            {t("games.newRecord")}
          </motion.p>
        )}
        {/* Статистика */}
        <div className="flex items-center justify-center gap-6 mb-5 text-sm">
          <div className="text-center">
            <div className="flex items-center gap-1 justify-center text-accent-gold font-bold text-lg">
              <Flame className="w-4 h-4" /> {maxCombo}x
            </div>
            <div className="text-[10px] text-text-muted">{t("quiz.bestCombo")}</div>
          </div>
          <div className="text-center">
            <div className="flex items-center gap-1 justify-center text-accent-green font-bold text-lg">
              <Target className="w-4 h-4" /> {accuracy}%
            </div>
            <div className="text-[10px] text-text-muted">{t("quiz.accuracy")}</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-lg">{correctCount}</div>
            <div className="text-[10px] text-text-muted">{t("quiz.answered")}</div>
          </div>
        </div>
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={start} className="btn-primary inline-flex items-center gap-2">
          <RotateCcw className="w-4 h-4" /> {t("games.playAgain")}
        </motion.button>
      </motion.div>
    );
  }

  // ── ОЙЫН ──
  return (
    <div className="relative">
      {/* Power-up toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className={`absolute top-0 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm shadow-card-hover ${
              toast.icon === "shield" ? "bg-sky-500 text-white" : "bg-gradient-to-r from-amber-400 to-orange-500 text-white"
            }`}
          >
            {toast.icon === "shield" ? <Shield className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
            {toast.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Жоғарғы панель */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Timer className={`w-5 h-5 ${timeLeft <= 10 ? "text-accent-red animate-pulse" : "text-accent-blue"}`} />
          <span className={`font-display font-bold text-lg tabular-nums ${timeLeft <= 10 ? "text-accent-red" : ""}`}>{timeLeft}s</span>
        </div>
        <div className="flex items-center gap-3">
          {/* Қалқан белгісі */}
          {hasFreeze && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-sky-500">
              <Shield className="w-5 h-5 fill-sky-500/20" />
            </motion.div>
          )}
          {/* 2x режим */}
          {doubleMode && (
            <motion.div
              animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 0.8, repeat: Infinity }}
              className="px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-bold"
            >
              2x
            </motion.div>
          )}
          {/* Комбо */}
          <AnimatePresence>
            {combo > 1 && (
              <motion.div
                key={combo}
                initial={{ scale: 1.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }}
                className="flex items-center gap-1 text-accent-gold font-bold"
              >
                <Flame className="w-4 h-4" /> {combo}x
              </motion.div>
            )}
          </AnimatePresence>
          <div className="font-display font-bold text-xl tabular-nums">{score}</div>
          <button onClick={toggleSound} className="text-text-muted hover:text-text-primary">
            {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Таймер жолағы */}
      <div className="h-1.5 rounded-full bg-border overflow-hidden mb-6">
        <motion.div
          className={`h-full rounded-full ${timeLeft <= 10 ? "bg-accent-red" : "bg-gradient-to-r from-amber-400 to-orange-500"}`}
          animate={{ width: `${timePercent}%` }}
          transition={{ duration: 1, ease: "linear" }}
        />
      </div>

      {/* Жүзіп шығатын ұпай */}
      <AnimatePresence>
        {floatPoints.map((fp) => (
          <motion.div
            key={fp.id}
            initial={{ opacity: 1, y: 0, scale: 0.8 }}
            animate={{ opacity: 0, y: -60, scale: 1.4 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9 }}
            style={{ color: fp.color }}
            className="absolute left-1/2 top-1/3 -translate-x-1/2 font-display font-bold text-2xl pointer-events-none z-10"
          >
            {fp.text}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Сұрақ */}
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`card p-8 text-center mb-4 transition-colors ${
            feedback === "correct" ? "border-accent-green bg-accent-green/5" :
            feedback === "wrong" ? "border-accent-red bg-accent-red/5" : ""
          } ${freezeUsed ? "ring-2 ring-sky-400" : ""}`}
        >
          <button onClick={() => current && speak(current.term, current.lang)} className="inline-flex items-center gap-2 mb-1 hover:text-accent-blue transition-colors">
            <span className={`font-display font-bold ${current?.lang === "zh" ? "text-5xl" : "text-3xl"}`}>{current?.term}</span>
            <Volume2 className="w-5 h-5 text-text-muted" />
          </button>
          {current?.phonetic && <p className="text-text-muted font-mono text-sm">{current.phonetic}</p>}
        </motion.div>
      </AnimatePresence>

      {/* Жауаптар */}
      <div className="grid grid-cols-2 gap-2.5">
        {options.map((opt) => {
          const isCorrect = feedback && opt === current?.translation;
          const isSelected = selectedOption === opt;
          const isWrongSelected = feedback === "wrong" && isSelected;
          return (
            <motion.button
              key={opt}
              onClick={() => answer(opt)}
              whileTap={{ scale: 0.97 }}
              disabled={!!feedback}
              animate={isWrongSelected ? { x: [0, -6, 6, -6, 6, 0] } : {}}
              transition={{ duration: 0.4 }}
              className={`card p-4 font-medium transition-all ${
                isCorrect ? "border-accent-green bg-accent-green/10 text-accent-green" :
                isWrongSelected ? "border-accent-red bg-accent-red/10 text-accent-red" :
                feedback ? "opacity-40" : "hover:border-amber-400/50 hover:bg-surface-2"
              }`}
            >
              {opt}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// ── Ортақ дайындық экраны (барлық ойын қолданады) ──
export function GameIntro({ icon, gradient, title, rule, best, bestLabel, onStart, startLabel, extras }: {
  icon: React.ReactNode; gradient: string; title: string; rule: string;
  best?: number; bestLabel?: string; onStart: () => void; startLabel: string; extras?: React.ReactNode;
}) {
  return (
    <div className="card overflow-hidden">
      <div className={`bg-gradient-to-br ${gradient} p-8 text-center relative overflow-hidden`}>
        <motion.div
          animate={{ rotate: [0, 8, -8, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/10 blur-2xl"
        />
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", delay: 0.1 }}
          className="relative w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-4"
        >
          {icon}
        </motion.div>
        <h2 className="relative text-2xl font-display font-bold text-white mb-2">{title}</h2>
        <p className="relative text-white/80 text-sm max-w-sm mx-auto">{rule}</p>
      </div>
      <div className="p-6 text-center">
        {extras}
        {best !== undefined && best > 0 && (
          <p className="text-sm text-text-secondary mb-4">{bestLabel}: <span className="font-bold text-text-primary">{best}</span></p>
        )}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onStart}
          className="btn-primary text-base px-8 py-3"
        >
          {startLabel}
        </motion.button>
      </div>
    </div>
  );
}
