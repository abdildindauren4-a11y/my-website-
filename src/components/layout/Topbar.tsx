// filepath: src/components/layout/Topbar.tsx
// Жоғарғы панель — UI blueprint бойынша.
// XP деңгей жолағы, streak (от), тіл ауыстырғыш (EN/中文), профиль.

import { useLang } from "@/contexts/LangContext";
import { Flame, Bell, ChevronDown } from "lucide-react";

// Уақытша демо дерек (кейін Firebase-тен келеді)
const DEMO = {
  name: "Aidos",
  level: 24,
  xp: 12450,
  xpMax: 18000,
  streak: 30,
  learningLang: "English" as "English" | "中文",
};

export default function Topbar() {
  const { lang, setLang, t } = useLang();
  const xpPercent = Math.round((DEMO.xp / DEMO.xpMax) * 100);

  return (
    <header className="h-20 shrink-0 bg-surface border-b border-border flex items-center justify-between px-6 gap-6">
      {/* Сол жақ: XP деңгей жолағы */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        {/* Деңгей белгісі */}
        <div className="w-12 h-12 rounded-card bg-accent-blue/15 border border-accent-blue/30 flex items-center justify-center shrink-0">
          <span className="text-xs font-display font-bold text-accent-blue">XP</span>
        </div>
        {/* Прогресс */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-sm font-semibold">{t("top.level")} {DEMO.level}</span>
            <span className="text-xs text-text-secondary font-mono">
              {DEMO.xp.toLocaleString()} / {DEMO.xpMax.toLocaleString()} XP
            </span>
          </div>
          <div className="h-2 rounded-full bg-border overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-accent-blue to-accent-green rounded-full transition-all"
              style={{ width: `${xpPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Орта: streak */}
      <div className="flex items-center gap-2.5 px-4 border-l border-r border-border h-full">
        <div className="w-11 h-11 rounded-full bg-accent-gold/15 flex items-center justify-center">
          <Flame className="w-6 h-6 text-accent-gold" fill="currentColor" />
        </div>
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-display font-bold leading-none">{DEMO.streak}</span>
            <span className="text-xs text-text-secondary">{t("top.days")}</span>
          </div>
          <span className="text-xs text-accent-green font-medium">{t("top.streak")}</span>
        </div>
      </div>

      {/* Оң жақ: тіл ауыстырғыш + хабарлама + профиль */}
      <div className="flex items-center gap-4">
        {/* Интерфейс тілі ауыстырғыш (kk/en) */}
        <div className="flex items-center bg-surface-2 rounded-btn p-1 border border-border">
          <button
            onClick={() => setLang("kk")}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${
              lang === "kk" ? "bg-accent-blue text-white" : "text-text-secondary hover:text-text-primary"
            }`}
          >
            ҚАЗ
          </button>
          <button
            onClick={() => setLang("en")}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${
              lang === "en" ? "bg-accent-blue text-white" : "text-text-secondary hover:text-text-primary"
            }`}
          >
            ENG
          </button>
        </div>

        {/* Хабарлама */}
        <button className="w-10 h-10 rounded-btn flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-surface-2 transition-all relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-accent-red" />
        </button>

        {/* Профиль */}
        <button className="flex items-center gap-2 hover:bg-surface-2 rounded-btn p-1.5 transition-all">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center text-white font-semibold border-2 border-accent-blue/30">
            {DEMO.name[0]}
          </div>
          <span className="text-sm font-medium">{DEMO.name}</span>
          <ChevronDown className="w-4 h-4 text-text-secondary" />
        </button>
      </div>
    </header>
  );
}
