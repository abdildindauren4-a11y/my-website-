// filepath: src/components/chat/AnimatedBot.tsx
// Чаттың жүзі — сүйкімді 3D бот суреті (public/bot.png).
// Күйлері: idle (тыныш қалқу), thinking (ойлану + жарқырау),
// talking (сөйлеу), happy (қуаныш — секіру + жарқырау).

import { motion } from "framer-motion";

export type BotState = "idle" | "thinking" | "talking" | "happy";

interface Props {
  state?: BotState;
  size?: number;
}

export default function AnimatedBot({ state = "idle", size = 80 }: Props) {
  const glowing = state === "thinking" || state === "happy";
  // Жауап жазып жатқанда — анимациялық бот (мөлдір WebP), әйтпесе тұрақты сурет
  const responding = state === "thinking" || state === "talking";
  const src = responding ? "/bot-typing.webp" : "/bot.png";

  // Күйге қарай қалқу/секіру қозғалысы
  const motionByState =
    state === "happy"
      ? { y: [0, -8, 0], rotate: [0, -3, 3, 0] }
      : state === "thinking"
      ? { y: [0, -5, 0] }
      : { y: [0, -6, 0] };

  const durByState = state === "happy" ? 0.6 : state === "thinking" ? 1.6 : 3;

  return (
    <div style={{ width: size, height: size }} className="relative shrink-0">
      {/* Жарқырау (ойланғанда/қуанғанда) */}
      {glowing && (
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              state === "happy"
                ? "radial-gradient(circle, rgba(34,197,94,0.45) 0%, transparent 70%)"
                : "radial-gradient(circle, rgba(14,165,233,0.40) 0%, transparent 70%)",
          }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.85, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}

      {/* Бот суреті — жауап жазғанда анимациялық WebP, әйтпесе тұрақты сурет */}
      <motion.img
        key={src}
        src={src}
        alt="LinguaFast bot"
        draggable={false}
        animate={motionByState}
        transition={{ duration: durByState, repeat: Infinity, ease: "easeInOut" }}
        className="w-full h-full object-contain relative z-10 select-none drop-shadow-md"
      />
    </div>
  );
}
