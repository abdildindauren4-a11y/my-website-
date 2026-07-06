// filepath: src/lib/curriculumValidate.ts
// Мазмұн валидаторы (ROADMAP 2-кезең): деңгей бағдарламасындағы қателерді
// контент жазу кезінде ұстайды — сынық жаттығу қолданушыға жетпейді.
// 4-кезеңде A1/A2/HSK1 контенті осы тексерістен өтіп барып қосылады.

import type { CurriculumLevel, CurriculumUnit } from "@/types/curriculum";
import type { ExerciseSpec } from "@/types/exercise";
import { normalizeAnswer } from "@/lib/exerciseAdapter";

// Бір жаттығуды тексеру → қате хабарлары ("" = таза)
export function validateSpec(spec: ExerciseSpec, path: string): string[] {
  const errs: string[] = [];
  const at = `${path}/${spec.id}`;

  if (!spec.id) errs.push(`${path}: жаттығуда id жоқ`);
  if (!spec.prompt && spec.type !== "present") errs.push(`${at}: prompt бос`);

  switch (spec.type) {
    case "choice":
    case "listen-choice": {
      const opts = spec.options ?? [];
      if (opts.length < 2) errs.push(`${at}: ${spec.type} — кемінде 2 нұсқа керек`);
      if (new Set(opts.map(normalizeAnswer)).size !== opts.length)
        errs.push(`${at}: нұсқалар қайталанады`);
      if (!opts.some((o) => normalizeAnswer(o) === normalizeAnswer(spec.answer)))
        errs.push(`${at}: дұрыс жауап нұсқалар ішінде жоқ`);
      if (spec.type === "listen-choice" && !spec.text)
        errs.push(`${at}: listen-choice — тыңдалатын text жоқ`);
      break;
    }
    case "listen-type":
    case "speak":
      if (!spec.text) errs.push(`${at}: ${spec.type} — text (аудио көзі) жоқ`);
      break;
    case "order": {
      const words = spec.words ?? [];
      if (words.length < 2) errs.push(`${at}: order — кемінде 2 сөз керек`);
      if (words.length > 0 && normalizeAnswer(words.join(" ")) !== normalizeAnswer(spec.answer))
        errs.push(`${at}: order — words қосындысы answer-ге сай емес`);
      break;
    }
    case "fill":
      if (!spec.text || !spec.text.includes("___"))
        errs.push(`${at}: fill — text ішінде ___ бос орын жоқ`);
      break;
    case "match": {
      const pairs = spec.pairs ?? [];
      if (pairs.length < 2) errs.push(`${at}: match — кемінде 2 жұп керек`);
      break;
    }
    case "translate":
    case "present":
      break;
  }

  if (spec.type !== "present" && !spec.answer) errs.push(`${at}: answer бос`);
  return errs;
}

// Юнитті тексеру
export function validateUnit(unit: CurriculumUnit, path: string): string[] {
  const errs: string[] = [];
  const at = `${path}/${unit.id}`;

  if (unit.vocabSet.length < 5) errs.push(`${at}: vocabSet тым аз (${unit.vocabSet.length}, кемінде 5)`);
  if (unit.lessons.length < 2) errs.push(`${at}: сабақ тым аз (${unit.lessons.length}, кемінде 2)`);
  if (unit.checkpoint.length < 8) errs.push(`${at}: checkpoint сұрағы аз (${unit.checkpoint.length}, кемінде 8)`);

  const seenIds = new Set<string>();
  for (const lesson of unit.lessons) {
    if (seenIds.has(lesson.id)) errs.push(`${at}: сабақ id қайталанады — ${lesson.id}`);
    seenIds.add(lesson.id);
    if (lesson.exercises.length < 4) errs.push(`${at}/${lesson.id}: жаттығу аз (${lesson.exercises.length}, кемінде 4)`);
    for (const ex of lesson.exercises) errs.push(...validateSpec(ex, `${at}/${lesson.id}`));
  }
  for (const ex of unit.checkpoint) errs.push(...validateSpec(ex, `${at}/checkpoint`));

  // Аудармалар қазақша ма (ағылшын анықтама қалып қоймасын — бұрынғы қателік)
  const hasKk = (s: string) => /[Ѐ-ӿ]/.test(s);
  for (const w of unit.vocabSet) {
    if (!hasKk(w.translation)) errs.push(`${at}: «${w.term}» аудармасы қазақша емес`);
  }

  return errs;
}

// Деңгейді толық тексеру → бос массив = мазмұн таза
export function validateLevel(level: CurriculumLevel): string[] {
  const errs: string[] = [];
  const path = `${level.lang}/${level.cefr}`;

  const unitIds = new Set<string>();
  const numbers = new Set<number>();
  for (const unit of level.units) {
    if (unitIds.has(unit.id)) errs.push(`${path}: юнит id қайталанады — ${unit.id}`);
    unitIds.add(unit.id);
    if (numbers.has(unit.number)) errs.push(`${path}: юнит нөмірі қайталанады — ${unit.number}`);
    numbers.add(unit.number);
    errs.push(...validateUnit(unit, path));
  }
  return errs;
}
