// filepath: src/contexts/LangContext.tsx
// Тіл жүйесі: ағымдағы тіл (kk/en) + t() аударма функциясы.
// Тіл localStorage-та сақталады (браузер жаба берсе де есте қалады).

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { translations, type TransKey, type Lang } from "@/i18n/translations";

interface LangContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: TransKey) => string;
}

const LangContext = createContext<LangContextValue | null>(null);

const STORAGE_KEY = "linguafast_lang";

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === "en" || saved === "kk" ? saved : "kk";
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = (l: Lang) => setLangState(l);

  const t = (key: TransKey): string => {
    const entry = translations[key];
    if (!entry) return key;
    return entry[lang] || entry.kk || key;
  };

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used within LangProvider");
  return ctx;
}
