// filepath: src/components/cinema/SubtitleUpload.tsx
// .srt/.vtt субтитр файлын жүктеу.
// YouTube Studio-дан жүктелген субтитрді оқып, видеоға қосады.

import { useState, useRef } from "react";
import { useLang } from "@/contexts/LangContext";
import { parseSubtitleFile } from "@/lib/srtParser";
import { Upload, Check, FileText, AlertCircle } from "lucide-react";
import type { SubtitleLine } from "@/types/cinema";

interface Props {
  onLoaded: (subtitles: Omit<SubtitleLine, "kk">[]) => void;
}

export default function SubtitleUpload({ onLoaded }: Props) {
  const { t } = useLang();
  const inputRef = useRef<HTMLInputElement>(null);
  const [loadedCount, setLoadedCount] = useState<number | null>(null);
  const [error, setError] = useState(false);

  const handleFile = async (file: File) => {
    setError(false);
    try {
      const text = await file.text();
      const subtitles = parseSubtitleFile(text, file.name);
      if (subtitles.length === 0) {
        setError(true);
        return;
      }
      setLoadedCount(subtitles.length);
      onLoaded(subtitles);
    } catch {
      setError(true);
    }
  };

  return (
    <div className="card p-4">
      <input
        ref={inputRef}
        type="file"
        accept=".srt,.vtt,text/plain"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />

      {loadedCount !== null ? (
        // Жүктелді
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-card bg-accent-green/15 flex items-center justify-center shrink-0">
            <Check className="w-5 h-5 text-accent-green" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-sm">{t("sub.uploaded")}</p>
            <p className="text-xs text-text-secondary">{loadedCount} {t("sub.lines")}</p>
          </div>
          <button
            onClick={() => inputRef.current?.click()}
            className="text-xs text-accent-blue hover:underline"
          >
            {t("sub.upload")}
          </button>
        </div>
      ) : (
        // Жүктеу
        <button
          onClick={() => inputRef.current?.click()}
          className="w-full flex items-center gap-3 text-left"
        >
          <div className="w-10 h-10 rounded-card bg-accent-blue/15 flex items-center justify-center shrink-0">
            <Upload className="w-5 h-5 text-accent-blue" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-sm">{t("sub.upload")}</p>
            <p className="text-xs text-text-secondary">{t("sub.uploadHint")}</p>
          </div>
          <FileText className="w-5 h-5 text-text-muted shrink-0" />
        </button>
      )}

      {error && (
        <div className="flex items-center gap-2 mt-3 p-2 rounded-card bg-accent-red/10 text-accent-red text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{t("sub.uploadError")}</span>
        </div>
      )}
    </div>
  );
}
