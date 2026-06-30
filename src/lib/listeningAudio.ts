// filepath: src/lib/listeningAudio.ts
// Listening аудио ойнатқыш — TTS негізінде.
// Транскрипт жолдарын кезекпен оқиды (диалог/монолог), кідірістермен.

import type { AudioLine } from "@/types/ielts";

export interface AudioPlayerState {
  playing: boolean;
  currentLine: number;   // қай жол оқылып жатыр
  totalLines: number;
  finished: boolean;
}

type StateListener = (state: AudioPlayerState) => void;

export class ListeningPlayer {
  private lines: AudioLine[];
  private currentLine = 0;
  private playing = false;
  private finished = false;
  private rate: number;
  private listeners: StateListener[] = [];
  private timeoutId: number | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private goodVoices: SpeechSynthesisVoice[] = [];
  private speakerVoice: Record<string, SpeechSynthesisVoice> = {};
  private preferredVoiceName: string | null = null;

  constructor(lines: AudioLine[], rate = 0.95) {
    this.lines = lines;
    this.rate = rate;
    this.loadVoices();
  }

  private loadVoices() {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    this.voices = window.speechSynthesis.getVoices();
    this.rankVoices();
    if (this.voices.length === 0) {
      window.speechSynthesis.onvoiceschanged = () => {
        this.voices = window.speechSynthesis.getVoices();
        this.rankVoices();
      };
    }
  }

  // Ең сапалы ағылшын дауыстарын реттеу (новелти/жасанды дауыстарды шығарып тастау)
  private rankVoices() {
    const en = this.voices.filter((v) => v.lang.toLowerCase().startsWith("en"));
    // Жағымсыз/новелти дауыстар (macOS/Windows) — болдырмау
    const bad = /albert|bad news|bahh|bells|boing|bubbles|cellos|wobble|jester|organ|trinoids|whisper|zarvox|superstar|junior|ralph|fred|kathy|deranged|hysterical|pipe|good news|grandma|grandpa|eddy|flo|reed|rocko|sandy|shelley|googoo|novelty/i;
    // Сапалы дауыстар — басымдық реті жоғары
    const preferred = [
      "google us english", "google uk english female", "google uk english male",
      "microsoft aria", "microsoft jenny", "microsoft guy", "microsoft michelle",
      "samantha", "daniel", "karen", "moira", "tessa", "serena", "aaron", "nicky", "alex",
    ];
    const score = (v: SpeechSynthesisVoice): number => {
      const n = v.name.toLowerCase();
      if (bad.test(n)) return -100;
      const pi = preferred.findIndex((p) => n.includes(p));
      let s = pi >= 0 ? 100 - pi : 0;
      if (n.includes("natural") || n.includes("online")) s += 30; // нейрондық дауыстар
      if (n.includes("google")) s += 20;
      if (!v.localService) s += 5; // онлайн дауыстар әдетте табиғи
      return s;
    };
    this.goodVoices = en
      .map((v) => ({ v, s: score(v) }))
      .filter((x) => x.s > -50)
      .sort((a, b) => b.s - a.s)
      .map((x) => x.v);
    // Сөйлеуші → дауыс тағайындауды жаңарту
    this.speakerVoice = {};
  }

  // Қолжетімді сапалы дауыстар тізімі (UI таңдағышы үшін)
  getVoiceList(): { name: string; lang: string }[] {
    const pool = this.goodVoices.length ? this.goodVoices : this.voices.filter((v) => v.lang.toLowerCase().startsWith("en"));
    return pool.map((v) => ({ name: v.name, lang: v.lang }));
  }

  // Қолданушы таңдаған дауысты бекіту (барлық жолға қолданылады)
  setPreferredVoice(name: string | null) {
    this.preferredVoiceName = name;
    this.speakerVoice = {};
  }

  // Әр сөйлеушіге тұрақты, сапалы дауыс (диалогты ажырату үшін кезек-кезек)
  private pickVoice(speaker?: string): SpeechSynthesisVoice | null {
    // Қолданушы дауыс таңдаса — бәріне сол қолданылады
    if (this.preferredVoiceName) {
      const v = this.voices.find((x) => x.name === this.preferredVoiceName);
      if (v) return v;
    }
    const pool = this.goodVoices.length ? this.goodVoices : this.voices.filter((v) => v.lang.toLowerCase().startsWith("en"));
    if (pool.length === 0) return null;
    const key = speaker || "__narrator__";
    if (!this.speakerVoice[key]) {
      // Жаңа сөйлеушіге келесі бос дауысты беру (қайталамауға тырысу)
      const used = Object.values(this.speakerVoice);
      const free = pool.find((v) => !used.includes(v));
      this.speakerVoice[key] = free || pool[Object.keys(this.speakerVoice).length % pool.length];
    }
    return this.speakerVoice[key];
  }

  subscribe(listener: StateListener) {
    this.listeners.push(listener);
    listener(this.getState());
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private emit() {
    const state = this.getState();
    this.listeners.forEach((l) => l(state));
  }

  getState(): AudioPlayerState {
    return {
      playing: this.playing,
      currentLine: this.currentLine,
      totalLines: this.lines.length,
      finished: this.finished,
    };
  }

  play() {
    if (this.finished) {
      this.currentLine = 0;
      this.finished = false;
    }
    this.playing = true;
    this.emit();
    this.speakCurrentLine();
  }

  pause() {
    this.playing = false;
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    this.emit();
  }

  restart() {
    this.pause();
    this.currentLine = 0;
    this.finished = false;
    this.emit();
  }

  setRate(rate: number) {
    this.rate = rate;
  }

  private speakCurrentLine() {
    if (!this.playing || this.currentLine >= this.lines.length) {
      if (this.currentLine >= this.lines.length) {
        this.playing = false;
        this.finished = true;
        this.emit();
      }
      return;
    }

    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    const line = this.lines[this.currentLine];
    const utterance = new SpeechSynthesisUtterance(line.text);
    const voice = this.pickVoice(line.speaker);
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang; // дауыстың өз тіліне сай (артикуляция дұрыс)
    } else {
      utterance.lang = "en-US";
    }
    utterance.rate = this.rate;
    utterance.pitch = 1.0;   // табиғи биіктік (жасанды/жоғары емес)
    utterance.volume = 1.0;

    utterance.onend = () => {
      if (!this.playing) return;
      // Кідіріс (сөйлемдер арасы)
      const pause = (line.pauseAfter ?? 0.6) * 1000;
      this.timeoutId = window.setTimeout(() => {
        this.currentLine++;
        this.emit();
        this.speakCurrentLine();
      }, pause);
    };

    window.speechSynthesis.speak(utterance);
    this.emit();
  }

  destroy() {
    this.pause();
    this.listeners = [];
  }
}
