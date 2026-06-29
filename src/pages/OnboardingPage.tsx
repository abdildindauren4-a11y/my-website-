// filepath: src/pages/OnboardingPage.tsx
// Onboarding — алғашқы экран. Тіл, деңгей, мақсат таңдау.
// Көп қадамды, анимациялы, екі тілде.

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/contexts/LangContext";
import { useUserPrefs, type LearningLanguage, type ProficiencyLevel } from "@/store/userPrefs";
import { Zap, ArrowRight, ArrowLeft, Check, Sparkles, GraduationCap, Target, Globe } from "lucide-react";

interface Props {
  onComplete: () => void;
}

export default function OnboardingPage({ onComplete }: Props) {
  const { t, lang, setLang } = useLang();
  const { completeOnboarding } = useUserPrefs();

  const [step, setStep] = useState(0); // 0=welcome, 1=lang, 2=level, 3=goal
  const [name, setName] = useState("");
  const [learningLang, setLearningLang] = useState<LearningLanguage>("en");
  const [level, setLevel] = useState<ProficiencyLevel>("beginner");
  const [goalMin, setGoalMin] = useState(15);

  const totalSteps = 3; // welcome-тен кейінгі қадамдар

  const finish = () => {
    completeOnboarding({ learningLang, level, dailyGoalMin: goalMin, name: name.trim() || undefined });
    onComplete();
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Фон әшекейі */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent-blue/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-purple/10 rounded-full blur-3xl" />

      {/* Тіл ауыстырғыш (жоғарғы оң) */}
      <div className="absolute top-5 right-5 flex items-center bg-surface-2 rounded-btn p-1 border border-border z-10">
        <button onClick={() => setLang("kk")} className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${lang === "kk" ? "bg-accent-blue text-white" : "text-text-secondary"}`}>ҚАЗ</button>
        <button onClick={() => setLang("en")} className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${lang === "en" ? "bg-accent-blue text-white" : "text-text-secondary"}`}>ENG</button>
      </div>

      <div className="w-full max-w-lg relative z-10">
        {/* Прогресс (welcome-тен кейін) */}
        {step > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-text-secondary">{step} / {totalSteps} {t("onb.step")}</span>
            </div>
            <div className="h-1.5 rounded-full bg-border overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-accent-blue to-accent-purple rounded-full"
                animate={{ width: `${(step / totalSteps) * 100}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* ── ҚАДАМ 0: Қош келдіңіз ── */}
          {step === 0 && (
            <motion.div key="welcome" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="text-center">
              <motion.div
                initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.1 }}
                className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center mx-auto mb-6"
              >
                <Zap className="w-10 h-10 text-white" />
              </motion.div>
              <h1 className="text-3xl font-display font-bold mb-3">{t("onb.welcome")}</h1>
              <p className="text-text-secondary mb-8 max-w-md mx-auto leading-relaxed">{t("onb.welcomeDesc")}</p>
              {/* Ерекшеліктер */}
              <div className="flex items-center justify-center gap-6 mb-8">
                {[
                  { icon: Sparkles, label: lang === "kk" ? "AI тәлімгер" : "AI tutor" },
                  { icon: Globe, label: lang === "kk" ? "Кино" : "Cinema" },
                  { icon: GraduationCap, label: lang === "kk" ? "SRS" : "SRS" },
                ].map((f, i) => (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-card bg-surface-2 flex items-center justify-center">
                      <f.icon className="w-6 h-6 text-accent-blue" />
                    </div>
                    <span className="text-xs text-text-secondary">{f.label}</span>
                  </div>
                ))}
              </div>
              {/* Аты енгізу */}
              <div className="mb-5 text-left">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t("onb.namePlaceholder")}
                  maxLength={30}
                  className="w-full bg-surface border border-border rounded-card px-4 py-3 text-center focus:outline-none focus:border-accent-green/50 transition-colors"
                  onKeyDown={(e) => e.key === "Enter" && setStep(1)}
                />
              </div>
              <button onClick={() => setStep(1)} className="btn-primary w-full flex items-center justify-center gap-2 text-base py-3">
                {t("onb.getStarted")} <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {/* ── ҚАДАМ 1: Үйрену тілі ── */}
          {step === 1 && (
            <motion.div key="lang" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <div className="flex items-center gap-3 mb-2">
                <Globe className="w-7 h-7 text-accent-blue" />
                <h2 className="text-2xl font-display font-bold">{t("onb.chooseLanguage")}</h2>
              </div>
              <p className="text-text-secondary mb-6">{t("onb.chooseLanguageDesc")}</p>
              <div className="space-y-3 mb-8">
                <ChoiceCard
                  selected={learningLang === "en"}
                  onClick={() => setLearningLang("en")}
                  flag="🇬🇧"
                  title={t("onb.english")}
                  desc={t("onb.englishDesc")}
                />
                <ChoiceCard
                  selected={learningLang === "zh"}
                  onClick={() => setLearningLang("zh")}
                  flag="🇨🇳"
                  title={t("onb.chinese")}
                  desc={t("onb.chineseDesc")}
                />
              </div>
              <NavButtons onBack={() => setStep(0)} onNext={() => setStep(2)} t={t} />
            </motion.div>
          )}

          {/* ── ҚАДАМ 2: Деңгей ── */}
          {step === 2 && (
            <motion.div key="level" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <div className="flex items-center gap-3 mb-2">
                <GraduationCap className="w-7 h-7 text-accent-gold" />
                <h2 className="text-2xl font-display font-bold">{t("onb.chooseLevel")}</h2>
              </div>
              <p className="text-text-secondary mb-6">{t("onb.chooseLevelDesc")}</p>
              <div className="space-y-3 mb-8">
                {([
                  ["beginner", t("onb.levelBeginner"), t("onb.levelBeginnerDesc"), "🌱"],
                  ["intermediate", t("onb.levelIntermediate"), t("onb.levelIntermediateDesc"), "🌿"],
                  ["advanced", t("onb.levelAdvanced"), t("onb.levelAdvancedDesc"), "🌳"],
                ] as const).map(([val, title, desc, emoji]) => (
                  <ChoiceCard
                    key={val}
                    selected={level === val}
                    onClick={() => setLevel(val)}
                    flag={emoji}
                    title={title}
                    desc={desc}
                  />
                ))}
              </div>
              <NavButtons onBack={() => setStep(1)} onNext={() => setStep(3)} t={t} />
            </motion.div>
          )}

          {/* ── ҚАДАМ 3: Күндік мақсат ── */}
          {step === 3 && (
            <motion.div key="goal" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <div className="flex items-center gap-3 mb-2">
                <Target className="w-7 h-7 text-accent-green" />
                <h2 className="text-2xl font-display font-bold">{t("onb.chooseGoal")}</h2>
              </div>
              <p className="text-text-secondary mb-6">{t("onb.chooseGoalDesc")}</p>
              <div className="grid grid-cols-2 gap-3 mb-8">
                {([
                  [5, t("onb.goalCasual")],
                  [15, t("onb.goalRegular")],
                  [30, t("onb.goalSerious")],
                  [60, t("onb.goalIntense")],
                ] as const).map(([min, label]) => (
                  <button
                    key={min}
                    onClick={() => setGoalMin(min)}
                    className={`card p-5 text-center transition-all ${goalMin === min ? "border-accent-green bg-accent-green/10" : "hover:border-accent-green/40"}`}
                  >
                    <div className={`text-2xl font-display font-bold mb-1 ${goalMin === min ? "text-accent-green" : ""}`}>{min}</div>
                    <div className="text-xs text-text-secondary mb-1">{t("onb.minPerDay")}</div>
                    <div className="text-sm font-medium">{label}</div>
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="btn-ghost flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" /> {t("onb.back")}
                </button>
                <button onClick={finish} className="btn-primary flex-1 flex items-center justify-center gap-2 text-base py-3">
                  {t("onb.finish")} <Check className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Таңдау карточкасы
function ChoiceCard({ selected, onClick, flag, title, desc }: { selected: boolean; onClick: () => void; flag: string; title: string; desc: string }) {
  return (
    <button
      onClick={onClick}
      className={`card p-4 w-full flex items-center gap-4 text-left transition-all ${selected ? "border-accent-blue bg-accent-blue/10" : "hover:border-accent-blue/40"}`}
    >
      <span className="text-3xl">{flag}</span>
      <div className="flex-1">
        <div className="font-display font-semibold">{title}</div>
        <div className="text-sm text-text-secondary">{desc}</div>
      </div>
      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${selected ? "border-accent-blue bg-accent-blue" : "border-border"}`}>
        {selected && <Check className="w-4 h-4 text-white" />}
      </div>
    </button>
  );
}

// Навигация батырмалары
function NavButtons({ onBack, onNext, t }: { onBack: () => void; onNext: () => void; t: any }) {
  return (
    <div className="flex gap-3">
      <button onClick={onBack} className="btn-ghost flex items-center gap-2">
        <ArrowLeft className="w-4 h-4" /> {t("onb.back")}
      </button>
      <button onClick={onNext} className="btn-primary flex-1 flex items-center justify-center gap-2">
        {t("onb.next")} <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
