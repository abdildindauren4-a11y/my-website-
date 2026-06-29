// filepath: src/pages/IeltsPage.tsx
// IELTS Reading беті — нағыз емтихан тәжірибесі.
// Тест таңдау → мәтін + сұрақтар → таймер → нәтиже (band + талдау).

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useLang } from "@/contexts/LangContext";
import { useProgress } from "@/store/progressStore";
import { readingTests } from "@/lib/ieltsData";
import { listeningTest1 } from "@/lib/ielts/listening1";
import { gradeTest, resultByPassage, resultByQuestionType, gradeListeningTest, listeningResultBySection } from "@/lib/ieltsGrading";
import { bandDescription } from "@/types/ielts";
import type { ReadingTest, UserAnswers, TestResult, ListeningTest } from "@/types/ielts";
import QuestionInput from "@/components/ielts/QuestionInput";
import AudioPlayer from "@/components/ielts/AudioPlayer";
import WritingModule from "@/components/ielts/WritingModule";
import SpeakingModule from "@/components/ielts/SpeakingModule";
import {
  GraduationCap, BookOpen, Headphones, PenTool, Mic, Clock, ArrowLeft,
  CheckCircle2, XCircle, Trophy, ChevronRight, Lock,
} from "lucide-react";

type View = "hub" | "test" | "result" | "listen-test" | "listen-result" | "writing" | "speaking";

const listeningTests: ListeningTest[] = [listeningTest1];

export default function IeltsPage() {
  const { t, lang } = useLang();
  const { addXP } = useProgress();
  const [view, setView] = useState<View>("hub");
  const [activeTest, setActiveTest] = useState<ReadingTest | null>(null);
  const [activeListening, setActiveListening] = useState<ListeningTest | null>(null);
  const [answers, setAnswers] = useState<UserAnswers>({});
  const [result, setResult] = useState<TestResult | null>(null);
  const [passageIdx, setPassageIdx] = useState(0);
  const [sectionIdx, setSectionIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const startTimeRef = useRef<number>(0);

  // Таймер
  useEffect(() => {
    if (view !== "test") return;
    if (timeLeft <= 0) { handleSubmit(); return; }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line
  }, [timeLeft, view]);

  const startTest = (test: ReadingTest) => {
    setActiveTest(test);
    setAnswers({});
    setResult(null);
    setPassageIdx(0);
    setTimeLeft(test.timeMinutes * 60);
    startTimeRef.current = Date.now();
    setView("test");
  };

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = () => {
    if (!activeTest) return;
    const timeSpent = Math.round((Date.now() - startTimeRef.current) / 1000);
    const res = gradeTest(activeTest, answers, timeSpent);
    setResult(res);
    addXP(res.correct * 5); // әр дұрыс жауап = 5 XP
    setView("result");
  };

  // ── Listening функциялары ──
  const startListening = (test: ListeningTest) => {
    setActiveListening(test);
    setAnswers({});
    setResult(null);
    setSectionIdx(0);
    startTimeRef.current = Date.now();
    setView("listen-test");
  };

  const handleListeningSubmit = () => {
    if (!activeListening) return;
    const timeSpent = Math.round((Date.now() - startTimeRef.current) / 1000);
    const res = gradeListeningTest(activeListening, answers, timeSpent);
    setResult(res);
    addXP(res.correct * 5);
    setView("listen-result");
  };

  // ── ХАБ (бөлім таңдау) ──
  if (view === "hub") {
    const sections = [
      { id: "reading", label: t("ielts.reading"), icon: BookOpen, color: "accent-green", available: true, desc: t("ielts.readingDesc"), onClick: null },
      { id: "listening", label: t("ielts.listening"), icon: Headphones, color: "accent-blue", available: true, desc: "4 " + t("listen.section").toLowerCase() + " · 40 " + t("ielts.questions"), onClick: null },
      { id: "writing", label: t("ielts.writing"), icon: PenTool, color: "accent-purple", available: true, desc: "Task 2 · AI " + (lang === "kk" ? "бағалау" : "scoring"), onClick: () => setView("writing") },
      { id: "speaking", label: t("ielts.speaking"), icon: Mic, color: "accent-gold", available: true, desc: "3 " + t("speak.part").toLowerCase() + " · AI " + (lang === "kk" ? "бағалау" : "scoring"), onClick: () => setView("speaking") },
    ];
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-card bg-accent-green/15 flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-accent-green" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold">{t("ielts.title")}</h1>
            <p className="text-sm text-text-secondary">{t("ielts.subtitle")}</p>
          </div>
        </div>

        {/* 4 бөлім */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {sections.map((s) => {
            const Icon = s.icon;
            const clickable = s.available && s.onClick;
            return (
              <div
                key={s.id}
                onClick={() => s.onClick?.()}
                className={`card p-5 ${s.available ? "" : "opacity-60"} ${clickable ? "cursor-pointer hover:border-accent-purple/40 transition-colors" : ""}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-11 h-11 rounded-card bg-${s.color}/15 flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 text-${s.color}`} />
                  </div>
                  {s.available ? (
                    <span className="text-[10px] font-bold bg-accent-green/15 text-accent-green px-2 py-1 rounded-full">
                      {t("ielts.available")}
                    </span>
                  ) : (
                    <span className="text-[10px] font-medium bg-surface-2 text-text-muted px-2 py-1 rounded-full flex items-center gap-1">
                      <Lock className="w-3 h-3" /> {t("ielts.comingSoon")}
                    </span>
                  )}
                </div>
                <h3 className="font-display font-bold mb-1">{s.label}</h3>
                {s.desc && <p className="text-xs text-text-secondary">{s.desc}</p>}
              </div>
            );
          })}
        </div>

        {/* Reading тесттері */}
        <h2 className="font-display font-semibold mb-3 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-accent-green" /> {t("ielts.reading")}
        </h2>
        <div className="space-y-3 mb-8">
          {readingTests.map((test) => (
            <motion.button
              key={test.id}
              whileHover={{ y: -2 }}
              onClick={() => startTest(test)}
              className="card p-5 w-full text-left flex items-center justify-between hover:border-accent-green/40 transition-colors"
            >
              <div>
                <h3 className="font-display font-bold mb-1">{lang === "kk" ? test.titleKk : test.title}</h3>
                <p className="text-sm text-text-secondary">
                  {test.passages.length} {t("ielts.passages")} · {test.totalQuestions} {t("ielts.questions")} · {test.timeMinutes} {t("ielts.minutes")}
                </p>
              </div>
              <div className="flex items-center gap-2 text-accent-green font-medium text-sm shrink-0">
                {t("ielts.startTest")} <ChevronRight className="w-4 h-4" />
              </div>
            </motion.button>
          ))}
        </div>

        {/* Listening тесттері */}
        <h2 className="font-display font-semibold mb-3 flex items-center gap-2">
          <Headphones className="w-5 h-5 text-accent-blue" /> {t("ielts.listening")}
        </h2>
        <div className="space-y-3">
          {listeningTests.map((test) => (
            <motion.button
              key={test.id}
              whileHover={{ y: -2 }}
              onClick={() => startListening(test)}
              className="card p-5 w-full text-left flex items-center justify-between hover:border-accent-blue/40 transition-colors"
            >
              <div>
                <h3 className="font-display font-bold mb-1">{lang === "kk" ? test.titleKk : test.title}</h3>
                <p className="text-sm text-text-secondary">
                  {test.sections.length} {t("listen.section").toLowerCase()} · {test.totalQuestions} {t("ielts.questions")}
                </p>
              </div>
              <div className="flex items-center gap-2 text-accent-blue font-medium text-sm shrink-0">
                {t("ielts.startTest")} <ChevronRight className="w-4 h-4" />
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  // ── ТЕСТ (мәтін + сұрақтар) ──
  if (view === "test" && activeTest) {
    const passage = activeTest.passages[passageIdx];
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const answeredCount = Object.keys(answers).filter((k) => answers[k]?.trim()).length;

    return (
      <div className="max-w-6xl mx-auto">
        {/* Жоғарғы панель: таймер + прогресс */}
        <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-border -mx-4 px-4 py-3 mb-4">
          <div className="flex items-center justify-between gap-4">
            <button onClick={() => setView("hub")} className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary">
              <ArrowLeft className="w-4 h-4" /> {t("ielts.backToTests")}
            </button>
            <div className="flex items-center gap-4">
              <span className="text-sm text-text-secondary">
                {answeredCount}/{activeTest.totalQuestions} {t("ielts.answered")}
              </span>
              <div className={`flex items-center gap-1.5 font-display font-bold ${timeLeft <= 300 ? "text-accent-red" : ""}`}>
                <Clock className="w-4 h-4" />
                <span className="tabular-nums">{minutes}:{String(seconds).padStart(2, "0")}</span>
              </div>
              <button onClick={() => { if (window.confirm(t("ielts.submitConfirm"))) handleSubmit(); }} className="btn-primary text-sm py-1.5 px-4">
                {t("ielts.submit")}
              </button>
            </div>
          </div>
        </div>

        {/* Passage навигация */}
        <div className="flex items-center gap-2 mb-4">
          {activeTest.passages.map((p, i) => (
            <button
              key={p.id}
              onClick={() => setPassageIdx(i)}
              className={`px-3 py-1.5 rounded-btn text-sm font-medium transition-all ${
                i === passageIdx ? "bg-accent-green text-white" : "bg-surface-2 text-text-secondary hover:bg-surface"
              }`}
            >
              {t("ielts.passage")} {p.number}
            </button>
          ))}
        </div>

        {/* Екі баған: мәтін | сұрақтар */}
        <div className="grid lg:grid-cols-2 gap-5">
          {/* Сол жақ: мәтін */}
          <div className="card p-5 lg:max-h-[calc(100vh-12rem)] lg:overflow-y-auto">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold bg-accent-green/15 text-accent-green px-2 py-0.5 rounded">
                {t("ielts.passage")} {passage.number}
              </span>
              <span className="text-xs text-text-muted">{passage.wordCount} {lang === "kk" ? "сөз" : "words"}</span>
            </div>
            <h2 className="text-lg font-display font-bold mb-3">{passage.title}</h2>
            <div className="space-y-3">
              {passage.paragraphs.map((para) => (
                <div key={para.label} className="text-sm leading-relaxed">
                  <span className="font-bold text-accent-green mr-1.5">{para.label}</span>
                  {para.text}
                </div>
              ))}
            </div>
          </div>

          {/* Оң жақ: сұрақтар */}
          <div className="card p-5 lg:max-h-[calc(100vh-12rem)] lg:overflow-y-auto">
            {passage.groups.map((group) => (
              <div key={group.id} className="mb-6 last:mb-0">
                {/* Нұсқаулық */}
                <div className="bg-surface-2 rounded-card p-3 mb-3">
                  <p className="text-xs font-semibold text-text-primary mb-1">
                    {lang === "kk" ? group.instructionKk : group.instruction}
                  </p>
                  {group.wordLimit && (
                    <p className="text-[10px] text-accent-gold font-medium">
                      ⚠️ {group.wordLimit} {t("ielts.wordLimit")}
                    </p>
                  )}
                </div>

                {/* Matching headings — тақырыптар тізімі */}
                {group.type === "matching-headings" && group.headings && (
                  <div className="bg-surface-2/50 rounded-card p-3 mb-3 text-xs space-y-1">
                    {group.headings.map((h) => (
                      <div key={h.id}><span className="font-bold mr-1.5">{h.id}.</span>{h.text}</div>
                    ))}
                  </div>
                )}

                {/* Сұрақтар */}
                <div className="space-y-4">
                  {group.questions.map((q) => (
                    <div key={q.id}>
                      <div className="flex gap-2 mb-2">
                        <span className="shrink-0 w-6 h-6 rounded-full bg-accent-green/15 text-accent-green text-xs font-bold flex items-center justify-center">
                          {q.number}
                        </span>
                        <p className="text-sm">{q.prompt}</p>
                      </div>
                      <div className="ml-8">
                        <QuestionInput question={q} group={group} value={answers[q.id] || ""} onChange={(v) => handleAnswer(q.id, v)} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── НӘТИЖЕ ──
  if (view === "result" && result && activeTest) {
    const byPassage = resultByPassage(activeTest, result);
    const byType = resultByQuestionType(activeTest, result);
    const minutes = Math.floor(result.timeSpentSec / 60);
    const typeLabels: Record<string, { kk: string; en: string }> = {
      "true-false-notgiven": { kk: "True/False/Not Given", en: "True/False/Not Given" },
      "yes-no-notgiven": { kk: "Yes/No/Not Given", en: "Yes/No/Not Given" },
      "multiple-choice": { kk: "Көп таңдау", en: "Multiple choice" },
      "matching-headings": { kk: "Тақырып сәйкестендіру", en: "Matching headings" },
      "sentence-completion": { kk: "Сөйлем толықтыру", en: "Sentence completion" },
      "summary-completion": { kk: "Қорытынды толықтыру", en: "Summary completion" },
    };

    return (
      <div className="max-w-3xl mx-auto">
        {/* Band нәтиже */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="card p-8 text-center mb-5 bg-gradient-to-br from-accent-green/10 to-accent-blue/5 border-accent-green/30"
        >
          <Trophy className="w-14 h-14 text-accent-gold mx-auto mb-3" />
          <p className="text-text-secondary mb-1">{t("ielts.yourBand")}</p>
          <div className="text-6xl font-display font-bold text-accent-green mb-2">{result.band.toFixed(1)}</div>
          <p className="text-sm text-text-secondary mb-4">{bandDescription(result.band, lang)}</p>
          <div className="flex items-center justify-center gap-6 text-sm">
            <div className="text-center">
              <div className="font-display font-bold text-lg">{result.correct}/{result.total}</div>
              <div className="text-[10px] text-text-muted">{t("ielts.correctAnswers")}</div>
            </div>
            <div className="text-center">
              <div className="font-display font-bold text-lg">{minutes} {t("ielts.minutes")}</div>
              <div className="text-[10px] text-text-muted">{t("ielts.timeSpent")}</div>
            </div>
          </div>
        </motion.div>

        {/* Passage бойынша */}
        <div className="card p-5 mb-4">
          <h3 className="font-display font-semibold mb-3 text-sm">{t("ielts.byPassage")}</h3>
          <div className="space-y-2">
            {byPassage.map((p) => (
              <div key={p.passageNumber} className="flex items-center justify-between">
                <span className="text-sm">{t("ielts.passage")} {p.passageNumber}: {p.title}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-1.5 rounded-full bg-border overflow-hidden">
                    <div className="h-full bg-accent-green rounded-full" style={{ width: `${(p.correct / p.total) * 100}%` }} />
                  </div>
                  <span className="text-sm font-medium tabular-nums">{p.correct}/{p.total}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Сұрақ түрі бойынша */}
        <div className="card p-5 mb-4">
          <h3 className="font-display font-semibold mb-3 text-sm">{t("ielts.byType")}</h3>
          <div className="space-y-2">
            {Object.entries(byType).map(([type, stat]) => (
              <div key={type} className="flex items-center justify-between">
                <span className="text-sm">{typeLabels[type]?.[lang] || type}</span>
                <span className={`text-sm font-medium tabular-nums ${stat.correct === stat.total ? "text-accent-green" : stat.correct / stat.total < 0.5 ? "text-accent-red" : ""}`}>
                  {stat.correct}/{stat.total}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Жауаптарды қарау */}
        <details className="card p-5 mb-4">
          <summary className="font-display font-semibold text-sm cursor-pointer">{t("ielts.reviewAnswers")}</summary>
          <div className="mt-4 space-y-3">
            {activeTest.passages.flatMap((p) => p.groups.flatMap((g) => g.questions)).map((q) => {
              const b = result.breakdown.find((br) => br.questionId === q.id)!;
              return (
                <div key={q.id} className={`p-3 rounded-card border ${b.correct ? "border-accent-green/30 bg-accent-green/5" : "border-accent-red/30 bg-accent-red/5"}`}>
                  <div className="flex items-start gap-2 mb-1">
                    {b.correct ? <CheckCircle2 className="w-4 h-4 text-accent-green shrink-0 mt-0.5" /> : <XCircle className="w-4 h-4 text-accent-red shrink-0 mt-0.5" />}
                    <p className="text-sm font-medium">{q.number}. {q.prompt}</p>
                  </div>
                  <div className="ml-6 text-xs space-y-0.5">
                    <p className="text-text-secondary">{t("ielts.yourAnswerWas")}: <span className={b.correct ? "text-accent-green" : "text-accent-red"}>{b.userAnswer || t("ielts.noAnswer")}</span></p>
                    {!b.correct && <p className="text-text-secondary">{t("ielts.correctIs")}: <span className="text-accent-green font-medium">{q.answer}</span></p>}
                    {q.explanation && <p className="text-text-muted italic">{q.explanation}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </details>

        {/* Әрекеттер */}
        <div className="flex gap-3">
          <button onClick={() => setView("hub")} className="btn-ghost flex-1">{t("ielts.backToTests")}</button>
          <button onClick={() => startTest(activeTest)} className="btn-primary flex-1">{t("ielts.tryAgain")}</button>
        </div>
      </div>
    );
  }

  // ── LISTENING ТЕСТ ──
  if (view === "listen-test" && activeListening) {
    const section = activeListening.sections[sectionIdx];
    const answeredCount = Object.keys(answers).filter((k) => answers[k]?.trim()).length;

    return (
      <div className="max-w-5xl mx-auto">
        {/* Жоғарғы панель */}
        <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-border -mx-4 px-4 py-3 mb-4">
          <div className="flex items-center justify-between gap-4">
            <button onClick={() => setView("hub")} className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary">
              <ArrowLeft className="w-4 h-4" /> {t("ielts.backToTests")}
            </button>
            <div className="flex items-center gap-4">
              <span className="text-sm text-text-secondary">{answeredCount}/{activeListening.totalQuestions} {t("ielts.answered")}</span>
              <button onClick={() => { if (window.confirm(t("ielts.submitConfirm"))) handleListeningSubmit(); }} className="btn-primary text-sm py-1.5 px-4">
                {t("ielts.submit")}
              </button>
            </div>
          </div>
        </div>

        {/* Section навигация */}
        <div className="flex items-center gap-2 mb-4">
          {activeListening.sections.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setSectionIdx(i)}
              className={`px-3 py-1.5 rounded-btn text-sm font-medium transition-all ${
                i === sectionIdx ? "bg-accent-blue text-white" : "bg-surface-2 text-text-secondary hover:bg-surface"
              }`}
            >
              {t("listen.section")} {s.number}
            </button>
          ))}
        </div>

        {/* Жағдай сипаттамасы */}
        <div className="card p-4 mb-4 bg-accent-blue/5 border-accent-blue/20">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold bg-accent-blue/15 text-accent-blue px-2 py-0.5 rounded">{t("listen.section")} {section.number}</span>
            <h2 className="font-display font-bold">{lang === "kk" ? section.titleKk : section.title}</h2>
          </div>
          <p className="text-sm text-text-secondary">{lang === "kk" ? section.contextKk : section.context}</p>
        </div>

        {/* Аудио ойнатқыш */}
        <div className="mb-3">
          <AudioPlayer audioLines={section.audioLines} />
        </div>
        <p className="text-xs text-text-muted mb-5 flex items-center gap-1.5">
          💡 {t("listen.audioHint")}
        </p>

        {/* Сұрақтар */}
        <div className="card p-5">
          {section.groups.map((group) => (
            <div key={group.id} className="mb-6 last:mb-0">
              <div className="bg-surface-2 rounded-card p-3 mb-3">
                <p className="text-xs font-semibold text-text-primary mb-1">{lang === "kk" ? group.instructionKk : group.instruction}</p>
                {group.wordLimit && <p className="text-[10px] text-accent-gold font-medium">⚠️ {group.wordLimit} {t("ielts.wordLimit")}</p>}
              </div>
              <div className="space-y-4">
                {group.questions.map((q) => (
                  <div key={q.id}>
                    <div className="flex gap-2 mb-2">
                      <span className="shrink-0 w-6 h-6 rounded-full bg-accent-blue/15 text-accent-blue text-xs font-bold flex items-center justify-center">{q.number}</span>
                      <p className="text-sm">{q.prompt}</p>
                    </div>
                    <div className="ml-8">
                      <QuestionInput question={q} group={group} value={answers[q.id] || ""} onChange={(v) => handleAnswer(q.id, v)} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── LISTENING НӘТИЖЕ ──
  if (view === "listen-result" && result && activeListening) {
    const bySection = listeningResultBySection(activeListening, result);
    const minutes = Math.floor(result.timeSpentSec / 60);

    return (
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="card p-8 text-center mb-5 bg-gradient-to-br from-accent-blue/10 to-accent-green/5 border-accent-blue/30"
        >
          <Trophy className="w-14 h-14 text-accent-gold mx-auto mb-3" />
          <p className="text-text-secondary mb-1">{t("ielts.yourBand")}</p>
          <div className="text-6xl font-display font-bold text-accent-blue mb-2">{result.band.toFixed(1)}</div>
          <p className="text-sm text-text-secondary mb-4">{bandDescription(result.band, lang)}</p>
          <div className="flex items-center justify-center gap-6 text-sm">
            <div className="text-center">
              <div className="font-display font-bold text-lg">{result.correct}/{result.total}</div>
              <div className="text-[10px] text-text-muted">{t("ielts.correctAnswers")}</div>
            </div>
            <div className="text-center">
              <div className="font-display font-bold text-lg">{minutes} {t("ielts.minutes")}</div>
              <div className="text-[10px] text-text-muted">{t("ielts.timeSpent")}</div>
            </div>
          </div>
        </motion.div>

        {/* Section бойынша */}
        <div className="card p-5 mb-4">
          <h3 className="font-display font-semibold mb-3 text-sm">{t("listen.bySection")}</h3>
          <div className="space-y-2">
            {bySection.map((s) => (
              <div key={s.sectionNumber} className="flex items-center justify-between">
                <span className="text-sm">{t("listen.section")} {s.sectionNumber}: {s.title}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-1.5 rounded-full bg-border overflow-hidden">
                    <div className="h-full bg-accent-blue rounded-full" style={{ width: `${(s.correct / s.total) * 100}%` }} />
                  </div>
                  <span className="text-sm font-medium tabular-nums">{s.correct}/{s.total}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Жауаптарды қарау */}
        <details className="card p-5 mb-4">
          <summary className="font-display font-semibold text-sm cursor-pointer">{t("ielts.reviewAnswers")}</summary>
          <div className="mt-4 space-y-3">
            {activeListening.sections.flatMap((s) => s.groups.flatMap((g) => g.questions)).map((q) => {
              const b = result.breakdown.find((br) => br.questionId === q.id)!;
              return (
                <div key={q.id} className={`p-3 rounded-card border ${b.correct ? "border-accent-green/30 bg-accent-green/5" : "border-accent-red/30 bg-accent-red/5"}`}>
                  <div className="flex items-start gap-2 mb-1">
                    {b.correct ? <CheckCircle2 className="w-4 h-4 text-accent-green shrink-0 mt-0.5" /> : <XCircle className="w-4 h-4 text-accent-red shrink-0 mt-0.5" />}
                    <p className="text-sm font-medium">{q.number}. {q.prompt}</p>
                  </div>
                  <div className="ml-6 text-xs space-y-0.5">
                    <p className="text-text-secondary">{t("ielts.yourAnswerWas")}: <span className={b.correct ? "text-accent-green" : "text-accent-red"}>{b.userAnswer || t("ielts.noAnswer")}</span></p>
                    {!b.correct && <p className="text-text-secondary">{t("ielts.correctIs")}: <span className="text-accent-green font-medium">{q.answer}</span></p>}
                    {q.explanation && <p className="text-text-muted italic">{q.explanation}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </details>

        <div className="flex gap-3">
          <button onClick={() => setView("hub")} className="btn-ghost flex-1">{t("ielts.backToTests")}</button>
          <button onClick={() => startListening(activeListening)} className="btn-primary flex-1">{t("ielts.tryAgain")}</button>
        </div>
      </div>
    );
  }

  // ── WRITING модулі ──
  if (view === "writing") {
    return <WritingModule onBack={() => setView("hub")} />;
  }

  // ── SPEAKING модулі ──
  if (view === "speaking") {
    return <SpeakingModule onBack={() => setView("hub")} />;
  }

  return null;
}
