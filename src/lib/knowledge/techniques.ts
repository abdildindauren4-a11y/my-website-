// filepath: src/lib/knowledge/techniques.ts
// Үйрену техникалары — сөздік, сөйлеу, тыңдау, жазу бойынша.
// Әрқайсы дәлелденген, нақты қолданумен.

import type { Technique } from "./types";

export const techniques: Technique[] = [
  // ════════ СӨЗДІК (VOCABULARY) ════════
  {
    id: "spaced-repetition",
    name: "Spaced Repetition (SRS)",
    skill: "vocabulary",
    description: "Review words at increasing intervals, just before you forget them.",
    howTo: "Bring back previously learned/mistaken words after 1 day, 3 days, 1 week. If the student used a word before, reinforce it.",
    example: "If they learned 'ally' yesterday, naturally use it again today: 'Is your friend a good ally?'",
    levels: ["beginner", "intermediate", "advanced"],
  },
  {
    id: "word-families",
    name: "Word Families",
    skill: "vocabulary",
    description: "Learn related forms together: noun, verb, adjective, adverb.",
    howTo: "When teaching a word, show its family: 'decide → decision → decisive → decisively'.",
    example: "Teaching 'success': also show 'succeed', 'successful', 'successfully'.",
    levels: ["intermediate", "advanced"],
  },
  {
    id: "mnemonics",
    name: "Mnemonics & Memory Hooks",
    skill: "vocabulary",
    description: "Link new words to vivid images or sound-alikes for memory.",
    howTo: "Create a memorable mental image or sound association for hard words.",
    example: "'Ambitious' — imagine someone 'aiming' big. The 'aim' sound helps recall.",
    levels: ["beginner", "intermediate"],
  },
  {
    id: "collocations",
    name: "Collocations (word partners)",
    skill: "vocabulary",
    description: "Learn which words naturally go together.",
    howTo: "Always teach words with their common partners, not in isolation.",
    example: "'make' goes with 'a decision, a mistake, progress' — not 'do a decision'.",
    levels: ["intermediate", "advanced"],
  },
  {
    id: "context-guessing",
    name: "Guessing from Context",
    skill: "vocabulary",
    description: "Figure out word meaning from surrounding clues instead of translating.",
    howTo: "Encourage guessing meaning from context before giving the translation.",
    example: "'The weather was so frigid we couldn't feel our hands.' — guide them to guess 'frigid' = very cold.",
    levels: ["intermediate", "advanced"],
  },

  // ════════ СӨЙЛЕУ (SPEAKING) ════════
  {
    id: "shadowing",
    name: "Shadowing",
    skill: "speaking",
    description: "Repeat audio immediately, copying rhythm and intonation.",
    howTo: "Suggest repeating sentences right after hearing them, mimicking the melody of English.",
    example: "After a video line, say: 'Try saying it exactly like they did — copy the rhythm.'",
    levels: ["beginner", "intermediate", "advanced"],
  },
  {
    id: "circumlocution",
    name: "Circumlocution (talk around)",
    skill: "speaking",
    description: "Describe a word you don't know using words you DO know.",
    howTo: "When the student doesn't know a word, encourage describing it instead of stopping.",
    example: "Don't know 'umbrella'? Say 'the thing you use when it rains'. Praise this skill!",
    levels: ["beginner", "intermediate"],
  },
  {
    id: "fluency-over-accuracy",
    name: "Fluency-First Speaking",
    skill: "speaking",
    description: "Keep talking without stopping for every error. Build flow.",
    howTo: "In speaking practice, let minor errors go. Praise continuous speech. Correct only afterward.",
    example: "Let them finish their story, THEN gently note one key correction.",
    levels: ["beginner", "intermediate", "advanced"],
  },
  {
    id: "chunking-speech",
    name: "Sentence Frames / Chunks",
    skill: "speaking",
    description: "Use ready-made phrase templates to speak faster.",
    howTo: "Give useful sentence starters: 'In my opinion...', 'I'd say that...', 'The thing is...'",
    example: "Teach 'I'm not sure, but I think...' as a ready tool for expressing uncertainty.",
    levels: ["beginner", "intermediate"],
  },

  // ════════ ТЫҢДАУ (LISTENING) ════════
  {
    id: "top-down-listening",
    name: "Top-Down Listening",
    skill: "listening",
    description: "Use context and prior knowledge to understand the gist first.",
    howTo: "Encourage getting the main idea before worrying about every word.",
    example: "'Don't try to catch every word — what's the general topic? Start there.'",
    levels: ["intermediate", "advanced"],
  },
  {
    id: "bottom-up-listening",
    name: "Bottom-Up Listening",
    skill: "listening",
    description: "Focus on individual sounds, words, and connected speech.",
    howTo: "Help notice how words blend: 'want to' → 'wanna', 'going to' → 'gonna'.",
    example: "Point out: 'Did you' often sounds like 'didja' in natural speech.",
    levels: ["intermediate", "advanced"],
  },
  {
    id: "active-listening",
    name: "Active Listening with Prediction",
    skill: "listening",
    description: "Predict what comes next to stay engaged.",
    howTo: "Ask the student to predict the next word or idea before continuing.",
    example: "'He opened the door and saw...' — what do you think he saw?",
    levels: ["beginner", "intermediate"],
  },

  // ════════ ЖАЗУ (WRITING) ════════
  {
    id: "free-writing",
    name: "Free Writing",
    skill: "writing",
    description: "Write continuously without worrying about mistakes to build fluency.",
    howTo: "Encourage writing freely first, then revise. Don't let perfectionism block output.",
    example: "'Write 3 sentences about your day — don't worry about mistakes yet, just write.'",
    levels: ["beginner", "intermediate"],
  },
  {
    id: "linking-words",
    name: "Cohesion & Linking Words",
    skill: "writing",
    description: "Connect ideas smoothly with linkers.",
    howTo: "Teach connectors: 'however', 'therefore', 'in addition', 'for example'.",
    example: "Show how 'However,' changes the flow vs 'But'.",
    levels: ["intermediate", "advanced"],
  },
];

// Дағды бойынша сүзу
export function techniquesBySkill(skill: Technique["skill"]) {
  return techniques.filter((t) => t.skill === skill);
}
