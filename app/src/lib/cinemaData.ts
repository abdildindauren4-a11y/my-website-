// filepath: src/lib/cinemaData.ts
// Видео сабақтар кітапханасы — әртүрлі деңгей, категория.
// КЕЙІН: пайдаланушы өз YouTube видеоларын қосады (екі тілде бөлек).

import type { CinemaLesson } from "@/types/cinema";

export const cinemaLessons: CinemaLesson[] = [
  // ════════ САБАҚ 1: Мотивация (intermediate) ════════
  {
    id: "lesson-1",
    title: "The Power of Mindset",
    titleKk: "Ой-сананың құдіреті",
    description: "Discover how your mindset shapes success.",
    descriptionKk: "Көзқарасыңыз табысты қалай қалыптастыратынын біліңіз.",
    youtubeIdEn: "dQw4w9WgXcQ",
    duration: 165,
    level: "intermediate",
    category: "motivation",
    lang: "en",
    subtitles: [
      { id: "s1", start: 0, end: 5, en: "The mind is a powerful thing.", kk: "Ой — құдіретті нәрсе." },
      { id: "s2", start: 5, end: 11, en: "The mind can be a powerful ally, or our greatest enemy.", kk: "Ой санамыз ең үлкен одақтасымыз да, ең қатерлі дұшпанымыз да бола алады." },
      { id: "s3", start: 11, end: 17, en: "It all depends on how we train it.", kk: "Бәрі оны қалай жаттықтыруымызға байланысты." },
      { id: "s4", start: 17, end: 24, en: "A positive mindset opens doors we never imagined.", kk: "Оң көзқарас біз елестетпеген есіктерді ашады." },
      { id: "s5", start: 24, end: 31, en: "Every challenge is an opportunity to grow.", kk: "Әрбір қиындық — өсу мүмкіндігі." },
      { id: "s6", start: 31, end: 38, en: "Believe in yourself, and others will believe in you too.", kk: "Өзіңе сен, сонда басқалар да саған сенеді." },
    ],
    vocabulary: [
      { id: "v1", word: "ally", phonetic: "/ˈælaɪ/", partOfSpeech: "noun", definition: "a person or group that helps or supports someone", translationKk: "одақтас", mastery: 0 },
      { id: "v2", word: "powerful", phonetic: "/ˈpaʊərfəl/", partOfSpeech: "adjective", definition: "having great power or influence", translationKk: "қуатты", mastery: 0 },
      { id: "v3", word: "enemy", phonetic: "/ˈenəmi/", partOfSpeech: "noun", definition: "a person who hates and wants to harm another", translationKk: "дұшпан", mastery: 0 },
      { id: "v4", word: "mindset", phonetic: "/ˈmaɪndset/", partOfSpeech: "noun", definition: "a set of attitudes or fixed ideas", translationKk: "көзқарас", mastery: 0 },
      { id: "v5", word: "challenge", phonetic: "/ˈtʃæləndʒ/", partOfSpeech: "noun", definition: "a difficult task that tests ability", translationKk: "қиындық", mastery: 0 },
      { id: "v6", word: "opportunity", phonetic: "/ˌɒpəˈtjuːnəti/", partOfSpeech: "noun", definition: "a chance for progress or advancement", translationKk: "мүмкіндік", mastery: 0 },
    ],
    questions: [
      { id: "q1", question: "What can the mind be, according to the video?", questionKk: "Видео бойынша ой не бола алады?", options: ["Only an enemy", "A powerful ally or enemy", "Always weak", "Never important"], correctIndex: 1, explanation: "The mind can be both a powerful ally or our greatest enemy." },
      { id: "q2", question: "What does a positive mindset do?", questionKk: "Оң көзқарас не істейді?", options: ["Closes doors", "Opens doors", "Does nothing", "Creates enemies"], correctIndex: 1, explanation: "A positive mindset opens doors we never imagined." },
      { id: "q3", question: "How is every challenge described?", questionKk: "Әрбір қиындық қалай сипатталады?", options: ["A problem", "An opportunity to grow", "A failure", "An ending"], correctIndex: 1, explanation: "Every challenge is an opportunity to grow." },
    ],
  },
  // ════════ САБАҚ 2: Күнделікті (beginner) ════════
  {
    id: "lesson-2",
    title: "Morning Routine",
    titleKk: "Таңғы тәртіп",
    description: "Learn everyday vocabulary about morning activities.",
    descriptionKk: "Таңғы әрекеттер туралы күнделікті сөздерді үйреніңіз.",
    youtubeIdEn: "dQw4w9WgXcQ",
    duration: 120,
    level: "beginner",
    category: "daily",
    lang: "en",
    subtitles: [
      { id: "s1", start: 0, end: 4, en: "I wake up at seven o'clock.", kk: "Мен сағат жетіде оянамын." },
      { id: "s2", start: 4, end: 8, en: "First, I brush my teeth.", kk: "Алдымен тісімді тазалаймын." },
      { id: "s3", start: 8, end: 13, en: "Then I have breakfast with my family.", kk: "Содан отбасыммен таңғы ас ішемін." },
      { id: "s4", start: 13, end: 18, en: "I drink a cup of coffee every morning.", kk: "Әр таң сайын бір кесе кофе ішемін." },
      { id: "s5", start: 18, end: 23, en: "After that, I go to work by bus.", kk: "Содан кейін автобуспен жұмысқа барамын." },
    ],
    vocabulary: [
      { id: "v1", word: "wake up", phonetic: "/weɪk ʌp/", partOfSpeech: "phrasal verb", definition: "to stop sleeping", translationKk: "ояну", mastery: 0 },
      { id: "v2", word: "breakfast", phonetic: "/ˈbrekfəst/", partOfSpeech: "noun", definition: "the first meal of the day", translationKk: "таңғы ас", mastery: 0 },
      { id: "v3", word: "routine", phonetic: "/ruːˈtiːn/", partOfSpeech: "noun", definition: "a regular way of doing things", translationKk: "тәртіп", mastery: 0 },
    ],
    questions: [
      { id: "q1", question: "What time does the speaker wake up?", questionKk: "Сөйлеуші қай уақытта оянады?", options: ["Six o'clock", "Seven o'clock", "Eight o'clock", "Nine o'clock"], correctIndex: 1 },
      { id: "q2", question: "How does the speaker go to work?", questionKk: "Сөйлеуші жұмысқа қалай барады?", options: ["By car", "By bus", "On foot", "By train"], correctIndex: 1 },
    ],
  },
  // ════════ САБАҚ 3: Ғылым (advanced) ════════
  {
    id: "lesson-3",
    title: "How the Brain Learns",
    titleKk: "Ми қалай үйренеді",
    description: "Explore the neuroscience of learning.",
    descriptionKk: "Үйренудің нейроғылымын зерттеңіз.",
    youtubeIdEn: "dQw4w9WgXcQ",
    duration: 240,
    level: "advanced",
    category: "science",
    lang: "en",
    subtitles: [
      { id: "s1", start: 0, end: 6, en: "Our brains are remarkably adaptable organs.", kk: "Біздің миымыз — таңғажайып бейімделгіш мүше." },
      { id: "s2", start: 6, end: 13, en: "Through a process called neuroplasticity, the brain rewires itself.", kk: "Нейропластика деп аталатын процесс арқылы ми өзін қайта құрады." },
      { id: "s3", start: 13, end: 20, en: "Every time we learn, new neural connections form.", kk: "Үйренген сайын жаңа жүйке байланыстары пайда болады." },
      { id: "s4", start: 20, end: 27, en: "Repetition strengthens these connections over time.", kk: "Қайталау уақыт өте бұл байланыстарды нығайтады." },
    ],
    vocabulary: [
      { id: "v1", word: "adaptable", phonetic: "/əˈdæptəbl/", partOfSpeech: "adjective", definition: "able to change to suit conditions", translationKk: "бейімделгіш", mastery: 0 },
      { id: "v2", word: "neuroplasticity", phonetic: "/ˌnjʊroʊplæˈstɪsəti/", partOfSpeech: "noun", definition: "the brain's ability to reorganize itself", translationKk: "нейропластика", mastery: 0 },
      { id: "v3", word: "repetition", phonetic: "/ˌrepəˈtɪʃn/", partOfSpeech: "noun", definition: "the action of repeating something", translationKk: "қайталау", mastery: 0 },
      { id: "v4", word: "strengthen", phonetic: "/ˈstreŋθn/", partOfSpeech: "verb", definition: "to make stronger", translationKk: "нығайту", mastery: 0 },
    ],
    questions: [
      { id: "q1", question: "What is neuroplasticity?", questionKk: "Нейропластика дегеніміз не?", options: ["A type of plastic", "The brain's ability to rewire itself", "A disease", "A medicine"], correctIndex: 1 },
      { id: "q2", question: "What strengthens neural connections?", questionKk: "Жүйке байланыстарын не нығайтады?", options: ["Sleeping", "Repetition", "Eating", "Nothing"], correctIndex: 1 },
    ],
  },
  // ════════ САБАҚ 4: Қытай тілі (beginner) ════════
  {
    id: "lesson-zh-1",
    title: "Greetings in Chinese",
    titleKk: "Қытайша сәлемдесу",
    description: "Learn basic Chinese greetings.",
    descriptionKk: "Негізгі қытай сәлемдесулерін үйреніңіз.",
    youtubeIdEn: "dQw4w9WgXcQ",
    duration: 90,
    level: "beginner",
    category: "daily",
    lang: "zh",
    subtitles: [
      { id: "s1", start: 0, end: 4, en: "你好！(Ni hao!) — Hello!", kk: "你好！(Ni hao!) — Сәлем!" },
      { id: "s2", start: 4, end: 9, en: "你好吗?(Ni hao ma?) — How are you?", kk: "你好吗?(Ni hao ma?) — Қалайсың?" },
      { id: "s3", start: 9, end: 14, en: "我很好 (Wo hen hao) — I'm fine.", kk: "我很好 (Wo hen hao) — Менің жағдайым жақсы." },
      { id: "s4", start: 14, end: 19, en: "谢谢 (Xiexie) — Thank you.", kk: "谢谢 (Xiexie) — Рахмет." },
    ],
    vocabulary: [
      { id: "v1", word: "你好", phonetic: "ni hao", partOfSpeech: "phrase", definition: "hello", translationKk: "сәлем", mastery: 0 },
      { id: "v2", word: "谢谢", phonetic: "xiexie", partOfSpeech: "phrase", definition: "thank you", translationKk: "рахмет", mastery: 0 },
      { id: "v3", word: "很好", phonetic: "hen hao", partOfSpeech: "phrase", definition: "very good", translationKk: "өте жақсы", mastery: 0 },
    ],
    questions: [
      { id: "q1", question: "How do you say 'hello' in Chinese?", questionKk: "Қытайша 'сәлем' қалай айтылады?", options: ["谢谢", "你好", "再见", "我很好"], correctIndex: 1 },
    ],
  },
];

// Бірінші сабақ (Dashboard үшін)
export const demoLesson = cinemaLessons[0];

// Категориялар
export const categories = [
  { id: "all", labelKk: "Барлығы", labelEn: "All" },
  { id: "motivation", labelKk: "Мотивация", labelEn: "Motivation" },
  { id: "daily", labelKk: "Күнделікті", labelEn: "Daily life" },
  { id: "science", labelKk: "Ғылым", labelEn: "Science" },
  { id: "business", labelKk: "Бизнес", labelEn: "Business" },
];
