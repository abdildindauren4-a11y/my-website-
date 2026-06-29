// filepath: src/components/vocab/DictSearch.tsx
// Сөздік іздеу — 168,000 сөздік қордан.
// Қолданушы сөз іздейді → тапқанын SRS-ке (жаттауға) қосады.

import { useState, useEffect, useCallback } from "react";
import { useLang } from "@/contexts/LangContext";
import { searchDictionary, searchFullDictionary, dictStats, type DictEntry } from "@/lib/dictionary";
import { speak } from "@/lib/speech";
import { Search, Plus, Check, Volume2, Database, Loader2 } from "lucide-react";
import type { LearnLang } from "@/types/vocabulary";

interface Props {
  onAddWord: (entry: DictEntry, lang: LearnLang) => void;
  existingTerms: Set<string>; // SRS-те бар сөздер (қайталап қоспау үшін)
}

export default function DictSearch({ onAddWord, existingTerms }: Props) {
  const { t } = useLang();
  const [lang, setLang] = useState<"en" | "zh">("en");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<DictEntry[]>([]);
  const [loadingFull, setLoadingFull] = useState(false);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  // Іздеу (жиі базадан бірден, толықтан кейін)
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    // 1) Жиі базадан бірден (жылдам)
    const quick = searchDictionary(query, lang, 30);
    setResults(quick);

    // 2) Толық базадан (168,000) — егер аз нәтиже болса
    if (quick.length < 10) {
      setLoadingFull(true);
      searchFullDictionary(query, lang, 50).then((full) => {
        setResults(full);
        setLoadingFull(false);
      });
    }
  }, [query, lang]);

  const handleAdd = useCallback((entry: DictEntry) => {
    onAddWord(entry, lang);
    setAddedIds((prev) => new Set(prev).add(entry.t));
  }, [onAddWord, lang]);

  const isAdded = (entry: DictEntry) => addedIds.has(entry.t) || existingTerms.has(entry.t.toLowerCase());

  return (
    <div className="space-y-4">
      {/* Қор туралы ақпарат */}
      <div className="flex items-center gap-2 text-xs text-text-secondary">
        <Database className="w-4 h-4 text-accent-cyan" />
        <span>{dictStats.fullTotal.toLocaleString()} {t("dict.wordsAvailable")}</span>
      </div>

      {/* Іздеу + тіл */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="card p-2 flex items-center gap-2 flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-text-muted ml-2" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={lang === "en" ? t("dict.searchEn") : t("dict.searchZh")}
            className="flex-1 bg-transparent px-2 py-1.5 text-sm focus:outline-none"
            autoFocus
          />
          {loadingFull && <Loader2 className="w-4 h-4 animate-spin text-accent-blue mr-2" />}
        </div>
        {/* Тіл таңдау */}
        <div className="flex items-center bg-surface-2 rounded-btn p-1 border border-border">
          <button
            onClick={() => setLang("en")}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${lang === "en" ? "bg-accent-blue text-white" : "text-text-secondary hover:text-text-primary"}`}
          >
            EN
          </button>
          <button
            onClick={() => setLang("zh")}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${lang === "zh" ? "bg-accent-blue text-white" : "text-text-secondary hover:text-text-primary"}`}
          >
            中
          </button>
        </div>
      </div>

      {/* Нәтижелер */}
      {query.trim() === "" ? (
        <div className="card p-8 text-center">
          <Search className="w-10 h-10 text-text-muted mx-auto mb-3" />
          <p className="text-text-secondary text-sm">{t("dict.searchHint")}</p>
        </div>
      ) : results.length === 0 && !loadingFull ? (
        <p className="text-center text-text-secondary py-8 text-sm">{t("dict.noResults")}</p>
      ) : (
        <div className="space-y-2">
          {results.map((entry, i) => {
            const added = isAdded(entry);
            return (
              <div key={`${entry.t}-${i}`} className="card p-3 flex items-center gap-3 hover:bg-surface-2 transition-colors">
                {/* Сөз */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-base">{entry.t}</span>
                    {entry.p && <span className="text-xs text-text-muted font-mono">{entry.p}</span>}
                    {entry.pos && <span className="text-[10px] text-text-secondary bg-surface-2 px-1.5 py-0.5 rounded">{entry.pos}</span>}
                  </div>
                  <p className="text-sm text-text-secondary mt-0.5">{entry.d}</p>
                </div>
                {/* Дыбыс */}
                <button
                  onClick={() => speak(entry.t, lang)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-accent-blue transition-colors shrink-0"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
                {/* SRS-ке қосу */}
                <button
                  onClick={() => !added && handleAdd(entry)}
                  disabled={added}
                  className={`shrink-0 rounded-btn px-3 py-2 text-sm font-medium transition-all flex items-center gap-1.5 ${
                    added
                      ? "bg-accent-green/15 text-accent-green cursor-default"
                      : "bg-accent-blue/15 text-accent-blue hover:bg-accent-blue/25"
                  }`}
                >
                  {added ? <><Check className="w-4 h-4" /> {t("dict.added")}</> : <><Plus className="w-4 h-4" /> {t("dict.add")}</>}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
