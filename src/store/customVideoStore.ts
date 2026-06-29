// filepath: src/store/customVideoStore.ts
// Қолданушы өзі қосқан YouTube видео сабақтары (localStorage).
// Кітапханада дайын сабақтармен қатар көрсетіледі.

import { useState, useEffect, useCallback } from "react";
import type { CinemaLesson } from "@/types/cinema";

const STORAGE_KEY = "linguafast_custom_videos";

// YouTube сілтемесінен/ID-ден таза видео ID алу
export function parseYouTubeId(input: string): string | null {
  const s = input.trim();
  if (!s) return null;
  // Тікелей 11-таңбалы ID
  if (/^[\w-]{11}$/.test(s)) return s;
  // Әртүрлі URL форматтары
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([\w-]{11})/,
    /(?:youtu\.be\/)([\w-]{11})/,
    /(?:youtube\.com\/embed\/)([\w-]{11})/,
    /(?:youtube\.com\/shorts\/)([\w-]{11})/,
  ];
  for (const re of patterns) {
    const m = s.match(re);
    if (m) return m[1];
  }
  return null;
}

function load(): CinemaLesson[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch { /* */ }
  return [];
}

function save(list: CinemaLesson[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch { /* */ }
}

// Жаңа видео қосу үшін енгізілетін деректер
export interface NewVideoInput {
  title: string;
  titleKk: string;
  description: string;
  descriptionKk: string;
  youtubeId: string;
  level: "beginner" | "intermediate" | "advanced";
  category: string;
  lang: "en" | "zh";
}

export function useCustomVideos() {
  const [videos, setVideos] = useState<CinemaLesson[]>(load);

  useEffect(() => { save(videos); }, [videos]);

  const addVideo = useCallback((input: NewVideoInput) => {
    const lesson: CinemaLesson = {
      id: "custom-" + Date.now(),
      title: input.title,
      titleKk: input.titleKk || input.title,
      description: input.description,
      descriptionKk: input.descriptionKk || input.description,
      youtubeIdEn: input.youtubeId,
      duration: 0,
      level: input.level,
      category: input.category,
      lang: input.lang,
      subtitles: [],
      vocabulary: [],
      questions: [],
    };
    setVideos((prev) => [lesson, ...prev]);
    return lesson;
  }, []);

  const removeVideo = useCallback((id: string) => {
    setVideos((prev) => prev.filter((v) => v.id !== id));
  }, []);

  return { videos, addVideo, removeVideo };
}
