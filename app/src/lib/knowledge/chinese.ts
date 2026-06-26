// filepath: src/lib/knowledge/chinese.ts
// Қытай тіліне АРНАЙЫ білім базасы.
// Тондар, иероглифтер, пиньинь, HSK, қазақ→қытай тән қателер.

export interface ChinesePoint {
  id: string;
  category: "tones" | "characters" | "grammar" | "pinyin" | "vocabulary";
  topic: string;
  explanation: string;
  howToTeach: string;     // AI-ге: қалай үйрету
  example: string;
  level: "HSK1-2" | "HSK3-4" | "HSK5-6";
}

export const chinesePoints: ChinesePoint[] = [
  // ════════════ ТОНДАР (TONES) — қытай тілінің негізі ════════════
  {
    id: "tones-four",
    category: "tones",
    topic: "The Four Tones (四声)",
    explanation: "Mandarin has 4 tones + neutral. The same syllable means different things with different tones.",
    howToTeach: "Always teach tones from the start. Use the classic example 'ma': mā(妈 mother), má(麻 hemp), mǎ(马 horse), mà(骂 scold). Tone errors change meaning completely.",
    example: "mā (妈, high flat) = mother, but mǎ (马, falling-rising) = horse. Tones are NOT optional!",
    level: "HSK1-2",
  },
  {
    id: "tones-first",
    category: "tones",
    topic: "1st Tone (ˉ high level)",
    explanation: "High and flat, like holding a steady musical note.",
    howToTeach: "Describe it as a flat, high pitch — like singing one steady note. Example: mā (妈).",
    example: "妈 (mā) — keep your voice high and level.",
    level: "HSK1-2",
  },
  {
    id: "tones-second",
    category: "tones",
    topic: "2nd Tone (ˊ rising)",
    explanation: "Rising, like asking 'huh?' or the end of a question in English.",
    howToTeach: "Compare to the rising intonation of a question in English. Example: má (麻).",
    example: "麻 (má) — rise like you're surprised: 'what?'",
    level: "HSK1-2",
  },
  {
    id: "tones-third",
    category: "tones",
    topic: "3rd Tone (ˇ falling-rising)",
    explanation: "Dips down then rises. The hardest tone for learners.",
    howToTeach: "Describe the dip: voice goes down, then up. In fast speech it often just stays low. Example: mǎ (马).",
    example: "马 (mǎ) — dip down then up, like a valley.",
    level: "HSK1-2",
  },
  {
    id: "tones-fourth",
    category: "tones",
    topic: "4th Tone (ˋ falling)",
    explanation: "Sharp falling, like a firm command or 'No!'.",
    howToTeach: "Compare to a strong, decisive statement falling down. Example: mà (骂).",
    example: "骂 (mà) — fall sharply, like saying 'Stop!' firmly.",
    level: "HSK1-2",
  },
  {
    id: "tones-sandhi",
    category: "tones",
    topic: "Tone Sandhi (tone changes)",
    explanation: "When two 3rd tones meet, the first becomes 2nd tone. 你好 nǐ hǎo → ní hǎo.",
    howToTeach: "Explain that tones change in combination. Two 3rd tones: first one rises. Also 不 and 一 change tone depending on what follows.",
    example: "你好 is written nǐ hǎo but pronounced ní hǎo.",
    level: "HSK3-4",
  },

  // ════════════ ИЕРОГЛИФТЕР (CHARACTERS) ════════════
  {
    id: "char-radicals",
    category: "characters",
    topic: "Radicals (部首) — building blocks",
    explanation: "Characters are built from radicals. Many radicals hint at meaning.",
    howToTeach: "Teach common radicals: 氵(water), 木(wood/tree), 口(mouth), 人(person), 心(heart). Recognizing radicals makes learning new characters easier.",
    example: "海 (sea), 河 (river), 湖 (lake) all share 氵 (water radical).",
    level: "HSK1-2",
  },
  {
    id: "char-stroke-order",
    category: "characters",
    topic: "Stroke Order (笔顺)",
    explanation: "Characters are written in a fixed stroke order: top to bottom, left to right.",
    howToTeach: "Emphasize correct stroke order — it helps memory and handwriting. Basic rule: top before bottom, left before right, horizontal before vertical.",
    example: "十 (ten): horizontal stroke first, then vertical.",
    level: "HSK1-2",
  },
  {
    id: "char-components",
    category: "characters",
    topic: "Phonetic-Semantic Compounds",
    explanation: "Most characters = meaning part + sound part. 妈 = 女(woman, meaning) + 马(mǎ, sound).",
    howToTeach: "Show how many characters combine a meaning radical with a sound hint. This makes guessing easier.",
    example: "妈 (mā, mother) = 女 (woman) + 马 (mǎ — gives the sound).",
    level: "HSK3-4",
  },

  // ════════════ ГРАММАТИКА (CHINESE GRAMMAR) ════════════
  {
    id: "cn-no-conjugation",
    category: "grammar",
    topic: "No verb conjugation",
    explanation: "Chinese verbs NEVER change form. No tenses on the verb itself. Time is shown by context/particles.",
    howToTeach: "Reassure learners: no conjugation to memorize! 我吃 (I eat), 他吃 (he eats) — verb stays 吃. Time words and 了 show tense.",
    example: "吃 (eat) is always 吃 — for I, you, he, past, present.",
    level: "HSK1-2",
  },
  {
    id: "cn-le-particle",
    category: "grammar",
    topic: "了 (le) — completed action",
    explanation: "了 marks a completed action or change of state.",
    howToTeach: "Explain 了 shows completion: 我吃了 (I have eaten / I ate). It's not exactly 'past tense' but completion.",
    example: "我买了书 (wǒ mǎi le shū) = I bought a book.",
    level: "HSK1-2",
  },
  {
    id: "cn-measure-words",
    category: "grammar",
    topic: "Measure Words (量词)",
    explanation: "Chinese needs a measure word between number and noun. 一个人 (one + 个 + person).",
    howToTeach: "Teach common measure words: 个 (general), 本 (books), 张 (flat things), 只 (animals). Can't just say 'one person' — need 一个人.",
    example: "三本书 (sān běn shū) = three books (本 is the measure word for books).",
    level: "HSK1-2",
  },
  {
    id: "cn-word-order",
    category: "grammar",
    topic: "Word Order: Time-Place-Manner",
    explanation: "Chinese order: Subject + Time + Place + Manner + Verb + Object. Different from English!",
    howToTeach: "Show that time and place come BEFORE the verb: 我明天在家 (I tomorrow at-home...) then verb.",
    example: "我明天去学校 (wǒ míngtiān qù xuéxiào) = I go to school tomorrow (time before verb).",
    level: "HSK3-4",
  },
  {
    id: "cn-questions-ma",
    category: "grammar",
    topic: "Questions with 吗 (ma)",
    explanation: "Add 吗 to the end of a statement to make a yes/no question. Easy!",
    howToTeach: "Reassure: making questions is simple. Statement + 吗 = question. 你好 → 你好吗?",
    example: "你是学生吗? (nǐ shì xuéshēng ma?) = Are you a student?",
    level: "HSK1-2",
  },

  // ════════════ ПИНЬИНЬ (PINYIN) ════════════
  {
    id: "pinyin-system",
    category: "pinyin",
    topic: "Pinyin — the romanization system",
    explanation: "Pinyin uses the Latin alphabet to show pronunciation, with tone marks.",
    howToTeach: "Pinyin is the bridge for beginners. But some letters sound different: 'c' = 'ts', 'q' = 'ch', 'x' = 'sh', 'zh' = 'j'.",
    example: "谢谢 = xièxie (pronounced 'shyeh-shyeh', not 'kse-kse').",
    level: "HSK1-2",
  },
  {
    id: "pinyin-tricky",
    category: "pinyin",
    topic: "Tricky Pinyin sounds",
    explanation: "Some pinyin letters don't match English intuition.",
    howToTeach: "Highlight: q≈'ch', x≈'sh', c≈'ts', z≈'dz', zh≈'j', r≈soft 'r/zh'. Practice these specifically.",
    example: "中国 = Zhōngguó ('joong-gwor'), not 'zong-guo'.",
    level: "HSK1-2",
  },
];

// Қазақ тілді үйренушіге қытай тілінің артықшылықтары мен қиындықтары
export const chineseForKazakh = {
  advantages: [
    "No verb conjugation — verbs never change (easier than English!)",
    "No articles (a/the) — like Kazakh, Chinese has none",
    "Simple question formation — just add 吗",
    "No grammatical gender",
  ],
  challenges: [
    "Tones — completely new concept, must be learned from day one",
    "Characters — thousands to memorize, no alphabet",
    "Measure words — every noun needs the right one",
    "Word order for time/place differs from both Kazakh and English",
  ],
};

export function chineseByLevel(level: ChinesePoint["level"]) {
  return chinesePoints.filter((c) => c.level === level);
}
