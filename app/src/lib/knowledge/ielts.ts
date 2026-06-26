// filepath: src/lib/knowledge/ielts.ts
// IELTS емтихан стратегиялары — 4 бөлім бойынша нақты техникалар.

export interface IeltsStrategy {
  id: string;
  section: "speaking" | "writing" | "listening" | "reading" | "general";
  title: string;
  strategy: string;
  tip: string;
  bandFocus: string; // қай балл деңгейіне
}

export const ieltsStrategies: IeltsStrategy[] = [
  // ════ SPEAKING ════
  {
    id: "spk-ptq",
    section: "speaking",
    title: "Part 2 — Cue Card (the 2-minute talk)",
    strategy: "Use the 1-minute prep to note keywords for each bullet point. Structure: intro → details → personal feeling → conclusion.",
    tip: "Don't memorize — use the bullet points as a roadmap. Keep talking for the full 2 minutes.",
    bandFocus: "6.0–7.5",
  },
  {
    id: "spk-extend",
    section: "speaking",
    title: "Extending answers (avoid one-word replies)",
    strategy: "Answer + reason + example. Never just 'yes' or 'no'.",
    tip: "Use 'because', 'for example', 'such as' to naturally extend every answer.",
    bandFocus: "6.0+",
  },
  {
    id: "spk-fillers",
    section: "speaking",
    title: "Natural fillers & fluency",
    strategy: "Use natural thinking phrases instead of silence: 'That's an interesting question', 'Let me think...'",
    tip: "Silence lowers your fluency score. Fillers keep you flowing naturally.",
    bandFocus: "6.5+",
  },
  {
    id: "spk-range",
    section: "speaking",
    title: "Show grammatical range",
    strategy: "Mix tenses, use conditionals ('If I had...'), and relative clauses ('the place where...').",
    tip: "Examiners reward variety. Don't stay in present simple only.",
    bandFocus: "7.0+",
  },
  // ════ WRITING ════
  {
    id: "wrt-task2-structure",
    section: "writing",
    title: "Task 2 — Essay structure",
    strategy: "Intro (paraphrase + thesis) → Body 1 → Body 2 → Conclusion. 4 paragraphs, 250+ words.",
    tip: "Each body paragraph: one main idea + explanation + example.",
    bandFocus: "6.0–7.0",
  },
  {
    id: "wrt-task1-overview",
    section: "writing",
    title: "Task 1 — Always include an overview",
    strategy: "Describe the data with an 'overview' sentence covering the main trends. Don't list every number.",
    tip: "The overview is essential for Band 6+. Highlight the biggest changes.",
    bandFocus: "6.0+",
  },
  {
    id: "wrt-cohesion",
    section: "writing",
    title: "Cohesion & linking",
    strategy: "Use varied linkers: 'Furthermore', 'In contrast', 'Consequently', 'Nevertheless'.",
    tip: "But don't overuse — natural flow matters more than stuffing linkers.",
    bandFocus: "6.5+",
  },
  {
    id: "wrt-paraphrase",
    section: "writing",
    title: "Paraphrasing the question",
    strategy: "Never copy the question word-for-word. Reword it using synonyms in your introduction.",
    tip: "Copying the prompt is penalized. Show vocabulary range by rewording.",
    bandFocus: "6.0+",
  },
  // ════ LISTENING ════
  {
    id: "lst-keywords",
    section: "listening",
    title: "Predict & underline keywords",
    strategy: "Before audio plays, read questions and underline keywords. Predict answer types (number, name, place).",
    tip: "You hear the audio only ONCE. Preparation is everything.",
    bandFocus: "all",
  },
  {
    id: "lst-distractors",
    section: "listening",
    title: "Watch for distractors",
    strategy: "Speakers often correct themselves: 'It's at 9... no, sorry, 9:30'. The answer is the corrected one.",
    tip: "Don't write the first number you hear — listen for changes.",
    bandFocus: "6.0+",
  },
  // ════ READING ════
  {
    id: "rd-skimming",
    section: "reading",
    title: "Skimming for gist",
    strategy: "Read the first and last sentence of each paragraph to grasp the structure quickly.",
    tip: "Don't read every word — you don't have time. Skim first, then scan for details.",
    bandFocus: "all",
  },
  {
    id: "rd-scanning",
    section: "reading",
    title: "Scanning for specific info",
    strategy: "For detail questions, scan for keywords/synonyms from the question in the text.",
    tip: "Answers often use synonyms, not exact words from the question.",
    bandFocus: "6.0+",
  },
  {
    id: "rd-tfng",
    section: "reading",
    title: "True / False / Not Given",
    strategy: "'False' = text contradicts it. 'Not Given' = text doesn't mention it. Don't use outside knowledge.",
    tip: "The trickiest part. If it's not stated AND not contradicted → Not Given.",
    bandFocus: "6.5+",
  },
  // ════ GENERAL ════
  {
    id: "gen-band-vocab",
    section: "general",
    title: "Band-boosting vocabulary",
    strategy: "Replace basic words: 'good' → 'beneficial/positive', 'bad' → 'detrimental', 'big' → 'significant'.",
    tip: "Precise, less common vocabulary lifts your Lexical Resource score.",
    bandFocus: "6.5+",
  },
];

export function ieltsBySection(section: IeltsStrategy["section"]) {
  return ieltsStrategies.filter((s) => s.section === section);
}
