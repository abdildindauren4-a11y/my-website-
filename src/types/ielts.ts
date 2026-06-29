// filepath: src/types/ielts.ts
// IELTS Reading типтері — нағыз емтихан форматына сай.
// Барлық сұрақ түрлерін қамтиды (кеңейтуге дайын).

// Сұрақ түрлері (нағыз IELTS Reading)
export type QuestionType =
  | "true-false-notgiven"   // True / False / Not Given
  | "yes-no-notgiven"       // Yes / No / Not Given (пікір туралы)
  | "multiple-choice"       // Бір дұрыс жауап (A/B/C/D)
  | "matching-headings"     // Абзацқа тақырып сәйкестендіру
  | "sentence-completion"   // Сөйлемді толықтыру (мәтіннен сөз)
  | "summary-completion"    // Қорытындыны толықтыру
  | "matching-information"; // Ақпаратты абзацпен сәйкестендіру

// Жалпы сұрақ интерфейсі
export interface IeltsQuestion {
  id: string;
  type: QuestionType;
  number: number;             // сұрақ нөмірі (1-40)
  prompt: string;             // сұрақ мәтіні
  // Жауап нұсқалары (MCQ, headings үшін)
  options?: string[];
  // Дұрыс жауап (түріне қарай: "TRUE"/"FALSE"/"NOT GIVEN", индекс, сөз)
  answer: string;
  // Қабылданатын баламалар (sentence completion үшін: "car"/"a car")
  acceptableAnswers?: string[];
  // Түсіндірме (жауаптан кейін)
  explanation?: string;
  // Мәтіндегі қай абзацта (сілтеме)
  paragraphRef?: number;
}

// Сұрақ тобы (бір нұсқаулықпен біріктірілген)
export interface QuestionGroup {
  id: string;
  type: QuestionType;
  instruction: string;        // "Choose TRUE, FALSE or NOT GIVEN"
  instructionKk: string;      // қазақша нұсқаулық
  wordLimit?: number;         // "No more than TWO words"
  questions: IeltsQuestion[];
  // Matching headings үшін: тақырыптар тізімі
  headings?: { id: string; text: string }[];
}

// Мәтін (passage)
export interface ReadingPassage {
  id: string;
  number: 1 | 2 | 3;          // қай passage (қиындай береді)
  title: string;
  titleKk?: string;
  // Абзацтар (A, B, C... — matching headings үшін)
  paragraphs: { label: string; text: string }[];
  groups: QuestionGroup[];
  difficulty: "easy" | "medium" | "hard";
  topic: string;              // тақырып (ғылым, тарих, т.б.)
  wordCount: number;
}

// Толық тест
export interface ReadingTest {
  id: string;
  title: string;
  titleKk: string;
  passages: ReadingPassage[];
  totalQuestions: number;     // әдетте 40
  timeMinutes: number;        // 60
}

// Қолданушының жауаптары
export type UserAnswers = Record<string, string>; // questionId → жауап

// Нәтиже
export interface TestResult {
  testId: string;
  correct: number;
  total: number;
  band: number;               // 1-9
  answers: UserAnswers;
  // Әр сұрақ дұрыс па
  breakdown: { questionId: string; correct: boolean; userAnswer: string; correctAnswer: string }[];
  completedAt: string;
  timeSpentSec: number;
}

// ── LISTENING (тыңдау) ──
// Аудио сегменті (TTS оқиды)
export interface AudioLine {
  speaker?: string;   // кім сөйлейді (диалог үшін)
  text: string;       // оқылатын мәтін
  pauseAfter?: number; // кейін кідіріс (секунд)
}

export interface ListeningSection {
  id: string;
  number: 1 | 2 | 3 | 4;  // 4 бөлім, қиындай береді
  title: string;
  titleKk: string;
  context: string;        // жағдай сипаттамасы
  contextKk: string;
  audioLines: AudioLine[]; // TTS оқитын диалог/монолог
  groups: QuestionGroup[];
  difficulty: "easy" | "medium" | "hard";
}

export interface ListeningTest {
  id: string;
  title: string;
  titleKk: string;
  sections: ListeningSection[];
  totalQuestions: number;
  type: "listening";
}

// Listening band конверсиясы (ресми, Reading-тен сәл өзгеше)
export function listeningScoreToBand(correct: number, total = 40): number {
  const ratio = correct / total;
  const scaled = Math.round(ratio * 40);
  if (scaled >= 39) return 9.0;
  if (scaled >= 37) return 8.5;
  if (scaled >= 35) return 8.0;
  if (scaled >= 32) return 7.5;
  if (scaled >= 30) return 7.0;
  if (scaled >= 26) return 6.5;
  if (scaled >= 23) return 6.0;
  if (scaled >= 18) return 5.5;
  if (scaled >= 16) return 5.0;
  if (scaled >= 13) return 4.5;
  if (scaled >= 10) return 4.0;
  if (scaled >= 6) return 3.0;
  return 2.0;
}

// ── Band конверсия (Academic Reading, ресми кесте) ──
// Зерттелді: ielts.org + Cambridge ресми деректер
export function rawScoreToBand(correct: number, total = 40): number {
  // 40 сұраққа шақталған кесте
  const ratio = correct / total;
  const scaled = Math.round(ratio * 40); // 40-ке нормалау

  if (scaled >= 39) return 9.0;
  if (scaled >= 37) return 8.5;
  if (scaled >= 35) return 8.0;
  if (scaled >= 33) return 7.5;
  if (scaled >= 30) return 7.0;
  if (scaled >= 27) return 6.5;
  if (scaled >= 23) return 6.0;
  if (scaled >= 19) return 5.5;
  if (scaled >= 15) return 5.0;
  if (scaled >= 13) return 4.5;
  if (scaled >= 10) return 4.0;
  if (scaled >= 8) return 3.5;
  if (scaled >= 6) return 3.0;
  if (scaled >= 4) return 2.5;
  return 2.0;
}

// Band деңгейінің сипаттамасы
export function bandDescription(band: number, lang: "kk" | "en"): string {
  const descriptions: Record<number, { kk: string; en: string }> = {
    9: { kk: "Эксперт қолданушы", en: "Expert user" },
    8: { kk: "Өте жақсы қолданушы", en: "Very good user" },
    7: { kk: "Жақсы қолданушы", en: "Good user" },
    6: { kk: "Қабілетті қолданушы", en: "Competent user" },
    5: { kk: "Орташа қолданушы", en: "Modest user" },
    4: { kk: "Шектеулі қолданушы", en: "Limited user" },
    3: { kk: "Өте шектеулі", en: "Extremely limited" },
  };
  const floor = Math.floor(band);
  return descriptions[floor]?.[lang] || descriptions[3][lang];
}
