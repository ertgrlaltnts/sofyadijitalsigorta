"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, BookOpen, Clock, ThumbsDown, ThumbsUp } from "lucide-react";
import Link from "next/link";
import { ChannelBadge, SourceBadge } from "@/components/status-badge";
import { Markdown } from "@/components/markdown";
import { PageHeader } from "@/components/page-header";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { errorMessage } from "@/lib/form-errors";
import { formatDateTime } from "@/lib/format";
import type { ConversationDetail, MessageView } from "@/lib/types";
import { cn } from "@/lib/utils";

function MessageBubble({ message }: { message: MessageView }) {
  const isUser = message.role === "user";
  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div className={cn("max-w-[85%] space-y-2 sm:max-w-[70%]", isUser && "items-end")}>
        <div
          className={cn(
            "rounded-2xl px-4 py-2.5 text-sm shadow-soft",
            isUser ? "rounded-br-md bg-primary text-primary-foreground" : "rounded-bl-md border bg-card",
          )}
        >
          {isUser ? <p className="whitespace-pre-wrap">{message.content}</p> : <Markdown>{message.content}</Markdown>}
        </div>

        {!isUser && (
          <div className="space-y-2 px-1">
            <div className="tabular flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
              <SourceBadge source={message.source} />
              {message.feedback === "up" && <ThumbsUp className="size-3.5 text-emerald-600" aria-label="Olumlu geri bildirim" />}
              {message.feedback === "down" && <ThumbsDown className="size-3.5 text-red-600" aria-label="Olumsuz geri bildirim" />}
              {message.latencyMs !== null && (
                <span className="inline-flex items-center gap-1">
                  <Clock className="size-3" /> {(message.latencyMs / 1000).toFixed(1)} sn
                </span>
              )}
              {message.promptTokens !== null && <span>{message.promptTokens + (message.completionTokens ?? 0)} token</span>}
            </div>
            {message.sources.length > 0 && (
              <ul className="space-y-1">
                {message.sources.map((source) => (
                  <li key={source.chunkId}>
                    <Link
                      href={`/bilgi-tabani/${source.entryId}`}
                      className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary hover:underline"
                    >
                      <BookOpen className="size-3" />
                      {source.title}
                      <span className="tabular rounded bg-muted px-1 py-0.5 text-[10px]">{source.score.toFixed(2)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        <p className={cn("tabular px-1 text-[11px] text-muted-foreground/70", isUser && "text-right")}>{formatDateTime(message.createdAt)}</p>
      </div>
    </div>
  );
}

export function ConversationDetailView({ id }: { id: string }) {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["conversation", id],
    queryFn: () => api<ConversationDetail>(`admin/conversations/${id}`),
  });

  if (isPending) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-16 w-2/3" />
        <Skeleton className="ml-auto h-12 w-1/2" />
        <Skeleton className="h-24 w-2/3" />
      </div>
    );
  }
  if (isError) {
    return (
      <div className="rounded-xl border border-dashed p-12 text-center">
        <p className="font-medium">Sohbet yüklenemedi</p>
        <p className="mt-1 text-sm text-muted-foreground">{errorMessage(error)}</p>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="Sohbet detayı"
        description={`${formatDateTime(data.createdAt)} · ${data.messageCount} mesaj · Oturum ${data.sessionId.slice(0, 8)}`}
        actions={
          <>
            <ChannelBadge channel={data.channel} />
            <Link href="/sohbetler" className={buttonVariants({ variant: "outline" })}>
              <ArrowLeft /> Listeye dön
            </Link>
          </>
        }
      />
      <div className="mx-auto max-w-3xl space-y-5 rounded-xl border bg-muted/30 p-4 sm:p-6">
        {data.messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
      </div>
    </>
  );
}
