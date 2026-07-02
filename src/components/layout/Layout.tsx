// filepath: src/components/layout/Layout.tsx
// Негізгі қаңқа — адаптивті.
// Десктоп: Sidebar (сол) + Topbar + контент.
// Мобиль: гамбургер → Sidebar ашылады (drawer).
// Lazy беттер үшін Suspense осында — жүктелгенде мәзір орнында қалады.

import { useState, useEffect, Suspense } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

// Әр бетке браузер табындағы тақырып
const PAGE_TITLES: Record<string, string> = {
  "/": "Басты бет",
  "/courses": "Курстар",
  "/cinema": "LinguaCinema",
  "/chat": "AI Chat",
  "/dictionary": "Сөздік",
  "/practice": "Жаттығулар",
  "/games": "Ойындар",
  "/ielts": "IELTS",
  "/progress": "Прогресс",
  "/leaderboard": "Рейтинг",
  "/settings": "Баптаулар",
  "/profile": "Профиль",
};

// Бет жүктелу индикаторы (контент аймағында ғана)
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-10 h-10 rounded-full border-4 border-border border-t-accent-green animate-spin" />
    </div>
  );
}

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const page = PAGE_TITLES[pathname];
    document.title = page ? `${page} — LinguaFast` : "LinguaFast";
  }, [pathname]);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
