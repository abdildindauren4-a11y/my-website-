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
import SettingsPage from "@/pages/SettingsPage";
import GamesPage from "@/pages/GamesPage";
import IeltsPage from "@/pages/IeltsPage";
import CoursesPage from "@/pages/CoursesPage";
import PracticePage from "@/pages/PracticePage";
import ProgressPage from "@/pages/ProgressPage";
import LeaderboardPage from "@/pages/LeaderboardPage";
import ProfilePage from "@/pages/ProfilePage";

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
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/games" element={<GamesPage />} />
          <Route path="/ielts" element={<IeltsPage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/practice" element={<PracticePage />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          {routes.filter(([p]) => !["/", "/cinema", "/chat", "/dictionary", "/settings", "/games", "/ielts", "/courses", "/practice", "/progress", "/leaderboard"].includes(p)).map(([path, title]) => (
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
