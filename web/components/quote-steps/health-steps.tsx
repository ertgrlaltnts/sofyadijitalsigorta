"use client";

import { useEffect, useState } from "react";
import { fetchTransferCompanies } from "@/lib/quote-api";
import { maskDate } from "@/lib/quote-validation";
import { Chips, digits, SelectField, TextField, Toggle } from "../quote-fields";
import type { StepProps } from "./step-props";

const COVERAGES = [
  { value: "3", label: "50.000 ₺" },
  { value: "5", label: "250.000 ₺" },
  { value: "7", label: "500.000 ₺" },
  { value: "9", label: "1.000.000 ₺" },
  { value: "11", label: "2.000.000 ₺" },
  { value: "13", label: "5.000.000 ₺" },
];

const VISITS = [
  { value: 1, label: "0-9 kez" },
  { value: 2, label: "10 kez" },
  { value: 3, label: "Sınırsız" },
] as const;

const NETWORKS = [
  { value: 0, label: "Dar" },
  { value: 1, label: "Standart" },
  { value: 2, label: "Kapsamlı" },
] as const;

const HEALTH_PAYMENTS = [
  { value: "P", label: "Peşin" },
  { value: "3", label: "3 taksit" },
  { value: "6", label: "6 taksit" },
  { value: "9", label: "9 taksit" },
] as const;

const ACCIDENT_PAYMENTS = [
  { value: "P", label: "Peşin" },
  { value: "V", label: "Vadeli" },
] as const;

export function HealthCoverStep({ draft, patch }: StepProps) {
  const { health } = draft;
  return (
    <>
      <Chips
        legend="Hangi teminatı istiyorsunuz?"
        name="cover"
        value={health.cover}
        onChange={(cover) => patch("health", { cover })}
        options={[
          { value: "inpatient", label: "Yatarak tedavi" },
          { value: "outpatient", label: "Yatarak + ayakta" },
        ]}
      />
      {health.cover === "outpatient" && (
        <div className="step-fade">
          <Chips legend="Ayakta muayene limiti" name="visits" value={health.visits} onChange={(visits) => patch("health", { visits })} options={VISITS} />
        </div>
      )}
      <Chips
        legend="Anlaşmalı hastane ağı"
        hint="Ağ genişledikçe gidebileceğiniz hastane sayısı artar; fiyat da şirkete göre değişir."
        name="network"
        value={health.network}
        onChange={(network) => patch("health", { network })}
        options={NETWORKS}
      />
      <Toggle title="Doğum teminatı" hint="Doğum ve gebelik giderlerini de kapsayan poliçe" checked={health.birthCover} onChange={(birthCover) => patch("health", { birthCover })} />
      <Chips legend="Ödeme şekli" name="payment" value={health.payment} onChange={(payment) => patch("health", { payment })} options={HEALTH_PAYMENTS} />
    </>
  );
}

export function HealthProfileStep({ draft, patch, errors, clear }: StepProps) {
  const { health } = draft;
  const [companies, setCompanies] = useState<{ code: string; name: string }[] | null>(null);
  const [failed, setFailed] = useState(false);

  // The previous-insurer list is only needed (and fetched) once the customer says the policy is being moved.
  useEffect(() => {
    if (!health.transfer || companies) return;
    fetchTransferCompanies()
      .then(setCompanies)
      .catch(() => setFailed(true));
  }, [health.transfer, companies]);

  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        <TextField
          id="lq-height"
          label="Boy (cm)"
          value={health.height}
          error={errors.height}
          onValue={(value) => {
            patch("health", { height: digits(value, 3) });
            clear("height");
          }}
          inputMode="numeric"
          placeholder="Örn. 175"
          autoFocus
        />
        <TextField
          id="lq-weight"
          label="Kilo (kg)"
          value={health.weight}
          error={errors.weight}
          onValue={(value) => {
            patch("health", { weight: digits(value, 3) });
            clear("weight");
          }}
          inputMode="numeric"
          placeholder="Örn. 70"
        />
      </div>

      <Chips
        legend="Poliçe durumu"
        name="transfer"
        value={health.transfer ? "transfer" : "new"}
        onChange={(value) => patch("health", { transfer: value === "transfer" })}
        options={[
          { value: "new", label: "Yeni poliçe" },
          { value: "transfer", label: "Başka şirketten geçiş" },
        ]}
      />

      {health.transfer && (
        <div className="step-fade space-y-4 rounded-2xl border border-ink/10 bg-pearl p-4 sm:p-5">
          <p className="text-[0.875rem] leading-relaxed text-ink-soft">Mevcut poliçenizin bilgileri, geçişte fiyatın doğru hesaplanması için gerekir.</p>
          <SelectField
            id="lq-company"
            label="Önceki sigorta şirketi"
            value={health.tCompany}
            error={errors.tCompany ?? (failed ? "Şirket listesi alınamadı, sayfayı yenileyin." : undefined)}
            disabled={!companies}
            placeholder={companies ? "Seçin" : "Yükleniyor…"}
            options={(companies ?? []).map((company) => ({ value: company.code, label: company.name }))}
            onValue={(tCompany) => {
              patch("health", { tCompany });
              clear("tCompany");
            }}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              id="lq-agency"
              label="Acente no"
              value={health.tAgency}
              error={errors.tAgency}
              onValue={(value) => {
                patch("health", { tAgency: value.slice(0, 20) });
                clear("tAgency");
              }}
            />
            <TextField
              id="lq-policy"
              label="Poliçe no"
              value={health.tPolicy}
              error={errors.tPolicy}
              onValue={(value) => {
                patch("health", { tPolicy: value.slice(0, 30) });
                clear("tPolicy");
              }}
            />
          </div>
          <TextField
            id="lq-end"
            label="Poliçe bitiş tarihi"
            value={health.tEnd}
            error={errors.tEnd}
            onValue={(value) => {
              patch("health", { tEnd: maskDate(value) });
              clear("tEnd");
            }}
            inputMode="numeric"
            placeholder="GG.AA.YYYY"
          />
        </div>
      )}
    </>
  );
}

export function AccidentCoverStep({ draft, patch }: StepProps) {
  const { accident } = draft;
  return (
    <>
      <Chips legend="Vefat teminatı" name="coverage" value={accident.coverage} onChange={(coverage) => patch("accident", { coverage })} options={COVERAGES} />
      <div className="space-y-3">
        <Toggle title="Tedavi teminatı" hint="Kaza sonrası tedavi masraflarını da kapsar" checked={accident.treatment} onChange={(treatment) => patch("accident", { treatment })} />
        <Toggle title="Deprem teminatı" hint="Deprem sonucu oluşan kazaları da kapsar" checked={accident.earthquake} onChange={(earthquake) => patch("accident", { earthquake })} />
        <Toggle title="7/24 yardım" hint="Kaza anında yardım ve yönlendirme hizmeti" checked={accident.assistance} onChange={(assistance) => patch("accident", { assistance })} />
      </div>
      <Chips legend="Ödeme şekli" name="payment" value={accident.payment} onChange={(payment) => patch("accident", { payment })} options={ACCIDENT_PAYMENTS} />
    </>
  );
}
