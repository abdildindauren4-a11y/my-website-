// filepath: src/lib/knowledge/grammar.ts
// Толық ағылшын грамматикасы базасы — деңгеймен, нақты ережелермен.
// AI грамматика түсіндіргенде осыны қолданады.

import type { GrammarPoint } from "./types";

export const grammarPoints: GrammarPoint[] = [
  // ════════════ ШАҚТАР (TENSES) ════════════
  {
    id: "present-simple",
    topic: "Present Simple",
    rule: "Habits, facts, routines. Add -s/-es for he/she/it.",
    commonErrors: ["Forgetting -s for he/she/it", "Using it for actions happening now"],
    correction: "He/she/it needs -s: 'She works'. For 'now', use Present Continuous.",
    example: { wrong: "She work in a bank.", right: "She works in a bank." },
    level: "beginner",
    miniExplanation: "Use for routines and facts. Remember the -s with he/she/it.",
  },
  {
    id: "present-continuous",
    topic: "Present Continuous",
    rule: "Actions happening now or around now. am/is/are + verb-ing.",
    commonErrors: ["Using with state verbs", "Forgetting am/is/are"],
    correction: "Need 'be' + ing: 'I am eating'. Don't use with know/want/like.",
    example: { wrong: "I reading a book now.", right: "I am reading a book now." },
    level: "beginner",
    miniExplanation: "Action happening now = am/is/are + verb-ing.",
  },
  {
    id: "past-simple",
    topic: "Past Simple",
    rule: "Completed actions in the past. Regular: -ed. Irregular: special forms.",
    commonErrors: ["Adding -ed to irregular verbs", "Forgetting to change tense"],
    correction: "Learn irregular forms: go→went, see→saw, buy→bought.",
    example: { wrong: "I buyed a phone yesterday.", right: "I bought a phone yesterday." },
    level: "beginner",
    miniExplanation: "Finished past action. Watch irregular verbs.",
  },
  {
    id: "past-continuous",
    topic: "Past Continuous",
    rule: "Action in progress at a past moment. was/were + verb-ing.",
    commonErrors: ["Confusing with Past Simple"],
    correction: "Use for an action interrupted by another: 'I was sleeping when he called'.",
    example: { wrong: "I slept when the phone rang.", right: "I was sleeping when the phone rang." },
    level: "intermediate",
    miniExplanation: "Was/were + ing — ongoing past action, often interrupted.",
  },
  {
    id: "present-perfect",
    topic: "Present Perfect",
    rule: "Past action with present relevance, or experience. have/has + past participle.",
    commonErrors: ["Using Past Simple with 'since/for/yet/already'", "Confusing with Past Simple"],
    correction: "Use Present Perfect for unfinished time or experience: 'I have lived here for 5 years'.",
    example: { wrong: "I live here since 2020.", right: "I have lived here since 2020." },
    level: "intermediate",
    miniExplanation: "have/has + V3. Connects past to now. Use with since/for/ever/yet.",
  },
  {
    id: "present-perfect-continuous",
    topic: "Present Perfect Continuous",
    rule: "Action started in past, still continuing, emphasis on duration. have/has been + verb-ing.",
    commonErrors: ["Confusing with Present Perfect"],
    correction: "Emphasizes how long: 'I have been studying for 3 hours'.",
    example: { wrong: "I have studied for 3 hours and still continue.", right: "I have been studying for 3 hours." },
    level: "advanced",
    miniExplanation: "have been + ing — duration of an ongoing action.",
  },
  {
    id: "past-perfect",
    topic: "Past Perfect",
    rule: "An action before another past action. had + past participle.",
    commonErrors: ["Using Past Simple for both actions"],
    correction: "The earlier action gets Past Perfect: 'I had eaten before he arrived'.",
    example: { wrong: "When I arrived, he already left.", right: "When I arrived, he had already left." },
    level: "advanced",
    miniExplanation: "had + V3 — the 'past before the past'.",
  },
  {
    id: "future-will",
    topic: "Future: will",
    rule: "Predictions, instant decisions, promises. will + base verb.",
    commonErrors: ["Using will for plans already made"],
    correction: "Use 'will' for spontaneous decisions; 'going to' for plans.",
    example: { wrong: "I will meet my friend, we planned it.", right: "I'm going to meet my friend, we planned it." },
    level: "beginner",
    miniExplanation: "will = prediction/instant decision. going to = plan.",
  },
  {
    id: "future-going-to",
    topic: "Future: going to",
    rule: "Plans and intentions, or evidence-based predictions. am/is/are going to + verb.",
    commonErrors: ["Confusing with will"],
    correction: "Use for decided plans: 'I'm going to study medicine'.",
    example: { wrong: "Look at those clouds, it will rain.", right: "Look at those clouds, it's going to rain." },
    level: "beginner",
    miniExplanation: "going to = intention or evidence-based prediction.",
  },

  // ════════════ ШАРТТЫ СӨЙЛЕМ (CONDITIONALS) ════════════
  {
    id: "zero-conditional",
    topic: "Zero Conditional",
    rule: "General truths. If + present, present.",
    commonErrors: ["Using will in the result"],
    correction: "Both clauses present: 'If you heat water, it boils'.",
    example: { wrong: "If you heat ice, it will melt.", right: "If you heat ice, it melts." },
    level: "intermediate",
    miniExplanation: "If + present, present — always-true facts.",
  },
  {
    id: "first-conditional",
    topic: "First Conditional",
    rule: "Real future possibility. If + present, will + verb.",
    commonErrors: ["Using will in the if-clause"],
    correction: "No 'will' after 'if': 'If it rains, I will stay home'.",
    example: { wrong: "If it will rain, I will stay home.", right: "If it rains, I will stay home." },
    level: "intermediate",
    miniExplanation: "If + present, will + verb — likely future.",
  },
  {
    id: "second-conditional",
    topic: "Second Conditional",
    rule: "Hypothetical/unreal present. If + past, would + verb.",
    commonErrors: ["Using present or will"],
    correction: "Imaginary situation: 'If I won the lottery, I would travel'.",
    example: { wrong: "If I was rich, I will help people.", right: "If I were rich, I would help people." },
    level: "advanced",
    miniExplanation: "If + past, would + verb — imaginary present/future.",
  },
  {
    id: "third-conditional",
    topic: "Third Conditional",
    rule: "Unreal past (regret). If + past perfect, would have + past participle.",
    commonErrors: ["Mixing tenses"],
    correction: "Past regret: 'If I had studied, I would have passed'.",
    example: { wrong: "If I studied harder, I would pass.", right: "If I had studied harder, I would have passed." },
    level: "advanced",
    miniExplanation: "If + had + V3, would have + V3 — impossible past.",
  },

  // ════════════ МОДАЛЬ ЕТІСТІКТЕР (MODALS) ════════════
  {
    id: "modals-ability",
    topic: "Modals: can/could (ability)",
    rule: "can = present ability, could = past ability. + base verb.",
    commonErrors: ["Adding to/-ing after modal"],
    correction: "No 'to' after modals: 'I can swim', not 'I can to swim'.",
    example: { wrong: "I can to speak English.", right: "I can speak English." },
    level: "beginner",
    miniExplanation: "Modal + base verb (no 'to', no -ing).",
  },
  {
    id: "modals-obligation",
    topic: "Modals: must/have to/should",
    rule: "must/have to = obligation, should = advice.",
    commonErrors: ["Confusing must and should"],
    correction: "'must' = strong necessity, 'should' = recommendation.",
    example: { wrong: "You must to see a doctor.", right: "You should see a doctor." },
    level: "intermediate",
    miniExplanation: "must = necessity, should = advice. No 'to' after.",
  },
  {
    id: "modals-possibility",
    topic: "Modals: may/might/could (possibility)",
    rule: "Express possibility or uncertainty.",
    commonErrors: ["Using will for uncertain things"],
    correction: "For 'maybe', use may/might: 'It might rain tomorrow'.",
    example: { wrong: "Maybe it will rain, I'm not sure.", right: "It might rain, I'm not sure." },
    level: "intermediate",
    miniExplanation: "may/might/could = possibility (not certain).",
  },

  // ════════════ ПАССИВ (PASSIVE VOICE) ════════════
  {
    id: "passive-voice",
    topic: "Passive Voice",
    rule: "Focus on the action, not the doer. be + past participle.",
    commonErrors: ["Forgetting 'be'", "Wrong participle"],
    correction: "Need be + V3: 'The book was written by him'.",
    example: { wrong: "The house built in 1990.", right: "The house was built in 1990." },
    level: "advanced",
    miniExplanation: "be + past participle. The object becomes the focus.",
  },

  // ════════════ ARTICLES & QUANTIFIERS ════════════
  {
    id: "articles-basics",
    topic: "Articles (a/an/the)",
    rule: "a/an = one (general), the = specific/known. No article for general plurals.",
    commonErrors: ["Omitting articles", "Overusing 'the'"],
    correction: "Singular countable nouns need an article. (Important — Kazakh has no articles!)",
    example: { wrong: "I saw movie at cinema.", right: "I saw a movie at the cinema." },
    level: "beginner",
    miniExplanation: "a/an = general one, the = specific. Watch singular nouns.",
  },
  {
    id: "countable-uncountable",
    topic: "Countable / Uncountable",
    rule: "Countable: a book, books. Uncountable: water, information (no plural, no 'a').",
    commonErrors: ["Making uncountables plural", "Using 'many' with uncountable"],
    correction: "Use 'much/little' for uncountable, 'many/few' for countable.",
    example: { wrong: "I have many informations.", right: "I have a lot of information." },
    level: "intermediate",
    miniExplanation: "Uncountable nouns: no plural, use much/a lot of.",
  },

  // ════════════ COMPARATIVES ════════════
  {
    id: "comparatives",
    topic: "Comparatives & Superlatives",
    rule: "Short: -er/-est. Long: more/most. Irregular: good→better→best.",
    commonErrors: ["Double comparison (more bigger)", "Wrong form"],
    correction: "Don't combine: 'bigger', not 'more bigger'.",
    example: { wrong: "This is more bigger than that.", right: "This is bigger than that." },
    level: "beginner",
    miniExplanation: "Short words: -er/-est. Long words: more/most. Never both.",
  },

  // ════════════ REPORTED SPEECH ════════════
  {
    id: "reported-speech",
    topic: "Reported Speech",
    rule: "Shift tense back when reporting. 'I am tired' → He said he was tired.",
    commonErrors: ["Not shifting tense", "Keeping direct word order in questions"],
    correction: "Move one tense back: present→past, will→would.",
    example: { wrong: "She said she is busy.", right: "She said she was busy." },
    level: "advanced",
    miniExplanation: "Reporting = shift tense back one step.",
  },

  // ════════════ GERUNDS & INFINITIVES ════════════
  {
    id: "gerund-infinitive",
    topic: "Gerunds & Infinitives",
    rule: "Some verbs take -ing (enjoy, finish), some take to + verb (want, decide).",
    commonErrors: ["Wrong form after specific verbs"],
    correction: "'enjoy doing' (not 'enjoy to do'), 'want to do' (not 'want doing').",
    example: { wrong: "I enjoy to read books.", right: "I enjoy reading books." },
    level: "intermediate",
    miniExplanation: "enjoy/finish + -ing; want/decide + to. Learn which verb takes which.",
  },
];

// Деңгей бойынша сүзу
export function grammarByLevel(level: GrammarPoint["level"]) {
  return grammarPoints.filter((g) => g.level === level);
}
