// filepath: src/pages/ProfilePage.tsx
// Профиль беті — аватар, аты, деңгей/XP, статистика, жетістіктер, сертификаттар.

import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useLang } from "@/contexts/LangContext";
import { useUserPrefs } from "@/store/userPrefs";
import { useProgress, levelProgress } from "@/store/progressStore";
import { useVocab } from "@/store/vocabStore";
import { useCourseProgress } from "@/store/courseStore";
import { calcStats } from "@/lib/srs";
import { achievements, getUnlockedAchievements } from "@/lib/achievements";
import { allCourses } from "@/data/courses";
import {
  Flame, BookMarked, GraduationCap, Zap, Clock, Star, Crown, Footprints, Library, Trophy,
  Pencil, Check, Settings, Award, Globe, Target, type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = { Footprints, BookMarked, Flame, Trophy, Star, Crown, Zap, Library, GraduationCap, Clock };

export default function ProfilePage() {
  const { lang } = useLang();
  const { prefs, update } = useUserPrefs();
  const { progress } = useProgress();
  const { cards } = useVocab();
  const { isLessonCompleted, progress: courseProgress } = useCourseProgress();

  const vocabStats = calcStats(cards);
  const lvl = levelProgress(progress.xp);
  const coursesCompletedCount = courseProgress.completedLessons.length;
  const ctx = { progress, vocabStats, level: lvl.level, coursesCompleted: coursesCompletedCount };
  const unlocked = getUnlockedAchievements(ctx);

  const name = prefs.name || (lang === "kk" ? "Оқушы" : "Learner");
  const [editing, setEditing] = useState(false);
  const [nameInput, setNameInput] = useState(prefs.name || "");

  const saveName = () => { if (nameInput.trim()) update({ name: nameInput.trim() }); setEditing(false); };

  // Аяқталған курстар (сертификат)
  const finishedCourses = allCourses.filter((c) => {
    const all = c.units.flatMap((u) => u.lessons);
    return all.length > 0 && all.every((l) => isLessonCompleted(l.id));
  });

  const langName = prefs.learningLang === "zh" ? (lang === "kk" ? "Қытай тілі" : "Chinese") : (lang === "kk" ? "Ағылшын тілі" : "English");
  const levelName = prefs.level === "beginner" ? (lang === "kk" ? "Бастауыш" : "Beginner") : prefs.level === "advanced" ? (lang === "kk" ? "Жоғары" : "Advanced") : (lang === "kk" ? "Орта" : "Intermediate");

  const stats = [
    { icon: Star, label: lang === "kk" ? "Деңгей" : "Level", value: lvl.level, color: "accent-purple" },
    { icon: Zap, label: "XP", value: progress.xp.toLocaleString(), color: "accent-blue" },
    { icon: Flame, label: lang === "kk" ? "Серия" : "Streak", value: progress.streakDays, color: "accent-gold" },
    { icon: BookMarked, label: lang === "kk" ? "Меңгерілген сөз" : "Words mastered", value: vocabStats.mastered, color: "accent-green" },
    { icon: GraduationCap, label: lang === "kk" ? "Сабақтар" : "Lessons", value: progress.lessonsCompleted, color: "accent-cyan" },
    { icon: Award, label: lang === "kk" ? "Жетістіктер" : "Achievements", value: `${unlocked.size}/${achievements.length}`, color: "accent-gold" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* ── HERO ── */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-card p-6 sm:p-8 text-white shadow-card-hover"
        style={{ backgroundImage: "linear-gradient(120deg, #0E9F6E 0%, #16A34A 45%, #0EA5E9 100%)" }}>
        <div className="absolute -right-10 -top-16 w-56 h-56 rounded-full bg-white/15 blur-2xl" />
        <div className="relative flex flex-col sm:flex-row items-center gap-5">
          <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm border-4 border-white/40 flex items-center justify-center text-4xl font-display font-bold shrink-0">
            {name[0]?.toUpperCase()}
          </div>
          <div className="flex-1 text-center sm:text-left min-w-0">
            {editing ? (
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <input value={nameInput} onChange={(e) => setNameInput(e.target.value)} autoFocus
                  onKeyDown={(e) => e.key === "Enter" && saveName()}
                  className="bg-white/20 rounded-btn px-3 py-1.5 text-white placeholder-white/60 focus:outline-none text-xl font-bold" placeholder={name} />
                <button onClick={saveName} className="w-9 h-9 rounded-full bg-white/25 flex items-center justify-center"><Check className="w-5 h-5" /></button>
              </div>
            ) : (
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <h1 className="text-3xl font-display font-bold">{name}</h1>
                <button onClick={() => { setNameInput(prefs.name || ""); setEditing(true); }} className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"><Pencil className="w-4 h-4" /></button>
              </div>
            )}
            <p className="text-white/85 mt-1">{langName} · {levelName}</p>
            {/* XP жолағы */}
            <div className="mt-3 max-w-sm mx-auto sm:mx-0">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-medium">{lang === "kk" ? "Деңгей" : "Level"} {lvl.level}</span>
                <span className="text-white/80">{lvl.current} / {lvl.needed} XP</span>
              </div>
              <div className="h-2 rounded-full bg-white/25 overflow-hidden">
                <motion.div className="h-full bg-white rounded-full" initial={{ width: 0 }} animate={{ width: `${lvl.percent}%` }} transition={{ duration: 0.8 }} />
              </div>
            </div>
          </div>
          <Link to="/settings" className="self-start bg-white/20 hover:bg-white/30 transition-colors rounded-btn px-3 py-2 text-sm font-medium flex items-center gap-2 shrink-0">
            <Settings className="w-4 h-4" /> {lang === "kk" ? "Баптау" : "Settings"}
          </Link>
        </div>
      </motion.div>

      {/* ── СТАТИСТИКА ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="card p-4 hover-lift">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-8 h-8 rounded-card bg-${s.color}/15 flex items-center justify-center`}><Icon className={`w-4 h-4 text-${s.color}`} /></div>
                <span className="text-xs text-text-secondary">{s.label}</span>
              </div>
              <span className="text-2xl font-display font-bold">{s.value}</span>
            </div>
          );
        })}
      </div>

      {/* ── ОҚУ ПАРАМЕТРЛЕРІ ── */}
      <div className="card p-5">
        <h2 className="font-display font-bold mb-4">{lang === "kk" ? "Оқу параметрлері" : "Learning preferences"}</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-card bg-accent-blue/15 flex items-center justify-center"><Globe className="w-5 h-5 text-accent-blue" /></div>
            <div><p className="text-xs text-text-secondary">{lang === "kk" ? "Үйрену тілі" : "Learning"}</p><p className="font-medium">{langName}</p></div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-card bg-accent-purple/15 flex items-center justify-center"><GraduationCap className="w-5 h-5 text-accent-purple" /></div>
            <div><p className="text-xs text-text-secondary">{lang === "kk" ? "Деңгей" : "Level"}</p><p className="font-medium">{levelName}</p></div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-card bg-accent-green/15 flex items-center justify-center"><Target className="w-5 h-5 text-accent-green" /></div>
            <div><p className="text-xs text-text-secondary">{lang === "kk" ? "Күндік мақсат" : "Daily goal"}</p><p className="font-medium">{prefs.dailyGoalMin} {lang === "kk" ? "мин" : "min"}</p></div>
          </div>
        </div>
      </div>

      {/* ── СЕРТИФИКАТТАР ── */}
      {finishedCourses.length > 0 && (
        <div className="card p-5">
          <h2 className="font-display font-bold mb-4 flex items-center gap-2"><Award className="w-5 h-5 text-accent-gold" /> {lang === "kk" ? "Сертификаттар" : "Certificates"}</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {finishedCourses.map((c) => (
              <Link key={c.id} to="/courses" className="flex items-center gap-3 p-3 rounded-card bg-accent-gold/5 border border-accent-gold/20 hover:border-accent-gold/40 transition-colors">
                <span className="text-2xl">{c.emoji || "🎓"}</span>
                <div className="min-w-0">
                  <p className="font-medium truncate">{lang === "kk" ? c.titleKk : c.title}</p>
                  <p className="text-xs text-accent-gold">{lang === "kk" ? "Аяқталды ✓" : "Completed ✓"}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ── ЖЕТІСТІКТЕР ── */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold flex items-center gap-2"><Trophy className="w-5 h-5 text-accent-gold" /> {lang === "kk" ? "Жетістіктер" : "Achievements"}</h2>
          <span className="text-sm text-text-secondary">{unlocked.size}/{achievements.length}</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {achievements.map((a) => {
            const Icon = iconMap[a.icon] || Star;
            const isUnlocked = unlocked.has(a.id);
            const prog = a.progress ? Math.round(a.progress(ctx) * 100) : 0;
            return (
              <div key={a.id} className={`p-3 rounded-card border text-center transition-all ${isUnlocked ? `bg-${a.color}/8 border-${a.color}/30` : "bg-surface-2 border-border opacity-70"}`}>
                <div className={`w-11 h-11 rounded-card mx-auto mb-2 flex items-center justify-center ${isUnlocked ? `bg-${a.color}/15` : "bg-border"}`}>
                  <Icon className={`w-6 h-6 ${isUnlocked ? `text-${a.color}` : "text-text-muted"}`} />
                </div>
                <p className="text-sm font-medium truncate">{lang === "kk" ? a.titleKk : a.titleEn}</p>
                <p className="text-[11px] text-text-muted leading-tight mt-0.5">{lang === "kk" ? a.descKk : a.descEn}</p>
                {!isUnlocked && a.progress && (
                  <div className="h-1 rounded-full bg-border overflow-hidden mt-2">
                    <div className={`h-full bg-${a.color} rounded-full`} style={{ width: `${prog}%` }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
