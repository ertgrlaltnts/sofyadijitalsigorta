import type { Draft, Errors } from "@/lib/quote-flow";
import type { LiveQuoteKey } from "@/lib/quote-products";

/** What every step of a quote form receives: the whole draft, a way to change one block of it, and the step's errors. */
export interface StepProps {
  product: LiveQuoteKey;
  draft: Draft;
  patch: <K extends keyof Draft>(block: K, value: Partial<Draft[K]>) => void;
  errors: Errors;
  /** Forget the error of one field once the customer edits it. */
  clear: (key: string) => void;
}
