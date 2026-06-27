// filepath: src/components/layout/Sidebar.tsx
// Сол жақ мәзір — адаптивті.
// Десктоп (lg+): тұрақты көрінеді. Мобиль: ашылмалы drawer (гамбургерден).

import { NavLink } from "react-router-dom";
import { useLang } from "@/contexts/LangContext";
import type { TransKey } from "@/i18n/translations";
import {
  Zap, Home, BookOpen, Film, MessageSquare, BookA,
  Dumbbell, Gamepad2, GraduationCap, BarChart3, Trophy, Settings, X,
} from "lucide-react";

interface NavItem {
  icon: typeof Home;
  key: TransKey;
  path: string;
  color: string;
}

const navItems: NavItem[] = [
  { icon: Home, key: "nav.home", path: "/", color: "text-accent-blue" },
  { icon: BookOpen, key: "nav.courses", path: "/courses", color: "text-accent-blue" },
  { icon: Film, key: "nav.cinema", path: "/cinema", color: "text-accent-pink" },
  { icon: MessageSquare, key: "nav.chat", path: "/chat", color: "text-accent-cyan" },
  { icon: BookA, key: "nav.dictionary", path: "/dictionary", color: "text-accent-blue" },
  { icon: Dumbbell, key: "nav.practice", path: "/practice", color: "text-accent-green" },
  { icon: Gamepad2, key: "nav.games", path: "/games", color: "text-accent-purple" },
  { icon: GraduationCap, key: "nav.ielts", path: "/ielts", color: "text-accent-gold" },
  { icon: BarChart3, key: "nav.progress", path: "/progress", color: "text-accent-blue" },
  { icon: Trophy, key: "nav.leaderboard", path: "/leaderboard", color: "text-accent-gold" },
  { icon: Settings, key: "nav.settings", path: "/settings", color: "text-accent-blue" },
];

interface Props {
  isOpen: boolean;       // мобильде ашық па
  onClose: () => void;   // жабу
}

export default function Sidebar({ isOpen, onClose }: Props) {
  const { t } = useLang();

  return (
    <>
      {/* Мобиль фоны (ашық болса) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          w-64 shrink-0 bg-surface border-r border-border flex flex-col h-screen z-50
          fixed lg:sticky top-0 left-0
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
        `}
      >
        {/* Логотип + жабу (мобиль) */}
        <div className="flex items-center justify-between px-6 h-20 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-card bg-accent-blue/20 flex items-center justify-center shadow-glow">
              <Zap className="w-6 h-6 text-accent-blue" fill="currentColor" />
            </div>
            <span className="text-xl font-display font-bold">LinguaFast</span>
          </div>
          {/* Жабу (тек мобиль) */}
          <button onClick={onClose} className="lg:hidden text-text-secondary hover:text-text-primary p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Навигация */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-btn transition-all group ${
                    isActive
                      ? "bg-accent-blue/10 border border-accent-blue/30"
                      : "border border-transparent hover:bg-surface-2"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`w-5 h-5 transition-colors ${isActive ? item.color : "text-text-secondary group-hover:text-text-primary"}`} />
                    <span className={`text-sm font-medium transition-colors ${isActive ? "text-text-primary" : "text-text-secondary group-hover:text-text-primary"}`}>
                      {t(item.key)}
                    </span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Төменде: апталық мақсат */}
        <div className="p-3 shrink-0">
          <div className="card p-4 bg-surface-2">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-4 h-4 text-accent-gold" />
              <span className="text-sm font-semibold">{t("dash.weeklyGoal")}</span>
            </div>
            <p className="text-xs text-text-secondary mb-2">4/7 {t("dash.lessonsCompleted")}</p>
            <div className="h-2 rounded-full bg-border overflow-hidden">
              <div className="h-full bg-accent-green rounded-full" style={{ width: "57%" }} />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
