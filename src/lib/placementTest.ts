// filepath: src/lib/placementTest.ts
// Деңгей анықтау тесті (placement test) — Busuu/Duolingo үлгісінде.
// Бейімделгіш: A1-ден бастап, әр белдеуде 3 сұрақ; белдеуден өтсе (2/3+)
// келесіге көтеріледі, өтпесе — сол деңгейде тоқтайды.

import type { CefrLevel } from "./cefr";

export interface PlacementQuestion {
  level: CefrLevel;
  prompt: string;      // сұрақ (бос орын ___ болуы мүмкін)
  options: string[];   // 4 нұсқа
  answer: string;
}

// ── АҒЫЛШЫН: әр деңгейге 3 сұрақ (грамматика + лексика аралас) ──
const EN_QUESTIONS: PlacementQuestion[] = [
  // A1
  { level: "A1", prompt: "I ___ a student.", options: ["am", "is", "are", "be"], answer: "am" },
  { level: "A1", prompt: "She ___ two brothers.", options: ["has", "have", "is", "haves"], answer: "has" },
  { level: "A1", prompt: "___ is your name?", options: ["What", "Who", "Where", "How"], answer: "What" },
  // A2
  { level: "A2", prompt: "I ___ to the cinema yesterday.", options: ["went", "go", "goed", "gone"], answer: "went" },
  { level: "A2", prompt: "She is ___ than her sister.", options: ["taller", "more tall", "tallest", "tall"], answer: "taller" },
  { level: "A2", prompt: "There isn't ___ milk in the fridge.", options: ["much", "many", "few", "a"], answer: "much" },
  // B1
  { level: "B1", prompt: "I have ___ finished my homework.", options: ["already", "yet", "still", "ago"], answer: "already" },
  { level: "B1", prompt: "If it rains, we ___ at home.", options: ["will stay", "stayed", "would stay", "stay will"], answer: "will stay" },
  { level: "B1", prompt: "You ___ smoke here — it's forbidden.", options: ["mustn't", "don't have to", "shouldn't to", "can to"], answer: "mustn't" },
  // B2
  { level: "B2", prompt: "By the time we arrived, the film ___.", options: ["had started", "has started", "started", "was starting"], answer: "had started" },
  { level: "B2", prompt: "The report ___ by the committee last week.", options: ["was approved", "approved", "has approved", "is approving"], answer: "was approved" },
  { level: "B2", prompt: "I wish I ___ more time to travel.", options: ["had", "have", "would have had", "having"], answer: "had" },
  // C1
  { level: "C1", prompt: "___ had he entered the room than the phone rang.", options: ["No sooner", "Hardly", "Scarcely when", "Not until"], answer: "No sooner" },
  { level: "C1", prompt: "The findings ___ doubt on the previous theory.", options: ["cast", "made", "put", "threw off"], answer: "cast" },
  { level: "C1", prompt: "Choose the closest meaning of «ubiquitous»:", options: ["everywhere", "rare", "enormous", "ancient"], answer: "everywhere" },
  // C2
  { level: "C2", prompt: "Her argument was so ___ that even critics agreed.", options: ["cogent", "verbose", "tacit", "obtuse"], answer: "cogent" },
  { level: "C2", prompt: "___ the evidence, the jury remained unconvinced.", options: ["Notwithstanding", "Despite of", "Albeit", "Whereas"], answer: "Notwithstanding" },
  { level: "C2", prompt: "Choose the closest meaning of «ephemeral»:", options: ["short-lived", "eternal", "essential", "elaborate"], answer: "short-lived" },
];

// ── ҚЫТАЙ: HSK баспалдағымен (A1≈HSK1 … B2≈HSK4; C1/C2 сирек — қысқа) ──
const ZH_QUESTIONS: PlacementQuestion[] = [
  // A1 (HSK1)
  { level: "A1", prompt: "«Рахмет» қытайша:", options: ["谢谢", "你好", "再见", "对不起"], answer: "谢谢" },
  { level: "A1", prompt: "我 ___ 学生。(Мен студентпін)", options: ["是", "有", "在", "很"], answer: "是" },
  { level: "A1", prompt: "«Су» қытайша:", options: ["水", "茶", "饭", "火"], answer: "水" },
  // A2 (HSK2)
  { level: "A2", prompt: "你 ___ 什么工作？(Қандай жұмыс істейсің?)", options: ["做", "去", "吃", "看"], answer: "做" },
  { level: "A2", prompt: "今天比昨天 ___。(Бүгін кешеден суығырақ)", options: ["冷", "热了", "冷吗", "很冷吗"], answer: "冷" },
  { level: "A2", prompt: "我 ___ 去过北京。(Мен Бейжіңде болғанмын)", options: ["已经", "还是", "就是", "什么"], answer: "已经" },
  // B1 (HSK3)
  { level: "B1", prompt: "他说得 ___ 快，我听不懂。", options: ["太", "很多", "最好", "多么"], answer: "太" },
  { level: "B1", prompt: "把 книга ___ 我。(Кітапты маған бер)", options: ["给", "对", "向", "从"], answer: "给" },
  { level: "B1", prompt: "虽然下雨，___ 我们还是去了。", options: ["但是", "所以", "因为", "而且"], answer: "但是" },
  // B2 (HSK4)
  { level: "B2", prompt: "这个问题 ___ 我们讨论了很久。", options: ["值得", "应该被", "可以是", "必须了"], answer: "值得" },
  { level: "B2", prompt: "«随便» сөзінің мағынасы:", options: ["қалауыңша", "тез арада", "мүлдем", "әрдайым"], answer: "қалауыңша" },
  { level: "B2", prompt: "他 ___ 没来，我们只好先开始。", options: ["迟迟", "常常了", "刚刚才", "越来"], answer: "迟迟" },
  // C1 (HSK5)
  { level: "C1", prompt: "«鉴于» сөзінің қызметі:", options: ["…ескере отырып", "…қарамастан", "…үшін ғана", "…сияқты"], answer: "…ескере отырып" },
  { level: "C1", prompt: "这项政策的实施 ___ 了预期效果。", options: ["达到", "到达", "得到达", "达成到"], answer: "达到" },
  { level: "C1", prompt: "«迫不及待» мағынасы:", options: ["шыдамай асығу", "амалсыз көну", "кездейсоқ табу", "әдейі кешігу"], answer: "шыдамай асығу" },
  // C2 (HSK6)
  { level: "C2", prompt: "«锲而不舍» ең жақын мағына:", options: ["табандылық", "немқұрайлылық", "жомарттық", "сақтық"], answer: "табандылық" },
  { level: "C2", prompt: "他的论证 ___，无懈可击。", options: ["严密", "严格了", "密切地", "紧密于"], answer: "严密" },
  { level: "C2", prompt: "«曇花一现» нені білдіреді?", options: ["қас-қағым сәттік", "мәңгілік даңқ", "баяу өсу", "қайта оралу"], answer: "қас-қағым сәттік" },
];

const ORDER: CefrLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];

export function getPlacementQuestions(lang: "en" | "zh"): PlacementQuestion[] {
  return lang === "zh" ? ZH_QUESTIONS : EN_QUESTIONS;
}

// ── Бейімделгіш бағалау ──
// Әр белдеуде (3 сұрақ) 2+ дұрыс болса — келесі белдеуге өтеді.
// Тоқтаған белдеу = деңгей. Бірінші белдеуден өтпесе — A1.
export function evaluatePlacement(
  questions: PlacementQuestion[],
  answers: Record<number, string> // индекс → таңдалған жауап
): { level: CefrLevel; correct: number; total: number } {
  let resultLevel: CefrLevel = "A1";
  let correct = 0;
  let total = 0;

  for (const band of ORDER) {
    const bandQs = questions
      .map((q, i) => ({ q, i }))
      .filter(({ q }) => q.level === band);
    if (bandQs.length === 0) continue;

    let bandCorrect = 0;
    for (const { q, i } of bandQs) {
      if (answers[i] !== undefined) {
        total++;
        if (answers[i] === q.answer) { bandCorrect++; correct++; }
      }
    }

    // Белдеуден өтті ме (2/3+)
    if (bandCorrect >= 2) {
      resultLevel = band;
    } else {
      break; // өтпеді — алдыңғы деңгейде қалады
    }
  }

  return { level: resultLevel, correct, total };
}

// Тест бейімделгіш жүреді: ағымдағы белдеуден өтпесе — тоқтайды.
// Келесі көрсетілетін сұрақ индексін қайтарады (null — тест бітті).
export function nextQuestionIndex(
  questions: PlacementQuestion[],
  answers: Record<number, string>
): number | null {
  for (const band of ORDER) {
    const bandQs = questions
      .map((q, i) => ({ q, i }))
      .filter(({ q }) => q.level === band);
    if (bandQs.length === 0) continue;

    const answered = bandQs.filter(({ i }) => answers[i] !== undefined);
    const bandCorrect = answered.filter(({ q, i }) => answers[i] === q.answer).length;
    const bandWrong = answered.length - bandCorrect;

    // Белдеу әлі толық жауапталмаған → сол белдеудің келесі сұрағы
    if (answered.length < bandQs.length) {
      // 2 қате болса — белдеуден өтпейтіні анық, ерте тоқтаймыз
      if (bandWrong >= 2) return null;
      return bandQs[answered.length].i;
    }

    // Белдеу толық: өтпесе — тест бітті
    if (bandCorrect < 2) return null;
  }
  return null; // барлық белдеу өтілді (C2)
}
