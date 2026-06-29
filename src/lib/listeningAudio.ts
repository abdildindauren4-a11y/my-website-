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

  constructor(lines: AudioLine[], rate = 0.95) {
    this.lines = lines;
    this.rate = rate;
    this.loadVoices();
  }

  private loadVoices() {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    this.voices = window.speechSynthesis.getVoices();
    if (this.voices.length === 0) {
      window.speechSynthesis.onvoiceschanged = () => {
        this.voices = window.speechSynthesis.getVoices();
      };
    }
  }

  // Әр сөйлеушіге бөлек дауыс (диалогты ажырату үшін)
  private pickVoice(speaker?: string): SpeechSynthesisVoice | null {
    const enVoices = this.voices.filter((v) => v.lang.toLowerCase().startsWith("en"));
    if (enVoices.length === 0) return null;
    // Сөйлеушіге қарай дауыс таңдау (тұрақты болу үшін)
    if (speaker) {
      const idx = speaker.charCodeAt(0) % enVoices.length;
      return enVoices[idx];
    }
    return enVoices[0];
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
    if (voice) utterance.voice = voice;
    utterance.lang = "en-US";
    utterance.rate = this.rate;

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
