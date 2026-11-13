"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { BookPlus, HelpCircle, MessageSquareText, MessagesSquare, ThumbsUp, Library, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ActivityChart } from "@/components/dashboard/activity-chart";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { ChannelBadge } from "@/components/status-badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { api } from "@/lib/api";
import { errorMessage } from "@/lib/form-errors";
import { formatNumber, formatPercent, formatRelative } from "@/lib/format";
import type { AnalyticsOverview } from "@/lib/types";

interface KpiProps {
  label: string;
  value: string;
  hint: string;
  icon: LucideIcon;
  href?: string;
}

function Kpi({ label, value, hint, icon: Icon, href }: KpiProps) {
  const body = (
    <Card className="h-full transition-shadow duration-150 hover:shadow-soft">
      <CardContent className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <p className="text-sm whitespace-nowrap text-muted-foreground">{label}</p>
          <p className="tabular text-3xl font-semibold tracking-tight">{value}</p>
          <p className="text-xs text-muted-foreground">{hint}</p>
        </div>
        <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-secondary text-primary">
          <Icon className="size-[18px]" />
        </span>
      </CardContent>
    </Card>
  );
  return href ? (
    <Link href={href} className="block rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
      {body}
    </Link>
  ) : (
    body
  );
}

function KpiSkeleton() {
  return (
    <Card>
      <CardContent className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-3 w-32" />
      </CardContent>
    </Card>
  );
}

const orDash = (value: number | null, format: (n: number) => string) => (value === null ? "—" : format(value));

export function Dashboard() {
  const [includePlayground, setIncludePlayground] = useState(false);
  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ["analytics", includePlayground],
    queryFn: () => api<AnalyticsOverview>("admin/analytics/overview", { query: { includePlayground } }),
    placeholderData: keepPreviousData,
    refetchInterval: 60_000,
  });

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Asistanın sohbet performansına ve bilgi tabanı kullanımına genel bakış."
        actions={
          <div className="flex items-center gap-2">
            <Switch id="include-playground" size="sm" checked={includePlayground} onCheckedChange={setIncludePlayground} />
            <Label htmlFor="include-playground" className="cursor-pointer text-sm font-normal text-muted-foreground">
              Test Alanı sohbetlerini dahil et
            </Label>
          </div>
        }
      />

      {isError ? (
        <EmptyState
          icon={MessagesSquare}
          title="Veriler yüklenemedi"
          description={errorMessage(error)}
          action={<Button onClick={() => refetch()}>Tekrar dene</Button>}
        />
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {isPending ? (
              Array.from({ length: 5 }, (_, i) => <KpiSkeleton key={i} />)
            ) : (
              <>
                <Kpi label="Bugünkü sohbet" value={formatNumber(data.kpis.todayConversations)} hint="Bugün başlayanlar" icon={MessagesSquare} href="/sohbetler" />
                <Kpi label="Toplam mesaj" value={formatNumber(data.kpis.totalMessages)} hint="Kullanıcı + asistan" icon={MessageSquareText} />
                <Kpi
                  label="Bilgi tabanı oranı"
                  value={orDash(data.kpis.knowledgeRate, formatPercent)}
                  hint="Asistan yanıtları içinde"
                  icon={Library}
                />
                <Kpi label="Cevapsız soru" value={formatNumber(data.kpis.openUnanswered)} hint="Açık, eklenmeyi bekliyor" icon={HelpCircle} href="/cevapsiz-sorular" />
                <Kpi
                  label="Olumlu geri bildirim"
                  value={orDash(data.kpis.positiveFeedbackRate, formatPercent)}
                  hint="Geri bildirimler içinde"
                  icon={ThumbsUp}
                />
              </>
            )}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Son 30 gün: asistan yanıtları</CardTitle>
              <CardDescription>Günlük yanıt sayısı, yanıtın kaynağına göre.</CardDescription>
            </CardHeader>
            <CardContent>{isPending ? <Skeleton className="h-72 w-full" /> : <ActivityChart daily={data.daily} />}</CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>En çok sorulan cevapsız sorular</CardTitle>
                <CardDescription>Bilgi tabanına ekleyerek yanıtlanabilir hale getirin.</CardDescription>
              </CardHeader>
              <CardContent>
                {isPending ? (
                  <div className="space-y-3">
                    {Array.from({ length: 4 }, (_, i) => (
                      <Skeleton key={i} className="h-10 w-full" />
                    ))}
                  </div>
                ) : data.topUnanswered.length === 0 ? (
                  <p className="rounded-lg border border-dashed px-4 py-10 text-center text-sm text-muted-foreground">Cevapsız soru yok. Harika!</p>
                ) : (
                  <ul className="divide-y">
                    {data.topUnanswered.map((item) => (
                      <li key={item.id} className="flex items-center gap-3 py-2.5">
                        <span className="tabular grid size-7 shrink-0 place-items-center rounded-md bg-amber-500/12 text-xs font-semibold text-amber-700 dark:text-amber-300">
                          {item.count}
                        </span>
                        <span className="min-w-0 flex-1 truncate text-sm">{item.question}</span>
                        <Link
                          href={`/bilgi-tabani/yeni?title=${encodeURIComponent(item.question)}&unanswered=${item.id}`}
                          className={buttonVariants({ size: "sm", variant: "outline" })}
                        >
                          <BookPlus /> <span className="hidden sm:inline">Bilgi tabanına ekle</span>
                          <span className="sm:hidden">Ekle</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Son sohbetler</CardTitle>
                <CardDescription>En son mesajlaşılan konuşmalar.</CardDescription>
              </CardHeader>
              <CardContent>
                {isPending ? (
                  <div className="space-y-3">
                    {Array.from({ length: 4 }, (_, i) => (
                      <Skeleton key={i} className="h-10 w-full" />
                    ))}
                  </div>
                ) : data.recentConversations.length === 0 ? (
                  <p className="rounded-lg border border-dashed px-4 py-10 text-center text-sm text-muted-foreground">Henüz sohbet yok.</p>
                ) : (
                  <ul className="divide-y">
                    {data.recentConversations.map((conversation) => (
                      <li key={conversation.id}>
                        <Link href={`/sohbetler/${conversation.id}`} className="flex items-center gap-3 rounded-md py-2.5 transition-colors duration-150 hover:bg-muted/50">
                          <span className="min-w-0 flex-1 truncate text-sm">{conversation.preview || "—"}</span>
                          {includePlayground && <ChannelBadge channel={conversation.channel} />}
                          <span className="tabular shrink-0 text-xs text-muted-foreground">{conversation.messageCount} mesaj</span>
                          <span className="tabular w-20 shrink-0 text-right text-xs text-muted-foreground">{formatRelative(conversation.lastMessageAt)}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </>
  );
}
