// filepath: src/components/layout/Topbar.tsx
// Жоғарғы панель — адаптивті.
// Мобиль: гамбургер + ықшам streak + тіл + профиль.
// Десктоп: толық XP жолағы + streak + тіл + хабарлама + профиль.

import { useLang } from "@/contexts/LangContext";
import { Flame, Bell, ChevronDown, Menu } from "lucide-react";

const DEMO = {
  name: "Aidos",
  level: 24,
  xp: 12450,
  xpMax: 18000,
  streak: 30,
};

interface Props {
  onMenuClick: () => void; // гамбургер басылғанда
}

export default function Topbar({ onMenuClick }: Props) {
  const { lang, setLang, t } = useLang();
  const xpPercent = Math.round((DEMO.xp / DEMO.xpMax) * 100);

  return (
    <header className="h-16 lg:h-20 shrink-0 bg-surface border-b border-border flex items-center justify-between px-3 lg:px-6 gap-2 lg:gap-6">
      {/* Сол жақ: гамбургер (мобиль) + XP жолағы (десктоп) */}
      <div className="flex items-center gap-3 flex-1 min-w-0 lg:max-w-xl">
        {/* Гамбургер — тек мобиль */}
        <button
          onClick={onMenuClick}
          className="lg:hidden w-10 h-10 rounded-btn flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-surface-2 transition-all shrink-0"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* XP деңгей жолағы — десктопта толық, мобильде жасырын */}
        <div className="hidden lg:flex items-center gap-4 flex-1">
          <div className="w-12 h-12 rounded-card bg-accent-blue/15 border border-accent-blue/30 flex items-center justify-center shrink-0">
            <span className="text-xs font-display font-bold text-accent-blue">XP</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-semibold">{t("top.level")} {DEMO.level}</span>
              <span className="text-xs text-text-secondary font-mono">
                {DEMO.xp.toLocaleString()} / {DEMO.xpMax.toLocaleString()} XP
              </span>
            </div>
            <div className="h-2 rounded-full bg-border overflow-hidden">
              <div className="h-full bg-gradient-to-r from-accent-blue to-accent-green rounded-full transition-all" style={{ width: `${xpPercent}%` }} />
            </div>
          </div>
        </div>

        {/* Мобиль: ықшам деңгей белгісі */}
        <div className="lg:hidden flex items-center gap-2 min-w-0">
          <div className="w-9 h-9 rounded-card bg-accent-blue/15 border border-accent-blue/30 flex items-center justify-center shrink-0">
            <span className="text-[10px] font-display font-bold text-accent-blue">L{DEMO.level}</span>
          </div>
        </div>
      </div>

      {/* Орта: streak — десктопта толық, мобильде ықшам */}
      <div className="flex items-center gap-2 lg:gap-2.5 lg:px-4 lg:border-l lg:border-r border-border lg:h-full shrink-0">
        <div className="w-9 h-9 lg:w-11 lg:h-11 rounded-full bg-accent-gold/15 flex items-center justify-center">
          <Flame className="w-5 h-5 lg:w-6 lg:h-6 text-accent-gold" fill="currentColor" />
        </div>
        <div className="hidden sm:block">
          <div className="flex items-baseline gap-1">
            <span className="text-xl lg:text-2xl font-display font-bold leading-none">{DEMO.streak}</span>
            <span className="text-xs text-text-secondary">{t("top.days")}</span>
          </div>
          <span className="text-xs text-accent-green font-medium">{t("top.streak")}</span>
        </div>
        {/* Мобильде тек сан */}
        <span className="sm:hidden text-lg font-display font-bold">{DEMO.streak}</span>
      </div>

      {/* Оң жақ: тіл + хабарлама + профиль */}
      <div className="flex items-center gap-2 lg:gap-4 shrink-0">
        {/* Тіл ауыстырғыш */}
        <div className="flex items-center bg-surface-2 rounded-btn p-1 border border-border">
          <button
            onClick={() => setLang("kk")}
            className={`px-2 lg:px-3 py-1 lg:py-1.5 rounded text-xs lg:text-sm font-medium transition-all ${lang === "kk" ? "bg-accent-blue text-white" : "text-text-secondary hover:text-text-primary"}`}
          >
            ҚАЗ
          </button>
          <button
            onClick={() => setLang("en")}
            className={`px-2 lg:px-3 py-1 lg:py-1.5 rounded text-xs lg:text-sm font-medium transition-all ${lang === "en" ? "bg-accent-blue text-white" : "text-text-secondary hover:text-text-primary"}`}
          >
            ENG
          </button>
        </div>

        {/* Хабарлама — мобильде жасырын (орын үнемдеу) */}
        <button className="hidden sm:flex w-10 h-10 rounded-btn items-center justify-center text-text-secondary hover:text-text-primary hover:bg-surface-2 transition-all relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-accent-red" />
        </button>

        {/* Профиль — мобильде тек аватар */}
        <button className="flex items-center gap-2 hover:bg-surface-2 rounded-btn p-1 lg:p-1.5 transition-all">
          <div className="w-8 h-8 lg:w-9 lg:h-9 rounded-full bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center text-white font-semibold border-2 border-accent-blue/30 text-sm">
            {DEMO.name[0]}
          </div>
          <span className="hidden md:inline text-sm font-medium">{DEMO.name}</span>
          <ChevronDown className="hidden md:inline w-4 h-4 text-text-secondary" />
        </button>
      </div>
    </header>
  );
}
