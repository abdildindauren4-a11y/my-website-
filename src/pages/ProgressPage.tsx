// filepath: src/pages/ProgressPage.tsx
// Прогресс беті — деңгей, статистика, апталық график, жетістіктер.

import { motion } from "framer-motion";
import { useLang } from "@/contexts/LangContext";
import { useProgress, levelProgress } from "@/store/progressStore";
import { useVocab } from "@/store/vocabStore";
import { useCourseProgress } from "@/store/courseStore";
import { calcStats } from "@/lib/srs";
import { achievements, getUnlockedAchievements } from "@/lib/achievements";
import {
  TrendingUp, Flame, BookMarked, GraduationCap, Zap, Clock, Star, Crown,
  Footprints, Library, Trophy, Award, Lock,
  type LucideIcon,
} from "lucide-react";

// Иконка картасы (жетістіктер үшін)
const iconMap: Record<string, LucideIcon> = {
  Footprints, BookMarked, Flame, Trophy, Star, Crown, Zap, Library, GraduationCap, Clock,
};

export default function ProgressPage() {
  const { t, lang } = useLang();
  const { progress } = useProgress();
  const { cards } = useVocab();
  const { progress: courseProgress } = useCourseProgress();

  const vocabStats = calcStats(cards);
  const lvl = levelProgress(progress.xp);
  const coursesCompleted = courseProgress.completedLessons.length;

  const ctx = { progress, vocabStats, level: lvl.level, coursesCompleted };
  const unlocked = getUnlockedAchievements(ctx);

  // Апталық белсенділік (соңғы 7 күн)
  const today = new Date();
  const weekDays: { label: string; minutes: number; date: string }[] = [];
  const dayLabels = [t("prog.sun"), t("prog.mon"), t("prog.tue"), t("prog.wed"), t("prog.thu"), t("prog.fri"), t("prog.sat")];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    weekDays.push({
      label: dayLabels[d.getDay()],
      minutes: progress.weeklyMinutes?.[dateStr] || 0,
      date: dateStr,
    });
  }
  const maxMinutes = Math.max(...weekDays.map((d) => d.minutes), 1);

  // Негізгі статистика карталары
  const stats = [
    { icon: Flame, label: t("prog.streak"), value: `${progress.streakDays} ${t("prog.days")}`, color: "accent-gold" },
    { icon: BookMarked, label: t("prog.wordsLearned"), value: vocabStats.mastered, color: "accent-blue" },
    { icon: GraduationCap, label: t("prog.lessonsCompleted"), value: progress.lessonsCompleted, color: "accent-purple" },
    { icon: Clock, label: t("prog.minutesToday"), value: `${progress.minutesToday} ${t("prog.minutes")}`, color: "accent-cyan" },
  ];

  const vocabTotal = vocabStats.total || 1;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Тақырып */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-11 h-11 rounded-card bg-accent-green/15 flex items-center justify-center">
          <TrendingUp className="w-6 h-6 text-accent-green" />
        </div>
        <div>
          <h1 className="text-2xl font-display font-bold">{t("prog.title")}</h1>
          <p className="text-sm text-text-secondary">{t("prog.subtitle")}</p>
        </div>
      </div>

      {/* Деңгей картасы */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="card p-6 mb-5 bg-gradient-to-br from-accent-green/10 to-accent-blue/5 border-accent-green/20"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-card bg-accent-green flex items-center justify-center text-white">
              <span className="text-2xl font-display font-bold">{lvl.level}</span>
            </div>
            <div>
              <p className="text-sm text-text-secondary">{t("prog.level")} {lvl.level}</p>
              <p className="font-display font-bold text-lg">{progress.xp} XP</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-text-secondary">{lvl.needed - lvl.current} XP</p>
            <p className="text-xs text-text-muted">{t("prog.xpToNext")}</p>
          </div>
        </div>
        {/* Деңгей прогресс жолағы */}
        <div className="h-3 rounded-full bg-surface-2 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-accent-green to-accent-blue rounded-full"
            initial={{ width: 0 }} animate={{ width: `${lvl.percent}%` }} transition={{ duration: 0.8 }}
          />
        </div>
      </motion.div>

      {/* Негізгі статистика (4 карта) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              className="card p-4 text-center"
            >
              <div className={`w-10 h-10 rounded-card bg-${s.color}/15 flex items-center justify-center mx-auto mb-2`}>
                <Icon className={`w-5 h-5 text-${s.color}`} />
              </div>
              <div className="font-display font-bold text-lg">{s.value}</div>
              <div className="text-[11px] text-text-muted leading-tight">{s.label}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Апталық белсенділік (баған график) */}
      <div className="card p-5 mb-5">
        <h2 className="font-display font-semibold mb-4 text-sm">{t("prog.weeklyActivity")}</h2>
        <div className="flex items-end justify-between gap-2 h-32">
          {weekDays.map((day, i) => {
            const heightPercent = (day.minutes / maxMinutes) * 100;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full">
                <div className="flex-1 w-full flex items-end">
                  <motion.div
                    className={`w-full rounded-t-lg ${day.minutes > 0 ? "bg-gradient-to-t from-accent-green to-accent-blue" : "bg-surface-2"}`}
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.max(heightPercent, day.minutes > 0 ? 8 : 4)}%` }}
                    transition={{ delay: i * 0.05, duration: 0.5 }}
                    title={`${day.minutes} ${t("prog.minutes")}`}
                  />
                </div>
                <span className="text-[10px] text-text-muted">{day.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Сөздік бөлінісі */}
      {vocabStats.total > 0 && (
        <div className="card p-5 mb-5">
          <h2 className="font-display font-semibold mb-4 text-sm">{t("prog.vocabBreakdown")}</h2>
          {/* Үш бөлік жолағы */}
          <div className="h-3 rounded-full overflow-hidden flex mb-3">
            <div className="bg-accent-cyan" style={{ width: `${(vocabStats.new / vocabTotal) * 100}%` }} />
            <div className="bg-accent-gold" style={{ width: `${(vocabStats.learning / vocabTotal) * 100}%` }} />
            <div className="bg-accent-green" style={{ width: `${(vocabStats.mastered / vocabTotal) * 100}%` }} />
          </div>
          <div className="flex items-center justify-around text-center">
            <div>
              <div className="flex items-center gap-1.5 justify-center mb-0.5">
                <span className="w-2.5 h-2.5 rounded-full bg-accent-cyan" />
                <span className="font-display font-bold">{vocabStats.new}</span>
              </div>
              <span className="text-[11px] text-text-muted">{t("prog.new")}</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5 justify-center mb-0.5">
                <span className="w-2.5 h-2.5 rounded-full bg-accent-gold" />
                <span className="font-display font-bold">{vocabStats.learning}</span>
              </div>
              <span className="text-[11px] text-text-muted">{t("prog.learning")}</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5 justify-center mb-0.5">
                <span className="w-2.5 h-2.5 rounded-full bg-accent-green" />
                <span className="font-display font-bold">{vocabStats.mastered}</span>
              </div>
              <span className="text-[11px] text-text-muted">{t("prog.mastered")}</span>
            </div>
          </div>
        </div>
      )}

      {/* Жетістіктер */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-display font-semibold flex items-center gap-2">
          <Award className="w-5 h-5 text-accent-gold" /> {t("prog.achievements")}
        </h2>
        <span className="text-sm text-text-secondary">{unlocked.size}/{achievements.length} {t("prog.unlocked")}</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {achievements.map((a, i) => {
          const Icon = iconMap[a.icon] || Star;
          const isUnlocked = unlocked.has(a.id);
          const prog = a.progress ? a.progress(ctx) : (isUnlocked ? 1 : 0);
          return (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.04 }}
              className={`card p-4 text-center relative ${isUnlocked ? "" : "opacity-60"}`}
            >
              <div className={`w-12 h-12 rounded-card flex items-center justify-center mx-auto mb-2 ${
                isUnlocked ? `bg-${a.color}/15` : "bg-surface-2"
              }`}>
                {isUnlocked ? <Icon className={`w-6 h-6 text-${a.color}`} /> : <Lock className="w-5 h-5 text-text-muted" />}
              </div>
              <h3 className="font-medium text-sm mb-0.5">{lang === "kk" ? a.titleKk : a.titleEn}</h3>
              <p className="text-[11px] text-text-muted leading-tight mb-2">{lang === "kk" ? a.descKk : a.descEn}</p>
              {/* Прогресс жолағы (толық емес болса) */}
              {!isUnlocked && prog > 0 && (
                <div className="h-1 rounded-full bg-surface-2 overflow-hidden">
                  <div className={`h-full bg-${a.color}/50 rounded-full`} style={{ width: `${prog * 100}%` }} />
                </div>
              )}
              {isUnlocked && (
                <span className="absolute top-2 right-2 text-accent-green">
                  <Trophy className="w-3.5 h-3.5" />
                </span>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
