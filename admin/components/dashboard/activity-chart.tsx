"use client";

import { Table2, BarChart3 } from "lucide-react";
import { useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatNumber } from "@/lib/format";
import type { AnalyticsOverview } from "@/lib/types";

type Day = AnalyticsOverview["daily"][number];

const SERIES = [
  { key: "knowledge", label: "Bilgi tabanı", color: "var(--series-knowledge)" },
  { key: "general", label: "Genel", color: "var(--series-general)" },
] as const;

const shortDate = new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "short" });
const longDate = new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "long", weekday: "long" });
const toDate = (iso: string) => new Date(`${iso}T12:00:00`);

function ChartTooltip({ active, payload }: { active?: boolean; payload?: { payload: Day }[] }) {
  if (!active || !payload?.length) return null;
  const day = payload[0].payload;
  return (
    <div className="rounded-lg border bg-popover px-3 py-2 text-xs shadow-soft">
      <p className="mb-1.5 font-medium text-foreground">{longDate.format(toDate(day.date))}</p>
      {SERIES.map((series) => (
        <p key={series.key} className="tabular flex items-center justify-between gap-6 text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-[2px]" style={{ background: series.color }} />
            {series.label}
          </span>
          <span className="font-medium text-foreground">{formatNumber(day[series.key])}</span>
        </p>
      ))}
      <p className="tabular mt-1 flex justify-between gap-6 border-t pt-1 text-muted-foreground">
        <span>Toplam</span>
        <span className="font-medium text-foreground">{formatNumber(day.knowledge + day.general)}</span>
      </p>
    </div>
  );
}

export function ActivityChart({ daily }: { daily: Day[] }) {
  const [tableView, setTableView] = useState(false);
  const total = daily.reduce((sum, day) => sum + day.knowledge + day.general, 0);
  const summary = `Son 30 günde ${formatNumber(total)} asistan yanıtı: bilgi tabanı ve genel yanıt dağılımı`;

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-3">
        <ul className="flex items-center gap-4 text-xs text-muted-foreground">
          {SERIES.map((series) => (
            <li key={series.key} className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-[3px]" style={{ background: series.color }} />
              {series.label}
            </li>
          ))}
        </ul>
        <Button variant="ghost" size="xs" onClick={() => setTableView((v) => !v)}>
          {tableView ? <BarChart3 /> : <Table2 />}
          {tableView ? "Grafik" : "Tablo"}
        </Button>
      </div>

      {total === 0 ? (
        <div className="grid h-64 place-items-center rounded-lg border border-dashed text-sm text-muted-foreground">
          Son 30 günde yanıtlanmış sohbet yok.
        </div>
      ) : tableView ? (
        <div className="h-64 overflow-y-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tarih</TableHead>
                <TableHead className="text-right">Bilgi tabanı</TableHead>
                <TableHead className="text-right">Genel</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...daily].reverse().map((day) => (
                <TableRow key={day.date}>
                  <TableCell>{shortDate.format(toDate(day.date))}</TableCell>
                  <TableCell className="tabular text-right">{day.knowledge}</TableCell>
                  <TableCell className="tabular text-right">{day.general}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div role="img" aria-label={summary} className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={daily} margin={{ top: 8, right: 4, bottom: 0, left: -16 }} barCategoryGap="22%" maxBarSize={24}>
              <CartesianGrid vertical={false} stroke="var(--border)" strokeWidth={1} />
              <XAxis
                dataKey="date"
                tickFormatter={(value: string) => shortDate.format(toDate(value))}
                interval={4}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                tickMargin={8}
              />
              <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={44} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: "var(--muted)", opacity: 0.6 }} />
              <Bar dataKey="knowledge" stackId="a" fill="var(--series-knowledge)" stroke="var(--card)" strokeWidth={1} isAnimationActive={false} />
              <Bar dataKey="general" stackId="a" fill="var(--series-general)" stroke="var(--card)" strokeWidth={1} radius={[4, 4, 0, 0]} isAnimationActive={false} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
