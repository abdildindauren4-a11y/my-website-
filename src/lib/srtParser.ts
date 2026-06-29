// filepath: src/lib/srtParser.ts
// SRT субтитр файлын оқу (parse).
// YouTube Studio-дан жүктелген .srt файлдарын біздің форматқа айналдырады.
//
// SRT форматы:
//   1
//   00:00:05,000 --> 00:00:08,000
//   The mind can be a powerful ally.
//
//   2
//   00:00:08,500 --> 00:00:12,000
//   ...

import type { SubtitleLine } from "@/types/cinema";

// "00:00:05,000" → секунд (5.0)
function timeToSeconds(time: string): number {
  // Формат: HH:MM:SS,mmm немесе HH:MM:SS.mmm
  const cleaned = time.trim().replace(",", ".");
  const parts = cleaned.split(":");
  if (parts.length !== 3) return 0;
  const hours = parseFloat(parts[0]) || 0;
  const minutes = parseFloat(parts[1]) || 0;
  const seconds = parseFloat(parts[2]) || 0;
  return hours * 3600 + minutes * 60 + seconds;
}

// HTML тегтерін тазалау (кейде <i>, <b> болады)
function stripTags(text: string): string {
  return text.replace(/<[^>]*>/g, "").trim();
}

// SRT мәтінін парс жасау
export function parseSRT(srtContent: string): Omit<SubtitleLine, "kk">[] {
  const lines: Omit<SubtitleLine, "kk">[] = [];

  // Блоктарға бөлу (бос жолмен ажыратылады)
  const blocks = srtContent.trim().split(/\n\s*\n/);

  for (const block of blocks) {
    const blockLines = block.trim().split("\n");
    if (blockLines.length < 2) continue;

    // 1-жол: нөмір (елемейміз)
    // 2-жол: уақыт (00:00:05,000 --> 00:00:08,000)
    // 3+: мәтін
    let timeLineIndex = 0;
    // Нөмір жолын аттап өту
    if (/^\d+$/.test(blockLines[0].trim())) {
      timeLineIndex = 1;
    }

    const timeLine = blockLines[timeLineIndex];
    const timeMatch = timeLine.match(/(\d{1,2}:\d{2}:\d{2}[,.]\d{1,3})\s*-->\s*(\d{1,2}:\d{2}:\d{2}[,.]\d{1,3})/);
    if (!timeMatch) continue;

    const start = timeToSeconds(timeMatch[1]);
    const end = timeToSeconds(timeMatch[2]);

    // Мәтін жолдары (уақыттан кейінгі бәрі)
    const textLines = blockLines.slice(timeLineIndex + 1);
    const text = stripTags(textLines.join(" "));
    if (!text) continue;

    lines.push({
      id: `srt-${lines.length}`,
      start,
      end,
      en: text,
    });
  }

  return lines;
}

// VTT форматын да қолдау (YouTube кейде .vtt береді)
// WEBVTT тақырыбын алып тастап, SRT сияқты парс жасаймыз
export function parseVTT(vttContent: string): Omit<SubtitleLine, "kk">[] {
  // WEBVTT тақырыбын және метадеректі алып тастау
  let content = vttContent.replace(/^WEBVTT.*?\n/s, "");
  // VTT уақыт форматы SRT-ге ұқсас, бірақ нүктемен (00:00:05.000)
  return parseSRT(content);
}

// Файл кеңейтіміне қарай автоматты таңдау
export function parseSubtitleFile(content: string, filename: string): Omit<SubtitleLine, "kk">[] {
  if (filename.toLowerCase().endsWith(".vtt") || content.trim().startsWith("WEBVTT")) {
    return parseVTT(content);
  }
  return parseSRT(content);
}
