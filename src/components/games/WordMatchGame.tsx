// filepath: src/components/games/WordMatchGame.tsx
// Сөз сәйкестігі — ЭТАЛОН ДЕҢГЕЙ.
// Деңгейлер, комбо көбейткіш, таймер бонусы, дыбыс әсерлері,
// әсем анимация (жұп бірігу, діріл, жұлдыздар), прогресс сезімі.

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/contexts/LangContext";
import { useUserPrefs } from "@/store/userPrefs";
import { useProgress } from "@/store/progressStore";
import { getGameWords, shuffle } from "@/lib/gamesData";
import { celebrate, celebrateBig } from "@/lib/celebrate";
import { speak } from "@/lib/speech";
import {
  playMatch, playWrong, playTap, playCombo, playLevelUp, playWin, isSoundEnabled, setSoundEnabled,
} from "@/lib/soundFX";
import { Grid3x3, RotateCcw, Trophy, Star, Flame, Volume2, VolumeX, Zap } from "lucide-react";

interface Tile {
  id: string;
  text: string;
  pairId: string;
  type: "term" | "translation";
  matched: boolean;
  lang: "en" | "zh";
}

// Деңгей конфигурациясы (қиындай береді)
const LEVELS = [
  { pairs: 4, time: 40, label: { kk: "Жеңіл", en: "Easy" } },
  { pairs: 6, time: 50, label: { kk: "Орта", en: "Medium" } },
  { pairs: 8, time: 60, label: { kk: "Қиын", en: "Hard" } },
];

export default function WordMatchGame() {
  const { t, lang } = useLang();
  const { prefs } = useUserPrefs();
  const { addXP } = useProgress();

  const [phase, setPhase] = useState<"ready" | "playing" | "levelDone" | "gameDone">("ready");
  const [levelIdx, setLevelIdx] = useState(0);
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [wrongPair, setWrongPair] = useState<string[]>([]);
  const [justMatched, setJustMatched] = useState<string[]>([]);
  const [matches, setMatches] = useState(0);

  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [score, setScore] = useState(0);
  const [levelScore, setLevelScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [stars, setStars] = useState(0);
  const [soundOn, setSoundOn] = useState(true);
  const [floatingPoints, setFloatingPoints] = useState<{ id: number; x: number; y: number; text: string }[]>([]);
  const pointIdRef = useRef(0);

  const level = LEVELS[levelIdx];

  // Рекорд
  const bestKey = `linguafast_game_match_${prefs.learningLang}`;
  const [best, setBest] = useState(() => {
    try { return parseInt(localStorage.getItem(bestKey) || "0"); } catch { return 0; }
  });

  useEffect(() => { setSoundOn(isSoundEnabled()); }, []);

  // Деңгейді бастау
  const startLevel = useCallback((idx: number, keepScore: boolean) => {
    const cfg = LEVELS[idx];
    const words = getGameWords(prefs.learningLang, cfg.pairs);
    const newTiles: Tile[] = [];
    words.forEach((w, i) => {
      newTiles.push({ id: `t${i}`, text: w.term, pairId: `p${i}`, type: "term", matched: false, lang: w.lang });
      newTiles.push({ id: `r${i}`, text: w.translation, pairId: `p${i}`, type: "translation", matched: false, lang: w.lang });
    });
    setTiles(shuffle(newTiles));
    setSelected(null);
    setWrongPair([]);
    setJustMatched([]);
    setMatches(0);

    setCombo(0);
    setLevelScore(0);
    setTimeLeft(cfg.time);
    if (!keepScore) { setScore(0); setMaxCombo(0); }
    setPhase("playing");
  }, [prefs.learningLang]);

  const startGame = () => { setLevelIdx(0); startLevel(0, false); };

  // Таймер
  useEffect(() => {
    if (phase !== "playing") return;
    if (timeLeft <= 0) {
      // Уақыт бітті — деңгейді аяқтау (жартылай)
      finishLevel();
      return;
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line
  }, [timeLeft, phase]);

  // Деңгей бітті ме (барлық жұп табылды)
  useEffect(() => {
    if (phase === "playing" && matches === level.pairs && level.pairs > 0) {
      finishLevel();
    }
    // eslint-disable-next-line
  }, [matches, phase]);

  const finishLevel = () => {
    // Уақыт бонусы
    const timeBonus = timeLeft * 5;
    const finalLevelScore = levelScore + timeBonus;
    const newTotal = score + finalLevelScore;
    setScore(newTotal);
    setLevelScore(finalLevelScore);

    // Жұлдыз есептеу (қанша жұп тапты + уақыт)
    const completion = matches / level.pairs;
    let s = 1;
    if (completion >= 1 && timeLeft > level.time * 0.4) s = 3;
    else if (completion >= 1) s = 2;
    else if (completion >= 0.6) s = 1;
    else s = 0;
    setStars(s);

    if (matches === level.pairs) {
      playLevelUp();
      celebrate();
    }

    // Соңғы деңгей бе
    if (levelIdx + 1 >= LEVELS.length || matches < level.pairs) {
      setTimeout(() => {
        setPhase("gameDone");
        if (newTotal > best) {
          setBest(newTotal);
          try { localStorage.setItem(bestKey, String(newTotal)); } catch { /* */ }
          playWin();
          celebrateBig();
        }
        addXP(Math.floor(newTotal / 3));
      }, 400);
    } else {
      setPhase("levelDone");
    }
  };

  const nextLevel = () => {
    const ni = levelIdx + 1;
    setLevelIdx(ni);
    startLevel(ni, true);
  };

  // Жүзіп шығатын ұпай көрсету
  const showFloatingPoint = (text: string) => {
    const id = pointIdRef.current++;
    setFloatingPoints((prev) => [...prev, { id, x: 50, y: 50, text }]);
    setTimeout(() => setFloatingPoints((prev) => prev.filter((p) => p.id !== id)), 1000);
  };

  const handleTileClick = (tile: Tile) => {
    if (tile.matched || wrongPair.length > 0 || phase !== "playing") return;
    playTap();
    if (tile.type === "term") speak(tile.text, tile.lang);

    if (!selected) { setSelected(tile.id); return; }
    if (selected === tile.id) { setSelected(null); return; }

    const first = tiles.find((t) => t.id === selected)!;


    if (first.pairId === tile.pairId && first.type !== tile.type) {
      // ДҰРЫС ЖҰП
      const newCombo = combo + 1;
      setCombo(newCombo);
      setMaxCombo((m) => Math.max(m, newCombo));

      // Ұпай: негізгі + комбо көбейткіш
      const points = 100 + (newCombo - 1) * 25;
      setLevelScore((s) => s + points);
      showFloatingPoint(`+${points}`);

      if (newCombo >= 2) playCombo(newCombo);
      else playMatch();

      setJustMatched([selected, tile.id]);
      setTimeout(() => {
        setTiles((prev) => prev.map((t) => t.pairId === tile.pairId ? { ...t, matched: true } : t));
        setMatches((m) => m + 1);
        setJustMatched([]);
      }, 400);
      setSelected(null);
    } else {
      // ҚАТЕ
      setCombo(0);
      playWrong();
      setWrongPair([selected, tile.id]);
      setTimeout(() => { setWrongPair([]); setSelected(null); }, 600);
    }
  };

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
  };

  // Плитка стилі
  const tileClass = (tile: Tile) => {
    if (tile.matched) return "opacity-0 scale-50 pointer-events-none";
    if (justMatched.includes(tile.id)) return "bg-accent-green border-accent-green text-white scale-105 shadow-card-hover";
    if (wrongPair.includes(tile.id)) return "bg-accent-red/15 border-accent-red text-accent-red";
    if (selected === tile.id) return "bg-accent-purple/20 border-accent-purple text-accent-purple scale-95 shadow-card";
    return "bg-surface border-border hover:border-accent-purple/50 hover:bg-surface-2 hover:scale-[1.02]";
  };

  // ── ДАЙЫНДЫҚ ЭКРАНЫ ──
  if (phase === "ready") {
    return (
      <div className="card overflow-hidden">
        <div className="bg-gradient-to-br from-violet-500 to-purple-600 p-8 text-center relative overflow-hidden">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/10 blur-2xl"
          />
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", delay: 0.1 }}
            className="relative w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-4"
          >
            <Grid3x3 className="w-10 h-10 text-white" />
          </motion.div>
          <h2 className="relative text-2xl font-display font-bold text-white mb-2">
            {lang === "kk" ? "Сөз сәйкестігі" : "Word Match"}
          </h2>
          <p className="relative text-white/80 text-sm max-w-sm mx-auto">{t("games.matchRule")}</p>
        </div>
        <div className="p-6 text-center">
          {/* Деңгейлер алдын ала көрсету */}
          <div className="flex items-center justify-center gap-2 mb-4">
            {LEVELS.map((lv, i) => (
              <div key={i} className="px-3 py-1.5 rounded-btn bg-surface-2 text-xs font-medium">
                {lv.label[lang]} · {lv.pairs}
              </div>
            ))}
          </div>
          {best > 0 && (
            <p className="text-sm text-text-secondary mb-4">
              {t("games.best")}: <span className="font-bold text-text-primary">{best}</span>
            </p>
          )}
          <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={startGame}
            className="btn-primary text-base px-8 py-3"
          >
            {t("games.start")}
          </motion.button>
        </div>
      </div>
    );
  }

  // ── ДЕҢГЕЙ БІТТІ ──
  if (phase === "levelDone") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        className="card p-8 text-center bg-gradient-to-br from-violet-500/10 to-purple-600/5 border-violet-500/30"
      >
        <div className="flex items-center justify-center gap-2 mb-3">
          {[1, 2, 3].map((s) => (
            <motion.div key={s} initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: s * 0.15 }}>
              <Star className={`w-10 h-10 ${s <= stars ? "text-accent-gold fill-accent-gold" : "text-border"}`} />
            </motion.div>
          ))}
        </div>
        <h3 className="text-2xl font-display font-bold mb-1">{t("match.levelComplete")}</h3>
        <p className="text-text-secondary mb-1">+{levelScore} {t("games.score").toLowerCase()}</p>
        <p className="text-sm text-text-muted mb-5">{t("match.totalScore")}: {score}</p>
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={nextLevel} className="btn-primary inline-flex items-center gap-2">
          <Zap className="w-4 h-4" /> {t("match.nextLevel")} ({LEVELS[levelIdx + 1].label[lang]})
        </motion.button>
      </motion.div>
    );
  }

  // ── ОЙЫН БІТТІ ──
  if (phase === "gameDone") {
    const isRecord = score >= best && score > 0;
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        className="card p-8 text-center bg-gradient-to-br from-violet-500/10 to-purple-600/5 border-violet-500/30"
      >
        <Trophy className="w-16 h-16 text-accent-gold mx-auto mb-3" />
        <h3 className="text-4xl font-display font-bold mb-1">{score}</h3>
        <p className="text-text-secondary mb-2">{t("match.totalScore")}</p>
        {isRecord && (
          <motion.p initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-accent-gold font-semibold mb-2">
            {t("games.newRecord")}
          </motion.p>
        )}
        <div className="flex items-center justify-center gap-4 text-sm text-text-muted mb-5">
          <span className="flex items-center gap-1"><Flame className="w-4 h-4 text-accent-gold" /> {maxCombo}x</span>
        </div>
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={startGame} className="btn-primary inline-flex items-center gap-2">
          <RotateCcw className="w-4 h-4" /> {t("games.playAgain")}
        </motion.button>
      </motion.div>
    );
  }

  // ── ОЙЫН ЭКРАНЫ ──
  const timePercent = (timeLeft / level.time) * 100;
  return (
    <div className="relative">
      {/* Жоғарғы панель */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="px-2.5 py-1 rounded-btn bg-accent-purple/15 text-accent-purple text-xs font-bold">
            {t("match.level")} {levelIdx + 1}
          </div>
          <span className="text-xs text-text-muted">{level.pairs - matches} {t("match.pairsLeft")}</span>
        </div>
        <div className="flex items-center gap-3">
          {/* Комбо */}
          <AnimatePresence>
            {combo > 1 && (
              <motion.div
                key={combo}
                initial={{ scale: 1.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }}
                className="flex items-center gap-1 text-accent-gold font-bold text-sm"
              >
                <Flame className="w-4 h-4" /> {combo}x
              </motion.div>
            )}
          </AnimatePresence>
          {/* Ұпай */}
          <div className="font-display font-bold text-lg">{score + levelScore}</div>
          {/* Дыбыс */}
          <button onClick={toggleSound} className="text-text-muted hover:text-text-primary">
            {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Таймер жолағы */}
      <div className="h-1.5 rounded-full bg-border overflow-hidden mb-5">
        <motion.div
          className={`h-full rounded-full ${timeLeft <= 10 ? "bg-accent-red" : "bg-gradient-to-r from-violet-500 to-purple-600"}`}
          animate={{ width: `${timePercent}%` }}
          transition={{ duration: 1, ease: "linear" }}
        />
      </div>

      {/* Жүзіп шығатын ұпай */}
      <AnimatePresence>
        {floatingPoints.map((fp) => (
          <motion.div
            key={fp.id}
            initial={{ opacity: 1, y: 0, scale: 1 }}
            animate={{ opacity: 0, y: -50, scale: 1.3 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute left-1/2 top-1/3 -translate-x-1/2 text-accent-green font-display font-bold text-2xl pointer-events-none z-10"
          >
            {fp.text}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Плиткалар торы */}
      <motion.div
        className={`grid gap-2.5 ${level.pairs <= 4 ? "grid-cols-3 sm:grid-cols-4" : level.pairs <= 6 ? "grid-cols-3 sm:grid-cols-4" : "grid-cols-4"}`}
        animate={wrongPair.length > 0 ? { x: [0, -8, 8, -8, 8, 0] } : {}}
        transition={{ duration: 0.4 }}
      >
        {tiles.map((tile) => (
          <motion.button
            key={tile.id}
            onClick={() => handleTileClick(tile)}
            layout
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            disabled={tile.matched}
            className={`aspect-[4/3] rounded-card border-2 flex items-center justify-center p-2 text-center transition-all duration-300 ${tileClass(tile)}`}
          >
            <span className={`font-medium leading-tight ${
              tile.type === "term" ? "text-base" : "text-sm"
            } ${tile.lang === "zh" && tile.type === "term" ? "text-2xl" : ""}`}>
              {tile.text}
            </span>
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}
