// filepath: src/pages/LeaderboardPage.tsx
// Рейтинг беті — қолданушының нақты XP/апталық белсенділігі үлгі оқушылар
// арасында орналастырылады (backend жоқ — басқа оқушылар demo деректер).
// Топ-3 подиум + толық тізім, қолданушы жолы ерекшеленеді.

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useLang } from "@/contexts/LangContext";
import { useProgress, levelFromXP } from "@/store/progressStore";
import { useUserPrefs } from "@/store/userPrefs";
import { Trophy, Crown, Flame, Medal } from "lucide-react";

type Period = "weekly" | "alltime";

interface Learner {
  id: string;
  name: string;
  score: number;
  isUser?: boolean;
}

// Үлгі оқушылар (demo) — есімдер мен базалық ұпайлар тұрақты
const MOCK: { name: string; alltime: number; weekly: number }[] = [
  { name: "Аружан", alltime: 4820, weekly: 720 },
  { name: "Дамир", alltime: 3940, weekly: 540 },
  { name: "Әлия", alltime: 3510, weekly: 880 },
  { name: "Темірлан", alltime: 2980, weekly: 410 },
  { name: "Мадина", alltime: 2670, weekly: 620 },
  { name: "Нұрсұлтан", alltime: 2240, weekly: 300 },
  { name: "Айгерім", alltime: 1980, weekly: 750 },
  { name: "Ержан", alltime: 1610, weekly: 260 },
  { name: "Камила", alltime: 1340, weekly: 480 },
  { name: "Алихан", alltime: 1080, weekly: 190 },
  { name: "Дана", alltime: 820, weekly: 360 },
  { name: "Бекзат", alltime: 560, weekly: 140 },
  { name: "Жанель", alltime: 390, weekly: 220 },
  { name: "Олжас", alltime: 210, weekly: 90 },
];

// Аватар түсі (атқа қарай тұрақты)
const AVATAR_COLORS = [
  "bg-accent-blue", "bg-accent-purple", "bg-accent-green",
  "bg-accent-gold", "bg-accent-pink", "bg-accent-cyan", "bg-accent-red",
];
function avatarColor(name: string): string {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}
function initial(name: string): string {
  return name.trim().charAt(0).toUpperCase() || "?";
}

export default function LeaderboardPage() {
  const { lang } = useLang();
  const { progress } = useProgress();
  const { prefs } = useUserPrefs();
  const [period, setPeriod] = useState<Period>("weekly");

  const userName = prefs.name?.trim() || (lang === "kk" ? "Сіз" : "You");

  // Қолданушының апталық ұпайы (соңғы 7 күн минут × 10)
  const weeklyScore = useMemo(() => {
    const wm = progress.weeklyMinutes || {};
    const today = new Date();
    let sum = 0;
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      sum += wm[d.toISOString().slice(0, 10)] || 0;
    }
    return sum * 10;
  }, [progress.weeklyMinutes]);

  // Толық рейтинг тізімі (қолданушы + үлгі оқушылар, сұрыпталған)
  const list: Learner[] = useMemo(() => {
    const userScore = period === "alltime" ? progress.xp : weeklyScore;
    const others: Learner[] = MOCK.map((m) => ({
      id: m.name,
      name: m.name,
      score: period === "alltime" ? m.alltime : m.weekly,
    }));
    const all = [...others, { id: "__user__", name: userName, score: userScore, isUser: true }];
    all.sort((a, b) => b.score - a.score);
    return all;
  }, [period, progress.xp, weeklyScore, userName]);

  const userRank = list.findIndex((l) => l.isUser) + 1;
  const top3 = list.slice(0, 3);
  const rest = list.slice(3);
  const podiumOrder = [top3[1], top3[0], top3[2]]; // 2-1-3 көрнісі

  return (
    <div className="max-w-3xl mx-auto">
      {/* Тақырып */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-12 h-12 rounded-card bg-accent-gold/15 flex items-center justify-center">
          <Trophy className="w-7 h-7 text-accent-gold" />
        </div>
        <div>
          <h1 className="text-2xl font-display font-bold">{lang === "kk" ? "Рейтинг" : "Leaderboard"}</h1>
          <p className="text-sm text-text-secondary">
            {lang === "kk" ? "Басқа оқушылармен жарысыңыз" : "Compete with other learners"}
          </p>
        </div>
      </div>

      {/* Кезең ауыстырғышы */}
      <div className="flex gap-2 mb-6 bg-surface-2 p-1 rounded-card w-fit">
        {([["weekly", lang === "kk" ? "Осы апта" : "This week"], ["alltime", lang === "kk" ? "Барлық уақыт" : "All-time"]] as const).map(([val, label]) => (
          <button
            key={val}
            onClick={() => setPeriod(val)}
            className={`px-4 py-1.5 rounded-btn text-sm font-medium transition-all ${period === val ? "bg-surface shadow-sm text-text-primary" : "text-text-secondary hover:text-text-primary"}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Подиум (топ-3) */}
      <div className="grid grid-cols-3 gap-3 items-end mb-6">
        {podiumOrder.map((l, i) => {
          if (!l) return <div key={i} />;
          const place = list.indexOf(l) + 1;
          const heights = { 1: "h-32", 2: "h-24", 3: "h-20" } as Record<number, string>;
          const ring = place === 1 ? "ring-accent-gold" : place === 2 ? "ring-slate-300" : "ring-amber-600";
          return (
            <motion.div
              key={l.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center"
            >
              {place === 1 && <Crown className="w-6 h-6 text-accent-gold mb-1" />}
              <div className={`relative w-16 h-16 rounded-full ${avatarColor(l.name)} flex items-center justify-center text-white font-display font-bold text-xl ring-4 ${ring} ${l.isUser ? "ring-offset-2 ring-offset-bg" : ""}`}>
                {initial(l.name)}
              </div>
              <span className="mt-2 text-sm font-semibold truncate max-w-full">{l.name}</span>
              <span className="text-xs text-text-secondary mb-2">{l.score.toLocaleString()} XP</span>
              <div className={`w-full ${heights[place]} rounded-t-card flex items-start justify-center pt-2 font-display font-bold text-2xl ${
                place === 1 ? "bg-accent-gold/20 text-accent-gold" : place === 2 ? "bg-slate-200/60 text-slate-500" : "bg-amber-600/15 text-amber-600"
              }`}>
                {place}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Қалған тізім */}
      <div className="card divide-y divide-border overflow-hidden">
        {rest.map((l) => {
          const place = list.indexOf(l) + 1;
          return (
            <div
              key={l.id}
              className={`flex items-center gap-3 p-3 ${l.isUser ? "bg-accent-green/10" : ""}`}
            >
              <span className="w-6 text-center font-semibold text-text-secondary text-sm">{place}</span>
              <div className={`w-10 h-10 rounded-full ${avatarColor(l.name)} flex items-center justify-center text-white font-bold shrink-0`}>
                {initial(l.name)}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-medium truncate ${l.isUser ? "text-accent-green" : ""}`}>
                  {l.name} {l.isUser && <span className="text-xs">({lang === "kk" ? "сіз" : "you"})</span>}
                </p>
                <p className="text-xs text-text-muted">{lang === "kk" ? "Деңгей" : "Level"} {levelFromXP(period === "alltime" ? l.score : (l.isUser ? progress.xp : l.score))}</p>
              </div>
              <span className="font-display font-bold text-sm tabular-nums">{l.score.toLocaleString()} <span className="text-text-muted font-normal">XP</span></span>
            </div>
          );
        })}
      </div>

      {/* Қолданушы орны (қысқаша) */}
      <div className="card p-4 mt-4 flex items-center gap-3 bg-gradient-to-br from-accent-green/5 to-accent-blue/5">
        <div className="w-10 h-10 rounded-full bg-accent-green/15 flex items-center justify-center shrink-0">
          <Medal className="w-5 h-5 text-accent-green" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium">
            {lang === "kk" ? `Сіздің орныңыз: ` : `Your rank: `}
            <span className="font-bold text-accent-green">#{userRank}</span>
            <span className="text-text-secondary"> / {list.length}</span>
          </p>
          <p className="text-xs text-text-secondary flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-accent-gold" /> {progress.streakDays} {lang === "kk" ? "күн серия" : "day streak"}
          </p>
        </div>
        <span className="font-display font-bold text-accent-green">
          {(period === "alltime" ? progress.xp : weeklyScore).toLocaleString()} XP
        </span>
      </div>

      {/* Demo ескертуі */}
      <p className="text-[11px] text-text-muted text-center mt-4">
        {lang === "kk"
          ? "Басқа оқушылар — үлгі деректер. Нақты желілік рейтинг сервермен қосылады."
          : "Other learners are sample data. A live leaderboard requires a server."}
      </p>
    </div>
  );
}
