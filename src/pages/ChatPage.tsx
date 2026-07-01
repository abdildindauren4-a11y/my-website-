// filepath: src/pages/ChatPage.tsx
// ImmersionChat — AI тәлімгермен сөйлесу (Gemini).
// Қолданушы ағылшынша жазады, AI қателерді түзетіп, түсіндіреді.
// Кілт жоқ болса — қосу нұсқаулығын көрсетеді.

import { useState, useRef, useEffect } from "react";
import { useLang } from "@/contexts/LangContext";
import { useUserPrefs } from "@/store/userPrefs";
import { sendChatMessage, isGeminiConfigured, type ChatMessage, type ChatMode } from "@/lib/gemini";
import AnimatedBot, { type BotState } from "@/components/chat/AnimatedBot";
import { knowledgeStats } from "@/lib/knowledge";
import { Send, Key, ExternalLink, AlertCircle, Trash2, RotateCcw } from "lucide-react";

interface DisplayMessage extends ChatMessage {
  id: string;
  time: string;
  error?: boolean;
}

export default function ChatPage() {
  const { t, lang } = useLang();
  const { prefs } = useUserPrefs();
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [botState, setBotState] = useState<BotState>("idle");
  const [lastFailed, setLastFailed] = useState<string | null>(null); // қате болған хабарлама (retry үшін)
  const [mode, setMode] = useState<ChatMode>(() => {
    try { return localStorage.getItem("linguafast_chat_mode") === "teacher" ? "teacher" : "immersion"; } catch { return "immersion"; }
  });
  const scrollRef = useRef<HTMLDivElement>(null);

  const changeMode = (m: ChatMode) => {
    setMode(m);
    try { localStorage.setItem("linguafast_chat_mode", m); } catch { /* */ }
  };

  // Чат тарихын сақтау кілті (тілге қарай бөлек)
  const storageKey = `linguafast_chat_${prefs.learningLang}`;

  // Бастапқы: сақталған тарихты жүктеу немесе сәлемдесу
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved) as DisplayMessage[];
        if (parsed.length > 0) {
          setMessages(parsed);
          return;
        }
      }
    } catch { /* ignore */ }
    // Сақталған тарих жоқ — сәлемдесу (тілге сай)
    const welcomeText = prefs.learningLang === "zh" ? t("chat.welcomeZh") : t("chat.welcome");
    setMessages([{ id: "welcome", role: "model", text: welcomeText, time: now() }]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  // Хабарлама өзгергенде localStorage-қа сақтау
  useEffect(() => {
    if (messages.length > 0) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(messages));
      } catch { /* ignore */ }
    }
  }, [messages, storageKey]);

  // Жаңа хабарламаға скролл
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  function now() {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  // Әңгімені тазалау
  const clearChat = () => {
    if (!window.confirm(t("chat.clearConfirm"))) return;
    try { localStorage.removeItem(storageKey); } catch { /* ignore */ }
    const welcomeText = prefs.learningLang === "zh" ? t("chat.welcomeZh") : t("chat.welcome");
    setMessages([{ id: "welcome", role: "model", text: welcomeText, time: now() }]);
    setLastFailed(null);
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

    const learnLangName = prefs.learningLang === "zh" ? "Chinese" : "English";
    const t0 = Date.now();
    const res = await sendChatMessage(history, trimmed, learnLangName, lang, prefs.level, mode);
    // Кемінде 1,5 секунд «жазып жатыр» анимациясы көрінсін
    const elapsed = Date.now() - t0;
    if (elapsed < 1500) await new Promise((r) => setTimeout(r, 1500 - elapsed));
    setLoading(false);

    if (res.ok) {
      setMessages((prev) => [...prev, { id: "m" + Date.now(), role: "model", text: res.text, time: now() }]);
      setBotState("happy");
      setTimeout(() => setBotState("idle"), 2500);
    } else {
      const errMsg =
        res.error === "quota" ? t("chat.errorQuota") :
        res.error === "bad-key" ? t("chat.errorKey") :
        t("chat.errorGeneral");
      setMessages((prev) => [...prev, { id: "e" + Date.now(), role: "model", text: errMsg, time: now(), error: true }]);
      setLastFailed(trimmed); // қайта жіберу үшін сақтау
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
          {/* Қадамдар */}
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

  // ── Нақты чат ──
  return (
    <div className="max-w-3xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
      {/* Анимациялы бот шапкасы */}
      <div className="flex items-center justify-between gap-4 shrink-0 pb-3 border-b border-border">
        <div className="flex items-center gap-4">
          <AnimatedBot state={botState} size={88} />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display font-bold text-lg">{t("chat.title")}</h1>
              <span className="text-[10px] font-bold bg-accent-purple/20 text-accent-purple px-1.5 py-0.5 rounded">BETA</span>
              <span className="text-[10px] font-medium bg-accent-green/15 text-accent-green px-2 py-0.5 rounded-full hidden sm:inline">
                {knowledgeStats.total}+ {t("chat.methods")}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
              <span className="text-xs text-text-secondary">
                {botState === "thinking" ? t("chat.thinking") : t("chat.alwaysHere")}
              </span>
            </div>
          </div>
        </div>
        {/* Тазалау батырмасы (хабарлама бар болса) */}
        {messages.length > 1 && (
          <button
            onClick={clearChat}
            className="text-text-muted hover:text-accent-red transition-colors p-2 rounded-btn hover:bg-surface-2 shrink-0"
            title={t("chat.clear")}
          >
            <Trash2 className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Режим ауыстырғышы: Иммерсия / Мұғалім */}
      <div className="flex items-center gap-1.5 py-2.5 shrink-0">
        <span className="text-xs text-text-muted mr-1">{lang === "kk" ? "Режим:" : "Mode:"}</span>
        <div className="flex bg-surface-2 rounded-btn p-0.5 border border-border">
          <button
            onClick={() => changeMode("immersion")}
            className={`px-3 py-1 rounded text-xs font-medium transition-all ${mode === "immersion" ? "bg-accent-blue text-white shadow-soft" : "text-text-secondary hover:text-text-primary"}`}
          >
            🌍 {lang === "kk" ? "Иммерсия" : "Immersion"}
          </button>
          <button
            onClick={() => changeMode("teacher")}
            className={`px-3 py-1 rounded text-xs font-medium transition-all ${mode === "teacher" ? "bg-accent-green text-white shadow-soft" : "text-text-secondary hover:text-text-primary"}`}
          >
            👨‍🏫 {lang === "kk" ? "Мұғалім" : "Teacher"}
          </button>
        </div>
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
          {message.error && <AlertCircle className="w-4 h-4 text-accent-red inline mr-1.5 -mt-0.5" />}
          <p className="text-sm leading-relaxed whitespace-pre-wrap inline">{message.text}</p>
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
