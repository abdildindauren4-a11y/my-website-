// filepath: src/lib/knowledge/phrasalVerbs.ts
// Фразалық етістіктер мен сөз тіркестері (collocations).
// Ағылшынның ең қиын, бірақ ең маңызды бөлігі — native сияқты сөйлеу үшін.

export interface PhrasalVerb {
  verb: string;          // фразалық етістік
  meaning: string;       // мағынасы
  example: string;       // мысал сөйлем
  level: "beginner" | "intermediate" | "advanced";
}

export const phrasalVerbs: PhrasalVerb[] = [
  // ── Күнделікті (жиі) ──
  { verb: "get up", meaning: "rise from bed", example: "I get up at 7 every morning.", level: "beginner" },
  { verb: "wake up", meaning: "stop sleeping", example: "I woke up early today.", level: "beginner" },
  { verb: "turn on/off", meaning: "start/stop a device", example: "Turn off the lights, please.", level: "beginner" },
  { verb: "put on", meaning: "dress yourself", example: "Put on your jacket, it's cold.", level: "beginner" },
  { verb: "look for", meaning: "search", example: "I'm looking for my keys.", level: "beginner" },
  { verb: "find out", meaning: "discover information", example: "I found out the truth.", level: "intermediate" },
  { verb: "give up", meaning: "stop trying / quit", example: "Don't give up on your dreams.", level: "intermediate" },
  { verb: "look forward to", meaning: "be excited about a future event", example: "I look forward to seeing you.", level: "intermediate" },
  { verb: "come up with", meaning: "think of an idea", example: "She came up with a great plan.", level: "intermediate" },
  { verb: "carry out", meaning: "perform / complete a task", example: "They carried out the experiment.", level: "advanced" },
  { verb: "point out", meaning: "draw attention to", example: "He pointed out my mistake.", level: "intermediate" },
  { verb: "figure out", meaning: "understand / solve", example: "I can't figure out this problem.", level: "intermediate" },
  { verb: "bring up", meaning: "1) raise a topic 2) raise a child", example: "She brought up an important issue.", level: "intermediate" },
  { verb: "turn out", meaning: "result / end up being", example: "It turned out to be true.", level: "advanced" },
  { verb: "put off", meaning: "postpone / delay", example: "Don't put off your homework.", level: "intermediate" },
  { verb: "run out of", meaning: "have no more left", example: "We ran out of milk.", level: "intermediate" },
  { verb: "get along with", meaning: "have a good relationship", example: "I get along with my coworkers.", level: "intermediate" },
  { verb: "take care of", meaning: "look after", example: "She takes care of her grandmother.", level: "beginner" },
  { verb: "set up", meaning: "establish / arrange", example: "They set up a new company.", level: "intermediate" },
  { verb: "deal with", meaning: "handle / manage", example: "I'll deal with this problem.", level: "intermediate" },
  { verb: "break down", meaning: "stop working / collapse", example: "My car broke down.", level: "intermediate" },
  { verb: "work out", meaning: "1) exercise 2) solve / succeed", example: "Everything worked out fine.", level: "intermediate" },
  { verb: "come across", meaning: "find by chance", example: "I came across an old photo.", level: "advanced" },
  { verb: "look after", meaning: "take care of", example: "Can you look after my dog?", level: "intermediate" },
  { verb: "go through", meaning: "experience (often difficult)", example: "She went through a hard time.", level: "advanced" },
];

// ════════════ СӨЗ ТІРКЕСТЕРІ (COLLOCATIONS) ════════════
// Native сияқты сөйлеу үшін — қай сөздер бірге жүреді.
export interface Collocation {
  base: string;        // негізгі сөз (make, do, take...)
  combinations: string[]; // дұрыс тіркестер
  commonError: string;    // жиі қате
}

export const collocations: Collocation[] = [
  {
    base: "make",
    combinations: ["make a decision", "make a mistake", "make progress", "make an effort", "make money", "make friends", "make sense", "make a difference"],
    commonError: "'do a decision' is WRONG → 'make a decision'",
  },
  {
    base: "do",
    combinations: ["do homework", "do exercise", "do the dishes", "do business", "do research", "do your best", "do a favor", "do harm"],
    commonError: "'make homework' is WRONG → 'do homework'",
  },
  {
    base: "take",
    combinations: ["take a break", "take a photo", "take a shower", "take care", "take time", "take place", "take a risk", "take notes"],
    commonError: "'make a photo' is WRONG → 'take a photo'",
  },
  {
    base: "have",
    combinations: ["have breakfast", "have fun", "have a problem", "have a chance", "have an idea", "have a rest", "have a conversation"],
    commonError: "'make breakfast' (cooking) vs 'have breakfast' (eating) — different!",
  },
  {
    base: "get",
    combinations: ["get married", "get ready", "get angry", "get lost", "get a job", "get better", "get in touch"],
    commonError: "'become married' is WRONG → 'get married'",
  },
  {
    base: "pay",
    combinations: ["pay attention", "pay a visit", "pay the bill", "pay respect", "pay a compliment"],
    commonError: "'give attention' is less natural → 'pay attention'",
  },
  {
    base: "strong/heavy",
    combinations: ["strong coffee", "strong accent", "heavy rain", "heavy traffic", "strong argument"],
    commonError: "'big rain' is WRONG → 'heavy rain'",
  },
];

export function phrasalsByLevel(level: PhrasalVerb["level"]) {
  return phrasalVerbs.filter((p) => p.level === level);
}
