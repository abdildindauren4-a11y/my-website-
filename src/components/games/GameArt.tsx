// filepath: src/components/games/GameArt.tsx
// Ойын карточкаларына арналған шынайы 3D суреттер (Fluent Emoji 3D, MIT).
// Суреттер public/games/*.png ішінде. Әр ойынға тақырыптық 3D рендер.

interface GameArtProps {
  id: string;
  className?: string;
}

export default function GameArt({ id, className = "" }: GameArtProps) {
  return (
    <img
      src={`/games/${id}.png`}
      alt=""
      aria-hidden="true"
      loading="lazy"
      draggable={false}
      className={`object-contain drop-shadow-2xl select-none ${className}`}
    />
  );
}
