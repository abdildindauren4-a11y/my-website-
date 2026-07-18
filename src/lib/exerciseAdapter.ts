// filepath: src/lib/exerciseAdapter.ts
// Адаптерлер: бар мазмұнды (курс жаттығулары, практика сұрақтары)
// ортақ ExerciseSpec форматына келтіреді (ROADMAP 1.5) + ортақ бағалаушы.
// Осының арқасында жаңа сабақ қозғалтқышы (3-кезең) ескі мазмұнмен де жүреді.

import type { Exercise } from "@/types/course";
import type { PracticeQuestion } from "@/lib/practiceGenerator";
import type { ExerciseSpec } from "@/types/exercise";
import type { LearnLang } from "@/types/vocabulary";

// ── Ортақ бағалаушы: барлық жүйе жауапты БІРДЕЙ тексереді ──
export function normalizeAnswer(s: string): string {
  return s.trim().toLowerCase().replace(/[.,!?。，！？]/g, "").replace(/\s+/g, " ");
}

export function gradeAnswer(spec: Pick<ExerciseSpec, "answer" | "acceptableAnswers">, userAnswer: string): boolean {
  const user = normalizeAnswer(userAnswer);
  if (user === normalizeAnswer(spec.answer)) return true;
  return (spec.acceptableAnswers ?? []).some((a) => normalizeAnswer(a) === user);
}

// ── Курс жаттығуы (ескі Exercise) → ExerciseSpec ──
export function fromCourseExercise(ex: Exercise, lang: LearnLang): ExerciseSpec {
  const base = {
    id: ex.id,
    lang,
    prompt: ex.prompt,
    promptKk: ex.promptKk,
    answer: ex.answer,
    acceptableAnswers: ex.acceptableAnswers,
    hint: ex.hint,
  };

  switch (ex.type) {
    case "flashcard":
      // Таныстыру картасы: сөз + аударма, бағаланбайды
      return { ...base, type: "present", text: ex.term, phonetic: ex.phonetic, answer: ex.answer || ex.translation || "" };
    case "multiple-choice":
      return { ...base, type: "choice", options: ex.options ?? [] };
    case "translation":
      return { ...base, type: "translate", text: ex.term };
    case "fill-blank":
      // sentence: "I ___ to school" — көрсету prompt-та, толтыру answer-мен
      return { ...base, type: "fill", text: ex.sentence };
    case "word-order":
      // sentence: "I|would|appreciate|…" — дұрыс реттегі сөздер
      return { ...base, type: "order", words: (ex.sentence ?? ex.answer).split("|").map((w) => w.trim()) };
    case "listening":
      return { ...base, type: "listen-type", text: ex.audioText ?? ex.answer };
    case "match-pairs":
      // Ескі мазмұнда жұптар жоқ (1 дана, стуб еді) — таныстыруға түсіреміз
      return { ...base, type: "present", text: ex.prompt };
    default:
      return { ...base, type: "choice", options: ex.options ?? [ex.answer] };
  }
}

// ── Практика сұрағы → ExerciseSpec ──
export function fromPracticeQuestion(q: PracticeQuestion): ExerciseSpec {
  return {
    id: q.id,
    type: "choice",
    lang: q.lang,
    prompt: q.prompt,
    promptKk: q.promptKk,
    text: q.term,
    options: q.options,
    answer: q.answer,
    explanation: q.explanation,
  };
}

// ── Сабақтың барлық жаттығуын бірден келтіру ──
export function specsFromExercises(exercises: Exercise[], lang: LearnLang): ExerciseSpec[] {
  return exercises.map((ex) => fromCourseExercise(ex, lang));
}
