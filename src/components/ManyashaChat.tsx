"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { getManyashaEmbedConfig, MANYASHA_CHAT_API } from "@/lib/manyasha";

type ChatMessage = { role: "user" | "assistant"; content: string };

const MASCOT_IDLE = "/manyasha/mascot-idle.mp4";
const MASCOT_TALK = "/manyasha/mascot-talk.mp4";
const MASCOT_POSTER = "/manyasha/mascot-idle.jpg";

const GREETING =
  "Здравствуйте! Я Маняша, консультант Agentum Pro. Спрашивайте про партнёрскую программу, личный кабинет, мобильное приложение, вознаграждение или банкротство — помогу разобраться.";

type ManyashaChatContextValue = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
};

const ManyashaChatContext = createContext<ManyashaChatContextValue | null>(null);

export function useManyashaChat(): ManyashaChatContextValue {
  const ctx = useContext(ManyashaChatContext);
  if (!ctx) {
    throw new Error("useManyashaChat must be used within ManyashaChatProvider");
  }
  return ctx;
}

function buildApiHistory(messages: ChatMessage[]): ChatMessage[] {
  return messages
    .filter((m) => m.role === "user" || m.role === "assistant")
    .filter((m) => m.content !== GREETING)
    .slice(-20);
}

function MascotStage({ talking }: { talking: boolean }) {
  const idleRef = useRef<HTMLVideoElement>(null);
  const talkRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const ensurePlaying = (el: HTMLVideoElement | null) => {
      if (!el) return;
      const tryPlay = () => void el.play().catch(() => undefined);
      if (el.readyState >= 2) tryPlay();
      else el.addEventListener("canplay", tryPlay, { once: true });
    };
    ensurePlaying(idleRef.current);
    ensurePlaying(talkRef.current);
  }, []);

  return (
    <div className="relative h-[150px] shrink-0 overflow-hidden bg-white">
      <video
        ref={idleRef}
        src={MASCOT_IDLE}
        poster={MASCOT_POSTER}
        autoPlay
        loop
        muted
        playsInline
        className={`absolute inset-0 mx-auto h-full w-full object-contain object-bottom transition-opacity duration-300 ${
          talking ? "opacity-0" : "opacity-100"
        }`}
        aria-hidden={talking}
      />
      <video
        ref={talkRef}
        src={MASCOT_TALK}
        poster={MASCOT_POSTER}
        autoPlay
        loop
        muted
        playsInline
        className={`absolute inset-0 mx-auto h-full w-full object-contain object-bottom transition-opacity duration-300 ${
          talking ? "opacity-100" : "opacity-0"
        }`}
        aria-label="Маняша"
        aria-hidden={!talking}
      />
    </div>
  );
}

function ManyashaChatPanel() {
  const { isOpen, close } = useManyashaChat();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [greeted, setGreeted] = useState(false);
  const [mounted, setMounted] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<ChatMessage[]>([]);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    if (isOpen && !greeted) {
      setGreeted(true);
      setMessages([{ role: "assistant", content: GREETING }]);
    }
  }, [isOpen, greeted]);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, close]);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;

    setInput("");
    const userMsg: ChatMessage = { role: "user", content: text };
    const history = buildApiHistory([...messagesRef.current, userMsg]);

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch(MANYASHA_CHAT_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history }),
        signal: controller.signal,
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = (await res.json()) as { reply?: string };
      const reply =
        data.reply?.trim() ||
        "Не удалось получить ответ. Попробуйте ещё раз или позвоните +7 (800) 555-10-10.";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Сейчас не удалось получить ответ. Попробуйте ещё раз или позвоните +7 (800) 555-10-10.",
        },
      ]);
    } finally {
      if (abortRef.current === controller) {
        abortRef.current = null;
      }
      setLoading(false);
    }
  }, [input, loading]);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div
      className="fixed bottom-4 right-4 z-[2147483000] sm:bottom-5 sm:right-5"
      role="dialog"
      aria-label="Чат с Маняшей"
      aria-modal="true"
    >
      <div
        className="flex shrink-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.22)]"
        style={{
          width: "min(320px, calc(100vw - 2rem))",
          height: "min(520px, calc(100dvh - 5.5rem))",
          maxWidth: 320,
          maxHeight: 520,
        }}
      >
        <header className="flex shrink-0 items-center gap-2 bg-blue-600 px-3 py-2 text-white">
          <div className="min-w-0 flex-1">
            <div className="text-sm font-bold leading-tight">Маняша</div>
            <div className="truncate text-[10px] text-white/85">Консультант Agentum Pro</div>
          </div>
          <button
            type="button"
            onClick={close}
            className="shrink-0 rounded-md px-1.5 py-0.5 text-xl leading-none text-white/90 hover:bg-white/10"
            aria-label="Закрыть"
          >
            ×
          </button>
        </header>

        <MascotStage talking={loading} />

        <div ref={bodyRef} className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto bg-slate-50 p-2.5">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`max-w-[88%] whitespace-pre-wrap rounded-xl px-2.5 py-2 text-xs leading-snug ${
                msg.role === "user"
                  ? "ml-auto rounded-br-sm bg-blue-600 text-white"
                  : "rounded-bl-sm border border-slate-200 bg-white text-slate-800"
              }`}
            >
              {msg.content}
            </div>
          ))}
          {loading && <div className="text-xs italic text-slate-500">Маняша думает…</div>}
        </div>

        <footer className="flex shrink-0 gap-1.5 border-t border-slate-200 bg-white p-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void send();
              }
            }}
            rows={1}
            placeholder="Спросите Маняшу…"
            className="max-h-16 min-h-[36px] flex-1 resize-none rounded-lg border border-slate-300 px-2.5 py-2 text-xs outline-none focus:border-blue-500"
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => void send()}
            disabled={loading || !input.trim()}
            className="shrink-0 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"
          >
            →
          </button>
        </footer>
      </div>
    </div>,
    document.body,
  );
}

function ManyashaLauncher() {
  const { isOpen, open } = useManyashaChat();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted || isOpen) return null;

  return createPortal(
    <button
      type="button"
      onClick={open}
      aria-label="Открыть Маняшу"
      className="group fixed bottom-4 right-4 z-[2147483000] flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-blue-600 shadow-[0_8px_28px_rgba(37,99,235,0.45)] transition-transform hover:scale-105 sm:bottom-5 sm:right-5 sm:h-[72px] sm:w-[72px]"
    >
      <video
        src={MASCOT_IDLE}
        poster={MASCOT_POSTER}
        autoPlay
        loop
        muted
        playsInline
        className="h-full w-full scale-[1.35] object-cover object-top"
        aria-hidden
      />
      <span className="pointer-events-none absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center">
        <span className="absolute h-full w-full animate-ping rounded-full bg-emerald-400/70" />
        <span className="relative h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-white" />
      </span>
    </button>,
    document.body,
  );
}

export function ManyashaChatProvider({ children }: { children: ReactNode }) {
  const config = getManyashaEmbedConfig();
  const [isOpen, setIsOpen] = useState(config.startOpen);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((v) => !v), []);

  useEffect(() => {
    const onOpen = () => open();
    window.addEventListener("manyasha:open", onOpen);
    return () => window.removeEventListener("manyasha:open", onOpen);
  }, [open]);

  if (!config.enabled) {
    return <>{children}</>;
  }

  return (
    <ManyashaChatContext.Provider value={{ isOpen, open, close, toggle }}>
      {children}
      <ManyashaLauncher />
      <ManyashaChatPanel />
    </ManyashaChatContext.Provider>
  );
}
