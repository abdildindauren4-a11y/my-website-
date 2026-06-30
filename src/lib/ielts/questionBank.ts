// filepath: src/lib/ielts/questionBank.ts
// IELTS жаттығу сұрақтарының БАЗАСЫ (1000+).
// Қолмен тексерілген лингвистикалық деректерден бағдарламамен құрастырылады.
// Дистракторлар (қате нұсқалар) пулдан/басқа жазбалардан алынады — жауаптар дұрыс.

import { academicVocab } from "@/lib/knowledge/academicVocab";
import { phrasalVerbs } from "@/lib/knowledge/phrasalVerbs";
import { grammarPoints } from "@/lib/knowledge/grammar";

export type QCategory = "synonym" | "definition" | "preposition" | "collocation" | "phrasal" | "linker" | "grammar" | "academic";

export interface BankQuestion {
  id: string;
  category: QCategory;
  prompt: string;
  promptKk: string;
  options: string[];
  answer: string;
  explanation?: string;
}

// ── Тұрақты RNG (seed) — тізім тұрақты болу үшін ──
function mulberry32(seed: number) {
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rng = mulberry32(20260629);
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function pickDistractors(pool: string[], exclude: string[], n: number): string[] {
  const cand = shuffle(pool.filter((x) => !exclude.includes(x)));
  return cand.slice(0, n);
}
function makeQ(id: string, category: QCategory, prompt: string, promptKk: string, answer: string, distractors: string[], explanation?: string): BankQuestion | null {
  const uniq = Array.from(new Set(distractors.filter((d) => d && d !== answer)));
  if (uniq.length < 3) return null;
  const options = shuffle([answer, ...uniq.slice(0, 3)]);
  return { id, category, prompt, promptKk, options, answer, explanation };
}

// ════════════ SEED ДЕРЕКТЕР ════════════

// 1) Синонимдер [сөз, синоним]
const SYNONYMS: [string, string][] = [
  ["happy","joyful"],["sad","sorrowful"],["big","enormous"],["small","tiny"],["fast","rapid"],["slow","sluggish"],
  ["important","crucial"],["difficult","challenging"],["easy","effortless"],["beautiful","gorgeous"],["ugly","hideous"],
  ["smart","intelligent"],["stupid","foolish"],["rich","wealthy"],["poor","impoverished"],["strong","powerful"],
  ["weak","feeble"],["angry","furious"],["calm","tranquil"],["scared","terrified"],["brave","courageous"],
  ["tired","exhausted"],["hungry","starving"],["cold","freezing"],["hot","scorching"],["clean","spotless"],
  ["dirty","filthy"],["old","ancient"],["new","modern"],["funny","hilarious"],["boring","tedious"],
  ["interesting","fascinating"],["quiet","silent"],["loud","deafening"],["bright","brilliant"],["dark","gloomy"],
  ["famous","renowned"],["common","widespread"],["rare","scarce"],["enough","sufficient"],["empty","vacant"],
  ["full","packed"],["begin","commence"],["end","terminate"],["choose","select"],["buy","purchase"],
  ["build","construct"],["break","shatter"],["fix","repair"],["keep","retain"],["throw","hurl"],
  ["allow","permit"],["forbid","prohibit"],["expect","anticipate"],["explain","clarify"],["prove","demonstrate"],
  ["reduce","diminish"],["increase","escalate"],["improve","enhance"],["destroy","demolish"],["protect","safeguard"],
  ["answer","respond"],["ask","inquire"],["tell","inform"],["look","gaze"],["walk","stroll"],
  ["run","sprint"],["jump","leap"],["cry","weep"],["laugh","chuckle"],["shout","yell"],
  ["help","assist"],["need","require"],["want","desire"],["like","admire"],["hate","detest"],
  ["think","ponder"],["remember","recall"],["forget","overlook"],["understand","comprehend"],["learn","grasp"],
  ["teach","instruct"],["show","reveal"],["hide","conceal"],["find","discover"],["lose","misplace"],
  ["win","triumph"],["fail","flounder"],["try","attempt"],["finish","complete"],["start","initiate"],
  ["change","alter"],["stay","remain"],["leave","depart"],["arrive","reach"],["return","revert"],
  ["save","preserve"],["spend","expend"],["give","donate"],["take","seize"],["bring","fetch"],
  ["wonderful","marvelous"],["terrible","dreadful"],["huge","gigantic"],["tiny","minuscule"],["clever","ingenious"],
  ["honest","truthful"],["lazy","idle"],["polite","courteous"],["rude","impolite"],["generous","charitable"],
  ["confident","assured"],["nervous","anxious"],["sure","certain"],["wrong","incorrect"],["true","accurate"],
  ["real","genuine"],["fake","counterfeit"],["serious","grave"],["simple","basic"],["complex","intricate"],
  ["modern","contemporary"],["ancient","archaic"],["safe","secure"],["dangerous","hazardous"],["useful","beneficial"],
  ["useless","worthless"],["necessary","essential"],["possible","feasible"],["likely","probable"],["obvious","evident"],
  ["accurate","precise"],["adequate","sufficient"],["afraid","fearful"],["alike","similar"],["amaze","astonish"],
  ["annoy","irritate"],["argue","dispute"],["assist","aid"],["attract","entice"],["aware","conscious"],
  ["bother","disturb"],["brief","concise"],["bright","luminous"],["broad","wide"],["careful","cautious"],
  ["chief","principal"],["clear","transparent"],["complete","entire"],["constant","continual"],["correct","right"],
  ["create","produce"],["damage","harm"],["decide","determine"],["delay","postpone"],["dense","thick"],
  ["deny","refuse"],["depend","rely"],["desire","crave"],["display","exhibit"],["divide","separate"],
  ["doubt","question"],["earn","gain"],["edge","border"],["effort","endeavor"],["enemy","foe"],
  ["enormous","immense"],["error","mistake"],["estimate","approximate"],["evident","apparent"],["exact","precise"],
  ["expand","enlarge"],["faith","belief"],["fault","flaw"],["fear","dread"],["fierce","ferocious"],
  ["firm","solid"],["flaw","defect"],["foe","adversary"],["fragile","delicate"],["frank","candid"],
  ["gather","collect"],["gentle","mild"],["genuine","authentic"],["glad","pleased"],["goal","objective"],
  ["grief","sorrow"],["guard","protect"],["harsh","severe"],["hide","conceal"],["hope","aspire"],
  ["idle","inactive"],["imitate","mimic"],["injure","wound"],["intend","aim"],["join","connect"],
  ["keen","eager"],["lack","shortage"],["lethal","deadly"],["loyal","faithful"],["mature","ripe"],
  ["mend","repair"],["mock","ridicule"],["narrow","slim"],["neat","tidy"],["obey","comply"],
  ["odd","strange"],["outcome","result"],["peak","summit"],["plenty","abundance"],["praise","commend"],
  ["prevent","avert"],["proud","arrogant"],["quick","swift"],["raise","elevate"],["reject","decline"],
  ["release","free"],["reply","respond"],["reveal","disclose"],["reward","prize"],["rough","coarse"],
  ["ruin","destroy"],["scatter","disperse"],["seek","pursue"],["shy","timid"],["solid","firm"],
];

// 2) Анықтамалар [сөз, анықтама]
const DEFINITIONS: [string, string][] = [
  ["abundant","existing in large quantities"],["adequate","enough for a particular purpose"],["ambiguous","open to more than one interpretation"],
  ["benevolent","kind and generous"],["cautious","careful to avoid problems"],["concise","short and clear"],
  ["controversial","causing public disagreement"],["deliberate","done on purpose"],["diligent","showing careful effort"],
  ["diverse","showing variety"],["eloquent","fluent and persuasive in speech"],["feasible","possible to do easily"],
  ["fragile","easily broken"],["genuine","truly what it is said to be"],["hostile","unfriendly and aggressive"],
  ["inevitable","certain to happen"],["innovative","introducing new ideas"],["intricate","very detailed and complicated"],
  ["lucrative","producing a lot of money"],["meticulous","very careful about details"],["notorious","famous for something bad"],
  ["obsolete","no longer used"],["persistent","continuing firmly despite difficulty"],["profound","very deep or intense"],
  ["reluctant","unwilling and hesitant"],["resilient","able to recover quickly"],["scarce","insufficient for demand"],
  ["spontaneous","done without planning"],["tedious","too long and boring"],["transparent","easy to see through or understand"],
  ["versatile","able to adapt to many functions"],["vibrant","full of energy and life"],["vital","absolutely necessary"],
  ["arrogant","having an exaggerated sense of self-importance"],["compassionate","feeling sympathy for others"],["frugal","careful with money"],
  ["humble","modest about oneself"],["impartial","treating everyone equally"],["pragmatic","dealing with things practically"],
  ["sincere","free from pretense; honest"],["stubborn","refusing to change one's mind"],["thrifty","using money carefully"],
  ["accumulate","to gather or collect over time"],["allocate","to distribute for a purpose"],["compensate","to make up for something"],
  ["deteriorate","to become progressively worse"],["emphasize","to give special importance to"],["fluctuate","to rise and fall irregularly"],
  ["implement","to put a plan into action"],["justify","to show to be right or reasonable"],["mitigate","to make less severe"],
  ["postpone","to delay to a later time"],["restore","to bring back to original condition"],["sustain","to maintain over time"],
  ["abolish","to formally put an end to"],["acquire","to obtain or get"],["anticipate","to expect or predict"],
  ["comprehend","to understand fully"],["contribute","to give in order to help"],["distinguish","to recognize a difference"],
  ["eliminate","to completely remove"],["evaluate","to judge the value of"],["exaggerate","to make something seem larger"],
  ["foster","to encourage the development of"],["hinder","to make difficult; obstruct"],["illustrate","to explain with examples"],
  ["preserve","to keep in original state"],["pursue","to follow or chase a goal"],["resolve","to settle or find a solution"],
  ["retain","to keep or hold"],["reveal","to make known"],["seek","to try to find or obtain"],
  ["tolerate","to allow or endure"],["undermine","to weaken gradually"],["verify","to check the truth of"],
  ["withstand","to resist successfully"],["accelerate","to increase speed"],["clarify","to make clear"],
  ["condemn","to express strong disapproval"],["depict","to show or represent"],["enhance","to improve the quality of"],
  ["adjacent","next to or near something"],["aesthetic","concerned with beauty"],["alleviate","to make suffering less severe"],
  ["ambitious","having a strong desire for success"],["arbitrary","based on random choice"],["authentic","genuine and real"],
  ["coherent","logical and consistent"],["competent","having the necessary skill"],["comprehensive","complete and thorough"],
  ["conventional","based on what is generally done"],["credible","able to be believed"],["crucial","extremely important"],
  ["cumulative","increasing by additions"],["detrimental","causing harm"],["dynamic","characterized by constant change"],
  ["explicit","stated clearly and in detail"],["feasible","capable of being done"],["finite","having limits"],
  ["formidable","inspiring fear or respect"],["fundamental","forming a necessary base"],["hypothetical","based on a suggested idea"],
  ["implicit","suggested but not stated directly"],["inherent","existing as a natural part"],["legitimate","conforming to the law"],
  ["marginal","very small in amount"],["mundane","lacking interest; ordinary"],["negligible","so small as to be unimportant"],
  ["nostalgic","longing for the past"],["objective","not influenced by personal feelings"],["optimal","best or most favorable"],
  ["paramount","more important than anything else"],["plausible","seeming reasonable or probable"],["predominant","present as the strongest element"],
  ["prevalent","widespread in a particular area"],["redundant","not needed; superfluous"],["relevant","closely connected to the matter"],
  ["rigorous","extremely thorough and careful"],["robust","strong and healthy"],["subjective","based on personal opinions"],
  ["subsequent","coming after something"],["substantial","large in amount or importance"],["superficial","existing only on the surface"],
  ["tentative","not certain; provisional"],["trivial","of little value or importance"],["unanimous","fully in agreement"],
  ["unprecedented","never done or known before"],["valid","logically sound"],["viable","capable of working successfully"],
  ["widespread","spread over a large area"],["adhere","to stick firmly or follow"],["assert","to state firmly"],
  ["constitute","to form or make up"],["denote","to indicate or signify"],["derive","to obtain from a source"],
  ["devise","to plan or invent"],["differentiate","to recognize a difference"],["diminish","to make smaller"],
  ["endorse","to declare public approval"],["exemplify","to be a typical example of"],["facilitate","to make easier"],
  ["impose","to force something on someone"],["incorporate","to include as a part"],["induce","to bring about"],
  ["integrate","to combine into a whole"],["intervene","to come between to alter events"],["regulate","to control with rules"],
];

// 3) Предлогтар [сөйлем (___), жауап]
const PREP_POOL = ["in","on","at","for","to","with","of","about","from","by","into","over","under","through"];
const PREPOSITIONS: [string, string][] = [
  ["She is interested ___ classical music.","in"],["He is good ___ mathematics.","at"],["I am proud ___ my achievements.","of"],
  ["They are responsible ___ the project.","for"],["This depends ___ the weather.","on"],["She is married ___ a doctor.","to"],
  ["We are worried ___ the exam.","about"],["He is afraid ___ spiders.","of"],["I agree ___ you.","with"],
  ["She is famous ___ her novels.","for"],["He suffers ___ a rare disease.","from"],["They arrived ___ the airport.","at"],
  ["The book consists ___ ten chapters.","of"],["She apologized ___ being late.","for"],["He insisted ___ paying.","on"],
  ["I congratulate you ___ your success.","on"],["She is similar ___ her sister.","to"],["He is different ___ his brother.","from"],
  ["We rely ___ public transport.","on"],["She is capable ___ great things.","of"],["He is keen ___ football.","on"],
  ["They are aware ___ the risks.","of"],["I am used ___ getting up early.","to"],["She is fond ___ animals.","of"],
  ["He apologized ___ his mistake.","for"],["We believe ___ hard work.","in"],["She succeeded ___ passing the test.","in"],
  ["He is involved ___ the campaign.","in"],["They are satisfied ___ the results.","with"],["I am grateful ___ your help.","for"],
  ["She specializes ___ marketing.","in"],["He recovered ___ his illness.","from"],["We focus ___ quality.","on"],
  ["She is addicted ___ her phone.","to"],["He is jealous ___ his colleague.","of"],["They benefit ___ the policy.","from"],
  ["I am accustomed ___ the climate.","to"],["She is committed ___ her studies.","to"],["He is confident ___ his abilities.","of"],
  ["We are concerned ___ the future.","about"],["The price increased ___ ten percent.","by"],["She is engaged ___ research.","in"],
  ["He complained ___ the noise.","about"],["They objected ___ the plan.","to"],["I prefer tea ___ coffee.","to"],
  ["She is independent ___ her parents.","of"],["He is senior ___ me at work.","to"],["We discussed it ___ great detail.","in"],
  ["She is allergic ___ peanuts.","to"],["He is enthusiastic ___ science.","about"],["They are accused ___ fraud.","of"],
  ["I am familiar ___ this software.","with"],["She is devoted ___ her family.","to"],["He participated ___ the contest.","in"],
  ["We are short ___ time.","of"],["She is exempt ___ the fee.","from"],["He is fed up ___ waiting.","with"],
  ["The result is consistent ___ the theory.","with"],["She is opposed ___ the idea.","to"],["He is renowned ___ his research.","for"],
  ["I am optimistic ___ the outcome.","about"],["She is reliant ___ her savings.","on"],["They are entitled ___ a refund.","to"],
  ["He is notorious ___ being late.","for"],["We are deprived ___ sleep.","of"],["She is immune ___ criticism.","to"],
  ["He is obsessed ___ video games.","with"],["I am indifferent ___ the result.","to"],["They are inferior ___ the rivals.","to"],
];

// 4) Тіркестер (collocations) [сөйлем (___), етістік]
const COLLOC_POOL = ["make","do","take","have","get","give","pay","keep","break","catch"];
const COLLOCATIONS: [string, string][] = [
  ["She had to ___ a difficult decision.","make"],["I need to ___ my homework tonight.","do"],["Let's ___ a break for lunch.","take"],
  ["They ___ a great time at the party.","had"],["Please ___ attention to the teacher.","pay"],["He always ___ his promises.","keeps"],
  ["Don't ___ the rules.","break"],["I have to ___ a phone call.","make"],["She wants to ___ a degree in law.","do"],
  ["Can you ___ a photo of us?","take"],["We need to ___ progress on this.","make"],["He likes to ___ exercise daily.","do"],
  ["They ___ a risk by investing.","took"],["I ___ a shower every morning.","take"],["She ___ me a compliment.","gave"],
  ["Please ___ a seat.","take"],["He ___ a mistake on the test.","made"],["We should ___ business with them.","do"],
  ["Let me ___ you some advice.","give"],["I'll ___ care of it.","take"],["She ___ a speech at the event.","gave"],
  ["He ___ his temper and shouted.","lost"],["They ___ an effort to improve.","made"],["I need to ___ some research.","do"],
  ["She ___ a noise in the kitchen.","made"],["We ___ lunch at noon.","have"],["He ___ a fortune in business.","made"],
  ["Please ___ me a favor.","do"],["They ___ a profit last year.","made"],["I want to ___ a rest.","take"],
  ["She ___ the bus to work.","takes"],["He ___ a cold last winter.","caught"],["We ___ a conversation about it.","had"],
  ["I ___ my best on the exam.","did"],["She ___ a fuss about nothing.","made"],["They ___ a record this season.","broke"],
  ["He ___ a living as a writer.","makes"],["We ___ an appointment with the doctor.","made"],["She ___ harm to no one.","did"],
  ["Let's ___ a chance on it.","take"],["He ___ a discovery in the lab.","made"],["I ___ a dream last night.","had"],
  ["They ___ control of the company.","took"],["She ___ progress every day.","makes"],["We ___ a deal with them.","made"],
  ["He ___ notes during the lecture.","took"],["I ___ a habit of reading.","have"],["She ___ an exam tomorrow.","has"],
  ["They ___ the law into their own hands.","took"],["He ___ damage to the car.","did"],["We ___ a party for her.","had"],
];

// 5) Фразалық етістіктер мағынасы (бар деректен + қосымша)
const PHRASAL_EXTRA: [string, string][] = [
  ["call off","to cancel"],["put up with","to tolerate"],["look up to","to admire"],["look down on","to despise"],
  ["get over","to recover from"],["run into","to meet by chance"],["take after","to resemble a relative"],
  ["bring about","to cause to happen"],["come down with","to become ill with"],["cut down on","to reduce"],
  ["drop out of","to quit (a course)"],["fill in for","to substitute for"],["get away with","to escape punishment"],
  ["hold on","to wait"],["keep up with","to stay at the same level as"],["make up","to invent (a story)"],
  ["pass away","to die"],["pull off","to succeed in something difficult"],["put forward","to propose"],
  ["set off","to start a journey"],["sort out","to organize or resolve"],["turn down","to reject"],
  ["back up","to support"],["break up","to end a relationship"],["check out","to investigate"],
  ["count on","to rely on"],["end up","to finally be in a situation"],["get by","to manage with difficulty"],
  ["give in","to surrender"],["hang out","to spend time relaxing"],["look into","to investigate"],
  ["rule out","to exclude as a possibility"],["stand for","to represent"],["take over","to assume control"],
  ["wear out","to become unusable through use"],["work out","to solve or to exercise"],["carry on","to continue"],
  ["come up","to arise (a topic)"],["go off","to explode or to ring"],["hand in","to submit"],
];

// 6) Байланыстырушы сөздер (linkers) [сөйлем (___), жауап]
const LINKERS: [string, string][] = [
  ["It was raining; ___, we stayed home.","therefore"],["The plan is risky; ___, it could succeed.","however"],
  ["He is rich; ___, he is unhappy.","however"],["She studied hard; ___, she passed.","therefore"],
  ["The food was cheap; ___, it was delicious.","moreover"],["___ the high cost, they bought it.","despite"],
  ["___ it was late, we continued working.","although"],["We left early ___ the traffic.","because"],
  ["Sales fell; ___, profits declined.","consequently"],["He likes tea, ___ his wife prefers coffee.","whereas"],
  ["The results were poor; ___, we will try again.","nevertheless"],["Exercise is healthy; ___, it reduces stress.","furthermore"],
  ["Some animals, ___ dolphins, are highly intelligent.","for instance"],["City life is fast; ___, rural life is slow.","in contrast"],
  ["___ being tired, she finished the race.","despite"],["Prices rose; ___, demand decreased.","therefore"],
  ["The hotel was expensive; ___, the service was poor.","moreover"],["___ he is young, he is very wise.","although"],
  ["We canceled the trip ___ the storm.","because"],["The theory is old; ___, it remains useful.","nevertheless"],
  ["Reading improves vocabulary; ___, it boosts memory.","furthermore"],["He failed the first time; ___, he succeeded later.","however"],
  ["Online shopping is convenient; ___, it saves time.","moreover"],["___ the warnings, they ignored the risk.","despite"],
  ["Traffic was heavy; ___, we arrived on time.","nevertheless"],["The North is cold; ___, the South is warm.","in contrast"],
  ["She practiced daily; ___, she improved quickly.","consequently"],["Many fruits, ___ apples, are rich in fiber.","for instance"],
  ["___ the budget was small, the event was a success.","although"],["The product is popular ___ its low price.","because"],
];

// ════════════ ГЕНЕРАТОР ════════════
function buildBank(): BankQuestion[] {
  const out: BankQuestion[] = [];
  const synWords = SYNONYMS.flatMap(([a, b]) => [a, b]);
  const defWords = DEFINITIONS.map(([w]) => w);
  const defTexts = DEFINITIONS.map(([, d]) => d);
  const phrasalAll: [string, string][] = [...phrasalVerbs.map((p) => [p.verb, p.meaning] as [string, string]), ...PHRASAL_EXTRA];
  const phrasalMeanings = phrasalAll.map(([, m]) => m);
  const linkerAnswers = Array.from(new Set(LINKERS.map(([, a]) => a)));

  // Синонимдер — екі бағытта
  SYNONYMS.forEach(([w, s], i) => {
    const q1 = makeQ(`syn-${i}a`, "synonym", `Choose the word closest in meaning to: "${w}"`, `«${w}» сөзіне мағынасы жақын сөзді таңдаңыз`, s, pickDistractors(synWords, [w, s], 6), `"${w}" ≈ "${s}".`);
    if (q1) out.push(q1);
    const q2 = makeQ(`syn-${i}b`, "synonym", `Choose the word closest in meaning to: "${s}"`, `«${s}» сөзіне мағынасы жақын сөзді таңдаңыз`, w, pickDistractors(synWords, [w, s], 6), `"${s}" ≈ "${w}".`);
    if (q2) out.push(q2);
  });

  // Анықтамалар — сөз→анықтама және анықтама→сөз
  DEFINITIONS.forEach(([w, d], i) => {
    const q1 = makeQ(`def-${i}a`, "definition", `What does "${w}" mean?`, `«${w}» нені білдіреді?`, d, pickDistractors(defTexts, [d], 6), `"${w}" — ${d}.`);
    if (q1) out.push(q1);
    const q2 = makeQ(`def-${i}b`, "definition", `Which word means: "${d}"?`, `Қай сөз «${d}» дегенді білдіреді?`, w, pickDistractors(defWords, [w], 6), `"${w}" — ${d}.`);
    if (q2) out.push(q2);
  });

  // Предлогтар
  PREPOSITIONS.forEach(([sentence, ans], i) => {
    const q = makeQ(`prep-${i}`, "preposition", sentence, "Бос орынға дұрыс предлогты таңдаңыз", ans, pickDistractors(PREP_POOL, [ans], 8), `Correct preposition: "${ans}".`);
    if (q) out.push(q);
  });

  // Тіркестер (collocations)
  COLLOCATIONS.forEach(([sentence, ans], i) => {
    const lower = ans.toLowerCase().replace(/s$|made|did|had|took|gave|broke|caught|lost|kept|makes|takes|has/g, (m) => m);
    const base = ["make","do","take","have","get","give","pay","keep","break","catch"].find((b) => ans.toLowerCase().startsWith(b)) || lower;
    const opts = pickDistractors(COLLOC_POOL.map((v) => matchForm(v, ans)), [ans], 8);
    const q = makeQ(`col-${i}`, "collocation", sentence, "Бос орынға дұрыс етістікті таңдаңыз", ans, opts, `Collocation uses "${base}".`);
    if (q) out.push(q);
  });

  // Фразалық етістіктер мағынасы
  phrasalAll.forEach(([pv, m], i) => {
    const q = makeQ(`pv-${i}`, "phrasal", `What does the phrasal verb "${pv}" mean?`, `«${pv}» фразалық етістігі нені білдіреді?`, m, pickDistractors(phrasalMeanings, [m], 6), `"${pv}" — ${m}.`);
    if (q) out.push(q);
  });

  // Байланыстырушы сөздер
  LINKERS.forEach(([sentence, ans], i) => {
    const display = sentence.replace("___", "______");
    const q = makeQ(`lnk-${i}`, "linker", display, "Бос орынға дұрыс байланыстырушы сөзді таңдаңыз", cap(ans), pickDistractors(linkerAnswers.map(cap), [cap(ans)], 8), `Correct linker: "${cap(ans)}".`);
    if (q) out.push(q);
  });

  // Академиялық лексика (жай → академиялық балама)
  const allAcademic = academicVocab.flatMap((a) => a.academic);
  academicVocab.forEach((a, i) => {
    a.academic.slice(0, 3).forEach((ac, j) => {
      const q = makeQ(`acad-${i}-${j}`, "academic", `Choose a more formal (academic) word for "${a.simple}":`, `«${a.simple}» сөзінің академиялық баламасын таңдаңыз`, ac, pickDistractors(allAcademic, a.academic, 8), a.example);
      if (q) out.push(q);
    });
  });

  // Грамматика — дұрыс сөйлемді таңдау (қате нұсқалар басқа ережелерден)
  const allWrong = grammarPoints.map((g) => g.example.wrong);
  grammarPoints.forEach((g, i) => {
    const q = makeQ(`gr-${i}`, "grammar", "Choose the grammatically correct sentence:", "Грамматикалық дұрыс сөйлемді таңдаңыз", g.example.right, [g.example.wrong, ...pickDistractors(allWrong, [g.example.wrong], 4)], g.miniExplanation);
    if (q) out.push(q);
  });

  return out;
}

// Етістік формасын сәйкестендіру (collocation дистракторлары үшін)
function matchForm(base: string, answer: string): string {
  if (/ed$/.test(answer) && !["make","do","have","take","give","break","catch","keep"].includes(answer)) return base + "ed";
  if (answer.endsWith("s") && !answer.endsWith("ss")) {
    const m: Record<string, string> = { have: "has", do: "does", make: "makes", take: "takes", get: "gets", give: "gives", pay: "pays", keep: "keeps", break: "breaks", catch: "catches" };
    return m[base] || base + "s";
  }
  const past: Record<string, string> = { make: "made", do: "did", have: "had", take: "took", give: "gave", break: "broke", catch: "caught", get: "got", keep: "kept", pay: "paid" };
  if (["made","did","had","took","gave","broke","caught","got","kept","paid","lost"].includes(answer)) return past[base] || base;
  return base;
}
function cap(s: string): string { return s.charAt(0).toUpperCase() + s.slice(1); }

// Толық база (бір рет құрастырылады)
export const QUESTION_BANK: BankQuestion[] = buildBank();

// Категория белгілері
export const CATEGORY_LABELS: Record<QCategory, { kk: string; en: string }> = {
  synonym: { kk: "Синонимдер", en: "Synonyms" },
  definition: { kk: "Анықтамалар", en: "Definitions" },
  preposition: { kk: "Предлогтар", en: "Prepositions" },
  collocation: { kk: "Сөз тіркестері", en: "Collocations" },
  phrasal: { kk: "Фразалық етістіктер", en: "Phrasal verbs" },
  linker: { kk: "Байланыстырушы сөздер", en: "Linkers" },
  grammar: { kk: "Грамматика", en: "Grammar" },
  academic: { kk: "Академиялық лексика", en: "Academic vocabulary" },
};

// Кездейсоқ тест жинау (ауыспалы — әр жолы әртүрлі)
export function generateQuiz(count: number, category?: QCategory): BankQuestion[] {
  const pool = category ? QUESTION_BANK.filter((q) => q.category === category) : QUESTION_BANK;
  const picked: BankQuestion[] = [];
  const used = new Set<number>();
  const n = Math.min(count, pool.length);
  while (picked.length < n) {
    const idx = Math.floor(Math.random() * pool.length);
    if (used.has(idx)) continue;
    used.add(idx);
    // Нұсқаларды әр жолы жаңадан араластыру
    const q = pool[idx];
    picked.push({ ...q, options: [...q.options].sort(() => Math.random() - 0.5) });
  }
  return picked;
}

export const BANK_SIZE = QUESTION_BANK.length;
