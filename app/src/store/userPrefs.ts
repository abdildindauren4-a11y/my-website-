// filepath: src/store/userPrefs.ts
// Пайдаланушы параметрлері — үйрену тілі, деңгей, мақсат.
// Onboarding-та орнатылады, localStorage-та сақталады (Firebase кейін).

import { useState, useEffect, useCallback } from "react";

export type LearningLanguage = "en" | "zh";
export type ProficiencyLevel = "beginner" | "intermediate" | "advanced";

export interface UserPrefs {
  onboarded: boolean;          // onboarding аяқталды ма
  learningLang: LearningLanguage; // нені үйренеді
  level: ProficiencyLevel;     // деңгейі
  dailyGoalMin: number;        // күндік мақсат (минут)
  name?: string;               // аты (қаласа)
}

const STORAGE_KEY = "linguafast_prefs";

const DEFAULT_PREFS: UserPrefs = {
  onboarded: false,
  learningLang: "en",
  level: "beginner",
  dailyGoalMin: 15,
};

function loadPrefs(): UserPrefs {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULT_PREFS, ...JSON.parse(raw) };
  } catch { /* ignore */ }
  return DEFAULT_PREFS;
}

function savePrefs(prefs: UserPrefs) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch { /* ignore */ }
}

// Параметрлер hook
export function useUserPrefs() {
  const [prefs, setPrefs] = useState<UserPrefs>(DEFAULT_PREFS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setPrefs(loadPrefs());
    setLoaded(true);
  }, []);

  // Параметрді жаңарту
  const update = useCallback((patch: Partial<UserPrefs>) => {
    setPrefs((prev) => {
      const next = { ...prev, ...patch };
      savePrefs(next);
      return next;
    });
  }, []);

  // Onboarding-ты аяқтау
  const completeOnboarding = useCallback((data: Partial<UserPrefs>) => {
    setPrefs((prev) => {
      const next = { ...prev, ...data, onboarded: true };
      savePrefs(next);
      return next;
    });
  }, []);

  // Қайта бастау (тест үшін)
  const reset = useCallback(() => {
    savePrefs(DEFAULT_PREFS);
    setPrefs(DEFAULT_PREFS);
  }, []);

  return { prefs, loaded, update, completeOnboarding, reset };
}
