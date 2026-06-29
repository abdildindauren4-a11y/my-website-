// filepath: src/components/cinema/SubtitleOverlay.tsx
// Интерактив екі тілді субтитр.
// Ағылшын мәтіндегі ӘР СӨЗДІ басуға болады → мағынасы шығады → сөздікке қосуға болады.

import { useState } from "react";
import { useLang } from "@/contexts/LangContext";
import { speak } from "@/lib/speech";
import { lookupWord, searchFullDictionary, type DictEntry } from "@/lib/dictionary";
import { Volume2, Plus, Check, X } from "lucide-react";
import type { SubtitleLine } from "@/types/cinema";

interface Props {
  line: SubtitleLine | null;
  lang?: "en" | "zh";
  onAddWord?: (word: string, definition: string, phonetic?: string) => void;
}

export default function SubtitleOverlay({ line, lang = "en", onAddWord }: Props) {
  const { t } = useLang();
  const [activeWord, setActiveWord] = useState<string | null>(null);
  const [entry, setEntry] = useState<DictEntry | null>(null);
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);

  if (!line) return null;

  // Сөзді тазалау (тыныс белгілерін алып тастау)
  const cleanWord = (w: string) => w.replace(/[.,!?;:"'()]/g, "").toLowerCase();

  // Сөз басылғанда — мағынасын табу
  const handleWordClick = async (rawWord: string) => {
    const word = cleanWord(rawWord);
    if (!word || word.length < 2) return;

    setActiveWord(word);
    setAdded(false);
    setEntry(null);
    setLoading(true);

    // Алдымен жылдам базадан
    let found = lookupWord(word, lang);
    // Табылмаса — толық базадан (168k)
    if (!found) {
      const results = await searchFullDictionary(word, lang, 1);
      found = results[0] || null;
    }
    setEntry(found);
    setLoading(false);

    // Сөзді дауыстап оқу
    speak(word, lang);
  };

  // Сөздікке қосу
  const handleAdd = () => {
    if (!entry || !onAddWord) return;
    onAddWord(entry.t, entry.d, entry.p);
    setAdded(true);
  };

  // Ағылшын мәтінді сөздерге бөлу (интерактив)
  const renderInteractiveText = (text: string) => {
    // Сөздер мен бос орындарды бөлек ұстаймыз
    const parts = text.split(/(\s+)/);
    return parts.map((part, i) => {
      if (/^\s+$/.test(part)) return <span key={i}>{part}</span>;
      const word = cleanWord(part);
      const isActive = activeWord === word;
      return (
        <span
          key={i}
          onClick={() => handleWordClick(part)}
          className={`cursor-pointer rounded px-0.5 transition-colors ${
            isActive ? "bg-accent-blue text-white" : "hover:bg-accent-blue/30"
          }`}
        >
          {part}
        </span>
      );
    });
  };

  return (
    <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-[90%] max-w-2xl">
      {/* Сөз попабы (мағына) */}
      {activeWord && (
        <div className="mb-2 bg-surface border border-border rounded-card shadow-card-hover p-3 relative">
          <button
            onClick={() => setActiveWord(null)}
            className="absolute top-2 right-2 text-text-muted hover:text-text-primary"
          >
            <X className="w-4 h-4" />
          </button>
          {loading ? (
            <p className="text-sm text-text-secondary">{t("sub.loading")}</p>
          ) : entry ? (
            <div className="pr-6">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-display font-bold text-text-primary">{entry.t}</span>
                {entry.p && <span className="text-xs text-text-muted font-mono">{entry.p}</span>}
                <button
                  onClick={() => speak(entry.t, lang)}
                  className="text-text-secondary hover:text-accent-blue transition-colors"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-sm text-text-secondary mb-2">{entry.d}</p>
              {onAddWord && (
                <button
                  onClick={handleAdd}
                  disabled={added}
                  className={`text-xs rounded-btn px-2.5 py-1.5 font-medium flex items-center gap-1.5 transition-all ${
                    added
                      ? "bg-accent-green/15 text-accent-green cursor-default"
                      : "bg-accent-blue/15 text-accent-blue hover:bg-accent-blue/25"
                  }`}
                >
                  {added ? <><Check className="w-3.5 h-3.5" /> {t("sub.added")}</> : <><Plus className="w-3.5 h-3.5" /> {t("sub.addToVocab")}</>}
                </button>
              )}
            </div>
          ) : (
            <p className="text-sm text-text-muted pr-6">{t("sub.notFound")}</p>
          )}
        </div>
      )}

      {/* Субтитр */}
      <div className="bg-black/75 backdrop-blur-sm rounded-card px-5 py-4 border border-white/10">
        {/* Ағылшынша — интерактив */}
        <div className="flex items-start gap-2.5">
          <span className="text-[10px] font-bold text-accent-blue bg-accent-blue/20 px-1.5 py-0.5 rounded shrink-0 mt-1">EN</span>
          <p className="text-white text-lg leading-relaxed text-center flex-1">
            {renderInteractiveText(line.en)}
          </p>
        </div>
        {/* Бөлгіш */}
        <div className="h-px bg-white/15 my-2.5" />
        {/* Қазақша (аударма — басылмайды) */}
        <div className="flex items-start gap-2.5">
          <span className="text-[10px] font-bold text-accent-green bg-accent-green/20 px-1.5 py-0.5 rounded shrink-0 mt-0.5">KK</span>
          <p className="text-white/70 text-base leading-snug text-center flex-1">{line.kk}</p>
        </div>
      </div>
    </div>
  );
}
