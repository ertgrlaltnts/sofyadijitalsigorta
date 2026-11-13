"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { fetchChatConfig, sendFeedback, streamChat, type StreamEvent } from "@/lib/chat-api";
import { PRODUCT_LABEL, type LiveQuoteKey } from "@/lib/quote-products";
import { ASK_EVENT, CONTACT, DEFAULT_WELCOME } from "@/lib/content";
import { ArrowRightIcon, BoltIcon, RefreshIcon, SendIcon, ThumbIcon } from "./icons";
import { offerText, QuoteFlowCard, QuoteOfferActions, QuotePicker } from "./chat-quote";
import { Markdown } from "./markdown";
import { TypingPlaceholder } from "./typing-placeholder";

type Feedback = "up" | "down" | null;

interface Message {
  id: string;
  role: "user" | "bot";
  text: string;
  streaming?: boolean;
  error?: boolean;
  messageId?: string;
  feedback?: Feedback;
  /** Quote messages: an offer to look at quotes, a product picker, or the quote form itself (not kept across page loads). */
  quote?: { kind: "offer" | "pick" | "flow"; product?: LiveQuoteKey; answered?: boolean };
}

const SESSION_KEY = "sofya.session";
const MESSAGES_KEY = "sofya.messages";
const MAX_LENGTH = 1000;
const YES_TEXT = "Evet, teklifleri göster";
/** What the welcome button says on the visitor's behalf; answered here without the model. */
const QUOTE_ASK = "Sigorta teklifi almak istiyorum";
const QUOTE_CHOOSE = "Hangi sigorta için teklif almak istersiniz?";
const NO_REPLY = "Tamam, başka bir sorunuz olursa buradayım.";

function newId(): string {
  return crypto.randomUUID();
}

function loadSessionId(): string {
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = newId();
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

function loadMessages(): Message[] {
  try {
    const raw = sessionStorage.getItem(MESSAGES_KEY);
    return raw ? (JSON.parse(raw) as Message[]) : [];
  } catch {
    return [];
  }
}

function saveMessages(messages: Message[]): void {
  try {
    // A quote form holds personal data in its own state and cannot be restored, so it is left out.
    const kept = messages.filter((message) => message.quote?.kind !== "flow");
    sessionStorage.setItem(MESSAGES_KEY, JSON.stringify(kept.map(({ id, role, text, error, messageId, feedback, quote }) => ({ id, role, text, error, messageId, feedback, quote }))));
  } catch {
    // Storage can be full or blocked; the conversation just will not survive navigation.
  }
}

function welcome(text: string): Message {
  return { id: "welcome", role: "bot", text };
}

/**
 * The chat. In `launcher` mode (the home page hero) it holds no conversation of its own: what the visitor types or picks is
 * handed to the floating chat, which opens and carries the conversation on from there.
 */
export function SofyaChat({ id = "sofya", className = "", mode = "chat" }: { id?: string; className?: string; mode?: "chat" | "launcher" }) {
  const launcher = mode === "launcher";
  const [messages, setMessages] = useState<Message[]>(() => [welcome(DEFAULT_WELCOME)]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);

  const sessionId = useRef("");
  const abort = useRef<AbortController | null>(null);
  const sendingRef = useRef(false);
  /** Products already offered in this conversation, so the same offer is not made twice. */
  const offered = useRef(new Set<LiveQuoteKey>());
  const log = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLTextAreaElement>(null);
  const hasConversation = messages.length > 1;

  useEffect(() => {
    sessionId.current = loadSessionId();
    const saved = launcher ? [] : loadMessages();
    // Deferred so the first client render matches the server HTML before the saved conversation is restored.
    for (const message of saved) if (message.quote?.product) offered.current.add(message.quote.product);
    if (saved.length > 1) queueMicrotask(() => setMessages(saved));
    const controller = new AbortController();
    fetchChatConfig(controller.signal).then((config) => {
      if (!config) return;
      setMessages((current) => (current.length === 1 ? [welcome(config.welcomeMessage || DEFAULT_WELCOME)] : current));
    });
    return () => {
      controller.abort();
      abort.current?.abort();
    };
  }, [launcher]);

  useEffect(() => {
    const el = log.current;
    if (el) el.scrollTop = el.scrollHeight;
    if (!sending && messages.length > 1) saveMessages(messages);
  }, [messages, sending]);

  const patchBot = useCallback((id: string, patch: (m: Message) => Partial<Message>) => {
    setMessages((current) => current.map((m) => (m.id === id ? { ...m, ...patch(m) } : m)));
  }, []);

  /** Adds what the server suggested after an answer: an offer, the quote form, or the product choices. */
  const addQuoteMessage = useCallback((suggestion: Extract<StreamEvent, { type: "suggest" }>) => {
    const { kind, product } = suggestion;
    if (kind === "pick") {
      setMessages((current) => [...current, { id: newId(), role: "bot", text: "", quote: { kind: "pick" } }]);
      return;
    }
    if (!product) return;
    if (kind === "offer") {
      if (offered.current.has(product)) return;
      offered.current.add(product);
      setMessages((current) => [...current, { id: newId(), role: "bot", text: offerText(product), quote: { kind: "offer", product } }]);
      return;
    }
    offered.current.add(product);
    setMessages((current) => [...current, { id: newId(), role: "bot", text: "", quote: { kind: "flow", product } }]);
  }, []);

  const send = useCallback(
    async (raw: string) => {
      const text = raw.trim().slice(0, MAX_LENGTH);
      if (!text || sendingRef.current) return;

      if (launcher) {
        setInput("");
        if (field.current) field.current.style.height = "";
        window.dispatchEvent(new CustomEvent(ASK_EVENT, { detail: text }));
        return;
      }

      if (text === QUOTE_ASK) {
        setInput("");
        setMessages((current) => [
          ...current,
          { id: newId(), role: "user", text },
          { id: newId(), role: "bot", text: QUOTE_CHOOSE },
          { id: newId(), role: "bot", text: "", quote: { kind: "pick" } },
        ]);
        return;
      }

      sendingRef.current = true;
      setSending(true);
      setInput("");
      if (field.current) field.current.style.height = "";

      const botId = newId();
      setMessages((current) => [
        ...current,
        { id: newId(), role: "user", text },
        { id: botId, role: "bot", text: "", streaming: true },
      ]);

      const controller = new AbortController();
      abort.current = controller;
      let failed = false;
      let suggestion: Extract<StreamEvent, { type: "suggest" }> | null = null;

      for await (const event of streamChat(sessionId.current, text, controller.signal)) {
        if (event.type === "delta") {
          patchBot(botId, (m) => ({ text: m.text + event.text }));
        } else if (event.type === "done") {
          patchBot(botId, () => ({ messageId: event.messageId }));
        } else if (event.type === "suggest") {
          suggestion = event;
        } else {
          failed = true;
          patchBot(botId, () => ({ text: event.message, error: true }));
        }
      }

      if (controller.signal.aborted) return;
      patchBot(botId, (m) => ({
        streaming: false,
        ...(!m.text && !failed ? { text: "Yanıt alınamadı. Lütfen tekrar deneyin.", error: true } : {}),
      }));
      sendingRef.current = false;
      setSending(false);
      if (suggestion && !failed) addQuoteMessage(suggestion);
    },
    [patchBot, addQuoteMessage, launcher],
  );

  useEffect(() => {
    // A launcher never answers; the floating chat does.
    if (launcher) return;
    const onAsk = (event: Event) => {
      const question = (event as CustomEvent<string>).detail;
      if (typeof question === "string") void send(question);
    };
    window.addEventListener(ASK_EVENT, onAsk);
    return () => window.removeEventListener(ASK_EVENT, onAsk);
  }, [send, launcher]);

  /** The customer answers the offer. A yes opens the form; a no is acknowledged and not asked again. */
  function answerOffer(message: Message, yes: boolean) {
    const product = message.quote?.product;
    if (!product) return;
    patchBot(message.id, () => ({ quote: { kind: "offer", product, answered: true } }));
    setMessages((current) => [
      ...current,
      ...(yes
        ? [
            { id: newId(), role: "user" as const, text: YES_TEXT },
            { id: newId(), role: "bot" as const, text: "", quote: { kind: "flow" as const, product } },
          ]
        : [{ id: newId(), role: "bot" as const, text: NO_REPLY }]),
    ]);
  }

  function pickProduct(message: Message, product: LiveQuoteKey) {
    patchBot(message.id, () => ({ quote: { kind: "pick", answered: true } }));
    offered.current.add(product);
    setMessages((current) => [
      ...current,
      { id: newId(), role: "user", text: PRODUCT_LABEL[product] },
      { id: newId(), role: "bot", text: "", quote: { kind: "flow", product } },
    ]);
  }

  function resetChat() {
    abort.current?.abort();
    offered.current.clear();
    sendingRef.current = false;
    setSending(false);
    setMessages((current) => [current[0]]);
    setInput("");
    sessionId.current = newId();
    sessionStorage.setItem(SESSION_KEY, sessionId.current);
    sessionStorage.removeItem(MESSAGES_KEY);
  }

  function rate(message: Message, value: "up" | "down") {
    if (!message.messageId) return;
    const next: Feedback = message.feedback === value ? null : value;
    patchBot(message.id, () => ({ feedback: next }));
    void sendFeedback(message.messageId, next);
  }

  function onKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      void send(input);
    }
  }

  function resize(el: HTMLTextAreaElement) {
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }

  return (
    <section
      id={id}
      aria-label="Sofya ile sohbet"
      className={`relative flex w-full flex-col overflow-hidden rounded-[1.75rem] bg-navy ring-1 ring-white/10 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] ${className}`}
    >
      <header className="relative flex items-center gap-3.5 bg-gradient-to-b from-white/[0.06] to-transparent px-5 pt-4 pb-4 shadow-[0_1px_0_0_rgba(255,255,255,0.07)]">
        <Avatar />
        <div className="min-w-0 flex-1">
          <p className="font-sans text-[1.0625rem] font-semibold leading-tight text-white">Sofya</p>
          <p className="mt-1 text-[0.8125rem] text-pearl/60">Dijital sigorta asistanı</p>
        </div>
        {hasConversation && (
          <button
            type="button"
            onClick={resetChat}
            className="inline-flex h-9 items-center gap-2 rounded-full border border-white/15 px-3.5 text-[0.8125rem] font-medium text-pearl transition-colors hover:border-gold hover:text-gold"
          >
            <RefreshIcon className="size-4" />
            Yeni sohbet
          </button>
        )}
      </header>

      <div
        ref={log}
        role="log"
        aria-live="polite"
        aria-label="Sohbet geçmişi"
        className="scroll-thin flex-1 space-y-5 overflow-y-auto px-5 py-6"
      >
        {messages.map((message) => (
          <Bubble key={message.id} message={message} onRate={rate} onAnswerOffer={answerOffer} onPick={pickProduct} />
        ))}

        {!hasConversation && (
          <div className="pt-1 pl-[2.625rem]">
            <button
              type="button"
              onClick={() => void send(QUOTE_ASK)}
              className="group flex h-12 w-full cursor-pointer items-center gap-3 rounded-xl bg-gradient-to-r from-gold/[0.18] to-gold/[0.05] px-4 text-gold-hi ring-1 ring-gold/45 transition-[background-color,color,box-shadow] duration-300 hover:bg-gold hover:from-gold hover:to-gold hover:text-night hover:ring-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              <BoltIcon className="size-[1.125rem] shrink-0" />
              <span className="flex-1 text-left text-[0.9375rem] font-semibold tracking-wide">Sigorta teklifi al</span>
              <ArrowRightIcon className="size-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        )}
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          void send(input);
        }}
        className="bg-night/40 px-4 pt-3.5 pb-3 shadow-[0_-1px_0_0_rgba(255,255,255,0.07)]"
      >
        <div className="flex items-end gap-2 rounded-[1.5rem] bg-white/[0.06] py-1.5 pr-1.5 pl-5 ring-1 ring-white/10">
          <label htmlFor={`${id}-input`} className="sr-only">
            Mesajınız
          </label>
          <div className="relative min-w-0 flex-1">
            <textarea
              id={`${id}-input`}
              ref={field}
              rows={1}
              value={input}
              maxLength={MAX_LENGTH}
                          onChange={(event) => {
                setInput(event.target.value);
                resize(event.target);
              }}
              onKeyDown={onKeyDown}
              className="chat-field scroll-thin max-h-[7.5rem] min-h-[2.25rem] w-full resize-none bg-transparent py-2 text-[0.9375rem] leading-snug text-pearl outline-none placeholder:text-pearl/45 focus:outline-none focus-visible:outline-none"
            />

            {!input && <TypingPlaceholder text="Mesajınızı buraya yazın" className="absolute top-0 left-0 py-2 text-[0.9375rem] leading-snug text-pearl/45" />}
          </div>
          <button
            type="submit"
            disabled={sending || !input.trim()}
            aria-label="Gönder"
            className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-full bg-gold text-night transition-[background-color,opacity] hover:bg-gold-hi disabled:cursor-default disabled:bg-white/10 disabled:text-pearl/40"
          >
            <SendIcon className="size-5" strokeWidth={2.2} />
          </button>
        </div>
        <p className="mt-2.5 text-center text-[0.75rem] leading-snug text-pearl/45">
          Sofya yapay zeka destekli bir asistandır. Yanıtları sigorta şirketinin teklifi yerine geçmez.{" "}
          <a href={CONTACT.kvkkUrl} target="_blank" rel="noopener noreferrer" className="underline decoration-pearl/30 underline-offset-2 hover:text-gold">
            KVKK
          </a>
        </p>
      </form>
    </section>
  );
}

function Avatar({ size = "md" }: { size?: "md" | "sm" }) {
  const box = size === "md" ? "size-11" : "size-8";
  return (
    <span className={`relative ${box} shrink-0`}>
      <span className="absolute inset-0 overflow-hidden rounded-full bg-night ring-1 ring-gold/70 shadow-[0_0_14px_rgba(226,184,106,0.3)]">
        <Image src="/sofya-avatar.png" alt="" fill sizes="44px" quality={90} className="object-cover" />
      </span>
      {size === "md" && <span className="absolute -right-0.5 -bottom-0.5 size-3 rounded-full bg-online ring-2 ring-navy" />}
    </span>
  );
}

function Bubble({
  message,
  onRate,
  onAnswerOffer,
  onPick,
}: {
  message: Message;
  onRate: (m: Message, v: "up" | "down") => void;
  onAnswerOffer: (m: Message, yes: boolean) => void;
  onPick: (m: Message, product: LiveQuoteKey) => void;
}) {
  if (message.role === "user") {
    return (
      <div className="msg-in flex justify-end">
        <p className="max-w-[82%] rounded-[1.25rem] rounded-br-md bg-gradient-to-br from-gold-hi to-gold px-4 py-2.5 text-[0.9375rem] leading-relaxed font-medium whitespace-pre-wrap text-night shadow-[0_8px_20px_-12px_rgba(226,184,106,0.6)] [overflow-wrap:anywhere]">
          {message.text}
        </p>
      </div>
    );
  }

  const quote = message.quote;
  if (quote?.kind === "flow" && quote.product) {
    return (
      <div className="msg-in flex items-start gap-2.5">
        <Avatar size="sm" />
        <div className="min-w-0 flex-1">
          <QuoteFlowCard product={quote.product} />
        </div>
      </div>
    );
  }
  if (quote?.kind === "pick") {
    // The choices follow Sofya's question; once one is picked the user's reply replaces them.
    return quote.answered ? null : (
      <div className="msg-in pl-[2.625rem]">
        <QuotePicker answered={quote.answered} onPick={(product) => onPick(message, product)} />
      </div>
    );
  }

  const canRate = !message.streaming && !message.error && message.messageId;
  return (
    <div className="msg-in flex items-start gap-2.5">
      <Avatar size="sm" />
      <div className="min-w-0 max-w-[85%]">
        <div
          className={`rounded-[1.25rem] rounded-tl-md border px-4 py-3 text-[0.9375rem] leading-relaxed [overflow-wrap:anywhere] ${
            message.error ? "border-red-400/30 bg-red-950/40 text-red-100" : "border-transparent bg-white/[0.07] text-pearl"
          }`}
        >
          {message.text ? (
            <Markdown>{message.text}</Markdown>
          ) : (
            <span className="flex h-6 items-center gap-1.5" role="status" aria-label="Sofya yazıyor">
              {[0, 0.15, 0.3].map((delay) => (
                <i key={delay} className="typing-dot size-1.5 rounded-full bg-gold" style={{ animationDelay: `${delay}s` }} />
              ))}
            </span>
          )}
        </div>
        {quote?.kind === "offer" && <QuoteOfferActions answered={quote.answered} onAnswer={(yes) => onAnswerOffer(message, yes)} />}
        {canRate && (
          <div className="mt-1.5 flex gap-1 pl-1">
            {(["up", "down"] as const).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => onRate(message, value)}
                aria-pressed={message.feedback === value}
                aria-label={value === "up" ? "Yanıt faydalıydı" : "Yanıt faydalı değildi"}
                className={`grid size-7 place-items-center rounded-full transition-colors hover:bg-white/10 ${
                  message.feedback === value ? "text-gold" : "text-pearl/40 hover:text-pearl"
                }`}
              >
                <ThumbIcon className={`size-4 ${value === "down" ? "rotate-180" : ""}`} />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
