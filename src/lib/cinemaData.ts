// filepath: src/lib/cinemaData.ts
// LinguaCinema категориялары.
// Сабақтар енді тек қолданушының өз видеоларынан құрылады (customVideoStore),
// AI субтитрден аударма, сөздік және тест жасайды.

export interface CinemaCategory {
  id: string;
  labelKk: string;
  labelEn: string;
  emoji: string;
}

// Кітапхана сүзгісі мен видео қосу формасында қолданылады
export const categories: CinemaCategory[] = [
  { id: "all", labelKk: "Барлығы", labelEn: "All", emoji: "🎬" },
  { id: "movies", labelKk: "Кино/Сериал", labelEn: "Movies/TV", emoji: "🍿" },
  { id: "motivation", labelKk: "Мотивация", labelEn: "Motivation", emoji: "🔥" },
  { id: "daily", labelKk: "Күнделікті", labelEn: "Daily life", emoji: "☀️" },
  { id: "science", labelKk: "Ғылым", labelEn: "Science", emoji: "🔬" },
  { id: "business", labelKk: "Бизнес", labelEn: "Business", emoji: "💼" },
  { id: "music", labelKk: "Музыка", labelEn: "Music", emoji: "🎵" },
  { id: "other", labelKk: "Басқа", labelEn: "Other", emoji: "📁" },
];

// Категория белгісін алу (карточкада көрсету үшін)
export function categoryLabel(id: string, lang: "kk" | "en"): string {
  const c = categories.find((c) => c.id === id);
  if (!c) return id;
  return `${c.emoji} ${lang === "kk" ? c.labelKk : c.labelEn}`;
}
