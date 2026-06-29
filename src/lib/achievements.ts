// filepath: src/lib/achievements.ts
// Жетістіктер жүйесі — қолданушы межеге жеткенде ашылады.

import type { ProgressData } from "@/store/progressStore";
import type { VocabStats } from "@/types/vocabulary";

export interface Achievement {
  id: string;
  titleKk: string;
  titleEn: string;
  descKk: string;
  descEn: string;
  icon: string;       // lucide icon аты
  color: string;
  // Ашылу шарты
  check: (ctx: AchievementContext) => boolean;
  // Прогресс (0-1, толық емес болса көрсету үшін)
  progress?: (ctx: AchievementContext) => number;
}

export interface AchievementContext {
  progress: ProgressData;
  vocabStats: VocabStats;
  level: number;
  coursesCompleted: number;
}

export const achievements: Achievement[] = [
  // ── Алғашқы қадамдар ──
  {
    id: "first-lesson",
    titleKk: "Алғашқы қадам",
    titleEn: "First Step",
    descKk: "Бірінші сабақты аяқтаңыз",
    descEn: "Complete your first lesson",
    icon: "Footprints",
    color: "accent-green",
    check: (c) => c.progress.lessonsCompleted >= 1,
    progress: (c) => Math.min(c.progress.lessonsCompleted / 1, 1),
  },
  {
    id: "first-word",
    titleKk: "Сөз жинаушы",
    titleEn: "Word Collector",
    descKk: "10 сөз меңгеріңіз",
    descEn: "Master 10 words",
    icon: "BookMarked",
    color: "accent-blue",
    check: (c) => c.vocabStats.mastered >= 10,
    progress: (c) => Math.min(c.vocabStats.mastered / 10, 1),
  },
  // ── Серия (streak) ──
  {
    id: "streak-3",
    titleKk: "Үш күн қатар",
    titleEn: "Three in a Row",
    descKk: "3 күн қатарынан оқыңыз",
    descEn: "Study 3 days in a row",
    icon: "Flame",
    color: "accent-gold",
    check: (c) => c.progress.streakDays >= 3,
    progress: (c) => Math.min(c.progress.streakDays / 3, 1),
  },
  {
    id: "streak-7",
    titleKk: "Апталық жалын",
    titleEn: "Week Warrior",
    descKk: "7 күн қатарынан оқыңыз",
    descEn: "Study 7 days in a row",
    icon: "Flame",
    color: "accent-red",
    check: (c) => c.progress.streakDays >= 7,
    progress: (c) => Math.min(c.progress.streakDays / 7, 1),
  },
  {
    id: "streak-30",
    titleKk: "Айлық чемпион",
    titleEn: "Monthly Champion",
    descKk: "30 күн қатарынан оқыңыз",
    descEn: "Study 30 days in a row",
    icon: "Trophy",
    color: "accent-gold",
    check: (c) => c.progress.streakDays >= 30,
    progress: (c) => Math.min(c.progress.streakDays / 30, 1),
  },
  // ── XP / Деңгей ──
  {
    id: "level-5",
    titleKk: "Жаңадан бастаушы",
    titleEn: "Rising Star",
    descKk: "5-деңгейге жетіңіз",
    descEn: "Reach level 5",
    icon: "Star",
    color: "accent-purple",
    check: (c) => c.level >= 5,
    progress: (c) => Math.min(c.level / 5, 1),
  },
  {
    id: "level-10",
    titleKk: "Тіл шебері",
    titleEn: "Language Master",
    descKk: "10-деңгейге жетіңіз",
    descEn: "Reach level 10",
    icon: "Crown",
    color: "accent-gold",
    check: (c) => c.level >= 10,
    progress: (c) => Math.min(c.level / 10, 1),
  },
  {
    id: "xp-1000",
    titleKk: "Мың ұпай",
    titleEn: "Thousand Club",
    descKk: "1000 XP жинаңыз",
    descEn: "Earn 1000 XP",
    icon: "Zap",
    color: "accent-blue",
    check: (c) => c.progress.xp >= 1000,
    progress: (c) => Math.min(c.progress.xp / 1000, 1),
  },
  // ── Сөздік ──
  {
    id: "words-50",
    titleKk: "Сөздік қоры",
    titleEn: "Vocabulary Builder",
    descKk: "50 сөз меңгеріңіз",
    descEn: "Master 50 words",
    icon: "Library",
    color: "accent-green",
    check: (c) => c.vocabStats.mastered >= 50,
    progress: (c) => Math.min(c.vocabStats.mastered / 50, 1),
  },
  // ── Сабақ ──
  {
    id: "lessons-10",
    titleKk: "Еңбекқор",
    titleEn: "Hard Worker",
    descKk: "10 сабақ аяқтаңыз",
    descEn: "Complete 10 lessons",
    icon: "GraduationCap",
    color: "accent-purple",
    check: (c) => c.progress.lessonsCompleted >= 10,
    progress: (c) => Math.min(c.progress.lessonsCompleted / 10, 1),
  },
  // ── Уақыт ──
  {
    id: "time-60",
    titleKk: "Бір сағат",
    titleEn: "Hour of Power",
    descKk: "Бір күнде 60 минут оқыңыз",
    descEn: "Study 60 minutes in one day",
    icon: "Clock",
    color: "accent-cyan",
    check: (c) => c.progress.minutesToday >= 60,
    progress: (c) => Math.min(c.progress.minutesToday / 60, 1),
  },
];

// Ашылған жетістіктерді есептеу
export function getUnlockedAchievements(ctx: AchievementContext): Set<string> {
  const unlocked = new Set<string>();
  achievements.forEach((a) => {
    if (a.check(ctx)) unlocked.add(a.id);
  });
  return unlocked;
}
