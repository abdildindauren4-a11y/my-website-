// filepath: src/components/cinema/AddVideoModal.tsx
// Өз YouTube видеоңды сабақ ретінде қосу формасы (модаль).
// Сілтемені қойсаң — ID автоматты ажыратылады әрі алдын ала көрініс шығады.

import { useState } from "react";
import { motion } from "framer-motion";
import { useLang } from "@/contexts/LangContext";
import { parseYouTubeId, type NewVideoInput } from "@/store/customVideoStore";
import { X, Film, Check, AlertCircle } from "lucide-react";

interface Props {
  onClose: () => void;
  onAdd: (input: NewVideoInput) => void;
}

export default function AddVideoModal({ onClose, onAdd }: Props) {
  const { t, lang } = useLang();
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [titleKk, setTitleKk] = useState("");
  const [description, setDescription] = useState("");
  const [level, setLevel] = useState<"beginner" | "intermediate" | "advanced">("beginner");
  const [videoLang, setVideoLang] = useState<"en" | "zh">("en");

  const youtubeId = parseYouTubeId(url);
  const urlTouched = url.trim().length > 0;
  const valid = !!youtubeId && title.trim().length > 0;

  const submit = () => {
    if (!valid || !youtubeId) return;
    onAdd({
      title: title.trim(),
      titleKk: titleKk.trim(),
      description: description.trim(),
      descriptionKk: description.trim(),
      youtubeId,
      level,
      category: "custom",
      lang: videoLang,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="card max-w-lg w-full max-h-[88vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Шапка */}
        <div className="flex items-center justify-between p-4 border-b border-border sticky top-0 bg-surface z-10">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-card bg-accent-pink/15 flex items-center justify-center">
              <Film className="w-5 h-5 text-accent-pink" />
            </div>
            <h3 className="font-display font-semibold">{t("cinema.addVideoTitle")}</h3>
          </div>
          <button onClick={onClose} className="text-text-secondary hover:text-text-primary">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* YouTube сілтемесі */}
          <div>
            <label className="text-sm font-medium mb-1.5 block">{t("cinema.videoUrl")}</label>
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
              className="w-full bg-surface-2 border border-border rounded-btn px-3 py-2.5 text-sm focus:outline-none focus:border-accent-pink/50"
            />
            {urlTouched && (
              <div className={`flex items-center gap-1.5 mt-1.5 text-xs ${youtubeId ? "text-accent-green" : "text-accent-red"}`}>
                {youtubeId ? <><Check className="w-3.5 h-3.5" /> {t("cinema.videoFound")}</> : <><AlertCircle className="w-3.5 h-3.5" /> {t("cinema.videoInvalid")}</>}
              </div>
            )}
          </div>

          {/* Алдын ала көрініс */}
          {youtubeId && (
            <div className="rounded-card overflow-hidden border border-border aspect-video bg-black">
              <img src={`https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`} alt="preview" className="w-full h-full object-cover" />
            </div>
          )}

          {/* Атауы */}
          <div>
            <label className="text-sm font-medium mb-1.5 block">{t("cinema.videoName")}</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={lang === "kk" ? "Сабақтың атауы" : "Lesson title"}
              className="w-full bg-surface-2 border border-border rounded-btn px-3 py-2.5 text-sm focus:outline-none focus:border-accent-pink/50"
            />
          </div>

          {/* Қазақша атауы (қаласа) */}
          <div>
            <label className="text-sm font-medium mb-1.5 block">{t("cinema.videoNameKk")} <span className="text-text-muted font-normal">({t("common.optional")})</span></label>
            <input
              value={titleKk}
              onChange={(e) => setTitleKk(e.target.value)}
              placeholder={lang === "kk" ? "Қазақша атауы" : "Kazakh title"}
              className="w-full bg-surface-2 border border-border rounded-btn px-3 py-2.5 text-sm focus:outline-none focus:border-accent-pink/50"
            />
          </div>

          {/* Сипаттама */}
          <div>
            <label className="text-sm font-medium mb-1.5 block">{t("cinema.videoDesc")} <span className="text-text-muted font-normal">({t("common.optional")})</span></label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder={lang === "kk" ? "Қысқаша сипаттама" : "Short description"}
              className="w-full bg-surface-2 border border-border rounded-btn px-3 py-2.5 text-sm focus:outline-none focus:border-accent-pink/50 resize-none"
            />
          </div>

          {/* Деңгей */}
          <div>
            <label className="text-sm font-medium mb-1.5 block">{t("cinema.videoLevel")}</label>
            <div className="flex gap-2">
              {([["beginner", t("cinema.beginner")], ["intermediate", t("cinema.intermediate")], ["advanced", t("cinema.advanced")]] as const).map(([val, label]) => (
                <button
                  key={val}
                  onClick={() => setLevel(val)}
                  className={`flex-1 p-2.5 rounded-card border text-sm font-medium transition-all ${level === val ? "border-accent-pink bg-accent-pink/10 text-accent-pink" : "border-border hover:border-accent-pink/40"}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Тіл */}
          <div>
            <label className="text-sm font-medium mb-1.5 block">{t("cinema.videoLang")}</label>
            <div className="flex gap-2">
              {([["en", "🇬🇧 " + t("onb.english")], ["zh", "🇨🇳 " + t("onb.chinese")]] as const).map(([val, label]) => (
                <button
                  key={val}
                  onClick={() => setVideoLang(val)}
                  className={`flex-1 p-2.5 rounded-card border text-sm font-medium transition-all ${videoLang === val ? "border-accent-blue bg-accent-blue/10 text-accent-blue" : "border-border hover:border-accent-blue/40"}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Әрекеттер */}
        <div className="flex gap-2 p-4 border-t border-border sticky bottom-0 bg-surface">
          <button onClick={onClose} className="btn-ghost flex-1">{t("common.cancel")}</button>
          <button onClick={submit} disabled={!valid} className="btn-primary flex-1 disabled:opacity-40">{t("cinema.addVideoBtn")}</button>
        </div>
      </motion.div>
    </div>
  );
}
