// filepath: src/lib/knowledge/academicVocab.ts
// Академиялық сөздік — IELTS/жоғары деңгейге қажет.
// Жай сөзді академиялық баламамен ауыстыру (band-boosting).

export interface AcademicWord {
  simple: string;        // жай сөз
  academic: string[];    // академиялық баламалар
  example: string;       // мысал
}

export const academicVocab: AcademicWord[] = [
  { simple: "good", academic: ["beneficial", "favorable", "positive", "advantageous"], example: "Exercise has beneficial effects on health." },
  { simple: "bad", academic: ["detrimental", "adverse", "negative", "harmful"], example: "Pollution has detrimental effects on the environment." },
  { simple: "big", academic: ["significant", "substantial", "considerable", "major"], example: "There was a substantial increase in prices." },
  { simple: "small", academic: ["minor", "minimal", "slight", "marginal"], example: "There was only a marginal difference." },
  { simple: "important", academic: ["crucial", "vital", "essential", "significant", "paramount"], example: "Education plays a crucial role in development." },
  { simple: "show", academic: ["demonstrate", "illustrate", "indicate", "reveal", "highlight"], example: "The data demonstrates a clear trend." },
  { simple: "think", academic: ["consider", "believe", "argue", "maintain", "contend"], example: "Many experts argue that..." },
  { simple: "a lot of", academic: ["numerous", "a significant number of", "a considerable amount of"], example: "Numerous studies have confirmed this." },
  { simple: "because", academic: ["due to", "owing to", "as a result of", "on account of"], example: "Due to climate change, sea levels are rising." },
  { simple: "so", academic: ["therefore", "consequently", "thus", "hence", "as a result"], example: "Prices rose; consequently, demand fell." },
  { simple: "but", academic: ["however", "nevertheless", "nonetheless", "conversely", "whereas"], example: "It is expensive; however, it is effective." },
  { simple: "also", academic: ["furthermore", "moreover", "in addition", "additionally"], example: "Furthermore, the policy reduced costs." },
  { simple: "get", academic: ["obtain", "acquire", "attain", "receive"], example: "Students can obtain a scholarship." },
  { simple: "use", academic: ["utilize", "employ", "apply", "implement"], example: "Companies utilize advanced technology." },
  { simple: "make", academic: ["produce", "generate", "create", "construct"], example: "Factories generate large amounts of waste." },
  { simple: "help", academic: ["facilitate", "assist", "aid", "support", "enable"], example: "Technology facilitates communication." },
  { simple: "increase", academic: ["enhance", "boost", "augment", "escalate", "rise"], example: "The program enhanced productivity." },
  { simple: "decrease", academic: ["reduce", "diminish", "decline", "lower", "minimize"], example: "The policy reduced unemployment." },
  { simple: "problem", academic: ["issue", "challenge", "obstacle", "dilemma", "concern"], example: "Climate change is a pressing issue." },
  { simple: "idea", academic: ["concept", "notion", "perspective", "viewpoint"], example: "This concept is widely accepted." },
  { simple: "happen", academic: ["occur", "take place", "arise", "emerge"], example: "Significant changes occurred." },
  { simple: "very", academic: ["extremely", "considerably", "remarkably", "exceptionally"], example: "The results were exceptionally clear." },
  { simple: "many people", academic: ["the majority", "a large proportion", "numerous individuals"], example: "The majority of respondents agreed." },
  { simple: "for example", academic: ["for instance", "to illustrate", "as an illustration", "namely"], example: "Some sports, for instance swimming, are low-impact." },
];

// Дискурс маркерлері (эссе үшін — қалай байланыстыру)
export const discourseMarkers = {
  adding: ["Furthermore", "Moreover", "In addition", "Additionally", "What is more"],
  contrasting: ["However", "Nevertheless", "On the other hand", "In contrast", "Conversely"],
  causeEffect: ["Therefore", "Consequently", "As a result", "Thus", "Hence"],
  examples: ["For instance", "For example", "To illustrate", "Namely", "Such as"],
  conclusion: ["In conclusion", "To sum up", "Overall", "In summary", "Ultimately"],
  sequence: ["Firstly", "Secondly", "Subsequently", "Finally", "Initially"],
  emphasis: ["Indeed", "Notably", "Importantly", "Significantly", "In particular"],
};
