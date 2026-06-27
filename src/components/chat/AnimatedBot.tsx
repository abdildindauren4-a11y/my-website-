// filepath: src/components/chat/AnimatedBot.tsx
// Сүйкімді анимациялы бот — чаттың жүзі.
// Күйлері: idle (тыныш), thinking (ойлануда), talking (сөйлеуде), happy (қуанышты).
// Көзін жыпылықтатады, қалқиды, эмоция көрсетеді.

import { motion } from "framer-motion";

export type BotState = "idle" | "thinking" | "talking" | "happy";

interface Props {
  state?: BotState;
  size?: number;
}

export default function AnimatedBot({ state = "idle", size = 80 }: Props) {
  // Көз күйі әр эмоцияға қарай
  const eyeScale = state === "happy" ? 0.6 : 1;
  const mouthPath =
    state === "happy"
      ? "M 28 56 Q 40 66 52 56" // үлкен күлкі
      : state === "talking"
      ? "M 32 56 Q 40 62 48 56"  // сөйлеу (ашық)
      : "M 32 57 Q 40 61 48 57"; // тыныш күлкі

  return (
    <div style={{ width: size, height: size }} className="relative">
      {/* Қалқу анимациясы (бүкіл бот) */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="w-full h-full"
      >
        {/* Жарқырау (ойланғанда/қуанғанда) */}
        {(state === "thinking" || state === "happy") && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: state === "happy"
                ? "radial-gradient(circle, rgba(16,185,129,0.4) 0%, transparent 70%)"
                : "radial-gradient(circle, rgba(14,165,233,0.4) 0%, transparent 70%)",
            }}
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}

        <svg viewBox="0 0 80 80" className="w-full h-full relative z-10">
          <defs>
            <linearGradient id="botBody" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#16A34A" />
              <stop offset="100%" stopColor="#0EA5E9" />
            </linearGradient>
            <linearGradient id="botFace" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F0F4F1" />
              <stop offset="100%" stopColor="#FFFFFF" />
            </linearGradient>
          </defs>

          {/* Антенна */}
          <motion.g
            animate={state === "thinking" ? { rotate: [-8, 8, -8] } : { rotate: 0 }}
            transition={{ duration: 1, repeat: state === "thinking" ? Infinity : 0 }}
            style={{ transformOrigin: "40px 18px" }}
          >
            <line x1="40" y1="18" x2="40" y2="8" stroke="url(#botBody)" strokeWidth="2.5" strokeLinecap="round" />
            <motion.circle
              cx="40" cy="6" r="3.5" fill="#F59E0B"
              animate={state === "thinking" ? { scale: [1, 1.4, 1] } : {}}
              transition={{ duration: 0.8, repeat: Infinity }}
            />
          </motion.g>

          {/* Дене (бас) */}
          <rect x="14" y="18" width="52" height="46" rx="18" fill="url(#botBody)" />

          {/* Жүз экраны */}
          <rect x="20" y="26" width="40" height="30" rx="12" fill="url(#botFace)" />

          {/* Көздер */}
          <motion.g
            animate={{ scaleY: [1, 1, 0.1, 1] }}
            transition={{ duration: 0.3, repeat: Infinity, repeatDelay: 2.5, times: [0, 0.9, 0.95, 1] }}
            style={{ transformOrigin: "center 38px" }}
          >
            {/* Сол көз */}
            <motion.circle
              cx="32" cy="38" r="4" fill="#16A34A"
              animate={{ scale: eyeScale }}
              transition={{ duration: 0.3 }}
            />
            {/* Оң көз */}
            <motion.circle
              cx="48" cy="38" r="4" fill="#16A34A"
              animate={{ scale: eyeScale }}
              transition={{ duration: 0.3 }}
            />
            {/* Көз жарығы (тірілік) */}
            <circle cx="33.5" cy="36.5" r="1.3" fill="#fff" opacity="0.9" />
            <circle cx="49.5" cy="36.5" r="1.3" fill="#fff" opacity="0.9" />
          </motion.g>

          {/* Ауыз */}
          <motion.path
            d={mouthPath}
            stroke="#16A34A"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
            animate={state === "talking" ? { d: [mouthPath, "M 32 56 Q 40 60 48 56", mouthPath] } : {}}
            transition={{ duration: 0.4, repeat: state === "talking" ? Infinity : 0 }}
          />

          {/* Құлақтар (бүйір) */}
          <rect x="10" y="34" width="4" height="14" rx="2" fill="url(#botBody)" />
          <rect x="66" y="34" width="4" height="14" rx="2" fill="url(#botBody)" />

          {/* Қуанғанда — беттегі қызыл нүктелер */}
          {state === "happy" && (
            <>
              <circle cx="24" cy="46" r="2.5" fill="#EC4899" opacity="0.5" />
              <circle cx="56" cy="46" r="2.5" fill="#EC4899" opacity="0.5" />
            </>
          )}
        </svg>
      </motion.div>
    </div>
  );
}
