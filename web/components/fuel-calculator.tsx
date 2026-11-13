"use client";

import { useState } from "react";
import { Glyph } from "./glyph";

type Mode = "trip" | "range";

const fmt = (value: number, digits = 2) => value.toLocaleString("tr-TR", { maximumFractionDigits: digits, minimumFractionDigits: 0 });
const money = (value: number) => `${value.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺`;

/** Accepts "7,5", "7.5" and "1.250,5"; returns NaN for anything that is not a positive number. */
function parse(value: string): number {
  const text = value.trim();
  if (!text) return NaN;
  const normal = text.includes(",") ? text.replace(/\./g, "").replace(",", ".") : text;
  const number = Number(normal);
  return Number.isFinite(number) && number > 0 ? number : NaN;
}

const inputClass =
  "h-12 w-full rounded-xl border border-ink/15 bg-white px-4 text-[1rem] text-ink outline-none transition-[border-color,box-shadow] placeholder:text-ink-soft/55 focus:border-gold focus:shadow-[0_0_0_4px_rgba(226,184,106,0.22)]";

function Field({
  id,
  label,
  unit,
  value,
  onChange,
  placeholder,
  hint,
}: {
  id: string;
  label: string;
  unit: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  hint?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-[0.8125rem] font-semibold text-ink">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          inputMode="decimal"
          autoComplete="off"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className={`${inputClass} pr-16`}
        />
        <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-[0.875rem] text-ink-soft">{unit}</span>
      </div>
      {hint && <p className="mt-1.5 text-[0.8125rem] text-ink-soft">{hint}</p>}
    </div>
  );
}

function Result({ label, value, big = false }: { label: string; value: string; big?: boolean }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
      <p className="text-[0.8125rem] text-pearl/60">{label}</p>
      <p className={`mt-1 font-display leading-none text-white ${big ? "text-[2.5rem] sm:text-[3rem]" : "text-[1.75rem]"}`}>{value}</p>
    </div>
  );
}

/** Fuel cost of a trip, or how far a tank takes you. Pure arithmetic on the numbers the visitor types in. */
export function FuelCalculator() {
  const [mode, setMode] = useState<Mode>("trip");
  const [distance, setDistance] = useState("");
  const [consumption, setConsumption] = useState("");
  const [price, setPrice] = useState("");
  const [roundTrip, setRoundTrip] = useState(false);
  const [people, setPeople] = useState("1");
  const [tank, setTank] = useState("");

  const km = parse(distance);
  const per100 = parse(consumption);
  const litrePrice = parse(price);
  const seats = Math.max(1, Math.floor(parse(people) || 1));
  const tankLitres = parse(tank);

  const totalKm = Number.isNaN(km) ? NaN : km * (roundTrip ? 2 : 1);
  const litres = totalKm * per100 / 100;
  const cost = litres * litrePrice;
  const range = tankLitres / per100 * 100;
  const fillCost = tankLitres * litrePrice;

  const tripReady = !Number.isNaN(litres);
  const costReady = tripReady && !Number.isNaN(cost);
  const rangeReady = !Number.isNaN(range);

  const reset = () => {
    setDistance("");
    setConsumption("");
    setPrice("");
    setRoundTrip(false);
    setPeople("1");
    setTank("");
  };

  const tab = (value: Mode, label: string) => (
    <button
      type="button"
      role="tab"
      aria-selected={mode === value}
      onClick={() => setMode(value)}
      className={`h-11 flex-1 rounded-full px-5 text-[0.9375rem] font-medium transition-colors duration-300 ${
        mode === value ? "bg-ink text-white shadow-[0_12px_24px_-14px_rgba(15,26,48,0.7)]" : "text-ink-soft hover:text-ink"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="overflow-hidden rounded-[2rem] border border-ink/10 bg-white shadow-[0_50px_90px_-50px_rgba(15,26,48,0.45)] lg:grid lg:grid-cols-[1.1fr_0.9fr]">
      <div className="p-6 sm:p-8 lg:p-10">
        <div role="tablist" aria-label="Hesap türü" className="flex gap-1 rounded-full bg-pearl p-1">
          {tab("trip", "Yolculuk maliyeti")}
          {tab("range", "Depo ve menzil")}
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {mode === "trip" ? (
            <div className="sm:col-span-2">
              <Field id="f-km" label="Mesafe" unit="km" value={distance} onChange={setDistance} placeholder="Örn. 450" />
            </div>
          ) : (
            <div className="sm:col-span-2">
              <Field id="f-tank" label="Depo kapasitesi" unit="litre" value={tank} onChange={setTank} placeholder="Örn. 50" />
            </div>
          )}
          <Field
            id="f-cons"
            label="Ortalama tüketim"
            unit="L / 100 km"
            value={consumption}
            onChange={setConsumption}
            placeholder="Örn. 7,5"
          />
          <Field
            id="f-price"
            label={mode === "range" ? "Litre fiyatı (isteğe bağlı)" : "Litre fiyatı"}
            unit="₺ / litre"
            value={price}
            onChange={setPrice}
            placeholder="Pompadaki fiyat"
          />
          {mode === "trip" && (
            <>
              <Field id="f-people" label="Kişi sayısı" unit="kişi" value={people} onChange={setPeople} placeholder="1" />
              <label className="flex cursor-pointer items-center gap-3 self-end rounded-xl border border-ink/15 px-4 py-3 text-[0.9375rem] transition-colors hover:border-gold">
                <input
                  type="checkbox"
                  checked={roundTrip}
                  onChange={(event) => setRoundTrip(event.target.checked)}
                  className="size-4 accent-[#c8963c]"
                />
                Gidiş-dönüş
              </label>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={reset}
          className="mt-6 text-[0.875rem] font-medium text-gold-ink underline decoration-gold/60 underline-offset-4 transition-colors hover:text-ink"
        >
          Alanları temizle
        </button>
      </div>

      <div className="relative isolate overflow-hidden bg-night p-6 text-pearl sm:p-8 lg:p-10" aria-live="polite">
        <div aria-hidden className="pointer-events-none absolute -top-24 -right-16 -z-10 size-72 rounded-full bg-gold/20 blur-3xl" />
        <p className="flex items-center gap-2 text-[0.8125rem] font-medium text-gold">
          <Glyph name="water" className="size-4" />
          Sonuç
        </p>

        {mode === "trip" ? (
          tripReady ? (
            <div className="mt-5 space-y-3">
              <Result big label="Gereken yakıt" value={`${fmt(litres)} litre`} />
              {costReady ? (
                <>
                  <Result label="Toplam maliyet" value={money(cost)} />
                  <div className="grid grid-cols-2 gap-3">
                    <Result label="Kilometre başına" value={money(cost / totalKm)} />
                    <Result label={seats > 1 ? `Kişi başı (${seats} kişi)` : "Kişi başı"} value={money(cost / seats)} />
                  </div>
                </>
              ) : (
                <p className="text-[0.9375rem] text-pearl/65">Maliyeti görmek için litre fiyatını girin.</p>
              )}
            </div>
          ) : (
            <p className="mt-5 max-w-xs text-pearl/65">Mesafeyi ve ortalama tüketimi girin, sonuç burada belirsin.</p>
          )
        ) : rangeReady ? (
          <div className="mt-5 space-y-3">
            <Result big label="Dolu depoyla menzil" value={`${fmt(range, 0)} km`} />
            {!Number.isNaN(fillCost) ? (
              <Result label="Depoyu doldurma maliyeti" value={money(fillCost)} />
            ) : (
              <p className="text-[0.9375rem] text-pearl/65">Doldurma maliyeti için litre fiyatını girebilirsiniz.</p>
            )}
          </div>
        ) : (
          <p className="mt-5 max-w-xs text-pearl/65">Depo kapasitesini ve ortalama tüketimi girin, sonuç burada belirsin.</p>
        )}

        <p className="mt-6 text-[0.8125rem] leading-relaxed text-pearl/50">
          Sonuç, girdiğiniz değerlere göre bir tahmindir. Gerçek tüketim yol, hız ve yüke göre değişir.
        </p>
      </div>
    </div>
  );
}
