// filepath: src/components/games/GameArt.tsx
// Ойын карточкаларына арналған 3D-стильдегі SVG иллюстрациялар.
// Әр ойынға жеке тақырыптық сурет (Сөз сәйкестігі, Викторина, т.б.).
// Таза SVG — қосымша файл/сурет қажет емес, кез келген өлшемге масштабталады.

interface GameArtProps {
  id: string;
  className?: string;
}

// Жалпы жұмсақ көлеңке (3D әсер беру үшін)
const Soft = () => (
  <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
    <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#000" floodOpacity="0.18" />
  </filter>
);

// Шашыраған декоративті нүктелер
function Dots({ color = "#ffffff" }: { color?: string }) {
  const dots = [
    [18, 24, 3], [40, 14, 2], [150, 30, 4], [172, 70, 2.5],
    [30, 120, 3], [165, 130, 3.5], [8, 80, 2], [120, 18, 2.5],
  ];
  return (
    <g opacity="0.5">
      {dots.map(([cx, cy, r], i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill={color} opacity={0.4 + (i % 3) * 0.2} />
      ))}
    </g>
  );
}

export default function GameArt({ id, className = "" }: GameArtProps) {
  const common = { viewBox: "0 0 190 170", className, fill: "none" as const, xmlns: "http://www.w3.org/2000/svg" };

  switch (id) {
    // ── Сөз сәйкестігі: екі сөз картасы + байланыс + белгі ──
    case "word-match":
      return (
        <svg {...common}>
          <defs><Soft /></defs>
          <Dots />
          <path d="M70 60 C95 70 95 100 120 108" stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity="0.85" />
          <g filter="url(#softShadow)">
            <rect x="14" y="36" width="92" height="46" rx="14" fill="#F4F0FF" />
            <text x="60" y="65" textAnchor="middle" fontFamily="system-ui" fontWeight="800" fontSize="22" fill="#7C3AED">Apple</text>
          </g>
          <g filter="url(#softShadow)">
            <rect x="84" y="96" width="92" height="46" rx="14" fill="#F4F0FF" />
            <text x="130" y="125" textAnchor="middle" fontFamily="system-ui" fontWeight="800" fontSize="22" fill="#7C3AED">Алма</text>
          </g>
          <g filter="url(#softShadow)">
            <circle cx="120" cy="86" r="18" fill="#7C3AED" />
            <path d="M112 86 l6 6 l11 -13" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </svg>
      );

    // ── Жылдам викторина: секундомер + жұлдыз + сұрақ белгісі ──
    case "speed-quiz":
      return (
        <svg {...common}>
          <defs>
            <Soft />
            <radialGradient id="watchFace" cx="40%" cy="35%"><stop offset="0%" stopColor="#fffdf6" /><stop offset="100%" stopColor="#fde8c4" /></radialGradient>
          </defs>
          <Dots />
          {/* Сәуле */}
          <g stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity="0.6">
            <path d="M150 36 l10 -10" /><path d="M168 60 l13 -4" /><path d="M160 92 l12 6" />
          </g>
          {/* Жұлдыз */}
          <path d="M44 34 l5 11 l12 1 l-9 8 l3 12 l-11 -6 l-11 6 l3 -12 l-9 -8 l12 -1 z" fill="#FFD24A" filter="url(#softShadow)" />
          <g filter="url(#softShadow)">
            {/* Түйме + батырмалар */}
            <rect x="92" y="34" width="16" height="12" rx="4" fill="#E8881A" />
            <rect x="70" y="40" width="10" height="9" rx="3" fill="#E8881A" transform="rotate(-30 75 44)" />
            <rect x="120" y="40" width="10" height="9" rx="3" fill="#E8881A" transform="rotate(30 125 44)" />
            {/* Корпус */}
            <circle cx="100" cy="98" r="46" fill="#F59E0B" />
            <circle cx="100" cy="98" r="36" fill="url(#watchFace)" />
            {/* Тілдер */}
            <line x1="100" y1="98" x2="100" y2="72" stroke="#E8881A" strokeWidth="5" strokeLinecap="round" />
            <line x1="100" y1="98" x2="120" y2="104" stroke="#E8881A" strokeWidth="5" strokeLinecap="round" />
            <circle cx="100" cy="98" r="5" fill="#E8881A" />
          </g>
          <text x="158" y="138" fontFamily="system-ui" fontWeight="900" fontSize="40" fill="#E8881A" opacity="0.9">?</text>
        </svg>
      );

    // ── Сөз жаңбыры: бұлт + түсіп жатқан әріп блоктары ──
    case "word-rain":
      return (
        <svg {...common}>
          <defs><Soft /></defs>
          <Dots color="#dff1ff" />
          <g filter="url(#softShadow)">
            <ellipse cx="92" cy="46" rx="48" ry="26" fill="#fff" />
            <circle cx="62" cy="48" r="20" fill="#fff" />
            <circle cx="120" cy="50" r="22" fill="#f1f8ff" />
          </g>
          {/* Тамшылар */}
          <g fill="#bfe3ff">
            {[[58, 78], [78, 86], [128, 80], [146, 92]].map(([x, y], i) => (
              <path key={i} d={`M${x} ${y} q4 7 0 11 q-4 -4 0 -11 z`} />
            ))}
          </g>
          {/* Әріп блоктары */}
          {([["A", 44, 108, "#2563EB"], ["B", 92, 116, "#3B82F6"], ["C", 138, 110, "#1D4ED8"]] as const).map(([ch, x, y, c], i) => (
            <g key={i} filter="url(#softShadow)">
              <rect x={x} y={y} width="34" height="34" rx="10" fill={c} />
              <text x={x + 17} y={y + 24} textAnchor="middle" fontFamily="system-ui" fontWeight="800" fontSize="20" fill="#fff">{ch}</text>
            </g>
          ))}
        </svg>
      );

    // ── Әріп табу: лупа + әріп блоктары ──
    case "hangman":
      return (
        <svg {...common}>
          <defs><Soft /></defs>
          <Dots color="#d8f5e3" />
          <text x="150" y="56" fontFamily="system-ui" fontWeight="900" fontSize="34" fill="#fff" opacity="0.7">?</text>
          {/* Блоктар B C */}
          {([["B", 120, 96, "#16A34A"], ["C", 150, 116, "#15803D"]] as const).map(([ch, x, y, c], i) => (
            <g key={i} filter="url(#softShadow)">
              <rect x={x} y={y} width="32" height="32" rx="10" fill="#fff" />
              <text x={x + 16} y={y + 23} textAnchor="middle" fontFamily="system-ui" fontWeight="800" fontSize="19" fill={c}>{ch}</text>
            </g>
          ))}
          {/* Лупа */}
          <g filter="url(#softShadow)">
            <rect x="58" y="40" width="46" height="46" rx="13" fill="#16A34A" />
            <text x="81" y="73" textAnchor="middle" fontFamily="system-ui" fontWeight="800" fontSize="26" fill="#fff">A</text>
            <circle cx="81" cy="63" r="30" fill="#86EFAC" fillOpacity="0.28" stroke="#22C55E" strokeWidth="6" />
            <rect x="98" y="86" width="14" height="34" rx="7" fill="#15803D" transform="rotate(-45 105 103)" />
          </g>
        </svg>
      );

    // ── Сөйлем құрау: сөйлеу көпіршігі + сөз чиптері ──
    case "sentence-builder":
      return (
        <svg {...common}>
          <defs><Soft /></defs>
          <Dots color="#ffe1ee" />
          {/* Көпіршік */}
          <g filter="url(#softShadow)">
            <rect x="104" y="28" width="62" height="42" rx="14" fill="#FBA4C8" />
            <path d="M118 68 l-2 14 l16 -10 z" fill="#FBA4C8" />
            {[126, 135, 144].map((cx) => <circle key={cx} cx={cx} cy={49} r="4" fill="#fff" />)}
          </g>
          {/* Сөз чиптері панелі */}
          <g filter="url(#softShadow)">
            <rect x="14" y="90" width="162" height="40" rx="16" fill="#fff" />
          </g>
          {([["Мен", 24, "#EC4899"], ["кітап", 70, "#DB2777"], ["оқимын", 124, "#EC4899"]] as const).map(([w, x, c], i) => (
            <g key={i}>
              <rect x={x} y="99" width={w.length * 9 + 14} height="22" rx="11" fill={c} />
              <text x={x + (w.length * 9 + 14) / 2} y="114" textAnchor="middle" fontFamily="system-ui" fontWeight="700" fontSize="12" fill="#fff">{w}</text>
            </g>
          ))}
        </svg>
      );

    // ── Жады дуэлі: карта торы + жұлдыз/ми ──
    case "memory-duel":
      return (
        <svg {...common}>
          <defs><Soft /></defs>
          <Dots color="#d2f7f3" />
          {(() => {
            const cells: { x: number; y: number; kind: "blank" | "star" | "brain" }[] = [
              { x: 46, y: 38, kind: "blank" }, { x: 88, y: 38, kind: "blank" }, { x: 130, y: 38, kind: "brain" },
              { x: 46, y: 80, kind: "blank" }, { x: 88, y: 80, kind: "star" }, { x: 130, y: 80, kind: "brain" },
            ];
            return cells.map((c, i) => (
              <g key={i} filter="url(#softShadow)">
                <rect x={c.x} y={c.y} width="36" height="36" rx="11" fill="#2DD4BF" />
                {c.kind === "star" && (
                  <path d={`M${c.x + 18} ${c.y + 7} l3 7 l8 1 l-6 5 l2 8 l-7 -4 l-7 4 l2 -8 l-6 -5 l8 -1 z`} fill="#FFD24A" />
                )}
                {c.kind === "brain" && (
                  <path d={`M${c.x + 18} ${c.y + 9} c-7 -4 -13 4 -8 9 c-4 5 2 12 8 9 c6 3 12 -4 8 -9 c5 -5 -1 -13 -8 -9 z M${c.x + 18} ${c.y + 9} l0 18`} stroke="#0D9488" strokeWidth="2.4" fill="none" strokeLinecap="round" opacity="0.8" />
                )}
              </g>
            ));
          })()}
        </svg>
      );

    default:
      return null;
  }
}
