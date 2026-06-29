// filepath: src/pages/DictionaryPage.tsx
// Сөздік — SRS жүйесімен сөз жаттау.
// Екі режим: Қайталау (flashcard) және Шолу (барлық сөз).

import { useState, useMemo, useEffect } from "react";
import { useLang } from "@/contexts/LangContext";
import { useUserPrefs } from "@/store/userPrefs";
import { useVocab } from "@/store/vocabStore";
import { useProgress } from "@/store/progressStore";
import { getDueCards, calcStats, masteryPercent, timeUntilReview } from "@/lib/srs";
import { speak } from "@/lib/speech";
import Flashcard from "@/components/vocab/Flashcard";
import DictSearch from "@/components/vocab/DictSearch";
import { BookA, Brain, Layers, Search, CheckCircle2, Sparkles, Volume2, Trash2, GraduationCap } from "lucide-react";
import type { ReviewResult } from "@/types/vocabulary";
import type { DictEntry } from "@/lib/dictionary";

type Mode = "overview" | "review" | "browse" | "search";

export default function DictionaryPage() {
  const { t, lang } = useLang();
  const { cards, reviewCard, removeCard, addCard } = useVocab();
  const { addXP } = useProgress();
  const { prefs, loaded } = useUserPrefs();
  const [mode, setMode] = useState<Mode>("overview");
  const [reviewQueue, setReviewQueue] = useState<string[]>([]);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [query, setQuery] = useState("");
  const [langFilter, setLangFilter] = useState<"all" | "en" | "zh">(prefs.learningLang);
  const [filterTouched, setFilterTouched] = useState(false);

  // Prefs жүктелгенде сүзгіні үйрену тіліне қою (қолданушы әлі өзгертпесе)
  useEffect(() => {
    if (loaded && !filterTouched) {
      setLangFilter(prefs.learningLang);
    }
  }, [loaded, prefs.learningLang, filterTouched]);

  // SRS-те бар сөздер (іздеуде қайталап қоспау үшін)
  const existingTerms = useMemo(() => new Set(cards.map((c) => c.term.toLowerCase())), [cards]);

  // Іздеуден сөзді SRS-ке қосу
  const handleAddFromDict = (entry: DictEntry, lang: "en" | "zh") => {
    addCard({
      lang,
      term: entry.t,
      translation: entry.d,        // ағылшын анықтама (кейін қазақшаға аударуға болады)
      phonetic: entry.p,
      partOfSpeech: entry.pos,
      source: "dictionary",
    });
  };

  const stats = useMemo(() => calcStats(cards), [cards]);
  const dueCards = useMemo(() => getDueCards(cards), [cards]);

  // Қайталауды бастау
  const startReview = () => {
    const due = getDueCards(cards);
    if (due.length === 0) return;
    setReviewQueue(due.map((c) => c.id));
    setReviewIndex(0);
    setMode("review");
  };

  // Қайталау нәтижесі
  const handleReview = (result: ReviewResult) => {
    const cardId = reviewQueue[reviewIndex];
    reviewCard(cardId, result);
    // Әр қайталау = XP (дұрыс жауап көбірек)
    addXP(result === "easy" ? 15 : result === "good" ? 10 : result === "hard" ? 5 : 2);
    if (reviewIndex + 1 < reviewQueue.length) {
      setReviewIndex(reviewIndex + 1);
    } else {
      setMode("overview"); // бітті
    }
  };

  // Шолу — сүзілген сөздер (тіл + іздеу)
  const filtered = useMemo(() => {
    let list = cards;
    if (langFilter !== "all") list = list.filter((c) => c.lang === langFilter);
    if (query) {
      const q = query.toLowerCase();
      list = list.filter((c) => c.term.toLowerCase().includes(q) || c.translation.toLowerCase().includes(q));
    }
    return list;
  }, [cards, query, langFilter]);

  // ── ҚАЙТАЛАУ РЕЖИМІ ──
  if (mode === "review" && reviewQueue.length > 0) {
    const currentCard = cards.find((c) => c.id === reviewQueue[reviewIndex]);
    if (!currentCard) { setMode("overview"); return null; }
    const progress = Math.round((reviewIndex / reviewQueue.length) * 100);

    return (
      <div className="max-w-2xl mx-auto">
        {/* Прогресс */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <button onClick={() => setMode("overview")} className="text-sm text-text-secondary hover:text-text-primary">← {t("common.back")}</button>
            <span className="text-sm text-text-secondary">
              {reviewIndex + 1} / {reviewQueue.length} {t("vocab.cardOf")}
            </span>
          </div>
          <div className="h-2 rounded-full bg-border overflow-hidden">
            <div className="h-full bg-accent-green rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
        <Flashcard card={currentCard} onReview={handleReview} />
      </div>
    );
  }

  // ── НЕГІЗГІ КӨРІНІС (overview + browse) ──
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Тақырып */}
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-card bg-accent-blue/15 flex items-center justify-center">
          <BookA className="w-6 h-6 text-accent-blue" />
        </div>
        <div>
          <h1 className="text-2xl font-display font-bold">{t("vocab.title")}</h1>
          <p className="text-sm text-text-secondary">{t("vocab.subtitle")}</p>
        </div>
      </div>

      {/* Статистика карталары */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-2"><Layers className="w-4 h-4 text-text-secondary" /><span className="text-xs text-text-secondary">{t("vocab.total")}</span></div>
          <span className="text-2xl font-display font-bold">{stats.total}</span>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-2"><Sparkles className="w-4 h-4 text-accent-purple" /><span className="text-xs text-text-secondary">{t("vocab.new")}</span></div>
          <span className="text-2xl font-display font-bold text-accent-purple">{stats.new}</span>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-2"><Brain className="w-4 h-4 text-accent-gold" /><span className="text-xs text-text-secondary">{t("vocab.learning")}</span></div>
          <span className="text-2xl font-display font-bold text-accent-gold">{stats.learning}</span>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-2"><GraduationCap className="w-4 h-4 text-accent-green" /><span className="text-xs text-text-secondary">{t("vocab.mastered")}</span></div>
          <span className="text-2xl font-display font-bold text-accent-green">{stats.mastered}</span>
        </div>
      </div>

      {/* Қайталау блогы */}
      <div className="card p-6 bg-gradient-to-br from-accent-blue/10 to-accent-green/5 border-accent-blue/20">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-card bg-accent-blue/20 flex items-center justify-center">
              <Brain className="w-7 h-7 text-accent-blue" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg">
                {stats.dueToday > 0 ? `${stats.dueToday} ${t("vocab.reviewsLeft")}` : t("vocab.noDue")}
              </h3>
              <p className="text-sm text-text-secondary">{t("vocab.reviewProgress")}</p>
            </div>
          </div>
          <button
            onClick={startReview}
            disabled={stats.dueToday === 0}
            className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Brain className="w-4 h-4" /> {t("vocab.startReview")}
          </button>
        </div>
      </div>

      {/* Режим ауыстырғыш */}
      <div className="flex items-center gap-2 border-b border-border overflow-x-auto">
        <button
          onClick={() => setMode("overview")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${mode === "overview" ? "border-accent-blue text-text-primary" : "border-transparent text-text-secondary hover:text-text-primary"}`}
        >
          {t("vocab.dueToday")}
        </button>
        <button
          onClick={() => setMode("browse")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${mode === "browse" ? "border-accent-blue text-text-primary" : "border-transparent text-text-secondary hover:text-text-primary"}`}
        >
          {t("vocab.browse")} ({stats.total})
        </button>
        <button
          onClick={() => setMode("search")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-all whitespace-nowrap flex items-center gap-1.5 ${mode === "search" ? "border-accent-blue text-text-primary" : "border-transparent text-text-secondary hover:text-text-primary"}`}
        >
          <Search className="w-3.5 h-3.5" /> {t("vocab.search")}
        </button>
      </div>

      {/* Контент */}
      {mode === "search" ? (
        <DictSearch onAddWord={handleAddFromDict} existingTerms={existingTerms} />
      ) : mode === "overview" ? (
        <div className="space-y-2">
          {dueCards.length === 0 ? (
            <div className="card p-8 text-center">
              <CheckCircle2 className="w-12 h-12 text-accent-green mx-auto mb-3" />
              <h3 className="font-display font-bold text-lg mb-1">{t("vocab.allDone")}</h3>
              <p className="text-text-secondary text-sm">{t("vocab.allDoneDesc")}</p>
            </div>
          ) : (
            dueCards.slice(0, 10).map((card) => (
              <WordRow key={card.id} card={card} lang={lang} onRemove={() => removeCard(card.id)} />
            ))
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {/* Іздеу + тіл сүзгісі */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="card p-2 flex items-center gap-2 flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-text-muted ml-2" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("vocab.searchWords")}
                className="flex-1 bg-transparent px-2 py-1.5 text-sm focus:outline-none"
              />
            </div>
            {/* Тіл сүзгісі */}
            <div className="flex items-center bg-surface-2 rounded-btn p-1 border border-border">
              {([["all", t("vocab.allLangs")], ["en", "EN"], ["zh", "中"]] as const).map(([val, label]) => (
                <button
                  key={val}
                  onClick={() => { setLangFilter(val); setFilterTouched(true); }}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${langFilter === val ? "bg-accent-blue text-white" : "text-text-secondary hover:text-text-primary"}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          {filtered.length === 0 ? (
            <p className="text-center text-text-secondary py-8 text-sm">{t("vocab.empty")}</p>
          ) : (
            <div className="space-y-2">
              {filtered.map((card) => (
                <WordRow key={card.id} card={card} lang={lang} onRemove={() => removeCard(card.id)} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Сөз жолы (тізімде)
function WordRow({ card, lang, onRemove }: { card: any; lang: "kk" | "en"; onRemove: () => void }) {
  const pct = masteryPercent(card);
  const masteryColor = pct >= 80 ? "text-accent-green" : pct >= 40 ? "text-accent-gold" : "text-accent-red";

  return (
    <div className="card p-3 flex items-center gap-3 hover:bg-surface-2 transition-colors group">
      {/* Тіл белгісі */}
      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-surface-2 text-text-secondary shrink-0">
        {card.lang === "en" ? "EN" : "中"}
      </span>
      {/* Сөз */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold">{card.term}</span>
          {card.phonetic && <span className="text-xs text-text-muted font-mono">{card.phonetic}</span>}
        </div>
        <span className="text-sm text-text-secondary">{card.translation}</span>
      </div>
      {/* Меңгеру */}
      <div className="text-right shrink-0">
        <div className={`text-sm font-semibold ${masteryColor}`}>{pct}%</div>
        <div className="text-[10px] text-text-muted">{timeUntilReview(card, lang)}</div>
      </div>
      {/* Дыбыс + өшіру */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={() => speak(card.term, card.lang)}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-accent-blue transition-colors"
        >
          <Volume2 className="w-4 h-4" />
        </button>
        <button onClick={onRemove} className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-accent-red transition-colors opacity-0 group-hover:opacity-100">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
