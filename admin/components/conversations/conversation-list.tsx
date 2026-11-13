"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { MessagesSquare, ThumbsDown, ThumbsUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { Pagination } from "@/components/pagination";
import { SimpleSelect } from "@/components/simple-select";
import { ChannelBadge } from "@/components/status-badge";
import { TableSkeleton } from "@/components/table-skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api } from "@/lib/api";
import { errorMessage } from "@/lib/form-errors";
import { formatDateTime, formatRelative } from "@/lib/format";
import type { ConversationListItem, Page } from "@/lib/types";

const ALL = "all";
const CHANNELS = [
  { value: ALL, label: "Tüm kanallar" },
  { value: "web", label: "Web" },
  { value: "playground", label: "Test Alanı" },
];
const SOURCES = [
  { value: ALL, label: "Tüm kaynaklar" },
  { value: "knowledge", label: "Bilgi Tabanı içeren" },
  { value: "general", label: "Genel yanıt içeren" },
];
const FEEDBACKS = [
  { value: ALL, label: "Tüm geri bildirimler" },
  { value: "up", label: "Olumlu içeren" },
  { value: "down", label: "Olumsuz içeren" },
];

const startOfDay = (date: string) => (date ? new Date(`${date}T00:00:00`).toISOString() : undefined);
const endOfDay = (date: string) => (date ? new Date(`${date}T23:59:59.999`).toISOString() : undefined);

export function ConversationList() {
  const router = useRouter();
  const [channel, setChannel] = useState(ALL);
  const [source, setSource] = useState(ALL);
  const [feedback, setFeedback] = useState(ALL);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(1);

  const params = {
    channel: channel === ALL ? undefined : channel,
    source: source === ALL ? undefined : source,
    feedback: feedback === ALL ? undefined : feedback,
    from: startOfDay(from),
    to: endOfDay(to),
    page,
    limit: 15,
  };
  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ["conversations", params],
    queryFn: () => api<Page<ConversationListItem>>("admin/conversations", { query: params }),
    placeholderData: keepPreviousData,
  });

  const change = <T,>(setter: (value: T) => void) => (value: T) => {
    setter(value);
    setPage(1);
  };
  const items = data?.items ?? [];
  const hasFilters = channel !== ALL || source !== ALL || feedback !== ALL || !!from || !!to;

  return (
    <>
      <PageHeader title="Sohbetler" description="Ziyaretçi ve test sohbetlerini, kullanılan kaynakları ve geri bildirimleri inceleyin." />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <SimpleSelect className="h-9 w-40" value={channel} onValueChange={change(setChannel)} options={CHANNELS} />
        <SimpleSelect className="h-9 w-48" value={source} onValueChange={change(setSource)} options={SOURCES} />
        <SimpleSelect className="h-9 w-52" value={feedback} onValueChange={change(setFeedback)} options={FEEDBACKS} />
        <Input type="date" value={from} max={to || undefined} onChange={(e) => change(setFrom)(e.target.value)} className="h-9 w-40" aria-label="Başlangıç tarihi" />
        <span className="text-muted-foreground">–</span>
        <Input type="date" value={to} min={from || undefined} onChange={(e) => change(setTo)(e.target.value)} className="h-9 w-40" aria-label="Bitiş tarihi" />
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setChannel(ALL);
              setSource(ALL);
              setFeedback(ALL);
              setFrom("");
              setTo("");
              setPage(1);
            }}
          >
            Filtreleri temizle
          </Button>
        )}
      </div>

      {isError ? (
        <EmptyState icon={MessagesSquare} title="Sohbetler yüklenemedi" description={errorMessage(error)} action={<Button onClick={() => refetch()}>Tekrar dene</Button>} />
      ) : !isPending && items.length === 0 ? (
        <EmptyState
          icon={MessagesSquare}
          title={hasFilters ? "Eşleşen sohbet yok" : "Henüz sohbet yok"}
          description={hasFilters ? "Filtreleri değiştirerek tekrar deneyin." : "Ziyaretçiler asistanla konuşmaya başladığında sohbetler burada görünür."}
        />
      ) : (
        <div className="overflow-hidden rounded-xl border bg-card shadow-soft">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead>İlk mesaj</TableHead>
                <TableHead>Kanal</TableHead>
                <TableHead className="text-right">Mesaj</TableHead>
                <TableHead>Kaynak dağılımı</TableHead>
                <TableHead className="hidden lg:table-cell">Geri bildirim</TableHead>
                <TableHead>Son mesaj</TableHead>
              </TableRow>
            </TableHeader>
            {isPending ? (
              <TableSkeleton columns={6} />
            ) : (
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id} className="cursor-pointer" onClick={() => router.push(`/sohbetler/${item.id}`)}>
                    <TableCell className="max-w-[320px] truncate font-medium">{item.preview || "—"}</TableCell>
                    <TableCell>
                      <ChannelBadge channel={item.channel} />
                    </TableCell>
                    <TableCell className="tabular text-right">{item.messageCount}</TableCell>
                    <TableCell className="tabular text-sm text-muted-foreground">
                      <span className="text-teal-700 dark:text-teal-300">{item.knowledgeCount} bilgi</span> ·{" "}
                      <span className="text-amber-700 dark:text-amber-300">{item.generalCount} genel</span>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="tabular flex items-center gap-3 text-sm text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <ThumbsUp className="size-3.5" /> {item.upCount}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <ThumbsDown className="size-3.5" /> {item.downCount}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="tabular text-muted-foreground" title={formatDateTime(item.lastMessageAt)}>
                      {formatRelative(item.lastMessageAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            )}
          </Table>
        </div>
      )}

      {data && data.total > 0 && <Pagination page={data.page} limit={data.limit} total={data.total} onPageChange={setPage} />}
    </>
  );
}
