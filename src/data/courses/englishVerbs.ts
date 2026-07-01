// filepath: src/data/courses/englishVerbs.ts
// Тереңдетілген курс — English Verbs Deep Dive (ағылшын етістіктері).

import type { CourseLevel } from "@/types/course";

export const englishVerbs: CourseLevel = {
  id: "en-verbs",
  level: "intermediate",
  title: "English Verbs Deep Dive",
  titleKk: "Ағылшын етістіктерін тереңдете үйрену",
  description: "Master modal, irregular and phrasal verbs, plus gerunds and infinitives.",
  descriptionKk: "Модаль, тұрақсыз, фразалық етістіктер, gerund пен infinitive-ті меңгеріңіз.",
  lang: "en",
  category: "Grammar", categoryKk: "Грамматика", emoji: "🏃", color: "accent-blue",
  hours: 6, instructor: "LinguaFast Academy", certificate: true,
  skills: ["Use modal verbs for ability, advice and obligation", "Learn the most common irregular verbs", "Understand phrasal verbs", "Choose gerund or infinitive correctly"],
  skillsKk: ["Модаль етістіктерді қолдану", "Жиі тұрақсыз етістіктерді үйрену", "Фразалық етістіктерді түсіну", "Gerund/infinitive-ті дұрыс таңдау"],
  units: [
    {
      id: "v-u1", number: 1, title: "Modal Verbs", titleKk: "Модаль етістіктер",
      description: "can, must, should, may, might, could", descriptionKk: "can, must, should, may, might, could",
      icon: "FileText", color: "accent-blue",
      lessons: [{
        id: "v-l1", type: "grammar", title: "Modal Verbs", titleKk: "Модаль етістіктер",
        description: "Ability, permission, obligation, advice", descriptionKk: "Қабілет, рұқсат, міндет, кеңес",
        xpReward: 50, estimatedMinutes: 15,
        theory: {
          explanation: "Modal verbs (can, could, must, should, may, might, will, would) add meaning to a main verb: ability, possibility, permission, obligation or advice. They are followed by the bare infinitive (no 'to') and never take -s.",
          explanationKk: "Модаль етістіктер (can, must, should…) негізгі етістікке мағына қосады: қабілет, мүмкіндік, рұқсат, міндет, кеңес. Олардан кейін 'to'-сыз инфинитив келеді әрі -s жалғанбайды.",
          sections: [
            { heading: "Ability & permission", body: "can/could = ability or permission. 'I can swim.' 'Could I leave early?' (polite). Past ability: 'She could read at four.'" },
            { heading: "Obligation & necessity", body: "must / have to = strong obligation. 'You must wear a seatbelt.' mustn't = prohibition. don't have to = not necessary (different!). 'You don't have to come' ≠ 'You mustn't come'." },
            { heading: "Advice & possibility", body: "should/ought to = advice. 'You should rest.' may/might = possibility. 'It may rain.' 'She might be late.'" },
          ],
          keyPoints: [
            "Modal + bare infinitive: 'can swim', not 'can to swim'.",
            "Never add -s: 'He can', not 'He cans'.",
            "mustn't = forbidden; don't have to = not necessary.",
            "should = advice; must = strong obligation.",
          ],
          examples: [
            { text: "You should see a doctor.", translation: "Дәрігерге көрінген жөн. (кеңес)" },
            { text: "You mustn't smoke here.", translation: "Мұнда темекі шегуге болмайды. (тыйым)" },
            { text: "It might rain later.", translation: "Кейінірек жаңбыр жаууы мүмкін." },
          ],
        },
        exercises: [
          { id: "v1e1", type: "multiple-choice", prompt: "Advice: 'You ___ see a doctor.'", options: ["must", "should", "can", "might"], answer: "should" },
          { id: "v1e2", type: "multiple-choice", prompt: "Which is correct?", options: ["He can to swim.", "He can swim.", "He cans swim.", "He can swims."], answer: "He can swim." },
          { id: "v1e3", type: "multiple-choice", prompt: "Prohibition: 'You ___ smoke in the hospital.'", options: ["don't have to", "mustn't", "should", "could"], answer: "mustn't" },
          { id: "v1e4", type: "fill-blank", prompt: "Possibility", sentence: "Take an umbrella — it ___ rain.", answer: "might", acceptableAnswers: ["may", "could"] },
          { id: "v1e5", type: "multiple-choice", prompt: "'It's optional.' = ", options: ["You mustn't come.", "You don't have to come.", "You must come.", "You can't come."], answer: "You don't have to come." },
          { id: "v1e6", type: "word-order", prompt: "Order (polite request).", sentence: "Could|you|help|me|please", answer: "Could you help me please" },
          { id: "v1e7", type: "fill-blank", prompt: "Obligation", sentence: "Drivers ___ wear a seatbelt. (obligation)", answer: "must" },
        ],
      }],
    },
    {
      id: "v-u2", number: 2, title: "Irregular Verbs", titleKk: "Тұрақсыз етістіктер",
      description: "The most common irregular verb forms", descriptionKk: "Ең жиі тұрақсыз етістік формалары",
      icon: "FileText", color: "accent-purple",
      lessons: [{
        id: "v-l2", type: "grammar", title: "Irregular Verbs", titleKk: "Тұрақсыз етістіктер",
        description: "V1 – V2 – V3 forms you must know", descriptionKk: "Білу міндетті V1–V2–V3 формалары",
        xpReward: 50, estimatedMinutes: 15,
        theory: {
          explanation: "Irregular verbs don't follow the -ed rule. You need three forms: base (V1), past simple (V2) and past participle (V3). Learning them in sound groups makes memorising easier.",
          explanationKk: "Тұрақсыз етістіктер -ed ережесіне бағынбайды. Үш форма керек: негізгі (V1), өткен шақ (V2), есімше (V3). Оларды дыбыс топтарымен үйрену жеңіл.",
          sections: [
            { heading: "Same in all three", body: "cut–cut–cut, put–put–put, let–let–let, hit–hit–hit, cost–cost–cost." },
            { heading: "Same V2 = V3", body: "buy–bought–bought, bring–brought–brought, teach–taught–taught, think–thought–thought, find–found–found, make–made–made." },
            { heading: "All three different", body: "go–went–gone, see–saw–seen, do–did–done, eat–ate–eaten, write–wrote–written, speak–spoke–spoken, take–took–taken, give–gave–given." },
          ],
          keyPoints: [
            "V2 for Past Simple: 'I went'.",
            "V3 for Perfect tenses & passive: 'I have gone', 'It was written'.",
            "Group by sound to memorise faster.",
            "'go' → went → gone (very common, irregular).",
          ],
          examples: [
            { text: "I go → I went → I have gone", translation: "бару: go – went – gone" },
            { text: "She writes → wrote → has written", translation: "жазу: write – wrote – written" },
            { text: "They take → took → have taken", translation: "алу: take – took – taken" },
          ],
        },
        exercises: [
          { id: "v2e1", type: "multiple-choice", prompt: "Past simple (V2) of 'go'?", options: ["goed", "went", "gone", "going"], answer: "went" },
          { id: "v2e2", type: "multiple-choice", prompt: "Past participle (V3) of 'write'?", options: ["wrote", "writed", "written", "writ"], answer: "written" },
          { id: "v2e3", type: "fill-blank", prompt: "Past simple", sentence: "She ___ (buy) a new dress yesterday.", answer: "bought" },
          { id: "v2e4", type: "fill-blank", prompt: "Present Perfect (V3)", sentence: "I have ___ (eat) already.", answer: "eaten" },
          { id: "v2e5", type: "multiple-choice", prompt: "Which verb is the same in all three forms?", options: ["go", "cut", "see", "take"], answer: "cut" },
          { id: "v2e6", type: "fill-blank", prompt: "Past simple", sentence: "He ___ (think) about it for a long time.", answer: "thought" },
          { id: "v2e7", type: "multiple-choice", prompt: "V3 of 'take'?", options: ["took", "taken", "taked", "takes"], answer: "taken" },
        ],
      }],
    },
    {
      id: "v-u3", number: 3, title: "Phrasal Verbs", titleKk: "Фразалық етістіктер",
      description: "Verb + particle combinations", descriptionKk: "Етістік + шылау тіркестері",
      icon: "MessageSquare", color: "accent-green",
      lessons: [{
        id: "v-l3", type: "grammar", title: "Phrasal Verbs", titleKk: "Фразалық етістіктер",
        description: "Common phrasal verbs and their meanings", descriptionKk: "Жиі фразалық етістіктер мен мағыналары",
        xpReward: 50, estimatedMinutes: 15,
        theory: {
          explanation: "A phrasal verb = verb + particle (up, out, on, off…). The particle often changes the meaning completely: 'give' vs 'give up'. Native speakers use them constantly, so they are essential for natural English.",
          explanationKk: "Фразалық етістік = етістік + шылау (up, out, on…). Шылау мағынаны мүлде өзгертеді: 'give' vs 'give up'. Ағылшынтілділер оларды үнемі қолданады.",
          sections: [
            { heading: "Everyday phrasal verbs", body: "get up (тұру), turn on/off (қосу/өшіру), look for (іздеу), find out (білу), give up (тастау/бас тарту), come back (қайту)." },
            { heading: "Separable vs inseparable", body: "Separable: 'turn the light off' / 'turn off the light' (both OK); with a pronoun it MUST split: 'turn it off' (not 'turn off it'). Inseparable: 'look after him' (not 'look him after')." },
            { heading: "Multi-meaning", body: "Many have several meanings: 'work out' = exercise OR solve; 'pick up' = collect OR learn casually. Context decides." },
          ],
          keyPoints: [
            "Particle changes meaning: give ≠ give up.",
            "With a pronoun, separable ones split: 'turn it off'.",
            "Learn them in context, not as isolated words.",
            "One phrasal verb can have several meanings.",
          ],
          examples: [
            { text: "Please turn off the lights.", translation: "Шамды өшіріңізші." },
            { text: "Don't give up!", translation: "Бас тартпа!" },
            { text: "I need to find out the truth.", translation: "Шындықты білуім керек." },
          ],
        },
        exercises: [
          { id: "v3e1", type: "multiple-choice", prompt: "'give up' means…", options: ["to start", "to quit / stop trying", "to receive", "to sell"], answer: "to quit / stop trying" },
          { id: "v3e2", type: "fill-blank", prompt: "Complete", sentence: "Please turn ___ the TV, it's too loud.", answer: "off" },
          { id: "v3e3", type: "multiple-choice", prompt: "Correct with a pronoun:", options: ["Turn off it.", "Turn it off.", "Off turn it.", "It turn off."], answer: "Turn it off." },
          { id: "v3e4", type: "fill-blank", prompt: "Complete", sentence: "I need to look ___ my keys — I can't find them.", answer: "for" },
          { id: "v3e5", type: "multiple-choice", prompt: "'find out' means…", options: ["to lose", "to discover information", "to exit", "to hide"], answer: "to discover information" },
          { id: "v3e6", type: "word-order", prompt: "Order the sentence.", sentence: "I|get|up|at|seven|every|morning", answer: "I get up at seven every morning" },
          { id: "v3e7", type: "multiple-choice", prompt: "'work out' can mean…", options: ["only to sleep", "to exercise or to solve", "to eat", "to drive"], answer: "to exercise or to solve" },
        ],
      }],
    },
    {
      id: "v-u4", number: 4, title: "Gerunds & Infinitives", titleKk: "Gerund және Infinitive",
      description: "-ing vs to + verb", descriptionKk: "-ing пен to + етістік",
      icon: "Dumbbell", color: "accent-gold",
      lessons: [{
        id: "v-l4", type: "grammar", title: "Gerund or Infinitive?", titleKk: "Gerund па, infinitive пе?",
        description: "Which form after which verb", descriptionKk: "Қай етістіктен кейін қай форма",
        xpReward: 60, estimatedMinutes: 15,
        theory: {
          explanation: "After certain verbs we use a gerund (V-ing); after others we use the infinitive (to + V). Some verbs take either. This is mostly learned by memorising common patterns.",
          explanationKk: "Кейбір етістіктерден кейін gerund (V-ing), басқаларынан кейін infinitive (to + V) қолданылады. Кейбірі екеуін де қабылдайды. Бұл негізінен жаттау арқылы үйреніледі.",
          sections: [
            { heading: "Verbs + gerund (-ing)", body: "enjoy, avoid, finish, mind, suggest, keep, practise, imagine.\nEx: 'I enjoy reading.' 'She avoided answering.'" },
            { heading: "Verbs + infinitive (to)", body: "want, decide, hope, plan, need, promise, agree, learn, would like.\nEx: 'I want to go.' 'They decided to leave.'" },
            { heading: "After prepositions → gerund", body: "Always -ing after a preposition: 'good at cooking', 'interested in learning', 'before leaving'." },
          ],
          keyPoints: [
            "enjoy/avoid/finish + -ing.",
            "want/decide/hope/need + to + verb.",
            "After a preposition → always -ing.",
            "'I look forward to seeing you' (to = preposition → -ing!).",
          ],
          examples: [
            { text: "I enjoy learning languages.", translation: "Мен тіл үйренуді ұнатамын." },
            { text: "She decided to study abroad.", translation: "Ол шетелде оқуды шешті." },
            { text: "He is good at drawing.", translation: "Ол сурет салуға шебер." },
          ],
        },
        exercises: [
          { id: "v4e1", type: "multiple-choice", prompt: "Choose: 'I enjoy ___ books.'", options: ["to read", "reading", "read", "reads"], answer: "reading" },
          { id: "v4e2", type: "multiple-choice", prompt: "Choose: 'She decided ___ early.'", options: ["leaving", "to leave", "leave", "leaves"], answer: "to leave" },
          { id: "v4e3", type: "fill-blank", prompt: "After a preposition", sentence: "He is interested in ___ (learn) Chinese.", answer: "learning" },
          { id: "v4e4", type: "multiple-choice", prompt: "Choose: 'They want ___ a house.'", options: ["buying", "to buy", "buy", "bought"], answer: "to buy" },
          { id: "v4e5", type: "fill-blank", prompt: "After 'avoid'", sentence: "You should avoid ___ (eat) too much sugar.", answer: "eating" },
          { id: "v4e6", type: "multiple-choice", prompt: "Choose: 'I'm good at ___.'", options: ["to cook", "cooking", "cook", "cooked"], answer: "cooking" },
          { id: "v4e7", type: "word-order", prompt: "Order the sentence.", sentence: "We|hope|to|see|you|soon", answer: "We hope to see you soon" },
        ],
      }],
    },
  ],
};
