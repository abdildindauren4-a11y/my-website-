// filepath: src/components/courses/ExercisePlayer.tsx
// Жаттығу ойнатқыш — әр түрге сай көрсетеді, тексереді.

import { useState } from "react";
import { motion } from "framer-motion";
import { useLang } from "@/contexts/LangContext";
import { speak } from "@/lib/speech";
import { shuffle } from "@/lib/gamesData";
import { playMatch, playWrong, playTap } from "@/lib/soundFX";
import type { Exercise } from "@/types/course";
import { Volume2, Check, X, ArrowRight, Lightbulb } from "lucide-react";

interface Props {
  exercise: Exercise;
  onAnswer: (correct: boolean) => void;
}

export default function ExercisePlayer({ exercise, onAnswer }: Props) {
  const { t, lang } = useLang();
  const [answered, setAnswered] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [orderWords, setOrderWords] = useState<string[]>(() =>
    exercise.type === "word-order" && exercise.sentence
      ? shuffle(exercise.sentence.split("|").map((w) => w.trim()))
      : []
  );
  const [builtОrder, setBuiltOrder] = useState<string[]>([]);

  // Жауапты тексеру
  const normalize = (s: string) => s.trim().toLowerCase().replace(/[.,!?]/g, "");
  const checkAnswer = (userAnswer: string): boolean => {
    const correct = normalize(exercise.answer);
    const user = normalize(userAnswer);
    if (user === correct) return true;
    if (exercise.acceptableAnswers) {
      return exercise.acceptableAnswers.some((a) => normalize(a) === user);
    }
    return false;
  };

  const submit = (userAnswer: string) => {
    if (answered) return;
    const isCorrect = checkAnswer(userAnswer);
    setCorrect(isCorrect);
    setAnswered(true);
    if (isCorrect) playMatch();
    else playWrong();
  };

  const handleContinue = () => {
    onAnswer(correct);
    // Reset (келесі жаттығуға)
    setAnswered(false);
    setCorrect(false);
    setTextInput("");
    setSelected(null);
    setBuiltOrder([]);
  };

  // ── FLASHCARD ──
  if (exercise.type === "flashcard") {
    return (
      <div>
        <div className="card p-8 text-center mb-4 bg-gradient-to-br from-accent-green/5 to-accent-blue/5">
          <button onClick={() => speak(exercise.term!, "en")} className="inline-flex items-center gap-2 mb-2 hover:text-accent-blue transition-colors">
            <span className="text-3xl font-display font-bold">{exercise.term}</span>
            <Volume2 className="w-6 h-6 text-text-muted" />
          </button>
          {exercise.phonetic && <p className="text-text-muted font-mono text-sm mb-3">{exercise.phonetic}</p>}
          <div className="pt-3 border-t border-border">
            <p className="text-xl text-accent-green font-medium">{exercise.translation}</p>
          </div>
        </div>
        <button onClick={() => { onAnswer(true); }} className="btn-primary w-full flex items-center justify-center gap-2">
          {lang === "kk" ? "Білемін" : "Got it"} <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // ── MULTIPLE CHOICE ──
  if (exercise.type === "multiple-choice") {
    return (
      <div>
        <div className="card p-6 mb-4">
          <p className="font-medium text-center">{exercise.prompt}</p>
        </div>
        <div className="grid grid-cols-1 gap-2.5 mb-4">
          {exercise.options?.map((opt) => {
            const isCorrectOpt = answered && normalize(opt) === normalize(exercise.answer);
            const isWrongSelected = answered && selected === opt && !correct;
            return (
              <motion.button
                key={opt}
                onClick={() => { if (!answered) { playTap(); setSelected(opt); submit(opt); } }}
                whileTap={{ scale: answered ? 1 : 0.98 }}
                disabled={answered}
                className={`card p-4 text-left font-medium transition-all ${
                  isCorrectOpt ? "border-accent-green bg-accent-green/10 text-accent-green" :
                  isWrongSelected ? "border-accent-red bg-accent-red/10 text-accent-red" :
                  answered ? "opacity-50" : "hover:border-accent-green/40 hover:bg-surface-2"
                }`}
              >
                <span className="flex items-center justify-between">
                  {opt}
                  {isCorrectOpt && <Check className="w-5 h-5" />}
                  {isWrongSelected && <X className="w-5 h-5" />}
                </span>
              </motion.button>
            );
          })}
        </div>
        {answered && <ContinueButton correct={correct} onContinue={handleContinue} answer={exercise.answer} />}
      </div>
    );
  }

  // ── TRANSLATION / FILL-BLANK ──
  if (exercise.type === "translation" || exercise.type === "fill-blank") {
    const displayPrompt = exercise.type === "fill-blank" && exercise.sentence
      ? exercise.sentence.replace("___", "______")
      : exercise.prompt;
    return (
      <div>
        <div className="card p-6 mb-4">
          <p className="font-medium text-center mb-1">{displayPrompt}</p>
          {exercise.type === "translation" && exercise.term && (
            <button onClick={() => speak(exercise.term!, "en")} className="mx-auto flex items-center gap-1 text-sm text-accent-blue">
              <Volume2 className="w-4 h-4" /> {exercise.term}
            </button>
          )}
          {exercise.hint && !answered && (
            <p className="text-xs text-text-muted text-center mt-2 flex items-center justify-center gap-1">
              <Lightbulb className="w-3 h-3" /> {exercise.hint}
            </p>
          )}
        </div>
        <input
          type="text"
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !answered && textInput.trim()) submit(textInput); }}
          disabled={answered}
          placeholder={t("ielts.typeAnswer")}
          className={`w-full bg-surface border-2 rounded-card px-4 py-3 text-center font-medium mb-4 focus:outline-none ${
            answered ? (correct ? "border-accent-green bg-accent-green/5" : "border-accent-red bg-accent-red/5") : "border-border focus:border-accent-green/50"
          }`}
        />
        {!answered ? (
          <button onClick={() => submit(textInput)} disabled={!textInput.trim()} className="btn-primary w-full disabled:opacity-40">
            {lang === "kk" ? "Тексеру" : "Check"}
          </button>
        ) : (
          <ContinueButton correct={correct} onContinue={handleContinue} answer={exercise.answer} />
        )}
      </div>
    );
  }

  // ── WORD ORDER ──
  if (exercise.type === "word-order") {
    const checkOrder = () => {
      const built = builtОrder.join(" ");
      submit(built);
    };
    return (
      <div>
        <div className="card p-6 mb-4">
          <p className="font-medium text-center">{exercise.prompt}</p>
        </div>
        {/* Құрылған сөйлем */}
        <div className={`min-h-[3.5rem] rounded-card border-2 border-dashed p-3 mb-3 flex flex-wrap gap-2 items-center ${
          answered ? (correct ? "border-accent-green bg-accent-green/5" : "border-accent-red bg-accent-red/5") : "border-border"
        }`}>
          {builtОrder.length === 0 && <span className="text-text-muted text-sm mx-auto">{lang === "kk" ? "Сөздерді осында қойыңыз" : "Tap words here"}</span>}
          {builtОrder.map((word, i) => (
            <button key={i} onClick={() => { if (!answered) { setBuiltOrder((p) => p.filter((_, idx) => idx !== i)); setOrderWords((p) => [...p, word]); } }}
              className="px-3 py-1.5 rounded-btn bg-accent-green/10 border border-accent-green/30 text-sm font-medium">
              {word}
            </button>
          ))}
        </div>
        {/* Қол жетімді сөздер */}
        {!answered && (
          <div className="flex flex-wrap gap-2 mb-4 min-h-[2.5rem]">
            {orderWords.map((word, i) => (
              <button key={i} onClick={() => { playTap(); setBuiltOrder((p) => [...p, word]); setOrderWords((p) => p.filter((_, idx) => idx !== i)); }}
                className="px-3 py-1.5 rounded-btn bg-surface border border-border text-sm font-medium hover:border-accent-green/50">
                {word}
              </button>
            ))}
          </div>
        )}
        {!answered ? (
          <button onClick={checkOrder} disabled={builtОrder.length === 0} className="btn-primary w-full disabled:opacity-40">
            {lang === "kk" ? "Тексеру" : "Check"}
          </button>
        ) : (
          <ContinueButton correct={correct} onContinue={handleContinue} answer={exercise.answer} />
        )}
      </div>
    );
  }

  // ── MATCH PAIRS (қарапайым — автоматты өту) ──
  if (exercise.type === "match-pairs") {
    return (
      <div>
        <div className="card p-6 mb-4 text-center">
          <p className="font-medium mb-3">{exercise.prompt}</p>
          <p className="text-sm text-text-muted">{lang === "kk" ? "Бұл жаттығу сөздік бөлімінде" : "This exercise is in the dictionary"}</p>
        </div>
        <button onClick={() => onAnswer(true)} className="btn-primary w-full flex items-center justify-center gap-2">
          {lang === "kk" ? "Жалғастыру" : "Continue"} <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return null;
}

// Жалғастыру батырмасы (дұрыс/қате кері байланыспен)
function ContinueButton({ correct, onContinue, answer }: { correct: boolean; onContinue: () => void; answer: string }) {
  const { lang } = useLang();
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className={`flex items-center gap-2 p-3 rounded-card mb-3 ${correct ? "bg-accent-green/10 text-accent-green" : "bg-accent-red/10 text-accent-red"}`}>
        {correct ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
        <span className="text-sm font-medium">
          {correct ? (lang === "kk" ? "Дұрыс!" : "Correct!") : `${lang === "kk" ? "Дұрыс жауап" : "Answer"}: ${answer}`}
        </span>
      </div>
      <button onClick={onContinue} className="btn-primary w-full flex items-center justify-center gap-2">
        {lang === "kk" ? "Жалғастыру" : "Continue"} <ArrowRight className="w-4 h-4" />
      </button>
    </motion.div>
  );
}
