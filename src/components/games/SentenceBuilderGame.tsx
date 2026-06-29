// filepath: src/components/games/SentenceBuilderGame.tsx
// Сөйлем құрау — ЭТАЛОН ДЕҢГЕЙ.
// Дыбыс, көмек жүйесі (келесі сөз), серия, деңгейлер (қысқа→ұзын),
// әсем анимация (сөз ұшу, толқын), прогресс.

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/contexts/LangContext";
import { useProgress } from "@/store/progressStore";
import { shuffle } from "@/lib/gamesData";
import { celebrate, celebrateBig } from "@/lib/celebrate";
import { speak } from "@/lib/speech";
import {
  playWrong, playWin, playLevelUp, playTap,
  isSoundEnabled, setSoundEnabled,
} from "@/lib/soundFX";
import { ListOrdered, RotateCcw, Volume2, VolumeX, Trophy, Check, X, Lightbulb, Sparkles, Flame, Eraser } from "lucide-react";
import { GameIntro } from "./SpeedQuizGame";

interface Sentence {
  en: string;
  kk: string;
  level: number; // 1=қысқа, 2=орта, 3=ұзын
}

// Сөйлемдер — деңгейге бөлінген (қысқа → ұзын)
const SENTENCES: Sentence[] = [
  // Деңгей 1 — қысқа
  { en: "I like coffee", kk: "Мен кофе ұнатамын", level: 1 },
  { en: "She is happy", kk: "Ол бақытты", level: 1 },
  { en: "We are friends", kk: "Біз доспыз", level: 1 },
  { en: "He reads books", kk: "Ол кітап оқиды", level: 1 },
  { en: "They play music", kk: "Олар музыка ойнайды", level: 1 },
  // Деңгей 2 — орта
  { en: "I want to learn English", kk: "Мен ағылшын тілін үйренгім келеді", level: 2 },
  { en: "She is reading a book", kk: "Ол кітап оқып жатыр", level: 2 },
  { en: "We are going to school", kk: "Біз мектепке барамыз", level: 2 },
  { en: "He likes to play football", kk: "Ол футбол ойнағанды ұнатады", level: 2 },
  { en: "My favorite color is blue", kk: "Менің сүйікті түсім — көк", level: 2 },
  // Деңгей 3 — ұзын
  { en: "The weather is very nice today", kk: "Бүгін ауа райы өте жақсы", level: 3 },
  { en: "I have two brothers and one sister", kk: "Менің екі ағам, бір қарындасым бар", level: 3 },
  { en: "We will travel to many countries next year", kk: "Біз келесі жылы көп елге саяхаттаймыз", level: 3 },
  { en: "She always helps me with my homework", kk: "Ол маған үй жұмысыма әрқашан көмектеседі", level: 3 },
  { en: "Learning a new language opens many doors", kk: "Жаңа тіл үйрену көп есік ашады", level: 3 },
];

interface WordChip {
  id: number;
  text: string;
}

const ROUNDS = 8; // бір ойында неше сөйлем

export default function SentenceBuilderGame() {
  const { t, lang } = useLang();
  const { addXP } = useProgress();
  const [phase, setPhase] = useState<"ready" | "playing" | "result">("ready");
  const [pool, setPool] = useState<Sentence[]>([]);
  const [index, setIndex] = useState(0);
  const [available, setAvailable] = useState<WordChip[]>([]);
  const [built, setBuilt] = useState<WordChip[]>([]);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [correct, setCorrect] = useState<boolean | null>(null);
  const [hintUsed, setHintUsed] = useState(false);
  const [soundOn, setSoundOn] = useState(true);

  const current = pool[index];

  const bestKey = "linguafast_game_builder";
  const [best, setBest] = useState(() => {
    try { return parseInt(localStorage.getItem(bestKey) || "0"); } catch { return 0; }
  });

  const start = () => {
    setSoundOn(isSoundEnabled());
    // Деңгей бойынша реттеп, біртіндеп қиындату
    const sorted = [...SENTENCES].sort((a, b) => a.level - b.level);
    const selected: Sentence[] = [];
    [1, 2, 3].forEach((lv) => {
      const lvSentences = shuffle(sorted.filter((s) => s.level === lv));
      selected.push(...lvSentences.slice(0, 3));
    });
    const finalPool = selected.slice(0, ROUNDS);
    setPool(finalPool);
    setIndex(0);
    setScore(0);
    setStreak(0);
    setupSentence(finalPool[0]);
    setPhase("playing");
  };

  const setupSentence = (sentence: Sentence) => {
    const words = sentence.en.split(" ").map((w, i) => ({ id: i, text: w }));
    setAvailable(shuffle(words));
    setBuilt([]);
    setCorrect(null);
    setHintUsed(false);
  };

  const pickWord = (chip: WordChip) => {
    if (correct !== null) return;
    playTap();
    setAvailable((prev) => prev.filter((w) => w.id !== chip.id));
    setBuilt((prev) => [...prev, chip]);
  };

  const returnWord = (chip: WordChip) => {
    if (correct !== null) return;
    playTap();
    setBuilt((prev) => prev.filter((w) => w.id !== chip.id));
    setAvailable((prev) => [...prev, chip]);
  };

  const clearAll = () => {
    if (correct !== null) return;
    setAvailable((prev) => shuffle([...prev, ...built]));
    setBuilt([]);
  };

  // Көмек — келесі дұрыс сөзді орналастыру
  const useHint = () => {
    if (correct !== null) return;
    const correctWords = current.en.split(" ");
    const nextPos = built.length;
    if (nextPos >= correctWords.length) return;
    const nextWord = correctWords[nextPos];
    // available-дан сол сөзді тауып қою
    const chip = available.find((w) => w.text === nextWord);
    if (chip) {
      setHintUsed(true);
      playLevelUp();
      pickWord(chip);
    }
  };

  const check = () => {
    const answer = built.map((w) => w.text).join(" ");
    const isCorrect = answer === current.en;
    setCorrect(isCorrect);
    if (isCorrect) {
      const base = 20 + current.level * 10;
      const streakBonus = streak * 5;
      const hintPenalty = hintUsed ? 0.5 : 1;
      const points = Math.round((base + streakBonus) * hintPenalty);
      setScore((s) => s + points);
      setStreak((s) => s + 1);
      playWin();
      celebrate();
      speak(current.en, "en");
      addXP(Math.round(points / 2));
    } else {
      setStreak(0);
      playWrong();
    }
  };

  const next = () => {
    if (index + 1 >= pool.length) {
      setPhase("result");
      const finalScore = score;
      if (finalScore > best) {
        setBest(finalScore);
        try { localStorage.setItem(bestKey, String(finalScore)); } catch { /* */ }
        setTimeout(() => celebrateBig(), 200);
      }
      return;
    }
    const ni = index + 1;
    setIndex(ni);
    setupSentence(pool[ni]);
  };

  const toggleSound = () => {
    const n = !soundOn;
    setSoundOn(n);
    setSoundEnabled(n);
  };

  if (phase === "ready") {
    return (
      <GameIntro
        icon={<ListOrdered className="w-8 h-8 text-white" />}
        gradient="from-rose-400 to-pink-600"
        title={lang === "kk" ? "Сөйлем құрау" : "Sentence Builder"}
        rule={t("games.builderRule")}
        best={best}
        bestLabel={t("games.best")}
        onStart={start}
        startLabel={t("games.start")}
        extras={
          <div className="flex items-center justify-center gap-2 mb-4 text-xs">
            <div className="px-3 py-1.5 rounded-btn bg-rose-50 text-rose-600">
              {lang === "kk" ? "Қысқадан ұзынға дейін" : "Short to long"} · {ROUNDS} {t("build.progress")}
            </div>
          </div>
        }
      />
    );
  }

  if (phase === "result") {
    const isRecord = score >= best && score > 0;
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        className="card p-8 text-center bg-gradient-to-br from-rose-400/10 to-pink-600/5 border-rose-400/30"
      >
        <Trophy className="w-16 h-16 text-accent-gold mx-auto mb-3" />
        <h3 className="text-4xl font-display font-bold mb-1">{score}</h3>
        <p className="text-text-secondary mb-2">{t("games.finalScore")}</p>
        {isRecord && <motion.p initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-accent-gold font-semibold mb-3">{t("games.newRecord")}</motion.p>}
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={start} className="btn-primary inline-flex items-center gap-2">
          <RotateCcw className="w-4 h-4" /> {t("games.playAgain")}
        </motion.button>
      </motion.div>
    );
  }

  // Дұрыс сөздерді көрсету (нәтиже аймағында дұрыс/қате белгілеу)
  const correctWords = current.en.split(" ");

  return (
    <div>
      {/* Панель */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-card bg-accent-pink/15 flex items-center justify-center">
            <ListOrdered className="w-5 h-5 text-accent-pink" />
          </div>
          <div>
            <h2 className="font-display font-bold">{lang === "kk" ? "Сөйлем құрау" : "Sentence Builder"}</h2>
            <p className="text-xs text-text-secondary">{index + 1} / {pool.length} · {t("games.score")}: {score}</p>
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

      {/* Прогресс жолағы */}
      <div className="h-1.5 rounded-full bg-border overflow-hidden mb-5">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-rose-400 to-pink-600"
          animate={{ width: `${((index) / pool.length) * 100}%` }}
        />
      </div>

      {/* Аударма (кеңес) */}
      <div className="card p-4 mb-4 flex items-center gap-3 bg-accent-gold/5 border-accent-gold/20">
        <Lightbulb className="w-5 h-5 text-accent-gold shrink-0" />
        <div className="flex-1">
          <p className="text-xs text-text-muted">{t("build.buildThis")}</p>
          <p className="font-medium">{current?.kk}</p>
        </div>
        <span className="text-[10px] px-2 py-1 rounded-full bg-rose-100 text-rose-600 font-medium shrink-0">
          {t("games.level")} {current?.level}
        </span>
      </div>

      {/* Құрылған сөйлем */}
      <div className={`min-h-[5rem] rounded-card border-2 border-dashed p-3 mb-3 flex flex-wrap gap-2 items-start transition-colors ${
        correct === true ? "border-accent-green bg-accent-green/5" :
        correct === false ? "border-accent-red bg-accent-red/5" :
        "border-border bg-surface-2/50"
      }`}>
        {built.length === 0 && (
          <span className="text-text-muted text-sm self-center mx-auto">{t("build.placeHere")}</span>
        )}
        <AnimatePresence mode="popLayout">
          {built.map((chip, pos) => {
            // Тексергеннен кейін — дұрыс/қате орынды белгілеу
            const isWrongPos = correct === false && chip.text !== correctWords[pos];
            return (
              <motion.button
                key={chip.id}
                layout
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.7, opacity: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                onClick={() => returnWord(chip)}
                className={`px-3 py-2 rounded-btn border font-medium text-sm transition-colors ${
                  correct === true ? "bg-accent-green/10 border-accent-green/30 text-accent-green" :
                  isWrongPos ? "bg-accent-red/10 border-accent-red/40 text-accent-red" :
                  "bg-accent-pink/10 border-accent-pink/30 text-text-primary hover:bg-accent-pink/20"
                }`}
              >
                {chip.text}
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Нәтиже хабары */}
      <AnimatePresence>
        {correct !== null && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            className={`flex items-center gap-2 mb-4 p-3 rounded-card ${correct ? "bg-accent-green/10 text-accent-green" : "bg-accent-red/10 text-accent-red"}`}
          >
            {correct ? <Check className="w-5 h-5 shrink-0" /> : <X className="w-5 h-5 shrink-0" />}
            <span className="font-medium text-sm flex-1">
              {correct ? t("build.correct") : current.en}
            </span>
            {correct && (
              <button onClick={() => speak(current.en, "en")}>
                <Volume2 className="w-4 h-4" />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Қол жетімді сөздер */}
      {correct === null && (
        <div className="flex flex-wrap gap-2 mb-4 min-h-[3rem]">
          <AnimatePresence mode="popLayout">
            {available.map((chip) => (
              <motion.button
                key={chip.id}
                layout
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.7, opacity: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => pickWord(chip)}
                className="px-3 py-2 rounded-btn bg-surface border border-border text-text-primary font-medium text-sm hover:border-accent-pink/50 hover:bg-surface-2 transition-all"
              >
                {chip.text}
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Әрекет батырмалары */}
      <div className="flex gap-2">
        {correct === null ? (
          <>
            <button onClick={useHint} disabled={hintUsed} className="btn-ghost flex items-center gap-1.5 text-sm disabled:opacity-40">
              <Sparkles className="w-4 h-4" /> {t("build.hint")}
            </button>
            {built.length > 0 && (
              <button onClick={clearAll} className="btn-ghost flex items-center gap-1.5 text-sm">
                <Eraser className="w-4 h-4" /> {t("build.clear")}
              </button>
            )}
            <button onClick={check} disabled={built.length === 0} className="btn-primary flex-1 disabled:opacity-40">
              {t("build.check")}
            </button>
          </>
        ) : (
          <button onClick={next} className="btn-primary flex-1 inline-flex items-center justify-center gap-2">
            {index + 1 >= pool.length ? (lang === "kk" ? "Аяқтау" : "Finish") : t("build.nextWord")}
          </button>
        )}
      </div>
    </div>
  );
}
