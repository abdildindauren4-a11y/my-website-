// filepath: src/types/cinema.ts
// LinguaCinema деректер құрылымы — видео, субтитр, сөздер.

// Бір субтитр жолы (екі тілде)
export interface SubtitleLine {
  id: string;
  start: number;   // басталу уақыты (секунд)
  end: number;     // аяқталу уақыты (секунд)
  en: string;      // ағылшынша мәтін
  kk: string;      // қазақша аудармасы
}

// Сөздіктегі сөз (Smart Vocabulary)
export interface VocabWord {
  id: string;
  word: string;        // сөз (ағылшынша)
  phonetic?: string;   // фонетика /transcription/
  partOfSpeech: string; // сөз табы (noun, verb, adjective...)
  definition: string;   // анықтама (ағылшынша)
  translationKk: string; // қазақша аудармасы
  mastery: number;      // меңгеру деңгейі (0-100)
  saved?: boolean;      // сақталған ба
}

// Түсіну сұрағы (видеодан кейінгі тест)
export interface ComprehensionQuestion {
  id: string;
  question: string;        // сұрақ (ағылшынша)
  questionKk: string;      // сұрақ (қазақша)
  options: string[];       // жауап нұсқалары
  correctIndex: number;    // дұрыс жауап индексі
  explanation?: string;    // түсіндірме
}

// Видео сабақ
export interface CinemaLesson {
  id: string;
  title: string;          // сабақ атауы
  titleKk?: string;       // қазақша атауы
  description?: string;   // қысқаша сипаттама
  descriptionKk?: string;
  youtubeIdEn: string;    // ағылшын тілді YouTube видео ID
  youtubeIdKk?: string;   // қазақ тілді нұсқа (бар болса)
  duration: number;       // ұзақтығы (секунд)
  level: "beginner" | "intermediate" | "advanced";
  category: string;       // категория (motivation, science, daily, business...)
  lang: "en" | "zh";      // үйрену тілі
  subtitles: SubtitleLine[];
  vocabulary: VocabWord[];
  questions?: ComprehensionQuestion[]; // түсіну тесті
  thumbnail?: string;     // алдын ала сурет (YouTube-тан автоматты)
}

// Сабақ прогресі (қолданушының)
export interface LessonProgress {
  lessonId: string;
  completed: boolean;
  watchedPercent: number;  // көрілген пайыз
  quizScore?: number;      // тест нәтижесі
  wordsLearned: number;    // үйренген сөз саны
  lastWatched?: number;    // соңғы көру (timestamp)
}
