// filepath: src/components/cinema/VocabPanel.tsx
// Smart Vocabulary панелі — UI blueprint бойынша.
// Әр сөз: атауы, фонетика, анықтама, аударма, меңгеру дөңгелегі, сақтау.

import { useState } from "react";
import { useLang } from "@/contexts/LangContext";
import { Volume2, Bookmark, ArrowRight } from "lucide-react";
import type { VocabWord } from "@/types/cinema";

// Меңгеру дөңгелегі (пайыз)
function MasteryRing({ value }: { value: number }) {
  const r = 16;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  const color = value >= 80 ? "#10B981" : value >= 50 ? "#F59E0B" : "#EF4444";
  return (
    <div className="relative w-11 h-11 shrink-0">
      <svg className="w-11 h-11 -rotate-90" viewBox="0 0 40 40">
        <circle cx="20" cy="20" r={r} fill="none" stroke="#1E1E3F" strokeWidth="3" />
        <circle cx="20" cy="20" r={r} fill="none" stroke={color} strokeWidth="3" strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" className="transition-all" />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold" style={{ color }}>{value}%</span>
    </div>
  );
}

interface Props {
  words: VocabWord[];
  onSaveWord?: (id: string) => void;
}

export default function VocabPanel({ words, onSaveWord }: Props) {
  const { t } = useLang();
  const [saved, setSaved] = useState<Set<string>>(new Set());

  const toggleSave = (id: string) => {
    setSaved((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
    onSaveWord?.(id);
  };

  return (
    <div className="card p-4 flex flex-col h-full">
      {/* Тақырып */}
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-accent-cyan/15 flex items-center justify-center">
            <span className="text-accent-cyan text-sm">✦</span>
          </div>
          <h3 className="font-display font-semibold">{t("cinema.smartVocab")}</h3>
        </div>
        <span className="text-[10px] font-medium text-accent-green bg-accent-green/15 px-2 py-0.5 rounded-full flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
          {t("cinema.live")}
        </span>
      </div>

      {/* Сөздер тізімі */}
      <div className="flex-1 overflow-y-auto space-y-3 -mr-1 pr-1">
        {words.map((w) => {
          const isSaved = saved.has(w.id);
          return (
            <div key={w.id} className="card bg-surface-2 p-3 border-border">
              {/* Жоғарғы жол: сөз + дыбыс + сақтау */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="font-display font-bold text-text-primary">{w.word}</span>
                  <button className="text-text-secondary hover:text-accent-blue transition-colors shrink-0">
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
                <button
                  onClick={() => toggleSave(w.id)}
                  className={`shrink-0 transition-colors ${isSaved ? "text-accent-gold" : "text-text-muted hover:text-accent-gold"}`}
                >
                  <Bookmark className="w-4 h-4" fill={isSaved ? "currentColor" : "none"} />
                </button>
              </div>

              {/* Орта: анықтама + меңгеру */}
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs text-text-secondary mb-0.5">{w.partOfSpeech}</p>
                  <p className="text-xs text-text-secondary leading-relaxed">{w.definition}</p>
                </div>
                <MasteryRing value={w.mastery} />
              </div>

              {/* Төмен: аударма */}
              <div className="flex items-center gap-2 mt-2 pt-2 border-t border-border">
                <span className="text-[10px] font-bold text-accent-blue bg-accent-blue/15 px-1.5 py-0.5 rounded">EN</span>
                <span className="text-xs text-text-secondary">{w.word}</span>
                <ArrowRight className="w-3 h-3 text-text-muted" />
                <span className="text-[10px] font-bold text-accent-green bg-accent-green/15 px-1.5 py-0.5 rounded">KK</span>
                <span className="text-xs text-text-primary font-medium">{w.translationKk}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Барлық сөздер */}
      <button className="btn-ghost w-full mt-3 flex items-center justify-center gap-1.5 shrink-0">
        {t("cinema.viewAllWords")}
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
