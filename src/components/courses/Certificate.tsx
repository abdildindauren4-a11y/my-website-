// filepath: src/components/courses/Certificate.tsx
// Курс аяқталғандағы кәсіби сертификат — аты, курс, күні, басып шығару.

import { useState } from "react";
import { motion } from "framer-motion";
import { useLang } from "@/contexts/LangContext";
import { useUserPrefs } from "@/store/userPrefs";
import { Award, ArrowLeft, Printer, Check } from "lucide-react";
import type { CourseLevel } from "@/types/course";

export default function Certificate({ course, onBack }: { course: CourseLevel; onBack: () => void }) {
  const { lang } = useLang();
  const { prefs, update } = useUserPrefs();
  const [name, setName] = useState(prefs.name || "");
  const saved = !!prefs.name;

  const date = new Date().toLocaleDateString(lang === "kk" ? "kk-KZ" : "en-US", { year: "numeric", month: "long", day: "numeric" });
  const courseTitle = lang === "kk" ? course.titleKk : course.title;
  const certId = `LF-${course.id.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8)}-${new Date().getFullYear()}`;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-5 no-print">
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary">
          <ArrowLeft className="w-4 h-4" /> {lang === "kk" ? "Курсқа" : "Back to course"}
        </button>
        <button onClick={() => window.print()} className="btn-primary flex items-center gap-2 text-sm">
          <Printer className="w-4 h-4" /> {lang === "kk" ? "Басып шығару / PDF" : "Print / Save PDF"}
        </button>
      </div>

      {/* Атын енгізу (сертификатта көрсету үшін) */}
      {!saved && (
        <div className="card p-4 mb-5 no-print flex flex-col sm:flex-row items-center gap-3">
          <input
            value={name} onChange={(e) => setName(e.target.value)}
            placeholder={lang === "kk" ? "Аты-жөніңізді енгізіңіз" : "Enter your full name"}
            className="flex-1 w-full bg-surface-2 border border-border rounded-btn px-3 py-2.5 text-sm focus:outline-none focus:border-accent-green/50"
          />
          <button onClick={() => name.trim() && update({ name: name.trim() })} disabled={!name.trim()}
            className="btn-primary flex items-center gap-2 text-sm disabled:opacity-40 shrink-0">
            <Check className="w-4 h-4" /> {lang === "kk" ? "Растау" : "Confirm"}
          </button>
        </div>
      )}

      {/* СЕРТИФИКАТ */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
        id="certificate"
        className="relative bg-white text-slate-800 rounded-card overflow-hidden shadow-xl"
        style={{ aspectRatio: "1.414 / 1" }}
      >
        {/* Жиек */}
        <div className="absolute inset-3 border-2 border-accent-gold/60 rounded-lg" />
        <div className="absolute inset-4 border border-accent-green/40 rounded-lg" />

        <div className="relative h-full flex flex-col items-center justify-center text-center px-6 sm:px-12 py-8">
          {/* Логотип */}
          <div className="flex items-center gap-2 mb-2">
            <div className="w-9 h-9 rounded-lg bg-accent-green flex items-center justify-center">
              <Award className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-lg tracking-tight">LinguaFast</span>
          </div>

          <p className="uppercase tracking-[0.2em] text-[10px] sm:text-xs text-slate-400 mb-1">
            {lang === "kk" ? "Аяқтау сертификаты" : "Certificate of Completion"}
          </p>
          <div className="w-16 h-0.5 bg-accent-gold mb-4" />

          <p className="text-xs sm:text-sm text-slate-500 mb-1">{lang === "kk" ? "Осы куәлік берілді:" : "This is proudly presented to"}</p>
          <h1 className="font-display font-bold text-2xl sm:text-4xl text-slate-800 mb-3 border-b-2 border-slate-200 pb-2 px-4">
            {(prefs.name || name || (lang === "kk" ? "Оқушы" : "Learner"))}
          </h1>

          <p className="text-xs sm:text-sm text-slate-500 mb-1">
            {lang === "kk" ? "төмендегі курсты сәтті аяқтағаны үшін:" : "for successfully completing the course"}
          </p>
          <h2 className="font-display font-semibold text-lg sm:text-2xl text-accent-green mb-4">{courseTitle}</h2>

          {/* Төменгі жол */}
          <div className="flex items-end justify-between w-full max-w-md mt-auto pt-6 text-left">
            <div>
              <p className="font-medium text-sm text-slate-700">{date}</p>
              <div className="w-24 h-px bg-slate-300 my-1" />
              <p className="text-[10px] text-slate-400">{lang === "kk" ? "Күні" : "Date"}</p>
            </div>
            <div className="text-center">
              <p className="font-[cursive] text-lg text-slate-700">{course.instructor || "LinguaFast"}</p>
              <div className="w-24 h-px bg-slate-300 my-1" />
              <p className="text-[10px] text-slate-400">{lang === "kk" ? "Нұсқаушы" : "Instructor"}</p>
            </div>
          </div>
          <p className="text-[9px] text-slate-300 mt-3">ID: {certId}</p>
        </div>
      </motion.div>

      <style>{`@media print { .no-print { display: none !important; } body * { visibility: hidden; } #certificate, #certificate * { visibility: visible; } #certificate { position: absolute; left: 0; top: 0; width: 100%; } }`}</style>
    </div>
  );
}
