// filepath: src/lib/micRecorder.ts
// Микрофон жазу — MediaRecorder + нақты дауыс деңгейі (AnalyserNode).
// Speaking модулінде қолданылады: жазу → тыңдау → қайта жазу.

export interface MicRecording {
  url: string;       // ойнатуға дайын object URL
  blob: Blob;        // аудио дерек (транскрипцияға жіберуге)
  mimeType: string;
}

export interface MicRecorder {
  stop: () => Promise<MicRecording | null>; // тоқтатып, жазбаны алу (null — жазба жоқ)
  cancel: () => void;                       // тоқтатып, ештеңе сақтамау
  getLevel: () => number;                   // ағымдағы дауыс деңгейі 0..1
}

export type MicError = "not-allowed" | "no-device" | "not-supported" | "unknown";

export function isMicSupported(): boolean {
  return typeof navigator !== "undefined" && !!navigator.mediaDevices?.getUserMedia && typeof MediaRecorder !== "undefined";
}

// Жазуды бастау. Қате болса MicError лақтырады.
export async function startMicRecording(): Promise<MicRecorder> {
  if (!isMicSupported()) throw "not-supported" as MicError;

  let stream: MediaStream;
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: true, noiseSuppression: true },
    });
  } catch (e: any) {
    const name = e?.name || "";
    if (name === "NotAllowedError" || name === "SecurityError") throw "not-allowed" as MicError;
    if (name === "NotFoundError" || name === "OverconstrainedError") throw "no-device" as MicError;
    throw "unknown" as MicError;
  }

  // Деңгей өлшегіш (нақты амплитуда — жалған анимация емес)
  const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
  let analyser: AnalyserNode | null = null;
  let audioCtx: AudioContext | null = null;
  let dataArray: Uint8Array<ArrayBuffer> | null = null;
  try {
    audioCtx = new AudioCtx();
    const source = audioCtx.createMediaStreamSource(stream);
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;
    source.connect(analyser);
    dataArray = new Uint8Array(new ArrayBuffer(analyser.frequencyBinCount));
  } catch { /* деңгейсіз де жазамыз */ }

  // Жазғыш — қолдайтын форматты таңдау (Safari: mp4, Chrome: webm)
  const mime = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", ""].find(
    (m) => m === "" || MediaRecorder.isTypeSupported(m)
  ) ?? "";
  const recorder = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
  const chunks: Blob[] = [];
  recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };
  recorder.start(1000); // әр секунд сайын бөлік (деректер жоғалмауы үшін)

  const cleanup = () => {
    stream.getTracks().forEach((tr) => tr.stop());
    audioCtx?.close().catch(() => { /* */ });
  };

  return {
    getLevel: () => {
      if (!analyser || !dataArray) return 0;
      analyser.getByteFrequencyData(dataArray);
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
      return Math.min(1, (sum / dataArray.length / 128) * 1.6);
    },
    stop: () =>
      new Promise((resolve) => {
        recorder.onstop = () => {
          cleanup();
          if (chunks.length === 0) { resolve(null); return; }
          const mimeType = mime || "audio/webm";
          const blob = new Blob(chunks, { type: mimeType });
          resolve({ url: URL.createObjectURL(blob), blob, mimeType });
        };
        try { recorder.stop(); } catch { cleanup(); resolve(null); }
      }),
    cancel: () => {
      recorder.onstop = null;
      try { recorder.stop(); } catch { /* */ }
      cleanup();
    },
  };
}
