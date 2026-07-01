// filepath: src/data/courses/englishTenses.ts
// Тереңдетілген курс — English Tenses Mastery (ағылшын шақтары).
// Әр модуль бір шақ тобын терең қарайды: теория + тапсырма.

import type { CourseLevel } from "@/types/course";

export const englishTenses: CourseLevel = {
  id: "en-tenses",
  level: "intermediate",
  title: "English Tenses Mastery",
  titleKk: "Ағылшын шақтарын толық меңгеру",
  description: "A deep dive into all 12 English tenses — form, use and common mistakes.",
  descriptionKk: "Ағылшынның барлық 12 шағын тереңдете үйрену — құрылымы, қолданысы, қателері.",
  lang: "en",
  category: "Grammar", categoryKk: "Грамматика", emoji: "⏳", color: "accent-purple",
  hours: 6, instructor: "LinguaFast Academy", certificate: true,
  skills: [
    "Understand all 12 English tenses",
    "Choose the correct tense naturally",
    "Master present, past, future and perfect aspects",
    "Avoid the most common tense mistakes",
  ],
  skillsKk: [
    "12 ағылшын шағын түсіну",
    "Дұрыс шақты табиғи таңдау",
    "Осы, өткен, келер және perfect аспектілерін меңгеру",
    "Ең жиі шақ қателерін болдырмау",
  ],
  units: [
    // ── МОДУЛЬ 1: Present tenses ──
    {
      id: "t-u1", number: 1, title: "Present Tenses", titleKk: "Осы шақтар",
      description: "Present Simple, Continuous, Perfect, Perfect Continuous", descriptionKk: "Present Simple, Continuous, Perfect, Perfect Continuous",
      icon: "FileText", color: "accent-purple",
      lessons: [{
        id: "t-l1", type: "grammar", title: "The Four Present Tenses", titleKk: "Төрт осы шақ",
        description: "When and how to use each present tense", descriptionKk: "Әр осы шақты қашан және қалай қолдану",
        xpReward: 50, estimatedMinutes: 15,
        theory: {
          explanation: "English has four present tenses. Each expresses a different relationship between the action and 'now'. Choosing the right one depends on whether the action is a habit, happening now, connected to the past, or ongoing.",
          explanationKk: "Ағылшында төрт осы шақ бар. Әрқайсысы әрекеттің «қазір» уақытымен байланысын әртүрлі көрсетеді. Дұрыс таңдау әрекеттің әдет пе, қазір бе, өткенмен байланысты ма, әлде жалғасып жатыр ма екеніне байланысты.",
          sections: [
            { heading: "Present Simple — habits & facts", body: "Form: V1 (+s for he/she/it). Use: routines, facts, timetables.\nEx: 'She works in a bank.' 'Water boils at 100°C.'\nSignals: always, usually, every day, never." },
            { heading: "Present Continuous — happening now", body: "Form: am/is/are + V-ing. Use: actions now or around now, temporary situations, future arrangements.\nEx: 'I am studying right now.' 'We are meeting him tomorrow.'\nSignals: now, at the moment, currently." },
            { heading: "Present Perfect — past + present link", body: "Form: have/has + V3. Use: past actions with a present result, experience, unfinished time.\nEx: 'I have finished my work.' 'She has never been to Japan.'\nSignals: just, already, yet, ever, never, since, for." },
            { heading: "Present Perfect Continuous — duration", body: "Form: have/has been + V-ing. Use: an action that started in the past and is still continuing, emphasising duration.\nEx: 'I have been learning English for three years.'\nSignals: for, since, how long, lately." },
          ],
          keyPoints: [
            "Present Simple = habits/facts; add -s for he/she/it.",
            "Present Continuous = happening now (am/is/are + -ing).",
            "Present Perfect = past action with a link to now (have/has + V3).",
            "Use 'since' + point in time, 'for' + period of time.",
          ],
          examples: [
            { text: "She works in a hospital.", translation: "Ол ауруханада жұмыс істейді. (әдет)" },
            { text: "I am reading a book now.", translation: "Мен қазір кітап оқып жатырмын." },
            { text: "I have lived here for five years.", translation: "Мен мұнда бес жыл тұрып келемін." },
          ],
        },
        exercises: [
          { id: "t1e1", type: "multiple-choice", prompt: "Choose the correct sentence (habit).", options: ["She is working here every day.", "She works here every day.", "She work here every day.", "She has work here every day."], answer: "She works here every day." },
          { id: "t1e2", type: "fill-blank", prompt: "Present Continuous (now)", sentence: "Look! It ___ (rain) now.", answer: "is raining" },
          { id: "t1e3", type: "fill-blank", prompt: "Present Perfect", sentence: "I ___ (finish) my homework already.", answer: "have finished" },
          { id: "t1e4", type: "multiple-choice", prompt: "Which uses Present Perfect Continuous correctly?", options: ["I am learning English for years.", "I have been learning English for years.", "I learn English for years.", "I was learning English for years."], answer: "I have been learning English for years." },
          { id: "t1e5", type: "multiple-choice", prompt: "Choose the correct word: 'I have lived here ___ 2019.'", options: ["for", "since", "from", "during"], answer: "since" },
          { id: "t1e6", type: "fill-blank", prompt: "Present Simple (3rd person)", sentence: "Water ___ (boil) at 100 degrees.", answer: "boils" },
          { id: "t1e7", type: "word-order", prompt: "Order the words (Present Perfect).", sentence: "She|has|never|been|to|Japan", answer: "She has never been to Japan" },
        ],
      }],
    },
    // ── МОДУЛЬ 2: Past tenses ──
    {
      id: "t-u2", number: 2, title: "Past Tenses", titleKk: "Өткен шақтар",
      description: "Past Simple, Continuous, Perfect, Perfect Continuous", descriptionKk: "Past Simple, Continuous, Perfect, Perfect Continuous",
      icon: "FileText", color: "accent-blue",
      lessons: [{
        id: "t-l2", type: "grammar", title: "The Four Past Tenses", titleKk: "Төрт өткен шақ",
        description: "Narrating the past accurately", descriptionKk: "Өткенді дәл баяндау",
        xpReward: 50, estimatedMinutes: 15,
        theory: {
          explanation: "Past tenses let you tell stories and describe finished actions. The key skill is combining them: a longer background action (Continuous) interrupted by a shorter one (Simple), or an earlier past action (Perfect) before another past action.",
          explanationKk: "Өткен шақтар оқиға айтуға және аяқталған әрекетті сипаттауға көмектеседі. Басты дағды — оларды үйлестіру: ұзақ фон әрекет (Continuous) қысқа әрекетпен (Simple) үзіледі; немесе бір өткеннен бұрынғы әрекет (Perfect).",
          sections: [
            { heading: "Past Simple — finished actions", body: "Form: V2 (regular -ed; irregular special). Use: completed past actions with a time.\nEx: 'I visited Paris in 2019.' 'She bought a car.'\nWatch irregulars: go→went, see→saw, buy→bought." },
            { heading: "Past Continuous — action in progress", body: "Form: was/were + V-ing. Use: an action in progress at a past moment; background in a story.\nEx: 'I was sleeping when the phone rang.'" },
            { heading: "Past Perfect — the earlier past", body: "Form: had + V3. Use: an action that happened before another past action.\nEx: 'The train had left when we arrived.' (leaving = first)" },
            { heading: "Past Perfect Continuous — duration before past", body: "Form: had been + V-ing. Use: how long something had been happening up to a past point.\nEx: 'She was tired because she had been working all day.'" },
          ],
          keyPoints: [
            "Past Simple for finished actions; learn irregular verbs.",
            "Past Continuous = was/were + -ing (background/interrupted action).",
            "Past Perfect (had + V3) = the earlier of two past actions.",
            "Combine: 'I was cooking when he called.'",
          ],
          examples: [
            { text: "I was watching TV when she called.", translation: "Ол қоңырау шалғанда мен теледидар көріп отыр едім." },
            { text: "They had left before I arrived.", translation: "Мен келгенше олар кетіп қалған еді." },
            { text: "He bought a new phone yesterday.", translation: "Ол кеше жаңа телефон сатып алды." },
          ],
        },
        exercises: [
          { id: "t2e1", type: "fill-blank", prompt: "Past Simple (irregular)", sentence: "I ___ (buy) a new laptop yesterday.", answer: "bought" },
          { id: "t2e2", type: "multiple-choice", prompt: "Choose the correct sentence.", options: ["I was sleep when he came.", "I was sleeping when he came.", "I sleeping when he came.", "I sleep when he came."], answer: "I was sleeping when he came." },
          { id: "t2e3", type: "fill-blank", prompt: "Past Perfect", sentence: "The film ___ (start) before we arrived.", answer: "had started" },
          { id: "t2e4", type: "multiple-choice", prompt: "Which action happened FIRST? 'When I arrived, they had eaten.'", options: ["I arrived", "They had eaten", "At the same time", "Neither"], answer: "They had eaten" },
          { id: "t2e5", type: "fill-blank", prompt: "Past Simple (irregular)", sentence: "She ___ (go) to the market this morning.", answer: "went" },
          { id: "t2e6", type: "word-order", prompt: "Order the words (Past Continuous).", sentence: "We|were|driving|home|when|it|started|to|snow", answer: "We were driving home when it started to snow" },
          { id: "t2e7", type: "multiple-choice", prompt: "Correct past form of 'see'?", options: ["seed", "saw", "seen", "sawed"], answer: "saw" },
        ],
      }],
    },
    // ── МОДУЛЬ 3: Future tenses ──
    {
      id: "t-u3", number: 3, title: "Future Forms", titleKk: "Келер шақ формалары",
      description: "will, going to, present forms for the future", descriptionKk: "will, going to, болашаққа осы шақ формалары",
      icon: "FileText", color: "accent-green",
      lessons: [{
        id: "t-l3", type: "grammar", title: "Talking About the Future", titleKk: "Болашақ туралы айту",
        description: "will vs going to vs present continuous", descriptionKk: "will, going to, present continuous айырмасы",
        xpReward: 50, estimatedMinutes: 15,
        theory: {
          explanation: "English has several ways to talk about the future, and the choice depends on how certain or planned the action is. 'will' for decisions/predictions, 'going to' for plans/evidence, present continuous for fixed arrangements.",
          explanationKk: "Ағылшында болашақты айтудың бірнеше жолы бар; таңдау әрекеттің қаншалықты жоспарлы/сенімді екеніне байланысты. 'will' — шешім/болжам, 'going to' — жоспар/дәлел, present continuous — бекітілген жоспар.",
          sections: [
            { heading: "'will' — decisions & predictions", body: "Form: will + V1. Use: instant decisions, promises, predictions, offers.\nEx: 'I'll help you.' 'It will rain tomorrow.' 'I think he will win.'" },
            { heading: "'be going to' — plans & evidence", body: "Form: am/is/are going to + V1. Use: prior plans/intentions, predictions based on evidence.\nEx: 'We are going to travel this summer.' 'Look at those clouds — it's going to rain.'" },
            { heading: "Present Continuous — fixed arrangements", body: "Use: definite arrangements with a time/place, often with other people.\nEx: 'I'm meeting the doctor at 5 pm.' 'They're flying to Rome on Monday.'" },
            { heading: "Present Simple — timetables", body: "Use: scheduled events (transport, cinema).\nEx: 'The train leaves at 9.' 'The film starts at 8.'" },
          ],
          keyPoints: [
            "'will' = decide now, predict, promise.",
            "'going to' = already planned, or evidence you can see.",
            "Present Continuous = fixed arrangement with a time.",
            "Present Simple = timetables and schedules.",
          ],
          examples: [
            { text: "I'll call you later.", translation: "Мен саған кейінірек қоңырау шаламын. (шешім)" },
            { text: "We are going to buy a house.", translation: "Біз үй сатып алмақпыз. (жоспар)" },
            { text: "The train leaves at 9 a.m.", translation: "Пойыз таңғы 9-да жүреді. (кесте)" },
          ],
        },
        exercises: [
          { id: "t3e1", type: "multiple-choice", prompt: "Instant decision: 'The phone is ringing. I ___ answer it.'", options: ["will", "am going to", "answer", "would"], answer: "will" },
          { id: "t3e2", type: "multiple-choice", prompt: "A plan you made before: 'We ___ visit grandma this weekend.'", options: ["will", "are going to", "visit", "would"], answer: "are going to" },
          { id: "t3e3", type: "fill-blank", prompt: "Evidence-based prediction", sentence: "Look at the sky! It's ___ to rain.", answer: "going" },
          { id: "t3e4", type: "multiple-choice", prompt: "Fixed arrangement with time: which is best?", options: ["I meet the doctor at 5.", "I'm meeting the doctor at 5.", "I will meet doctor at 5 maybe.", "I meeting doctor 5."], answer: "I'm meeting the doctor at 5." },
          { id: "t3e5", type: "fill-blank", prompt: "Timetable (Present Simple)", sentence: "The film ___ (start) at eight o'clock.", answer: "starts" },
          { id: "t3e6", type: "word-order", prompt: "Order the words (prediction).", sentence: "I|think|our|team|will|win|the|match", answer: "I think our team will win the match" },
          { id: "t3e7", type: "multiple-choice", prompt: "Which is a promise?", options: ["I'll always support you.", "I support maybe.", "I am support you.", "Support will I."], answer: "I'll always support you." },
        ],
      }],
    },
    // ── МОДУЛЬ 4: Choosing the right tense ──
    {
      id: "t-u4", number: 4, title: "Choosing the Right Tense", titleKk: "Дұрыс шақты таңдау",
      description: "Mixed practice and common mistakes", descriptionKk: "Аралас жаттығу және жиі қателер",
      icon: "Dumbbell", color: "accent-gold",
      lessons: [{
        id: "t-l4", type: "practice", title: "Tense Review & Common Mistakes", titleKk: "Шақтарды қайталау және қателер",
        description: "Put it all together", descriptionKk: "Бәрін біріктіру",
        xpReward: 60, estimatedMinutes: 15,
        theory: {
          explanation: "Most tense mistakes come from a few habits: forgetting -s in Present Simple, using Present Simple for actions happening now, mixing up 'since' and 'for', and using Present Perfect with a finished time word like 'yesterday'.",
          explanationKk: "Шақ қателерінің көбі бірнеше әдеттен: Present Simple-де -s ұмыту, қазіргі әрекетке Present Simple қолдану, 'since'/'for' шатастыру, Present Perfect-ті 'yesterday' сияқты аяқталған уақытпен қолдану.",
          keyPoints: [
            "❌ 'yesterday' + Present Perfect → ✅ Past Simple: 'I saw him yesterday.'",
            "❌ 'He go' → ✅ 'He goes'.",
            "❌ 'since two years' → ✅ 'for two years' / 'since 2022'.",
            "'I am agree' ❌ → 'I agree' ✅ (state verb).",
          ],
          examples: [
            { text: "I saw that film yesterday. (NOT have seen)", translation: "Мен ол фильмді кеше көрдім." },
            { text: "He goes to school by bus.", translation: "Ол мектепке автобуспен барады." },
          ],
        },
        exercises: [
          { id: "t4e1", type: "multiple-choice", prompt: "Fix: 'I have seen him yesterday.'", options: ["I have saw him yesterday.", "I saw him yesterday.", "I seen him yesterday.", "I have seen him yesterday."], answer: "I saw him yesterday." },
          { id: "t4e2", type: "fill-blank", prompt: "Correct tense", sentence: "Right now she ___ (talk) on the phone.", answer: "is talking" },
          { id: "t4e3", type: "multiple-choice", prompt: "Choose: 'They ___ here for ten years.'", options: ["live", "are living", "have lived", "lived"], answer: "have lived" },
          { id: "t4e4", type: "fill-blank", prompt: "Past narrative", sentence: "When I arrived, the meeting ___ (already/start).", answer: "had already started", acceptableAnswers: ["had started already"] },
          { id: "t4e5", type: "multiple-choice", prompt: "Correct: 'since' or 'for'? 'I've known her ___ 2015.'", options: ["for", "since", "during", "from"], answer: "since" },
          { id: "t4e6", type: "multiple-choice", prompt: "Which is correct?", options: ["I am agree with you.", "I agree with you.", "I agreeing with you.", "I have agree with you."], answer: "I agree with you." },
          { id: "t4e7", type: "word-order", prompt: "Order (future plan).", sentence: "We|are|going|to|start|a|business", answer: "We are going to start a business" },
        ],
      }],
    },
  ],
};
