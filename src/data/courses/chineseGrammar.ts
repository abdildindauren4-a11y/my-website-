// filepath: src/data/courses/chineseGrammar.ts
// Тереңдетілген курс — Chinese Grammar Essentials (қытай грамматикасы).

import type { CourseLevel } from "@/types/course";

export const chineseGrammar: CourseLevel = {
  id: "zh-grammar",
  level: "beginner",
  title: "Chinese Grammar Essentials",
  titleKk: "Қытай грамматикасының негіздері",
  description: "Core Mandarin grammar: word order, measure words, particles and questions.",
  descriptionKk: "Қытай грамматикасының өзегі: сөз реті, өлшем сөздер, шылаулар және сұрақтар.",
  lang: "zh",
  category: "Grammar", categoryKk: "Грамматика", emoji: "📐", color: "accent-purple",
  hours: 5, instructor: "LinguaFast Academy", certificate: true,
  skills: ["Build correct Mandarin sentences", "Use measure words (量词)", "Use 的, 了 and 吗 correctly", "Ask questions naturally"],
  skillsKk: ["Дұрыс қытай сөйлемін құру", "Өлшем сөздерді (量词) қолдану", "的, 了, 吗 дұрыс қолдану", "Сұрақты табиғи қою"],
  units: [
    {
      id: "zg-u1", number: 1, title: "Word Order", titleKk: "Сөз реті",
      description: "Subject–Verb–Object and time/place", descriptionKk: "Бастауыш–етістік–толықтауыш, уақыт/орын",
      icon: "FileText", color: "accent-purple",
      lessons: [{
        id: "zg-l1", type: "grammar", title: "Basic Sentence Structure", titleKk: "Негізгі сөйлем құрылымы",
        description: "How Mandarin orders words", descriptionKk: "Қытай сөздерді қалай реттейді",
        xpReward: 50, estimatedMinutes: 15,
        theory: {
          explanation: "Mandarin basic word order is Subject–Verb–Object, like English. The big difference is that time and place come EARLY (near the subject), and there are no verb conjugations — verbs never change form.",
          explanationKk: "Қытай сөйлемінің негізгі реті — Бастауыш–Етістік–Толықтауыш, ағылшындай. Басты айырма: уақыт пен орын ЕРТЕ (бастауышқа жақын) келеді, әрі етістік ешқашан өзгермейді.",
          sections: [
            { heading: "Subject – Verb – Object", body: "我 喝 水 (wǒ hē shuǐ) = I drink water. 他 吃 饭 (tā chī fàn) = He eats. Same order as English." },
            { heading: "Time comes early", body: "Time goes after the subject (or at the very start), NOT at the end: 我 今天 学习 (wǒ jīntiān xuéxí) = I study today. NOT '我 学习 今天'." },
            { heading: "Place before the verb", body: "Use 在 (zài) + place before the verb: 我 在 学校 学习 (wǒ zài xuéxiào xuéxí) = I study at school. Order: Subject + Time + Place + Verb + Object." },
          ],
          keyPoints: [
            "Basic order = Subject–Verb–Object (like English).",
            "Time goes early: 我今天学习 (I today study).",
            "Place uses 在 before the verb: 在学校学习.",
            "Verbs never change form (no -s, no -ed).",
          ],
          examples: [
            { text: "我喝水 wǒ hē shuǐ = I drink water", translation: "мен су ішемін" },
            { text: "我今天学习 wǒ jīntiān xuéxí = I study today", translation: "уақыт ерте келеді" },
            { text: "我在学校学习 = I study at school", translation: "орын 在 + етістік алдында" },
          ],
        },
        exercises: [
          { id: "zg1e1", type: "multiple-choice", prompt: "Mandarin basic word order is…", options: ["S-O-V", "S-V-O", "V-S-O", "O-V-S"], answer: "S-V-O" },
          { id: "zg1e2", type: "multiple-choice", prompt: "Where does TIME go? 'I study today'", options: ["我学习今天", "我今天学习", "今天学习我", "学习我今天"], answer: "我今天学习" },
          { id: "zg1e3", type: "flashcard", prompt: "Learn", term: "我喝水 (wǒ hē shuǐ)", translation: "мен су ішемін", phonetic: "wǒ hē shuǐ", answer: "мен су ішемін" },
          { id: "zg1e4", type: "multiple-choice", prompt: "Which word marks PLACE before a verb?", options: ["了", "在 (zài)", "吗", "的"], answer: "在 (zài)" },
          { id: "zg1e5", type: "multiple-choice", prompt: "Do Mandarin verbs change form for tense?", options: ["Yes, like English -ed", "No, verbs never change", "Only for 'he/she'", "Only in the past"], answer: "No, verbs never change" },
          { id: "zg1e6", type: "multiple-choice", prompt: "Correct sentence for 'He eats rice'?", options: ["他饭吃", "吃他饭", "他吃饭", "饭他吃"], answer: "他吃饭" },
          { id: "zg1e7", type: "flashcard", prompt: "Learn", term: "在 (zài)", translation: "-да/-де (орын)", phonetic: "zài", answer: "орын шылауы" },
        ],
      }],
    },
    {
      id: "zg-u2", number: 2, title: "Measure Words (量词)", titleKk: "Өлшем сөздер (量词)",
      description: "Counting nouns correctly", descriptionKk: "Зат есімдерді дұрыс санау",
      icon: "FileText", color: "accent-blue",
      lessons: [{
        id: "zg-l2", type: "grammar", title: "Measure Words", titleKk: "Өлшем сөздер",
        description: "Number + measure word + noun", descriptionKk: "Сан + өлшем сөз + зат есім",
        xpReward: 50, estimatedMinutes: 15,
        theory: {
          explanation: "In Mandarin you can't just say 'three books' — you need a measure word between the number and the noun: number + measure word + noun. Different nouns take different measure words.",
          explanationKk: "Қытайша жай ғана «үш кітап» деуге болмайды — сан мен зат есім арасында өлшем сөз керек: сан + өлшем сөз + зат есім. Әр зат есімнің өз өлшем сөзі бар.",
          sections: [
            { heading: "The pattern", body: "Number + 量词 + noun: 三 本 书 (sān běn shū) = three books. 一 个 人 (yí gè rén) = one person." },
            { heading: "The universal 个 (gè)", body: "个 (gè) is the most common measure word and works for people and many objects: 一个人 (a person), 三个苹果 (three apples). If unsure, 个 is often acceptable." },
            { heading: "Common specific ones", body: "本 (běn) for books, 只 (zhī) for animals, 张 (zhāng) for flat things (paper, tables), 杯 (bēi) for cups/drinks: 一杯茶 (a cup of tea)." },
          ],
          keyPoints: [
            "Structure: number + measure word + noun.",
            "个 (gè) is the all-purpose measure word.",
            "本 books, 张 flat things, 只 animals, 杯 cups.",
            "You cannot skip the measure word.",
          ],
          examples: [
            { text: "三本书 sān běn shū = three books", translation: "本 — кітапқа арналған" },
            { text: "一个人 yí gè rén = one person", translation: "个 — әмбебап" },
            { text: "一杯茶 yì bēi chá = a cup of tea", translation: "杯 — кесе/сусын" },
          ],
        },
        exercises: [
          { id: "zg2e1", type: "multiple-choice", prompt: "Correct structure?", options: ["number + noun", "number + measure word + noun", "noun + number", "measure word + number + noun"], answer: "number + measure word + noun" },
          { id: "zg2e2", type: "multiple-choice", prompt: "The all-purpose measure word is…", options: ["本 (běn)", "个 (gè)", "张 (zhāng)", "杯 (bēi)"], answer: "个 (gè)" },
          { id: "zg2e3", type: "multiple-choice", prompt: "Which measure word is used for books?", options: ["个", "本 (běn)", "只", "杯"], answer: "本 (běn)" },
          { id: "zg2e4", type: "flashcard", prompt: "Learn", term: "三本书 (sān běn shū)", translation: "үш кітап", phonetic: "sān běn shū", answer: "үш кітап" },
          { id: "zg2e5", type: "multiple-choice", prompt: "'a cup of tea' = ?", options: ["一茶", "一杯茶", "一个茶", "茶一杯"], answer: "一杯茶" },
          { id: "zg2e6", type: "multiple-choice", prompt: "Can you say a number directly before a noun (no measure word)?", options: ["Yes, always", "No, you need a measure word", "Only for people", "Only for books"], answer: "No, you need a measure word" },
          { id: "zg2e7", type: "flashcard", prompt: "Learn", term: "一个人 (yí gè rén)", translation: "бір адам", phonetic: "yí gè rén", answer: "бір адам" },
        ],
      }],
    },
    {
      id: "zg-u3", number: 3, title: "Particles 的 了 吗", titleKk: "Шылаулар 的 了 吗",
      description: "The three essential particles", descriptionKk: "Үш маңызды шылау",
      icon: "MessageSquare", color: "accent-green",
      lessons: [{
        id: "zg-l3", type: "grammar", title: "的, 了 and 吗", titleKk: "的, 了 және 吗",
        description: "Possession, change/completion, questions", descriptionKk: "Тәуелдік, өзгеріс/аяқталу, сұрақ",
        xpReward: 50, estimatedMinutes: 15,
        theory: {
          explanation: "Three tiny words do a lot of work in Mandarin. 的 (de) shows possession or links a description to a noun. 了 (le) shows a completed action or a change. 吗 (ma) turns a statement into a yes/no question.",
          explanationKk: "Үш кішкентай сөз қытайшада көп жұмыс атқарады. 的 (de) — тәуелдік/сипаттама. 了 (le) — аяқталған әрекет немесе өзгеріс. 吗 (ma) — сөйлемді иә/жоқ сұрағына айналдырады.",
          sections: [
            { heading: "的 (de) — possession & description", body: "Like English 's or 'of': 我的书 (wǒ de shū) = my book. 老师的车 = the teacher's car. Also links adjectives: 漂亮的花 = beautiful flower." },
            { heading: "了 (le) — completion / change", body: "Marks a completed action or new situation: 我吃了 (wǒ chī le) = I have eaten / I ate. 下雨了 (xià yǔ le) = it's started raining (change)." },
            { heading: "吗 (ma) — yes/no questions", body: "Add 吗 to the end of a statement to ask: 你好 → 你好吗？(How are you?). 你是学生 → 你是学生吗？(Are you a student?)." },
          ],
          keyPoints: [
            "的 (de) = possession/description: 我的书 = my book.",
            "了 (le) = completed action or change.",
            "吗 (ma) at the end = yes/no question.",
            "These particles are neutral tone (light and short).",
          ],
          examples: [
            { text: "我的书 wǒ de shū = my book", translation: "的 — тәуелдік" },
            { text: "我吃了 wǒ chī le = I ate", translation: "了 — аяқталу" },
            { text: "你是学生吗？= Are you a student?", translation: "吗 — сұрақ" },
          ],
        },
        exercises: [
          { id: "zg3e1", type: "multiple-choice", prompt: "Which particle shows possession ('my book')?", options: ["了", "吗", "的 (de)", "在"], answer: "的 (de)" },
          { id: "zg3e2", type: "multiple-choice", prompt: "'my book' in Mandarin?", options: ["书我", "我书的", "我的书", "的我书"], answer: "我的书" },
          { id: "zg3e3", type: "multiple-choice", prompt: "Which particle makes a yes/no question?", options: ["的", "了", "吗 (ma)", "在"], answer: "吗 (ma)" },
          { id: "zg3e4", type: "multiple-choice", prompt: "了 (le) usually shows…", options: ["a question", "possession", "a completed action or change", "a place"], answer: "a completed action or change" },
          { id: "zg3e5", type: "flashcard", prompt: "Learn", term: "你好吗？(nǐ hǎo ma)", translation: "қалайсың?", phonetic: "nǐ hǎo ma", answer: "қалайсың?" },
          { id: "zg3e6", type: "multiple-choice", prompt: "Make it a question: '你是老师___？'", options: ["的", "了", "吗", "在"], answer: "吗" },
          { id: "zg3e7", type: "flashcard", prompt: "Learn", term: "我吃了 (wǒ chī le)", translation: "мен жедім", phonetic: "wǒ chī le", answer: "мен жедім" },
        ],
      }],
    },
    {
      id: "zg-u4", number: 4, title: "Asking Questions", titleKk: "Сұрақ қою",
      description: "Question words and the 是不是 pattern", descriptionKk: "Сұрақ сөздер және 是不是 үлгісі",
      icon: "Dumbbell", color: "accent-gold",
      lessons: [{
        id: "zg-l4", type: "practice", title: "Question Patterns", titleKk: "Сұрақ үлгілері",
        description: "吗, question words, A-not-A", descriptionKk: "吗, сұрақ сөздер, A-not-A",
        xpReward: 60, estimatedMinutes: 15,
        theory: {
          explanation: "Mandarin has three main ways to ask questions: add 吗 for yes/no; use a question word (who, what, where) in the SAME position as the answer; or use the 'A-not-A' pattern (是不是 = is-not-is).",
          explanationKk: "Қытайша сұрақтың үш жолы бар: иә/жоқ үшін 吗; сұрақ сөзді (кім, не, қайда) жауаптың орнында қолдану; немесе 'A-not-A' үлгісі (是不是 = ма).",
          sections: [
            { heading: "Question words stay in place", body: "Unlike English, the question word goes where the answer would go: 你去哪儿？(nǐ qù nǎr) = you go where? 这是什么？(zhè shì shénme) = this is what? No word order change." },
            { heading: "Common question words", body: "什么 shénme = what, 谁 shéi = who, 哪儿/哪里 nǎr/nǎlǐ = where, 什么时候 shénme shíhou = when, 为什么 wèishénme = why, 怎么 zěnme = how, 几/多少 jǐ/duōshao = how many." },
            { heading: "A-not-A questions", body: "Repeat the verb in positive-negative form: 你是不是学生？(are you a student?), 好不好？(is it ok?), 有没有？(do you have?). This is a natural alternative to 吗." },
          ],
          keyPoints: [
            "吗 = yes/no question at the end.",
            "Question words stay in the answer's position.",
            "什么=what, 谁=who, 哪儿=where, 为什么=why.",
            "A-not-A: 是不是, 好不好, 有没有.",
          ],
          examples: [
            { text: "你去哪儿？nǐ qù nǎr = Where are you going?", translation: "哪儿 = қайда, орны өзгермейді" },
            { text: "这是什么？= What is this?", translation: "什么 = не" },
            { text: "你是不是学生？= Are you a student?", translation: "是不是 = A-not-A" },
          ],
        },
        exercises: [
          { id: "zg4e1", type: "multiple-choice", prompt: "什么 (shénme) means…", options: ["who", "what", "where", "why"], answer: "what" },
          { id: "zg4e2", type: "multiple-choice", prompt: "In Mandarin, the question word goes…", options: ["at the start always", "where the answer would go", "at the very end", "after 吗"], answer: "where the answer would go" },
          { id: "zg4e3", type: "multiple-choice", prompt: "'Where are you going?' = ?", options: ["哪儿你去", "你哪儿去", "你去哪儿", "去你哪儿"], answer: "你去哪儿" },
          { id: "zg4e4", type: "multiple-choice", prompt: "谁 (shéi) means…", options: ["what", "who", "how", "when"], answer: "who" },
          { id: "zg4e5", type: "multiple-choice", prompt: "The A-not-A form of 是 (to be) is…", options: ["是了", "是吗", "是不是", "不是了"], answer: "是不是" },
          { id: "zg4e6", type: "flashcard", prompt: "Learn", term: "为什么 (wèishénme)", translation: "неге", phonetic: "wèishénme", answer: "неге" },
          { id: "zg4e7", type: "multiple-choice", prompt: "'What is this?' = ?", options: ["什么这是", "这什么是", "这是什么", "是这什么"], answer: "这是什么" },
        ],
      }],
    },
  ],
};
