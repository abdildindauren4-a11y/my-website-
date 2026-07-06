// filepath: src/pages/CinemaPage.tsx
// LinguaCinema — кез келген YouTube видеосын толыққанды тіл сабағына айналдыру.
// Ағын: видео қосу → субтитр жүктеу → AI аударма + сөздік + тест жасайды.
// Прогресс нақты: көрілген %, тест нәтижесі, XP, минуттар.

import { useState, useMemo, useRef, useCallback } from "react";
import { useLang } from "@/contexts/LangContext";
import { useVocab } from "@/store/vocabStore";
import { useProgress } from "@/store/progressStore";
import { useCinemaProgress } from "@/store/cinemaProgressStore";
import { useCustomVideos } from "@/store/customVideoStore";
import { isGeminiConfigured } from "@/lib/gemini";
import { getCachedKk, translateBatchToKk } from "@/lib/translate";
import { translateSubtitlesToKk, generateLessonFromSubtitles, explainSentence } from "@/lib/cinemaAI";
import { celebrateBig } from "@/lib/celebrate";
import VideoPlayer from "@/components/cinema/VideoPlayer";
import VocabPanel from "@/components/cinema/VocabPanel";
import LessonCard from "@/components/cinema/LessonCard";
import ComprehensionQuiz from "@/components/cinema/ComprehensionQuiz";
import SubtitleUpload from "@/components/cinema/SubtitleUpload";
import AddVideoModal from "@/components/cinema/AddVideoModal";
import { categories } from "@/lib/cinemaData";
import Markdown from "@/components/chat/Markdown";
import { Film, X, ArrowLeft, Play, GraduationCap, Plus, Trash2, Sparkles, Loader2, Check, MonitorPlay, FileUp, Wand2 } from "lucide-react";
import type { SubtitleLine } from "@/types/cinema";

type Level = "all" | "beginner" | "intermediate" | "advanced";
type LessonTab = "watch" | "quiz";
type AIStatus = "idle" | "translating" | "building" | "done" | "error";

export default function CinemaPage() {
  const { t, lang } = useLang();
  const { addCard, cards, patchTranslation } = useVocab();
  const { addMinutes, completeLesson, addXP } = useProgress();
  const { getProgress, updateWatched, setQuizScore, removeProgress } = useCinemaProgress();
  const { videos, addVideo, updateVideo, removeVideo } = useCustomVideos();

  const [activeId, setActiveId] = useState<string | null>(null);
  const [showTranscript, setShowTranscript] = useState(false);
  const [lessonTab, setLessonTab] = useState<LessonTab>("watch");
  const [category, setCategory] = useState("all");
  const [level, setLevel] = useState<Level>("all");
  const [showAddVideo, setShowAddVideo] = useState(false);
  const [aiStatus, setAiStatus] = useState<AIStatus>("idle");
  const [aiProgress, setAiProgress] = useState("");
  const lastPctRef = useRef(0);
  // Транскрипттегі сөйлем түсіндірмесі
  const [explainLineId, setExplainLineId] = useState<string | null>(null);
  const [explainText, setExplainText] = useState<string | null>(null);
  const [explainBusy, setExplainBusy] = useState(false);

  // Транскрипт жолының грамматикасын түсіндіру
  const handleExplainLine = async (s: SubtitleLine) => {
    if (explainLineId === s.id) { setExplainLineId(null); return; } // жабу
    setExplainLineId(s.id);
    setExplainText(null);
    setExplainBusy(true);
    const result = await explainSentence(s.en, activeLesson?.lang || "en");
    setExplainText(result);
    setExplainBusy(false);
  };

  // Белсенді сабақ — қоймадан алынады (жаңартулар бірден көрінеді)
  const activeLesson = activeId ? videos.find((v) => v.id === activeId) || null : null;

  // Субтитрден сөзді сөздікке (SRS) қосу — қазақша аудармасымен
  const handleAddWordFromSubtitle = (word: string, definition: string, phonetic?: string) => {
    if (cards.some((c) => c.term.toLowerCase() === word.toLowerCase())) return;
    const wordLang = activeLesson?.lang || "en";
    const kk = getCachedKk(word, wordLang);
    addCard({
      lang: wordLang,
      term: word,
      translation: kk || definition, // қазақшасы болса — сол, болмаса уақытша анықтама
      phonetic,
      source: "cinema",
    });
    // Қазақшасы жоқ болса — фонда аударып, картаны жаңарту
    if (!kk) {
      translateBatchToKk([{ t: word, d: definition }], wordLang).then((map) => {
        const translated = map[word];
        if (translated) patchTranslation(word, wordLang, translated);
      });
    }
  };

  // Жүктелген субтитрді видеоға ТҰРАҚТЫ сақтау
  const handleSubtitlesLoaded = (subs: Omit<SubtitleLine, "kk">[]) => {
    if (!activeLesson) return;
    const withKk: SubtitleLine[] = subs.map((s) => ({ ...s, kk: "" }));
    updateVideo(activeLesson.id, { subtitles: withKk, vocabulary: [], questions: [] });
    setAiStatus("idle");
  };

  // ── AI сабақ құру: аударма + сөздік + тест ──
  const generateAILesson = async () => {
    if (!activeLesson || activeLesson.subtitles.length === 0) return;
    const lessonId = activeLesson.id;

    // 1. Субтитрлерді қазақшаға аудару (әлі аударылмағандар болса)
    let subtitles = activeLesson.subtitles;
    if (subtitles.some((s) => !s.kk)) {
      setAiStatus("translating");
      setAiProgress("");
      const translated = await translateSubtitlesToKk(subtitles, activeLesson.lang, (done, total) => {
        setAiProgress(`${done}/${total}`);
      });
      if (!translated) {
        setAiStatus("error");
        return;
      }
      subtitles = translated;
      updateVideo(lessonId, { subtitles });
    }

    // 2. Сөздік + тест құру
    setAiStatus("building");
    setAiProgress("");
    const generated = await generateLessonFromSubtitles(subtitles, activeLesson.level, activeLesson.lang);
    if (!generated) {
      setAiStatus("error");
      return;
    }
    updateVideo(lessonId, { vocabulary: generated.vocabulary, questions: generated.questions });
    setAiStatus("done");
  };

  // Көру прогресі (тек 2%+ өзгерсе жазамыз)
  const handleWatchedPercent = useCallback((pct: number) => {
    if (!activeId) return;
    if (pct - lastPctRef.current >= 2) {
      lastPctRef.current = pct;
      updateWatched(activeId, pct);
    }
  }, [activeId, updateWatched]);

  // Тест аяқталды → нәтиже + XP
  const handleQuizComplete = (score: number) => {
    if (!activeId) return;
    const firstComplete = setQuizScore(activeId, score);
    if (firstComplete) {
      completeLesson({ videoId: activeId, score }); // +50 XP + сабақ есебі
      celebrateBig();
    } else {
      addXP(Math.max(5, Math.round(score / 10)), { type: "quiz", module: "cinema", meta: { videoId: activeId, score } });
    }
  };

  // Видеоны жою (прогресімен бірге)
  const handleDeleteVideo = (id: string) => {
    if (!window.confirm(t("cinema.deleteVideoConfirm"))) return;
    removeVideo(id);
    removeProgress(id);
  };

  // Сүзілген сабақтар
  const filtered = useMemo(() => {
    return videos.filter((l) => {
      if (category !== "all" && l.category !== category) return false;
      if (level !== "all" && l.level !== level) return false;
      return true;
    });
  }, [videos, category, level]);

  const geminiReady = isGeminiConfigured();

  // ════════ САБАҚ КӨРІНІСІ ════════
  if (activeLesson) {
    const hasQuiz = !!activeLesson.questions && activeLesson.questions.length > 0;
    const hasSubs = activeLesson.subtitles.length > 0;
    const hasVocab = activeLesson.vocabulary.length > 0;
    const needsAI = hasSubs && (!hasVocab || activeLesson.subtitles.some((s) => !s.kk));
    const aiBusy = aiStatus === "translating" || aiStatus === "building";

    return (
      <div className="max-w-7xl mx-auto">
        {/* Артқа */}
        <button
          onClick={() => { setActiveId(null); setShowTranscript(false); setLessonTab("watch"); setAiStatus("idle"); lastPctRef.current = 0; }}
          className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> {t("cinema.backToLibrary")}
        </button>

        {/* Сабақ атауы */}
        <div className="mb-4">
          <h1 className="text-xl font-display font-bold">
            {lang === "kk" && activeLesson.titleKk ? activeLesson.titleKk : activeLesson.title}
          </h1>
          {activeLesson.description && (
            <p className="text-text-secondary text-sm mt-1">
              {lang === "kk" && activeLesson.descriptionKk ? activeLesson.descriptionKk : activeLesson.description}
            </p>
          )}
        </div>

        {/* Табтар: Видео / Тест */}
        {hasQuiz && (
          <div className="flex items-center gap-2 border-b border-border mb-5">
            <button
              onClick={() => setLessonTab("watch")}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-all flex items-center gap-1.5 ${lessonTab === "watch" ? "border-accent-pink text-text-primary" : "border-transparent text-text-secondary hover:text-text-primary"}`}
            >
              <Play className="w-3.5 h-3.5" /> {t("cinema.title")}
            </button>
            <button
              onClick={() => setLessonTab("quiz")}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-all flex items-center gap-1.5 ${lessonTab === "quiz" ? "border-accent-purple text-text-primary" : "border-transparent text-text-secondary hover:text-text-primary"}`}
            >
              <GraduationCap className="w-3.5 h-3.5" /> {t("quiz.tab")} ({activeLesson.questions!.length})
            </button>
          </div>
        )}

        {/* Контент: видео немесе тест */}
        {lessonTab === "quiz" && hasQuiz ? (
          <div className="max-w-2xl mx-auto">
            <ComprehensionQuiz questions={activeLesson.questions!} onComplete={handleQuizComplete} />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2">
              <VideoPlayer
                lesson={activeLesson}
                onShowTranscript={() => setShowTranscript(true)}
                onAddWord={handleAddWordFromSubtitle}
                onDuration={(d) => { if (!activeLesson.duration) updateVideo(activeLesson.id, { duration: d }); }}
                onWatchedPercent={handleWatchedPercent}
                onMinuteWatched={() => addMinutes(1)}
              />

              {/* Субтитр жүктеу (.srt/.vtt) — видеоға тұрақты сақталады */}
              <div className="mt-4">
                <SubtitleUpload onLoaded={handleSubtitlesLoaded} />
                {hasSubs && (
                  <p className="flex items-center gap-1.5 text-xs text-accent-green mt-2">
                    <Check className="w-3.5 h-3.5" /> {t("cinema.subsSaved")} · {activeLesson.subtitles.length} {t("sub.lines")}
                  </p>
                )}
              </div>

              {/* AI сабақ құру */}
              {hasSubs && (needsAI || aiBusy || aiStatus === "done" || aiStatus === "error") && (
                <div className="card p-4 mt-4 border-accent-purple/30">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-card bg-accent-purple/15 flex items-center justify-center shrink-0">
                      {aiBusy
                        ? <Loader2 className="w-5 h-5 text-accent-purple animate-spin" />
                        : <Sparkles className="w-5 h-5 text-accent-purple" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      {aiStatus === "translating" ? (
                        <>
                          <p className="font-medium text-sm">{t("cinema.aiTranslating")}</p>
                          <p className="text-xs text-text-secondary">{aiProgress} {t("sub.lines")}</p>
                        </>
                      ) : aiStatus === "building" ? (
                        <p className="font-medium text-sm">{t("cinema.aiBuilding")}</p>
                      ) : aiStatus === "done" ? (
                        <p className="font-medium text-sm text-accent-green">{t("cinema.aiDone")}</p>
                      ) : aiStatus === "error" ? (
                        <p className="font-medium text-sm text-accent-red">{t("cinema.aiError")}</p>
                      ) : (
                        <>
                          <p className="font-medium text-sm">{t("cinema.aiGenerate")}</p>
                          <p className="text-xs text-text-secondary">{t("cinema.aiGenerateDesc")}</p>
                        </>
                      )}
                    </div>
                    {!aiBusy && aiStatus !== "done" && (
                      geminiReady ? (
                        <button onClick={generateAILesson} className="btn-primary flex items-center gap-2 shrink-0 text-sm">
                          <Wand2 className="w-4 h-4" /> {aiStatus === "error" ? t("quiz.retry") : t("cinema.aiGenerate")}
                        </button>
                      ) : (
                        <span className="text-xs text-text-muted shrink-0 max-w-[140px] text-right">{t("cinema.aiNeedKey")}</span>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* Тестке өту шақыруы */}
              {hasQuiz && lessonTab === "watch" && (
                <button
                  onClick={() => setLessonTab("quiz")}
                  className="card p-4 mt-4 w-full flex items-center justify-between hover:border-accent-purple/40 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-card bg-accent-purple/15 flex items-center justify-center">
                      <GraduationCap className="w-5 h-5 text-accent-purple" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-sm">{t("quiz.title")}</p>
                      <p className="text-xs text-text-secondary">{activeLesson.questions!.length} {t("cinema.questions")}</p>
                    </div>
                  </div>
                  <span className="text-accent-purple text-sm font-medium group-hover:translate-x-1 transition-transform">→</span>
                </button>
              )}
            </div>
            <div className="lg:col-span-1 h-[600px]">
              <VocabPanel words={activeLesson.vocabulary} lang={activeLesson.lang} onSaveWord={(id) => {
                const w = activeLesson.vocabulary.find((v) => v.id === id);
                if (w) handleAddWordFromSubtitle(w.word, w.translationKk || w.definition, w.phonetic);
              }} />
            </div>
          </div>
        )}

        {/* Транскрипт модалі */}
        {showTranscript && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowTranscript(false)}>
            <div className="card max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h3 className="font-display font-semibold">{t("cinema.transcript")}</h3>
                <button onClick={() => setShowTranscript(false)} className="text-text-secondary hover:text-text-primary">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="overflow-y-auto p-4 space-y-3">
                {activeLesson.subtitles.map((s) => (
                  <div key={s.id} className="card bg-surface-2 p-3 border-border">
                    <div className="flex items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-text-primary text-sm mb-1">{s.en}</p>
                        {s.kk && <p className="text-text-secondary text-sm">{s.kk}</p>}
                      </div>
                      {/* «Неге бұлай?» — грамматика түсіндірмесі */}
                      {geminiReady && (
                        <button
                          onClick={() => handleExplainLine(s)}
                          title={t("sub.explain")}
                          className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                            explainLineId === s.id ? "bg-accent-purple text-white" : "text-text-muted hover:text-accent-purple hover:bg-accent-purple/10"
                          }`}
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    {/* Түсіндірме */}
                    {explainLineId === s.id && (
                      <div className="mt-2 pt-2 border-t border-border">
                        {explainBusy ? (
                          <p className="text-sm text-text-secondary flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin text-accent-purple" /> {t("sub.explainLoading")}
                          </p>
                        ) : explainText ? (
                          <Markdown text={explainText} />
                        ) : (
                          <p className="text-sm text-accent-red">{t("sub.explainError")}</p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ════════ КІТАПХАНА КӨРІНІСІ ════════
  return (
    <div className="max-w-7xl mx-auto">
      {/* Тақырып */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-11 h-11 rounded-card bg-accent-pink/15 flex items-center justify-center">
          <Film className="w-6 h-6 text-accent-pink" />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-display font-bold">{t("cinema.title")}</h1>
          <p className="text-sm text-text-secondary">{videos.length} {t("cinema.lessonsCount")} · {t("cinema.subtitle")}</p>
        </div>
        {/* Өз видеоңды қосу */}
        <button
          onClick={() => setShowAddVideo(true)}
          className="btn-primary flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" /> <span className="hidden sm:inline">{t("cinema.addVideo")}</span>
        </button>
      </div>

      {videos.length === 0 ? (
        /* ── Бос кітапхана: қалай жұмыс істейтінін түсіндіру ── */
        <div className="card p-8 sm:p-12 text-center">
          <div className="w-16 h-16 rounded-card bg-accent-pink/15 flex items-center justify-center mx-auto mb-4">
            <Film className="w-8 h-8 text-accent-pink" />
          </div>
          <h2 className="text-xl font-display font-bold mb-2">{t("cinema.emptyTitle")}</h2>
          <p className="text-text-secondary mb-8 max-w-md mx-auto">{t("cinema.emptyDesc")}</p>
          {/* 3 қадам */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto mb-8 text-left">
            {[
              { icon: MonitorPlay, label: t("cinema.step1"), color: "accent-pink" },
              { icon: FileUp, label: t("cinema.step2"), color: "accent-blue" },
              { icon: Sparkles, label: t("cinema.step3"), color: "accent-purple" },
            ].map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={i} className="card bg-surface-2 p-4 flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-card bg-${step.color}/15 flex items-center justify-center shrink-0`}>
                    <Icon className={`w-5 h-5 text-${step.color}`} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-text-muted">{i + 1}-{lang === "kk" ? "қадам" : "step"}</span>
                    <p className="text-sm font-medium leading-snug">{step.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <button onClick={() => setShowAddVideo(true)} className="btn-primary inline-flex items-center gap-2">
            <Plus className="w-4 h-4" /> {t("cinema.addVideo")}
          </button>
        </div>
      ) : (
        <>
          {/* Сүзгілер */}
          <div className="space-y-3 mb-6">
            {/* Категория */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCategory(c.id)}
                  className={`px-3 py-1.5 rounded-btn text-sm font-medium whitespace-nowrap transition-all ${category === c.id ? "bg-accent-blue text-white" : "bg-surface-2 text-text-secondary hover:text-text-primary"}`}
                >
                  {c.emoji} {lang === "kk" ? c.labelKk : c.labelEn}
                </button>
              ))}
            </div>
            {/* Деңгей */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {([["all", t("cinema.allLevels")], ["beginner", t("cinema.beginner")], ["intermediate", t("cinema.intermediate")], ["advanced", t("cinema.advanced")]] as const).map(([val, label]) => (
                <button
                  key={val}
                  onClick={() => setLevel(val)}
                  className={`px-3 py-1.5 rounded-btn text-xs font-medium whitespace-nowrap transition-all border ${level === val ? "border-accent-blue text-accent-blue" : "border-border text-text-muted hover:text-text-secondary"}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Сабақтар торы */}
          {filtered.length === 0 ? (
            <div className="card p-12 text-center">
              <Film className="w-12 h-12 text-text-muted mx-auto mb-3" />
              <p className="text-text-secondary">{t("cinema.noVideo")}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((lesson) => (
                <div key={lesson.id} className="relative group">
                  <LessonCard
                    lesson={lesson}
                    progress={getProgress(lesson.id)}
                    onClick={() => { setActiveId(lesson.id); setLessonTab("watch"); setAiStatus("idle"); lastPctRef.current = 0; }}
                  />
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDeleteVideo(lesson.id); }}
                    className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-accent-red"
                    title={t("cinema.deleteVideo")}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Видео қосу модалі */}
      {showAddVideo && (
        <AddVideoModal onClose={() => setShowAddVideo(false)} onAdd={(input) => { const l = addVideo(input); setActiveId(l.id); }} />
      )}
    </div>
  );
}
