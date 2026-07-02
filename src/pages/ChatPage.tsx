// filepath: src/pages/ChatPage.tsx
// ImmersionChat — AI тәлімгермен сөйлесу (Gemini).
// Кәсіби чат: бірнеше әңгіме (жаңа чат + тарих), ұзақ мерзімді жады,
// Markdown-форматталған жауаптар, суретті режим ауыстырғыш.

import { useState, useRef, useEffect, useCallback } from "react";
import { useLang } from "@/contexts/LangContext";
import { useUserPrefs } from "@/store/userPrefs";
import { sendChatMessage, updateStudentMemory, isGeminiConfigured, type ChatMessage, type ChatMode } from "@/lib/gemini";
import {
  loadChats, saveChats, loadActiveChatId, saveActiveChatId,
  titleFromMessages, newChatId, loadMemory, saveMemory,
  type ChatSession, type ChatMsg,
} from "@/lib/chatStore";
import AnimatedBot, { type BotState } from "@/components/chat/AnimatedBot";
import Markdown from "@/components/chat/Markdown";
import { knowledgeStats } from "@/lib/knowledge";
import {
  Send, Key, ExternalLink, AlertCircle, RotateCcw,
  History, MessageSquarePlus, Trash2, Brain, X,
} from "lucide-react";

type DisplayMessage = ChatMsg;

function now() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// ── Режим батырмасы: арнайы сурет (жоқ болса — эмодзи қоры) ──
function ModeButton({ mode, active, onClick }: { mode: ChatMode; active: boolean; onClick: () => void }) {
  const { t } = useLang();
  const [imgError, setImgError] = useState(false);
  const isImmersion = mode === "immersion";
  const accent = isImmersion ? "accent-blue" : "accent-green";

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2.5 px-3 py-1.5 rounded-btn border transition-all text-left ${
        active
          ? `border-${accent}/50 bg-${accent}/10 shadow-soft`
          : "border-border bg-surface hover:bg-surface-2"
      }`}
    >
      {/* Режим суреті: public/modes/{mode}.png (жоқ болса — эмодзи) */}
      {imgError ? (
        <span className={`w-9 h-9 rounded-full bg-${accent}/15 flex items-center justify-center text-lg shrink-0`}>
          {isImmersion ? "🌍" : "👨‍🏫"}
        </span>
      ) : (
        <img
          src={`/modes/${mode}.png`}
          alt=""
          onError={() => setImgError(true)}
          className={`w-9 h-9 rounded-full object-cover shrink-0 ${active ? `ring-2 ring-${accent}` : "opacity-80"}`}
        />
      )}
      <span className="hidden sm:block">
        <span className={`block text-xs font-semibold ${active ? `text-${accent}` : "text-text-primary"}`}>
          {isImmersion ? t("chat.modeImmersion") : t("chat.modeTeacher")}
        </span>
        <span className="block text-[10px] text-text-muted leading-tight">
          {isImmersion ? t("chat.modeImmersionDesc") : t("chat.modeTeacherDesc")}
        </span>
      </span>
    </button>
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

      {/* Режим ауыстырғышы: Иммерсия / Мұғалім (суретпен) */}
      <div className="flex items-center gap-2 py-2.5 shrink-0">
        <ModeButton mode="immersion" active={mode === "immersion"} onClick={() => changeMode("immersion")} />
        <ModeButton mode="teacher" active={mode === "teacher"} onClick={() => changeMode("teacher")} />
      </div>

      {/* Хабарламалар */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto py-5 space-y-4">
        {messages.map((m) => (
          <MessageBubble key={m.id} message={m} onRetry={m.error && lastFailed ? () => send(lastFailed) : undefined} />
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
        <div className="card p-2 flex items-center gap-2 border-border focus-within:border-accent-blue/40 transition-all">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send(input)}
            placeholder={t("chat.placeholder")}
            className="flex-1 bg-transparent px-3 py-2 text-text-primary placeholder:text-text-muted focus:outline-none"
          />
          <button
            onClick={() => send(input)}
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
function MessageBubble({ message, onRetry }: { message: DisplayMessage; onRetry?: () => void }) {
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
