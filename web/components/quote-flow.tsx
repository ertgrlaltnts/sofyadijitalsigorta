"use client";

import { useEffect } from "react";
import type { LiveQuoteKey } from "@/lib/quote-products";
import { QuoteFormShell } from "./quote-form-shell";
import { QuoteOffers } from "./quote-offers";
import { useQuoteFlow } from "./use-quote-flow";

/**
 * One product's quote flow, from the first question to the prices: the form while it is being filled, then the offers.
 * `compact` is the chat's version (no outer padding; the chat card provides it).
 */
export function QuoteFlow({
  product,
  shortName,
  serviceName,
  compact = false,
  note,
  onStage,
}: {
  product: LiveQuoteKey;
  shortName: string;
  serviceName: string;
  compact?: boolean;
  note?: string;
  /** Called when the flow moves to another screen (a step, the waiting screen, the offers), so a host can scroll it into view. */
  onStage?: () => void;
}) {
  const flow = useQuoteFlow(product);
  const stage = `${flow.step}|${flow.submitting}|${flow.quoteId ?? ""}`;
  useEffect(() => {
    onStage?.();
    // The host's callback is not a dependency: only a change of screen should call it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  if (flow.quoteId) {
    return (
      <QuoteOffers
        key={flow.quoteId}
        quoteId={flow.quoteId}
        serviceName={serviceName}
        shortName={shortName}
        holderTckn={flow.draft.person.tckn}
        compact={compact}
        onEdit={flow.restart}
      />
    );
  }
  return <QuoteFormShell flow={flow} shortName={shortName} compact={compact} note={note} />;
}
