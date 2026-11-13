import { isLiveQuoteKey, type LiveQuoteKey } from "./quote-products";

export const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api").replace(/\/$/, "");

export interface ChatConfig {
  assistantName: string;
  welcomeMessage: string;
  suggestedQuestions: string[];
}

export type StreamEvent =
  | { type: "delta"; text: string }
  | { type: "done"; messageId: string }
  /** The server offers the quote flow: after an answer (`offer`), on a request for a quote (`start`), or to choose a product (`pick`). */
  | { type: "suggest"; kind: "offer" | "start" | "pick"; product: LiveQuoteKey | null }
  | { type: "error"; message: string };

const NETWORK_ERROR = "Sofya'ya şu an ulaşılamıyor. Bağlantınızı kontrol edip tekrar deneyin.";
const RATE_LIMIT_ERROR = "Çok hızlı mesaj gönderdiniz. Bir dakika bekleyip tekrar deneyin.";

export async function fetchChatConfig(signal?: AbortSignal): Promise<ChatConfig | null> {
  try {
    const res = await fetch(`${API_URL}/chat/config`, { signal });
    return res.ok ? ((await res.json()) as ChatConfig) : null;
  } catch {
    return null;
  }
}

export async function* streamChat(sessionId: string, message: string, signal: AbortSignal): AsyncGenerator<StreamEvent> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "text/event-stream" },
      body: JSON.stringify({ sessionId, message }),
      signal,
    });
  } catch {
    if (signal.aborted) return;
    yield { type: "error", message: NETWORK_ERROR };
    return;
  }

  if (!res.ok || !res.body) {
    yield { type: "error", message: res.status === 429 ? RATE_LIMIT_ERROR : await readErrorMessage(res) };
    return;
  }

  const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
  let buffer = "";
  try {
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += value;
      let end: number;
      while ((end = buffer.indexOf("\n\n")) !== -1) {
        const event = parseEvent(buffer.slice(0, end));
        buffer = buffer.slice(end + 2);
        if (event) yield event;
      }
    }
  } catch {
    if (!signal.aborted) yield { type: "error", message: NETWORK_ERROR };
  }
}

function parseEvent(raw: string): StreamEvent | null {
  const data = raw
    .split("\n")
    .filter((line) => line.startsWith("data:"))
    .map((line) => line.slice(5).trimStart())
    .join("\n");
  if (!data) return null;
  try {
    const event = JSON.parse(data) as { type: string };
    if (event.type === "delta" || event.type === "done" || event.type === "error") return event as StreamEvent;
    if (event.type === "suggest") {
      const { kind, product } = event as { type: string; kind?: string; product?: unknown };
      const known = isLiveQuoteKey(product);
      if (kind === "pick") return { type: "suggest", kind, product: null };
      if ((kind === "offer" || kind === "start") && known) return { type: "suggest", kind, product };
    }
    return null;
  } catch {
    return null;
  }
}

async function readErrorMessage(res: Response): Promise<string> {
  try {
    const body = (await res.json()) as { message?: string | string[] };
    const message = Array.isArray(body.message) ? body.message[0] : body.message;
    if (message) return message;
  } catch {
    // fall through
  }
  return NETWORK_ERROR;
}

export async function sendFeedback(messageId: string, feedback: "up" | "down" | null): Promise<void> {
  try {
    await fetch(`${API_URL}/chat/feedback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messageId, feedback }),
    });
  } catch {
    // Feedback is best-effort; the UI already reflects the choice.
  }
}
