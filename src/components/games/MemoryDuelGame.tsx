// filepath: src/components/games/MemoryDuelGame.tsx
// Жады дуэлі — ЭТАЛОН ДЕҢГЕЙ.
// Деңгейлер (4→6→8 жұп), комбо, дыбыс, particle жарқыл,
// жұлдыз баға, жетілдірілген 3D карта айналу, жүзіп шығатын ұпай.

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/contexts/LangContext";
import { useUserPrefs } from "@/store/userPrefs";
import { useProgress } from "@/store/progressStore";
import { getGameWords, shuffle } from "@/lib/gamesData";
import { celebrate, celebrateBig } from "@/lib/celebrate";
import { speak } from "@/lib/speech";
import {
  playMatch, playWrong, playCombo, playWin, playLevelUp, playTap,
  isSoundEnabled, setSoundEnabled,
} from "@/lib/soundFX";
import { Brain, RotateCcw, Trophy, Sparkles, Star, Flame, Volume2, VolumeX, Zap } from "lucide-react";

interface MemoryCard {
  id: string;
  text: string;
  pairId: string;
  type: "term" | "translation";
  lang: "en" | "zh";
  flipped: boolean;
  matched: boolean;
}

// Деңгейлер
const LEVELS = [
  { pairs: 4, label: { kk: "Жеңіл", en: "Easy" } },
  { pairs: 6, label: { kk: "Орта", en: "Medium" } },
  { pairs: 8, label: { kk: "Қиын", en: "Hard" } },
];

export default function MemoryDuelGame() {
  const { t, lang } = useLang();
  const { prefs } = useUserPrefs();
  const { addXP } = useProgress();

  const [phase, setPhase] = useState<"ready" | "playing" | "levelDone" | "gameDone">("ready");
  const [levelIdx, setLevelIdx] = useState(0);
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flipped, setFlipped] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [matched, setMatched] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [score, setScore] = useState(0);
  const [levelScore, setLevelScore] = useState(0);
  const [locked, setLocked] = useState(false);
  const [stars, setStars] = useState(0);
  const [matchedFlash, setMatchedFlash] = useState<string | null>(null);
  const [soundOn, setSoundOn] = useState(true);

  const level = LEVELS[levelIdx];

  const bestKey = `linguafast_game_memory_${prefs.learningLang}`;
  const [best, setBest] = useState(() => {
    try { return parseInt(localStorage.getItem(bestKey) || "0"); } catch { return 0; }
  });

  useEffect(() => { setSoundOn(isSoundEnabled()); }, []);

  const startLevel = (idx: number, keepScore: boolean) => {
    const cfg = LEVELS[idx];
    const words = getGameWords(prefs.learningLang, cfg.pairs);
    const newCards: MemoryCard[] = [];
    words.forEach((w, i) => {
      newCards.push({ id: `t${i}`, text: w.term, pairId: `p${i}`, type: "term", lang: w.lang, flipped: false, matched: false });
      newCards.push({ id: `r${i}`, text: w.translation, pairId: `p${i}`, type: "translation", lang: w.lang, flipped: false, matched: false });
    });
    setCards(shuffle(newCards));
    setFlipped([]);
    setMoves(0);
    setMatched(0);
    setCombo(0);
    setLevelScore(0);
    setLocked(false);
    if (!keepScore) { setScore(0); setMaxCombo(0); }
    setPhase("playing");
  };

  const startGame = () => { setLevelIdx(0); startLevel(0, false); };

  const flipCard = (card: MemoryCard) => {
    if (locked || card.flipped || card.matched || flipped.length >= 2) return;
    playTap();
    if (card.type === "term") speak(card.text, card.lang);

    const newFlipped = [...flipped, card.id];
    setCards((prev) => prev.map((c) => c.id === card.id ? { ...c, flipped: true } : c));
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      setLocked(true);
      const firstCard = cards.find((c) => c.id === newFlipped[0])!;
      const secondCard = card;

      if (firstCard.pairId === secondCard.pairId && firstCard.type !== secondCard.type) {
        // ЖҰП ТАБЫЛДЫ
        const newCombo = combo + 1;
        setCombo(newCombo);
        setMaxCombo((m) => Math.max(m, newCombo));
        const points = 100 + (newCombo - 1) * 25;
        setLevelScore((s) => s + points);

        setMatchedFlash(secondCard.pairId);
        setTimeout(() => setMatchedFlash(null), 600);

        if (newCombo >= 2) playCombo(newCombo);
        else playMatch();

        setTimeout(() => {
          setCards((prev) => prev.map((c) => c.pairId === secondCard.pairId ? { ...c, matched: true } : c));
          setMatched((m) => m + 1);
          setFlipped([]);
          setLocked(false);
        }, 600);
      } else {
        // СӘЙКЕС ЕМЕС
        setCombo(0);
        playWrong();
        setTimeout(() => {
          setCards((prev) => prev.map((c) => newFlipped.includes(c.id) ? { ...c, flipped: false } : c));
          setFlipped([]);
          setLocked(false);
        }, 1000);
      }
    }
  };

  // Деңгей бітті ме
  useEffect(() => {
    if (phase === "playing" && matched === level.pairs && level.pairs > 0) {
      finishLevel();
    }
    // eslint-disable-next-line
  }, [matched, phase]);

  const finishLevel = () => {
    // Жұлдыз: аз қадам = көп жұлдыз
    const perfect = level.pairs;       // мінсіз қадам саны
    const ratio = perfect / Math.max(moves, 1);
    let s = 1;
    if (ratio >= 0.8) s = 3;
    else if (ratio >= 0.55) s = 2;
    else s = 1;
    setStars(s);

    const starBonus = s * 50;
    const finalLevelScore = levelScore + starBonus;
    const newTotal = score + finalLevelScore;
    setScore(newTotal);
    setLevelScore(finalLevelScore);

    playLevelUp();
    celebrate();

    if (levelIdx + 1 >= LEVELS.length) {
      setTimeout(() => {
        setPhase("gameDone");
        if (newTotal > best) {
          setBest(newTotal);
          try { localStorage.setItem(bestKey, String(newTotal)); } catch { /* */ }
          playWin();
          celebrateBig();
        }
        addXP(Math.floor(newTotal / 3));
      }, 500);
    } else {
      setPhase("levelDone");
    }
  };

  const nextLevel = () => {
    const ni = levelIdx + 1;
    setLevelIdx(ni);
    startLevel(ni, true);
  };

  const toggleSound = () => {
    const n = !soundOn;
    setSoundOn(n);
    setSoundEnabled(n);
  };

  // ── ДАЙЫНДЫҚ ──
  if (phase === "ready") {
    return (
      <div className="card overflow-hidden">
        <div className="bg-gradient-to-br from-cyan-400 to-teal-600 p-8 text-center relative overflow-hidden">
          <motion.div animate={{ rotate: [0, 8, -8, 0] }} transition={{ duration: 5, repeat: Infinity }}
            className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
          <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", delay: 0.1 }}
            className="relative w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-4">
            <Brain className="w-10 h-10 text-white" />
          </motion.div>
          <h2 className="relative text-2xl font-display font-bold text-white mb-2">{lang === "kk" ? "Жады дуэлі" : "Memory Duel"}</h2>
          <p className="relative text-white/80 text-sm max-w-sm mx-auto">{t("games.memoryRule")}</p>
        </div>
        <div className="p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            {LEVELS.map((lv, i) => (
              <div key={i} className="px-3 py-1.5 rounded-btn bg-surface-2 text-xs font-medium">
                {lv.label[lang]} · {lv.pairs}
              </div>
            ))}
          </div>
          {best > 0 && <p className="text-sm text-text-secondary mb-4">{t("games.best")}: <span className="font-bold text-text-primary">{best}</span></p>}
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={startGame} className="btn-primary text-base px-8 py-3">
            {t("games.start")}
          </motion.button>
        </div>
      </div>
    );
  }

  // ── ДЕҢГЕЙ БІТТІ ──
  if (phase === "levelDone") {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        className="card p-8 text-center bg-gradient-to-br from-cyan-400/10 to-teal-600/5 border-cyan-400/30">
        <div className="flex items-center justify-center gap-2 mb-3">
          {[1, 2, 3].map((s) => (
            <motion.div key={s} initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: s * 0.15 }}>
              <Star className={`w-10 h-10 ${s <= stars ? "text-accent-gold fill-accent-gold" : "text-border"}`} />
            </motion.div>
          ))}
        </div>
        <h3 className="text-2xl font-display font-bold mb-1">{t("mem.levelDone")}</h3>
        <p className="text-text-secondary mb-1">+{levelScore} {t("games.score").toLowerCase()}</p>
        <p className="text-sm text-text-muted mb-5">{t("mem.totalScore")}: {score}</p>
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={nextLevel} className="btn-primary inline-flex items-center gap-2">
          <Zap className="w-4 h-4" /> {t("mem.nextLevel")} ({LEVELS[levelIdx + 1].label[lang]})
        </motion.button>
      </motion.div>
    );
  }

  // ── ОЙЫН БІТТІ ──
  if (phase === "gameDone") {
    const isRecord = score >= best && score > 0;
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        className="card p-8 text-center bg-gradient-to-br from-cyan-400/10 to-teal-600/5 border-cyan-400/30">
        <Trophy className="w-16 h-16 text-accent-gold mx-auto mb-3" />
        <h3 className="text-4xl font-display font-bold mb-1">{score}</h3>
        <p className="text-text-secondary mb-2">{t("mem.totalScore")}</p>
        {isRecord && <motion.p initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-accent-gold font-semibold mb-3">{t("games.newRecord")}</motion.p>}
        <div className="flex items-center justify-center gap-1 mb-5 text-sm text-text-muted">
          <Flame className="w-4 h-4 text-accent-gold" /> {maxCombo}x {t("mem.combo").toLowerCase()}
        </div>
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={startGame} className="btn-primary inline-flex items-center gap-2">
          <RotateCcw className="w-4 h-4" /> {t("games.playAgain")}
        </motion.button>
      </motion.div>
    );
  }

  // ── ОЙЫН ──
  return (
    <div>
      {/* Панель */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="px-2.5 py-1 rounded-btn bg-accent-cyan/15 text-accent-cyan text-xs font-bold">
            {t("mem.level")} {levelIdx + 1}
          </div>
          <span className="text-xs text-text-muted">{matched}/{level.pairs} {t("mem.pairs").toLowerCase()}</span>
        </div>
        <div className="flex items-center gap-3">
          <AnimatePresence>
            {combo > 1 && (
              <motion.div key={combo} initial={{ scale: 1.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }}
                className="flex items-center gap-1 text-accent-gold font-bold text-sm">
                <Flame className="w-4 h-4" /> {combo}x
              </motion.div>
            )}
          </AnimatePresence>
          <div className="font-display font-bold text-lg tabular-nums">{score + levelScore}</div>
          <span className="text-xs text-text-muted">{moves} {t("mem.moves").toLowerCase()}</span>
          <button onClick={toggleSound} className="text-text-muted hover:text-text-primary">
            {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Карталар торы */}
      <div className={`grid gap-2.5 ${level.pairs <= 4 ? "grid-cols-4" : level.pairs <= 6 ? "grid-cols-4" : "grid-cols-4 sm:grid-cols-4"}`}>
        {cards.map((card) => {
          const showFace = card.flipped || card.matched;
          const isFlashing = matchedFlash === card.pairId;
          return (
            <button
              key={card.id}
              onClick={() => flipCard(card)}
              disabled={showFace || locked}
              className="aspect-[3/4] [perspective:1000px]"
            >
              <motion.div
                className="relative w-full h-full [transform-style:preserve-3d]"
                animate={{ rotateY: showFace ? 180 : 0, scale: isFlashing ? [1, 1.08, 1] : 1 }}
                transition={{ rotateY: { duration: 0.5 }, scale: { duration: 0.4 } }}
              >
                {/* Артқы жағы */}
                <div className="absolute inset-0 [backface-visibility:hidden] rounded-card bg-gradient-to-br from-cyan-400 to-teal-600 flex items-center justify-center overflow-hidden">
                  <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }}>
                    <Sparkles className="w-6 h-6 text-white/60" />
                  </motion.div>
                </div>
                {/* Алдыңғы жағы */}
                <div className={`absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-card border-2 flex items-center justify-center p-2 text-center transition-colors ${
                  card.matched
                    ? "bg-accent-green/15 border-accent-green/50"
                    : isFlashing
                      ? "bg-accent-green border-accent-green"
                      : "bg-surface border-accent-cyan/40"
                }`}>
                  <span className={`font-medium leading-tight ${
                    card.lang === "zh" && card.type === "term" ? "text-2xl" : card.type === "term" ? "text-sm sm:text-base" : "text-xs sm:text-sm"
                  } ${isFlashing ? "text-white" : card.matched ? "text-accent-green" : "text-text-primary"}`}>
                    {card.text}
                  </span>
                </div>
              </motion.div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
