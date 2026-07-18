// filepath: src/lib/chatStore.ts
// Чат сессиялары — бірнеше әңгімені сақтау (басқа ЖИ-лердегідей).
// Әр тілге (en/zh) бөлек тізім. localStorage-та сақталады.

import type { ChatMode } from "./gemini";

export interface ChatMsg {
  id: string;
  role: "user" | "model";
  text: string;
  time: string;
  error?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;          // алғашқы хабарламадан автоматты қойылады
  mode: ChatMode;
  messages: ChatMsg[];
  createdAt: number;
  updatedAt: number;
}

const listKey = (lang: string) => `linguafast_chats_${lang}`;
const activeKey = (lang: string) => `linguafast_chat_active_${lang}`;
const LEGACY_KEY = (lang: string) => `linguafast_chat_${lang}`;
const MAX_CHATS = 30; // ескілері автоматты өшеді

export function newChatId(): string {
  return "c" + Date.now() + Math.random().toString(36).slice(2, 6);
}

export function loadChats(lang: string): ChatSession[] {
  try {
    const raw = localStorage.getItem(listKey(lang));
    if (raw) {
      const parsed = JSON.parse(raw) as ChatSession[];
      if (Array.isArray(parsed)) return parsed;
    }
  } catch { /* ignore */ }

  // Ескі бір-чатты форматтан көшіру (бір рет)
  try {
    const legacy = localStorage.getItem(LEGACY_KEY(lang));
    if (legacy) {
      const messages = JSON.parse(legacy) as ChatMsg[];
      localStorage.removeItem(LEGACY_KEY(lang));
      if (Array.isArray(messages) && messages.some((m) => m.role === "user")) {
        const migrated: ChatSession = {
          id: newChatId(),
          title: titleFromMessages(messages),
          mode: "immersion",
          messages,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        saveChats(lang, [migrated]);
        return [migrated];
      }
    }
  } catch { /* ignore */ }

  return [];
}

export function saveChats(lang: string, chats: ChatSession[]): void {
  try {
    // Жаңасы жоғарыда, саны шектеулі
    const sorted = [...chats].sort((a, b) => b.updatedAt - a.updatedAt).slice(0, MAX_CHATS);
    localStorage.setItem(listKey(lang), JSON.stringify(sorted));
  } catch { /* ignore */ }
}

export function loadActiveChatId(lang: string): string | null {
  try { return localStorage.getItem(activeKey(lang)); } catch { return null; }
}

export function saveActiveChatId(lang: string, id: string): void {
  try { localStorage.setItem(activeKey(lang), id); } catch { /* ignore */ }
}

// Алғашқы қолданушы хабарламасынан тақырып жасау
export function titleFromMessages(messages: ChatMsg[]): string {
  const first = messages.find((m) => m.role === "user");
  if (!first) return "";
  const clean = first.text.replace(/\s+/g, " ").trim();
  return clean.length > 42 ? clean.slice(0, 42) + "…" : clean;
}

// ── Ұзақ мерзімді жады (оқушы туралы қысқа конспект) ──
const memoryKey = (lang: string) => `linguafast_chat_memory_${lang}`;

export function loadMemory(lang: string): string {
  try { return localStorage.getItem(memoryKey(lang)) || ""; } catch { return ""; }
}

export function saveMemory(lang: string, memory: string): void {
  try { localStorage.setItem(memoryKey(lang), memory.trim()); } catch { /* ignore */ }
}
