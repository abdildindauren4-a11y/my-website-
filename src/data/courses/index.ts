// filepath: src/data/courses/index.ts
// Барлық курстар (кейін көбейеді).

import type { CourseLevel } from "@/types/course";
import { englishBeginner } from "./englishBeginner";
import type { LearnLang } from "@/types/vocabulary";

export const allCourses: CourseLevel[] = [englishBeginner];

// Тілге сай курстарды алу
export function getCoursesByLang(lang: LearnLang): CourseLevel[] {
  return allCourses.filter((c) => c.lang === lang);
}
