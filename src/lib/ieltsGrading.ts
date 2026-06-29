// filepath: src/lib/ieltsGrading.ts
// IELTS Reading тексеру жүйесі — мінсіз, нағыз емтихандай.
// Жауаптарды салыстырады, band есептейді, түсіндірме береді.

import type { ReadingTest, UserAnswers, TestResult, IeltsQuestion, ListeningTest } from "@/types/ielts";
import { rawScoreToBand, listeningScoreToBand } from "@/types/ielts";

// Жауапты нормалау (бос орын, регистр, тыныс белгілерін ескермеу)
function normalize(answer: string): string {
  return answer
    .trim()
    .toLowerCase()
    .replace(/[.,!?;:'"]/g, "")
    .replace(/\s+/g, " ");
}

// Артикльдерді алып тастау (sentence completion үшін: "a car" = "car")
function stripArticles(answer: string): string {
  return normalize(answer).replace(/^(a|an|the)\s+/, "");
}

// Бір сұрақты тексеру
export function checkAnswer(question: IeltsQuestion, userAnswer: string): boolean {
  if (!userAnswer || !userAnswer.trim()) return false;

  const user = normalize(userAnswer);
  const correct = normalize(question.answer);

  // Дәл сәйкестік
  if (user === correct) return true;

  // Қабылданатын баламалар (мысалы: TRUE = T, "a car" = "car")
  if (question.acceptableAnswers) {
    for (const acc of question.acceptableAnswers) {
      if (user === normalize(acc)) return true;
    }
  }

  // True/False/Not Given — қысқартуларды қабылдау
  if (question.type === "true-false-notgiven" || question.type === "yes-no-notgiven") {
    const map: Record<string, string[]> = {
      "true": ["t", "true"],
      "false": ["f", "false"],
      "not given": ["ng", "not given", "notgiven"],
      "yes": ["y", "yes"],
      "no": ["n", "no"],
    };
    const correctVariants = map[correct] || [correct];
    if (correctVariants.includes(user)) return true;
  }

  // Sentence/Summary completion — артикльсіз салыстыру
  if (question.type === "sentence-completion" || question.type === "summary-completion") {
    if (stripArticles(user) === stripArticles(correct)) return true;
  }

  return false;
}

// Толық тестті тексеру
export function gradeTest(
  test: ReadingTest,
  answers: UserAnswers,
  timeSpentSec: number
): TestResult {
  const breakdown: TestResult["breakdown"] = [];
  let correct = 0;

  // Барлық сұрақты жинау
  const allQuestions: IeltsQuestion[] = [];
  test.passages.forEach((p) => {
    p.groups.forEach((g) => {
      g.questions.forEach((q) => allQuestions.push(q));
    });
  });

  allQuestions.forEach((q) => {
    const userAnswer = answers[q.id] || "";
    const isCorrect = checkAnswer(q, userAnswer);
    if (isCorrect) correct++;
    breakdown.push({
      questionId: q.id,
      correct: isCorrect,
      userAnswer,
      correctAnswer: q.answer,
    });
  });

  const total = allQuestions.length;
  const band = rawScoreToBand(correct, total);

  return {
    testId: test.id,
    correct,
    total,
    band,
    answers,
    breakdown,
    completedAt: new Date().toISOString(),
    timeSpentSec,
  };
}

// Passage бойынша бөлшектеп нәтиже (қай passage қиын болды)
export function resultByPassage(test: ReadingTest, result: TestResult) {
  return test.passages.map((p) => {
    const questionIds = new Set<string>();
    p.groups.forEach((g) => g.questions.forEach((q) => questionIds.add(q.id)));
    const passageBreakdown = result.breakdown.filter((b) => questionIds.has(b.questionId));
    const passageCorrect = passageBreakdown.filter((b) => b.correct).length;
    return {
      passageNumber: p.number,
      title: p.title,
      correct: passageCorrect,
      total: passageBreakdown.length,
    };
  });
}

// Сұрақ түрі бойынша талдау (қай түрде әлсіз)
export function resultByQuestionType(test: ReadingTest, result: TestResult) {
  const typeStats: Record<string, { correct: number; total: number }> = {};
  test.passages.forEach((p) => {
    p.groups.forEach((g) => {
      g.questions.forEach((q) => {
        if (!typeStats[q.type]) typeStats[q.type] = { correct: 0, total: 0 };
        typeStats[q.type].total++;
        const b = result.breakdown.find((br) => br.questionId === q.id);
        if (b?.correct) typeStats[q.type].correct++;
      });
    });
  });
  return typeStats;
}

// ── LISTENING тексеру ──
export function gradeListeningTest(
  test: ListeningTest,
  answers: UserAnswers,
  timeSpentSec: number
): TestResult {
  const breakdown: TestResult["breakdown"] = [];
  let correct = 0;

  const allQuestions: IeltsQuestion[] = [];
  test.sections.forEach((s) => {
    s.groups.forEach((g) => {
      g.questions.forEach((q) => allQuestions.push(q));
    });
  });

  allQuestions.forEach((q) => {
    const userAnswer = answers[q.id] || "";
    const isCorrect = checkAnswer(q, userAnswer);
    if (isCorrect) correct++;
    breakdown.push({
      questionId: q.id,
      correct: isCorrect,
      userAnswer,
      correctAnswer: q.answer,
    });
  });

  const total = allQuestions.length;
  const band = listeningScoreToBand(correct, total);

  return {
    testId: test.id,
    correct,
    total,
    band,
    answers,
    breakdown,
    completedAt: new Date().toISOString(),
    timeSpentSec,
  };
}

// Section бойынша нәтиже
export function listeningResultBySection(test: ListeningTest, result: TestResult) {
  return test.sections.map((s) => {
    const questionIds = new Set<string>();
    s.groups.forEach((g) => g.questions.forEach((q) => questionIds.add(q.id)));
    const sectionBreakdown = result.breakdown.filter((b) => questionIds.has(b.questionId));
    const sectionCorrect = sectionBreakdown.filter((b) => b.correct).length;
    return {
      sectionNumber: s.number,
      title: s.title,
      correct: sectionCorrect,
      total: sectionBreakdown.length,
    };
  });
}
