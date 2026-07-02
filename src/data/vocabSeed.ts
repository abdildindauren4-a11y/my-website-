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

  // ── Тамақ ──
  { lang: "en", term: "food", phonetic: "/fuːd/", translation: "тамақ", partOfSpeech: "noun", example: "The food is delicious.", tags: ["food", "essential"] },
  { lang: "en", term: "water", phonetic: "/ˈwɔːtər/", translation: "су", partOfSpeech: "noun", example: "Drink more water.", tags: ["food", "essential"] },
  { lang: "en", term: "bread", phonetic: "/bred/", translation: "нан", partOfSpeech: "noun", example: "Fresh bread smells great.", tags: ["food"] },
  { lang: "en", term: "milk", phonetic: "/mɪlk/", translation: "сүт", partOfSpeech: "noun", example: "A glass of milk.", tags: ["food"] },
  { lang: "en", term: "meat", phonetic: "/miːt/", translation: "ет", partOfSpeech: "noun", example: "I don't eat meat.", tags: ["food"] },
  { lang: "en", term: "tea", phonetic: "/tiː/", translation: "шай", partOfSpeech: "noun", example: "Would you like some tea?", tags: ["food"] },
  { lang: "en", term: "coffee", phonetic: "/ˈkɒfi/", translation: "кофе", partOfSpeech: "noun", example: "I drink coffee every morning.", tags: ["food"] },
  { lang: "en", term: "apple", phonetic: "/ˈæpl/", translation: "алма", partOfSpeech: "noun", example: "An apple a day.", tags: ["food"] },
  { lang: "en", term: "egg", phonetic: "/eɡ/", translation: "жұмыртқа", partOfSpeech: "noun", example: "I ate two eggs.", tags: ["food"] },
  { lang: "en", term: "fruit", phonetic: "/fruːt/", translation: "жеміс", partOfSpeech: "noun", example: "Eat more fruit.", tags: ["food"] },
  { lang: "en", term: "vegetable", phonetic: "/ˈvedʒtəbl/", translation: "көкөніс", partOfSpeech: "noun", example: "Vegetables are healthy.", tags: ["food"] },
  { lang: "en", term: "sugar", phonetic: "/ˈʃʊɡər/", translation: "қант", partOfSpeech: "noun", example: "No sugar, please.", tags: ["food"] },
  { lang: "en", term: "salt", phonetic: "/sɔːlt/", translation: "тұз", partOfSpeech: "noun", example: "Pass the salt, please.", tags: ["food"] },
  { lang: "en", term: "dinner", phonetic: "/ˈdɪnər/", translation: "кешкі ас", partOfSpeech: "noun", example: "Dinner is ready.", tags: ["food"] },
  { lang: "en", term: "hungry", phonetic: "/ˈhʌŋɡri/", translation: "аш", partOfSpeech: "adjective", example: "I am very hungry.", tags: ["food", "adjectives"] },

  // ── Саяхат ──
  { lang: "en", term: "travel", phonetic: "/ˈtrævl/", translation: "саяхаттау", partOfSpeech: "verb", example: "I love to travel.", tags: ["travel"] },
  { lang: "en", term: "airport", phonetic: "/ˈeərpɔːrt/", translation: "әуежай", partOfSpeech: "noun", example: "The airport is far away.", tags: ["travel"] },
  { lang: "en", term: "ticket", phonetic: "/ˈtɪkɪt/", translation: "билет", partOfSpeech: "noun", example: "I bought a ticket.", tags: ["travel"] },
  { lang: "en", term: "hotel", phonetic: "/hoʊˈtel/", translation: "қонақүй", partOfSpeech: "noun", example: "We stayed at a hotel.", tags: ["travel"] },
  { lang: "en", term: "city", phonetic: "/ˈsɪti/", translation: "қала", partOfSpeech: "noun", example: "Almaty is a big city.", tags: ["travel"] },
  { lang: "en", term: "country", phonetic: "/ˈkʌntri/", translation: "ел", partOfSpeech: "noun", example: "Kazakhstan is a large country.", tags: ["travel"] },
  { lang: "en", term: "road", phonetic: "/roʊd/", translation: "жол", partOfSpeech: "noun", example: "The road is long.", tags: ["travel"] },
  { lang: "en", term: "train", phonetic: "/treɪn/", translation: "пойыз", partOfSpeech: "noun", example: "The train leaves at nine.", tags: ["travel"] },
  { lang: "en", term: "plane", phonetic: "/pleɪn/", translation: "ұшақ", partOfSpeech: "noun", example: "The plane is landing.", tags: ["travel"] },
  { lang: "en", term: "map", phonetic: "/mæp/", translation: "карта", partOfSpeech: "noun", example: "Look at the map.", tags: ["travel"] },
  { lang: "en", term: "passport", phonetic: "/ˈpæspɔːrt/", translation: "төлқұжат", partOfSpeech: "noun", example: "Show your passport.", tags: ["travel"] },
  { lang: "en", term: "luggage", phonetic: "/ˈlʌɡɪdʒ/", translation: "жүк", partOfSpeech: "noun", example: "My luggage is heavy.", tags: ["travel"] },

  // ── Табиғат ──
  { lang: "en", term: "sun", phonetic: "/sʌn/", translation: "күн (аспандағы)", partOfSpeech: "noun", example: "The sun is shining.", tags: ["nature"] },
  { lang: "en", term: "moon", phonetic: "/muːn/", translation: "ай (аспандағы)", partOfSpeech: "noun", example: "The moon is bright tonight.", tags: ["nature"] },
  { lang: "en", term: "sky", phonetic: "/skaɪ/", translation: "аспан", partOfSpeech: "noun", example: "The sky is blue.", tags: ["nature"] },
  { lang: "en", term: "tree", phonetic: "/triː/", translation: "ағаш", partOfSpeech: "noun", example: "A tall tree.", tags: ["nature"] },
  { lang: "en", term: "flower", phonetic: "/ˈflaʊər/", translation: "гүл", partOfSpeech: "noun", example: "She likes flowers.", tags: ["nature"] },
  { lang: "en", term: "river", phonetic: "/ˈrɪvər/", translation: "өзен", partOfSpeech: "noun", example: "The river is deep.", tags: ["nature"] },
  { lang: "en", term: "mountain", phonetic: "/ˈmaʊntən/", translation: "тау", partOfSpeech: "noun", example: "We climbed the mountain.", tags: ["nature"] },
  { lang: "en", term: "sea", phonetic: "/siː/", translation: "теңіз", partOfSpeech: "noun", example: "I swim in the sea.", tags: ["nature"] },
  { lang: "en", term: "weather", phonetic: "/ˈweðər/", translation: "ауа райы", partOfSpeech: "noun", example: "The weather is nice.", tags: ["nature"] },
  { lang: "en", term: "rain", phonetic: "/reɪn/", translation: "жаңбыр", partOfSpeech: "noun", example: "It will rain tomorrow.", tags: ["nature"] },
  { lang: "en", term: "snow", phonetic: "/snoʊ/", translation: "қар", partOfSpeech: "noun", example: "Snow is falling.", tags: ["nature"] },
  { lang: "en", term: "wind", phonetic: "/wɪnd/", translation: "жел", partOfSpeech: "noun", example: "The wind is strong.", tags: ["nature"] },
  { lang: "en", term: "animal", phonetic: "/ˈænɪml/", translation: "жануар", partOfSpeech: "noun", example: "Wild animals live here.", tags: ["nature"] },
  { lang: "en", term: "horse", phonetic: "/hɔːrs/", translation: "жылқы", partOfSpeech: "noun", example: "Kazakhs love horses.", tags: ["nature"] },

  // ── Үй ──
  { lang: "en", term: "house", phonetic: "/haʊs/", translation: "үй", partOfSpeech: "noun", example: "A big house.", tags: ["home", "essential"] },
  { lang: "en", term: "room", phonetic: "/ruːm/", translation: "бөлме", partOfSpeech: "noun", example: "My room is clean.", tags: ["home"] },
  { lang: "en", term: "door", phonetic: "/dɔːr/", translation: "есік", partOfSpeech: "noun", example: "Open the door.", tags: ["home"] },
  { lang: "en", term: "window", phonetic: "/ˈwɪndoʊ/", translation: "терезе", partOfSpeech: "noun", example: "Close the window.", tags: ["home"] },
  { lang: "en", term: "table", phonetic: "/ˈteɪbl/", translation: "үстел", partOfSpeech: "noun", example: "The book is on the table.", tags: ["home"] },
  { lang: "en", term: "chair", phonetic: "/tʃeər/", translation: "орындық", partOfSpeech: "noun", example: "Sit on the chair.", tags: ["home"] },
  { lang: "en", term: "bed", phonetic: "/bed/", translation: "төсек", partOfSpeech: "noun", example: "Go to bed early.", tags: ["home"] },
  { lang: "en", term: "kitchen", phonetic: "/ˈkɪtʃɪn/", translation: "ас үй", partOfSpeech: "noun", example: "She is in the kitchen.", tags: ["home"] },
  { lang: "en", term: "key", phonetic: "/kiː/", translation: "кілт", partOfSpeech: "noun", example: "Where is my key?", tags: ["home"] },
  { lang: "en", term: "clean", phonetic: "/kliːn/", translation: "таза", partOfSpeech: "adjective", example: "The room is clean.", tags: ["home", "adjectives"] },

  // ── Жұмыс / оқу ──
  { lang: "en", term: "work", phonetic: "/wɜːrk/", translation: "жұмыс", partOfSpeech: "noun", example: "I go to work.", tags: ["work", "essential"] },
  { lang: "en", term: "school", phonetic: "/skuːl/", translation: "мектеп", partOfSpeech: "noun", example: "The school is near.", tags: ["work"] },
  { lang: "en", term: "teacher", phonetic: "/ˈtiːtʃər/", translation: "мұғалім", partOfSpeech: "noun", example: "Our teacher is kind.", tags: ["work"] },
  { lang: "en", term: "student", phonetic: "/ˈstjuːdnt/", translation: "студент", partOfSpeech: "noun", example: "She is a student.", tags: ["work"] },
  { lang: "en", term: "book", phonetic: "/bʊk/", translation: "кітап", partOfSpeech: "noun", example: "Read this book.", tags: ["work", "essential"] },
  { lang: "en", term: "lesson", phonetic: "/ˈlesn/", translation: "сабақ", partOfSpeech: "noun", example: "The lesson starts now.", tags: ["work"] },
  { lang: "en", term: "question", phonetic: "/ˈkwestʃən/", translation: "сұрақ", partOfSpeech: "noun", example: "I have a question.", tags: ["work", "essential"] },
  { lang: "en", term: "answer", phonetic: "/ˈɑːnsər/", translation: "жауап", partOfSpeech: "noun", example: "What is the answer?", tags: ["work", "essential"] },
  { lang: "en", term: "money", phonetic: "/ˈmʌni/", translation: "ақша", partOfSpeech: "noun", example: "Money can't buy happiness.", tags: ["work", "essential"] },
  { lang: "en", term: "job", phonetic: "/dʒɒb/", translation: "жұмыс орны", partOfSpeech: "noun", example: "She found a new job.", tags: ["work"] },
  { lang: "en", term: "office", phonetic: "/ˈɒfɪs/", translation: "кеңсе", partOfSpeech: "noun", example: "He works in an office.", tags: ["work"] },
  { lang: "en", term: "computer", phonetic: "/kəmˈpjuːtər/", translation: "компьютер", partOfSpeech: "noun", example: "Turn on the computer.", tags: ["work", "tech"] },
  { lang: "en", term: "phone", phonetic: "/foʊn/", translation: "телефон", partOfSpeech: "noun", example: "My phone is new.", tags: ["work", "tech"] },
  { lang: "en", term: "language", phonetic: "/ˈlæŋɡwɪdʒ/", translation: "тіл", partOfSpeech: "noun", example: "I learn two languages.", tags: ["work", "essential"] },

  // ── Етістіктер 2 ──
  { lang: "en", term: "read", phonetic: "/riːd/", translation: "оқу", partOfSpeech: "verb", example: "I read every night.", tags: ["verbs", "essential"] },
  { lang: "en", term: "write", phonetic: "/raɪt/", translation: "жазу", partOfSpeech: "verb", example: "Write your name.", tags: ["verbs", "essential"] },
  { lang: "en", term: "speak", phonetic: "/spiːk/", translation: "сөйлеу", partOfSpeech: "verb", example: "Do you speak English?", tags: ["verbs", "essential"] },
  { lang: "en", term: "listen", phonetic: "/ˈlɪsn/", translation: "тыңдау", partOfSpeech: "verb", example: "Listen to me carefully.", tags: ["verbs", "essential"] },
  { lang: "en", term: "eat", phonetic: "/iːt/", translation: "жеу", partOfSpeech: "verb", example: "Let's eat lunch.", tags: ["verbs", "essential"] },
  { lang: "en", term: "drink", phonetic: "/drɪŋk/", translation: "ішу", partOfSpeech: "verb", example: "Drink your tea.", tags: ["verbs"] },
  { lang: "en", term: "sleep", phonetic: "/sliːp/", translation: "ұйықтау", partOfSpeech: "verb", example: "I sleep eight hours.", tags: ["verbs"] },
  { lang: "en", term: "run", phonetic: "/rʌn/", translation: "жүгіру", partOfSpeech: "verb", example: "He runs every morning.", tags: ["verbs"] },
  { lang: "en", term: "walk", phonetic: "/wɔːk/", translation: "жаяу жүру", partOfSpeech: "verb", example: "Let's walk to the park.", tags: ["verbs"] },
  { lang: "en", term: "buy", phonetic: "/baɪ/", translation: "сатып алу", partOfSpeech: "verb", example: "I want to buy a car.", tags: ["verbs", "essential"] },
  { lang: "en", term: "open", phonetic: "/ˈoʊpən/", translation: "ашу", partOfSpeech: "verb", example: "Open your books.", tags: ["verbs"] },
  { lang: "en", term: "close", phonetic: "/kloʊz/", translation: "жабу", partOfSpeech: "verb", example: "Close the door, please.", tags: ["verbs"] },
  { lang: "en", term: "start", phonetic: "/stɑːrt/", translation: "бастау", partOfSpeech: "verb", example: "Let's start the lesson.", tags: ["verbs", "essential"] },
  { lang: "en", term: "finish", phonetic: "/ˈfɪnɪʃ/", translation: "аяқтау", partOfSpeech: "verb", example: "Finish your homework.", tags: ["verbs"] },
  { lang: "en", term: "help", phonetic: "/help/", translation: "көмектесу", partOfSpeech: "verb", example: "Can you help me?", tags: ["verbs", "essential"] },
  { lang: "en", term: "play", phonetic: "/pleɪ/", translation: "ойнау", partOfSpeech: "verb", example: "Children play outside.", tags: ["verbs"] },
  { lang: "en", term: "live", phonetic: "/lɪv/", translation: "өмір сүру", partOfSpeech: "verb", example: "I live in Astana.", tags: ["verbs", "essential"] },
  { lang: "en", term: "give", phonetic: "/ɡɪv/", translation: "беру", partOfSpeech: "verb", example: "Give me the book.", tags: ["verbs", "essential"] },
  { lang: "en", term: "understand", phonetic: "/ˌʌndərˈstænd/", translation: "түсіну", partOfSpeech: "verb", example: "Do you understand?", tags: ["verbs", "essential"] },
  { lang: "en", term: "remember", phonetic: "/rɪˈmembər/", translation: "есте сақтау", partOfSpeech: "verb", example: "Remember this word.", tags: ["verbs"] },
  { lang: "en", term: "forget", phonetic: "/fərˈɡet/", translation: "ұмыту", partOfSpeech: "verb", example: "Don't forget your keys.", tags: ["verbs"] },
  { lang: "en", term: "wait", phonetic: "/weɪt/", translation: "күту", partOfSpeech: "verb", example: "Wait for me.", tags: ["verbs"] },
  { lang: "en", term: "ask", phonetic: "/ɑːsk/", translation: "сұрау", partOfSpeech: "verb", example: "Ask a question.", tags: ["verbs", "essential"] },
  { lang: "en", term: "learn", phonetic: "/lɜːrn/", translation: "үйрену", partOfSpeech: "verb", example: "I learn English online.", tags: ["verbs", "essential"] },

  // ── Сын есімдер 2 ──
  { lang: "en", term: "big", phonetic: "/bɪɡ/", translation: "үлкен", partOfSpeech: "adjective", example: "A big city.", tags: ["adjectives", "essential"] },
  { lang: "en", term: "small", phonetic: "/smɔːl/", translation: "кішкентай", partOfSpeech: "adjective", example: "A small gift.", tags: ["adjectives", "essential"] },
  { lang: "en", term: "hot", phonetic: "/hɒt/", translation: "ыстық", partOfSpeech: "adjective", example: "The tea is hot.", tags: ["adjectives"] },
  { lang: "en", term: "cold", phonetic: "/koʊld/", translation: "суық", partOfSpeech: "adjective", example: "Winter is cold.", tags: ["adjectives"] },
  { lang: "en", term: "fast", phonetic: "/fɑːst/", translation: "жылдам", partOfSpeech: "adjective", example: "A fast car.", tags: ["adjectives"] },
  { lang: "en", term: "slow", phonetic: "/sloʊ/", translation: "баяу", partOfSpeech: "adjective", example: "The internet is slow.", tags: ["adjectives"] },
  { lang: "en", term: "old", phonetic: "/oʊld/", translation: "ескі / кәрі", partOfSpeech: "adjective", example: "An old building.", tags: ["adjectives"] },
  { lang: "en", term: "young", phonetic: "/jʌŋ/", translation: "жас", partOfSpeech: "adjective", example: "A young man.", tags: ["adjectives"] },
  { lang: "en", term: "long", phonetic: "/lɒŋ/", translation: "ұзын", partOfSpeech: "adjective", example: "A long road.", tags: ["adjectives"] },
  { lang: "en", term: "short", phonetic: "/ʃɔːrt/", translation: "қысқа", partOfSpeech: "adjective", example: "A short story.", tags: ["adjectives"] },
  { lang: "en", term: "strong", phonetic: "/strɒŋ/", translation: "күшті", partOfSpeech: "adjective", example: "Strong coffee.", tags: ["adjectives"] },
  { lang: "en", term: "expensive", phonetic: "/ɪkˈspensɪv/", translation: "қымбат", partOfSpeech: "adjective", example: "This phone is expensive.", tags: ["adjectives"] },
  { lang: "en", term: "cheap", phonetic: "/tʃiːp/", translation: "арзан", partOfSpeech: "adjective", example: "Cheap tickets.", tags: ["adjectives"] },
  { lang: "en", term: "tired", phonetic: "/ˈtaɪərd/", translation: "шаршаған", partOfSpeech: "adjective", example: "I am tired today.", tags: ["adjectives", "emotions"] },
  { lang: "en", term: "angry", phonetic: "/ˈæŋɡri/", translation: "ашулы", partOfSpeech: "adjective", example: "Don't be angry.", tags: ["adjectives", "emotions"] },
  { lang: "en", term: "sad", phonetic: "/sæd/", translation: "мұңды", partOfSpeech: "adjective", example: "Why are you sad?", tags: ["adjectives", "emotions"] },
  { lang: "en", term: "funny", phonetic: "/ˈfʌni/", translation: "күлкілі", partOfSpeech: "adjective", example: "A funny story.", tags: ["adjectives", "emotions"] },
  { lang: "en", term: "interesting", phonetic: "/ˈɪntrəstɪŋ/", translation: "қызықты", partOfSpeech: "adjective", example: "An interesting film.", tags: ["adjectives"] },

  // ── Түстер ──
  { lang: "en", term: "red", phonetic: "/red/", translation: "қызыл", partOfSpeech: "adjective", example: "A red apple.", tags: ["colors"] },
  { lang: "en", term: "blue", phonetic: "/bluː/", translation: "көк", partOfSpeech: "adjective", example: "The blue sky.", tags: ["colors"] },
  { lang: "en", term: "green", phonetic: "/ɡriːn/", translation: "жасыл", partOfSpeech: "adjective", example: "Green grass.", tags: ["colors"] },
  { lang: "en", term: "white", phonetic: "/waɪt/", translation: "ақ", partOfSpeech: "adjective", example: "White snow.", tags: ["colors"] },
  { lang: "en", term: "black", phonetic: "/blæk/", translation: "қара", partOfSpeech: "adjective", example: "A black cat.", tags: ["colors"] },
  { lang: "en", term: "yellow", phonetic: "/ˈjeloʊ/", translation: "сары", partOfSpeech: "adjective", example: "A yellow flower.", tags: ["colors"] },

  // ── Дене / денсаулық ──
  { lang: "en", term: "head", phonetic: "/hed/", translation: "бас", partOfSpeech: "noun", example: "My head hurts.", tags: ["body"] },
  { lang: "en", term: "hand", phonetic: "/hænd/", translation: "қол", partOfSpeech: "noun", example: "Raise your hand.", tags: ["body"] },
  { lang: "en", term: "eye", phonetic: "/aɪ/", translation: "көз", partOfSpeech: "noun", example: "She has blue eyes.", tags: ["body"] },
  { lang: "en", term: "heart", phonetic: "/hɑːrt/", translation: "жүрек", partOfSpeech: "noun", example: "My heart is beating fast.", tags: ["body"] },
  { lang: "en", term: "doctor", phonetic: "/ˈdɒktər/", translation: "дәрігер", partOfSpeech: "noun", example: "See a doctor.", tags: ["body", "health"] },
  { lang: "en", term: "medicine", phonetic: "/ˈmedsn/", translation: "дәрі", partOfSpeech: "noun", example: "Take your medicine.", tags: ["body", "health"] },
  { lang: "en", term: "healthy", phonetic: "/ˈhelθi/", translation: "дені сау", partOfSpeech: "adjective", example: "Healthy food.", tags: ["body", "health"] },
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

  // ── Сандар (жалғасы) ──
  { lang: "zh", term: "四", phonetic: "sì", translation: "төрт", partOfSpeech: "number", example: "四个人", tags: ["numbers", "hsk1"] },
  { lang: "zh", term: "五", phonetic: "wǔ", translation: "бес", partOfSpeech: "number", example: "五本书", tags: ["numbers", "hsk1"] },
  { lang: "zh", term: "六", phonetic: "liù", translation: "алты", partOfSpeech: "number", example: "六点", tags: ["numbers", "hsk1"] },
  { lang: "zh", term: "七", phonetic: "qī", translation: "жеті", partOfSpeech: "number", example: "七天", tags: ["numbers", "hsk1"] },
  { lang: "zh", term: "八", phonetic: "bā", translation: "сегіз", partOfSpeech: "number", example: "八岁", tags: ["numbers", "hsk1"] },
  { lang: "zh", term: "九", phonetic: "jiǔ", translation: "тоғыз", partOfSpeech: "number", example: "九月", tags: ["numbers", "hsk1"] },

  // ── Отбасы ──
  { lang: "zh", term: "爸爸", phonetic: "bàba", translation: "әке", partOfSpeech: "noun", example: "我爸爸是医生。", tags: ["family", "hsk1"] },
  { lang: "zh", term: "妈妈", phonetic: "māma", translation: "ана", partOfSpeech: "noun", example: "我妈妈很好。", tags: ["family", "hsk1"] },
  { lang: "zh", term: "哥哥", phonetic: "gēge", translation: "аға", partOfSpeech: "noun", example: "我有一个哥哥。", tags: ["family", "hsk2"] },
  { lang: "zh", term: "姐姐", phonetic: "jiějie", translation: "әпке", partOfSpeech: "noun", example: "姐姐在学校。", tags: ["family", "hsk2"] },
  { lang: "zh", term: "弟弟", phonetic: "dìdi", translation: "іні", partOfSpeech: "noun", example: "弟弟五岁。", tags: ["family", "hsk2"] },
  { lang: "zh", term: "妹妹", phonetic: "mèimei", translation: "қарындас/сіңлі", partOfSpeech: "noun", example: "妹妹很可爱。", tags: ["family", "hsk2"] },
  { lang: "zh", term: "家", phonetic: "jiā", translation: "үй / отбасы", partOfSpeech: "noun", example: "我在家。", tags: ["family", "hsk1"] },

  // ── Уақыт ──
  { lang: "zh", term: "今天", phonetic: "jīntiān", translation: "бүгін", partOfSpeech: "noun", example: "今天很热。", tags: ["time", "hsk1"] },
  { lang: "zh", term: "明天", phonetic: "míngtiān", translation: "ертең", partOfSpeech: "noun", example: "明天见！", tags: ["time", "hsk1"] },
  { lang: "zh", term: "昨天", phonetic: "zuótiān", translation: "кеше", partOfSpeech: "noun", example: "昨天我很忙。", tags: ["time", "hsk1"] },
  { lang: "zh", term: "现在", phonetic: "xiànzài", translation: "қазір", partOfSpeech: "noun", example: "现在几点？", tags: ["time", "hsk1"] },
  { lang: "zh", term: "年", phonetic: "nián", translation: "жыл", partOfSpeech: "noun", example: "去年", tags: ["time", "hsk1"] },
  { lang: "zh", term: "月", phonetic: "yuè", translation: "ай (уақыт)", partOfSpeech: "noun", example: "一月", tags: ["time", "hsk1"] },
  { lang: "zh", term: "星期", phonetic: "xīngqī", translation: "апта", partOfSpeech: "noun", example: "星期一", tags: ["time", "hsk1"] },
  { lang: "zh", term: "小时", phonetic: "xiǎoshí", translation: "сағат (ұзақтық)", partOfSpeech: "noun", example: "两个小时", tags: ["time", "hsk2"] },

  // ── Етістіктер (жалғасы) ──
  { lang: "zh", term: "说", phonetic: "shuō", translation: "сөйлеу / айту", partOfSpeech: "verb", example: "你说什么？", tags: ["verbs", "hsk1"] },
  { lang: "zh", term: "听", phonetic: "tīng", translation: "тыңдау", partOfSpeech: "verb", example: "听音乐", tags: ["verbs", "hsk1"] },
  { lang: "zh", term: "读", phonetic: "dú", translation: "оқу (дауыстап)", partOfSpeech: "verb", example: "读书", tags: ["verbs", "hsk1"] },
  { lang: "zh", term: "写", phonetic: "xiě", translation: "жазу", partOfSpeech: "verb", example: "写字", tags: ["verbs", "hsk1"] },
  { lang: "zh", term: "买", phonetic: "mǎi", translation: "сатып алу", partOfSpeech: "verb", example: "我买水果。", tags: ["verbs", "hsk1"] },
  { lang: "zh", term: "坐", phonetic: "zuò", translation: "отыру", partOfSpeech: "verb", example: "请坐！", tags: ["verbs", "hsk1"] },
  { lang: "zh", term: "住", phonetic: "zhù", translation: "тұру (мекендеу)", partOfSpeech: "verb", example: "你住在哪儿？", tags: ["verbs", "hsk1"] },
  { lang: "zh", term: "来", phonetic: "lái", translation: "келу", partOfSpeech: "verb", example: "你来我家。", tags: ["verbs", "hsk1"] },
  { lang: "zh", term: "回", phonetic: "huí", translation: "қайту", partOfSpeech: "verb", example: "回家", tags: ["verbs", "hsk1"] },
  { lang: "zh", term: "想", phonetic: "xiǎng", translation: "ойлау / қалау", partOfSpeech: "verb", example: "我想去中国。", tags: ["verbs", "hsk1"] },
  { lang: "zh", term: "喜欢", phonetic: "xǐhuan", translation: "ұнату", partOfSpeech: "verb", example: "我喜欢咖啡。", tags: ["verbs", "hsk1"] },
  { lang: "zh", term: "工作", phonetic: "gōngzuò", translation: "жұмыс істеу", partOfSpeech: "verb", example: "他在北京工作。", tags: ["verbs", "hsk1"] },
  { lang: "zh", term: "睡觉", phonetic: "shuìjiào", translation: "ұйықтау", partOfSpeech: "verb", example: "我要睡觉。", tags: ["verbs", "hsk1"] },
  { lang: "zh", term: "做", phonetic: "zuò", translation: "істеу / жасау", partOfSpeech: "verb", example: "你做什么？", tags: ["verbs", "hsk1"] },
  { lang: "zh", term: "有", phonetic: "yǒu", translation: "бар (ие болу)", partOfSpeech: "verb", example: "我有一本书。", tags: ["verbs", "hsk1"] },
  { lang: "zh", term: "会", phonetic: "huì", translation: "білу (қабілет)", partOfSpeech: "verb", example: "我会说汉语。", tags: ["verbs", "hsk1"] },
  { lang: "zh", term: "给", phonetic: "gěi", translation: "беру", partOfSpeech: "verb", example: "给我看看。", tags: ["verbs", "hsk2"] },
  { lang: "zh", term: "帮助", phonetic: "bāngzhù", translation: "көмектесу", partOfSpeech: "verb", example: "谢谢你的帮助。", tags: ["verbs", "hsk2"] },

  // ── Зат есімдер (жалғасы) ──
  { lang: "zh", term: "水", phonetic: "shuǐ", translation: "су", partOfSpeech: "noun", example: "喝水", tags: ["food", "hsk1"] },
  { lang: "zh", term: "茶", phonetic: "chá", translation: "шай", partOfSpeech: "noun", example: "喝茶", tags: ["food", "hsk1"] },
  { lang: "zh", term: "米饭", phonetic: "mǐfàn", translation: "күріш (ас)", partOfSpeech: "noun", example: "吃米饭", tags: ["food", "hsk1"] },
  { lang: "zh", term: "苹果", phonetic: "píngguǒ", translation: "алма", partOfSpeech: "noun", example: "一个苹果", tags: ["food", "hsk1"] },
  { lang: "zh", term: "书", phonetic: "shū", translation: "кітап", partOfSpeech: "noun", example: "看书", tags: ["nouns", "hsk1"] },
  { lang: "zh", term: "钱", phonetic: "qián", translation: "ақша", partOfSpeech: "noun", example: "多少钱？", tags: ["nouns", "hsk1"] },
  { lang: "zh", term: "电脑", phonetic: "diànnǎo", translation: "компьютер", partOfSpeech: "noun", example: "我的电脑", tags: ["tech", "hsk1"] },
  { lang: "zh", term: "手机", phonetic: "shǒujī", translation: "телефон", partOfSpeech: "noun", example: "新手机", tags: ["tech", "hsk2"] },
  { lang: "zh", term: "电影", phonetic: "diànyǐng", translation: "фильм", partOfSpeech: "noun", example: "看电影", tags: ["nouns", "hsk1"] },
  { lang: "zh", term: "天气", phonetic: "tiānqì", translation: "ауа райы", partOfSpeech: "noun", example: "今天天气很好。", tags: ["nature", "hsk1"] },
  { lang: "zh", term: "学校", phonetic: "xuéxiào", translation: "мектеп", partOfSpeech: "noun", example: "去学校", tags: ["places", "hsk1"] },
  { lang: "zh", term: "商店", phonetic: "shāngdiàn", translation: "дүкен", partOfSpeech: "noun", example: "商店在哪儿？", tags: ["places", "hsk1"] },
  { lang: "zh", term: "医院", phonetic: "yīyuàn", translation: "аурухана", partOfSpeech: "noun", example: "去医院", tags: ["places", "hsk1"] },
  { lang: "zh", term: "饭馆", phonetic: "fànguǎn", translation: "мейрамхана", partOfSpeech: "noun", example: "在饭馆吃饭", tags: ["places", "hsk1"] },
  { lang: "zh", term: "北京", phonetic: "Běijīng", translation: "Бейжің", partOfSpeech: "noun", example: "我去北京。", tags: ["places", "hsk1"] },
  { lang: "zh", term: "猫", phonetic: "māo", translation: "мысық", partOfSpeech: "noun", example: "一只猫", tags: ["nature", "hsk1"] },
  { lang: "zh", term: "狗", phonetic: "gǒu", translation: "ит", partOfSpeech: "noun", example: "小狗", tags: ["nature", "hsk1"] },

  // ── Сын есімдер ──
  { lang: "zh", term: "大", phonetic: "dà", translation: "үлкен", partOfSpeech: "adjective", example: "大城市", tags: ["adjectives", "hsk1"] },
  { lang: "zh", term: "小", phonetic: "xiǎo", translation: "кішкентай", partOfSpeech: "adjective", example: "小狗", tags: ["adjectives", "hsk1"] },
  { lang: "zh", term: "多", phonetic: "duō", translation: "көп", partOfSpeech: "adjective", example: "很多人", tags: ["adjectives", "hsk1"] },
  { lang: "zh", term: "少", phonetic: "shǎo", translation: "аз", partOfSpeech: "adjective", example: "很少", tags: ["adjectives", "hsk1"] },
  { lang: "zh", term: "冷", phonetic: "lěng", translation: "суық", partOfSpeech: "adjective", example: "今天很冷。", tags: ["adjectives", "hsk1"] },
  { lang: "zh", term: "热", phonetic: "rè", translation: "ыстық", partOfSpeech: "adjective", example: "天气很热。", tags: ["adjectives", "hsk1"] },
  { lang: "zh", term: "高兴", phonetic: "gāoxìng", translation: "қуанышты", partOfSpeech: "adjective", example: "认识你很高兴。", tags: ["adjectives", "hsk1"] },
  { lang: "zh", term: "漂亮", phonetic: "piàoliang", translation: "әдемі", partOfSpeech: "adjective", example: "她很漂亮。", tags: ["adjectives", "hsk1"] },
  { lang: "zh", term: "忙", phonetic: "máng", translation: "бос емес", partOfSpeech: "adjective", example: "我很忙。", tags: ["adjectives", "hsk2"] },
  { lang: "zh", term: "累", phonetic: "lèi", translation: "шаршаған", partOfSpeech: "adjective", example: "我累了。", tags: ["adjectives", "hsk2"] },
  { lang: "zh", term: "贵", phonetic: "guì", translation: "қымбат", partOfSpeech: "adjective", example: "太贵了！", tags: ["adjectives", "hsk2"] },
  { lang: "zh", term: "便宜", phonetic: "piányi", translation: "арзан", partOfSpeech: "adjective", example: "很便宜", tags: ["adjectives", "hsk2"] },

  // ── Есімдіктер / сұрақ сөздер ──
  { lang: "zh", term: "我们", phonetic: "wǒmen", translation: "біз", partOfSpeech: "pronoun", example: "我们是朋友。", tags: ["pronouns", "hsk1"] },
  { lang: "zh", term: "他们", phonetic: "tāmen", translation: "олар", partOfSpeech: "pronoun", example: "他们在学校。", tags: ["pronouns", "hsk1"] },
  { lang: "zh", term: "这", phonetic: "zhè", translation: "бұл", partOfSpeech: "pronoun", example: "这是什么？", tags: ["pronouns", "hsk1"] },
  { lang: "zh", term: "那", phonetic: "nà", translation: "анау", partOfSpeech: "pronoun", example: "那是我的书。", tags: ["pronouns", "hsk1"] },
  { lang: "zh", term: "什么", phonetic: "shénme", translation: "не", partOfSpeech: "pronoun", example: "这是什么？", tags: ["questions", "hsk1"] },
  { lang: "zh", term: "谁", phonetic: "shéi", translation: "кім", partOfSpeech: "pronoun", example: "他是谁？", tags: ["questions", "hsk1"] },
  { lang: "zh", term: "哪儿", phonetic: "nǎr", translation: "қайда", partOfSpeech: "pronoun", example: "你去哪儿？", tags: ["questions", "hsk1"] },
  { lang: "zh", term: "多少", phonetic: "duōshao", translation: "қанша", partOfSpeech: "pronoun", example: "多少钱？", tags: ["questions", "hsk1"] },
];

export const vocabSeed: SeedWord[] = [...english, ...chinese];

// Статистика
export const seedStats = {
  total: vocabSeed.length,
  english: english.length,
  chinese: chinese.length,
};
