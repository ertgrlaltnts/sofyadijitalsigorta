"use client";

import { subtitleOf } from "@/lib/quote-flow";
import { ArrowRightIcon, LockIcon } from "./icons";
import { QuoteProgress } from "./quote-progress";
import { renderStep } from "./quote-steps/render-step";
import type { QuoteFlowState } from "./use-quote-flow";

/**
 * The form around a quote flow's current step: title, step counter and bar, the step itself, errors and the buttons. While the
 * quote is being opened it shows what is happening instead of the step.
 */
export function QuoteFormShell({ flow, shortName, compact = false, note }: { flow: QuoteFlowState; shortName: string; compact?: boolean; note?: string }) {
  const { product, step, steps, index, dir, submitting, formError } = flow;

  return (
    <div className={compact ? "on-light text-ink" : "on-light relative bg-white p-6 text-ink sm:p-8 lg:flex lg:flex-col lg:justify-center lg:p-12"}>
      <form onSubmit={flow.submit} noValidate>
        <div className="flex items-end justify-between gap-4">
          <div>
            <h3 className={`font-display leading-tight ${compact ? "text-[1.375rem]" : "text-[1.875rem]"}`}>{shortName} teklifi al</h3>
            <p key={step} className={`mt-1 text-ink-soft ${compact ? "text-[0.875rem]" : "text-[0.9375rem]"} ${dir ? "step-fade" : ""}`}>
              {submitting ? "Teklifiniz hazırlanıyor" : subtitleOf(product, step)}
            </p>
          </div>
          <span className="shrink-0 text-[0.8125rem] font-semibold text-ink-soft">
            Adım {index + 1} / {steps.length}
          </span>
        </div>

        <div className={`${compact ? "mt-4" : "mt-5"} flex gap-2`} aria-hidden>
          {steps.map((name, n) => (
            <span key={name} className="h-1 flex-1 overflow-hidden rounded-full bg-ink/10">
              <span
                className={`block h-full origin-left rounded-full bg-gradient-to-r from-gold to-gold-deep transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  index >= n ? "scale-x-100" : "scale-x-0"
                }`}
              />
            </span>
          ))}
        </div>

        {submitting ? (
          <div className="step-fade mt-6">
            <QuoteProgress phase="verifying" />
          </div>
        ) : (
          <>
            <div key={step} className={`${compact ? "mt-5" : "mt-6"} space-y-5 ${dir === "prev" ? "step-prev" : dir === "next" ? "step-next" : ""}`}>
              {renderStep(step, flow)}
            </div>

            {formError && (
              <p role="alert" className="step-fade mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[0.9375rem] text-red-800">
                {formError}
              </p>
            )}

            <div className="mt-6 flex items-center gap-3">
              {index > 0 && (
                <button
                  type="button"
                  onClick={flow.back}
                  className="h-12 shrink-0 rounded-full border border-ink/20 px-5 text-[0.9375rem] font-medium transition-colors hover:border-ink hover:bg-ink hover:text-white"
                >
                  Geri
                </button>
              )}
              <button
                type="submit"
                className="group inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-gold px-6 text-[0.9375rem] font-semibold text-night transition-colors hover:bg-gold-hi"
              >
                {flow.last ? "Teklifleri göster" : "Devam"}
                <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" strokeWidth={2.2} />
              </button>
            </div>
          </>
        )}

        <p className="mt-4 flex items-start justify-center gap-2 text-center text-[0.8125rem] leading-relaxed text-ink-soft">
          <LockIcon className="mt-0.5 size-3.5 shrink-0" />
          {note ?? "Bilgileriniz şifreli bağlantıyla iletilir, yalnızca teklif hazırlamak için kullanılır."}
        </p>
      </form>
    </div>
  );
}
