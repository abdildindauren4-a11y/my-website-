// filepath: src/components/cinema/SubtitleOverlay.tsx
// Видео үстіндегі екі тілді субтитр (ағылшын + қазақ).
// UI blueprint-тегідей: EN мәтін жоғарыда, KK аудармасы астында.

import type { SubtitleLine } from "@/types/cinema";

interface Props {
  line: SubtitleLine | null;
}

export default function SubtitleOverlay({ line }: Props) {
  if (!line) return null;

  return (
    <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-[90%] max-w-2xl">
      <div className="bg-black/75 backdrop-blur-sm rounded-card px-5 py-4 border border-white/10">
        {/* Ағылшынша */}
        <div className="flex items-start gap-2.5">
          <span className="text-[10px] font-bold text-accent-blue bg-accent-blue/20 px-1.5 py-0.5 rounded shrink-0 mt-0.5">EN</span>
          <p className="text-white text-lg leading-snug text-center flex-1">{line.en}</p>
        </div>
        {/* Бөлгіш */}
        <div className="h-px bg-white/15 my-2.5" />
        {/* Қазақша */}
        <div className="flex items-start gap-2.5">
          <span className="text-[10px] font-bold text-accent-green bg-accent-green/20 px-1.5 py-0.5 rounded shrink-0 mt-0.5">KK</span>
          <p className="text-text-secondary text-base leading-snug text-center flex-1">{line.kk}</p>
        </div>
      </div>
    </div>
  );
}
