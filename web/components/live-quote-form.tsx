"use client";

import type { LiveQuoteKey } from "@/lib/quote-products";
import { QuoteFlow } from "./quote-flow";

/** The quote form of a product page: the product's steps, then the live offers. See quote-flow.tsx. */
export function LiveQuoteForm({ product, shortName, serviceName }: { product: LiveQuoteKey; shortName: string; serviceName: string }) {
  return <QuoteFlow product={product} shortName={shortName} serviceName={serviceName} />;
}
