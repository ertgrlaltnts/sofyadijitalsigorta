"use client";

import { FUEL_TYPES, IMM_LIMITS, IMM_MORAL, PAYMENT_DEFERRED, PAYMENT_INSTALMENTS, recentYears } from "@/lib/quote-options";
import { Chips, digits, RefSelect, SelectField, TextField, Toggle } from "../quote-fields";
import type { StepProps } from "./step-props";

/** "34ABC123" as typed becomes "34 ABC 123" for reading; the draft keeps it without spaces. */
const formatPlate = (plate: string): string => {
  const match = /^(\d{0,2})([A-Z]{0,3})(\d{0,4})$/.exec(plate);
  return match ? match.slice(1).filter(Boolean).join(" ") : plate;
};
const normalizePlate = (value: string): string => value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 9);

const provinceLabel = (item: { code: string; name: string }) => `${item.name} (${item.code.padStart(2, "0")})`;

/** Plate and registration document, or a car with no plate yet; kasko also asks the occupation. */
export function VehicleStep({ product, draft, patch, errors, clear }: StepProps) {
  const { vehicle } = draft;
  const set = (partial: Partial<typeof vehicle>, ...cleared: string[]) => {
    patch("vehicle", partial);
    cleared.forEach(clear);
  };

  return (
    <>
      <Toggle
        title="Plakam henüz çıkmadı"
        hint="Yeni alınmış, plakası henüz çıkmamış araçlar için"
        checked={vehicle.noPlate}
        onChange={(noPlate) => set({ noPlate, modelYear: "" }, "plate", "series", "regNo", "cityCode", "modelYear")}
      />

      {vehicle.noPlate ? (
        <div className="step-fade grid gap-4 sm:grid-cols-2">
          <RefSelect
            id="lq-city"
            label="Plaka il kodu"
            kind="provinces"
            value={vehicle.cityCode}
            error={errors.cityCode}
            format={provinceLabel}
            onValue={(cityCode) => set({ cityCode }, "cityCode")}
          />
          <SelectField
            id="lq-year"
            label="Model yılı"
            value={vehicle.modelYear}
            error={errors.modelYear}
            options={recentYears(2)}
            onValue={(modelYear) => set({ modelYear }, "modelYear")}
          />
        </div>
      ) : (
        <div className="step-fade space-y-4">
          <TextField
            id="lq-plate"
            label="Plaka"
            value={formatPlate(vehicle.plate)}
            error={errors.plate}
            onValue={(value) => set({ plate: normalizePlate(value) }, "plate")}
            placeholder="34 ABC 123"
            upper
            autoFocus
          />
          <div className="grid grid-cols-2 gap-3">
            <TextField
              id="lq-series"
              label="Ruhsat seri"
              value={vehicle.series}
              error={errors.series}
              onValue={(value) => set({ series: value.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 2) }, "series")}
              placeholder="AB"
              upper
            />
            <TextField
              id="lq-regno"
              label="Ruhsat no"
              value={vehicle.regNo}
              error={errors.regNo}
              onValue={(value) => set({ regNo: digits(value, 6) }, "regNo")}
              inputMode="numeric"
              placeholder="123456"
            />
          </div>
          <p className="-mt-1 text-[0.8125rem] leading-relaxed text-ink-soft">Ruhsatınızın üzerindeki “belge seri” ve “belge no” alanları (örn. AB 123456).</p>
        </div>
      )}

      {product === "kasko" && (
        <RefSelect
          id="lq-profession"
          label="Mesleğiniz"
          hint="Kasko fiyatı meslek grubuna göre değişebilir."
          kind="professions"
          value={vehicle.profession}
          error={errors.profession}
          onValue={(profession) => set({ profession }, "profession")}
        />
      )}

      <Chips
        legend="Ödeme şekli"
        name="vehicle-payment"
        value={vehicle.payment}
        onChange={(payment) => patch("vehicle", { payment })}
        options={product === "kasko" ? PAYMENT_INSTALMENTS : PAYMENT_DEFERRED}
        error={errors.payment}
      />
    </>
  );
}

/**
 * The vehicle details the insurers cannot look up: always for a car with no plate, and when the plate and registration number
 * found nothing (the form shows this step then, prefilled with whatever was found).
 */
export function VehicleDetailsStep({ product, draft, patch, errors, clear }: StepProps) {
  const { vehicle } = draft;
  const set = (partial: Partial<typeof vehicle>, ...cleared: string[]) => {
    patch("vehicle", partial);
    cleared.forEach(clear);
  };
  const modelParams = { brand: vehicle.brandCode, ...(vehicle.modelYear ? { year: vehicle.modelYear } : {}) };

  return (
    <>
      <p className="rounded-xl border border-gold/40 bg-gold/10 px-4 py-3 text-[0.875rem] leading-relaxed text-ink">
        {vehicle.noPlate
          ? "Plakası çıkmamış araçlarda araç bilgilerini ruhsat ya da fatura üzerinden elle girmeniz gerekir."
          : "Aracınızı plaka ve ruhsat bilgileriyle otomatik bulamadık. Lütfen araç bilgilerini ruhsatınızdan girin."}
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <RefSelect
          id="lq-usage-type"
          label="Kullanım tarzı"
          kind="usage-types"
          value={vehicle.usageType}
          error={errors.usageType}
          onValue={(usageType) => set({ usageType, usageStyle: "" }, "usageType", "usageStyle")}
        />
        <RefSelect
          id="lq-usage-style"
          label="Kullanım şekli"
          kind="usage-styles"
          params={{ kt: vehicle.usageType }}
          enabled={!!vehicle.usageType}
          value={vehicle.usageStyle}
          error={errors.usageStyle}
          onValue={(usageStyle) => set({ usageStyle }, "usageStyle")}
          autoPickSingle
        />
      </div>

      {!vehicle.noPlate && (
        <SelectField
          id="lq-model-year"
          label="Model yılı"
          value={vehicle.modelYear}
          error={errors.modelYear}
          options={recentYears(35)}
          onValue={(modelYear) => set({ modelYear, vehicleCode: "" }, "modelYear", "vehicleCode")}
        />
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <RefSelect
          id="lq-brand"
          label="Marka"
          kind="brands"
          value={vehicle.brandCode}
          error={errors.brandCode}
          onValue={(brandCode) => set({ brandCode, vehicleCode: "" }, "brandCode", "vehicleCode")}
        />
        <RefSelect
          id="lq-model"
          label="Model"
          kind="models"
          params={modelParams}
          enabled={!!vehicle.brandCode && (vehicle.noPlate || !!vehicle.modelYear)}
          placeholder={vehicle.brandCode ? "Seçin" : "Önce marka seçin"}
          value={vehicle.vehicleCode}
          error={errors.vehicleCode}
          onValue={(vehicleCode) => set({ vehicleCode }, "vehicleCode")}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          id="lq-engine"
          label="Motor no"
          value={vehicle.engineNo}
          error={errors.engineNo}
          onValue={(value) => set({ engineNo: value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 30) }, "engineNo")}
          upper
        />
        <TextField
          id="lq-chassis"
          label="Şasi no"
          hint="17 karakter"
          value={vehicle.chassisNo}
          error={errors.chassisNo}
          onValue={(value) => set({ chassisNo: value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 17) }, "chassisNo")}
          upper
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          id="lq-seats"
          label="Koltuk sayısı"
          value={vehicle.seats}
          error={errors.seats}
          onValue={(value) => set({ seats: digits(value, 3) }, "seats")}
          inputMode="numeric"
          placeholder="Örn. 5"
        />
        {product === "kasko" && (
          <SelectField
            id="lq-fuel"
            label="Yakıt tipi"
            value={vehicle.fuelType}
            error={errors.fuelType}
            options={FUEL_TYPES}
            onValue={(fuelType) => set({ fuelType }, "fuelType")}
          />
        )}
      </div>
    </>
  );
}

export function ImmStep({ draft, patch, errors, clear }: StepProps) {
  return (
    <>
      <SelectField
        id="lq-imm-limit"
        label="İMM bedeli"
        hint="Zorunlu trafik sigortasının üzerinde, üçüncü kişilere verilen zarar için ek teminat limiti."
        value={draft.imm.limit}
        error={errors.limit}
        options={IMM_LIMITS}
        onValue={(limit) => {
          patch("imm", { limit });
          clear("limit");
        }}
      />
      <Chips legend="Manevi tazminat" name="moral" value={draft.imm.moral} onChange={(moral) => patch("imm", { moral })} options={IMM_MORAL} error={errors.moral} />
    </>
  );
}
