// filepath: src/App.tsx
// Негізгі қосымша: тіл провайдері + маршрут жүйесі + onboarding.

import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LangProvider } from "@/contexts/LangContext";
import { useUserPrefs } from "@/store/userPrefs";
import Layout from "@/components/layout/Layout";
import PlaceholderPage from "@/pages/PlaceholderPage";
import DashboardPage from "@/pages/DashboardPage";
import CinemaPage from "@/pages/CinemaPage";
import ChatPage from "@/pages/ChatPage";
import DictionaryPage from "@/pages/DictionaryPage";
import OnboardingPage from "@/pages/OnboardingPage";

// Маршруттар (кейін placeholder-лер нақты беттерге ауысады)
const routes: [string, string][] = [
  ["/", "Басты бет"],
  ["/courses", "Курстар"],
  ["/cinema", "LinguaCinema"],
  ["/chat", "ImmersionChat"],
  ["/dictionary", "Сөздік"],
  ["/practice", "Жаттығулар"],
  ["/games", "Ойындар"],
  ["/ielts", "IELTS"],
  ["/progress", "Прогресс"],
  ["/leaderboard", "Рейтинг"],
  ["/settings", "Баптаулар"],
];

function AppContent() {
  const { prefs, loaded } = useUserPrefs();
  const [justFinished, setJustFinished] = useState(false);

  // Жүктелуде — бос экран (жыпылықтамау үшін)
  if (!loaded) {
    return <div className="min-h-screen bg-bg" />;
  }

  // Onboarding аяқталмаған — оны көрсету
  if (!prefs.onboarded && !justFinished) {
    return <OnboardingPage onComplete={() => setJustFinished(true)} />;
  }

  // Негізгі қосымша
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/cinema" element={<CinemaPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/dictionary" element={<DictionaryPage />} />
          {routes.filter(([p]) => p !== "/" && p !== "/cinema" && p !== "/chat" && p !== "/dictionary").map(([path, title]) => (
            <Route key={path} path={path} element={<PlaceholderPage title={title} />} />
          ))}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <LangProvider>
      <AppContent />
    </LangProvider>
  );
}
