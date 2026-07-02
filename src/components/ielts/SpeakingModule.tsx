// filepath: src/components/ielts/SpeakingModule.tsx
// IELTS Speaking модулі — микрофон → сөйлеу → AI бағалау.

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useLang } from "@/contexts/LangContext";
import { useProgress } from "@/store/progressStore";
import {
  speakingTests, evaluateSpeaking, createRecognition, isSpeechRecognitionSupported,
  type SpeakingTest, type SpeakingEvaluation, type RecognitionController,
} from "@/lib/ieltsSpeaking";
import { isGeminiConfigured } from "@/lib/gemini";
import { startMicRecording, isMicSupported, type MicRecorder, type MicError } from "@/lib/micRecorder";
import { bandDescription } from "@/types/ielts";
import EvaluationResult from "./EvaluationResult";
import { Mic, Square, ArrowLeft, ChevronRight, AlertCircle, Loader2, Volume2, Play, Trash2 } from "lucide-react";
import { speak } from "@/lib/speech";

type View = "list" | "test" | "evaluating" | "result";

export default function SpeakingModule({ onBack }: { onBack: () => void }) {
  const { t, lang } = useLang();
  const { addXP } = useProgress();
  const [view, setView] = useState<View>("list");
  const [test, setTest] = useState<SpeakingTest | null>(null);
  const [qIdx, setQIdx] = useState(0);
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [answers, setAnswers] = useState<{ question: string; answer: string }[]>([]);
  const [evaluation, setEvaluation] = useState<SpeakingEvaluation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [prepTime, setPrepTime] = useState(0);
  const [recSeconds, setRecSeconds] = useState(0);
  const [micLevel, setMicLevel] = useState(0);          // нақты дауыс деңгейі (0..1)
  const [audioUrl, setAudioUrl] = useState<string | null>(null); // жазылған жауап
  const recognitionRef = useRef<RecognitionController | null>(null);
  const micRef = useRef<MicRecorder | null>(null);
  const levelRafRef = useRef<number>(0);
  const speechSupported = isSpeechRecognitionSupported() || isMicSupported();

  const question = test?.questions[qIdx];

  // Part 2 дайындық таймері
  useEffect(() => {
    if (prepTime <= 0) return;
    const timer = setTimeout(() => setPrepTime((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [prepTime]);

  // Сөйлеу таймері (жазу кезінде өсіп отырады)
  useEffect(() => {
    if (!recording) return;
    const timer = setInterval(() => setRecSeconds((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, [recording]);

  // Сұрақ өзгергенде дауыстап оқу + дайындық
  useEffect(() => {
    if (view === "test" && question) {
      speak(question.question, "en");
      if (question.part === 2 && question.prepSeconds) {
        setPrepTime(question.prepSeconds);
      }
    }
    // eslint-disable-next-line
  }, [qIdx, view]);

  const startTest = (tk: SpeakingTest) => {
    // Микрофон болмаса да — жазып жауап беруге болады
    setTest(tk);
    setQIdx(0);
    setAnswers([]);
    setTranscript("");
    setEvaluation(null);
    setError(null);
    setView("test");
  };

  // Деңгей өлшегіш цикл (жазу кезінде нақты амплитуданы көрсетеді)
  const levelLoop = () => {
    setMicLevel(micRef.current?.getLevel() || 0);
    levelRafRef.current = requestAnimationFrame(levelLoop);
  };

  const stopLevelLoop = () => {
    cancelAnimationFrame(levelRafRef.current);
    setMicLevel(0);
  };

  const clearRecording = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
  };

  const toggleRecording = async () => {
    if (recording) {
      // ── Тоқтату: тану + аудио жазба ──
      setRecording(false);
      stopLevelLoop();
      recognitionRef.current?.stop();
      const rec = await micRef.current?.stop();
      micRef.current = null;
      if (rec) setAudioUrl(rec.url);
    } else {
      // ── Бастау ──
      setError(null);
      clearRecording();

      // 1) Нақты аудио жазу (тыңдап тексеру үшін)
      if (isMicSupported()) {
        try {
          micRef.current = await startMicRecording();
        } catch (e) {
          const err = e as MicError;
          if (err === "not-allowed") { setError("MIC_PERMISSION"); return; }
          if (err === "no-device") { setError("MIC_NO_DEVICE"); return; }
          micRef.current = null; // жазылмаса да тану жұмыс істей береді
        }
      }

      // 2) Сөзді тану (transcript — AI бағалауға)
      if (isSpeechRecognitionSupported()) {
        const rec = createRecognition(
          (text) => setTranscript(text),
          () => { /* тоқтағаны toggleRecording-те өңделеді */ },
          (err) => {
            if (err === "not-allowed") { setError("MIC_PERMISSION"); setRecording(false); stopLevelLoop(); }
          }
        );
        recognitionRef.current = rec;
        rec?.start();
      }

      setRecSeconds(0);
      setRecording(true);
      if (micRef.current) levelLoop();
    }
  };

  const nextQuestion = () => {
    if (!question) return;
    recognitionRef.current?.stop();
    micRef.current?.cancel();
    micRef.current = null;
    stopLevelLoop();
    setRecording(false);
    setRecSeconds(0);
    clearRecording();
    // Жауапты сақтау
    const newAnswers = [...answers, { question: question.question, answer: transcript || "(no answer)" }];
    setAnswers(newAnswers);
    setTranscript("");

    if (qIdx + 1 >= (test?.questions.length || 0)) {
      submitEvaluation(newAnswers);
    } else {
      setQIdx((i) => i + 1);
    }
  };

  const submitEvaluation = async (finalAnswers: { question: string; answer: string }[]) => {
    if (!isGeminiConfigured()) { setError("NO_KEY"); return; }
    setView("evaluating");
    try {
      const result = await evaluateSpeaking(finalAnswers, lang);
      setEvaluation(result);
      addXP(Math.round(result.overallBand * 10));
      setView("result");
    } catch (e: any) {
      setError(e.message === "NO_API_KEY" ? "NO_KEY" : "EVAL_ERROR");
      setView("test");
    }
  };

  // ── ТІЗІМ ──
  if (view === "list") {
    return (
      <div className="max-w-3xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary mb-4">
          <ArrowLeft className="w-4 h-4" /> {t("ielts.backToTests")}
        </button>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-card bg-accent-gold/15 flex items-center justify-center">
            <Mic className="w-6 h-6 text-accent-gold" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold">{t("ielts.speaking")}</h1>
            <p className="text-sm text-text-secondary">{t("speak.transcriptNote")}</p>
          </div>
        </div>

        {!speechSupported && (
          <div className="card p-4 mb-4 border-accent-gold/30 bg-accent-gold/5 flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-accent-gold shrink-0 mt-0.5" />
            <p className="text-sm text-text-secondary">{t("speak.typeInstead")}</p>
          </div>
        )}
        {!isGeminiConfigured() && (
          <div className="card p-4 mb-4 border-accent-gold/30 bg-accent-gold/5 flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-accent-gold shrink-0 mt-0.5" />
            <p className="text-sm text-text-secondary">{t("write.needApiKey")}</p>
          </div>
        )}

        <div className="space-y-3">
          {speakingTests.map((tk) => (
            <motion.button
              key={tk.id} whileHover={{ y: -2 }} onClick={() => startTest(tk)}
              className="card p-5 w-full text-left flex items-center justify-between hover:border-accent-gold/40 transition-colors"
            >
              <div>
                <h3 className="font-display font-bold mb-1">{lang === "kk" ? tk.titleKk : tk.title}</h3>
                <p className="text-sm text-text-secondary">{tk.questions.length} {t("ielts.questions")} · 3 {t("speak.part").toLowerCase()}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-accent-gold shrink-0" />
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  // ── ТЕСТ (сөйлеу) ──
  if (view === "test" && question) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => setView("list")} className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary">
            <ArrowLeft className="w-4 h-4" /> {t("ielts.backToTests")}
          </button>
          <span className="text-sm text-text-secondary">{qIdx + 1}/{test?.questions.length}</span>
        </div>

        {/* Part белгісі */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs font-bold bg-accent-gold/15 text-accent-gold px-2.5 py-1 rounded-full">
            {t("speak.part")} {question.part}
          </span>
        </div>

        {error && (
          <div className="card p-3 mb-3 border-accent-red/30 bg-accent-red/5 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-accent-red shrink-0 mt-0.5" />
            <p className="text-sm text-accent-red">{error === "MIC_PERMISSION" ? t("speak.micPermission") : error === "MIC_NO_DEVICE" ? t("speak.micNoDevice") : error === "NO_KEY" ? t("write.needApiKey") : t("write.error")}</p>
          </div>
        )}

        {/* Сұрақ */}
        <div className="card p-6 mb-4">
          <button onClick={() => speak(question.question, "en")} className="flex items-start gap-2 text-left w-full hover:text-accent-blue transition-colors mb-2">
            <Volume2 className="w-5 h-5 text-text-muted shrink-0 mt-0.5" />
            <p className="font-medium">{question.question}</p>
          </button>
          <p className="text-xs text-text-muted ml-7">{question.questionKk}</p>

          {/* Part 2 — cue card */}
          {question.part === 2 && question.cueCard && (
            <div className="mt-4 p-4 rounded-card bg-surface-2 border border-border">
              <p className="text-xs font-semibold mb-2">{t("speak.youShouldSay")}</p>
              <ul className="space-y-1">
                {question.cueCard.map((c, i) => (
                  <li key={i} className="text-sm text-text-secondary flex gap-2"><span className="text-accent-gold">•</span> {c}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Дайындық таймері (Part 2) */}
          {prepTime > 0 && (
            <div className="mt-3 text-center">
              <p className="text-xs text-text-muted mb-1">{t("speak.prepare")}</p>
              <div className="text-2xl font-display font-bold text-accent-gold tabular-nums">{prepTime}s</div>
            </div>
          )}
        </div>

        {/* Микрофон + жауап */}
        <div className="card p-6 mb-4">
          {speechSupported && (
            <div className="flex flex-col items-center mb-4">
              {/* Микрофон батырмасы — нақты дауыс деңгейімен пульстейтін сақина */}
              <div className="relative mb-3">
                {recording && (
                  <span
                    className="absolute inset-0 rounded-full bg-accent-red/25 transition-transform duration-75"
                    style={{ transform: `scale(${1.15 + micLevel * 0.6})` }}
                  />
                )}
                <button
                  onClick={toggleRecording}
                  className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all ${
                    recording ? "bg-accent-red text-white shadow-card-hover" : "bg-accent-gold text-white hover:bg-accent-gold/90 shadow-card"
                  }`}
                >
                  {recording ? <Square className="w-7 h-7" fill="currentColor" /> : <Mic className="w-8 h-8" />}
                </button>
              </div>

              {/* Тірі индикатор + таймер */}
              {recording ? (
                <div className="flex flex-col items-center gap-1.5">
                  {/* Нақты дауыс деңгейінің жолақтары */}
                  <div className="flex items-end gap-1 h-6">
                    {[0.5, 0.8, 1, 0.8, 0.5].map((mult, i) => (
                      <span
                        key={i}
                        className="w-1.5 rounded-full bg-accent-red transition-all duration-75"
                        style={{ height: `${Math.max(6, micLevel * 24 * mult + (micRef.current ? 0 : 8))}px` }}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-accent-red tabular-nums">
                    {Math.floor(recSeconds / 60)}:{String(recSeconds % 60).padStart(2, "0")} · {t("speak.recording")}
                  </span>
                  <span className="text-[11px] text-text-muted">{t("speak.tapToStop")}</span>
                </div>
              ) : (
                <p className="text-sm font-medium">{transcript ? t("speak.tapToContinue") : t("speak.startRecording")}</p>
              )}

              {/* Жазылған жауапты тыңдау */}
              {audioUrl && !recording && (
                <div className="w-full mt-4 p-3 rounded-card bg-surface-2 border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <Play className="w-3.5 h-3.5 text-accent-gold" />
                    <span className="text-xs font-semibold">{t("speak.listenBack")}</span>
                    <button
                      onClick={clearRecording}
                      className="ml-auto text-text-muted hover:text-accent-red transition-colors"
                      title={t("cinema.deleteVideo")}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <audio src={audioUrl} controls className="w-full h-9" />
                </div>
              )}
            </div>
          )}

          {/* Жауап мәтіні — өңдеуге/жазуға болады */}
          <label className="text-xs text-text-muted mb-1.5 block">
            {speechSupported ? t("speak.yourAnswerEditable") : t("speak.typeAnswer")}
          </label>
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            rows={5}
            placeholder={speechSupported ? t("speak.answerPlaceholder") : t("speak.typePlaceholder")}
            className="w-full bg-surface-2 border border-border rounded-card px-3 py-2.5 text-sm focus:outline-none focus:border-accent-gold/50 resize-y leading-relaxed"
          />
          <p className="text-[11px] text-text-muted mt-1.5">
            {transcript.trim() ? `${transcript.trim().split(/\s+/).length} ${lang === "kk" ? "сөз" : "words"}` : ""}
          </p>
        </div>

        <button onClick={nextQuestion} disabled={!transcript.trim()} className="btn-primary w-full disabled:opacity-40">
          {qIdx + 1 >= (test?.questions.length || 0) ? t("speak.finish") : t("speak.nextQuestion")}
        </button>
      </div>
    );
  }

  // ── БАҒАЛАП ЖАТЫР ──
  if (view === "evaluating") {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="inline-block mb-4">
          <Loader2 className="w-12 h-12 text-accent-gold" />
        </motion.div>
        <h3 className="text-xl font-display font-bold mb-2">{t("speak.evaluating")}</h3>
        <p className="text-sm text-text-secondary">{t("write.evaluatingSub")}</p>
      </div>
    );
  }

  // ── НӘТИЖЕ ──
  if (view === "result" && evaluation) {
    return (
      <EvaluationResult
        overallBand={evaluation.overallBand}
        criteria={[
          { ...evaluation.criteria.fluencyCoherence, label: t("speak.fluency") },
          { ...evaluation.criteria.lexicalResource, label: t("write.lexical") },
          { ...evaluation.criteria.grammaticalRange, label: t("write.grammar") },
          { ...evaluation.criteria.pronunciation, label: t("speak.pronunciation") },
        ]}
        strengths={evaluation.strengths}
        improvements={evaluation.improvements}
        wordCount={evaluation.wordCount}
        accentColor="accent-gold"
        bandDescription={bandDescription(evaluation.overallBand, lang)}
        onRetry={() => test && startTest(test)}
        onBack={() => setView("list")}
      />
    );
  }

  return null;
}
