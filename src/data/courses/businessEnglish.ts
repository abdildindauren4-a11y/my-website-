// filepath: src/data/courses/businessEnglish.ts
// Кәсіби курс — Business English Mastery (Coursera тәрізді).
// Әр модуль: алдымен оқу материалы (теория), сосын тапсырмалар.

import type { CourseLevel } from "@/types/course";

export const businessEnglish: CourseLevel = {
  id: "business-english",
  level: "intermediate",
  title: "Business English Mastery",
  titleKk: "Іскери ағылшын шеберлігі",
  description: "Communicate professionally at work: emails, meetings, presentations and negotiations.",
  descriptionKk: "Жұмыста кәсіби қарым-қатынас: хаттар, кездесулер, презентациялар және келіссөздер.",
  lang: "en",
  category: "Business", categoryKk: "Бизнес", emoji: "💼", color: "accent-blue",
  hours: 6, instructor: "LinguaFast Academy", certificate: true,
  skills: [
    "Write clear, professional emails",
    "Lead and take part in meetings",
    "Deliver confident presentations",
    "Use persuasive negotiation language",
  ],
  skillsKk: [
    "Айқын, кәсіби хаттар жазу",
    "Кездесулерді жүргізу және қатысу",
    "Сенімді презентация жасау",
    "Сендіретін келіссөз тілін қолдану",
  ],
  units: [
    // ═══════════ МОДУЛЬ 1 — Professional Emails ═══════════
    {
      id: "be-u1", number: 1, title: "Professional Emails", titleKk: "Кәсіби хаттар",
      description: "Structure, tone and phrases for effective emails", descriptionKk: "Тиімді хаттың құрылымы, стилі және тіркестері",
      icon: "FileText", color: "accent-blue",
      lessons: [
        {
          id: "be-l1", type: "grammar", title: "Writing Effective Emails", titleKk: "Тиімді хат жазу",
          description: "Learn the structure and language of professional emails", descriptionKk: "Кәсіби хаттың құрылымы мен тілін үйреніңіз",
          xpReward: 50, estimatedMinutes: 15,
          theory: {
            explanation: "A professional email has a clear structure: a subject line, a greeting, an opening line, the body, a call to action, a closing, and a signature. Keep it concise, polite and specific.",
            explanationKk: "Кәсіби хаттың айқын құрылымы болады: тақырып жолы, сәлемдесу, кіріспе, негізгі бөлім, әрекетке шақыру, қорытынды және қолтаңба. Қысқа, сыпайы әрі нақты жазыңыз.",
            sections: [
              { heading: "1. Subject line", body: "Make it specific and short. Good: 'Meeting request: Q3 budget review'. Weak: 'Hello' or 'Important'. The reader should know the purpose before opening." },
              { heading: "2. Greeting & register", body: "Formal: 'Dear Mr. Brown,' / 'Dear Sir or Madam,'. Neutral: 'Hello Anna,'. Avoid 'Hey' in formal contexts. Match the reader's level of formality." },
              { heading: "3. Opening lines", body: "Reason for writing: 'I am writing to…', 'I am writing regarding…'. Replies: 'Thank you for your email.', 'Thank you for getting back to me.'" },
              { heading: "4. Requests & closing", body: "Polite requests: 'Could you please…', 'I would appreciate it if you could…'. Closings: 'Kind regards,' / 'Best regards,' (neutral–formal), 'Best,' (friendly)." },
            ],
            keyPoints: [
              "One email = one clear purpose.",
              "Match formality to your reader.",
              "Use polite request forms: 'Could you…', 'Would you mind…'.",
              "End with a clear next step and a professional sign-off.",
            ],
            examples: [
              { text: "I am writing to enquire about your services.", translation: "Қызметтеріңіз туралы сұрау үшін жазып отырмын." },
              { text: "Could you please send me the report by Friday?", translation: "Есепті жұма күнге дейін жібере аласыз ба?" },
              { text: "I look forward to hearing from you.", translation: "Жауабыңызды күтемін." },
            ],
          },
          exercises: [
            { id: "be1e1", type: "multiple-choice", prompt: "Which is the most professional email greeting to a client you don't know?", options: ["Hey!", "Dear Sir or Madam,", "Yo,", "Hi buddy,"], answer: "Dear Sir or Madam," },
            { id: "be1e2", type: "multiple-choice", prompt: "Choose the best subject line for a meeting request.", options: ["Hello", "Stuff", "Meeting request: Q3 budget review", "Read this now"], answer: "Meeting request: Q3 budget review" },
            { id: "be1e3", type: "fill-blank", prompt: "Complete the polite request", sentence: "Could you please ___ me the report by Friday?", answer: "send", hint: "verb" },
            { id: "be1e4", type: "multiple-choice", prompt: "Which is a professional closing?", options: ["Bye bye", "Kind regards,", "See ya", "Later"], answer: "Kind regards," },
            { id: "be1e5", type: "fill-blank", prompt: "Complete the opening line", sentence: "I am writing to ___ about your services.", answer: "enquire", acceptableAnswers: ["inquire", "ask"] },
            { id: "be1e6", type: "word-order", prompt: "Put the words in order to form a polite request.", sentence: "I|would|appreciate|it|if|you|could|reply|soon", answer: "I would appreciate it if you could reply soon" },
            { id: "be1e7", type: "multiple-choice", prompt: "How should you reply when someone answers your email?", options: ["Thank you for getting back to me.", "Whatever.", "OK done.", "No comment."], answer: "Thank you for getting back to me." },
          ],
        },
      ],
    },
    // ═══════════ МОДУЛЬ 2 — Meetings ═══════════
    {
      id: "be-u2", number: 2, title: "Meetings & Discussions", titleKk: "Кездесулер мен талқылаулар",
      description: "Language to open, contribute to and lead meetings", descriptionKk: "Кездесуді бастау, қатысу және жүргізу тілі",
      icon: "MessageSquare", color: "accent-green",
      lessons: [
        {
          id: "be-l2", type: "grammar", title: "Language for Meetings", titleKk: "Кездесу тілі",
          description: "Phrases to participate professionally in meetings", descriptionKk: "Кездесуге кәсіби қатысу тіркестері",
          xpReward: 50, estimatedMinutes: 15,
          theory: {
            explanation: "In meetings you need language to open, give opinions, agree and disagree politely, interrupt, and summarise. Being polite and structured makes you sound professional and credible.",
            explanationKk: "Кездесуде ашу, пікір білдіру, сыпайы келісу/келіспеу, сөзге араласу және қорыту тілі керек. Сыпайы әрі құрылымды сөйлеу сізді кәсіби көрсетеді.",
            sections: [
              { heading: "Opening & agenda", body: "'Thank you all for coming.', 'Let's get started.', 'Today we need to discuss three points.', 'Let's move on to the next item.'" },
              { heading: "Giving & asking opinions", body: "'In my opinion…', 'From my point of view…', 'I'd suggest that…'. Asking: 'What do you think, Anna?', 'How do you feel about this?'" },
              { heading: "Agreeing & disagreeing politely", body: "Agree: 'That's a good point.', 'I completely agree.'. Disagree softly: 'I see your point, but…', 'I'm not sure I agree, because…'. Avoid a blunt 'No, you're wrong.'" },
              { heading: "Interrupting & clarifying", body: "'Sorry to interrupt, but…', 'Could I add something?'. Clarify: 'Just to clarify,…', 'What do you mean exactly?'" },
            ],
            keyPoints: [
              "Signal each stage: open → discuss → decide → summarise.",
              "Disagree with the idea, not the person.",
              "Soften disagreement: 'I see your point, but…'.",
              "Invite quiet colleagues: 'What do you think, …?'",
            ],
            examples: [
              { text: "I see your point, but I think we should wait.", translation: "Пікіріңізді түсінемін, бірақ күткен жөн деп ойлаймын." },
              { text: "Sorry to interrupt, but could I add something?", translation: "Кешіріңіз, бір нәрсе қосуға бола ма?" },
              { text: "Let's move on to the next item.", translation: "Келесі мәселеге көшейік." },
            ],
          },
          exercises: [
            { id: "be2e1", type: "multiple-choice", prompt: "Which phrase politely disagrees?", options: ["No, you're wrong.", "I see your point, but…", "That's stupid.", "Whatever you say."], answer: "I see your point, but…" },
            { id: "be2e2", type: "multiple-choice", prompt: "How do you politely interrupt?", options: ["Shut up a second.", "Sorry to interrupt, but…", "Stop talking.", "Hey! Hey!"], answer: "Sorry to interrupt, but…" },
            { id: "be2e3", type: "fill-blank", prompt: "Complete the phrase for opinions", sentence: "In my ___, we should invest more.", answer: "opinion" },
            { id: "be2e4", type: "multiple-choice", prompt: "Which phrase moves the meeting forward?", options: ["Let's move on to the next item.", "I'm bored.", "Can we stop now?", "This is pointless."], answer: "Let's move on to the next item." },
            { id: "be2e5", type: "word-order", prompt: "Order the words to ask for an opinion.", sentence: "What|do|you|think|about|this|plan", answer: "What do you think about this plan" },
            { id: "be2e6", type: "fill-blank", prompt: "Complete: agreeing", sentence: "That's a good ___.", answer: "point" },
            { id: "be2e7", type: "multiple-choice", prompt: "Choose a phrase to summarise decisions.", options: ["So, to sum up, we agreed to…", "Anyway…", "I forget.", "Never mind."], answer: "So, to sum up, we agreed to…" },
          ],
        },
      ],
    },
    // ═══════════ МОДУЛЬ 3 — Presentations ═══════════
    {
      id: "be-u3", number: 3, title: "Presentations", titleKk: "Презентациялар",
      description: "Structure and signposting for clear presentations", descriptionKk: "Айқын презентацияның құрылымы мен бағдары",
      icon: "BookOpen", color: "accent-purple",
      lessons: [
        {
          id: "be-l3", type: "grammar", title: "Delivering Presentations", titleKk: "Презентация жасау",
          description: "Openings, signposting and closings", descriptionKk: "Кіріспе, бағдарлау және қорытынды",
          xpReward: 50, estimatedMinutes: 15,
          theory: {
            explanation: "A strong presentation has a clear beginning, middle and end. 'Signposting' language guides the audience: it tells them where you are and what comes next, which keeps them engaged.",
            explanationKk: "Күшті презентацияның айқын басы, ортасы, соңы болады. «Бағдарлау» тілі тыңдаушыны жетелейді: қазір қайда екеніңізді және не боларын айтады.",
            sections: [
              { heading: "Opening", body: "Greet and state your topic and goal: 'Good morning, everyone. Today I'm going to talk about…', 'By the end, you'll understand…'. Preview structure: 'I've divided my talk into three parts.'" },
              { heading: "Signposting the body", body: "'Let's start with…', 'Moving on to…', 'This brings me to my next point…', 'As you can see on this slide…'. These phrases keep the audience oriented." },
              { heading: "Emphasis & data", body: "Emphasise: 'The key point here is…', 'What's important is…'. Describe trends: 'sales rose sharply', 'numbers fell steadily', 'there was a significant increase'." },
              { heading: "Closing & questions", body: "'To sum up,…', 'In conclusion,…', 'Thank you for your attention.', 'I'm happy to answer any questions.'" },
            ],
            keyPoints: [
              "Tell them what you'll say, say it, then summarise it.",
              "Use signposting so the audience never gets lost.",
              "Highlight the one key message per section.",
              "Always invite questions at the end.",
            ],
            examples: [
              { text: "Today I'm going to talk about our marketing results.", translation: "Бүгін маркетинг нәтижелері туралы айтамын." },
              { text: "This brings me to my next point.", translation: "Бұл мені келесі ойға әкеледі." },
              { text: "To sum up, our sales increased by 20%.", translation: "Қорыта айтқанда, сатылымымыз 20%-ға өсті." },
            ],
          },
          exercises: [
            { id: "be3e1", type: "multiple-choice", prompt: "Which phrase opens a presentation well?", options: ["So yeah, um…", "Today I'm going to talk about…", "I didn't prepare much.", "Can you hear me?"], answer: "Today I'm going to talk about…" },
            { id: "be3e2", type: "multiple-choice", prompt: "Which is signposting language?", options: ["Moving on to my next point…", "I'm tired.", "Where's the exit?", "That's all folks."], answer: "Moving on to my next point…" },
            { id: "be3e3", type: "fill-blank", prompt: "Complete the closing", sentence: "To ___ up, our sales increased by 20%.", answer: "sum" },
            { id: "be3e4", type: "multiple-choice", prompt: "How do you describe a big rise in sales?", options: ["Sales rose sharply.", "Sales did a thing.", "Sales, you know.", "Sales maybe."], answer: "Sales rose sharply." },
            { id: "be3e5", type: "word-order", prompt: "Order the words for an opening.", sentence: "I|have|divided|my|talk|into|three|parts", answer: "I have divided my talk into three parts" },
            { id: "be3e6", type: "fill-blank", prompt: "Complete: directing attention", sentence: "As you can ___ on this slide, profits grew.", answer: "see" },
            { id: "be3e7", type: "multiple-choice", prompt: "Which invites questions professionally?", options: ["Any questions? No? Bye.", "I'm happy to answer any questions.", "Don't ask me anything.", "We're out of time, leave."], answer: "I'm happy to answer any questions." },
          ],
        },
      ],
    },
    // ═══════════ МОДУЛЬ 4 — Negotiations ═══════════
    {
      id: "be-u4", number: 4, title: "Negotiations", titleKk: "Келіссөздер",
      description: "Persuasive, flexible language for reaching agreement", descriptionKk: "Келісімге жету үшін икемді, сендіретін тіл",
      icon: "Hand", color: "accent-gold",
      lessons: [
        {
          id: "be-l4", type: "grammar", title: "Negotiation Language", titleKk: "Келіссөз тілі",
          description: "Proposing, bargaining and reaching agreement", descriptionKk: "Ұсыныс, сауда және келісімге келу",
          xpReward: 60, estimatedMinutes: 18,
          theory: {
            explanation: "Successful negotiators are polite but firm. They make conditional offers, show flexibility, and aim for a win–win outcome. Conditional language ('If you…, we could…') is essential.",
            explanationKk: "Табысты келіссөзші сыпайы, бірақ табанды. Олар шартты ұсыныс жасайды, икемділік көрсетеді, екі жаққа тиімді нәтижеге ұмтылады. Шартты тіл («If you…, we could…») аса маңызды.",
            sections: [
              { heading: "Making proposals", body: "'We'd like to propose…', 'How about…?', 'Would you consider…?'. Keep the first offer realistic but with room to move." },
              { heading: "Conditional bargaining", body: "The core of negotiation: 'If you order 500 units, we can offer a 10% discount.', 'We could deliver earlier, provided that you pay in advance.' Nothing is given for free — always link a concession to a condition." },
              { heading: "Showing flexibility & limits", body: "Flexible: 'We're willing to consider…', 'There may be some room for negotiation.'. Limits: 'I'm afraid that's not possible.', 'That's our final offer.'" },
              { heading: "Reaching agreement", body: "'That sounds reasonable.', 'I think we have a deal.', 'Let's put that in writing.' Confirm terms clearly to avoid misunderstandings." },
            ],
            keyPoints: [
              "Link every concession to a condition: 'If…, then…'.",
              "Aim for win–win, not win–lose.",
              "Stay polite even when saying no.",
              "Confirm the final agreement in writing.",
            ],
            examples: [
              { text: "If you order 500 units, we can offer a discount.", translation: "500 дана тапсырсаңыз, жеңілдік бере аламыз." },
              { text: "I'm afraid that's not possible.", translation: "Өкінішке қарай, бұл мүмкін емес." },
              { text: "I think we have a deal.", translation: "Меніңше, келістік." },
            ],
          },
          exercises: [
            { id: "be4e1", type: "multiple-choice", prompt: "Which is a conditional offer?", options: ["Give me a discount.", "If you order 500 units, we can offer a discount.", "No discounts ever.", "Maybe, who knows."], answer: "If you order 500 units, we can offer a discount." },
            { id: "be4e2", type: "multiple-choice", prompt: "How do you politely refuse?", options: ["No way.", "I'm afraid that's not possible.", "Are you crazy?", "Forget it."], answer: "I'm afraid that's not possible." },
            { id: "be4e3", type: "fill-blank", prompt: "Complete the proposal", sentence: "We'd like to ___ a new payment plan.", answer: "propose" },
            { id: "be4e4", type: "word-order", prompt: "Order the conditional sentence.", sentence: "If|you|pay|in|advance|we|can|deliver|earlier", answer: "If you pay in advance we can deliver earlier" },
            { id: "be4e5", type: "multiple-choice", prompt: "Which shows flexibility?", options: ["That's final, end of story.", "We're willing to consider other options.", "Take it or leave it.", "I don't care."], answer: "We're willing to consider other options." },
            { id: "be4e6", type: "fill-blank", prompt: "Complete: reaching a deal", sentence: "I think we have a ___.", answer: "deal" },
            { id: "be4e7", type: "multiple-choice", prompt: "What's the best way to finalise terms?", options: ["Let's put that in writing.", "Trust me, no need.", "We'll remember somehow.", "Whatever works."], answer: "Let's put that in writing." },
          ],
        },
      ],
    },
  ],
};
