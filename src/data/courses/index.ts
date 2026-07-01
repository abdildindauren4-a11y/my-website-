// filepath: src/data/courses/index.ts
// Барлық курстар (кейін көбейеді).

import type { CourseLevel } from "@/types/course";
import { englishBeginner } from "./englishBeginner";
import { businessEnglish } from "./businessEnglish";
import { englishTenses } from "./englishTenses";
import { englishVerbs } from "./englishVerbs";
import { englishPronunciation } from "./englishPronunciation";
import { chinesePinyin } from "./chinesePinyin";
import { chineseGrammar } from "./chineseGrammar";
import type { LearnLang } from "@/types/vocabulary";

export const allCourses: CourseLevel[] = [
  // Ағылшын
  englishBeginner, englishTenses, englishVerbs, englishPronunciation, businessEnglish,
  // Қытай
  chinesePinyin, chineseGrammar,
];

// Тілге сай курстарды алу
export function getCoursesByLang(lang: LearnLang): CourseLevel[] {
  return allCourses.filter((c) => c.lang === lang);
}
