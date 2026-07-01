// filepath: src/data/courses/chinesePinyin.ts
// Тереңдетілген курс — Chinese Pinyin & Pronunciation (қытай оқылуы).

import type { CourseLevel } from "@/types/course";

export const chinesePinyin: CourseLevel = {
  id: "zh-pinyin",
  level: "beginner",
  title: "Chinese Pinyin & Pronunciation",
  titleKk: "Қытай пиньинь мен айтылымы",
  description: "Learn to read and pronounce Mandarin using Pinyin: initials, finals and the four tones.",
  descriptionKk: "Пиньинь арқылы қытайша оқып, айтуды үйреніңіз: бастапқы, соңғы дыбыстар және төрт тон.",
  lang: "zh",
  category: "Pronunciation", categoryKk: "Айтылым", emoji: "🀄", color: "accent-red",
  hours: 5, instructor: "LinguaFast Academy", certificate: true,
  skills: ["Read any word written in Pinyin", "Pronounce Mandarin initials and finals", "Master the four tones", "Apply tone-change rules"],
  skillsKk: ["Пиньинь жазуын оқу", "Бастапқы/соңғы дыбыстарды айту", "Төрт тонды меңгеру", "Тон өзгеру ережелерін қолдану"],
  units: [
    {
      id: "zp-u1", number: 1, title: "Pinyin & Tones Intro", titleKk: "Пиньинь мен тонға кіріспе",
      description: "What Pinyin is and why tones matter", descriptionKk: "Пиньинь деген не және тон неге маңызды",
      icon: "FileText", color: "accent-red",
      lessons: [{
        id: "zp-l1", type: "grammar", title: "The Four Tones", titleKk: "Төрт тон",
        description: "Tones change the meaning of a syllable", descriptionKk: "Тон буынның мағынасын өзгертеді",
        xpReward: 50, estimatedMinutes: 15,
        theory: {
          explanation: "Pinyin is the romanised spelling of Mandarin sounds. Mandarin is a tonal language: the same syllable said with a different tone is a completely different word. There are four main tones plus a neutral tone.",
          explanationKk: "Пиньинь — қытай дыбыстарының латын жазуы. Қытай тілі — тондық тіл: бір буынды басқа тонмен айтсаң, мүлде басқа сөз болады. Төрт негізгі тон және бір бейтарап тон бар.",
          sections: [
            { heading: "The classic example: ma", body: "mā (妈) = mother — 1st tone (high, flat).\nmá (麻) = hemp — 2nd tone (rising).\nmǎ (马) = horse — 3rd tone (dip down then up).\nmà (骂) = to scold — 4th tone (sharp falling).\nSame letters, four meanings — the tone decides." },
            { heading: "How each tone moves", body: "1st ˉ high & level (sing it flat). 2nd ˊ rising (like a question 'huh?'). 3rd ˇ falls then rises (low dip). 4th ˋ falls sharply (like a firm 'No!')." },
            { heading: "Neutral tone", body: "Some syllables are said light and short with no tone mark, e.g. the question particle 吗 (ma) and 的 (de). Say them quickly and softly." },
          ],
          keyPoints: [
            "Mandarin has 4 tones + a neutral tone.",
            "mā / má / mǎ / mà are four different words.",
            "1=flat high, 2=rising, 3=dip, 4=falling.",
            "The tone is part of the word — not optional.",
          ],
          examples: [
            { text: "mā 妈 (1st) = mother", translation: "ана — жоғары, тегіс тон" },
            { text: "mǎ 马 (3rd) = horse", translation: "жылқы — төмен түсіп көтерілетін тон" },
            { text: "mà 骂 (4th) = to scold", translation: "ұрысу — күрт түсетін тон" },
          ],
        },
        exercises: [
          { id: "zp1e1", type: "multiple-choice", prompt: "Which tone is HIGH and FLAT?", options: ["1st (mā)", "2nd (má)", "3rd (mǎ)", "4th (mà)"], answer: "1st (mā)" },
          { id: "zp1e2", type: "multiple-choice", prompt: "'mǎ' (3rd tone) means…", options: ["mother", "hemp", "horse", "to scold"], answer: "horse" },
          { id: "zp1e3", type: "multiple-choice", prompt: "The RISING tone (like a question) is…", options: ["1st", "2nd", "3rd", "4th"], answer: "2nd" },
          { id: "zp1e4", type: "multiple-choice", prompt: "Which tone falls sharply (like a firm 'No!')?", options: ["1st", "2nd", "3rd", "4th"], answer: "4th" },
          { id: "zp1e5", type: "multiple-choice", prompt: "How many main tones does Mandarin have?", options: ["2", "3", "4", "6"], answer: "4" },
          { id: "zp1e6", type: "flashcard", prompt: "Learn", term: "妈 (mā)", translation: "ана", phonetic: "mā (1st tone)", answer: "ана" },
          { id: "zp1e7", type: "multiple-choice", prompt: "The particle 吗 (ma) uses which tone?", options: ["1st", "3rd", "4th", "neutral"], answer: "neutral" },
        ],
      }],
    },
    {
      id: "zp-u2", number: 2, title: "Initials (声母)", titleKk: "Бастапқы дыбыстар (声母)",
      description: "The consonant sounds that begin syllables", descriptionKk: "Буынды бастайтын дауыссыздар",
      icon: "FileText", color: "accent-blue",
      lessons: [{
        id: "zp-l2", type: "grammar", title: "Initials", titleKk: "Бастапқы дыбыстар",
        description: "b p m f, d t n l, and the tricky ones", descriptionKk: "b p m f, d t n l және қиындары",
        xpReward: 50, estimatedMinutes: 15,
        theory: {
          explanation: "An 'initial' (声母) is the consonant sound at the start of a syllable. Most are similar to English, but a few groups are tricky for learners: the 'j q x' group and the 'zh ch sh r' group.",
          explanationKk: "«Бастапқы дыбыс» (声母) — буын басындағы дауыссыз. Көбі ағылшынға ұқсас, бірақ бірнеше топ қиын: 'j q x' тобы және 'zh ch sh r' тобы.",
          sections: [
            { heading: "Easy initials", body: "b p m f (like English), d t n l, g k h. E.g. bā (八 eight), mā (妈 mother), hǎo (好 good)." },
            { heading: "The j q x group", body: "Said with a smile, tongue near the front: j (like 'jee'), q (like 'chee' with air), x (like 'she'). E.g. xièxie (谢谢 thanks), qù (去 go)." },
            { heading: "The zh ch sh r group", body: "Curl the tongue back: zh (like 'j' in jam), ch (like 'ch' with a curl), sh (like 'sh' with a curl), r (like a soft English 'r'). E.g. Zhōngguó (中国 China), shì (是 to be)." },
          ],
          keyPoints: [
            "b p m f, d t n l, g k h ≈ English.",
            "j q x = front of mouth, smiling.",
            "zh ch sh r = tongue curled back.",
            "x sounds like 'sh' (xièxie = 'shieh-shieh').",
          ],
          examples: [
            { text: "谢谢 xièxie = thank you", translation: "рахмет — 'x' = 'ш'" },
            { text: "中国 Zhōngguó = China", translation: "Қытай — 'zh' тіл артқа" },
            { text: "好 hǎo = good", translation: "жақсы" },
          ],
        },
        exercises: [
          { id: "zp2e1", type: "multiple-choice", prompt: "In Pinyin, 'x' sounds most like…", options: ["ks", "sh (she)", "z", "h"], answer: "sh (she)" },
          { id: "zp2e2", type: "multiple-choice", prompt: "Which group needs the tongue curled back?", options: ["b p m f", "j q x", "zh ch sh r", "d t n l"], answer: "zh ch sh r" },
          { id: "zp2e3", type: "flashcard", prompt: "Learn", term: "谢谢 (xièxie)", translation: "рахмет", phonetic: "xièxie", answer: "рахмет" },
          { id: "zp2e4", type: "multiple-choice", prompt: "'Zhōngguó' means…", options: ["thank you", "China", "good", "horse"], answer: "China" },
          { id: "zp2e5", type: "multiple-choice", prompt: "Which initials are closest to English?", options: ["j q x", "zh ch sh", "b p m f", "none"], answer: "b p m f" },
          { id: "zp2e6", type: "flashcard", prompt: "Learn", term: "好 (hǎo)", translation: "жақсы", phonetic: "hǎo", answer: "жақсы" },
          { id: "zp2e7", type: "multiple-choice", prompt: "'q' in Pinyin is like…", options: ["k", "ch with air", "g", "s"], answer: "ch with air" },
        ],
      }],
    },
    {
      id: "zp-u3", number: 3, title: "Finals (韵母)", titleKk: "Соңғы дыбыстар (韵母)",
      description: "The vowel endings of syllables", descriptionKk: "Буынның дауысты аяқталуы",
      icon: "MessageSquare", color: "accent-green",
      lessons: [{
        id: "zp-l3", type: "grammar", title: "Finals", titleKk: "Соңғы дыбыстар",
        description: "a o e i u ü and combinations", descriptionKk: "a o e i u ü және тіркестер",
        xpReward: 50, estimatedMinutes: 15,
        theory: {
          explanation: "A 'final' (韵母) is the vowel part after the initial. There are simple finals (a, o, e, i, u, ü) and compound finals (ai, ao, ou, an, ang…). The special one is 'ü', pronounced with rounded lips.",
          explanationKk: "«Соңғы дыбыс» (韵母) — бастапқыдан кейінгі дауысты бөлік. Жай (a, o, e, i, u, ü) және құранды (ai, ao, ou, an…) болады. Ерекшесі — ерінді дөңгелетіп айтылатын 'ü'.",
          sections: [
            { heading: "Simple finals", body: "a (ah), o (aw), e (uh), i (ee), u (oo), ü (ee with rounded lips). E.g. mā, bō, hē, nǐ, bù." },
            { heading: "The special 'ü'", body: "Say 'ee' then round your lips like 'oo'. After j, q, x, y the two dots are dropped but it's still 'ü': ju, qu, xu, yu. E.g. 去 qù (go)." },
            { heading: "Compound finals", body: "ai (eye), ei (ay), ao (ow), ou (oh), an, en, ang, eng, ong. E.g. hǎo (ao), zhōng (ong), péng (eng)." },
          ],
          keyPoints: [
            "6 simple finals: a o e i u ü.",
            "'ü' = 'ee' with rounded lips.",
            "After j/q/x/y, 'u' is actually 'ü'.",
            "Compound finals combine sounds: ao, ou, ang…",
          ],
          examples: [
            { text: "你 nǐ = you", translation: "сен — 'i' = 'и'" },
            { text: "去 qù = to go", translation: "бару — 'u' мұнда 'ü'" },
            { text: "好 hǎo = good", translation: "'ao' = 'ау'" },
          ],
        },
        exercises: [
          { id: "zp3e1", type: "multiple-choice", prompt: "The final 'i' sounds like…", options: ["ah", "ee", "oo", "uh"], answer: "ee" },
          { id: "zp3e2", type: "multiple-choice", prompt: "'ü' is pronounced…", options: ["like 'oo'", "'ee' with rounded lips", "like 'ah'", "silent"], answer: "'ee' with rounded lips" },
          { id: "zp3e3", type: "flashcard", prompt: "Learn", term: "你 (nǐ)", translation: "сен", phonetic: "nǐ", answer: "сен" },
          { id: "zp3e4", type: "multiple-choice", prompt: "After j/q/x/y, the letter 'u' is actually…", options: ["u (oo)", "ü", "o", "silent"], answer: "ü" },
          { id: "zp3e5", type: "multiple-choice", prompt: "'ao' (as in hǎo) sounds like…", options: ["ay", "ow (as in 'now')", "oh", "ee"], answer: "ow (as in 'now')" },
          { id: "zp3e6", type: "flashcard", prompt: "Learn", term: "去 (qù)", translation: "бару", phonetic: "qù", answer: "бару" },
          { id: "zp3e7", type: "multiple-choice", prompt: "How many simple finals are there?", options: ["4", "6", "8", "10"], answer: "6" },
        ],
      }],
    },
    {
      id: "zp-u4", number: 4, title: "Tone Changes", titleKk: "Тон өзгерістері",
      description: "Third-tone sandhi, 不 and 一", descriptionKk: "Үшінші тон sandhi, 不 мен 一",
      icon: "Dumbbell", color: "accent-gold",
      lessons: [{
        id: "zp-l4", type: "practice", title: "Tone Change Rules", titleKk: "Тон өзгеру ережелері",
        description: "How tones shift in real speech", descriptionKk: "Тонның нақты сөйлеуде өзгеруі",
        xpReward: 60, estimatedMinutes: 15,
        theory: {
          explanation: "In natural speech, some tones change (this is called 'tone sandhi'). The most important rules involve two third tones together, and the special words 不 (bù) and 一 (yī).",
          explanationKk: "Табиғи сөйлеуде кейбір тондар өзгереді («тон sandhi»). Ең маңызды ережелер: қатар келген екі үшінші тон, және 不 (bù) мен 一 (yī) сөздері.",
          sections: [
            { heading: "Two 3rd tones", body: "When two 3rd tones are next to each other, the FIRST becomes a 2nd tone. nǐ + hǎo → ní hǎo (你好). You write it as 3+3 but say 2+3." },
            { heading: "不 (bù)", body: "'bù' is 4th tone, but before another 4th tone it becomes 2nd: bù + shì → bú shì (不是 = is not); bù + duì → bú duì (不对)." },
            { heading: "一 (yī)", body: "'yī' (one) is 1st tone alone, but 4th before a non-4th syllable (yì bēi 一杯) and 2nd before a 4th tone (yí gè 一个)." },
          ],
          keyPoints: [
            "3rd + 3rd → say 2nd + 3rd (nǐ hǎo → ní hǎo).",
            "不 bù → bú before a 4th tone (bú shì).",
            "一 yī changes tone depending on what follows.",
            "Spelling keeps the original tone; speech changes it.",
          ],
          examples: [
            { text: "你好 written nǐ hǎo → said ní hǎo", translation: "3+3 → 2+3" },
            { text: "不是 bù shì → bú shì", translation: "不 → 2-тон 4-тон алдында" },
            { text: "一个 yī gè → yí gè", translation: "一 → 2-тон" },
          ],
        },
        exercises: [
          { id: "zp4e1", type: "multiple-choice", prompt: "When two 3rd tones meet, the first becomes…", options: ["1st", "2nd", "4th", "neutral"], answer: "2nd" },
          { id: "zp4e2", type: "multiple-choice", prompt: "你好 (nǐ hǎo) is actually pronounced…", options: ["nǐ hǎo (3+3)", "ní hǎo (2+3)", "nì hǎo (4+3)", "nī hǎo (1+3)"], answer: "ní hǎo (2+3)" },
          { id: "zp4e3", type: "multiple-choice", prompt: "不是: 不 (bù) changes to which tone?", options: ["1st", "2nd (bú)", "3rd", "neutral"], answer: "2nd (bú)" },
          { id: "zp4e4", type: "flashcard", prompt: "Learn", term: "不是 (bú shì)", translation: "емес / жоқ", phonetic: "bú shì", answer: "емес" },
          { id: "zp4e5", type: "multiple-choice", prompt: "Why does 不 change before 是 (shì)?", options: ["shì is 4th tone", "shì is 1st tone", "no reason", "it never changes"], answer: "shì is 4th tone" },
          { id: "zp4e6", type: "flashcard", prompt: "Learn", term: "你好 (nǐ hǎo)", translation: "сәлем", phonetic: "ní hǎo", answer: "сәлем" },
          { id: "zp4e7", type: "multiple-choice", prompt: "Does the written tone mark change with sandhi?", options: ["No, only the spoken tone changes", "Yes, always rewritten", "Both change", "Neither"], answer: "No, only the spoken tone changes" },
        ],
      }],
    },
  ],
};
