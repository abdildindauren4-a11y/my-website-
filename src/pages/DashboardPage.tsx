// filepath: src/pages/DashboardPage.tsx
// Басты бет — бірінші көрінетін экран.
// Сәлемдесу, статистика, жылдам бастау, ағымдағы сабақ қадамдары.

import { useNavigate } from "react-router-dom";
import { useLang } from "@/contexts/LangContext";
import { useUserPrefs } from "@/store/userPrefs";
import { useProgress } from "@/store/progressStore";
import { useVocab } from "@/store/vocabStore";
import { calcStats } from "@/lib/srs";
import LessonSteps from "@/components/shared/LessonSteps";
import { Film, MessageSquare, RotateCcw, TrendingUp, Clock, BookA, Flame, ArrowRight } from "lucide-react";

export default function DashboardPage() {
  const { t } = useLang();
  const navigate = useNavigate();
  const { prefs } = useUserPrefs();
  const { progress } = useProgress();
  const { cards } = useVocab();
  // Нақты сандар
  const vocabStats = calcStats(cards);
  const minutesGoal = prefs.dailyGoalMin;
  const name = prefs.name || "Aidos";
  const minutesToday = progress.minutesToday;
  const wordsLearned = vocabStats.mastered;  // нақты меңгерілген сөз
  const streak = progress.streakDays;
  const minPercent = Math.min(100, Math.round((minutesToday / minutesGoal) * 100));

  const quickActions = [
    { icon: Film, titleKey: "dash.watchMovies", descKey: "dash.watchMoviesDesc", color: "pink", path: "/cinema" },
    { icon: MessageSquare, titleKey: "dash.practiceChat", descKey: "dash.practiceChatDesc", color: "cyan", path: "/chat" },
    { icon: RotateCcw, titleKey: "dash.reviewWords", descKey: "dash.reviewWordsDesc", color: "green", path: "/dictionary" },
  ] as const;

  // Түс кластарын статикалық жазамыз (Tailwind purge үшін)
  const colorClasses: Record<string, { bg: string; text: string; border: string }> = {
    pink: { bg: "bg-accent-pink/15", text: "text-accent-pink", border: "hover:border-accent-pink/40" },
    cyan: { bg: "bg-accent-cyan/15", text: "text-accent-cyan", border: "hover:border-accent-cyan/40" },
    green: { bg: "bg-accent-green/15", text: "text-accent-green", border: "hover:border-accent-green/40" },
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Сәлемдесу */}
      <div>
        <h1 className="text-3xl font-display font-bold">
          {t("dash.greeting")}, {name}! 👋
        </h1>
        <p className="text-text-secondary mt-1">{t("dash.welcomeBack")}</p>
      </div>

      {/* Статистика карталары */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Бүгінгі мақсат */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-5 h-5 text-accent-blue" />
            <span className="text-sm text-text-secondary">{t("dash.todayGoal")}</span>
          </div>
          <div className="flex items-baseline gap-1 mb-2">
            <span className="text-2xl font-display font-bold">{minutesToday}</span>
            <span className="text-text-secondary text-sm">/ {minutesGoal} мин</span>
          </div>
          <div className="h-2 rounded-full bg-border overflow-hidden">
            <div className="h-full bg-accent-blue rounded-full transition-all" style={{ width: `${minPercent}%` }} />
          </div>
        </div>

        {/* Үйренген сөздер */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-3">
            <BookA className="w-5 h-5 text-accent-green" />
            <span className="text-sm text-text-secondary">{t("dash.wordsLearned")}</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-display font-bold">{wordsLearned}</span>
            <span className="text-accent-green text-sm">+12 бүгін</span>
          </div>
        </div>

        {/* Серия */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-3">
            <Flame className="w-5 h-5 text-accent-gold" />
            <span className="text-sm text-text-secondary">{t("top.streak")}</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-display font-bold">{streak}</span>
            <span className="text-text-secondary text-sm">{t("top.days")}</span>
          </div>
        </div>
      </div>

      {/* Жылдам бастау */}
      <div>
        <h2 className="text-lg font-display font-semibold mb-3 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-accent-blue" />
          {t("dash.quickStart")}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            const c = colorClasses[action.color];
            return (
              <button
                key={action.path}
                onClick={() => navigate(action.path)}
                className={`card p-5 text-left transition-all border-border ${c.border} hover:bg-surface-2 group`}
              >
                <div className={`w-11 h-11 rounded-card ${c.bg} flex items-center justify-center mb-3`}>
                  <Icon className={`w-6 h-6 ${c.text}`} />
                </div>
                <h3 className="font-semibold mb-1 flex items-center gap-1.5">
                  {t(action.titleKey)}
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-xs text-text-secondary">{t(action.descKey)}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Ағымдағы сабақ */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-accent-blue" />
            <div>
              <span className="text-sm text-text-secondary">{t("dash.currentLesson")}</span>
              <h3 className="font-display font-semibold">The Power of Mindset</h3>
            </div>
          </div>
          <div className="text-right">
            <span className="text-sm text-text-secondary">{t("dash.lessonProgress")}</span>
            <p className="text-xl font-display font-bold text-accent-green">50%</p>
          </div>
        </div>
        <LessonSteps />
      </div>
    </div>
  );
}
