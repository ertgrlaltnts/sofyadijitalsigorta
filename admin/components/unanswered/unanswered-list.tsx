"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BookPlus, EyeOff, HelpCircle, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { Pagination } from "@/components/pagination";
import { UnansweredBadge } from "@/components/status-badge";
import { TableSkeleton } from "@/components/table-skeleton";
import { Button, buttonVariants } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api } from "@/lib/api";
import { errorMessage } from "@/lib/form-errors";
import { formatDateTime, formatRelative } from "@/lib/format";
import type { Page, UnansweredItem, UnansweredStatus } from "@/lib/types";

type Filter = UnansweredStatus | "all";

const FILTERS: { value: Filter; label: string }[] = [
  { value: "open", label: "Açık" },
  { value: "resolved", label: "Çözüldü" },
  { value: "ignored", label: "Yoksayıldı" },
  { value: "all", label: "Tümü" },
];

const EMPTY_TEXT: Record<Filter, string> = {
  open: "Şu an cevaplanmayı bekleyen soru yok. Asistan, bilgi tabanında karşılığı olmayan soruları burada biriktirir.",
  resolved: "Henüz çözülmüş soru yok.",
  ignored: "Yoksayılan soru yok.",
  all: "Henüz kayıtlı soru yok.",
};

export function UnansweredList() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<Filter>("open");
  const [page, setPage] = useState(1);

  const params = { status: filter === "all" ? undefined : filter, page, limit: 15 };
  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ["unanswered", params],
    queryFn: () => api<Page<UnansweredItem>>("admin/unanswered", { query: params }),
    placeholderData: keepPreviousData,
  });

  const setStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: UnansweredStatus }) => api<UnansweredItem>(`admin/unanswered/${id}`, { method: "PATCH", body: { status } }),
    onSuccess: (_item, { status }) => {
      toast.success(status === "ignored" ? "Soru yoksayıldı." : "Soru yeniden açıldı.");
      return queryClient.invalidateQueries({ queryKey: ["unanswered"] });
    },
    onError: (err) => toast.error(errorMessage(err)),
  });

  const items = data?.items ?? [];

  return (
    <>
      <PageHeader
        title="Cevapsız Sorular"
        description="Bilgi tabanında yeterince benzer kayıt bulunamayan sorular. En çok sorulanlar üstte listelenir."
      />

      <Tabs
        value={filter}
        onValueChange={(value) => {
          setFilter(value as Filter);
          setPage(1);
        }}
        className="mb-4"
      >
        <TabsList>
          {FILTERS.map((f) => (
            <TabsTrigger key={f.value} value={f.value}>
              {f.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {isError ? (
        <EmptyState icon={HelpCircle} title="Sorular yüklenemedi" description={errorMessage(error)} action={<Button onClick={() => refetch()}>Tekrar dene</Button>} />
      ) : !isPending && items.length === 0 ? (
        <EmptyState icon={HelpCircle} title="Soru yok" description={EMPTY_TEXT[filter]} />
      ) : (
        <div className="overflow-hidden rounded-xl border bg-card shadow-soft">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead>Soru</TableHead>
                <TableHead className="w-24 text-right">Sorulma</TableHead>
                <TableHead className="hidden w-40 md:table-cell">Son sorulma</TableHead>
                <TableHead className="w-28">Durum</TableHead>
                <TableHead className="w-64" />
              </TableRow>
            </TableHeader>
            {isPending ? (
              <TableSkeleton columns={5} />
            ) : (
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="max-w-[420px] whitespace-normal font-medium">{item.question}</TableCell>
                    <TableCell className="tabular text-right font-semibold">{item.count}</TableCell>
                    <TableCell className="tabular hidden text-muted-foreground md:table-cell" title={formatDateTime(item.lastAskedAt)}>
                      {formatRelative(item.lastAskedAt)}
                    </TableCell>
                    <TableCell>
                      <UnansweredBadge status={item.status} />
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        {item.status === "open" ? (
                          <>
                            <Link
                              href={`/bilgi-tabani/yeni?title=${encodeURIComponent(item.question)}&unanswered=${item.id}`}
                              className={buttonVariants({ size: "sm" })}
                            >
                              <BookPlus /> Bilgi tabanına ekle
                            </Link>
                            <Button size="sm" variant="ghost" disabled={setStatus.isPending} onClick={() => setStatus.mutate({ id: item.id, status: "ignored" })}>
                              <EyeOff /> Yoksay
                            </Button>
                          </>
                        ) : (
                          <>
                            {item.resolvedEntryId && (
                              <Link href={`/bilgi-tabani/${item.resolvedEntryId}`} className={buttonVariants({ size: "sm", variant: "outline" })}>
                                Kaydı gör
                              </Link>
                            )}
                            <Button size="sm" variant="ghost" disabled={setStatus.isPending} onClick={() => setStatus.mutate({ id: item.id, status: "open" })}>
                              <RotateCcw /> Yeniden aç
                            </Button>
                          </>
                        )}
                      </div>
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
