"use client";

import { CONTACT } from "@/lib/content";
import { maskDate } from "@/lib/quote-validation";
import { digits, ErrorText, TextField } from "../quote-fields";
import type { StepProps } from "./step-props";

/** Identity, phone and consent: the last step of every form, where the quote is requested. */
export function PersonStep({ draft, patch, errors, clear }: StepProps) {
  const { person } = draft;
  const set = (partial: Partial<typeof person>, key: string) => {
    patch("person", partial);
    clear(key);
  };

  return (
    <>
      <TextField
        id="lq-tckn"
        label="T.C. kimlik no"
        value={person.tckn}
        error={errors.tckn}
        onValue={(value) => set({ tckn: digits(value, 11) }, "tckn")}
        inputMode="numeric"
        autoFocus
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          id="lq-birth"
          label="Doğum tarihi"
          value={person.birth}
          error={errors.birth}
          onValue={(value) => set({ birth: maskDate(value) }, "birth")}
          inputMode="numeric"
          placeholder="GG.AA.YYYY"
          autoComplete="bday"
        />
        <TextField
          id="lq-phone"
          label="Cep telefonu"
          value={person.phone}
          error={errors.phone}
          onValue={(value) => set({ phone: value }, "phone")}
          inputMode="tel"
          placeholder="5XX XXX XX XX"
          autoComplete="tel"
        />
      </div>
      <div>
        <label className="flex cursor-pointer items-start gap-3 text-[0.875rem] leading-relaxed text-ink-soft">
          <input
            type="checkbox"
            checked={person.consent}
            onChange={(event) => set({ consent: event.target.checked }, "consent")}
            className="mt-1 size-4 shrink-0 accent-[#c8963c]"
          />
          <span>
            <a href={CONTACT.kvkkUrl} target="_blank" rel="noopener" className="font-medium text-ink underline underline-offset-2">
              KVKK aydınlatma metnini
            </a>{" "}
            okudum; bilgilerimin teklif hazırlamak amacıyla sigorta şirketlerine ve acenteye iletilmesini onaylıyorum.
          </span>
        </label>
        <ErrorText error={errors.consent} />
      </div>
    </>
  );
}
