// filepath: src/lib/cefr.ts
// CEFR — тіл деңгейлерінің халықаралық жүйесі (A1–C2).
// Busuu/Babbel сияқты платформалар осыған құрылған. Қытай үшін HSK сәйкестігі.

import type { ProficiencyLevel } from "@/store/userPrefs";

export type CefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export interface CefrMeta {
  level: CefrLevel;
  titleKk: string;
  titleEn: string;
  descKk: string;   // осы деңгейде не істей аласың
  hsk: string;      // қытай тіліндегі шамамен сәйкестік
  color: string;    // деңгей түсі (бейдж үшін)
  emoji: string;
}

export const CEFR_LEVELS: CefrMeta[] = [
  {
    level: "A1", titleKk: "Бастауыш", titleEn: "Beginner",
    descKk: "Танысу, қарапайым сұрақ-жауап, күнделікті базалық сөздер",
    hsk: "HSK 1", color: "#16A34A", emoji: "🌱",
  },
  {
    level: "A2", titleKk: "Бастауыштан жоғары", titleEn: "Elementary",
    descKk: "Күнделікті жағдайларда сөйлесу: дүкен, жол, отбасы, жұмыс",
    hsk: "HSK 2", color: "#0EA5E9", emoji: "🌿",
  },
  {
    level: "B1", titleKk: "Орта", titleEn: "Intermediate",
    descKk: "Саяхатта еркін тіл табысу, тәжірибе мен жоспарды баяндау",
    hsk: "HSK 3", color: "#8B5CF6", emoji: "🌳",
  },
  {
    level: "B2", titleKk: "Ортадан жоғары", titleEn: "Upper-Intermediate",
    descKk: "Күрделі мәтіндерді түсіну, өз ойын жүйелі дәлелдеу (IELTS 5.5-6.5)",
    hsk: "HSK 4", color: "#F59E0B", emoji: "🌲",
  },
  {
    level: "C1", titleKk: "Ілгері", titleEn: "Advanced",
    descKk: "Академиялық/кәсіби орта, нюанстарды сезіну (IELTS 7.0-8.0)",
    hsk: "HSK 5", color: "#EC4899", emoji: "🎓",
  },
  {
    level: "C2", titleKk: "Жетік", titleEn: "Mastery",
    descKk: "Ана тіліндей еркіндік, кез келген тақырыпта дәлдік (IELTS 8.5+)",
    hsk: "HSK 6", color: "#EF4444", emoji: "👑",
  },
];

export function cefrMeta(level: CefrLevel): CefrMeta {
  return CEFR_LEVELS.find((l) => l.level === level) || CEFR_LEVELS[0];
}

// Ескі үш деңгейлі жүйемен сәйкестік (кері үйлесімділік)
export function cefrToLegacy(level: CefrLevel): ProficiencyLevel {
  if (level === "A1" || level === "A2") return "beginner";
  if (level === "B1" || level === "B2") return "intermediate";
  return "advanced";
}

export function legacyToCefr(level: ProficiencyLevel): CefrLevel {
  if (level === "beginner") return "A1";
  if (level === "intermediate") return "B1";
  return "C1";
}
