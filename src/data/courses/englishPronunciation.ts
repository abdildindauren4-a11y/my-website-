// filepath: src/data/courses/englishPronunciation.ts
// Тереңдетілген курс — English Pronunciation & Reading (сөздердің оқылуы).

import type { CourseLevel } from "@/types/course";

export const englishPronunciation: CourseLevel = {
  id: "en-pronunciation",
  level: "beginner",
  title: "English Pronunciation & Reading",
  titleKk: "Ағылшын сөздерінің оқылуы мен айтылуы",
  description: "Learn to read and pronounce English words correctly: sounds, stress and spelling rules.",
  descriptionKk: "Ағылшын сөздерін дұрыс оқып, айтуды үйреніңіз: дыбыстар, екпін, емле ережелері.",
  lang: "en",
  category: "Pronunciation", categoryKk: "Айтылым", emoji: "🗣️", color: "accent-pink",
  hours: 5, instructor: "LinguaFast Academy", certificate: true,
  skills: ["Read English words from their spelling", "Pronounce vowel and consonant sounds", "Place word stress correctly", "Handle silent letters and tricky spellings"],
  skillsKk: ["Емлесіне қарап сөзді оқу", "Дауысты/дауыссыз дыбыстарды айту", "Сөз екпінін дұрыс қою", "Үнсіз әріптер мен қиын емлені меңгеру"],
  units: [
    {
      id: "p-u1", number: 1, title: "Vowel Sounds", titleKk: "Дауысты дыбыстар",
      description: "Short vs long vowels, the magic 'e'", descriptionKk: "Қысқа/ұзын дауыстылар, сиқырлы 'e'",
      icon: "FileText", color: "accent-pink",
      lessons: [{
        id: "p-l1", type: "grammar", title: "Vowel Sounds & the Magic E", titleKk: "Дауыстылар және сиқырлы E",
        description: "How vowels change their sound", descriptionKk: "Дауыстылар дыбысын қалай өзгертеді",
        xpReward: 50, estimatedMinutes: 15,
        theory: {
          explanation: "English has 5 vowel letters (a, e, i, o, u) but around 20 vowel sounds. The same letter can sound short or long. A key rule: a silent 'e' at the end of a word usually makes the vowel 'say its name' (long).",
          explanationKk: "Ағылшында 5 дауысты әріп (a, e, i, o, u), бірақ шамамен 20 дауысты дыбыс бар. Бір әріп қысқа да, ұзын да айтылуы мүмкін. Негізгі ереже: сөз соңындағы үнсіз 'e' дауыстыны ұзын ('атын айтқызып') етеді.",
          sections: [
            { heading: "Short vowels", body: "cat /æ/, bed /e/, sit /ɪ/, hot /ɒ/, cup /ʌ/. Usually a single vowel between consonants is short: 'cat', 'pen', 'big'." },
            { heading: "The 'magic e' (long vowels)", body: "Add a silent 'e' and the vowel becomes long: cap → cape, kit → kite, hop → hope, cub → cube, pet → Pete. The 'e' is silent but changes the vowel before it." },
            { heading: "Vowel teams", body: "Two vowels together often make one long sound: ai/ay → /eɪ/ (rain, day), ee/ea → /iː/ (see, sea), oa → /oʊ/ (boat), oo → /uː/ (moon). Rule of thumb: 'when two vowels go walking, the first does the talking'." },
          ],
          keyPoints: [
            "Single vowel between consonants → usually short (cat, pen).",
            "Silent final 'e' → long vowel (cap→cape, hop→hope).",
            "ee/ea → /iː/ (see, sea); oa → /oʊ/ (boat).",
            "5 vowel letters, ~20 vowel sounds — listening matters.",
          ],
          examples: [
            { text: "cap /kæp/ → cape /keɪp/", translation: "'e' қосылғанда a ұзарады" },
            { text: "hop /hɒp/ → hope /hoʊp/", translation: "'e' қосылғанда o ұзарады" },
            { text: "see, sea, tree — /iː/", translation: "ee/ea ұзын 'и' дыбысы" },
          ],
        },
        exercises: [
          { id: "p1e1", type: "multiple-choice", prompt: "Which word has a LONG vowel (magic e)?", options: ["cap", "cape", "cat", "can"], answer: "cape" },
          { id: "p1e2", type: "multiple-choice", prompt: "Which word has a SHORT vowel?", options: ["kite", "bike", "sit", "line"], answer: "sit" },
          { id: "p1e3", type: "multiple-choice", prompt: "'hope' — why is the 'o' long?", options: ["It's a vowel team", "The silent final 'e'", "It's stressed", "No reason"], answer: "The silent final 'e'" },
          { id: "p1e4", type: "multiple-choice", prompt: "Which pair rhymes (same vowel sound)?", options: ["see – sea", "cat – cake", "hot – hope", "cup – cube"], answer: "see – sea" },
          { id: "p1e5", type: "multiple-choice", prompt: "'boat' — the 'oa' sounds like…", options: ["/ɒ/ as in hot", "/oʊ/ as in go", "/uː/ as in moon", "/æ/ as in cat"], answer: "/oʊ/ as in go" },
          { id: "p1e6", type: "multiple-choice", prompt: "Add magic e: 'kit' becomes…", options: ["kits", "kite", "kitt", "ket"], answer: "kite" },
          { id: "p1e7", type: "multiple-choice", prompt: "Which has the /uː/ sound (as in 'moon')?", options: ["book", "food", "good", "foot"], answer: "food" },
        ],
      }],
    },
    {
      id: "p-u2", number: 2, title: "Consonant Sounds", titleKk: "Дауыссыз дыбыстар",
      description: "th, sh, ch and tricky consonants", descriptionKk: "th, sh, ch және қиын дауыссыздар",
      icon: "FileText", color: "accent-blue",
      lessons: [{
        id: "p-l2", type: "grammar", title: "Tricky Consonants", titleKk: "Қиын дауыссыздар",
        description: "Digraphs and sounds that don't exist in Kazakh", descriptionKk: "Диграфтар және қазақта жоқ дыбыстар",
        xpReward: 50, estimatedMinutes: 15,
        theory: {
          explanation: "Some English consonant sounds are written with two letters (digraphs) and some do not exist in Kazakh, so they need practice. The most famous is 'th', which has two versions.",
          explanationKk: "Кейбір ағылшын дауыссыздары екі әріппен жазылады (диграф), кейбірі қазақ тілінде жоқ. Ең атақтысы — екі нұсқасы бар 'th'.",
          sections: [
            { heading: "The two 'th' sounds", body: "Voiced /ð/: this, that, mother, they. Voiceless /θ/: think, three, bath, mouth. Put your tongue between your teeth — not 'z' or 's', not 'т'." },
            { heading: "sh, ch, ph, wh", body: "sh /ʃ/: ship, wish. ch /tʃ/: chair, teacher. ph /f/: phone, photo. wh /w/: what, where (the 'h' is usually silent)." },
            { heading: "Sounds to watch", body: "/w/ vs /v/: 'west' ≠ 'vest'. /r/ is not rolled — the tongue doesn't touch. Final consonants must be pronounced: 'and' has a /d/." },
          ],
          keyPoints: [
            "'th' = tongue between teeth (/θ/ think, /ð/ this).",
            "ph = /f/ (phone), ch = /tʃ/ (chair), sh = /ʃ/ (ship).",
            "/w/ ≠ /v/: west vs vest.",
            "Pronounce final consonants clearly.",
          ],
          examples: [
            { text: "think /θɪŋk/ vs this /ðɪs/", translation: "th екі түрлі айтылады" },
            { text: "phone = /foʊn/", translation: "ph = 'ф' дыбысы" },
            { text: "chair = /tʃeər/", translation: "ch = 'ч' дыбысы" },
          ],
        },
        exercises: [
          { id: "p2e1", type: "multiple-choice", prompt: "'phone' starts with which sound?", options: ["/p/", "/f/", "/v/", "/h/"], answer: "/f/" },
          { id: "p2e2", type: "multiple-choice", prompt: "Which word has the VOICELESS 'th' /θ/?", options: ["this", "mother", "think", "they"], answer: "think" },
          { id: "p2e3", type: "multiple-choice", prompt: "'chair' begins with the same sound as…", options: ["ship", "cheese", "phone", "king"], answer: "cheese" },
          { id: "p2e4", type: "multiple-choice", prompt: "Which pair is different (/w/ vs /v/)?", options: ["west – vest", "wet – wet", "van – van", "win – win"], answer: "west – vest" },
          { id: "p2e5", type: "multiple-choice", prompt: "'ship' begins with…", options: ["/s/", "/ʃ/ (sh)", "/tʃ/ (ch)", "/z/"], answer: "/ʃ/ (sh)" },
          { id: "p2e6", type: "multiple-choice", prompt: "In 'what', the letters 'wh' sound like…", options: ["/v/", "/w/", "/h/", "/f/"], answer: "/w/" },
          { id: "p2e7", type: "multiple-choice", prompt: "Which word has voiced 'th' /ð/?", options: ["bath", "three", "mouth", "mother"], answer: "mother" },
        ],
      }],
    },
    {
      id: "p-u3", number: 3, title: "Word Stress", titleKk: "Сөз екпіні",
      description: "Which syllable to stress", descriptionKk: "Қай буынға екпін түседі",
      icon: "MessageSquare", color: "accent-green",
      lessons: [{
        id: "p-l3", type: "grammar", title: "Word & Sentence Stress", titleKk: "Сөз және сөйлем екпіні",
        description: "Stress changes meaning and clarity", descriptionKk: "Екпін мағына мен түсініктілікті өзгертеді",
        xpReward: 50, estimatedMinutes: 15,
        theory: {
          explanation: "In English, one syllable in a word is said louder and longer — that's word stress. Getting it wrong can make a word hard to understand even if every sound is correct. Some words even change meaning depending on stress.",
          explanationKk: "Ағылшында сөздің бір буыны қаттырақ әрі ұзағырақ айтылады — бұл сөз екпіні. Қате қойсаң, барлық дыбыс дұрыс болса да, сөз түсініксіз болады. Кейбір сөздің мағынасы екпінге қарай өзгереді.",
          sections: [
            { heading: "Word stress basics", body: "Two-syllable nouns usually stress the first syllable: TA-ble, WA-ter, DOC-tor. Many two-syllable verbs stress the second: to de-CIDE, to re-LAX." },
            { heading: "Noun vs verb stress", body: "Same spelling, different stress = different part of speech: a REcord (noun) vs to reCORD (verb); a PREsent (gift) vs to preSENT (to give). Stress the first for the noun, the second for the verb." },
            { heading: "Suffix rules", body: "Words ending in -tion/-sion stress the syllable before: informa-TION → infor-MA-tion. Words in -ic stress before it: eco-NOM-ic, fan-TAS-tic." },
          ],
          keyPoints: [
            "Every word has one main stressed syllable.",
            "Noun 'REcord' vs verb 'reCORD'.",
            "-tion/-sion: stress the syllable before it.",
            "Wrong stress = hard to understand, even with correct sounds.",
          ],
          examples: [
            { text: "PHO-to-graph → pho-TO-gra-pher", translation: "Екпін жұрнаққа қарай жылжиды" },
            { text: "a REcord (n) / to reCORD (v)", translation: "Екпін сөз табын өзгертеді" },
            { text: "informa-TION → infor-MA-tion", translation: "-tion алдындағы буынға екпін" },
          ],
        },
        exercises: [
          { id: "p3e1", type: "multiple-choice", prompt: "Where is the stress in the NOUN 'record'?", options: ["RE-cord (1st)", "re-CORD (2nd)", "No stress", "Both equal"], answer: "RE-cord (1st)" },
          { id: "p3e2", type: "multiple-choice", prompt: "Stress in 'information'?", options: ["IN-formation", "infor-MA-tion", "informa-TION", "in-FOR-mation"], answer: "infor-MA-tion" },
          { id: "p3e3", type: "multiple-choice", prompt: "Two-syllable noun 'water' is stressed on…", options: ["WA-ter (1st)", "wa-TER (2nd)", "neither", "both"], answer: "WA-ter (1st)" },
          { id: "p3e4", type: "multiple-choice", prompt: "The verb 'to present' is stressed on…", options: ["PRE-sent", "pre-SENT", "neither", "both"], answer: "pre-SENT" },
          { id: "p3e5", type: "multiple-choice", prompt: "Which is stressed correctly? 'economic'", options: ["E-conomic", "eco-NOM-ic", "econom-IC", "e-CO-nomic"], answer: "eco-NOM-ic" },
          { id: "p3e6", type: "multiple-choice", prompt: "Why does word stress matter?", options: ["It doesn't", "Wrong stress makes words hard to understand", "Only for spelling", "Only in writing"], answer: "Wrong stress makes words hard to understand" },
          { id: "p3e7", type: "multiple-choice", prompt: "'photographer' — stressed syllable?", options: ["PHO-tographer", "pho-TOG-rapher", "photo-GRAPH-er", "photograph-ER"], answer: "pho-TOG-rapher" },
        ],
      }],
    },
    {
      id: "p-u4", number: 4, title: "Silent Letters & Spelling", titleKk: "Үнсіз әріптер мен емле",
      description: "Letters you don't pronounce", descriptionKk: "Айтылмайтын әріптер",
      icon: "Dumbbell", color: "accent-gold",
      lessons: [{
        id: "p-l4", type: "practice", title: "Silent Letters", titleKk: "Үнсіз әріптер",
        description: "Common silent-letter patterns", descriptionKk: "Жиі үнсіз әріп үлгілері",
        xpReward: 60, estimatedMinutes: 15,
        theory: {
          explanation: "Many English words contain letters that are written but not pronounced. These 'silent letters' follow patterns, so once you know the patterns, spelling becomes far more predictable.",
          explanationKk: "Көп ағылшын сөзінде жазылатын, бірақ айтылмайтын әріптер бар. Бұл «үнсіз әріптер» үлгіге бағынады, сондықтан үлгіні білсең, оқу оңайлайды.",
          sections: [
            { heading: "Common silent letters", body: "silent k (kn-): know, knife, knee. silent w (wr-): write, wrong, wrist. silent b (-mb): comb, thumb, lamb, climb. silent l: could, should, walk, half. silent h: hour, honest, ghost." },
            { heading: "silent gh", body: "Often silent: night, light, though, high. Sometimes /f/: enough, laugh, cough, tough." },
            { heading: "silent e (again)", body: "Final 'e' is silent but changes vowels (make, time, hope) — see Module 1." },
          ],
          keyPoints: [
            "kn → 'n' (know, knife); wr → 'r' (write).",
            "-mb → silent b (thumb, climb).",
            "'hour', 'honest' → silent h.",
            "'gh' is usually silent (night) or /f/ (enough).",
          ],
          examples: [
            { text: "know, knife, knee → silent k", translation: "k айтылмайды" },
            { text: "write, wrong → silent w", translation: "w айтылмайды" },
            { text: "hour, honest → silent h", translation: "h айтылмайды" },
          ],
        },
        exercises: [
          { id: "p4e1", type: "multiple-choice", prompt: "Which letter is silent in 'know'?", options: ["k", "n", "o", "w"], answer: "k" },
          { id: "p4e2", type: "multiple-choice", prompt: "Which letter is silent in 'write'?", options: ["r", "w", "t", "e (also)"], answer: "w" },
          { id: "p4e3", type: "multiple-choice", prompt: "Silent letter in 'thumb'?", options: ["t", "h", "b", "m"], answer: "b" },
          { id: "p4e4", type: "multiple-choice", prompt: "In 'hour', which letter is silent?", options: ["h", "o", "u", "r"], answer: "h" },
          { id: "p4e5", type: "multiple-choice", prompt: "In which word is 'gh' pronounced /f/?", options: ["night", "high", "enough", "though"], answer: "enough" },
          { id: "p4e6", type: "multiple-choice", prompt: "Silent letter in 'could'?", options: ["c", "o", "l", "d"], answer: "l" },
          { id: "p4e7", type: "multiple-choice", prompt: "Which word has a silent 'k'?", options: ["kite", "knee", "kind", "keep"], answer: "knee" },
        ],
      }],
    },
  ],
};
