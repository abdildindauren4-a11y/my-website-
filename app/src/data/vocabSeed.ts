// filepath: src/data/vocabSeed.ts
// Бастапқы сөздік қоры — қолданушы бірден қолдана алады.
// Тақырыптарға бөлінген, екі тілде, қазақша аудармасымен.

import type { LearnLang } from "@/types/vocabulary";

export interface SeedWord {
  lang: LearnLang;
  term: string;
  phonetic?: string;
  translation: string;
  partOfSpeech?: string;
  example?: string;
  tags: string[];
}

// ════════════════════════════════════════════
// АҒЫЛШЫН ТІЛІ
// ════════════════════════════════════════════
const english: SeedWord[] = [
  // ── Жиі етістіктер ──
  { lang: "en", term: "be", phonetic: "/biː/", translation: "болу", partOfSpeech: "verb", example: "I want to be a doctor.", tags: ["verbs", "essential"] },
  { lang: "en", term: "have", phonetic: "/hæv/", translation: "ие болу", partOfSpeech: "verb", example: "I have a question.", tags: ["verbs", "essential"] },
  { lang: "en", term: "do", phonetic: "/duː/", translation: "істеу", partOfSpeech: "verb", example: "What do you do?", tags: ["verbs", "essential"] },
  { lang: "en", term: "say", phonetic: "/seɪ/", translation: "айту", partOfSpeech: "verb", example: "What did you say?", tags: ["verbs", "essential"] },
  { lang: "en", term: "go", phonetic: "/ɡoʊ/", translation: "бару", partOfSpeech: "verb", example: "Let's go home.", tags: ["verbs", "essential"] },
  { lang: "en", term: "get", phonetic: "/ɡet/", translation: "алу", partOfSpeech: "verb", example: "I need to get some sleep.", tags: ["verbs", "essential"] },
  { lang: "en", term: "make", phonetic: "/meɪk/", translation: "жасау", partOfSpeech: "verb", example: "Make a decision.", tags: ["verbs", "essential"] },
  { lang: "en", term: "know", phonetic: "/noʊ/", translation: "білу", partOfSpeech: "verb", example: "I know the answer.", tags: ["verbs", "essential"] },
  { lang: "en", term: "think", phonetic: "/θɪŋk/", translation: "ойлау", partOfSpeech: "verb", example: "I think you're right.", tags: ["verbs", "essential"] },
  { lang: "en", term: "take", phonetic: "/teɪk/", translation: "алу", partOfSpeech: "verb", example: "Take your time.", tags: ["verbs", "essential"] },
  { lang: "en", term: "see", phonetic: "/siː/", translation: "көру", partOfSpeech: "verb", example: "I see what you mean.", tags: ["verbs", "essential"] },
  { lang: "en", term: "come", phonetic: "/kʌm/", translation: "келу", partOfSpeech: "verb", example: "Come here, please.", tags: ["verbs", "essential"] },
  { lang: "en", term: "want", phonetic: "/wɒnt/", translation: "қалау", partOfSpeech: "verb", example: "I want to learn.", tags: ["verbs", "essential"] },
  { lang: "en", term: "use", phonetic: "/juːz/", translation: "қолдану", partOfSpeech: "verb", example: "Use this tool.", tags: ["verbs", "essential"] },
  { lang: "en", term: "find", phonetic: "/faɪnd/", translation: "табу", partOfSpeech: "verb", example: "I can't find my keys.", tags: ["verbs", "essential"] },

  // ── Уақыт ──
  { lang: "en", term: "time", phonetic: "/taɪm/", translation: "уақыт", partOfSpeech: "noun", example: "What time is it?", tags: ["time", "essential"] },
  { lang: "en", term: "day", phonetic: "/deɪ/", translation: "күн", partOfSpeech: "noun", example: "Have a nice day.", tags: ["time"] },
  { lang: "en", term: "week", phonetic: "/wiːk/", translation: "апта", partOfSpeech: "noun", example: "See you next week.", tags: ["time"] },
  { lang: "en", term: "month", phonetic: "/mʌnθ/", translation: "ай", partOfSpeech: "noun", example: "Last month was busy.", tags: ["time"] },
  { lang: "en", term: "year", phonetic: "/jɪr/", translation: "жыл", partOfSpeech: "noun", example: "Happy new year!", tags: ["time"] },
  { lang: "en", term: "today", phonetic: "/təˈdeɪ/", translation: "бүгін", partOfSpeech: "adverb", example: "Today is Monday.", tags: ["time"] },
  { lang: "en", term: "tomorrow", phonetic: "/təˈmɒroʊ/", translation: "ертең", partOfSpeech: "adverb", example: "See you tomorrow.", tags: ["time"] },
  { lang: "en", term: "yesterday", phonetic: "/ˈjestərdeɪ/", translation: "кеше", partOfSpeech: "adverb", example: "I was busy yesterday.", tags: ["time"] },

  // ── Адамдар / отбасы ──
  { lang: "en", term: "people", phonetic: "/ˈpiːpl/", translation: "адамдар", partOfSpeech: "noun", example: "Many people came.", tags: ["people"] },
  { lang: "en", term: "family", phonetic: "/ˈfæməli/", translation: "отбасы", partOfSpeech: "noun", example: "I love my family.", tags: ["people", "family"] },
  { lang: "en", term: "friend", phonetic: "/frend/", translation: "дос", partOfSpeech: "noun", example: "She is my best friend.", tags: ["people", "family"] },
  { lang: "en", term: "mother", phonetic: "/ˈmʌðər/", translation: "ана", partOfSpeech: "noun", example: "My mother is a teacher.", tags: ["family"] },
  { lang: "en", term: "father", phonetic: "/ˈfɑːðər/", translation: "әке", partOfSpeech: "noun", example: "My father works hard.", tags: ["family"] },
  { lang: "en", term: "child", phonetic: "/tʃaɪld/", translation: "бала", partOfSpeech: "noun", example: "The child is sleeping.", tags: ["family"] },

  // ── Сын есімдер (жиі) ──
  { lang: "en", term: "good", phonetic: "/ɡʊd/", translation: "жақсы", partOfSpeech: "adjective", example: "This is a good idea.", tags: ["adjectives", "essential"] },
  { lang: "en", term: "new", phonetic: "/njuː/", translation: "жаңа", partOfSpeech: "adjective", example: "I bought a new phone.", tags: ["adjectives", "essential"] },
  { lang: "en", term: "important", phonetic: "/ɪmˈpɔːrtnt/", translation: "маңызды", partOfSpeech: "adjective", example: "This is very important.", tags: ["adjectives"] },
  { lang: "en", term: "different", phonetic: "/ˈdɪfrənt/", translation: "басқаша", partOfSpeech: "adjective", example: "We are very different.", tags: ["adjectives"] },
  { lang: "en", term: "easy", phonetic: "/ˈiːzi/", translation: "оңай", partOfSpeech: "adjective", example: "This test is easy.", tags: ["adjectives"] },
  { lang: "en", term: "difficult", phonetic: "/ˈdɪfɪkəlt/", translation: "қиын", partOfSpeech: "adjective", example: "Chinese is difficult.", tags: ["adjectives"] },
  { lang: "en", term: "beautiful", phonetic: "/ˈbjuːtɪfl/", translation: "әдемі", partOfSpeech: "adjective", example: "What a beautiful day!", tags: ["adjectives"] },
  { lang: "en", term: "happy", phonetic: "/ˈhæpi/", translation: "бақытты", partOfSpeech: "adjective", example: "I am very happy.", tags: ["adjectives", "emotions"] },

  // ── IELTS / академиялық ──
  { lang: "en", term: "significant", phonetic: "/sɪɡˈnɪfɪkənt/", translation: "елеулі", partOfSpeech: "adjective", example: "A significant increase.", tags: ["academic", "ielts"] },
  { lang: "en", term: "demonstrate", phonetic: "/ˈdemənstreɪt/", translation: "көрсету", partOfSpeech: "verb", example: "The data demonstrates this.", tags: ["academic", "ielts"] },
  { lang: "en", term: "consequently", phonetic: "/ˈkɒnsɪkwəntli/", translation: "сондықтан", partOfSpeech: "adverb", example: "Consequently, prices rose.", tags: ["academic", "ielts"] },
  { lang: "en", term: "beneficial", phonetic: "/ˌbenɪˈfɪʃl/", translation: "пайдалы", partOfSpeech: "adjective", example: "Exercise is beneficial.", tags: ["academic", "ielts"] },
  { lang: "en", term: "establish", phonetic: "/ɪˈstæblɪʃ/", translation: "құру", partOfSpeech: "verb", example: "They established a company.", tags: ["academic", "ielts"] },
  { lang: "en", term: "approach", phonetic: "/əˈproʊtʃ/", translation: "тәсіл", partOfSpeech: "noun", example: "A new approach to learning.", tags: ["academic", "ielts"] },
  { lang: "en", term: "factor", phonetic: "/ˈfæktər/", translation: "фактор", partOfSpeech: "noun", example: "An important factor.", tags: ["academic", "ielts"] },
  { lang: "en", term: "research", phonetic: "/rɪˈsɜːrtʃ/", translation: "зерттеу", partOfSpeech: "noun", example: "Recent research shows...", tags: ["academic", "ielts"] },

  // ── Күнделікті фразалар ──
  { lang: "en", term: "thank you", phonetic: "/θæŋk juː/", translation: "рахмет", partOfSpeech: "phrase", example: "Thank you very much.", tags: ["phrases", "essential"] },
  { lang: "en", term: "excuse me", phonetic: "/ɪkˈskjuːz miː/", translation: "кешіріңіз", partOfSpeech: "phrase", example: "Excuse me, where is...?", tags: ["phrases", "essential"] },
  { lang: "en", term: "of course", phonetic: "/əv kɔːrs/", translation: "әрине", partOfSpeech: "phrase", example: "Of course I can help.", tags: ["phrases"] },
  { lang: "en", term: "by the way", phonetic: "/baɪ ðə weɪ/", translation: "айтпақшы", partOfSpeech: "phrase", example: "By the way, did you hear?", tags: ["phrases"] },
];

// ════════════════════════════════════════════
// ҚЫТАЙ ТІЛІ (HSK 1-2)
// ════════════════════════════════════════════
const chinese: SeedWord[] = [
  // ── Негізгі ──
  { lang: "zh", term: "你好", phonetic: "nǐ hǎo", translation: "сәлем", partOfSpeech: "phrase", example: "你好！", tags: ["greetings", "hsk1"] },
  { lang: "zh", term: "谢谢", phonetic: "xièxie", translation: "рахмет", partOfSpeech: "phrase", example: "谢谢你！", tags: ["greetings", "hsk1"] },
  { lang: "zh", term: "再见", phonetic: "zàijiàn", translation: "сау бол", partOfSpeech: "phrase", example: "再见！", tags: ["greetings", "hsk1"] },
  { lang: "zh", term: "我", phonetic: "wǒ", translation: "мен", partOfSpeech: "pronoun", example: "我是学生。", tags: ["pronouns", "hsk1"] },
  { lang: "zh", term: "你", phonetic: "nǐ", translation: "сен", partOfSpeech: "pronoun", example: "你好吗？", tags: ["pronouns", "hsk1"] },
  { lang: "zh", term: "他", phonetic: "tā", translation: "ол (ер)", partOfSpeech: "pronoun", example: "他是老师。", tags: ["pronouns", "hsk1"] },
  { lang: "zh", term: "她", phonetic: "tā", translation: "ол (әйел)", partOfSpeech: "pronoun", example: "她很漂亮。", tags: ["pronouns", "hsk1"] },
  { lang: "zh", term: "是", phonetic: "shì", translation: "болу (-мын)", partOfSpeech: "verb", example: "我是学生。", tags: ["verbs", "hsk1"] },
  { lang: "zh", term: "好", phonetic: "hǎo", translation: "жақсы", partOfSpeech: "adjective", example: "很好！", tags: ["adjectives", "hsk1"] },
  { lang: "zh", term: "不", phonetic: "bù", translation: "жоқ / емес", partOfSpeech: "adverb", example: "我不喜欢。", tags: ["essential", "hsk1"] },

  // ── Сандар ──
  { lang: "zh", term: "一", phonetic: "yī", translation: "бір", partOfSpeech: "number", example: "一个人", tags: ["numbers", "hsk1"] },
  { lang: "zh", term: "二", phonetic: "èr", translation: "екі", partOfSpeech: "number", example: "二十", tags: ["numbers", "hsk1"] },
  { lang: "zh", term: "三", phonetic: "sān", translation: "үш", partOfSpeech: "number", example: "三本书", tags: ["numbers", "hsk1"] },
  { lang: "zh", term: "十", phonetic: "shí", translation: "он", partOfSpeech: "number", example: "十个", tags: ["numbers", "hsk1"] },
  { lang: "zh", term: "百", phonetic: "bǎi", translation: "жүз", partOfSpeech: "number", example: "一百", tags: ["numbers", "hsk2"] },

  // ── Етістіктер ──
  { lang: "zh", term: "吃", phonetic: "chī", translation: "жеу", partOfSpeech: "verb", example: "我吃饭。", tags: ["verbs", "hsk1"] },
  { lang: "zh", term: "喝", phonetic: "hē", translation: "ішу", partOfSpeech: "verb", example: "喝水", tags: ["verbs", "hsk1"] },
  { lang: "zh", term: "去", phonetic: "qù", translation: "бару", partOfSpeech: "verb", example: "我去学校。", tags: ["verbs", "hsk1"] },
  { lang: "zh", term: "看", phonetic: "kàn", translation: "қарау", partOfSpeech: "verb", example: "看书", tags: ["verbs", "hsk1"] },
  { lang: "zh", term: "爱", phonetic: "ài", translation: "сүю", partOfSpeech: "verb", example: "我爱你。", tags: ["verbs", "hsk1"] },
  { lang: "zh", term: "学习", phonetic: "xuéxí", translation: "оқу", partOfSpeech: "verb", example: "我学习中文。", tags: ["verbs", "hsk2"] },

  // ── Зат есімдер ──
  { lang: "zh", term: "人", phonetic: "rén", translation: "адам", partOfSpeech: "noun", example: "中国人", tags: ["nouns", "hsk1"] },
  { lang: "zh", term: "中国", phonetic: "Zhōngguó", translation: "Қытай", partOfSpeech: "noun", example: "我在中国。", tags: ["nouns", "hsk1"] },
  { lang: "zh", term: "朋友", phonetic: "péngyou", translation: "дос", partOfSpeech: "noun", example: "好朋友", tags: ["nouns", "hsk2"] },
  { lang: "zh", term: "老师", phonetic: "lǎoshī", translation: "мұғалім", partOfSpeech: "noun", example: "我的老师", tags: ["nouns", "hsk1"] },
  { lang: "zh", term: "学生", phonetic: "xuéshēng", translation: "оқушы", partOfSpeech: "noun", example: "我是学生。", tags: ["nouns", "hsk1"] },
];

export const vocabSeed: SeedWord[] = [...english, ...chinese];

// Статистика
export const seedStats = {
  total: vocabSeed.length,
  english: english.length,
  chinese: chinese.length,
};
