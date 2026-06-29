// filepath: src/components/games/WordRainGame.tsx
// Сөз жаңбыры — ЭТАЛОН ДЕҢГЕЙ (аркада).
// Particle эффекттер, алтын сөз (3x), комбо, дыбыс,
// тірі фон (жаңбыр, бұлт жылжу), баяулату power-up.

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/contexts/LangContext";
import { useUserPrefs } from "@/store/userPrefs";
import { useProgress } from "@/store/progressStore";
import { getGameWords, makeOptions, type GameWord } from "@/lib/gamesData";
import { celebrate, celebrateBig } from "@/lib/celebrate";
import {
  playMatch, playWrong, playCombo, playWin, playGameOver, playLevelUp,
  isSoundEnabled, setSoundEnabled,
} from "@/lib/soundFX";
import { CloudRain, Heart, RotateCcw, Trophy, Volume2, VolumeX, Flame, Star, Sparkles } from "lucide-react";
import { GameIntro } from "./SpeedQuizGame";

interface FallingWord {
  id: number;
  word: GameWord;
  x: number;
  y: number;
  speed: number;
  golden: boolean; // алтын сөз (3x ұпай)
}

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
}

interface FloatText {
  id: number;
  x: number;
  y: number;
  text: string;
  color: string;
}

export default function WordRainGame() {
  const { t, lang } = useLang();
  const { prefs } = useUserPrefs();
  const { addXP } = useProgress();

  const [phase, setPhase] = useState<"ready" | "playing" | "over">("ready");
  const [falling, setFalling] = useState<FallingWord[]>([]);
  const [options, setOptions] = useState<string[]>([]);
  const [target, setTarget] = useState<FallingWord | null>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [floatTexts, setFloatTexts] = useState<FloatText[]>([]);
  const [shake, setShake] = useState(false);
  const [soundOn, setSoundOn] = useState(true);

  const allWordsRef = useRef<GameWord[]>([]);
  const nextIdRef = useRef(0);
  const particleIdRef = useRef(0);
  const caughtRef = useRef(0);

  const bestKey = `linguafast_game_wordrain_${prefs.learningLang}`;
  const [best, setBest] = useState(() => {
    try { return parseInt(localStorage.getItem(bestKey) || "0"); } catch { return 0; }
  });

  useEffect(() => { setSoundOn(isSoundEnabled()); }, []);

  const start = () => {
    const all = getGameWords(prefs.learningLang);
    allWordsRef.current = all;
    setFalling([]);
    setScore(0);
    setLives(3);
    setLevel(1);
    setCombo(0);
    setMaxCombo(0);
    setParticles([]);
    setFloatTexts([]);
    caughtRef.current = 0;
    nextIdRef.current = 0;
    setPhase("playing");
    setTimeout(() => spawnWord(), 300);
  };

  // Жаңа сөз
  const spawnWord = useCallback(() => {
    const all = allWordsRef.current;
    if (all.length === 0) return;
    const word = all[Math.floor(Math.random() * all.length)];
    const golden = Math.random() < 0.12; // 12% алтын сөз
    setFalling((prev) => [...prev, {
      id: nextIdRef.current++,
      word,
      x: 12 + Math.random() * 76,
      y: 0,
      speed: 0.28 + Math.random() * 0.18,
      golden,
    }]);
  }, []);

  // Particle жарылыс
  const burst = (x: number, y: number, color: string, count = 8) => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      newParticles.push({ id: particleIdRef.current++, x, y, color });
    }
    setParticles((prev) => [...prev, ...newParticles]);
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => !newParticles.some((np) => np.id === p.id)));
    }, 600);
  };

  // Жүзіп шығатын мәтін
  const floatText = (x: number, y: number, text: string, color: string) => {
    const id = particleIdRef.current++;
    setFloatTexts((prev) => [...prev, { id, x, y, text, color }]);
    setTimeout(() => setFloatTexts((prev) => prev.filter((f) => f.id !== id)), 900);
  };

  // Түсу циклі
  useEffect(() => {
    if (phase !== "playing") return;
    const interval = setInterval(() => {
      setFalling((prev) => {
        const updated = prev.map((w) => ({ ...w, y: w.y + w.speed * (1 + level * 0.15) }));
        const reached = updated.filter((w) => w.y >= 82);
        if (reached.length > 0) {
          reached.forEach((w) => burst(w.x, 85, "#EF4444", 6));
          setShake(true);
          setTimeout(() => setShake(false), 300);
          setCombo(0);
          playWrong();
          setLives((l) => {
            const nl = l - reached.length;
            if (nl <= 0) setTimeout(() => endGame(), 100);
            return Math.max(0, nl);
          });
        }
        return updated.filter((w) => w.y < 82);
      });
    }, 50);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [phase, level]);

  // Сөз қосу мезгілі
  useEffect(() => {
    if (phase !== "playing") return;
    const spawnRate = Math.max(1600 - level * 90, 650);
    const spawner = setInterval(spawnWord, spawnRate);
    return () => clearInterval(spawner);
  }, [phase, level, spawnWord]);

  // Нысана (ең төмендегі сөз)
  useEffect(() => {
    if (phase !== "playing" || falling.length === 0) { setTarget(null); return; }
    const lowest = [...falling].sort((a, b) => b.y - a.y)[0];
    if (lowest && lowest.id !== target?.id) {
      setTarget(lowest);
      setOptions(makeOptions(lowest.word, allWordsRef.current, 3));
    }
    // eslint-disable-next-line
  }, [falling, phase]);

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

  const answer = (option: string) => {
    if (!target) return;
    if (option === target.word.translation) {
      // ДҰРЫС — particle жарылыс
      const isGolden = target.golden;
      burst(target.x, target.y, isGolden ? "#F59E0B" : "#16A34A", isGolden ? 14 : 10);

      const newCombo = combo + 1;
      setCombo(newCombo);
      setMaxCombo((m) => Math.max(m, newCombo));

      const base = 10 + level;
      const comboBonus = newCombo * 2;
      const goldenMult = isGolden ? 3 : 1;
      const points = (base + comboBonus) * goldenMult;
      setScore((s) => s + points);

      floatText(target.x, target.y, `+${points}${isGolden ? " ⭐" : ""}`, isGolden ? "#F59E0B" : "#16A34A");

      if (isGolden) playLevelUp();
      else if (newCombo >= 2) playCombo(newCombo);
      else playMatch();

      setFalling((prev) => prev.filter((w) => w.id !== target.id));
      caughtRef.current++;
      if (caughtRef.current % 5 === 0) {
        setLevel((l) => l + 1);
        playLevelUp();
      }
      setTarget(null);
    } else {
      // ҚАТЕ
      setCombo(0);
      playWrong();
      setShake(true);
      setTimeout(() => setShake(false), 300);
      setLives((l) => {
        const nl = l - 1;
        if (nl <= 0) setTimeout(() => endGame(), 100);
        return Math.max(0, nl);
      });
    }
  };

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
  };

  if (phase === "ready") {
    return (
      <GameIntro
        icon={<CloudRain className="w-8 h-8 text-white" />}
        gradient="from-sky-400 to-blue-600"
        title={lang === "kk" ? "Сөз жаңбыры" : "Word Rain"}
        rule={t("games.rainRule")}
        best={best}
        bestLabel={t("games.best")}
        onStart={start}
        startLabel={t("games.start")}
        extras={
          <div className="flex items-center justify-center gap-3 mb-4 text-xs">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-btn bg-amber-50 text-amber-600">
              <Star className="w-3.5 h-3.5 fill-amber-500" /> {lang === "kk" ? "Алтын сөз = 3x" : "Golden = 3x"}
            </div>
          </div>
        }
      />
    );
  }

  if (phase === "over") {
    const isRecord = score >= best && score > 0;
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        className="card p-8 text-center bg-gradient-to-br from-sky-400/10 to-blue-600/5 border-sky-400/30"
      >
        <Trophy className="w-16 h-16 text-accent-gold mx-auto mb-3" />
        <h3 className="text-4xl font-display font-bold mb-1">{score}</h3>
        <p className="text-text-secondary mb-2">{t("games.finalScore")}</p>
        {isRecord && <motion.p initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-accent-gold font-semibold mb-3">{t("games.newRecord")}</motion.p>}
        <div className="flex items-center justify-center gap-6 mb-5 text-sm">
          <div className="text-center">
            <div className="flex items-center gap-1 justify-center text-accent-blue font-bold text-lg">{level}</div>
            <div className="text-[10px] text-text-muted">{t("games.level")}</div>
          </div>
          <div className="text-center">
            <div className="flex items-center gap-1 justify-center text-accent-gold font-bold text-lg"><Flame className="w-4 h-4" /> {maxCombo}x</div>
            <div className="text-[10px] text-text-muted">{t("rain.combo")}</div>
          </div>
        </div>
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={start} className="btn-primary inline-flex items-center gap-2">
          <RotateCcw className="w-4 h-4" /> {t("games.playAgain")}
        </motion.button>
      </motion.div>
    );
  }

  return (
    <div>
      {/* Панель */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.div key={i} animate={i >= lives ? { scale: [1, 0] } : {}}>
              <Heart className={`w-5 h-5 ${i < lives ? "text-accent-red fill-accent-red" : "text-border"}`} />
            </motion.div>
          ))}
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
          <div className="font-display font-bold text-xl tabular-nums">{score}</div>
          <div className="text-xs font-medium text-accent-blue">{t("games.level")} {level}</div>
          <button onClick={toggleSound} className="text-text-muted hover:text-text-primary">
            {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Ойын алаңы */}
      <motion.div
        animate={shake ? { x: [0, -6, 6, -6, 6, 0] } : {}}
        transition={{ duration: 0.3 }}
        className="relative h-80 rounded-card bg-gradient-to-b from-sky-100 via-sky-50 to-blue-100 border border-sky-200 overflow-hidden mb-4"
      >
        {/* Жылжитын бұлттар */}
        <motion.div animate={{ x: [0, 30, 0] }} transition={{ duration: 12, repeat: Infinity }} className="absolute top-3 left-6 w-16 h-6 bg-white/70 rounded-full blur-sm" />
        <motion.div animate={{ x: [0, -25, 0] }} transition={{ duration: 15, repeat: Infinity }} className="absolute top-8 right-10 w-20 h-7 bg-white/60 rounded-full blur-sm" />
        <motion.div animate={{ x: [0, 20, 0] }} transition={{ duration: 18, repeat: Infinity }} className="absolute top-16 left-1/3 w-14 h-5 bg-white/50 rounded-full blur-sm" />

        {/* Жаңбыр тамшылары (атмосфера) */}
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={`drop-${i}`}
            className="absolute w-0.5 h-3 bg-sky-300/40 rounded-full"
            style={{ left: `${10 + i * 11}%` }}
            animate={{ y: [-10, 320] }}
            transition={{ duration: 1.5 + (i % 3) * 0.3, repeat: Infinity, delay: i * 0.2, ease: "linear" }}
          />
        ))}

        {/* Жер */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-green-300/70 to-transparent" />
        {/* Қауіп сызығы */}
        <div className="absolute bottom-12 left-0 right-0 h-px bg-accent-red/30 border-dashed" />

        {/* Particle жарылыстар */}
        <AnimatePresence>
          {particles.map((p) => {
            const angle = (p.id % 8) * 45 * (Math.PI / 180);
            return (
              <motion.div
                key={p.id}
                initial={{ left: `${p.x}%`, top: `${p.y}%`, opacity: 1, scale: 1 }}
                animate={{
                  left: `${p.x + Math.cos(angle) * 15}%`,
                  top: `${p.y + Math.sin(angle) * 15}%`,
                  opacity: 0, scale: 0,
                }}
                transition={{ duration: 0.6 }}
                className="absolute w-2 h-2 rounded-full -translate-x-1/2 -translate-y-1/2"
                style={{ backgroundColor: p.color }}
              />
            );
          })}
        </AnimatePresence>

        {/* Жүзіп шығатын мәтін */}
        <AnimatePresence>
          {floatTexts.map((f) => (
            <motion.div
              key={f.id}
              initial={{ left: `${f.x}%`, top: `${f.y}%`, opacity: 1, scale: 0.8 }}
              animate={{ top: `${f.y - 15}%`, opacity: 0, scale: 1.3 }}
              transition={{ duration: 0.9 }}
              className="absolute -translate-x-1/2 font-display font-bold text-lg pointer-events-none z-10"
              style={{ color: f.color }}
            >
              {f.text}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Түсіп жатқан сөздер */}
        <AnimatePresence>
          {falling.map((w) => (
            <motion.div
              key={w.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: w.id === target?.id ? 1.1 : 1 }}
              exit={{ opacity: 0, scale: 1.5 }}
              style={{ left: `${w.x}%`, top: `${w.y}%` }}
              className={`absolute -translate-x-1/2 px-3 py-1.5 rounded-btn font-bold whitespace-nowrap shadow-card ${
                w.golden
                  ? "bg-gradient-to-r from-amber-300 to-yellow-400 text-amber-900 ring-2 ring-amber-300"
                  : w.id === target?.id
                    ? "bg-accent-blue text-white ring-2 ring-accent-blue/30"
                    : "bg-white text-text-primary"
              } ${w.word.lang === "zh" ? "text-lg" : "text-sm"}`}
            >
              {w.golden && <Sparkles className="w-3 h-3 inline mr-1" />}
              {w.word.term}
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Жауаптар */}
      <div className="grid grid-cols-3 gap-2">
        {options.map((opt) => (
          <motion.button
            key={opt}
            onClick={() => answer(opt)}
            whileTap={{ scale: 0.95 }}
            className={`card p-3 text-sm font-medium hover:bg-surface-2 transition-all ${
              target?.golden ? "hover:border-amber-400/50" : "hover:border-sky-400/50"
            }`}
          >
            {opt}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
