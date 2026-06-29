// filepath: src/lib/soundFX.ts
// Ойын дыбыс әсерлері — Web Audio API (файлсыз, кодпен генерацияланады).
// Жеңіл, тегін, жылдам. TTS-тен бөлек (ол сөз оқиды, бұл — әсер).

let audioCtx: AudioContext | null = null;
let soundEnabled = true;

// Дыбысты қосу/өшіру (баптаудан басқарылады)
export function setSoundEnabled(on: boolean) {
  soundEnabled = on;
  try { localStorage.setItem("linguafast_sound", on ? "1" : "0"); } catch { /* */ }
}

export function isSoundEnabled(): boolean {
  try {
    const saved = localStorage.getItem("linguafast_sound");
    if (saved !== null) soundEnabled = saved === "1";
  } catch { /* */ }
  return soundEnabled;
}

// AudioContext-ті алу (бірінші әрекетте жасалады)
function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    try {
      audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch { return null; }
  }
  // Кейде suspended болады — қайта іске қосу
  if (audioCtx.state === "suspended") audioCtx.resume();
  return audioCtx;
}

// Бір нота ойнау (жиілік, ұзақтық, түрі, көлемі)
function tone(freq: number, duration: number, type: OscillatorType = "sine", volume = 0.15, delay = 0) {
  const ctx = getCtx();
  if (!ctx || !isSoundEnabled()) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;

  const start = ctx.currentTime + delay;
  // Жұмсақ attack/release (тық еткен дыбыс болмауы үшін)
  gain.gain.setValueAtTime(0, start);
  gain.gain.linearRampToValueAtTime(volume, start + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(start);
  osc.stop(start + duration);
}

// ── Дыбыс әсерлері ──

// Дұрыс жұп — жағымды көтерілетін аккорд
export function playMatch() {
  tone(523.25, 0.15, "sine", 0.12);       // C5
  tone(659.25, 0.15, "sine", 0.12, 0.05); // E5
  tone(783.99, 0.2, "sine", 0.12, 0.1);   // G5
}

// Қате — жұмсақ төмен дыбыс
export function playWrong() {
  tone(220, 0.15, "triangle", 0.1);
  tone(180, 0.2, "triangle", 0.08, 0.08);
}

// Плитка таңдау — жеңіл "тық"
export function playTap() {
  tone(440, 0.06, "sine", 0.06);
}

// Комбо көбейгенде — жоғарылайтын динь
export function playCombo(level: number) {
  const base = 523.25 + level * 60;
  tone(base, 0.12, "sine", 0.12);
  tone(base * 1.25, 0.15, "sine", 0.1, 0.06);
}

// Деңгей өтті — салтанатты қысқа әуен
export function playLevelUp() {
  const notes = [523.25, 659.25, 783.99, 1046.5]; // C-E-G-C
  notes.forEach((n, i) => tone(n, 0.18, "sine", 0.12, i * 0.08));
}

// Жеңіс — толық салтанатты әуен
export function playWin() {
  const melody = [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5];
  melody.forEach((n, i) => tone(n, 0.2, "sine", 0.13, i * 0.1));
}

// Ойын біту (уақыт бітті) — төмендейтін
export function playGameOver() {
  const notes = [523.25, 440, 349.23, 261.63];
  notes.forEach((n, i) => tone(n, 0.25, "triangle", 0.1, i * 0.12));
}

// Таймер ескерту (соңғы секундтар) — қысқа "бип"
export function playTick() {
  tone(880, 0.05, "square", 0.05);
}
