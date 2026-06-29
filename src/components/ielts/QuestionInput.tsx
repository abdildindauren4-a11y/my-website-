// filepath: src/components/ielts/QuestionInput.tsx
// IELTS сұрақтарына жауап енгізу — әр түрге сай.

import { useLang } from "@/contexts/LangContext";
import type { IeltsQuestion, QuestionGroup } from "@/types/ielts";

interface Props {
  question: IeltsQuestion;
  group: QuestionGroup;
  value: string;
  onChange: (value: string) => void;
}

export default function QuestionInput({ question, group, value, onChange }: Props) {
  const { t } = useLang();

  // True/False/Not Given немесе Yes/No/Not Given
  if (question.type === "true-false-notgiven" || question.type === "yes-no-notgiven") {
    const isYesNo = question.type === "yes-no-notgiven";
    const options = isYesNo
      ? [{ v: "YES", label: t("ielts.yes") }, { v: "NO", label: t("ielts.no") }, { v: "NOT GIVEN", label: t("ielts.notGiven") }]
      : [{ v: "TRUE", label: t("ielts.true") }, { v: "FALSE", label: t("ielts.false") }, { v: "NOT GIVEN", label: t("ielts.notGiven") }];
    return (
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt.v}
            onClick={() => onChange(opt.v)}
            className={`px-3 py-1.5 rounded-btn text-sm font-medium border transition-all ${
              value === opt.v
                ? "bg-accent-green text-white border-accent-green"
                : "bg-surface border-border hover:border-accent-green/50"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    );
  }

  // Multiple choice немесе Matching headings
  if (question.type === "multiple-choice" || question.type === "matching-headings") {
    const options = question.options || [];
    // Matching headings — тақырыптар тізімінен
    const headings = group.headings;
    return (
      <div className="space-y-1.5">
        {options.map((opt, idx) => {
          // MCQ: индекс сақталады; headings: id сақталады
          const optValue = question.type === "matching-headings" ? opt : String(idx);
          const displayText = question.type === "matching-headings"
            ? `${opt}. ${headings?.find((h) => h.id === opt)?.text || ""}`
            : opt;
          return (
            <button
              key={idx}
              onClick={() => onChange(optValue)}
              className={`w-full text-left px-3 py-2 rounded-btn text-sm border transition-all ${
                value === optValue
                  ? "bg-accent-green/10 border-accent-green text-text-primary"
                  : "bg-surface border-border hover:border-accent-green/40 hover:bg-surface-2"
              }`}
            >
              <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold mr-2 ${
                value === optValue ? "bg-accent-green text-white" : "bg-surface-2 text-text-muted"
              }`}>
                {question.type === "matching-headings" ? opt : String.fromCharCode(65 + idx)}
              </span>
              {displayText}
            </button>
          );
        })}
      </div>
    );
  }

  // Sentence/Summary completion — мәтін енгізу
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={t("ielts.typeAnswer")}
      className="w-full bg-surface border border-border rounded-btn px-3 py-2 text-sm focus:outline-none focus:border-accent-green/50"
    />
  );
}
