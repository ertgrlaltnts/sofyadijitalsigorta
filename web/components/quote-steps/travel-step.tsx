"use client";

import { TRAVEL_PLANS, TRAVEL_SCOPES } from "@/lib/quote-options";
import { borderOf, Chips, ErrorText, Field, inputClass, RefSelect } from "../quote-fields";
import { useScoped } from "../quote-scope";
import type { StepProps } from "./step-props";

const today = () => new Date().toISOString().slice(0, 10);

/** Where, when and which package. The destination list follows the region: Schengen countries, all countries, or provinces. */
export function TravelStep({ draft, patch, errors, clear }: StepProps) {
  const { travel } = draft;
  const set = (partial: Partial<typeof travel>, ...cleared: string[]) => {
    patch("travel", partial);
    cleared.forEach(clear);
  };
  const domestic = travel.scope === "Y";
  const scoped = useScoped();

  return (
    <>
      <Chips
        legend="Seyahat bölgesi"
        name="scope"
        value={travel.scope}
        onChange={(scope) => set({ scope, destination: "" }, "destination")}
        options={TRAVEL_SCOPES}
      />

      <RefSelect
        // A new key per region so the list starts fresh when the region changes.
        key={travel.scope}
        id="lq-destination"
        label={domestic ? "Gidilecek şehir" : "Gidilecek ülke"}
        kind={domestic ? "provinces" : "countries"}
        params={domestic ? {} : { scope: travel.scope }}
        value={travel.destination}
        error={errors.destination}
        onValue={(destination) => set({ destination }, "destination")}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="lq-start" label="Gidiş tarihi" error={errors.startDate}>
          <input
            id={scoped("lq-start")}
            type="date"
            value={travel.startDate}
            min={today()}
            onChange={(event) => set({ startDate: event.target.value, ...(travel.endDate && event.target.value > travel.endDate ? { endDate: "" } : {}) }, "startDate", "endDate")}
            aria-invalid={!!errors.startDate}
            className={`${inputClass} ${borderOf(errors.startDate)}`}
          />
        </Field>
        <Field id="lq-end-date" label="Dönüş tarihi" error={errors.endDate}>
          <input
            id={scoped("lq-end-date")}
            type="date"
            value={travel.endDate}
            min={travel.startDate || today()}
            onChange={(event) => set({ endDate: event.target.value }, "endDate")}
            aria-invalid={!!errors.endDate}
            className={`${inputClass} ${borderOf(errors.endDate)}`}
          />
        </Field>
      </div>

      <Chips legend="Paket" name="plan" value={travel.plan} onChange={(plan) => set({ plan })} options={TRAVEL_PLANS} />
      <ErrorText error={errors.plan} />
    </>
  );
}
