// filepath: src/store/courseStore.ts
// Курс прогресі — қай сабақ аяқталды, ұпайлар (localStorage).

import { useState, useEffect, useCallback } from "react";
import type { CourseProgress } from "@/types/course";

const STORAGE_KEY = "linguafast_course_progress";

function loadProgress(): CourseProgress {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch { /* */ }
  return { completedLessons: [], lessonScores: {} };
}

function saveProgress(progress: CourseProgress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch { /* */ }
}

export function useCourseProgress() {
  const [progress, setProgress] = useState<CourseProgress>(loadProgress);

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  // Сабақты аяқтау
  const completeLesson = useCallback((lessonId: string, scorePercent: number) => {
    setProgress((prev) => {
      const completed = prev.completedLessons.includes(lessonId)
        ? prev.completedLessons
        : [...prev.completedLessons, lessonId];
      return {
        ...prev,
        completedLessons: completed,
        lessonScores: { ...prev.lessonScores, [lessonId]: Math.max(prev.lessonScores[lessonId] || 0, scorePercent) },
        lastLessonId: lessonId,
      };
    });
  }, []);

  const isLessonCompleted = useCallback((lessonId: string) => {
    return progress.completedLessons.includes(lessonId);
  }, [progress]);

  const getLessonScore = useCallback((lessonId: string) => {
    return progress.lessonScores[lessonId] || 0;
  }, [progress]);

  const resetProgress = useCallback(() => {
    setProgress({ completedLessons: [], lessonScores: {} });
  }, []);

  return { progress, completeLesson, isLessonCompleted, getLessonScore, resetProgress };
}
