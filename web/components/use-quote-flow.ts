"use client";

import { useState, type FormEvent } from "react";
import { createQuote, QuoteError } from "@/lib/quote-api";
import {
  applySuggestion,
  buildRequest,
  initialDraft,
  SERVER_FIELD,
  stepsFor,
  validateStep,
  type Draft,
  type Errors,
  type StepId,
} from "@/lib/quote-flow";
import type { LiveQuoteKey } from "@/lib/quote-products";

export type StepPatch = <K extends keyof Draft>(block: K, value: Partial<Draft[K]>) => void;

export interface QuoteFlowState {
  product: LiveQuoteKey;
  draft: Draft;
  patch: StepPatch;
  errors: Errors;
  clear: (key: string) => void;
  steps: StepId[];
  index: number;
  step: StepId;
  last: boolean;
  /** Which way the last step change went, for the slide animation; null until the first change. */
  dir: "next" | "prev" | null;
  submitting: boolean;
  formError: string;
  /** Set once the quote is opened; the form is then replaced by the offers. */
  quoteId: string | null;
  submit: (event?: FormEvent) => Promise<void>;
  back: () => void;
  /** Back to the first step, keeping what was typed, to change the answers and ask again. */
  restart: () => void;
}

/**
 * The state of one quote form, shared by the product page and the chat: the answers so far, the current step, validation,
 * and the request that opens the quote. When the insurers cannot find a vehicle by its plate, the flow goes back to the
 * vehicle-details step, prefilled with what was found, instead of failing.
 */
export function useQuoteFlow(product: LiveQuoteKey): QuoteFlowState {
  const [draft, setDraft] = useState<Draft>(initialDraft);
  const [needsVehicle, setNeedsVehicle] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [dir, setDir] = useState<"next" | "prev" | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [quoteId, setQuoteId] = useState<string | null>(null);

  const steps = stepsFor(product, draft, needsVehicle);
  const index = Math.min(stepIndex, steps.length - 1);
  const step = steps[index];
  const last = index === steps.length - 1;

  const patch: StepPatch = (block, value) => setDraft((current) => ({ ...current, [block]: { ...current[block], ...value } }));
  const clear = (key: string) => setErrors((current) => (current[key] ? { ...current, [key]: undefined } : current));
  const goTo = (target: number, direction: "next" | "prev") => {
    setDir(direction);
    setStepIndex(target);
  };

  const submit = async (event?: FormEvent) => {
    event?.preventDefault();
    if (submitting) return;
    setFormError("");

    const found = validateStep(step, product, draft);
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    if (!last) {
      goTo(index + 1, "next");
      return;
    }

    setSubmitting(true);
    try {
      const answer = await createQuote(buildRequest(product, draft));
      if ("needsVehicle" in answer) {
        setDraft((current) => applySuggestion(current, answer.vehicle));
        setNeedsVehicle(true);
        goTo(stepsFor(product, draft, true).indexOf("vehicle-details"), "prev");
        return;
      }
      setQuoteId(answer.id);
    } catch (error) {
      if (!(error instanceof QuoteError)) {
        setFormError("Beklenmeyen bir sorun oluştu. Lütfen tekrar deneyin.");
        return;
      }
      const mapped: Errors = {};
      let earliest = steps.length;
      for (const [field, message] of Object.entries(error.fieldErrors)) {
        const place = SERVER_FIELD[field];
        if (!place) continue;
        mapped[place.key] = message;
        earliest = Math.min(earliest, steps.includes(place.step) ? steps.indexOf(place.step) : steps.length);
      }
      setErrors(mapped);
      setFormError(error.message);
      if (earliest < index) goTo(earliest, "prev");
    } finally {
      setSubmitting(false);
    }
  };

  return {
    product,
    draft,
    patch,
    errors,
    clear,
    steps,
    index,
    step,
    last,
    dir,
    submitting,
    formError,
    quoteId,
    submit,
    back: () => {
      goTo(index - 1, "prev");
      setFormError("");
    },
    restart: () => {
      setQuoteId(null);
      goTo(0, "prev");
    },
  };
}
