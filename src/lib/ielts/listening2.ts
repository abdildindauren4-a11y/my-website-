// filepath: src/lib/ielts/listening2.ts
// IELTS Listening — 2-тест. 4 бөлім, 40 сұрақ.
// Аудио мәтіні (audioLines) барлық жауаптарды қамтиды.

import type { ListeningTest } from "@/types/ielts";

export const listeningTest2: ListeningTest = {
  id: "listening-test-2",
  title: "Listening — Test 2",
  titleKk: "Тыңдау — 2-тест",
  type: "listening",
  totalQuestions: 40,
  sections: [
    // ═══════════ SECTION 1 — Gym membership ═══════════
    {
      id: "l2s1", number: 1, title: "Gym Membership", titleKk: "Спортзал мүшелігі",
      context: "A conversation between a new customer and a gym receptionist.",
      contextKk: "Жаңа қолданушы мен спортзал әкімшісі арасындағы әңгіме.",
      difficulty: "easy",
      audioLines: [
        { speaker: "Receptionist", text: "Good afternoon, FitLife Gym. How can I help you?", pauseAfter: 0.5 },
        { speaker: "Customer", text: "Hi, I'd like to join the gym. What memberships do you offer?", pauseAfter: 0.5 },
        { speaker: "Receptionist", text: "We have a standard plan and a premium plan. The standard one costs forty dollars a month.", pauseAfter: 0.5 },
        { speaker: "Customer", text: "And what does the premium plan include?", pauseAfter: 0.5 },
        { speaker: "Receptionist", text: "Premium is sixty dollars and includes the swimming pool and free classes.", pauseAfter: 0.5 },
        { speaker: "Customer", text: "I'll take the premium plan, then. When is the gym open?", pauseAfter: 0.5 },
        { speaker: "Receptionist", text: "We open at six in the morning and close at eleven at night, every day.", pauseAfter: 0.5 },
        { speaker: "Customer", text: "Great. Do I need to bring anything for the first session?", pauseAfter: 0.5 },
        { speaker: "Receptionist", text: "Just bring a towel and your trainers. Could I have your full name?", pauseAfter: 0.5 },
        { speaker: "Customer", text: "It's Daniel Carter. C-A-R-T-E-R.", pauseAfter: 0.5 },
        { speaker: "Receptionist", text: "Thank you. The induction with a personal trainer is on Monday at ten o'clock.", pauseAfter: 0.5 },
        { speaker: "Customer", text: "Perfect, I'll be there.", pauseAfter: 0.5 },
      ],
      groups: [
        {
          id: "l2s1g1", type: "sentence-completion", wordLimit: 2,
          instruction: "Complete the membership form. Write NO MORE THAN TWO WORDS OR A NUMBER for each answer.",
          instructionKk: "Мүшелік формасын толтырыңыз. Әр жауапқа ЕКІ СӨЗ немесе САН жазыңыз.",
          questions: [
            { id: "l2q1", type: "sentence-completion", number: 1, prompt: "Standard plan price: $_______ per month", answer: "40", acceptableAnswers: ["forty"], explanation: "Стандарт жоспар — айына 40 доллар.", paragraphRef: 0 },
            { id: "l2q2", type: "sentence-completion", number: 2, prompt: "Premium plan price: $_______ per month", answer: "60", acceptableAnswers: ["sixty"], explanation: "Премиум — 60 доллар.", paragraphRef: 0 },
            { id: "l2q3", type: "sentence-completion", number: 3, prompt: "Premium includes the pool and free _______.", answer: "classes", explanation: "Премиумға бассейн мен тегін сабақтар кіреді.", paragraphRef: 0 },
            { id: "l2q4", type: "sentence-completion", number: 4, prompt: "The gym opens at _______ a.m.", answer: "6", acceptableAnswers: ["six"], explanation: "Таңғы 6-да ашылады.", paragraphRef: 0 },
            { id: "l2q5", type: "sentence-completion", number: 5, prompt: "Customer's surname: _______", answer: "Carter", explanation: "Daniel Carter.", paragraphRef: 0 },
            { id: "l2q6", type: "sentence-completion", number: 6, prompt: "Bring a towel and your _______.", answer: "trainers", explanation: "Орамал мен кроссовка алып келу керек.", paragraphRef: 0 },
          ],
        },
        {
          id: "l2s1g2", type: "true-false-notgiven",
          instruction: "Do the following statements agree with the conversation? Choose TRUE, FALSE or NOT GIVEN.",
          instructionKk: "Төмендегі тұжырымдар әңгімеге сай ма? TRUE, FALSE немесе NOT GIVEN таңдаңыз.",
          questions: [
            { id: "l2q7", type: "true-false-notgiven", number: 7, prompt: "The customer chose the premium plan.", answer: "TRUE", explanation: "Премиум жоспарды таңдады.", paragraphRef: 0 },
            { id: "l2q8", type: "true-false-notgiven", number: 8, prompt: "The gym is closed on Sundays.", answer: "FALSE", explanation: "Күн сайын ашық.", paragraphRef: 0 },
            { id: "l2q9", type: "true-false-notgiven", number: 9, prompt: "The induction is on Monday at ten o'clock.", answer: "TRUE", explanation: "Дүйсенбі сағат 10-да.", paragraphRef: 0 },
            { id: "l2q10", type: "true-false-notgiven", number: 10, prompt: "The customer has been to this gym before.", answer: "NOT GIVEN", explanation: "Бұрын келгені айтылмаған.", paragraphRef: 0 },
          ],
        },
      ],
    },
    // ═══════════ SECTION 2 — Community centre (monologue) ═══════════
    {
      id: "l2s2", number: 2, title: "Community Centre", titleKk: "Қоғамдық орталық",
      context: "A staff member describing the facilities and activities at a new community centre.",
      contextKk: "Қызметкер жаңа қоғамдық орталықтың мүмкіндіктері мен іс-шараларын сипаттауда.",
      difficulty: "medium",
      audioLines: [
        { speaker: "Guide", text: "Welcome to the Riverside Community Centre, which opened last year in two thousand and twenty-three.", pauseAfter: 0.5 },
        { speaker: "Guide", text: "On the ground floor you'll find the main hall, which can hold up to three hundred people.", pauseAfter: 0.5 },
        { speaker: "Guide", text: "The library is on the first floor and is open until eight in the evening on weekdays.", pauseAfter: 0.5 },
        { speaker: "Guide", text: "We run art classes every Tuesday and cooking workshops on Saturdays.", pauseAfter: 0.5 },
        { speaker: "Guide", text: "Membership costs just fifteen dollars per year, and children under twelve join for free.", pauseAfter: 0.5 },
        { speaker: "Guide", text: "Our most popular activity is the yoga class, which often has a waiting list.", pauseAfter: 0.5 },
        { speaker: "Guide", text: "If you need to contact us, the best way is by email rather than by phone.", pauseAfter: 0.5 },
        { speaker: "Guide", text: "Finally, there is free parking at the back of the building for all visitors.", pauseAfter: 0.5 },
      ],
      groups: [
        {
          id: "l2s2g1", type: "sentence-completion", wordLimit: 2,
          instruction: "Complete the notes. Write NO MORE THAN TWO WORDS OR A NUMBER for each answer.",
          instructionKk: "Жазбаларды толтырыңыз. Әр жауапқа ЕКІ СӨЗ немесе САН жазыңыз.",
          questions: [
            { id: "l2q11", type: "sentence-completion", number: 11, prompt: "The centre opened in _______.", answer: "2023", acceptableAnswers: ["twenty twenty-three","two thousand and twenty-three"], explanation: "2023 жылы ашылды.", paragraphRef: 0 },
            { id: "l2q12", type: "sentence-completion", number: 12, prompt: "The main hall can hold up to _______ people.", answer: "300", acceptableAnswers: ["three hundred"], explanation: "300 адам сыяды.", paragraphRef: 0 },
            { id: "l2q13", type: "sentence-completion", number: 13, prompt: "The library closes at _______ p.m. on weekdays.", answer: "8", acceptableAnswers: ["eight"], explanation: "Кешкі 8-де жабылады.", paragraphRef: 0 },
            { id: "l2q14", type: "sentence-completion", number: 14, prompt: "Cooking workshops take place on _______.", answer: "Saturdays", acceptableAnswers: ["Saturday"], explanation: "Сенбіде өтеді.", paragraphRef: 0 },
            { id: "l2q15", type: "sentence-completion", number: 15, prompt: "Yearly membership costs $_______.", answer: "15", acceptableAnswers: ["fifteen"], explanation: "Жылына 15 доллар.", paragraphRef: 0 },
          ],
        },
        {
          id: "l2s2g2", type: "multiple-choice",
          instruction: "Choose the correct answer.",
          instructionKk: "Дұрыс жауапты таңдаңыз.",
          questions: [
            { id: "l2q16", type: "multiple-choice", number: 16, prompt: "Who can join for free?", options: ["Students", "Children under twelve", "Senior citizens", "Local residents"], answer: "1", explanation: "12 жасқа дейінгі балалар тегін (индекс 1).", paragraphRef: 0 },
            { id: "l2q17", type: "multiple-choice", number: 17, prompt: "What is the most popular activity?", options: ["Art class", "Cooking", "Yoga", "Reading"], answer: "2", explanation: "Йога ең танымал (индекс 2).", paragraphRef: 0 },
            { id: "l2q18", type: "multiple-choice", number: 18, prompt: "What day are art classes held?", options: ["Monday", "Tuesday", "Saturday", "Sunday"], answer: "1", explanation: "Сейсенбіде (индекс 1).", paragraphRef: 0 },
            { id: "l2q19", type: "multiple-choice", number: 19, prompt: "What is the best way to contact the centre?", options: ["By phone", "By email", "In person", "By post"], answer: "1", explanation: "Email арқылы (индекс 1).", paragraphRef: 0 },
            { id: "l2q20", type: "multiple-choice", number: 20, prompt: "Where is the parking?", options: ["In front", "At the back", "Underground", "Across the road"], answer: "1", explanation: "Ғимараттың артында (индекс 1).", paragraphRef: 0 },
          ],
        },
      ],
    },
    // ═══════════ SECTION 3 — Student project discussion ═══════════
    {
      id: "l2s3", number: 3, title: "Project Discussion", titleKk: "Жоба талқылауы",
      context: "Two students, Mark and Lucy, discussing their research project on renewable energy.",
      contextKk: "Екі студент, Марк пен Люси, жаңартылатын энергия жобасын талқылауда.",
      difficulty: "medium",
      audioLines: [
        { speaker: "Mark", text: "Lucy, we need to decide on the topic for our project. I was thinking about solar power.", pauseAfter: 0.5 },
        { speaker: "Lucy", text: "Solar is interesting, but everyone chooses it. Why don't we focus on wind energy instead?", pauseAfter: 0.5 },
        { speaker: "Mark", text: "Good point. Wind energy it is. How should we divide the work?", pauseAfter: 0.5 },
        { speaker: "Lucy", text: "I'll handle the research and data, and you can prepare the presentation slides.", pauseAfter: 0.5 },
        { speaker: "Mark", text: "Sounds fair. What sources should we use? The textbook seems a bit outdated.", pauseAfter: 0.5 },
        { speaker: "Lucy", text: "Agreed. Let's rely mainly on recent journal articles rather than the textbook.", pauseAfter: 0.5 },
        { speaker: "Mark", text: "When is the deadline again?", pauseAfter: 0.5 },
        { speaker: "Lucy", text: "The professor said we have to submit it by the fifteenth of March.", pauseAfter: 0.5 },
        { speaker: "Mark", text: "That gives us three weeks. Should we meet to practise the presentation?", pauseAfter: 0.5 },
        { speaker: "Lucy", text: "Definitely. Let's practise in the library the day before we present.", pauseAfter: 0.5 },
        { speaker: "Mark", text: "One concern is that our topic might be too broad.", pauseAfter: 0.5 },
        { speaker: "Lucy", text: "True. Let's narrow it down to wind energy in coastal areas only.", pauseAfter: 0.5 },
      ],
      groups: [
        {
          id: "l2s3g1", type: "multiple-choice",
          instruction: "Choose the correct answer.",
          instructionKk: "Дұрыс жауапты таңдаңыз.",
          questions: [
            { id: "l2q21", type: "multiple-choice", number: 21, prompt: "Which topic did the students finally choose?", options: ["Solar power", "Wind energy", "Hydropower", "Nuclear energy"], answer: "1", explanation: "Жел энергиясын таңдады (индекс 1).", paragraphRef: 0 },
            { id: "l2q22", type: "multiple-choice", number: 22, prompt: "What will Lucy be responsible for?", options: ["The slides", "The research and data", "The introduction", "The conclusion"], answer: "1", explanation: "Люси — зерттеу мен дерек (индекс 1).", paragraphRef: 0 },
            { id: "l2q23", type: "multiple-choice", number: 23, prompt: "What sources will they mainly use?", options: ["The textbook", "Journal articles", "Websites", "Interviews"], answer: "1", explanation: "Журнал мақалалары (индекс 1).", paragraphRef: 0 },
            { id: "l2q24", type: "multiple-choice", number: 24, prompt: "Why will they not rely on the textbook?", options: ["It is too long", "It is outdated", "It is expensive", "It is missing"], answer: "1", explanation: "Ескірген (индекс 1).", paragraphRef: 0 },
            { id: "l2q25", type: "multiple-choice", number: 25, prompt: "What is Mark's main concern about the topic?", options: ["It is too narrow", "It is too broad", "It is boring", "It is difficult"], answer: "1", explanation: "Тым кең (индекс 1).", paragraphRef: 0 },
          ],
        },
        {
          id: "l2s3g2", type: "sentence-completion", wordLimit: 2,
          instruction: "Complete the sentences. Write NO MORE THAN TWO WORDS OR A NUMBER.",
          instructionKk: "Сөйлемдерді толтырыңыз. ЕКІ СӨЗ немесе САН жазыңыз.",
          questions: [
            { id: "l2q26", type: "sentence-completion", number: 26, prompt: "Mark will prepare the presentation _______.", answer: "slides", explanation: "Марк слайд дайындайды.", paragraphRef: 0 },
            { id: "l2q27", type: "sentence-completion", number: 27, prompt: "The project deadline is the _______ of March.", answer: "15th", acceptableAnswers: ["fifteenth","15"], explanation: "15 наурыз.", paragraphRef: 0 },
            { id: "l2q28", type: "sentence-completion", number: 28, prompt: "They have _______ weeks to finish.", answer: "3", acceptableAnswers: ["three"], explanation: "Үш апта.", paragraphRef: 0 },
            { id: "l2q29", type: "sentence-completion", number: 29, prompt: "They will practise the presentation in the _______.", answer: "library", explanation: "Кітапханада жаттығады.", paragraphRef: 0 },
            { id: "l2q30", type: "sentence-completion", number: 30, prompt: "They will narrow the topic to wind energy in _______ areas.", answer: "coastal", explanation: "Жағалаудағы аймақтар.", paragraphRef: 0 },
          ],
        },
      ],
    },
    // ═══════════ SECTION 4 — Lecture on sleep ═══════════
    {
      id: "l2s4", number: 4, title: "Lecture: The Science of Sleep", titleKk: "Дәріс: Ұйқы ғылымы",
      context: "A university lecture about why sleep is important for the human body and mind.",
      contextKk: "Ұйқының адам ағзасы мен санасы үшін маңызы туралы университет дәрісі.",
      difficulty: "hard",
      audioLines: [
        { speaker: "Lecturer", text: "Today we'll explore why sleep is essential. On average, adults need around eight hours of sleep each night.", pauseAfter: 0.5 },
        { speaker: "Lecturer", text: "Sleep occurs in cycles, and each cycle lasts approximately ninety minutes.", pauseAfter: 0.5 },
        { speaker: "Lecturer", text: "The deepest stage of sleep is important because it helps the body repair muscles and tissue.", pauseAfter: 0.5 },
        { speaker: "Lecturer", text: "During REM sleep, the brain processes information and consolidates memory.", pauseAfter: 0.5 },
        { speaker: "Lecturer", text: "A lack of sleep can weaken the immune system, making us more likely to get ill.", pauseAfter: 0.5 },
        { speaker: "Lecturer", text: "Studies show that poor sleep also affects concentration and decision-making.", pauseAfter: 0.5 },
        { speaker: "Lecturer", text: "One common cause of sleep problems is the use of screens before bed, which reduces melatonin.", pauseAfter: 0.5 },
        { speaker: "Lecturer", text: "Experts recommend keeping the bedroom cool and dark to improve sleep quality.", pauseAfter: 0.5 },
        { speaker: "Lecturer", text: "Caffeine should be avoided in the afternoon, as it can stay in the body for many hours.", pauseAfter: 0.5 },
        { speaker: "Lecturer", text: "Finally, going to bed at the same time every night helps regulate the body clock.", pauseAfter: 0.5 },
      ],
      groups: [
        {
          id: "l2s4g1", type: "sentence-completion", wordLimit: 2,
          instruction: "Complete the lecture notes. Write NO MORE THAN TWO WORDS OR A NUMBER for each answer.",
          instructionKk: "Дәріс жазбаларын толтырыңыз. Әр жауапқа ЕКІ СӨЗ немесе САН жазыңыз.",
          questions: [
            { id: "l2q31", type: "sentence-completion", number: 31, prompt: "Adults need about _______ hours of sleep per night.", answer: "8", acceptableAnswers: ["eight"], explanation: "Шамамен 8 сағат.", paragraphRef: 0 },
            { id: "l2q32", type: "sentence-completion", number: 32, prompt: "Each sleep cycle lasts about _______ minutes.", answer: "90", acceptableAnswers: ["ninety"], explanation: "90 минут.", paragraphRef: 0 },
            { id: "l2q33", type: "sentence-completion", number: 33, prompt: "Deep sleep helps the body repair muscles and _______.", answer: "tissue", explanation: "Бұлшықет пен тінді қалпына келтіреді.", paragraphRef: 0 },
            { id: "l2q34", type: "sentence-completion", number: 34, prompt: "During REM sleep the brain consolidates _______.", answer: "memory", explanation: "Жадыны бекітеді.", paragraphRef: 0 },
            { id: "l2q35", type: "sentence-completion", number: 35, prompt: "Lack of sleep can weaken the _______ system.", answer: "immune", explanation: "Иммундық жүйені әлсіретеді.", paragraphRef: 0 },
            { id: "l2q36", type: "sentence-completion", number: 36, prompt: "Poor sleep affects concentration and _______.", answer: "decision-making", acceptableAnswers: ["decision making"], explanation: "Шешім қабылдауға әсер етеді.", paragraphRef: 0 },
            { id: "l2q37", type: "sentence-completion", number: 37, prompt: "Using screens before bed reduces _______.", answer: "melatonin", explanation: "Мелатонинді азайтады.", paragraphRef: 0 },
            { id: "l2q38", type: "sentence-completion", number: 38, prompt: "The bedroom should be kept cool and _______.", answer: "dark", explanation: "Салқын әрі қараңғы.", paragraphRef: 0 },
            { id: "l2q39", type: "sentence-completion", number: 39, prompt: "_______ should be avoided in the afternoon.", answer: "caffeine", explanation: "Түстен кейін кофеиннен аулақ болу.", paragraphRef: 0 },
            { id: "l2q40", type: "sentence-completion", number: 40, prompt: "A regular bedtime helps regulate the body _______.", answer: "clock", explanation: "Дене сағатын реттейді.", paragraphRef: 0 },
          ],
        },
      ],
    },
  ],
};
