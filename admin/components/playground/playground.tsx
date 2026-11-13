"use client";

import { AlertTriangle, BookOpen, FlaskConical, Loader2, Plus, SendHorizontal, Square } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Markdown } from "@/components/markdown";
import { PageHeader } from "@/components/page-header";
import { SourceBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ApiError, streamPost } from "@/lib/api";
import type { AnswerSource, ChatEvent, RetrievalDebug, SourceRef } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  streaming?: boolean;
  error?: string;
  source?: AnswerSource;
  sources?: SourceRef[];
  debug?: RetrievalDebug;
}

const MAX_LENGTH = 1000;
const EXAMPLES = ["Kasko nedir?", "Trafik sigortası zorunlu mu?", "DASK neleri kapsar?", "Evcil hayvanım için sigorta var mı?"];

const newId = () => crypto.randomUUID();

function ScoreRow({ chunk, threshold }: { chunk: RetrievalDebug["chunks"][number]; threshold: number }) {
  return (
    <li className={cn("rounded-lg border p-3 transition-opacity", chunk.used ? "bg-card" : "bg-muted/30 opacity-55")}>
      <div className="flex items-start justify-between gap-3">
        <Link href={`/bilgi-tabani/${chunk.entryId}`} className="text-sm font-medium hover:text-primary hover:underline">
          {chunk.title}
        </Link>
        <span className={cn("tabular shrink-0 text-sm font-semibold", chunk.used ? "text-teal-700 dark:text-teal-300" : "text-muted-foreground")}>
          {chunk.score.toFixed(3)}
        </span>
      </div>
      <div className="relative mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
        <div className={cn("h-full rounded-full", chunk.used ? "bg-brand" : "bg-muted-foreground/40")} style={{ width: `${Math.max(0, Math.min(1, chunk.score)) * 100}%` }} />
        <span className="absolute top-0 h-full w-px bg-foreground/60" style={{ left: `${threshold * 100}%` }} title={`Eşik ${threshold}`} />
      </div>
      <p className="mt-2 line-clamp-3 text-xs text-muted-foreground">{chunk.text}</p>
      {!chunk.used && <p className="mt-1.5 text-[11px] text-muted-foreground">Eşiğin altında — yanıtta kullanılmadı</p>}
    </li>
  );
}

function DebugPanel({ message }: { message: ChatMessage | undefined }) {
  if (!message) {
    return (
      <div className="flex h-full flex-col items-center justify-center px-6 text-center text-sm text-muted-foreground">
        <BookOpen className="mb-3 size-6 opacity-50" />
        Bir soru sorduğunuzda, yanıtta kullanılan kayıtlar ve benzerlik skorları burada görünür.
      </div>
    );
  }
  const debug = message.debug;
  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">Yanıt kaynağı</h2>
        {message.source ? <SourceBadge source={message.source} /> : <Loader2 className="size-4 animate-spin text-muted-foreground" />}
      </div>

      {debug?.error && (
        <p className="flex gap-2 rounded-lg bg-destructive/10 p-2.5 text-xs text-destructive">
          <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
          Bilgi tabanı araması başarısız oldu, genel moda geçildi: {debug.error}
        </p>
      )}

      {debug && (
        <>
          <div className="tabular flex items-center justify-between text-xs text-muted-foreground">
            <span>Benzerlik eşiği</span>
            <span className="font-semibold text-foreground">{debug.threshold}</span>
          </div>
          {debug.chunks.length === 0 ? (
            <p className="rounded-lg border border-dashed p-4 text-center text-xs text-muted-foreground">
              {debug.error ? "Arama yapılamadı." : "Bilgi tabanında aktif ve indekslenmiş kayıt bulunamadı."}
            </p>
          ) : (
            <ul className="space-y-2">
              {debug.chunks.map((chunk) => (
                <ScoreRow key={chunk.chunkId} chunk={chunk} threshold={debug.threshold} />
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}

export function Playground() {
  const [sessionId, setSessionId] = useState(newId);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const patchAssistant = (id: string, patch: (message: ChatMessage) => Partial<ChatMessage>) =>
    setMessages((current) => current.map((message) => (message.id === id ? { ...message, ...patch(message) } : message)));

  const send = async (text: string) => {
    const question = text.trim();
    if (!question || sending) return;

    const assistantId = newId();
    setMessages((current) => [
      ...current,
      { id: newId(), role: "user", content: question },
      { id: assistantId, role: "assistant", content: "", streaming: true },
    ]);
    setSelectedId(assistantId);
    setInput("");
    setSending(true);

    const controller = new AbortController();
    abortRef.current = controller;
    try {
      await streamPost(
        "admin/playground",
        { sessionId, message: question },
        ({ data }) => {
          const event = JSON.parse(data) as ChatEvent;
          if (event.type === "meta") patchAssistant(assistantId, () => ({ source: event.source, sources: event.sources, debug: event.debug }));
          else if (event.type === "delta") patchAssistant(assistantId, (m) => ({ content: m.content + event.text }));
          else if (event.type === "error") patchAssistant(assistantId, () => ({ error: event.message }));
        },
        controller.signal,
      );
    } catch (error) {
      if (!controller.signal.aborted) {
        patchAssistant(assistantId, () => ({ error: error instanceof ApiError ? error.message : "Bağlantı koptu. Lütfen tekrar deneyin." }));
      }
    } finally {
      patchAssistant(assistantId, () => ({ streaming: false }));
      setSending(false);
      abortRef.current = null;
    }
  };

  const reset = () => {
    abortRef.current?.abort();
    setMessages([]);
    setSelectedId(null);
    setSessionId(newId());
    setSending(false);
  };

  const selected = messages.find((m) => m.id === selectedId);

  return (
    <>
      <PageHeader
        title="Test Alanı"
        description="Asistanı canlı deneyin. Yanıtın bilgi tabanından mı yoksa genel bilgiden mi geldiğini ve hangi kayıtlarla eşleştiğini sağ panelden görün."
        actions={
          <Button variant="outline" onClick={reset} disabled={messages.length === 0}>
            <Plus /> Yeni sohbet
          </Button>
        }
      />

      <div className="grid h-[calc(100dvh-13rem)] min-h-[480px] gap-4 lg:grid-cols-[minmax(0,1fr)_380px]">
        <section className="flex min-h-0 flex-col overflow-hidden rounded-xl border bg-card shadow-soft">
          <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-5">
            {messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <span className="mb-4 grid size-12 place-items-center rounded-full bg-secondary text-primary">
                  <FlaskConical className="size-5" />
                </span>
                <p className="font-medium">Bir soru sorun</p>
                <p className="mt-1 max-w-sm text-sm text-muted-foreground">Eklediğiniz bilgiyi test etmek için o konuyla ilgili bir soru yazın.</p>
                <div className="mt-5 flex max-w-md flex-wrap justify-center gap-2">
                  {EXAMPLES.map((example) => (
                    <button
                      key={example}
                      onClick={() => void send(example)}
                      className="rounded-full border bg-background px-3 py-1.5 text-xs text-muted-foreground transition-colors duration-150 hover:border-primary/40 hover:text-foreground"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((message) => {
                const isUser = message.role === "user";
                return (
                  <div key={message.id} className={cn("flex", isUser ? "justify-end" : "justify-start")}>
                    <div
                      onClick={() => !isUser && setSelectedId(message.id)}
                      className={cn(
                        "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm transition-shadow",
                        isUser
                          ? "rounded-br-md bg-primary text-primary-foreground"
                          : cn("cursor-pointer rounded-bl-md border bg-background", selectedId === message.id && "ring-2 ring-ring/40"),
                      )}
                    >
                      {isUser ? (
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      ) : (
                        <>
                          {message.content ? (
                            <Markdown>{message.content}</Markdown>
                          ) : message.streaming && !message.error ? (
                            <span className="inline-flex gap-1 py-1" aria-label="Yanıt hazırlanıyor">
                              {[0, 1, 2].map((i) => (
                                <span key={i} className="size-1.5 animate-bounce rounded-full bg-muted-foreground/60" style={{ animationDelay: `${i * 120}ms` }} />
                              ))}
                            </span>
                          ) : null}
                          {message.error && <p className="mt-1 flex items-center gap-1.5 text-destructive"><AlertTriangle className="size-3.5" /> {message.error}</p>}
                        </>
                      )}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={bottomRef} />
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              void send(input);
            }}
            className="border-t bg-background/60 p-3"
          >
            <div className="flex items-end gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value.slice(0, MAX_LENGTH))}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    void send(input);
                  }
                }}
                rows={1}
                placeholder="Mesajınızı yazın…"
                className="max-h-32 min-h-9 resize-none"
                aria-label="Mesaj"
              />
              {sending ? (
                <Button type="button" variant="outline" size="icon-lg" onClick={() => abortRef.current?.abort()} aria-label="Durdur">
                  <Square />
                </Button>
              ) : (
                <Button type="submit" size="icon-lg" disabled={!input.trim()} aria-label="Gönder">
                  <SendHorizontal />
                </Button>
              )}
            </div>
            <p className="tabular mt-1.5 text-right text-[11px] text-muted-foreground">
              {input.length} / {MAX_LENGTH}
            </p>
          </form>
        </section>

        <aside className="min-h-0 overflow-y-auto rounded-xl border bg-card shadow-soft">
          <DebugPanel message={selected} />
        </aside>
      </div>
    </>
  );
}
