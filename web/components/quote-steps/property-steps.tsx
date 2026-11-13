"use client";

import {
  DAMAGE_STATES,
  DASK_FLOORS,
  DASK_USAGE,
  FLOOR_COUNTS,
  HOLDER_ROLES,
  HOME_COVER_CHOICES,
  HOME_POSITIONS,
  HOME_TYPES,
  HOME_USAGE_STYLES,
  recentYears,
  STRUCTURES,
} from "@/lib/quote-options";
import type { Draft } from "@/lib/quote-flow";
import { Chips, digits, Field, borderOf, inputClass, RefSelect, SelectField, TextField } from "../quote-fields";
import { useScoped } from "../quote-scope";
import type { StepProps } from "./step-props";

type Address = Draft["address"];
/** The steps of the UAVT address chain after the province, in order: each is asked with the code the one before returned. */
const CHAIN = [
  { field: "ilce", step: "Ilce", label: "İlçe", parent: "il" },
  { field: "semt", step: "Semt", label: "Bucak / köy", parent: "ilce" },
  { field: "mahalle", step: "Mahalle", label: "Mahalle", parent: "semt" },
  { field: "cadde", step: "Cadde", label: "Cadde / sokak", parent: "mahalle" },
  { field: "bina", step: "Bina", label: "Bina", parent: "cadde" },
  { field: "daire", step: "Daire", label: "Daire (iç kapı)", parent: "bina" },
] as const;
const ORDER: (keyof Address)[] = ["il", "ilce", "semt", "mahalle", "cadde", "bina", "daire", "addressCode"];

/** Everything after `field` in the address chain, cleared: changing a step invalidates the choices below it. */
const clearedAfter = (field: keyof Address): Partial<Address> =>
  Object.fromEntries(ORDER.slice(ORDER.indexOf(field) + 1).map((key) => [key, ""])) as Partial<Address>;

/** Province to flat, as the UAVT address chain goes. The flat's address number is the ten-digit code the insurers want. */
export function AddressPicker({ address, onChange, error }: { address: Address; onChange: (value: Partial<Address>) => void; error?: string }) {
  return (
    <div className="space-y-4">
      <RefSelect
        id="lq-il"
        label="İl"
        kind="provinces"
        value={address.il}
        onValue={(il) => onChange({ il, ...clearedAfter("il") })}
      />
      {CHAIN.map(({ field, step, label, parent }) => (
        <RefSelect
          key={field}
          id={`lq-${field}`}
          label={label}
          kind="address"
          params={{ step, value: address[parent] }}
          enabled={!!address[parent]}
          value={address[field]}
          autoPickSingle={field === "semt"}
          onValue={(code) => onChange({ [field]: code, ...clearedAfter(field) })}
          onItem={field === "daire" ? (item) => onChange({ addressCode: item?.extra ?? "" }) : undefined}
          error={field === "daire" ? error : undefined}
        />
      ))}
    </div>
  );
}

export function AddressStep({ product, draft, patch, errors, clear }: StepProps) {
  const { property, address } = draft;
  return (
    <>
      {product === "dask" && (
        <Chips
          legend="Poliçe durumu"
          name="renewal"
          value={property.renewal ? "renewal" : "new"}
          onChange={(value) => patch("property", { renewal: value === "renewal" })}
          options={[
            { value: "new", label: "Yeni poliçe" },
            { value: "renewal", label: "Mevcut DASK poliçemi yeniliyorum" },
          ]}
        />
      )}

      {product === "dask" && property.renewal ? (
        <TextField
          id="lq-dask-no"
          label="Mevcut DASK poliçe no"
          hint="Poliçenizin üzerindeki 8 haneli numara."
          value={property.renewalPolicyNo}
          error={errors.renewalPolicyNo}
          onValue={(value) => {
            patch("property", { renewalPolicyNo: digits(value, 8) });
            clear("renewalPolicyNo");
          }}
          inputMode="numeric"
          autoFocus
        />
      ) : (
        <AddressPicker
          address={address}
          error={errors.addressCode}
          onChange={(value) => {
            patch("address", value);
            clear("addressCode");
          }}
        />
      )}
    </>
  );
}

/** A money amount typed with thousands separators; the draft keeps only the digits. */
function MoneyField({ id, label, hint, value, error, onValue }: { id: string; label: string; hint?: string; value: string; error?: string; onValue: (value: string) => void }) {
  const scoped = useScoped();
  const shown = value ? new Intl.NumberFormat("tr-TR").format(Number(value)) : "";
  return (
    <Field id={id} label={label} hint={hint} error={error}>
      <div className="relative">
        <input
          id={scoped(id)}
          value={shown}
          onChange={(event) => onValue(digits(event.target.value, 11))}
          inputMode="numeric"
          autoComplete="off"
          placeholder="0"
          aria-invalid={!!error}
          className={`${inputClass} ${borderOf(error)} pr-10`}
        />
        <span aria-hidden className="pointer-events-none absolute inset-y-0 right-4 grid place-items-center text-ink-soft">
          ₺
        </span>
      </div>
    </Field>
  );
}

/** The building questions DASK and home insurance both ask; the last few differ by product. */
export function BuildingStep({ product, draft, patch, errors, clear }: StepProps) {
  const { property } = draft;
  const set = (partial: Partial<typeof property>, ...cleared: string[]) => {
    patch("property", partial);
    cleared.forEach(clear);
  };

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField id="lq-role" label="Sigorta ettiren sıfatı" value={property.holderRole} error={errors.holderRole} options={HOLDER_ROLES} onValue={(holderRole) => set({ holderRole }, "holderRole")} />
        <SelectField id="lq-structure" label="Yapı tarzı" value={property.structure} error={errors.structure} options={STRUCTURES} onValue={(structure) => set({ structure }, "structure")} />
        <SelectField id="lq-build-year" label="İnşaat yılı" value={property.buildYear} error={errors.buildYear} options={recentYears(52)} onValue={(buildYear) => set({ buildYear }, "buildYear")} />
        <SelectField id="lq-floors" label="Toplam kat sayısı" value={property.totalFloors} error={errors.totalFloors} options={FLOOR_COUNTS} onValue={(totalFloors) => set({ totalFloors }, "totalFloors")} />
      </div>

      {product === "dask" ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField id="lq-usage" label="Kullanım şekli" value={property.usage} error={errors.usage} options={DASK_USAGE} onValue={(usage) => set({ usage }, "usage")} />
          <SelectField id="lq-damage" label="Bina hasar durumu" value={property.damage} error={errors.damage} options={DAMAGE_STATES} onValue={(damage) => set({ damage }, "damage")} />
          <SelectField id="lq-floor" label="Bulunduğu kat" value={property.floor} error={errors.floor} options={DASK_FLOORS} onValue={(floor) => set({ floor }, "floor")} />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField id="lq-usage-style" label="Kullanım şekli" value={property.usageStyle} error={errors.usageStyle} options={HOME_USAGE_STYLES} onValue={(usageStyle) => set({ usageStyle }, "usageStyle")} />
          <SelectField id="lq-usage-type" label="Kullanım tarzı" value={property.usageType} error={errors.usageType} options={HOME_TYPES} onValue={(usageType) => set({ usageType }, "usageType")} />
          <SelectField id="lq-position" label="Binadaki konumu" value={property.position} error={errors.position} options={HOME_POSITIONS} onValue={(position) => set({ position }, "position")} />
        </div>
      )}

      <TextField
        id="lq-area"
        label="Brüt metrekare"
        value={property.area}
        error={errors.area}
        onValue={(value) => set({ area: digits(value, 5) }, "area")}
        inputMode="numeric"
        placeholder="Örn. 110"
      />
    </>
  );
}

/** What a home policy insures and for how much. */
export function SumsStep({ draft, patch, errors, clear }: StepProps) {
  const { property } = draft;
  const set = (partial: Partial<typeof property>, ...cleared: string[]) => {
    patch("property", partial);
    cleared.forEach(clear);
  };

  return (
    <>
      <Chips legend="Neyi sigortalatmak istiyorsunuz?" name="cover-choice" value={property.coverChoice} onChange={(coverChoice) => set({ coverChoice }, "buildingValue", "contentsValue")} options={HOME_COVER_CHOICES} />

      {property.coverChoice !== 1 && (
        <MoneyField
          id="lq-building-value"
          label="Konut bedeli"
          hint="Konutun yeniden yapım maliyeti (yaklaşık)."
          value={property.buildingValue}
          error={errors.buildingValue}
          onValue={(buildingValue) => set({ buildingValue }, "buildingValue")}
        />
      )}
      {property.coverChoice !== 0 && (
        <MoneyField
          id="lq-contents-value"
          label="Eşya bedeli"
          hint="Evdeki eşyalarınızın toplam değeri."
          value={property.contentsValue}
          error={errors.contentsValue}
          onValue={(contentsValue) => set({ contentsValue }, "contentsValue")}
        />
      )}

      <div className="rounded-2xl border border-ink/10 bg-pearl p-4 sm:p-5">
        <p className="text-[0.875rem] font-semibold">Ek bedeller (isteğe bağlı)</p>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <MoneyField id="lq-glass" label="Cam bedeli" value={property.glassValue} onValue={(glassValue) => set({ glassValue })} />
          <MoneyField id="lq-decoration" label="Dekorasyon bedeli" value={property.decorationValue} onValue={(decorationValue) => set({ decorationValue })} />
        </div>
      </div>
    </>
  );
}
