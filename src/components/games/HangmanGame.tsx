// filepath: src/components/games/HangmanGame.tsx
// Әріп табу — ЭТАЛОН ДЕҢГЕЙ.
// Классикалық "адам асу" орнына — ӘУЕ ШАРЫ (әр қате → солады).
// Дыбыс, серия, кеңес жүйесі, әсем анимация. Балаға да жарамды.

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/contexts/LangContext";
import { useProgress } from "@/store/progressStore";
import { getGameWords, type GameWord } from "@/lib/gamesData";
import { celebrate, celebrateBig } from "@/lib/celebrate";
import { speak } from "@/lib/speech";
import {
  playMatch, playWrong, playWin, playGameOver, playLevelUp, playTap,
  isSoundEnabled, setSoundEnabled,
} from "@/lib/soundFX";
import { SpellCheck, RotateCcw, Volume2, VolumeX, Trophy, Lightbulb, Flame, Sparkles } from "lucide-react";
import { GameIntro } from "./SpeedQuizGame";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const MAX_WRONG = 6;

export default function HangmanGame() {
  const { t, lang } = useLang();
  const { addXP } = useProgress();
  const [phase, setPhase] = useState<"ready" | "playing" | "won" | "lost">("ready");
  const [word, setWord] = useState<GameWord | null>(null);
  const [guessed, setGuessed] = useState<Set<string>>(new Set());
  const [wrong, setWrong] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [hintUsed, setHintUsed] = useState(false);
  const [shake, setShake] = useState(false);
  const [soundOn, setSoundOn] = useState(true);

  const bestKey = "linguafast_game_hangman_en";
  const [best, setBest] = useState(() => {
    try { return parseInt(localStorage.getItem(bestKey) || "0"); } catch { return 0; }
  });

  const start = () => {
    setSoundOn(isSoundEnabled());
    pickWord();
    setScore(0);
    setStreak(0);
    setPhase("playing");
  };

  const pickWord = () => {
    let words = getGameWords("en").filter((w) => /^[a-zA-Z\s]+$/.test(w.term) && w.term.length >= 3 && w.term.length <= 10);
    if (words.length === 0) words = getGameWords("en");
    setWord(words[Math.floor(Math.random() * words.length)]);
    setGuessed(new Set());
    setWrong(0);
    setHintUsed(false);
  };

  const guessLetter = (letter: string) => {
    if (phase !== "playing" || guessed.has(letter)) return;
    const newGuessed = new Set(guessed).add(letter);
    setGuessed(newGuessed);

    const wordLetters = word!.term.toUpperCase().replace(/\s/g, "");
    if (!wordLetters.includes(letter)) {
      const newWrong = wrong + 1;
      setWrong(newWrong);
      playWrong();
      setShake(true);
      setTimeout(() => setShake(false), 300);
      if (newWrong >= MAX_WRONG) {
        setPhase("lost");
        playGameOver();
        setStreak(0);
      }
    } else {
      playMatch();
      const allRevealed = wordLetters.split("").every((l) => newGuessed.has(l));
      if (allRevealed) {
        // Ұпай: қалған әрекет × ұзындық × серия бонусы, кеңес азайтады
        const base = (MAX_WRONG - wrong) * 10 + word!.term.length * 5;
        const streakBonus = streak * 5;
        const hintPenalty = hintUsed ? 0.6 : 1;
        const points = Math.round((base + streakBonus) * hintPenalty);
        const newScore = score + points;
        const newStreak = streak + 1;
        setScore(newScore);
        setStreak(newStreak);
        setPhase("won");
        playWin();
        celebrate();
        speak(word!.term, "en");
        addXP(points);
        if (newScore > best) {
          setBest(newScore);
          try { localStorage.setItem(bestKey, String(newScore)); } catch { /* */ }
          setTimeout(() => celebrateBig(), 300);
        }
      }
    }
  };

  // Кеңес — бір ашылмаған әріпті көрсету (ұпай азаяды)
  const useHint = () => {
    if (hintUsed || phase !== "playing" || !word) return;
    const wordLetters = word.term.toUpperCase().replace(/\s/g, "").split("");
    const unrevealed = wordLetters.filter((l) => !guessed.has(l));
    if (unrevealed.length === 0) return;
    const reveal = unrevealed[Math.floor(Math.random() * unrevealed.length)];
    setHintUsed(true);
    playLevelUp();
    guessLetter(reveal);
  };

  const nextWord = () => {
    pickWord();
    setPhase("playing");
  };

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
  };

  // Сөзді көрсету
  const renderWord = () => {
    if (!word) return null;
    return word.term.toUpperCase().split("").map((char, i) => {
      if (char === " ") return <div key={i} className="w-4" />;
      const revealed = guessed.has(char) || phase === "lost";
      const isMissing = phase === "lost" && !guessed.has(char);
      return (
        <motion.div
          key={i}
          initial={revealed ? { rotateX: -90 } : {}}
          animate={revealed ? { rotateX: 0 } : {}}
          transition={{ duration: 0.3 }}
          className={`w-9 h-11 sm:w-10 sm:h-12 border-b-4 flex items-center justify-center font-display font-bold text-xl ${
            isMissing ? "border-accent-red text-accent-red" : revealed ? "border-accent-green text-text-primary" : "border-text-muted"
          }`}
        >
          {revealed ? char : ""}
        </motion.div>
      );
    });
  };

  if (phase === "ready") {
    return (
      <GameIntro
        icon={<SpellCheck className="w-8 h-8 text-white" />}
        gradient="from-emerald-400 to-green-600"
        title={lang === "kk" ? "Әріп табу" : "Hangman"}
        rule={t("games.hangmanRule")}
        best={best}
        bestLabel={t("games.best")}
        onStart={start}
        startLabel={t("games.start")}
        extras={
          <div className="flex items-center justify-center gap-2 mb-4 text-xs">
            <div className="px-3 py-1.5 rounded-btn bg-emerald-50 text-emerald-600 max-w-xs">
              🎈 {t("hang.balloonHint")}
            </div>
          </div>
        }
      />
    );
  }

  return (
    <div>
      {/* Панель */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-card bg-accent-green/15 flex items-center justify-center">
            <SpellCheck className="w-5 h-5 text-accent-green" />
          </div>
          <div>
            <h2 className="font-display font-bold">{lang === "kk" ? "Әріп табу" : "Hangman"}</h2>
            <p className="text-xs text-text-secondary">{t("games.score")}: {score}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {streak > 0 && (
            <div className="flex items-center gap-1 text-accent-gold font-bold text-sm">
              <Flame className="w-4 h-4" /> {streak}
            </div>
          )}
          <button onClick={toggleSound} className="text-text-muted hover:text-text-primary">
            {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* ӘУЕ ШАРЫ (қате сайын солады) */}
      <div className="flex justify-center mb-4">
        <BalloonScene wrong={wrong} maxWrong={MAX_WRONG} shake={shake} phase={phase} />
      </div>

      {/* Кеңес (аудармасы) */}
      <div className="card p-3 mb-5 flex items-center gap-3 bg-accent-gold/5 border-accent-gold/20">
        <Lightbulb className="w-5 h-5 text-accent-gold shrink-0" />
        <div className="flex-1">
          <p className="text-xs text-text-muted">{lang === "kk" ? "Аудармасы" : "Translation"}</p>
          <p className="font-medium">{word?.translation}</p>
        </div>
        {phase === "playing" && !hintUsed && (
          <button onClick={useHint} className="text-xs text-accent-blue hover:underline flex items-center gap-1 shrink-0">
            <Sparkles className="w-3.5 h-3.5" /> {t("hang.useHint")}
          </button>
        )}
      </div>

      {/* Сөз */}
      <motion.div
        animate={shake ? { x: [0, -6, 6, -6, 6, 0] } : {}}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-center gap-1.5 flex-wrap mb-8 min-h-[3rem] [perspective:600px]"
      >
        {renderWord()}
      </motion.div>

      {/* Жеңіс/жеңіліс */}
      <AnimatePresence>
        {(phase === "won" || phase === "lost") && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className={`card p-5 text-center mb-6 ${phase === "won" ? "border-accent-green/30 bg-accent-green/5" : "border-accent-red/30 bg-accent-red/5"}`}
          >
            {phase === "won" ? (
              <>
                <Trophy className="w-10 h-10 text-accent-gold mx-auto mb-2" />
                <h3 className="font-display font-bold text-lg mb-1">{t("hang.solved")} 🎉</h3>
                <button onClick={() => speak(word!.term, "en")} className="text-sm text-accent-blue inline-flex items-center gap-1 mb-3">
                  <Volume2 className="w-4 h-4" /> {word?.term}
                </button>
              </>
            ) : (
              <>
                <p className="text-text-secondary mb-1">{lang === "kk" ? "Сөз:" : "The word was:"}</p>
                <p className="font-display font-bold text-xl mb-3">{word?.term}</p>
              </>
            )}
            <button onClick={nextWord} className="btn-primary inline-flex items-center gap-2">
              <RotateCcw className="w-4 h-4" /> {t("hang.nextWord")}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Пернетақта */}
      {phase === "playing" && (
        <div className="grid grid-cols-7 sm:grid-cols-9 gap-1.5">
          {ALPHABET.map((letter) => {
            const used = guessed.has(letter);
            const inWord = word?.term.toUpperCase().includes(letter);
            return (
              <motion.button
                key={letter}
                onClick={() => { playTap(); guessLetter(letter); }}
                whileTap={{ scale: 0.9 }}
                disabled={used}
                className={`aspect-square rounded-btn font-display font-bold text-sm transition-all ${
                  used
                    ? inWord
                      ? "bg-accent-green text-white"
                      : "bg-accent-red/15 text-accent-red/50"
                    : "bg-surface border border-border hover:border-accent-green/50 hover:bg-surface-2 hover:scale-105"
                }`}
              >
                {letter}
              </motion.button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Әуе шары сахнасы (қате сайын солады) ──
function BalloonScene({ wrong, maxWrong, shake, phase }: { wrong: number; maxWrong: number; shake: boolean; phase: string }) {
  // Шардың "толықтығы" (0 = жарылған, 1 = толық)
  const fullness = Math.max(0, (maxWrong - wrong) / maxWrong);
  const popped = phase === "lost";
  const won = phase === "won";

  // Шар түсі (толық → жасыл, аз → қызыл)
  const balloonColor = fullness > 0.6 ? "#16A34A" : fullness > 0.3 ? "#F59E0B" : "#EF4444";
  const scale = 0.5 + fullness * 0.5;

  return (
    <div className="relative h-44 w-44 flex items-center justify-center">
      {/* Бұлттар (фон) */}
      <div className="absolute top-2 left-2 w-12 h-4 bg-sky-100 rounded-full blur-sm" />
      <div className="absolute top-6 right-3 w-10 h-3 bg-sky-100 rounded-full blur-sm" />

      <AnimatePresence mode="wait">
        {popped ? (
          // Жарылған шар
          <motion.div
            key="popped"
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.3, 0] }}
            transition={{ duration: 0.5 }}
            className="text-6xl"
          >
            💥
          </motion.div>
        ) : (
          // Шар
          <motion.div
            key="balloon"
            className="relative flex flex-col items-center"
            animate={shake ? { x: [0, -8, 8, -8, 8, 0], y: won ? -20 : 0 } : { y: won ? [-5, -15, -5] : [0, -5, 0] }}
            transition={shake ? { duration: 0.3 } : { duration: won ? 1 : 3, repeat: Infinity }}
          >
            {/* Шар денесі */}
            <motion.svg
              width="100" height="120" viewBox="0 0 100 120"
              animate={{ scale }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              {/* Шар */}
              <motion.ellipse
                cx="50" cy="45" rx="38" ry="45"
                fill={won ? "#16A34A" : balloonColor}
                animate={{ fill: won ? "#16A34A" : balloonColor }}
              />
              {/* Жылтыр */}
              <ellipse cx="38" cy="30" rx="10" ry="14" fill="rgba(255,255,255,0.35)" />
              {/* Түйін */}
              <path d="M 46 88 L 50 95 L 54 88 Z" fill={won ? "#16A34A" : balloonColor} />
              {/* Жіп */}
              <path d="M 50 95 Q 55 105 48 115" stroke="#94A39A" strokeWidth="1.5" fill="none" />
            </motion.svg>

            {/* Жеңіс — жұлдыздар */}
            {won && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="absolute -top-2 -right-2"
              >
                <Sparkles className="w-6 h-6 text-accent-gold" />
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Қалған әрекет индикаторы */}
      {!popped && !won && (
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-1">
          {Array.from({ length: maxWrong }).map((_, i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${i < maxWrong - wrong ? "bg-accent-green" : "bg-accent-red/40"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
