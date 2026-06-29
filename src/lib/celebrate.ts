// filepath: src/lib/celebrate.ts
// Жеңіс анимациялары — confetti эффектілері.

import confetti from "canvas-confetti";

// Кәдімгі жеңіс (ортадан атылады)
export function celebrate() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ["#16A34A", "#0EA5E9", "#F59E0B", "#8B5CF6", "#EC4899"],
  });
}

// Үлкен жеңіс (екі жақтан)
export function celebrateBig() {
  const duration = 2000;
  const end = Date.now() + duration;
  const colors = ["#16A34A", "#0EA5E9", "#F59E0B"];

  (function frame() {
    confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 }, colors });
    confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 }, colors });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}

// Кішкене жарқыл (дұрыс жауап)
export function sparkle(x: number, y: number) {
  confetti({
    particleCount: 20,
    spread: 40,
    origin: { x, y },
    colors: ["#16A34A", "#0EA5E9"],
    scalar: 0.7,
    ticks: 50,
  });
}
