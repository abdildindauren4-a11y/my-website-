// filepath: src/App.tsx
// Негізгі қосымша: тіл провайдері + маршрут жүйесі + onboarding.
// Беттер lazy-жүктеледі (code splitting) — алғашқы ашылу жылдам.

import { useState, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LangProvider } from "@/contexts/LangContext";
import { useUserPrefs } from "@/store/userPrefs";
import Layout from "@/components/layout/Layout";
import ErrorBoundary from "@/components/shared/ErrorBoundary";
import DashboardPage from "@/pages/DashboardPage";
import OnboardingPage from "@/pages/OnboardingPage";

// Ауыр беттер — қажет болғанда ғана жүктеледі
const CinemaPage = lazy(() => import("@/pages/CinemaPage"));
const ChatPage = lazy(() => import("@/pages/ChatPage"));
const DictionaryPage = lazy(() => import("@/pages/DictionaryPage"));
const SettingsPage = lazy(() => import("@/pages/SettingsPage"));
const GamesPage = lazy(() => import("@/pages/GamesPage"));
const IeltsPage = lazy(() => import("@/pages/IeltsPage"));
const CoursesPage = lazy(() => import("@/pages/CoursesPage"));
const PracticePage = lazy(() => import("@/pages/PracticePage"));
const ProgressPage = lazy(() => import("@/pages/ProgressPage"));
const LeaderboardPage = lazy(() => import("@/pages/LeaderboardPage"));
const ProfilePage = lazy(() => import("@/pages/ProfilePage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));

function AppContent() {
  const { prefs, loaded } = useUserPrefs();
  const [justFinished, setJustFinished] = useState(false);

  // Жүктелуде — бос экран (жыпылықтамау үшін)
  if (!loaded) {
    return <div className="min-h-screen bg-background" />;
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
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <LangProvider>
        <AppContent />
      </LangProvider>
    </ErrorBoundary>
  );
}
