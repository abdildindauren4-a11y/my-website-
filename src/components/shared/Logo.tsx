// filepath: src/components/shared/Logo.tsx
// LinguaFast логотипі — бір жерден басқарылады.
// public/logo.png болса — соны көрсетеді; болмаса әдемі "LF" fallback.
// Жаңа логотип қосу үшін тек public/logo.png файлын ауыстыру жеткілікті.

import { useState } from "react";

interface Props {
  size?: number;          // белгіше өлшемі (px)
  showText?: boolean;     // "LinguaFast" мәтінін көрсету
  className?: string;
}

export default function Logo({ size = 40, showText = false, className = "" }: Props) {
  const [imgOk, setImgOk] = useState(true);

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {imgOk ? (
        <img
          src="/logo.png"
          alt="LinguaFast"
          width={size}
          height={size}
          onError={() => setImgOk(false)}
          className="object-contain shrink-0"
          style={{ width: size, height: size }}
        />
      ) : (
        // Fallback — градиентті "LF" белгісі
        <div
          className="rounded-card flex items-center justify-center shrink-0 shadow-glow font-display font-bold text-white"
          style={{
            width: size, height: size,
            fontSize: size * 0.42,
            backgroundImage: "linear-gradient(135deg, #16A34A, #0EA5E9)",
          }}
        >
          LF
        </div>
      )}
      {showText && <span className="text-xl font-display font-bold gradient-text">LinguaFast</span>}
    </div>
  );
}
