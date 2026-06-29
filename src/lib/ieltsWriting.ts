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

TASK PROMPT: ${task.prompt}
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
];
