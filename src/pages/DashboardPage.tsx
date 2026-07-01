// filepath: src/pages/DashboardPage.tsx
// Басты бет — кәсіби дизайн: градиент hero, анимациялы карталар, жылдам бастау.

import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useLang } from "@/contexts/LangContext";
import { useUserPrefs } from "@/store/userPrefs";
import { useProgress, levelProgress } from "@/store/progressStore";
import { useVocab } from "@/store/vocabStore";
import { useCourseProgress } from "@/store/courseStore";
import { getCoursesByLang } from "@/data/courses";
import { calcStats } from "@/lib/srs";
import { Film, MessageSquare, RotateCcw, TrendingUp, Clock, BookA, Flame, ArrowRight, Sparkles, GraduationCap } from "lucide-react";

// Staggered контейнер
const container = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] as const } } };

export default function DashboardPage() {
  const { t } = useLang();
  const navigate = useNavigate();
  const { prefs } = useUserPrefs();
  const { progress } = useProgress();
  const { cards } = useVocab();
  const vocabStats = calcStats(cards);
  const minutesGoal = prefs.dailyGoalMin;
  const name = prefs.name || "Aidos";
  const minutesToday = progress.minutesToday;
  const wordsLearned = vocabStats.mastered;
  const streak = progress.streakDays;
  const minPercent = Math.min(100, Math.round((minutesToday / minutesGoal) * 100));
  const lvl = levelProgress(progress.xp);

  // Нақты «жалғастыру» курсы (прогресс бойынша)
  const { isLessonCompleted } = useCourseProgress();
  const courses = getCoursesByLang(prefs.learningLang);
  const coursePct = (c: (typeof courses)[number]) => {
    const all = c.units.flatMap((u) => u.lessons);
    const done = all.filter((l) => isLessonCompleted(l.id)).length;
    return all.length ? Math.round((done / all.length) * 100) : 0;
  };
  const currentCourse =
    courses.find((c) => { const p = coursePct(c); return p > 0 && p < 100; }) ||
    courses.find((c) => coursePct(c) < 100) ||
    courses[0];
  const currentPct = currentCourse ? coursePct(currentCourse) : 0;

  const quickActions = [
    { icon: Film, titleKey: "dash.watchMovies", descKey: "dash.watchMoviesDesc", grad: "from-accent-pink to-accent-purple", path: "/cinema" },
    { icon: MessageSquare, titleKey: "dash.practiceChat", descKey: "dash.practiceChatDesc", grad: "from-accent-cyan to-accent-blue", path: "/chat" },
    { icon: RotateCcw, titleKey: "dash.reviewWords", descKey: "dash.reviewWordsDesc", grad: "from-accent-green to-accent-cyan", path: "/dictionary" },
  ] as const;

  const stats = [
    { icon: Clock, label: t("dash.todayGoal"), value: minutesToday, suffix: `/ ${minutesGoal} ${t("top.days") === "days" ? "min" : "мин"}`, color: "accent-blue", bar: minPercent },
    { icon: BookA, label: t("dash.wordsLearned"), value: wordsLearned, suffix: t("vocab.mastered").toLowerCase(), color: "accent-green" },
    { icon: Flame, label: t("top.streak"), value: streak, suffix: t("top.days"), color: "accent-gold" },
  ] as const;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="max-w-6xl mx-auto space-y-6">
      {/* ── HERO ── */}
      <motion.div variants={item} className="relative overflow-hidden rounded-card p-6 sm:p-8 text-white shadow-card-hover"
        style={{ backgroundImage: "linear-gradient(120deg, #0E9F6E 0%, #16A34A 45%, #0EA5E9 100%)" }}>
        {/* Жарық дақтары */}
        <div className="absolute -right-10 -top-16 w-56 h-56 rounded-full bg-white/15 blur-2xl" />
        <div className="absolute -left-8 -bottom-16 w-48 h-48 rounded-full bg-white/10 blur-2xl" />
        <div className="relative flex items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-1.5 text-xs font-medium bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-full mb-3">
              <Sparkles className="w-3.5 h-3.5" /> {t("top.level")} {lvl.level}
            </div>
            <h1 className="text-2xl sm:text-4xl font-display font-bold leading-tight">
              {t("dash.greeting")}, {name}! 👋
            </h1>
            <p className="text-white/85 mt-1.5 text-sm sm:text-base">{t("dash.welcomeBack")}</p>
            <button onClick={() => navigate("/courses")}
              className="mt-4 inline-flex items-center gap-2 bg-white text-accent-green font-semibold text-sm px-4 py-2 rounded-btn shadow-soft hover:shadow-lg active:scale-[0.98] transition-all">
              {t("dash.continue")} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <img src="/bot.png" alt="" aria-hidden="true" className="block w-20 h-20 sm:w-28 sm:h-28 lg:w-36 lg:h-36 object-contain drop-shadow-xl animate-float-soft shrink-0" />
        </div>
      </motion.div>

      {/* ── СТАТИСТИКА ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <motion.div key={s.label} variants={item} className="card p-5 hover-lift relative overflow-hidden">
              <div className={`absolute top-0 left-0 right-0 h-1 bg-${s.color}`} />
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-9 h-9 rounded-card bg-${s.color}/15 flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 text-${s.color}`} />
                </div>
                <span className="text-sm text-text-secondary">{s.label}</span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-display font-bold">{s.value}</span>
                <span className="text-text-secondary text-sm">{s.suffix}</span>
              </div>
              {"bar" in s && s.bar !== undefined && (
                <div className="h-2 rounded-full bg-border overflow-hidden mt-3">
                  <motion.div className={`h-full bg-${s.color} rounded-full`} initial={{ width: 0 }} animate={{ width: `${s.bar}%` }} transition={{ duration: 0.8, ease: "easeOut" }} />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* ── ЖЫЛДАМ БАСТАУ ── */}
      <motion.div variants={item}>
        <h2 className="text-lg font-display font-bold mb-3 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-accent-blue" /> {t("dash.quickStart")}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button key={action.path} onClick={() => navigate(action.path)}
                className="card p-5 text-left hover-lift group relative overflow-hidden">
                <div className={`w-12 h-12 rounded-card bg-gradient-to-br ${action.grad} flex items-center justify-center mb-3 shadow-soft group-hover:scale-110 group-hover:-rotate-3 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold mb-1 flex items-center gap-1.5">
                  {t(action.titleKey)}
                  <ArrowRight className="w-4 h-4 -translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all" />
                </h3>
                <p className="text-xs text-text-secondary">{t(action.descKey)}</p>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* ── КУРСТЫ ЖАЛҒАСТЫРУ (нақты прогресс) ── */}
      {currentCourse && (
        <motion.button variants={item} onClick={() => navigate("/courses")}
          className="card p-5 sm:p-6 hover-lift w-full text-left group">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-card bg-accent-green/15 flex items-center justify-center text-3xl shrink-0">
              {currentCourse.emoji || <GraduationCap className="w-7 h-7 text-accent-green" />}
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-xs text-text-secondary">{currentPct > 0 ? t("dash.currentLesson") : (t("top.days") === "days" ? "Start a course" : "Курсты бастау")}</span>
              <h3 className="font-display font-bold truncate">{prefs.learningLang === "zh" ? currentCourse.titleKk : currentCourse.title}</h3>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex-1 h-2 rounded-full bg-border overflow-hidden">
                  <motion.div className="h-full bg-gradient-to-r from-accent-green to-accent-blue rounded-full" initial={{ width: 0 }} animate={{ width: `${currentPct}%` }} transition={{ duration: 0.8, ease: "easeOut" }} />
                </div>
                <span className="text-sm font-display font-bold gradient-text shrink-0">{currentPct}%</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-accent-green/10 flex items-center justify-center shrink-0 group-hover:bg-accent-green group-hover:text-white text-accent-green transition-colors">
              <ArrowRight className="w-5 h-5" />
            </div>
          </div>
        </motion.button>
      )}
    </motion.div>
  );
}
