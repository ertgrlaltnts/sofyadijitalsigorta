"use client";

import { CheckIcon } from "./icons";

export type ProgressPhase = "verifying" | "collecting" | "done";

type RowState = "done" | "active" | "waiting";

function Row({ state, children, detail }: { state: RowState; children: string; detail?: string }) {
  return (
    <li className="flex items-center gap-3">
      <span
        aria-hidden
        className={`grid size-7 shrink-0 place-items-center rounded-full transition-colors duration-500 ${
          state === "done" ? "bg-gold text-night" : state === "active" ? "bg-gold/15 ring-1 ring-gold/60" : "bg-ink/[0.06]"
        }`}
      >
        {state === "done" ? (
          <CheckIcon className="size-4" strokeWidth={2.6} />
        ) : state === "active" ? (
          <span className="size-3.5 animate-spin rounded-full border-2 border-gold-deep/30 border-t-gold-deep" />
        ) : (
          <span className="size-1.5 rounded-full bg-ink/25" />
        )}
      </span>
      <span className={`text-[0.9375rem] transition-colors duration-500 ${state === "waiting" ? "text-ink-soft/60" : state === "active" ? "font-semibold text-ink" : "text-ink"}`}>
        {children}
        {detail && <span className="ml-2 text-[0.8125rem] font-normal text-ink-soft">{detail}</span>}
      </span>
    </li>
  );
}

/**
 * What the system is doing while the customer waits, in three honest stages: the identity check, the insurers answering (with
 * how many have), and the offers being ready. Shown from the moment the form is sent until the prices are in.
 */
export function QuoteProgress({ phase, completed = 0, total = 0, offers = 0 }: { phase: ProgressPhase; completed?: number; total?: number; offers?: number }) {
  const status =
    phase === "verifying"
      ? "Bilgileriniz kontrol ediliyor"
      : phase === "collecting"
        ? "Şirketlerden teklifler bekleniyor"
        : offers > 0
          ? `${offers} teklif hazır`
          : "Teklifler alındı";

  return (
    <div className="rounded-2xl border border-ink/10 bg-pearl/70 p-4 sm:p-5">
      <p role="status" aria-live="polite" className="sr-only">
        {status}
      </p>
      <ol className="space-y-3.5">
        <Row state={phase === "verifying" ? "active" : "done"}>{phase === "verifying" ? "Bilgileriniz kontrol ediliyor" : "Bilgileriniz doğrulandı"}</Row>
        <Row
          state={phase === "verifying" ? "waiting" : phase === "collecting" ? "active" : "done"}
          detail={phase === "collecting" && total > 0 ? `${completed}/${total} şirket yanıt verdi` : undefined}
        >
          {phase === "done" ? "Şirketlerden teklifler alındı" : "Şirketlerden teklifler bekleniyor"}
        </Row>
        <Row state={phase === "done" ? "done" : "waiting"}>{phase === "done" && offers > 0 ? `${offers} teklif karşılaştırmaya hazır` : "Teklifler karşılaştırılıyor"}</Row>
      </ol>
      {phase !== "done" && (
        <p className="mt-4 text-[0.8125rem] leading-relaxed text-ink-soft">
          {phase === "verifying" ? "Kimlik bilgileriniz resmi kayıtlarla eşleştiriliyor." : "Bu işlem yaklaşık bir dakika sürebilir. Fiyatlar geldikçe aşağıda listelenir."}
        </p>
      )}
    </div>
  );
}
