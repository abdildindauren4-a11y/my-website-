// filepath: src/lib/knowledge/errorPatterns.ts
// Жиі қателер базасы — қазақ тілді үйренушілерге АРНАЙЫ.
// Қазақ тілінен ағылшынға ауысатын типтік қателер (L1 interference).

import type { ErrorPattern } from "./types";

export const errorPatterns: ErrorPattern[] = [
  // ── Артикльдер (қазақ тілінде жоқ — үлкен қиындық) ──
  {
    id: "articles-missing",
    category: "Articles (a/an/the)",
    pattern: "Omitting articles entirely",
    why: "Kazakh has no articles, so learners often skip 'a/an/the' completely.",
    fix: "Remind: singular countable nouns almost always need an article. 'the' for specific, 'a/an' for general.",
    example: { wrong: "I bought car.", right: "I bought a car." },
    forL1Kazakh: true,
  },
  {
    id: "articles-overuse",
    category: "Articles (a/an/the)",
    pattern: "Using 'the' with everything",
    why: "Overcorrection after learning articles exist.",
    fix: "Explain: don't use 'the' with general plurals or uncountable nouns. 'I like the music' → 'I like music'.",
    example: { wrong: "The life is hard.", right: "Life is hard." },
    forL1Kazakh: true,
  },
  // ── Сөз тәртібі (қазақ SOV, ағылшын SVO) ──
  {
    id: "word-order-sov",
    category: "Word Order",
    pattern: "Putting the verb at the end (SOV instead of SVO)",
    why: "Kazakh uses Subject-Object-Verb. English uses Subject-Verb-Object.",
    fix: "Remind: in English, the verb comes right after the subject. 'I apples eat' → 'I eat apples'.",
    example: { wrong: "I English study.", right: "I study English." },
    forL1Kazakh: true,
  },
  {
    id: "adjective-order",
    category: "Word Order",
    pattern: "Adjective after noun",
    why: "Some languages place adjectives after nouns.",
    fix: "In English, adjectives go BEFORE the noun: 'a red car', not 'a car red'.",
    example: { wrong: "a house big", right: "a big house" },
  },
  // ── Етістік шақтары ──
  {
    id: "past-simple-irregular",
    category: "Verb Tense",
    pattern: "Adding -ed to irregular verbs",
    why: "Learners apply the regular rule to irregular verbs.",
    fix: "Remind the irregular form. 'goed' → 'went', 'buyed' → 'bought'.",
    example: { wrong: "I goed home.", right: "I went home." },
  },
  {
    id: "present-continuous-state",
    category: "Verb Tense",
    pattern: "Using continuous with state verbs",
    why: "Overapplying the -ing form to verbs like 'know', 'want', 'like'.",
    fix: "State verbs (know, want, like, understand) don't usually take -ing.",
    example: { wrong: "I am knowing the answer.", right: "I know the answer." },
  },
  {
    id: "tense-no-marking",
    category: "Verb Tense",
    pattern: "Not changing the verb for past time",
    why: "Kazakh marks tense differently; learners forget to change the English verb.",
    fix: "When talking about the past, the verb MUST change: 'go' → 'went'.",
    example: { wrong: "Yesterday I go to school.", right: "Yesterday I went to school." },
    forL1Kazakh: true,
  },
  // ── Предлогтар ──
  {
    id: "prepositions-in-on-at",
    category: "Prepositions",
    pattern: "Confusing in/on/at for time and place",
    why: "Prepositions rarely map 1-to-1 between languages.",
    fix: "Time: 'at' (hour), 'on' (day), 'in' (month/year). Teach as fixed chunks.",
    example: { wrong: "I will meet you in Monday.", right: "I will meet you on Monday." },
  },
  // ── Көптік жалғау ──
  {
    id: "plural-uncountable",
    category: "Plurals",
    pattern: "Making uncountable nouns plural",
    why: "Words like 'information', 'advice', 'money' are uncountable in English.",
    fix: "These have no plural: 'informations' → 'information', 'advices' → 'advice'.",
    example: { wrong: "I need some advices.", right: "I need some advice." },
  },
  {
    id: "plural-after-number",
    category: "Plurals",
    pattern: "No plural after numbers",
    why: "Kazakh doesn't always pluralize after numbers.",
    fix: "After numbers > 1, English nouns are plural: 'three book' → 'three books'.",
    example: { wrong: "I have two cat.", right: "I have two cats." },
    forL1Kazakh: true,
  },
  // ── Сұрақ құру ──
  {
    id: "question-no-auxiliary",
    category: "Questions",
    pattern: "Forming questions without auxiliary 'do/does'",
    why: "Many languages form questions by intonation only.",
    fix: "English needs 'do/does/did' for questions: 'You like coffee?' → 'Do you like coffee?'",
    example: { wrong: "You like tea?", right: "Do you like tea?" },
    forL1Kazakh: true,
  },
  // ── Жіктеу есімдіктері ──
  {
    id: "pronoun-gender",
    category: "Pronouns",
    pattern: "Confusing he/she (no gender in Kazakh pronouns)",
    why: "Kazakh 'ол' covers he, she, and it. English distinguishes gender.",
    fix: "Remember: 'he' for male, 'she' for female, 'it' for things.",
    example: { wrong: "My sister, he is a doctor.", right: "My sister, she is a doctor." },
    forL1Kazakh: true,
  },
  // ── Болымсыздық ──
  {
    id: "double-negative",
    category: "Negation",
    pattern: "Double negatives",
    why: "Some languages use double negation for emphasis.",
    fix: "English uses ONE negative: 'I don't know nothing' → 'I don't know anything'.",
    example: { wrong: "I don't have no money.", right: "I don't have any money." },
  },
  // ── Көмекші етістік 'to be' ──
  {
    id: "missing-be",
    category: "Verb 'to be'",
    pattern: "Omitting 'am/is/are'",
    why: "Kazakh doesn't always need a linking verb in present tense.",
    fix: "English needs 'am/is/are': 'I happy' → 'I am happy', 'She tired' → 'She is tired'.",
    example: { wrong: "I student.", right: "I am a student." },
    forL1Kazakh: true,
  },
];

// Қазақ тіліне тән қателерді бөліп алу
export const kazakhSpecificErrors = errorPatterns.filter((e) => e.forL1Kazakh);
