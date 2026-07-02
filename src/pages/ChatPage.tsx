// filepath: src/pages/ChatPage.tsx
// ImmersionChat — AI тәлімгермен сөйлесу (Gemini).
// Кәсіби чат: бірнеше әңгіме (жаңа чат + тарих), ұзақ мерзімді жады,
// Markdown-форматталған жауаптар, суретті режим ауыстырғыш.

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/contexts/LangContext";
import { useUserPrefs } from "@/store/userPrefs";
import { sendChatMessage, updateStudentMemory, isGeminiConfigured, type ChatMessage, type ChatMode } from "@/lib/gemini";
import {
  loadChats, saveChats, loadActiveChatId, saveActiveChatId,
  titleFromMessages, newChatId, loadMemory, saveMemory,
  type ChatSession, type ChatMsg,
} from "@/lib/chatStore";
import { createRecognition, isSpeechRecognitionSupported, type RecognitionController } from "@/lib/ieltsSpeaking";
import { speak, stopSpeaking } from "@/lib/speech";
import AnimatedBot, { type BotState } from "@/components/chat/AnimatedBot";
import Markdown from "@/components/chat/Markdown";
import { knowledgeStats } from "@/lib/knowledge";
import {
  Send, Key, ExternalLink, AlertCircle, RotateCcw,
  History, MessageSquarePlus, Trash2, Brain, X,
  Mic, Volume2, VolumeX, SlidersHorizontal, Check,
} from "lucide-react";

// Markdown белгілерін алып тастау (дауыстап оқу үшін таза мәтін)
function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*|\*|`|_{1,2}/g, "")
    .replace(/^#+\s*/gm, "")
    .replace(/^\s*[-•]\s*/gm, "");
}

type DisplayMessage = ChatMsg;

function now() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// ── Режим таңдау терезесі — үлкен, анық суреттермен ──
function ModePickerModal({ current, onSelect, onClose }: {
  current: ChatMode;
  onSelect: (m: ChatMode) => void;
  onClose: () => void;
}) {
  const { t } = useLang();
  const modes: { id: ChatMode; emoji: string; accent: string; title: string; desc: string }[] = [
    { id: "immersion", emoji: "🌍", accent: "accent-blue", title: t("chat.modeImmersion"), desc: t("chat.modeImmersionLong") },
    { id: "teacher", emoji: "👨‍🏫", accent: "accent-green", title: t("chat.modeTeacher"), desc: t("chat.modeTeacherLong") },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="card w-full max-w-2xl max-h-[88vh] overflow-y-auto p-5 sm:p-7"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-xl font-display font-bold">{t("chat.chooseMode")}</h3>
          <button onClick={onClose} className="text-text-secondary hover:text-text-primary p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {modes.map((m) => {
            const active = current === m.id;
            return (
              <button
                key={m.id}
                onClick={() => { onSelect(m.id); onClose(); }}
                className={`relative rounded-card border-2 p-5 text-center transition-all hover:shadow-card-hover ${
                  active ? `border-${m.accent} bg-${m.accent}/5` : "border-border hover:border-border"
                }`}
              >
                {/* Таңдалған белгі */}
                {active && (
                  <span className={`absolute top-3 right-3 w-7 h-7 rounded-full bg-${m.accent} text-white flex items-center justify-center`}>
                    <Check className="w-4 h-4" />
                  </span>
                )}
                {/* Үлкен, анық сурет */}
                <img
                  src={`/modes/${m.id}.png`}
                  alt=""
                  className="w-36 h-36 sm:w-44 sm:h-44 rounded-2xl object-cover mx-auto mb-4 shadow-card"
                  onError={(e) => {
                    (e.target as HTMLImageElement).outerHTML = `<div class="w-36 h-36 sm:w-44 sm:h-44 rounded-2xl mx-auto mb-4 flex items-center justify-center text-6xl bg-surface-2">${m.emoji}</div>`;
                  }}
                />
                <h4 className={`font-display font-bold text-lg mb-1.5 ${active ? `text-${m.accent}` : ""}`}>{m.title}</h4>
                <p className="text-sm text-text-secondary leading-relaxed">{m.desc}</p>
              </button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}

export default function ChatPage() {
  const { t, lang } = useLang();
  const { prefs } = useUserPrefs();
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [botState, setBotState] = useState<BotState>("idle");
  const [lastFailed, setLastFailed] = useState<string | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [mode, setMode] = useState<ChatMode>(() => {
    try { return localStorage.getItem("linguafast_chat_mode") === "teacher" ? "teacher" : "immersion"; } catch { return "immersion"; }
  });
  const [modeModalOpen, setModeModalOpen] = useState(false);
  // Дауыс: енгізу (микрофон) + жауап (TTS)
  const [micOn, setMicOn] = useState(false);
  const [voiceReply, setVoiceReply] = useState(() => {
    try { return localStorage.getItem("linguafast_chat_voice") === "1"; } catch { return false; }
  });
  const recognitionRef = useRef<RecognitionController | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const memoryRef = useRef<string>("");

  const learningLang = prefs.learningLang;

  const welcomeMsg = useCallback((): DisplayMessage => ({
    id: "welcome",
    role: "model",
    text: learningLang === "zh" ? t("chat.welcomeZh") : t("chat.welcome"),
    time: now(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [learningLang, lang]);

  // Бастапқы жүктеу: чат тізімі + белсенді чат + жады
  useEffect(() => {
    const list = loadChats(learningLang);
    setChats(list);
    memoryRef.current = loadMemory(learningLang);

    const savedActive = loadActiveChatId(learningLang);
    const active = list.find((c) => c.id === savedActive) || list[0];
    if (active) {
      setActiveId(active.id);
      setMode(active.mode);
      setMessages(active.messages.length > 0 ? active.messages : [welcomeMsg()]);
    } else {
      setActiveId(newChatId());
      setMessages([welcomeMsg()]);
    }
    setLastFailed(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [learningLang]);

  // Хабарламалар өзгергенде белсенді чатты сақтау
  // (тек қолданушы жазған чат сақталады — бос «welcome» чаттар тізімді ластамайды)
  useEffect(() => {
    if (!activeId || !messages.some((m) => m.role === "user")) return;
    setChats((prev) => {
      const existing = prev.find((c) => c.id === activeId);
      const session: ChatSession = {
        id: activeId,
        title: existing?.title || titleFromMessages(messages) || t("chat.untitled"),
        mode,
        messages,
        createdAt: existing?.createdAt || Date.now(),
        updatedAt: Date.now(),
      };
      const next = [session, ...prev.filter((c) => c.id !== activeId)];
      saveChats(learningLang, next);
      return next;
    });
    saveActiveChatId(learningLang, activeId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, activeId, mode]);

  // Жаңа хабарламаға скролл
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const changeMode = (m: ChatMode) => {
    setMode(m);
    try { localStorage.setItem("linguafast_chat_mode", m); } catch { /* */ }
  };

  // Дауысты жауапты қосу/өшіру
  const toggleVoiceReply = () => {
    const next = !voiceReply;
    setVoiceReply(next);
    if (!next) stopSpeaking();
    try { localStorage.setItem("linguafast_chat_voice", next ? "1" : "0"); } catch { /* */ }
  };

  // Микрофонмен жазу: сөйлеген мәтін енгізу өрісіне түседі
  const toggleMic = () => {
    if (micOn) {
      recognitionRef.current?.stop();
      setMicOn(false);
      return;
    }
    stopSpeaking();
    const recLang = learningLang === "zh" ? "zh-CN" : "en-US";
    const rec = createRecognition(
      (text) => setInput(text),
      () => setMicOn(false),
      () => setMicOn(false),
      recLang
    );
    if (rec) {
      recognitionRef.current = rec;
      setInput("");
      rec.start();
      setMicOn(true);
    }
  };

  // Беттен шыққанда микрофон мен дауысты тоқтату
  useEffect(() => () => { recognitionRef.current?.stop(); stopSpeaking(); }, []);

  // ── Жаңа чат ──
  const startNewChat = () => {
    setHistoryOpen(false);
    if (!messages.some((m) => m.role === "user")) return; // қазіргісі бос — жаңасы керек емес
    const id = newChatId();
    setActiveId(id);
    saveActiveChatId(learningLang, id);
    setMessages([welcomeMsg()]);
    setLastFailed(null);
    setBotState("idle");
  };

  // ── Чатқа ауысу ──
  const openChat = (c: ChatSession) => {
    setHistoryOpen(false);
    if (c.id === activeId) return;
    setActiveId(c.id);
    saveActiveChatId(learningLang, c.id);
    setMode(c.mode);
    setMessages(c.messages);
    setLastFailed(null);
  };

  // ── Чатты өшіру ──
  const deleteChat = (id: string) => {
    if (!window.confirm(t("chat.deleteConfirm"))) return;
    setChats((prev) => {
      const next = prev.filter((c) => c.id !== id);
      saveChats(learningLang, next);
      return next;
    });
    if (id === activeId) {
      const newId = newChatId();
      setActiveId(newId);
      saveActiveChatId(learningLang, newId);
      setMessages([welcomeMsg()]);
    }
  };

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setLastFailed(null);
    const userMsg: DisplayMessage = { id: "u" + Date.now(), role: "user", text: trimmed, time: now() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    setBotState("thinking");

    const history: ChatMessage[] = messages
      .filter((m) => m.id !== "welcome" && !m.error)
      .map((m) => ({ role: m.role, text: m.text }));

    const learnLangName = learningLang === "zh" ? "Chinese" : "English";
    const t0 = Date.now();
    const res = await sendChatMessage(history, trimmed, learnLangName, lang, prefs.level, mode, memoryRef.current);
    // Кемінде 1,5 секунд «жазып жатыр» анимациясы көрінсін
    const elapsed = Date.now() - t0;
    if (elapsed < 1500) await new Promise((r) => setTimeout(r, 1500 - elapsed));
    setLoading(false);

    if (res.ok) {
      setMessages((prev) => [...prev, { id: "m" + Date.now(), role: "model", text: res.text, time: now() }]);
      setBotState("happy");
      setTimeout(() => setBotState("idle"), 2500);

      // Дауысты жауап қосулы болса — жауапты дауыстап оқу
      if (voiceReply) {
        speak(stripMarkdown(res.text), learningLang === "zh" ? "zh" : "en");
      }

      // Жадыны фонда жаңарту — әр 6 қолданушы хабарламасы сайын
      const userCount = history.filter((m) => m.role === "user").length + 1;
      if (userCount % 6 === 0) {
        const fullHistory = [...history, { role: "user" as const, text: trimmed }, { role: "model" as const, text: res.text }];
        updateStudentMemory(fullHistory, memoryRef.current, learnLangName).then((updated) => {
          if (updated) {
            memoryRef.current = updated;
            saveMemory(learningLang, updated);
          }
        });
      }
    } else {
      const errMsg =
        res.error === "quota" ? t("chat.errorQuota") :
        res.error === "bad-key" ? t("chat.errorKey") :
        t("chat.errorGeneral");
      setMessages((prev) => [...prev, { id: "e" + Date.now(), role: "model", text: errMsg, time: now(), error: true }]);
      setLastFailed(trimmed);
      setBotState("idle");
    }
  };

  // ── Кілт қосылмаған күй ──
  if (!isGeminiConfigured()) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 pb-3 border-b border-border">
          <AnimatedBot state="idle" size={76} />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display font-bold text-lg">{t("chat.title")}</h1>
              <span className="text-[10px] font-bold bg-accent-purple/20 text-accent-purple px-1.5 py-0.5 rounded">BETA</span>
            </div>
            <span className="text-xs text-text-secondary">{t("chat.alwaysHere")}</span>
          </div>
        </div>
        <div className="card p-8 mt-5 text-center">
          <div className="w-16 h-16 rounded-card bg-accent-gold/15 flex items-center justify-center mx-auto mb-4">
            <Key className="w-8 h-8 text-accent-gold" />
          </div>
          <h2 className="text-xl font-display font-bold mb-2">{t("chat.noKey")}</h2>
          <p className="text-text-secondary mb-6 max-w-md mx-auto">{t("chat.noKeyDesc")}</p>
          <div className="text-left max-w-sm mx-auto space-y-3 mb-6">
            {[t("chat.noKeyStep1"), t("chat.noKeyStep2"), t("chat.noKeyStep3")].map((step, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-accent-blue/15 text-accent-blue flex items-center justify-center text-sm font-bold shrink-0">{i + 1}</div>
                <span className="text-sm text-text-secondary">{step}</span>
              </div>
            ))}
          </div>
          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex items-center gap-2"
          >
            {t("chat.noKeyStep2")} <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    );
  }

  const savedChats = chats.filter((c) => c.messages.some((m) => m.role === "user"));

  // ── Нақты чат ──
  return (
    <div className="max-w-3xl mx-auto flex flex-col h-[calc(100vh-8rem)] relative">
      {/* Анимациялы бот шапкасы */}
      <div className="flex items-center justify-between gap-3 shrink-0 pb-3 border-b border-border">
        <div className="flex items-center gap-4 min-w-0">
          <AnimatedBot state={botState} size={88} />
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-display font-bold text-lg">{t("chat.title")}</h1>
              <span className="text-[10px] font-bold bg-accent-purple/20 text-accent-purple px-1.5 py-0.5 rounded">BETA</span>
              <span className="text-[10px] font-medium bg-accent-green/15 text-accent-green px-2 py-0.5 rounded-full hidden sm:inline">
                {knowledgeStats.total}+ {t("chat.methods")}
              </span>
              {memoryRef.current && (
                <span className="text-[10px] font-medium bg-accent-purple/10 text-accent-purple px-2 py-0.5 rounded-full hidden md:inline-flex items-center gap-1" title={t("chat.memoryOn")}>
                  <Brain className="w-3 h-3" /> {t("chat.memoryOn")}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
              <span className="text-xs text-text-secondary">
                {botState === "thinking" ? t("chat.thinking") : t("chat.alwaysHere")}
              </span>
            </div>
          </div>
        </div>
        {/* Жаңа чат + тарих */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={startNewChat}
            className="flex items-center gap-1.5 text-xs font-medium text-text-secondary hover:text-accent-blue transition-colors px-2.5 py-2 rounded-btn hover:bg-surface-2"
            title={t("chat.newChat")}
          >
            <MessageSquarePlus className="w-5 h-5" />
            <span className="hidden md:inline">{t("chat.newChat")}</span>
          </button>
          <button
            onClick={() => setHistoryOpen((o) => !o)}
            className={`flex items-center gap-1.5 text-xs font-medium transition-colors px-2.5 py-2 rounded-btn hover:bg-surface-2 ${historyOpen ? "text-accent-blue bg-surface-2" : "text-text-secondary hover:text-text-primary"}`}
            title={t("chat.history")}
          >
            <History className="w-5 h-5" />
            <span className="hidden md:inline">{t("chat.history")}</span>
            {savedChats.length > 0 && (
              <span className="text-[10px] bg-accent-blue/15 text-accent-blue rounded-full px-1.5 font-bold">{savedChats.length}</span>
            )}
          </button>
        </div>
      </div>

      {/* Чат тарихы панелі */}
      {historyOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setHistoryOpen(false)} />
          <div className="absolute right-0 top-16 z-20 w-80 max-w-[90vw] card shadow-card-hover p-2 max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between px-2 py-1.5">
              <span className="text-xs font-semibold text-text-secondary">{t("chat.history")}</span>
              <button onClick={() => setHistoryOpen(false)} className="text-text-muted hover:text-text-primary p-1">
                <X className="w-4 h-4" />
              </button>
            </div>
            {savedChats.length === 0 ? (
              <p className="text-xs text-text-muted px-2 py-4 text-center">{t("chat.untitled")}…</p>
            ) : (
              savedChats.map((c) => (
                <div
                  key={c.id}
                  className={`group flex items-center gap-2 rounded-btn px-2 py-2 cursor-pointer transition-colors ${c.id === activeId ? "bg-accent-blue/10" : "hover:bg-surface-2"}`}
                  onClick={() => openChat(c)}
                >
                  <span className="text-base shrink-0">{c.mode === "teacher" ? "👨‍🏫" : "🌍"}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm truncate ${c.id === activeId ? "font-semibold text-accent-blue" : "text-text-primary"}`}>{c.title}</p>
                    <p className="text-[10px] text-text-muted">
                      {new Date(c.updatedAt).toLocaleDateString(lang === "kk" ? "kk-KZ" : "en-US", { day: "numeric", month: "short" })}
                      {" · "}{c.messages.filter((m) => m.role === "user").length} {lang === "kk" ? "хабарлама" : "messages"}
                    </p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteChat(c.id); }}
                    className="opacity-0 group-hover:opacity-100 text-text-muted hover:text-accent-red transition-all p-1 shrink-0"
                    title={t("chat.deleteChat")}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {/* Режим + дауыс баптаулары */}
      <div className="flex items-center gap-2 py-2.5 shrink-0">
        {/* Режим батырмасы → үлкен таңдау терезесі */}
        <button
          onClick={() => setModeModalOpen(true)}
          className="flex items-center gap-2 px-3 py-2 rounded-btn border border-border bg-surface hover:bg-surface-2 transition-all"
        >
          <SlidersHorizontal className="w-4 h-4 text-accent-purple" />
          <span className="text-xs font-medium">
            {lang === "kk" ? "Режим:" : "Mode:"}{" "}
            <span className={mode === "immersion" ? "text-accent-blue font-semibold" : "text-accent-green font-semibold"}>
              {mode === "immersion" ? t("chat.modeImmersion") : t("chat.modeTeacher")}
            </span>
          </span>
        </button>

        {/* Дауысты жауап қосқышы */}
        <button
          onClick={toggleVoiceReply}
          title={t("chat.voiceReply")}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-btn border transition-all text-xs font-medium ${
            voiceReply
              ? "border-accent-gold/50 bg-accent-gold/10 text-accent-gold"
              : "border-border bg-surface text-text-secondary hover:bg-surface-2"
          }`}
        >
          {voiceReply ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          <span className="hidden sm:inline">{t("chat.voiceReply")}</span>
        </button>
      </div>

      {/* Режим таңдау терезесі */}
      <AnimatePresence>
        {modeModalOpen && (
          <ModePickerModal current={mode} onSelect={changeMode} onClose={() => setModeModalOpen(false)} />
        )}
      </AnimatePresence>

      {/* Хабарламалар */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto py-5 space-y-4">
        {messages.map((m) => (
          <MessageBubble key={m.id} message={m} speakLang={learningLang === "zh" ? "zh" : "en"} onRetry={m.error && lastFailed ? () => send(lastFailed) : undefined} />
        ))}
        {loading && (
          <div className="flex items-start gap-3">
            <div className="shrink-0"><AnimatedBot state="thinking" size={52} /></div>
            <div className="card bg-surface px-4 py-3 border-border self-center">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 rounded-full bg-accent-blue animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 rounded-full bg-accent-blue animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 rounded-full bg-accent-blue animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}

        {/* Ұсыныстар (тек басында) */}
        {messages.length === 1 && !loading && (
          <div className="space-y-2 pt-2">
            <p className="text-xs text-text-muted">{t("chat.suggestionsTitle")}</p>
            <div className="flex flex-wrap gap-2">
              {[t("chat.sug1"), t("chat.sug2"), t("chat.sug3")].map((sug, i) => (
                <button
                  key={i}
                  onClick={() => send(sug)}
                  className="text-sm px-3 py-2 rounded-btn bg-surface-2 border border-border text-text-secondary hover:text-text-primary hover:border-accent-blue/40 transition-all"
                >
                  {sug}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Енгізу өрісі */}
      <div className="shrink-0 pt-3">
        <div className={`card p-2 flex items-center gap-2 transition-all ${micOn ? "border-accent-red/50" : "border-border focus-within:border-accent-blue/40"}`}>
          {/* Дауыспен жазу */}
          {isSpeechRecognitionSupported() && (
            <button
              onClick={toggleMic}
              title={t("chat.voiceInput")}
              className={`relative w-10 h-10 rounded-btn flex items-center justify-center shrink-0 transition-all ${
                micOn ? "bg-accent-red text-white" : "bg-surface-2 text-text-secondary hover:text-accent-blue"
              }`}
            >
              {micOn && <span className="absolute inset-0 rounded-btn bg-accent-red/40 animate-ping" />}
              <Mic className="w-4 h-4 relative" />
            </button>
          )}
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send(input)}
            placeholder={micOn ? t("chat.listening") : t("chat.placeholder")}
            className="flex-1 bg-transparent px-3 py-2 text-text-primary placeholder:text-text-muted focus:outline-none min-w-0"
          />
          <button
            onClick={() => { if (micOn) toggleMic(); send(input); }}
            disabled={!input.trim() || loading}
            className="w-10 h-10 rounded-btn bg-accent-blue text-white flex items-center justify-center shrink-0 disabled:opacity-40 hover:brightness-110 transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Хабарлама көпіршігі ──
function MessageBubble({ message, speakLang = "en", onRetry }: { message: DisplayMessage; speakLang?: "en" | "zh"; onRetry?: () => void }) {
  const { t } = useLang();
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%]">
          <div className="bg-accent-blue text-white rounded-card rounded-tr-sm px-4 py-2.5">
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
          </div>
          <p className="text-[10px] text-text-muted mt-1 text-right">{message.time}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3">
      <div className="shrink-0 mt-1"><AnimatedBot state="idle" size={48} /></div>
      <div className="max-w-[80%]">
        <div className={`card px-4 py-2.5 ${message.error ? "border-accent-red/40 bg-accent-red/5" : "bg-surface border-border"}`}>
          {message.error ? (
            <p className="text-sm leading-relaxed">
              <AlertCircle className="w-4 h-4 text-accent-red inline mr-1.5 -mt-0.5" />
              {message.text}
            </p>
          ) : (
            <Markdown text={message.text} />
          )}
        </div>
        <div className="flex items-center gap-2 mt-1">
          <p className="text-[10px] text-text-muted">{message.time}</p>
          {/* Жауапты дауыстап оқу */}
          {!message.error && (
            <button
              onClick={() => speak(stripMarkdown(message.text), speakLang)}
              title={t("chat.speakReply")}
              className="text-text-muted hover:text-accent-blue transition-colors"
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>
          )}
          {message.error && onRetry && (
            <button
              onClick={onRetry}
              className="text-[11px] text-accent-blue hover:underline flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> {t("chat.retry")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
