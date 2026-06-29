// filepath: src/pages/SettingsPage.tsx
// Баптаулар — Gemini кілті, тіл/деңгей/мақсат, деректер.

import { useState, useEffect } from "react";
import { useLang } from "@/contexts/LangContext";
import { useUserPrefs } from "@/store/userPrefs";
import { getGeminiKey, saveGeminiKey, clearGeminiKey } from "@/lib/gemini";
import { Settings as SettingsIcon, Key, Check, ExternalLink, Trash2, Globe, GraduationCap, Target, RotateCcw, Sparkles } from "lucide-react";

export default function SettingsPage() {
  const { t, lang, setLang } = useLang();
  const { prefs, update, reset } = useUserPrefs();

  const [keyInput, setKeyInput] = useState("");
  const [keySaved, setKeySaved] = useState(false);
  const [hasKey, setHasKey] = useState(false);

  useEffect(() => {
    setHasKey(getGeminiKey() !== null);
  }, []);

  const handleSaveKey = () => {
    if (keyInput.trim().length < 10) return;
    saveGeminiKey(keyInput.trim());
    setHasKey(true);
    setKeySaved(true);
    setKeyInput("");
    setTimeout(() => setKeySaved(false), 2500);
  };

  const handleRemoveKey = () => {
    clearGeminiKey();
    setHasKey(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Тақырып */}
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-card bg-accent-green/15 flex items-center justify-center">
          <SettingsIcon className="w-6 h-6 text-accent-green" />
        </div>
        <div>
          <h1 className="text-2xl font-display font-bold">{t("set.title")}</h1>
          <p className="text-sm text-text-secondary">{t("set.subtitle")}</p>
        </div>
      </div>

      {/* ── AI тәлімгер (Gemini кілті) ── */}
      <section className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-accent-purple" />
          <h2 className="font-display font-semibold">{t("set.aiSection")}</h2>
        </div>

        {hasKey ? (
          // Кілт бар — белсенді
          <div>
            <div className="flex items-center gap-2 p-3 rounded-card bg-accent-green/10 border border-accent-green/20 mb-3">
              <Check className="w-5 h-5 text-accent-green" />
              <span className="text-sm font-medium text-accent-green">{t("set.keyActive")}</span>
            </div>
            <button onClick={handleRemoveKey} className="btn-ghost flex items-center gap-2 text-sm">
              <Trash2 className="w-4 h-4" /> {t("set.removeKey")}
            </button>
          </div>
        ) : (
          // Кілт жоқ — енгізу
          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-1.5">
              <Key className="w-4 h-4 text-accent-gold" /> {t("set.geminiKey")}
            </label>
            <p className="text-xs text-text-secondary mb-3">{t("set.geminiKeyDesc")}</p>
            <div className="flex gap-2 mb-3">
              <input
                type="password"
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                placeholder={t("set.keyPlaceholder")}
                className="flex-1 bg-surface-2 border border-border rounded-btn px-3 py-2.5 text-sm focus:outline-none focus:border-accent-green/50"
              />
              <button
                onClick={handleSaveKey}
                disabled={keyInput.trim().length < 10}
                className="btn-primary disabled:opacity-40 flex items-center gap-2 shrink-0"
              >
                {keySaved ? <><Check className="w-4 h-4" /> {t("set.keySaved")}</> : t("set.saveKey")}
              </button>
            </div>
            {/* Кілт алу сілтемесі */}
            <div className="flex items-center gap-2 text-sm">
              <span className="text-text-secondary">{t("set.getKeyHint")}</span>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-blue hover:underline flex items-center gap-1 font-medium"
              >
                {t("set.getKeyLink")} <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )}
      </section>

      {/* ── Тіл және деңгей ── */}
      <section className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="w-5 h-5 text-accent-blue" />
          <h2 className="font-display font-semibold">{t("set.langSection")}</h2>
        </div>

        <div className="space-y-5">
          {/* Аты */}
          <div>
            <label className="text-sm font-medium mb-2 block">{t("set.yourName")}</label>
            <input
              type="text"
              value={prefs.name || ""}
              onChange={(e) => update({ name: e.target.value })}
              placeholder={t("onb.namePlaceholder")}
              maxLength={30}
              className="w-full bg-surface-2 border border-border rounded-card px-3 py-2.5 text-sm focus:outline-none focus:border-accent-green/50"
            />
          </div>

          {/* Үйрену тілі */}
          <div>
            <label className="text-sm font-medium mb-2 block">{t("set.learningLang")}</label>
            <div className="flex gap-2">
              {([["en", "🇬🇧 " + t("onb.english")], ["zh", "🇨🇳 " + t("onb.chinese")]] as const).map(([val, label]) => (
                <button
                  key={val}
                  onClick={() => update({ learningLang: val })}
                  className={`flex-1 p-3 rounded-card border text-sm font-medium transition-all ${prefs.learningLang === val ? "border-accent-green bg-accent-green/10 text-accent-green" : "border-border hover:border-accent-green/40"}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Деңгей */}
          <div>
            <label className="text-sm font-medium mb-2 block flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-accent-gold" /> {t("set.yourLevel")}
            </label>
            <div className="flex gap-2">
              {([["beginner", t("onb.levelBeginner")], ["intermediate", t("onb.levelIntermediate")], ["advanced", t("onb.levelAdvanced")]] as const).map(([val, label]) => (
                <button
                  key={val}
                  onClick={() => update({ level: val })}
                  className={`flex-1 p-2.5 rounded-card border text-sm font-medium transition-all ${prefs.level === val ? "border-accent-blue bg-accent-blue/10 text-accent-blue" : "border-border hover:border-accent-blue/40"}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Күндік мақсат */}
          <div>
            <label className="text-sm font-medium mb-2 block flex items-center gap-1.5">
              <Target className="w-4 h-4 text-accent-green" /> {t("set.dailyGoal")}
            </label>
            <div className="flex gap-2">
              {[5, 15, 30, 60].map((min) => (
                <button
                  key={min}
                  onClick={() => update({ dailyGoalMin: min })}
                  className={`flex-1 p-2.5 rounded-card border text-sm font-medium transition-all ${prefs.dailyGoalMin === min ? "border-accent-green bg-accent-green/10 text-accent-green" : "border-border hover:border-accent-green/40"}`}
                >
                  {min} {t("onb.minPerDay")}
                </button>
              ))}
            </div>
          </div>

          {/* Интерфейс тілі */}
          <div>
            <label className="text-sm font-medium mb-2 block">{t("set.interfaceLang")}</label>
            <div className="flex gap-2">
              {([["kk", "Қазақша"], ["en", "English"]] as const).map(([val, label]) => (
                <button
                  key={val}
                  onClick={() => setLang(val)}
                  className={`flex-1 p-2.5 rounded-card border text-sm font-medium transition-all ${lang === val ? "border-accent-purple bg-accent-purple/10 text-accent-purple" : "border-border hover:border-accent-purple/40"}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Деректер ── */}
      <section className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <RotateCcw className="w-5 h-5 text-text-secondary" />
          <h2 className="font-display font-semibold">{t("set.dataSection")}</h2>
        </div>
        <button onClick={reset} className="btn-ghost flex items-center gap-2 text-sm">
          <RotateCcw className="w-4 h-4" /> {t("set.resetOnboarding")}
        </button>
      </section>
    </div>
  );
}
