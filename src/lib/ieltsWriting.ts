// filepath: src/lib/ieltsWriting.ts
// IELTS Writing — Gemini AI бағалау жүйесі.
// Эссені 4 ресми критериймен бағалап, band береді.

import { getGeminiKey } from "./gemini";

// Writing тапсырма түрлері
export interface WritingTask {
  id: string;
  taskType: 1 | 2;
  title: string;
  titleKk: string;
  prompt: string;          // тапсырма мәтіні
  promptKk: string;
  minWords: number;        // Task 1=150, Task 2=250
  timeMinutes: number;     // Task 1=20, Task 2=40
  imageDescription?: string; // Task 1 үшін (график сипаттамасы)
}

// Бағалау нәтижесі (4 критерий)
export interface WritingEvaluation {
  overallBand: number;
  criteria: {
    taskAchievement: { band: number; feedback: string };
    coherenceCohesion: { band: number; feedback: string };
    lexicalResource: { band: number; feedback: string };
    grammaticalRange: { band: number; feedback: string };
  };
  strengths: string[];
  improvements: string[];
  wordCount: number;
}

// Эссені бағалау (Gemini)
export async function evaluateWriting(
  task: WritingTask,
  essay: string,
  lang: "kk" | "en"
): Promise<WritingEvaluation> {
  const apiKey = getGeminiKey();
  if (!apiKey) {
    throw new Error("NO_API_KEY");
  }

  const wordCount = essay.trim().split(/\s+/).filter(Boolean).length;

  // Тілге сай feedback тілі
  const feedbackLang = lang === "kk" ? "Kazakh" : "English";

  const systemPrompt = `You are an experienced IELTS examiner. Evaluate the following IELTS Writing Task ${task.taskType} response according to the official IELTS band descriptors.

TASK PROMPT: ${task.prompt}${task.taskType === 1 && task.imageDescription ? `\nCHART/DIAGRAM DATA (the student described this): ${task.imageDescription}\nFor Task 1, check the student accurately reports the key data and makes relevant comparisons.` : ""}
MINIMUM WORDS: ${task.minWords}
STUDENT'S WORD COUNT: ${wordCount}

Assess the essay on the four official criteria, each scored from 1.0 to 9.0 (in 0.5 increments):
1. Task Achievement/Response — how well the task is addressed
2. Coherence and Cohesion — organisation, paragraphing, linking
3. Lexical Resource — vocabulary range and accuracy
4. Grammatical Range and Accuracy — grammar variety and correctness

IMPORTANT:
- Be fair but rigorous, like a real examiner.
- If the essay is under the minimum word count, lower the Task Achievement score.
- Write all feedback in ${feedbackLang}.
- The overall band is the average of the four criteria, rounded to the nearest 0.5.

Respond ONLY with valid JSON in exactly this format (no markdown, no extra text):
{
  "overallBand": 6.5,
  "criteria": {
    "taskAchievement": { "band": 6.5, "feedback": "..." },
    "coherenceCohesion": { "band": 6.0, "feedback": "..." },
    "lexicalResource": { "band": 7.0, "feedback": "..." },
    "grammaticalRange": { "band": 6.5, "feedback": "..." }
  },
  "strengths": ["...", "..."],
  "improvements": ["...", "..."]
}`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: systemPrompt + "\n\nSTUDENT'S ESSAY:\n" + essay }] }],
        generationConfig: { temperature: 0.3, maxOutputTokens: 1500 },
      }),
    }
  );

  if (!response.ok) {
    throw new Error("API_ERROR");
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

  // JSON-ды бөліп алу (markdown ішінде болуы мүмкін)
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("PARSE_ERROR");
  }

  const result = JSON.parse(jsonMatch[0]);
  return {
    ...result,
    wordCount,
  };
}

// ── Writing тапсырмалар базасы ──
export const writingTasks: WritingTask[] = [
  {
    id: "w-t2-1",
    taskType: 2,
    title: "Technology and Communication",
    titleKk: "Технология және қарым-қатынас",
    prompt: "Some people believe that modern communication technology, such as smartphones and social media, has made people less sociable in real life. To what extent do you agree or disagree with this opinion? Give reasons for your answer and include any relevant examples from your own knowledge or experience.",
    promptKk: "Кейбіреулер заманауи қарым-қатынас технологиясы (смартфон, әлеуметтік желі) адамдарды нақты өмірде аз әлеуметтік етті деп санайды. Бұл пікірмен қаншалықты келісесіз? Жауабыңызды дәлелдеп, мысалдар келтіріңіз.",
    minWords: 250,
    timeMinutes: 40,
  },
  {
    id: "w-t2-2",
    taskType: 2,
    title: "Education and Career",
    titleKk: "Білім және мансап",
    prompt: "Many people think that universities should focus on providing students with practical skills for their future careers, rather than teaching academic subjects. To what extent do you agree or disagree? Give reasons for your answer and include relevant examples.",
    promptKk: "Көптеген адамдар университеттер академиялық пәндерді оқытудың орнына студенттерге болашақ мансабына практикалық дағдылар беруге назар аударуы керек деп санайды. Қаншалықты келісесіз? Дәлелдеп жазыңыз.",
    minWords: 250,
    timeMinutes: 40,
  },
  {
    id: "w-t2-3",
    taskType: 2,
    title: "Environment",
    titleKk: "Қоршаған орта",
    prompt: "Some people believe that individuals can do little to protect the environment, and that only governments and large companies can make a real difference. To what extent do you agree or disagree? Give reasons and examples to support your answer.",
    promptKk: "Кейбіреулер жеке адамдар қоршаған ортаны қорғауда аз нәрсе істей алады, тек үкімет пен ірі компаниялар нақты өзгеріс жасай алады деп санайды. Қаншалықты келісесіз? Дәлелдеңіз.",
    minWords: 250,
    timeMinutes: 40,
  },
  // ── Task 2 (қосымша эссе тақырыптары) ──
  {
    id: "w-t2-4", taskType: 2, title: "Work–Life Balance", titleKk: "Жұмыс пен өмір тепе-теңдігі",
    prompt: "In many countries, people are working longer hours and have less free time. What are the causes of this, and what effects does it have on individuals and society? Give reasons and examples.",
    promptKk: "Көп елде адамдар ұзағырақ жұмыс істеп, бос уақыты азайды. Мұның себептері қандай және ол адамдар мен қоғамға қалай әсер етеді? Дәлелдеп жазыңыз.",
    minWords: 250, timeMinutes: 40,
  },
  {
    id: "w-t2-5", taskType: 2, title: "Crime and Punishment", titleKk: "Қылмыс пен жаза",
    prompt: "Some people think that the best way to reduce crime is to give longer prison sentences. Others believe there are better alternatives. Discuss both views and give your own opinion.",
    promptKk: "Кейбіреулер қылмысты азайтудың ең жақсы жолы — ұзақ түрме жазасы дейді. Басқалар жақсырақ балама бар деп санайды. Екі көзқарасты талқылап, өз пікіріңізді беріңіз.",
    minWords: 250, timeMinutes: 40,
  },
  {
    id: "w-t2-6", taskType: 2, title: "Tourism", titleKk: "Туризм",
    prompt: "International tourism has brought enormous benefits to many places, but it has also damaged the environment and local cultures. Do the advantages of tourism outweigh the disadvantages? Give reasons and examples.",
    promptKk: "Халықаралық туризм көп жерге зор пайда әкелді, бірақ қоршаған орта мен жергілікті мәдениетке зиян да келтірді. Туризмнің пайдасы зиянынан басым ба? Дәлелдеңіз.",
    minWords: 250, timeMinutes: 40,
  },
  {
    id: "w-t2-7", taskType: 2, title: "Health", titleKk: "Денсаулық",
    prompt: "Prevention is better than cure. Some argue that governments should spend more money on health education and prevention than on treatment of illnesses. To what extent do you agree or disagree?",
    promptKk: "Алдын алу емдеуден жақсы. Кейбіреулер үкімет ауруды емдеуге қарағанда денсаулық біліміне көбірек қаражат бөлуі керек дейді. Қаншалықты келісесіз?",
    minWords: 250, timeMinutes: 40,
  },
  {
    id: "w-t2-8", taskType: 2, title: "Technology and Jobs", titleKk: "Технология және жұмыс",
    prompt: "Automation and artificial intelligence are replacing many jobs traditionally done by humans. Is this a positive or negative development? Give reasons for your answer and include relevant examples.",
    promptKk: "Автоматтандыру мен жасанды интеллект адам атқаратын көп жұмыс орнын алмастыруда. Бұл оң ба, әлде теріс құбылыс па? Дәлелдеп, мысал келтіріңіз.",
    minWords: 250, timeMinutes: 40,
  },
  {
    id: "w-t2-9", taskType: 2, title: "Children and Media", titleKk: "Балалар және медиа",
    prompt: "Many children today spend a lot of time watching television and playing video games. Some people think this is harmful, while others believe it has benefits. Discuss both views and give your opinion.",
    promptKk: "Бүгінде көп бала теледидар көріп, видеоойын ойнауға көп уақыт жұмсайды. Кейбіреулер мұны зиянды дейді, басқалары пайдасы бар дейді. Екі көзқарасты талқылап, пікіріңізді беріңіз.",
    minWords: 250, timeMinutes: 40,
  },
  {
    id: "w-t2-10", taskType: 2, title: "Globalization and Languages", titleKk: "Жаһандану және тілдер",
    prompt: "As the world becomes more globalized, many minority languages are disappearing. Some people think this does not matter, while others believe we should protect them. Discuss both views and give your opinion.",
    promptKk: "Әлем жаһанданған сайын көп аз тіл жойылып барады. Кейбіреулер бұл маңызды емес дейді, басқалары оларды қорғау керек дейді. Екі көзқарасты талқылап, пікіріңізді беріңіз.",
    minWords: 250, timeMinutes: 40,
  },
  {
    id: "w-t2-11", taskType: 2, title: "Public Transport", titleKk: "Қоғамдық көлік",
    prompt: "Some people believe that governments should invest heavily in public transport rather than building more roads for cars. To what extent do you agree or disagree? Give reasons and examples.",
    promptKk: "Кейбіреулер үкімет жаңа жолдар салғаннан гөрі қоғамдық көлікке көбірек инвестиция салуы керек дейді. Қаншалықты келісесіз? Дәлелдеңіз.",
    minWords: 250, timeMinutes: 40,
  },
  // ── Task 1 (Academic — график/диаграмма сипаттамасы) ──
  {
    id: "w-t1-1", taskType: 1, title: "Line Graph — Internet Users", titleKk: "Сызықтық график — интернет қолданушылары",
    prompt: "The line graph below shows the percentage of the population using the internet in four countries from 2000 to 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    promptKk: "Төмендегі сызықтық график 2000–2020 жылдары төрт елде интернет қолданушы халықтың пайызын көрсетеді. Негізгі ерекшеліктерді таңдап сипаттаңыз және салыстырыңыз.",
    minWords: 150, timeMinutes: 20,
    imageDescription: "Data: USA rose from 43% (2000) to 90% (2020); South Korea from 40% to 96%; Brazil from 3% to 74%; Kazakhstan from 1% to 86%. All four show steady upward trends, with Kazakhstan and Brazil growing fastest from low starting points.",
  },
  {
    id: "w-t1-2", taskType: 1, title: "Bar Chart — Energy Sources", titleKk: "Баған диаграмма — энергия көздері",
    prompt: "The bar chart below compares the proportion of electricity generated from different sources in three countries in 2022. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    promptKk: "Төмендегі баған диаграмма 2022 жылы үш елде түрлі көзден өндірілген электр энергиясының үлесін салыстырады. Негізгі ерекшеліктерді сипаттап, салыстырыңыз.",
    minWords: 150, timeMinutes: 20,
    imageDescription: "Data (coal/gas/nuclear/renewables): Country A 50/20/10/20; Country B 15/25/30/30; Country C 5/10/15/70. Country C relies mostly on renewables, Country A mostly on coal, Country B is the most balanced.",
  },
  {
    id: "w-t1-3", taskType: 1, title: "Pie Charts — Household Spending", titleKk: "Дөңгелек диаграмма — отбасы шығыны",
    prompt: "The two pie charts below show how an average household spent its monthly income in 1990 and 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    promptKk: "Төмендегі екі дөңгелек диаграмма орташа отбасының айлық табысын 1990 және 2020 жылдары қалай жұмсағанын көрсетеді. Негізгі ерекшеліктерді сипаттап, салыстырыңыз.",
    minWords: 150, timeMinutes: 20,
    imageDescription: "1990: food 35%, housing 25%, transport 10%, leisure 10%, other 20%. 2020: food 20%, housing 35%, transport 15%, leisure 18%, other 12%. Housing and leisure rose; food fell sharply.",
  },
  {
    id: "w-t1-4", taskType: 1, title: "Process — Water Cycle", titleKk: "Процесс — су айналымы",
    prompt: "The diagram below illustrates the process of the natural water cycle. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    promptKk: "Төмендегі диаграмма табиғи су айналымы процесін көрсетеді. Негізгі кезеңдерді таңдап сипаттаңыз.",
    minWords: 150, timeMinutes: 20,
    imageDescription: "Stages: 1) the sun heats oceans causing evaporation; 2) water vapour rises and cools, forming clouds (condensation); 3) clouds release water as precipitation (rain/snow); 4) water flows over land as runoff into rivers; 5) rivers return water to the ocean, and the cycle repeats.",
  },
];
