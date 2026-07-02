// filepath: src/pages/NotFoundPage.tsx
// 404 — бет табылмады.

import { useNavigate } from "react-router-dom";
import { useLang } from "@/contexts/LangContext";
import { Compass, Home } from "lucide-react";

export default function NotFoundPage() {
  const { lang } = useLang();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[60vh] text-center">
      <div className="w-16 h-16 rounded-card bg-surface-2 flex items-center justify-center mb-4">
        <Compass className="w-8 h-8 text-accent-blue" />
      </div>
      <h2 className="text-4xl font-display font-bold mb-2 gradient-text">404</h2>
      <p className="text-text-secondary mb-6">
        {lang === "kk" ? "Мұндай бет табылмады" : "Page not found"}
      </p>
      <button
        onClick={() => navigate("/")}
        className="inline-flex items-center gap-2 bg-accent-green text-white font-semibold text-sm px-5 py-2.5 rounded-btn shadow-soft hover:shadow-lg active:scale-[0.98] transition-all"
      >
        <Home className="w-4 h-4" /> {lang === "kk" ? "Басты бетке" : "Go home"}
      </button>
    </div>
  );
}
