// filepath: src/lib/knowledge/chineseVocab.ts
// HSK негізгі сөздік + айтылым қателері.
// Қазақ тілді үйренушіге қытай мен ағылшын айтылымы.

export interface HskWord {
  hanzi: string;       // иероглиф
  pinyin: string;      // пиньинь (тонмен)
  meaning: string;     // мағынасы
  hskLevel: 1 | 2 | 3;
}

// HSK 1-3 ең жиі қолданылатын сөздер (негізгі)
export const hskVocab: HskWord[] = [
  // HSK 1 — ең негізгі
  { hanzi: "你好", pinyin: "nǐ hǎo", meaning: "hello", hskLevel: 1 },
  { hanzi: "谢谢", pinyin: "xièxie", meaning: "thank you", hskLevel: 1 },
  { hanzi: "我", pinyin: "wǒ", meaning: "I / me", hskLevel: 1 },
  { hanzi: "你", pinyin: "nǐ", meaning: "you", hskLevel: 1 },
  { hanzi: "他", pinyin: "tā", meaning: "he / him", hskLevel: 1 },
  { hanzi: "是", pinyin: "shì", meaning: "to be (am/is/are)", hskLevel: 1 },
  { hanzi: "好", pinyin: "hǎo", meaning: "good", hskLevel: 1 },
  { hanzi: "不", pinyin: "bù", meaning: "no / not", hskLevel: 1 },
  { hanzi: "人", pinyin: "rén", meaning: "person", hskLevel: 1 },
  { hanzi: "大", pinyin: "dà", meaning: "big", hskLevel: 1 },
  { hanzi: "小", pinyin: "xiǎo", meaning: "small", hskLevel: 1 },
  { hanzi: "中国", pinyin: "Zhōngguó", meaning: "China", hskLevel: 1 },
  { hanzi: "吃", pinyin: "chī", meaning: "to eat", hskLevel: 1 },
  { hanzi: "喝", pinyin: "hē", meaning: "to drink", hskLevel: 1 },
  { hanzi: "爱", pinyin: "ài", meaning: "to love", hskLevel: 1 },
  // HSK 2
  { hanzi: "朋友", pinyin: "péngyou", meaning: "friend", hskLevel: 2 },
  { hanzi: "时间", pinyin: "shíjiān", meaning: "time", hskLevel: 2 },
  { hanzi: "学习", pinyin: "xuéxí", meaning: "to study", hskLevel: 2 },
  { hanzi: "工作", pinyin: "gōngzuò", meaning: "work / job", hskLevel: 2 },
  { hanzi: "因为", pinyin: "yīnwèi", meaning: "because", hskLevel: 2 },
  { hanzi: "知道", pinyin: "zhīdào", meaning: "to know", hskLevel: 2 },
  { hanzi: "觉得", pinyin: "juéde", meaning: "to feel / think", hskLevel: 2 },
  // HSK 3
  { hanzi: "经常", pinyin: "jīngcháng", meaning: "often", hskLevel: 3 },
  { hanzi: "重要", pinyin: "zhòngyào", meaning: "important", hskLevel: 3 },
  { hanzi: "决定", pinyin: "juédìng", meaning: "to decide / decision", hskLevel: 3 },
  { hanzi: "经验", pinyin: "jīngyàn", meaning: "experience", hskLevel: 3 },
];

// ════════════ АЙТЫЛЫМ ҚАТЕЛЕРІ (PRONUNCIATION) ════════════
// Қазақ тілді үйренушіге қиын дыбыстар.
export interface PronunciationPoint {
  sound: string;
  language: "English" | "Chinese";
  problem: string;       // неге қиын
  howToFix: string;      // қалай түзету
  example: string;
}

export const pronunciationPoints: PronunciationPoint[] = [
  // ── Ағылшын (қазаққа қиын) ──
  {
    sound: "th (θ/ð)",
    language: "English",
    problem: "Kazakh has no 'th' sound. Learners say 's', 'z', 'f', or 't' instead.",
    howToFix: "Put your tongue between your teeth and blow. 'think' (θ), 'this' (ð).",
    example: "'think' not 'sink', 'three' not 'tree'.",
  },
  {
    sound: "w vs v",
    language: "English",
    problem: "Kazakh learners often confuse 'w' and 'v'.",
    howToFix: "'w' = round lips (no teeth). 'v' = top teeth touch bottom lip.",
    example: "'west' (round lips) vs 'vest' (teeth on lip).",
  },
  {
    sound: "short i vs long ee",
    language: "English",
    problem: "Confusing /ɪ/ (ship) and /iː/ (sheep).",
    howToFix: "/ɪ/ is short and relaxed; /iː/ is long and tense.",
    example: "'ship' (short) vs 'sheep' (long). 'live' vs 'leave'.",
  },
  {
    sound: "word stress",
    language: "English",
    problem: "Putting stress on the wrong syllable.",
    howToFix: "English words have one strong syllable. Learn stress with each word.",
    example: "'PHOtograph' but 'phoTOGraphy' — stress shifts!",
  },
  // ── Қытай (қазаққа қиын) ──
  {
    sound: "tones",
    language: "Chinese",
    problem: "Kazakh is not a tonal language. Tones feel unnatural at first.",
    howToFix: "Practice tones with hand gestures. Always learn the tone WITH the word.",
    example: "mǎi (买 buy, 3rd tone) vs mài (卖 sell, 4th tone) — opposite meanings!",
  },
  {
    sound: "q, x, j",
    language: "Chinese",
    problem: "These have no direct Kazakh/English equivalent.",
    howToFix: "q ≈ 'ch' with smile. x ≈ 'sh' with smile. j ≈ 'j' with smile. Tongue near front teeth.",
    example: "西 (xī, west) ≈ 'shi' with a smile.",
  },
  {
    sound: "zh, ch, sh, r",
    language: "Chinese",
    problem: "Retroflex sounds — tongue curls back. New for Kazakh speakers.",
    howToFix: "Curl your tongue back toward the roof of your mouth.",
    example: "中 (zhōng) — curl tongue back for the 'zh'.",
  },
  {
    sound: "ü (yu)",
    language: "Chinese",
    problem: "The 'ü' sound doesn't exist in Kazakh or English.",
    howToFix: "Say 'ee' then round your lips like 'oo' while keeping the 'ee' tongue position.",
    example: "绿 (lǜ, green) — round lips while saying 'ee'.",
  },
];

export function hskVocabByLevel(level: 1 | 2 | 3) {
  return hskVocab.filter((w) => w.hskLevel === level);
}
export function pronunciationByLang(lang: "English" | "Chinese") {
  return pronunciationPoints.filter((p) => p.language === lang);
}
