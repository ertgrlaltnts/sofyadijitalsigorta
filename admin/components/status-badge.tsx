import { Badge } from "@/components/ui/badge";
import type { AnswerSource, Channel, EntryType, IndexStatus, UnansweredStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

type Tone = "green" | "amber" | "red" | "blue" | "violet" | "slate" | "teal";

const TONES: Record<Tone, string> = {
  green: "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300",
  amber: "bg-amber-500/12 text-amber-700 dark:bg-amber-400/15 dark:text-amber-300",
  red: "bg-red-500/10 text-red-700 dark:bg-red-400/15 dark:text-red-300",
  blue: "bg-blue-500/10 text-blue-700 dark:bg-blue-400/15 dark:text-blue-300",
  violet: "bg-violet-500/10 text-violet-700 dark:bg-violet-400/15 dark:text-violet-300",
  slate: "bg-slate-500/10 text-slate-600 dark:bg-slate-400/15 dark:text-slate-300",
  teal: "bg-teal-500/10 text-teal-700 dark:bg-teal-400/15 dark:text-teal-300",
};

function Tone({ tone, children, className }: { tone: Tone; children: React.ReactNode; className?: string }) {
  return (
    <Badge variant="secondary" className={cn("font-medium", TONES[tone], className)}>
      {children}
    </Badge>
  );
}

export const ActiveBadge = ({ active }: { active: boolean }) => (
  <Tone tone={active ? "green" : "slate"}>{active ? "Aktif" : "Pasif"}</Tone>
);

const INDEX_LABEL: Record<IndexStatus, [Tone, string]> = {
  indexed: ["green", "İndekslendi"],
  pending: ["amber", "Bekliyor"],
  failed: ["red", "Başarısız"],
};
export const IndexBadge = ({ status }: { status: IndexStatus }) => (
  <Tone tone={INDEX_LABEL[status][0]}>{INDEX_LABEL[status][1]}</Tone>
);

export const TypeBadge = ({ type }: { type: EntryType }) => (
  <Tone tone={type === "faq" ? "blue" : "violet"}>{type === "faq" ? "SSS" : "Doküman"}</Tone>
);

export const SourceBadge = ({ source }: { source: AnswerSource | null }) =>
  source === "knowledge" ? <Tone tone="teal">Bilgi Tabanı</Tone> : source === "general" ? <Tone tone="amber">Genel</Tone> : null;

export const ChannelBadge = ({ channel }: { channel: Channel }) => (
  <Tone tone={channel === "web" ? "blue" : "slate"}>{channel === "web" ? "Web" : "Test Alanı"}</Tone>
);

const UNANSWERED_LABEL: Record<UnansweredStatus, [Tone, string]> = {
  open: ["amber", "Açık"],
  resolved: ["green", "Çözüldü"],
  ignored: ["slate", "Yoksayıldı"],
};
export const UnansweredBadge = ({ status }: { status: UnansweredStatus }) => (
  <Tone tone={UNANSWERED_LABEL[status][0]}>{UNANSWERED_LABEL[status][1]}</Tone>
);
