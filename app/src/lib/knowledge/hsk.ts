// filepath: src/lib/knowledge/hsk.ts
// HSK (汉语水平考试) емтихан стратегиялары + сұхбат сценарийлері.

export interface HskStrategy {
  id: string;
  level: "HSK1-2" | "HSK3-4" | "HSK5-6";
  section: "listening" | "reading" | "writing" | "general";
  title: string;
  strategy: string;
  tip: string;
}

export const hskStrategies: HskStrategy[] = [
  {
    id: "hsk-vocab-foundation",
    level: "HSK1-2",
    section: "general",
    title: "Vocabulary foundation",
    strategy: "HSK1 = 150 words, HSK2 = 300 words. Master these core words completely before moving up.",
    tip: "Focus on high-frequency words first. Learn each word with its character, pinyin, AND tone.",
  },
  {
    id: "hsk-listening-numbers",
    level: "HSK1-2",
    section: "listening",
    title: "Listening: numbers & times",
    strategy: "Many HSK listening questions involve numbers, dates, and times. Practice these until automatic.",
    tip: "Drill numbers 1-100 and time expressions until you recognize them instantly.",
  },
  {
    id: "hsk-reading-characters",
    level: "HSK3-4",
    section: "reading",
    title: "Reading: recognize, don't translate",
    strategy: "Build the ability to recognize characters by sight, not translate each one.",
    tip: "Read short texts repeatedly. Recognition speed is key for the timed reading section.",
  },
  {
    id: "hsk-writing-order",
    level: "HSK3-4",
    section: "writing",
    title: "Writing: word order tasks",
    strategy: "HSK3+ has 'arrange the words' tasks. Master the Subject-Time-Place-Verb-Object pattern.",
    tip: "Remember: time and place come before the verb in Chinese.",
  },
  {
    id: "hsk-grammar-patterns",
    level: "HSK3-4",
    section: "general",
    title: "Key grammar patterns",
    strategy: "Master core patterns: 把 (bǎ) sentences, 被 (bèi) passive, 比 (bǐ) comparisons, 的/得/地.",
    tip: "These appear constantly. The three 'de' (的/得/地) confuse learners — study them carefully.",
  },
  {
    id: "hsk-advanced-idioms",
    level: "HSK5-6",
    section: "general",
    title: "Idioms (成语) and formal language",
    strategy: "HSK5-6 requires chengyu (4-character idioms) and formal/written vocabulary.",
    tip: "Learn common 成语 with their stories — the story makes them memorable.",
  },
  {
    id: "hsk-reading-speed",
    level: "HSK5-6",
    section: "reading",
    title: "Reading speed & inference",
    strategy: "Long passages require fast reading and inferring meaning from context.",
    tip: "Practice skimming for main ideas, then scanning for specific details.",
  },
];

// ════════════ СҰХБАТ СЦЕНАРИЙЛЕРІ (нақты өмірлік жағдайлар) ════════════
// AI осы тақырыптарды сұхбат практикасы үшін қолданады.
export interface ConversationScenario {
  id: string;
  topic: string;
  situation: string;
  usefulPhrases: string[];
  level: "beginner" | "intermediate" | "advanced";
}

export const conversationScenarios: ConversationScenario[] = [
  {
    id: "introductions",
    topic: "Introductions & Small Talk",
    situation: "Meeting someone new, exchanging basic information.",
    usefulPhrases: ["Nice to meet you", "What do you do?", "Where are you from?", "How long have you...?"],
    level: "beginner",
  },
  {
    id: "restaurant",
    topic: "At a Restaurant",
    situation: "Ordering food, asking about the menu, paying.",
    usefulPhrases: ["I'd like...", "Could I have the menu?", "What do you recommend?", "Can I get the bill?"],
    level: "beginner",
  },
  {
    id: "directions",
    topic: "Asking for Directions",
    situation: "Getting lost, asking how to reach a place.",
    usefulPhrases: ["How do I get to...?", "Is it far?", "Turn left/right", "Go straight"],
    level: "beginner",
  },
  {
    id: "shopping",
    topic: "Shopping",
    situation: "Buying things, asking prices, sizes, returns.",
    usefulPhrases: ["How much is this?", "Do you have it in...?", "Can I try it on?", "I'll take it"],
    level: "beginner",
  },
  {
    id: "opinions",
    topic: "Giving Opinions",
    situation: "Discussing topics, agreeing and disagreeing.",
    usefulPhrases: ["In my opinion...", "I see your point, but...", "I completely agree", "I'm not so sure about..."],
    level: "intermediate",
  },
  {
    id: "job-interview",
    topic: "Job Interview",
    situation: "Talking about experience, strengths, career goals.",
    usefulPhrases: ["My strengths are...", "I have experience in...", "I'm passionate about...", "Where do you see..."],
    level: "advanced",
  },
  {
    id: "abstract-debate",
    topic: "Debating Abstract Topics",
    situation: "Discussing complex issues: technology, environment, society.",
    usefulPhrases: ["On the one hand...", "It could be argued that...", "The main issue is...", "This raises the question of..."],
    level: "advanced",
  },
];

export function hskByLevel(level: HskStrategy["level"]) {
  return hskStrategies.filter((h) => h.level === level);
}
export function scenariosByLevel(level: ConversationScenario["level"]) {
  return conversationScenarios.filter((s) => s.level === level);
}
