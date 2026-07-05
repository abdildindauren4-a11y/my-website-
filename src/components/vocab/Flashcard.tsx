// filepath: src/components/vocab/Flashcard.tsx
// Карта режимі — сөзді аударып есте сақтау (flashcard).
// Алдыңғы жағы: сөз. Артқы жағы: аударма + мысал.
// SRS батырмалары: Again / Hard / Good / Easy.

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/contexts/LangContext";
import { speak } from "@/lib/speech";
import { getCardImage, generateCardImage, deleteCardImage, type ImageGenError } from "@/lib/cardImages";
import { Volume2, RotateCw, Sparkles, Loader2, Trash2 } from "lucide-react";
import type { VocabCard, ReviewResult } from "@/types/vocabulary";

interface Props {
  card: VocabCard;
  onReview: (result: ReviewResult) => void;
}

export default function Flashcard({ card, onReview }: Props) {
  const { t } = useLang();
  const [flipped, setFlipped] = useState(false);
  // AI-сурет: репо (/cards) → құрылғы қоймасы (IndexedDB) → «жасау» батырмасы
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [imgLoading, setImgLoading] = useState(false);
  const [imgError, setImgError] = useState<ImageGenError | null>(null);

  // Карта ауысқанда сақталған суретті іздеу
  useEffect(() => {
    let alive = true;
    setImgUrl(null);
    setImgError(null);
    getCardImage(card.term, card.lang).then((url) => {
      if (alive) setImgUrl(url);
    });
    return () => { alive = false; };
  }, [card.term, card.lang]);

  // Disney-стиліндегі сурет жасау (бір рет — кейін қоймадан)
  const makeImage = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setImgLoading(true);
    setImgError(null);
    const result = await generateCardImage(card.term, card.translation, card.lang);
    setImgLoading(false);
    if (result.ok) setImgUrl(result.url);
    else setImgError(result.error);
  };

  // Ұнамаған суретті өшіру (қайта жасауға болады)
  const removeImage = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await deleteCardImage(card.term, card.lang);
    setImgUrl(null);
    setImgError(null);
  };

  const handleReview = (result: ReviewResult) => {
    onReview(result);
    setFlipped(false); // келесі карта үшін
  };

  // SRS батырмалары (түспен)
  const buttons: Array<{ result: ReviewResult; labelKk: string; labelEn: string; color: string; interval: string }> = [
    { result: "again", labelKk: "Қайтадан", labelEn: "Again", color: "accent-red", interval: "<10 мин" },
    { result: "hard", labelKk: "Қиын", labelEn: "Hard", color: "accent-gold", interval: "1 күн" },
    { result: "good", labelKk: "Жақсы", labelEn: "Good", color: "accent-green", interval: "3 күн" },
    { result: "easy", labelKk: "Оңай", labelEn: "Easy", color: "accent-blue", interval: "7 күн" },
  ];

  const colorMap: Record<string, string> = {
    "accent-red": "bg-accent-red/15 text-accent-red border-accent-red/30 hover:bg-accent-red/25",
    "accent-gold": "bg-accent-gold/15 text-accent-gold border-accent-gold/30 hover:bg-accent-gold/25",
    "accent-green": "bg-accent-green/15 text-accent-green border-accent-green/30 hover:bg-accent-green/25",
    "accent-blue": "bg-accent-blue/15 text-accent-blue border-accent-blue/30 hover:bg-accent-blue/25",
  };

  return (
    <div className="max-w-xl mx-auto w-full">
      {/* Карта */}
      <div
        className="relative cursor-pointer"
        style={{ perspective: "1000px" }}
        onClick={() => !flipped && setFlipped(true)}
      >
        <motion.div
          className={`relative w-full ${flipped ? "min-h-[480px]" : "min-h-[320px]"} transition-all`}
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.5 }}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Алдыңғы жағы (тек сөз — жауапты еске түсіру үшін сурет жоқ) */}
          <div
            className="absolute inset-0 card p-8 flex flex-col items-center justify-center text-center"
            style={{ backfaceVisibility: "hidden" }}
          >
            <span className="text-xs text-text-muted mb-4 uppercase tracking-wide">
              {card.lang === "en" ? "English" : "中文"}
            </span>
            <h2 className="text-4xl font-display font-bold mb-3">{card.term}</h2>
            {card.phonetic && <p className="text-text-secondary font-mono mb-2">{card.phonetic}</p>}
            <button
              onClick={(e) => { e.stopPropagation(); speak(card.term, card.lang); }}
              className="w-10 h-10 rounded-full bg-surface-2 flex items-center justify-center text-text-secondary hover:text-accent-blue transition-colors mt-2"
            >
              <Volume2 className="w-5 h-5" />
            </button>
            <p className="text-text-muted text-sm mt-6 flex items-center gap-1.5">
              <RotateCw className="w-3.5 h-3.5" /> {t("vocab.tapToFlip")}
            </p>
          </div>

          {/* Артқы жағы (аударма) */}
          <div
            className="absolute inset-0 card p-8 flex flex-col items-center justify-center text-center bg-surface-2"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            <span className="text-xs text-text-muted mb-2 uppercase tracking-wide">{t("vocab.translation")}</span>

            {/* AI-сурет — тек аударылған жақта, фонсыз (картаның бөлшегі сияқты).
                mix-blend-multiply: суреттің ақ фоны картаның ашық фонына сіңіп кетеді. */}
            {imgUrl ? (
              <div className="relative group/img mb-2">
                <motion.img
                  key={imgUrl}
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  src={imgUrl}
                  alt=""
                  draggable={false}
                  className="w-40 h-40 sm:w-44 sm:h-44 object-contain select-none mix-blend-multiply"
                />
                {/* Ұнамаса — өшіру (кейін қайта жасауға болады) */}
                <button
                  onClick={removeImage}
                  title={t("vocab.deleteImage")}
                  className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-surface border border-border text-text-muted hover:text-accent-red hover:border-accent-red/40 flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover/img:opacity-100 transition-opacity shadow-soft"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : imgLoading ? (
              <div className="w-40 h-40 flex flex-col items-center justify-center gap-2 mb-2">
                <Loader2 className="w-8 h-8 text-accent-purple animate-spin" />
                <span className="text-[11px] text-text-muted">{t("vocab.imageMaking")}</span>
              </div>
            ) : (
              <button
                onClick={makeImage}
                className="mb-3 inline-flex items-center gap-1.5 text-xs font-medium text-accent-purple bg-accent-purple/10 hover:bg-accent-purple/20 border border-accent-purple/30 rounded-btn px-3 py-2 transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                {imgError === "quota" ? t("vocab.imageQuota")
                  : imgError === "unavailable" ? t("vocab.imageUnavailable")
                  : imgError ? t("vocab.imageError")
                  : t("vocab.makeImage")}
              </button>
            )}

            <h3 className="text-3xl font-display font-bold text-accent-green mb-4">{card.translation}</h3>
            {card.partOfSpeech && <span className="text-xs text-text-secondary mb-3">{card.partOfSpeech}</span>}
            {card.example && (
              <div className="mt-2 pt-4 border-t border-border w-full">
                <p className="text-sm text-text-secondary italic">"{card.example}"</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* SRS батырмалары (тек аударылғанда) */}
      <AnimatePresence>
        {flipped && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-4 gap-2 mt-5"
          >
            {buttons.map((b) => (
              <button
                key={b.result}
                onClick={() => handleReview(b.result)}
                className={`rounded-btn border py-3 px-2 transition-all ${colorMap[b.color]}`}
              >
                <div className="font-semibold text-sm">{t(`vocab.${b.result}` as any)}</div>
                <div className="text-[10px] opacity-70 mt-0.5">{b.interval}</div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Аудармай тұрғанда — көмек */}
      {!flipped && (
        <p className="text-center text-text-muted text-sm mt-5">
          {t("vocab.thinkThenFlip")}
        </p>
      )}
    </div>
  );
}
