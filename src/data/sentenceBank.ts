// filepath: src/data/sentenceBank.ts
// Сөйлем құрау ойынының қоры — ағылшын + қытай, 3 деңгей.
// text: сөздер бос орынмен бөлінген (ойын сол бойынша чиптерге бөледі).

export interface BankSentence {
  text: string;  // құрастырылатын сөйлем (сөздер бос орынмен)
  kk: string;    // қазақша аудармасы (кеңес)
  level: number; // 1=қысқа, 2=орта, 3=ұзын
}

// ════════ АҒЫЛШЫН ════════
export const englishSentences: BankSentence[] = [
  // ── Деңгей 1 — қысқа (3-4 сөз) ──
  { text: "I like coffee", kk: "Мен кофе ұнатамын", level: 1 },
  { text: "She is happy", kk: "Ол бақытты", level: 1 },
  { text: "We are friends", kk: "Біз доспыз", level: 1 },
  { text: "He reads books", kk: "Ол кітап оқиды", level: 1 },
  { text: "They play music", kk: "Олар музыка ойнайды", level: 1 },
  { text: "I am hungry", kk: "Менің қарным аш", level: 1 },
  { text: "The sky is blue", kk: "Аспан көк", level: 1 },
  { text: "Dogs are loyal", kk: "Иттер адал", level: 1 },
  { text: "Time flies fast", kk: "Уақыт тез өтеді", level: 1 },
  { text: "Water is life", kk: "Су — өмір", level: 1 },
  { text: "I love winter", kk: "Мен қысты жақсы көремін", level: 1 },
  { text: "He works hard", kk: "Ол көп еңбектенеді", level: 1 },
  { text: "She sings well", kk: "Ол әнді жақсы айтады", level: 1 },
  { text: "We eat together", kk: "Біз бірге тамақтанамыз", level: 1 },
  { text: "The tea is hot", kk: "Шай ыстық", level: 1 },
  { text: "Birds can fly", kk: "Құстар ұша алады", level: 1 },
  { text: "I need help", kk: "Маған көмек керек", level: 1 },
  { text: "It is raining", kk: "Жаңбыр жауып тұр", level: 1 },
  { text: "Life is beautiful", kk: "Өмір әдемі", level: 1 },
  { text: "You are right", kk: "Сенікі дұрыс", level: 1 },

  // ── Деңгей 2 — орта (5-6 сөз) ──
  { text: "I want to learn English", kk: "Мен ағылшын тілін үйренгім келеді", level: 2 },
  { text: "She is reading a book", kk: "Ол кітап оқып жатыр", level: 2 },
  { text: "We are going to school", kk: "Біз мектепке барамыз", level: 2 },
  { text: "He likes to play football", kk: "Ол футбол ойнағанды ұнатады", level: 2 },
  { text: "My favorite color is blue", kk: "Менің сүйікті түсім — көк", level: 2 },
  { text: "I drink tea every morning", kk: "Мен әр таң сайын шай ішемін", level: 2 },
  { text: "They live in a city", kk: "Олар қалада тұрады", level: 2 },
  { text: "Can you help me please", kk: "Маған көмектесе аласыз ба", level: 2 },
  { text: "The weather is cold today", kk: "Бүгін ауа райы суық", level: 2 },
  { text: "I forgot my phone home", kk: "Мен телефонымды үйде ұмытып кеттім", level: 2 },
  { text: "She speaks three languages well", kk: "Ол үш тілде жақсы сөйлейді", level: 2 },
  { text: "We watched a good film", kk: "Біз жақсы фильм көрдік", level: 2 },
  { text: "My brother is a doctor", kk: "Менің ағам — дәрігер", level: 2 },
  { text: "The train leaves at nine", kk: "Пойыз сағат тоғызда жүреді", level: 2 },
  { text: "I will call you tomorrow", kk: "Мен саған ертең қоңырау шаламын", level: 2 },
  { text: "He bought a new car", kk: "Ол жаңа көлік сатып алды", level: 2 },
  { text: "Please open the window now", kk: "Терезені қазір ашыңызшы", level: 2 },
  { text: "This book is very interesting", kk: "Бұл кітап өте қызықты", level: 2 },
  { text: "We had dinner at home", kk: "Біз үйде кешкі ас іштік", level: 2 },
  { text: "I always walk to work", kk: "Мен жұмысқа әрқашан жаяу барамын", level: 2 },

  // ── Деңгей 3 — ұзын (7+ сөз) ──
  { text: "The weather is very nice today", kk: "Бүгін ауа райы өте жақсы", level: 3 },
  { text: "I have two brothers and one sister", kk: "Менің екі ағам, бір қарындасым бар", level: 3 },
  { text: "We will travel to many countries next year", kk: "Біз келесі жылы көп елге саяхаттаймыз", level: 3 },
  { text: "She always helps me with my homework", kk: "Ол маған үй жұмысыма әрқашан көмектеседі", level: 3 },
  { text: "Learning a new language opens many doors", kk: "Жаңа тіл үйрену көп есік ашады", level: 3 },
  { text: "My family lives in a small village", kk: "Менің отбасым шағын ауылда тұрады", level: 3 },
  { text: "He goes to the gym three times a week", kk: "Ол аптасына үш рет жаттығу залына барады", level: 3 },
  { text: "I would like a cup of hot tea", kk: "Мен бір кесе ыстық шай алар едім", level: 3 },
  { text: "They are planning a trip to the mountains", kk: "Олар тауға сапар жоспарлап жатыр", level: 3 },
  { text: "Reading books every day makes you smarter", kk: "Күнде кітап оқу сені ақылды етеді", level: 3 },
  { text: "She wants to become a famous doctor", kk: "Ол атақты дәрігер болғысы келеді", level: 3 },
  { text: "We should protect nature for future generations", kk: "Болашақ ұрпақ үшін табиғатты қорғауымыз керек", level: 3 },
  { text: "My best friend lives in another country", kk: "Менің ең жақын досым басқа елде тұрады", level: 3 },
  { text: "It is important to drink enough water", kk: "Жеткілікті су ішу маңызды", level: 3 },
  { text: "He has been working here for five years", kk: "Ол мұнда бес жыл жұмыс істеп келеді", level: 3 },
  { text: "The students are preparing for their exams", kk: "Студенттер емтихандарына дайындалып жатыр", level: 3 },
  { text: "I usually wake up at seven in the morning", kk: "Мен әдетте таңғы жетіде оянамын", level: 3 },
  { text: "Music helps me relax after a long day", kk: "Ұзақ күннен кейін музыка маған демалуға көмектеседі", level: 3 },
  { text: "You should eat more fruits and vegetables", kk: "Сен жеміс пен көкөністі көбірек жеуің керек", level: 3 },
  { text: "Everyone can learn if they practice every day", kk: "Күнде жаттықса, кез келген адам үйрене алады", level: 3 },
];

// ════════ ҚЫТАЙ (сөздер бос орынмен бөлінген) ════════
export const chineseSentences: BankSentence[] = [
  // ── Деңгей 1 ──
  { text: "我 是 学生", kk: "Мен оқушымын", level: 1 },
  { text: "你 好 吗", kk: "Қалайсың?", level: 1 },
  { text: "我 很 好", kk: "Менің жағдайым жақсы", level: 1 },
  { text: "他 是 老师", kk: "Ол — мұғалім", level: 1 },
  { text: "我 爱 你", kk: "Мен сені сүйемін", level: 1 },
  { text: "她 很 漂亮", kk: "Ол өте әдемі", level: 1 },
  { text: "我 喝 茶", kk: "Мен шай ішемін", level: 1 },
  { text: "他 看 书", kk: "Ол кітап оқиды", level: 1 },
  { text: "今天 很 热", kk: "Бүгін ыстық", level: 1 },
  { text: "我 去 学校", kk: "Мен мектепке барамын", level: 1 },

  // ── Деңгей 2 ──
  { text: "我 喜欢 喝 咖啡", kk: "Мен кофе ішкенді ұнатамын", level: 2 },
  { text: "他 在 北京 工作", kk: "Ол Бейжіңде жұмыс істейді", level: 2 },
  { text: "我 有 一 个 哥哥", kk: "Менің бір ағам бар", level: 2 },
  { text: "你 住 在 哪儿", kk: "Сен қайда тұрасың?", level: 2 },
  { text: "我们 是 好 朋友", kk: "Біз жақсы доспыз", level: 2 },
  { text: "她 会 说 汉语", kk: "Ол қытайша сөйлей алады", level: 2 },
  { text: "今天 天气 很 好", kk: "Бүгін ауа райы жақсы", level: 2 },
  { text: "我 想 去 中国", kk: "Менің Қытайға барғым келеді", level: 2 },
  { text: "这 本 书 很 有意思", kk: "Бұл кітап өте қызықты", level: 2 },
  { text: "他 明天 来 我 家", kk: "Ол ертең біздің үйге келеді", level: 2 },

  // ── Деңгей 3 ──
  { text: "我 每天 早上 七点 起床", kk: "Мен күнде таңғы жетіде тұрамын", level: 3 },
  { text: "我 妈妈 在 医院 工作", kk: "Менің анам ауруханада жұмыс істейді", level: 3 },
  { text: "他 喜欢 在 家 看 电影", kk: "Ол үйде фильм көргенді ұнатады", level: 3 },
  { text: "我们 星期六 去 商店 买 东西", kk: "Біз сенбіде дүкенге зат алуға барамыз", level: 3 },
  { text: "我 朋友 会 说 三 个 语言", kk: "Менің досым үш тілде сөйлей алады", level: 3 },
  { text: "她 每天 学习 两 个 小时 汉语", kk: "Ол күнде екі сағат қытай тілін оқиды", level: 3 },
  { text: "今天 很 冷 你 多 穿 衣服", kk: "Бүгін суық, көбірек киін", level: 3 },
  { text: "我 想 买 一 个 新 手机", kk: "Мен жаңа телефон сатып алғым келеді", level: 3 },
  { text: "他们 在 饭馆 吃 米饭 喝 茶", kk: "Олар мейрамханада күріш жеп, шай ішеді", level: 3 },
  { text: "学习 汉语 很 有意思 也 很 难", kk: "Қытай тілін үйрену қызық та, қиын да", level: 3 },
];

// Тілге сай қорды алу
export function getSentences(lang: "en" | "zh"): BankSentence[] {
  return lang === "zh" ? chineseSentences : englishSentences;
}
