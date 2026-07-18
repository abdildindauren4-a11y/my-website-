// filepath: src/data/curriculum.ts
// Бар 7 курсты жаңа мазмұн моделіне көшіру (ROADMAP 2-кезең).
// Курстар CEFR деңгейлеріне топталады, әр юнитке checkpoint жасалады.
// 4-кезеңде осы құрылымға таза жаңа контент (A1/A2/HSK1) қосылады.

import type { CourseLevel, Unit as LegacyUnit, Lesson as LegacyLesson } from "@/types/course";
import type { CurriculumLevel, CurriculumUnit, CurriculumLesson, CurriculumWord, UnitGrammarPoint } from "@/types/curriculum";
import type { ExerciseSpec } from "@/types/exercise";
import type { LearnLang } from "@/types/vocabulary";
import type { CefrLevel } from "@/lib/cefr";
import { specsFromExercises } from "@/lib/exerciseAdapter";
import { englishBeginner } from "@/data/courses/englishBeginner";
import { businessEnglish } from "@/data/courses/businessEnglish";
import { englishTenses } from "@/data/courses/englishTenses";
import { englishVerbs } from "@/data/courses/englishVerbs";
import { englishPronunciation } from "@/data/courses/englishPronunciation";
import { chinesePinyin } from "@/data/courses/chinesePinyin";
import { chineseGrammar } from "@/data/courses/chineseGrammar";

// ── Курс → CEFR деңгейі картасы ──
// Бір деңгейге бірнеше курс кіре алады (юниттері бірігіп бір жол құрайды)
const LEVEL_MAP: { lang: LearnLang; cefr: CefrLevel; hsk?: number; titleKk: string; courses: CourseLevel[] }[] = [
  { lang: "en", cefr: "A1", titleKk: "Бастапқы деңгей", courses: [englishBeginner, englishPronunciation] },
  { lang: "en", cefr: "A2", titleKk: "Негізгі деңгей", courses: [englishVerbs, englishTenses] },
  { lang: "en", cefr: "B1", titleKk: "Орта деңгей", courses: [businessEnglish] },
  { lang: "zh", cefr: "A1", hsk: 1, titleKk: "HSK 1 — Бастапқы", courses: [chinesePinyin, chineseGrammar] },
];

// Юниттің сөздігі: flashcard жаттығуларынан жиналады
function extractVocab(unit: LegacyUnit): CurriculumWord[] {
  const words: CurriculumWord[] = [];
  for (const lesson of unit.lessons) {
    for (const ex of lesson.exercises) {
      if (ex.type === "flashcard" && ex.term) {
        words.push({ term: ex.term, translation: ex.translation ?? ex.answer, phonetic: ex.phonetic });
      }
    }
  }
  return words;
}

// Юниттің грамматикасы: теориясы бар алғашқы сабақтан
function extractGrammar(unit: LegacyUnit): UnitGrammarPoint | undefined {
  const lesson = unit.lessons.find((l) => l.theory);
  if (!lesson?.theory) return undefined;
  return {
    title: lesson.title,
    titleKk: lesson.titleKk,
    explanationKk: lesson.theory.explanationKk,
    examples: lesson.theory.examples.map((e) => ({ text: e.text, translationKk: e.translation })),
    keyPoints: lesson.theory.keyPoints,
  };
}

// Checkpoint: юниттің бағаланатын жаттығуларынан 10 сұрақ (біркелкі таралып)
function buildCheckpoint(lessons: CurriculumLesson[]): ExerciseSpec[] {
  const graded = lessons.flatMap((l) => l.exercises).filter((e) => e.type !== "present");
  if (graded.length <= 10) return graded.map((e) => ({ ...e, id: `cp-${e.id}` }));
  const step = graded.length / 10;
  const picked: ExerciseSpec[] = [];
  for (let i = 0; i < 10; i++) picked.push(graded[Math.floor(i * step)]);
  return picked.map((e) => ({ ...e, id: `cp-${e.id}` }));
}

// Бір legacy юнитті жаңа модельге келтіру
function convertUnit(unit: LegacyUnit, course: CourseLevel, number: number): CurriculumUnit {
  const lessons: CurriculumLesson[] = unit.lessons.map((l: LegacyLesson) => ({
    id: l.id,
    title: l.title,
    titleKk: l.titleKk,
    exercises: specsFromExercises(l.exercises, course.lang),
    xpReward: l.xpReward,
  }));
  return {
    id: unit.id,
    number,
    title: unit.title,
    titleKk: unit.titleKk,
    emoji: course.emoji ?? "📘",
    color: unit.color || course.color || "accent-green",
    descriptionKk: unit.descriptionKk,
    vocabSet: extractVocab(unit),
    grammar: extractGrammar(unit),
    lessons,
    dialogue: undefined,
    checkpoint: buildCheckpoint(lessons),
    legacyCourseId: course.id,
  };
}

// ── Толық оқу бағдарламасы (тіл бойынша, деңгей ретімен) ──
const cache = new Map<LearnLang, CurriculumLevel[]>();

export function getCurriculum(lang: LearnLang): CurriculumLevel[] {
  const hit = cache.get(lang);
  if (hit) return hit;

  const levels: CurriculumLevel[] = LEVEL_MAP
    .filter((m) => m.lang === lang)
    .map((m) => {
      let n = 0;
      const units = m.courses.flatMap((course) =>
        course.units.map((u) => convertUnit(u, course, ++n))
      );
      return { lang: m.lang, cefr: m.cefr, hsk: m.hsk, titleKk: m.titleKk, units };
    });

  // Dev-қорғаныс: юнит id-лері бүкіл жол бойынша қайталанбауы тиіс
  // (checkpoint нәтижелері id-мен сақталады)
  if (import.meta.env.DEV) {
    const seen = new Set<string>();
    for (const lvl of levels) for (const u of lvl.units) {
      if (seen.has(u.id)) console.warn(`[curriculum] юнит id қайталанады: ${u.id} (${lvl.cefr})`);
      seen.add(u.id);
    }
  }

  cache.set(lang, levels);
  return levels;
}

// Барлық юнит (тегіс тізім, деңгей ретімен) — pathStore осыны қолданады
export function getAllUnits(lang: LearnLang): { unit: CurriculumUnit; cefr: CefrLevel }[] {
  return getCurriculum(lang).flatMap((lvl) => lvl.units.map((unit) => ({ unit, cefr: lvl.cefr })));
}
