// filepath: src/lib/ieltsData.ts
// IELTS Reading тест базасы — нағыз емтихан деңгейінде.
// Толық тест: 3 passage, 40 сұрақ, әртүрлі сұрақ түрлері.
// Кеңейтуге дайын (көп тест қосуға болады).

import type { ReadingTest } from "@/types/ielts";
import { test2 } from "./ielts/test2";
import { test3 } from "./ielts/test3";
import { test4 } from "./ielts/test4";
import { test5 } from "./ielts/test5";

// ── ТЕСТ 1 ──
export const test1: ReadingTest = {
  id: "reading-test-1",
  title: "Academic Reading — Test 1",
  titleKk: "Академиялық оқу — 1-тест",
  timeMinutes: 60,
  totalQuestions: 40,
  passages: [
    // ═══════════ PASSAGE 1 (жеңіл) ═══════════
    {
      id: "p1",
      number: 1,
      title: "The History of Tea",
      titleKk: "Шай тарихы",
      topic: "History",
      difficulty: "easy",
      wordCount: 700,
      paragraphs: [
        {
          label: "A",
          text: "Tea is one of the most widely consumed beverages in the world, second only to water. Its origins can be traced back to ancient China, where, according to legend, the Chinese emperor Shen Nung discovered tea in 2737 BC. The story goes that some tea leaves accidentally blew into a pot of boiling water that the emperor was preparing. Intrigued by the pleasant aroma, he tasted the resulting brew and found it refreshing. Whether or not this legend is true, tea has been an integral part of Chinese culture for thousands of years.",
        },
        {
          label: "B",
          text: "For centuries, tea remained largely unknown outside of Asia. It was not until the 16th century that European traders and missionaries first encountered the beverage during their travels to the East. Portuguese and Dutch merchants began importing tea to Europe in the early 17th century, though it was initially regarded as an expensive luxury affordable only to the wealthy. The high cost was due to the long and difficult journey from China, as well as heavy taxes imposed by various governments.",
        },
        {
          label: "C",
          text: "Tea was introduced to Britain in the 1650s, where it gradually gained popularity. The marriage of King Charles II to the Portuguese princess Catherine of Braganza in 1662 played a significant role in popularising tea among the British aristocracy, as Catherine was a dedicated tea drinker. Over the following decades, tea drinking spread from the upper classes to the general population. By the 18th century, it had become the national drink of Britain, a status it retains to this day.",
        },
        {
          label: "D",
          text: "The growing demand for tea in Britain had far-reaching economic and political consequences. The British East India Company established a monopoly over the tea trade, importing vast quantities from China. However, this trade created a significant imbalance, as Britain had little that China wished to buy in return. To address this, Britain began exporting opium to China, leading to tensions that eventually erupted into the Opium Wars of the 19th century. The tea trade thus became entangled in broader geopolitical conflicts.",
        },
        {
          label: "E",
          text: "In an effort to break China's monopoly on tea production, the British began cultivating tea in India during the 1830s. The discovery of native tea plants in the Assam region of India proved crucial to this endeavour. Indian tea production expanded rapidly, and by the late 19th century, India had surpassed China as the world's leading exporter of tea. Tea plantations also spread to other British colonies, including Ceylon (modern-day Sri Lanka), which remains a major tea producer today.",
        },
        {
          label: "F",
          text: "Today, tea is cultivated in more than 40 countries, with China and India remaining the largest producers. The beverage comes in many varieties, including black, green, white, and oolong, all of which are derived from the same plant, Camellia sinensis. The differences between these varieties result from variations in how the leaves are processed after harvesting. Tea continues to play an important cultural and economic role around the world, enjoyed by billions of people every day.",
        },
      ],
      groups: [
        {
          id: "p1g1",
          type: "true-false-notgiven",
          instruction: "Do the following statements agree with the information given in the passage? Choose TRUE if the statement agrees, FALSE if it contradicts, or NOT GIVEN if there is no information.",
          instructionKk: "Төмендегі тұжырымдар мәтіндегі ақпаратпен сәйкес келе ме? TRUE (сәйкес), FALSE (қайшы), немесе NOT GIVEN (ақпарат жоқ) таңдаңыз.",
          questions: [
            {
              id: "q1", type: "true-false-notgiven", number: 1,
              prompt: "The legend claims that Emperor Shen Nung discovered tea by accident.",
              answer: "TRUE",
              explanation: "Абзац A: аңыз бойынша шай жапырақтары қайнап жатқан суға кездейсоқ түскен.",
              paragraphRef: 0,
            },
            {
              id: "q2", type: "true-false-notgiven", number: 2,
              prompt: "Tea was popular in Europe before the 16th century.",
              answer: "FALSE",
              explanation: "Абзац B: 16 ғасырға дейін шай Азиядан тыс белгісіз болды.",
              paragraphRef: 1,
            },
            {
              id: "q3", type: "true-false-notgiven", number: 3,
              prompt: "Catherine of Braganza disliked drinking tea.",
              answer: "FALSE",
              explanation: "Абзац C: Екатерина шайды жақсы көретін (dedicated tea drinker).",
              paragraphRef: 2,
            },
            {
              id: "q4", type: "true-false-notgiven", number: 4,
              prompt: "The British East India Company faced competition from French traders in the tea trade.",
              answer: "NOT GIVEN",
              explanation: "Француз саудагерлері туралы мәтінде ештеңе айтылмаған.",
              paragraphRef: 3,
            },
            {
              id: "q5", type: "true-false-notgiven", number: 5,
              prompt: "India produced more tea than China by the end of the 19th century.",
              answer: "TRUE",
              explanation: "Абзац E: 19 ғасыр соңында Үндістан Қытайды басып озды.",
              paragraphRef: 4,
            },
          ],
        },
        {
          id: "p1g2",
          type: "sentence-completion",
          instruction: "Complete the sentences below. Choose NO MORE THAN TWO WORDS from the passage for each answer.",
          instructionKk: "Төмендегі сөйлемдерді толықтырыңыз. Әр жауап үшін мәтіннен ЕКІ СӨЗДЕН АСПАЙТЫН сөз таңдаңыз.",
          wordLimit: 2,
          questions: [
            {
              id: "q6", type: "sentence-completion", number: 6,
              prompt: "Tea is the most consumed drink in the world after _______.",
              answer: "water",
              explanation: "Абзац A: 'second only to water'.",
              paragraphRef: 0,
            },
            {
              id: "q7", type: "sentence-completion", number: 7,
              prompt: "Portuguese and Dutch _______ first brought tea to Europe.",
              answer: "merchants",
              acceptableAnswers: ["traders"],
              explanation: "Абзац B: Португал және голланд саудагерлері.",
              paragraphRef: 1,
            },
            {
              id: "q8", type: "sentence-completion", number: 8,
              prompt: "Native tea plants were found in the _______ region of India.",
              answer: "Assam",
              explanation: "Абзац E: 'native tea plants in the Assam region'.",
              paragraphRef: 4,
            },
            {
              id: "q9", type: "sentence-completion", number: 9,
              prompt: "All tea varieties come from a plant called _______.",
              answer: "Camellia sinensis",
              explanation: "Абзац F: барлық шай Camellia sinensis өсімдігінен.",
              paragraphRef: 5,
            },
            {
              id: "q10", type: "sentence-completion", number: 10,
              prompt: "Tea is now grown in over _______ countries.",
              answer: "40",
              acceptableAnswers: ["forty", "40 countries"],
              explanation: "Абзац F: 40-тан астам елде.",
              paragraphRef: 5,
            },
          ],
        },
        {
          id: "p1g3",
          type: "multiple-choice",
          instruction: "Choose the correct letter, A, B, C or D.",
          instructionKk: "Дұрыс әріпті таңдаңыз: A, B, C немесе D.",
          questions: [
            {
              id: "q11", type: "multiple-choice", number: 11,
              prompt: "Why was tea expensive when first imported to Europe?",
              options: [
                "It was of very high quality.",
                "The journey was long and taxes were high.",
                "Only emperors were allowed to drink it.",
                "There was very little tea available.",
              ],
              answer: "1",
              explanation: "Абзац B: қашықтық пен жоғары салықтар себебінен қымбат болды (B нұсқасы, индекс 1).",
              paragraphRef: 1,
            },
            {
              id: "q12", type: "multiple-choice", number: 12,
              prompt: "What led to the Opium Wars?",
              options: [
                "China refused to sell tea to Britain.",
                "Britain exported opium to China to balance trade.",
                "India started producing its own tea.",
                "European traders stopped buying tea.",
              ],
              answer: "1",
              explanation: "Абзац D: сауда тепе-теңдігі үшін Британия апиын экспорттады (B нұсқасы, индекс 1).",
              paragraphRef: 3,
            },
            {
              id: "q13", type: "multiple-choice", number: 13,
              prompt: "What determines the difference between tea varieties?",
              options: [
                "The country where they are grown.",
                "The type of plant used.",
                "How the leaves are processed after harvest.",
                "The age of the tea plant.",
              ],
              answer: "2",
              explanation: "Абзац F: айырмашылық жапырақты өңдеу тәсіліне байланысты (C нұсқасы, индекс 2).",
              paragraphRef: 5,
            },
          ],
        },
      ],
    },
  ],
};

// ═══════════ PASSAGE 2 (орта) — test1-ге қосамыз ═══════════
test1.passages.push({
  id: "p2",
  number: 2,
  title: "The Science of Sleep",
  titleKk: "Ұйқы ғылымы",
  topic: "Science",
  difficulty: "medium",
  wordCount: 850,
  paragraphs: [
    {
      label: "A",
      text: "Sleep is a fundamental biological process that all humans require, yet for much of history it remained one of the least understood aspects of human life. Only in the last century have scientists begun to unravel the complex mechanisms that govern our sleep. We now know that sleep is not simply a passive state of rest, but an active period during which the brain and body carry out a range of essential functions.",
    },
    {
      label: "B",
      text: "Research has revealed that sleep consists of several distinct stages, which cycle throughout the night. These stages are broadly divided into two categories: rapid eye movement (REM) sleep and non-REM sleep. Non-REM sleep itself is further divided into three stages, ranging from light sleep to deep sleep. A complete sleep cycle, progressing through all stages, typically lasts around 90 minutes, and a person experiences four to six such cycles during a normal night's sleep.",
    },
    {
      label: "C",
      text: "Each stage of sleep serves different purposes. Deep non-REM sleep is believed to be crucial for physical restoration, during which the body repairs tissues, builds bone and muscle, and strengthens the immune system. REM sleep, on the other hand, is associated with cognitive functions such as memory consolidation and learning. It is during REM sleep that most vivid dreaming occurs, and the brain is almost as active as it is during waking hours.",
    },
    {
      label: "D",
      text: "The amount of sleep a person needs varies according to age. Newborn babies may sleep for up to 17 hours a day, while teenagers require around 8 to 10 hours. Most adults function best with 7 to 9 hours of sleep per night, though individual needs can vary. As people grow older, they often find that their sleep becomes lighter and more fragmented, which is a normal part of ageing.",
    },
    {
      label: "E",
      text: "Insufficient sleep can have serious consequences for health and wellbeing. In the short term, lack of sleep impairs concentration, judgement, and reaction times, making everyday tasks more difficult and increasing the risk of accidents. Chronic sleep deprivation has been linked to a range of health problems, including obesity, diabetes, cardiovascular disease, and weakened immune function. Studies have also found connections between poor sleep and mental health conditions such as depression and anxiety.",
    },
    {
      label: "F",
      text: "In modern society, many people fail to get adequate sleep. The widespread use of electronic devices, particularly before bedtime, has been identified as a significant contributor to this problem. The blue light emitted by screens can interfere with the production of melatonin, the hormone that regulates sleep. Experts recommend establishing a regular sleep schedule, avoiding screens before bed, and creating a comfortable sleep environment to improve sleep quality.",
    },
    {
      label: "G",
      text: "Despite the considerable progress made in sleep research, many questions remain unanswered. Scientists continue to investigate why we dream, how sleep affects various diseases, and whether the damage caused by sleep deprivation can be reversed. As our understanding deepens, it becomes increasingly clear that good sleep is not a luxury but a necessity for a healthy life.",
    },
  ],
  groups: [
    {
      id: "p2g1",
      type: "matching-headings",
      instruction: "The passage has seven paragraphs, A-G. Choose the correct heading for paragraphs B, C, E, F and G from the list of headings below.",
      instructionKk: "Мәтінде жеті абзац бар (A-G). B, C, E, F және G абзацтарына сәйкес тақырыпты төмендегі тізімнен таңдаңыз.",
      headings: [
        { id: "i", text: "The consequences of not sleeping enough" },
        { id: "ii", text: "How technology affects our sleep" },
        { id: "iii", text: "The different stages of sleep" },
        { id: "iv", text: "Unanswered questions in sleep research" },
        { id: "v", text: "How much sleep different people need" },
        { id: "vi", text: "The purpose of each sleep stage" },
        { id: "vii", text: "Sleep as an active process" },
      ],
      questions: [
        {
          id: "q14", type: "matching-headings", number: 14,
          prompt: "Paragraph B",
          options: ["i", "ii", "iii", "iv", "v", "vi", "vii"],
          answer: "iii",
          explanation: "B абзац ұйқының кезеңдері (REM, non-REM) туралы.",
          paragraphRef: 1,
        },
        {
          id: "q15", type: "matching-headings", number: 15,
          prompt: "Paragraph C",
          options: ["i", "ii", "iii", "iv", "v", "vi", "vii"],
          answer: "vi",
          explanation: "C абзац әр кезеңнің мақсаты туралы (физикалық қалпына келу, есте сақтау).",
          paragraphRef: 2,
        },
        {
          id: "q16", type: "matching-headings", number: 16,
          prompt: "Paragraph E",
          options: ["i", "ii", "iii", "iv", "v", "vi", "vii"],
          answer: "i",
          explanation: "E абзац ұйқысыздықтың салдары туралы.",
          paragraphRef: 4,
        },
        {
          id: "q17", type: "matching-headings", number: 17,
          prompt: "Paragraph F",
          options: ["i", "ii", "iii", "iv", "v", "vi", "vii"],
          answer: "ii",
          explanation: "F абзац технологияның ұйқыға әсері туралы.",
          paragraphRef: 5,
        },
        {
          id: "q18", type: "matching-headings", number: 18,
          prompt: "Paragraph G",
          options: ["i", "ii", "iii", "iv", "v", "vi", "vii"],
          answer: "iv",
          explanation: "G абзац жауапсыз сұрақтар туралы.",
          paragraphRef: 6,
        },
      ],
    },
    {
      id: "p2g2",
      type: "true-false-notgiven",
      instruction: "Do the following statements agree with the information given in the passage? Choose TRUE, FALSE or NOT GIVEN.",
      instructionKk: "Тұжырымдар мәтінмен сәйкес пе? TRUE, FALSE немесе NOT GIVEN таңдаңыз.",
      questions: [
        {
          id: "q19", type: "true-false-notgiven", number: 19,
          prompt: "A complete sleep cycle lasts about 90 minutes.",
          answer: "TRUE",
          explanation: "B абзац: толық цикл шамамен 90 минут.",
          paragraphRef: 1,
        },
        {
          id: "q20", type: "true-false-notgiven", number: 20,
          prompt: "The body repairs tissues mainly during REM sleep.",
          answer: "FALSE",
          explanation: "C абзац: дене терең non-REM ұйқыда қалпына келеді, REM-де емес.",
          paragraphRef: 2,
        },
        {
          id: "q21", type: "true-false-notgiven", number: 21,
          prompt: "Teenagers need more sleep than newborn babies.",
          answer: "FALSE",
          explanation: "D абзац: нәрестелер 17 сағатқа дейін, жасөспірімдер 8-10 сағат.",
          paragraphRef: 3,
        },
        {
          id: "q22", type: "true-false-notgiven", number: 22,
          prompt: "Drinking coffee in the evening reduces sleep quality.",
          answer: "NOT GIVEN",
          explanation: "Кофе туралы мәтінде айтылмаған.",
          paragraphRef: 5,
        },
      ],
    },
    {
      id: "p2g3",
      type: "summary-completion",
      instruction: "Complete the summary below. Choose NO MORE THAN TWO WORDS from the passage for each answer.",
      instructionKk: "Қорытындыны толықтырыңыз. Әр жауап үшін мәтіннен ЕКІ СӨЗДЕН АСПАЙТЫН сөз таңдаңыз.",
      wordLimit: 2,
      questions: [
        {
          id: "q23", type: "summary-completion", number: 23,
          prompt: "Lack of sleep can impair concentration and increase the risk of _______.",
          answer: "accidents",
          explanation: "E абзац: жазатайым оқиғалар қаупі артады.",
          paragraphRef: 4,
        },
        {
          id: "q24", type: "summary-completion", number: 24,
          prompt: "The blue light from screens interferes with the production of _______.",
          answer: "melatonin",
          explanation: "F абзац: көк жарық мелатонин өндірісіне кедергі келтіреді.",
          paragraphRef: 5,
        },
        {
          id: "q25", type: "summary-completion", number: 25,
          prompt: "Experts recommend keeping a regular sleep _______.",
          answer: "schedule",
          explanation: "F абзац: тұрақты ұйқы кестесі.",
          paragraphRef: 5,
        },
        {
          id: "q26", type: "summary-completion", number: 26,
          prompt: "Good sleep is described not as a luxury but as a _______.",
          answer: "necessity",
          explanation: "G абзац: ұйқы — қажеттілік, сәнділік емес.",
          paragraphRef: 6,
        },
      ],
    },
  ],
});

// ═══════════ PASSAGE 3 (қиын) ═══════════
test1.passages.push({
  id: "p3",
  number: 3,
  title: "The Rise of Artificial Intelligence",
  titleKk: "Жасанды интеллекттің өрлеуі",
  topic: "Technology",
  difficulty: "hard",
  wordCount: 950,
  paragraphs: [
    {
      label: "A",
      text: "Artificial intelligence (AI) has emerged as one of the most transformative technologies of the modern era, promising to reshape virtually every aspect of human society. Although the concept of machines capable of intelligent behaviour dates back to antiquity, the formal field of AI research was established only in the mid-twentieth century. Since then, the discipline has experienced periods of intense optimism followed by disappointment, a pattern that has shaped its development in profound ways.",
    },
    {
      label: "B",
      text: "The term 'artificial intelligence' was coined in 1956 at a conference at Dartmouth College, which is widely regarded as the founding event of the field. The early pioneers were extraordinarily optimistic, with some predicting that machines capable of human-level intelligence would be developed within a generation. This optimism proved premature. The technical challenges were far greater than anticipated, and funding for AI research dried up during the 1970s, a period now known as the first 'AI winter'.",
    },
    {
      label: "C",
      text: "Interest in AI was revived in the 1980s with the development of 'expert systems', programs designed to replicate the decision-making abilities of human specialists in specific domains. However, these systems were expensive to build and maintain, and their capabilities were limited. A second AI winter followed in the late 1980s and early 1990s. It was not until the twenty-first century that AI began to fulfil some of its early promise, driven by a combination of factors.",
    },
    {
      label: "D",
      text: "The recent resurgence of AI can be attributed to three key developments. First, the exponential growth in computing power has made it possible to perform calculations that were previously impractical. Second, the explosion of digital data, generated by the internet and connected devices, has provided the vast quantities of information needed to train AI systems. Third, advances in machine learning algorithms, particularly a technique known as deep learning, have dramatically improved the performance of AI systems on a wide range of tasks.",
    },
    {
      label: "E",
      text: "Deep learning, which is loosely inspired by the structure of the human brain, uses artificial neural networks with many layers to identify patterns in data. This approach has achieved remarkable results in areas such as image recognition, natural language processing, and game playing. In 2016, an AI system developed by a technology company defeated a world champion at the ancient board game Go, a feat that experts had predicted was still many years away. Such achievements have captured public attention and fuelled both excitement and concern about the future of AI.",
    },
    {
      label: "F",
      text: "The increasing capabilities of AI have raised significant ethical and social questions. Concerns have been expressed about the potential for AI to displace human workers, as machines become capable of performing tasks previously thought to require human intelligence. There are also worries about bias in AI systems, which can perpetuate or amplify existing inequalities if they are trained on biased data. Furthermore, the use of AI in areas such as surveillance and autonomous weapons has prompted calls for regulation and oversight.",
    },
    {
      label: "G",
      text: "Despite these concerns, many experts believe that AI has the potential to bring enormous benefits to humanity. In medicine, AI systems are being used to diagnose diseases, discover new drugs, and personalise treatments. In science, AI is accelerating research by analysing complex data sets and generating new hypotheses. Proponents argue that, if developed responsibly, AI could help address some of the most pressing challenges facing humanity, from climate change to disease. The key, they suggest, lies in ensuring that the technology is developed and deployed in ways that benefit society as a whole.",
    },
  ],
  groups: [
    {
      id: "p3g1",
      type: "multiple-choice",
      instruction: "Choose the correct letter, A, B, C or D.",
      instructionKk: "Дұрыс әріпті таңдаңыз: A, B, C немесе D.",
      questions: [
        {
          id: "q27", type: "multiple-choice", number: 27,
          prompt: "When was the field of AI research formally established?",
          options: [
            "In ancient times",
            "In the mid-twentieth century",
            "In the 1980s",
            "In the twenty-first century",
          ],
          answer: "1",
          explanation: "A абзац: AI зерттеу саласы 20 ғасыр ортасында құрылды (индекс 1).",
          paragraphRef: 0,
        },
        {
          id: "q28", type: "multiple-choice", number: 28,
          prompt: "What caused the first 'AI winter'?",
          options: [
            "A lack of interest from researchers",
            "Technical challenges and reduced funding",
            "The development of expert systems",
            "Competition from other technologies",
          ],
          answer: "1",
          explanation: "B абзац: техникалық қиындықтар мен қаржының азаюы (индекс 1).",
          paragraphRef: 1,
        },
        {
          id: "q29", type: "multiple-choice", number: 29,
          prompt: "What happened in 2016?",
          options: [
            "The term 'artificial intelligence' was coined.",
            "The first expert system was developed.",
            "An AI system defeated a Go world champion.",
            "Deep learning was invented.",
          ],
          answer: "2",
          explanation: "E абзац: 2016 жылы AI Go чемпионын жеңді (индекс 2).",
          paragraphRef: 4,
        },
        {
          id: "q30", type: "multiple-choice", number: 30,
          prompt: "What is deep learning inspired by?",
          options: [
            "The structure of the human brain",
            "Ancient board games",
            "Expert systems",
            "The internet",
          ],
          answer: "0",
          explanation: "E абзац: терең оқыту адам миының құрылымынан шабыт алады (индекс 0).",
          paragraphRef: 4,
        },
      ],
    },
    {
      id: "p3g2",
      type: "true-false-notgiven",
      instruction: "Do the following statements agree with the claims of the writer? Choose YES, NO or NOT GIVEN.",
      instructionKk: "Тұжырымдар автордың пікірімен сәйкес пе? YES, NO немесе NOT GIVEN таңдаңыз.",
      questions: [
        {
          id: "q31", type: "yes-no-notgiven", number: 31,
          prompt: "The early AI pioneers underestimated how difficult the task would be.",
          answer: "YES",
          explanation: "B абзац: техникалық қиындықтар күткеннен әлдеқайда үлкен болды.",
          paragraphRef: 1,
        },
        {
          id: "q32", type: "yes-no-notgiven", number: 32,
          prompt: "Expert systems were cheap and easy to maintain.",
          answer: "NO",
          explanation: "C абзац: экспорттық жүйелер қымбат әрі шектеулі болды.",
          paragraphRef: 2,
        },
        {
          id: "q33", type: "yes-no-notgiven", number: 33,
          prompt: "AI is currently being used to diagnose diseases.",
          answer: "YES",
          explanation: "G абзац: AI медицинада ауруларды анықтауда қолданылуда.",
          paragraphRef: 6,
        },
        {
          id: "q34", type: "yes-no-notgiven", number: 34,
          prompt: "Most governments have already introduced strict AI regulations.",
          answer: "NOT GIVEN",
          explanation: "Үкіметтердің нақты реттеуі туралы мәтінде айтылмаған.",
          paragraphRef: 5,
        },
      ],
    },
    {
      id: "p3g3",
      type: "sentence-completion",
      instruction: "Complete the sentences below. Choose NO MORE THAN TWO WORDS from the passage for each answer.",
      instructionKk: "Сөйлемдерді толықтырыңыз. Әр жауап үшін мәтіннен ЕКІ СӨЗДЕН АСПАЙТЫН сөз таңдаңыз.",
      wordLimit: 2,
      questions: [
        {
          id: "q35", type: "sentence-completion", number: 35,
          prompt: "The term 'artificial intelligence' was first used at a conference at _______ College.",
          answer: "Dartmouth",
          explanation: "B абзац: Dartmouth колледжінде.",
          paragraphRef: 1,
        },
        {
          id: "q36", type: "sentence-completion", number: 36,
          prompt: "The growth in computing _______ made new calculations possible.",
          answer: "power",
          explanation: "D абзац: есептеу қуатының өсуі.",
          paragraphRef: 3,
        },
        {
          id: "q37", type: "sentence-completion", number: 37,
          prompt: "Deep learning uses artificial neural _______ to find patterns.",
          answer: "networks",
          explanation: "E абзац: жасанды нейрондық желілер.",
          paragraphRef: 4,
        },
        {
          id: "q38", type: "sentence-completion", number: 38,
          prompt: "AI systems trained on biased data can amplify existing _______.",
          answer: "inequalities",
          explanation: "F абзац: теңсіздіктерді күшейтуі мүмкін.",
          paragraphRef: 5,
        },
        {
          id: "q39", type: "sentence-completion", number: 39,
          prompt: "In science, AI helps by generating new _______.",
          answer: "hypotheses",
          explanation: "G абзац: жаңа гипотезалар жасайды.",
          paragraphRef: 6,
        },
        {
          id: "q40", type: "sentence-completion", number: 40,
          prompt: "Experts say AI should be developed _______.",
          answer: "responsibly",
          explanation: "G абзац: жауапкершілікпен дамыту керек.",
          paragraphRef: 6,
        },
      ],
    },
  ],
});

// Барлық тесттер

export const readingTests: ReadingTest[] = [test1, test2, test3, test4, test5];

