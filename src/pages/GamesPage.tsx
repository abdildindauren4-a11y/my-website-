// filepath: src/pages/GamesPage.tsx
// Ойындар хабы — 6 ойын, әрқайсы жеке модуль.
// Әсем градиент карточкалар, framer-motion анимация.

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/contexts/LangContext";
import { gamesList } from "@/lib/gamesData";
import { Gamepad2, Grid3x3, Zap, CloudRain, SpellCheck, ListOrdered, Brain, ArrowLeft } from "lucide-react";

// Ойын компоненттері
import WordMatchGame from "@/components/games/WordMatchGame";
import SpeedQuizGame from "@/components/games/SpeedQuizGame";
import WordRainGame from "@/components/games/WordRainGame";
import HangmanGame from "@/components/games/HangmanGame";
import SentenceBuilderGame from "@/components/games/SentenceBuilderGame";
import MemoryDuelGame from "@/components/games/MemoryDuelGame";

// Иконка картасы
const iconMap: Record<string, typeof Grid3x3> = {
  Grid3x3, Zap, CloudRain, SpellCheck, ListOrdered, Brain,
};

export default function GamesPage() {
  const { t, lang } = useLang();
  const [activeGame, setActiveGame] = useState<string | null>(null);

  // Белсенді ойынды көрсету
  const renderGame = () => {
    switch (activeGame) {
      case "word-match": return <WordMatchGame />;
      case "speed-quiz": return <SpeedQuizGame />;
      case "word-rain": return <WordRainGame />;
      case "hangman": return <HangmanGame />;
      case "sentence-builder": return <SentenceBuilderGame />;
      case "memory-duel": return <MemoryDuelGame />;
      default: return null;
    }
  };

  if (activeGame) {
    return (
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => setActiveGame(null)}
          className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> {t("games.back")}
        </button>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeGame}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.25 }}
          >
            {renderGame()}
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Тақырып */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-11 h-11 rounded-card bg-accent-purple/15 flex items-center justify-center">
          <Gamepad2 className="w-6 h-6 text-accent-purple" />
        </div>
        <div>
          <h1 className="text-2xl font-display font-bold">{t("games.title")}</h1>
          <p className="text-sm text-text-secondary">{t("games.subtitle")}</p>
        </div>
      </div>

      {/* Ойын карточкалары */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {gamesList.map((game, i) => {
          const Icon = iconMap[game.icon] || Gamepad2;
          return (
            <motion.button
              key={game.id}
              onClick={() => setActiveGame(game.id)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              whileTap={{ scale: 0.98 }}
              className="group relative overflow-hidden rounded-card text-left h-44"
            >
              {/* Градиент фон */}
              <div className={`absolute inset-0 bg-gradient-to-br ${game.gradient}`} />
              {/* Декоративті паттерн (айналмалы дөңгелектер) */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/30 blur-2xl group-hover:scale-150 transition-transform duration-500" />
                <div className="absolute -left-4 -bottom-4 w-24 h-24 rounded-full bg-white/20 blur-xl" />
              </div>
              {/* Мазмұн */}
              <div className="relative h-full p-5 flex flex-col justify-between">
                <div className="w-12 h-12 rounded-card bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-display font-bold text-lg mb-0.5">
                    {lang === "kk" ? game.titleKk : game.titleEn}
                  </h3>
                  <p className="text-white/80 text-sm">
                    {lang === "kk" ? game.descKk : game.descEn}
                  </p>
                </div>
                {/* Ойнау белгісі (hover-де) */}
                <div className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs font-semibold text-white bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-full">
                    {t("games.play")} →
                  </span>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
