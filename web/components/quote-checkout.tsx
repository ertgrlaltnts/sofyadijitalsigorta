"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { CONTACT } from "@/lib/content";
import {
  currencySymbol,
  fetchDocumentUrl,
  fetchPurchaseStatus,
  formatAmount,
  logoOf,
  purchaseOffer,
  QuoteError,
  type Offer,
  type PurchaseRequest,
  type PurchaseResult,
} from "@/lib/quote-api";
import { isValidCardNumber, isValidTckn, maskCardNumber, maskExpiry, parseExpiry } from "@/lib/quote-validation";
import { ArrowRightIcon, CheckIcon, LockIcon, ShieldIcon, WhatsAppIcon } from "./icons";

const BANK_WINDOW = "sofya-3d-secure";
const POLL_MS = 2000;
/** About five minutes of waiting for the customer to finish at the bank. */
const MAX_POLLS = 150;

type Phase = "form" | "processing" | "bank" | "issued" | "unknown";
type FieldKey = "holder" | "number" | "expiry" | "cvv" | "tckn" | "consent";

const inputClass =
  "h-12 w-full rounded-xl border bg-white px-4 text-[1rem] text-ink outline-none transition-[border-color,box-shadow] placeholder:text-ink-soft/55 focus:border-gold focus:shadow-[0_0_0_4px_rgba(226,184,106,0.22)]";
const labelClass = "mb-1.5 block text-[0.8125rem] font-semibold text-ink";

/** "a=1&b=2" to [["a","1"],["b","2"]]: the bank's form fields come as one string. */
const parseFields = (value: string): [string, string][] =>
  value
    .split("&")
    .map((pair) => [pair.slice(0, pair.indexOf("=")), pair.slice(pair.indexOf("=") + 1)] as [string, string])
    .filter(([name]) => name.length > 0);

function openBankWindow(): Window | null {
  const width = 500;
  const height = 650;
  const left = Math.max(0, window.screen.width / 2 - width / 2);
  const top = Math.max(0, window.screen.height / 2 - height / 2);
  return window.open("", BANK_WINDOW, `width=${width},height=${height},top=${top},left=${left},resizable=1,scrollbars=1`);
}

function postToBank(url: string, value: string) {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = url;
  form.target = BANK_WINDOW;
  form.acceptCharset = "UTF-8";
  form.style.display = "none";
  for (const [name, fieldValue] of parseFields(value)) {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = fieldValue;
    form.appendChild(input);
  }
  document.body.appendChild(form);
  form.submit();
  form.remove();
}

function CardPreview({ number, holder, expiry }: { number: string; holder: string; expiry: string }) {
  const placeholder = "•••• •••• •••• ••••";
  return (
    <div
      aria-hidden
      className="relative mx-auto aspect-[1.586] w-full max-w-[22rem] overflow-hidden rounded-2xl bg-gradient-to-br from-navy-2 via-navy to-night p-5 text-white shadow-[0_30px_50px_-28px_rgba(11,19,34,0.9)] sm:p-6"
    >
      <div className="pointer-events-none absolute -top-16 -right-10 size-48 rounded-full bg-gold/25 blur-3xl" />
      <div className="relative flex items-start justify-between">
        <span className="h-9 w-12 rounded-md bg-gradient-to-br from-gold-hi to-gold-deep shadow-inner" />
        <ShieldIcon className="size-6 text-gold" />
      </div>
      <p className="relative mt-8 font-mono text-[1.0625rem] tracking-[0.12em] sm:text-[1.25rem]">{number + placeholder.slice(number.length)}</p>
      <div className="relative mt-5 flex items-end justify-between gap-3 text-[0.75rem] tracking-wide uppercase">
        <span className="min-w-0 flex-1 truncate">
          <span className="block text-[0.625rem] text-white/50">Kart sahibi</span>
          {holder || "Ad Soyad"}
        </span>
        <span>
          <span className="block text-[0.625rem] text-white/50">SKT</span>
          {expiry || "AA/YY"}
        </span>
      </div>
    </div>
  );
}

type Props = {
  quoteId: string;
  offer: Offer;
  serviceName: string;
  /** ID number typed in the quote form, offered as the card holder's. */
  defaultTckn: string;
  /** Whether the bank's 3D Secure window must be opened for this account. */
  threeDSecure: boolean;
  /** The chat's version: no outer padding, the chat card provides it. */
  compact?: boolean;
  onBack: () => void;
};

/**
 * Card payment for the chosen offer. The amount is never sent from here: the server pays the insurer's own price for the offer id.
 * Card details live in this component's memory only, and are dropped as soon as the payment is finished.
 */
export function QuoteCheckout({ quoteId, offer, serviceName, defaultTckn, threeDSecure, compact = false, onBack }: Props) {
  const [phase, setPhase] = useState<Phase>("form");
  const [form, setForm] = useState({ holder: "", number: "", expiry: "", cvv: "", tckn: defaultTckn, consent: false });
  const [errors, setErrors] = useState<Partial<Record<FieldKey, string>>>({});
  const [banner, setBanner] = useState("");
  const [callCenter, setCallCenter] = useState(false);
  const [policeNo, setPoliceNo] = useState("");
  const [unknownMessage, setUnknownMessage] = useState("");
  const [bankBlocked, setBankBlocked] = useState(false);
  const [docError, setDocError] = useState("");
  const [docBusy, setDocBusy] = useState<"policy" | "receipt" | null>(null);

  // Details of the payment in flight; kept in a ref (not state) so the 3D Secure repeat can resend them without re-rendering.
  const payload = useRef<PurchaseRequest | null>(null);
  const bankWindow = useRef<Window | null>(null);
  const bankData = useRef<{ url: string; value: string } | null>(null);
  const pollTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const alive = useRef(true);

  const closeBank = () => {
    clearTimeout(pollTimer.current);
    if (bankWindow.current && !bankWindow.current.closed) bankWindow.current.close();
    bankWindow.current = null;
    bankData.current = null;
    setBankBlocked(false);
  };

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
      clearTimeout(pollTimer.current);
      if (bankWindow.current && !bankWindow.current.closed) bankWindow.current.close();
    };
  }, []);

  const finish = (result: PurchaseResult) => {
    if (!alive.current) return;
    if (result.status === "issued") {
      closeBank();
      payload.current = null;
      setForm({ holder: "", number: "", expiry: "", cvv: "", tckn: "", consent: false });
      setPoliceNo(result.policeNo);
      setPhase("issued");
    } else if (result.status === "threeds") {
      startBank(result.url, result.value);
    } else if (result.status === "declined") {
      closeBank();
      setBanner(result.message);
      setCallCenter(result.callCenter);
      setPhase("form");
    } else {
      closeBank();
      payload.current = null;
      setForm({ holder: "", number: "", expiry: "", cvv: "", tckn: "", consent: false });
      setUnknownMessage(result.message);
      setPhase("unknown");
    }
  };

  const fail = (error: unknown) => {
    if (!alive.current) return;
    closeBank();
    setBanner(error instanceof QuoteError ? error.message : "Ödeme sırasında bir sorun oluştu. Lütfen tekrar deneyin.");
    setPhase("form");
  };

  const send = async (approved: boolean) => {
    if (!payload.current) return;
    try {
      finish(await purchaseOffer(quoteId, { ...payload.current, ...(approved ? { threeDSecureApproved: true } : {}) }));
    } catch (error) {
      fail(error);
    }
  };

  const startBank = (url: string, value: string) => {
    bankData.current = { url, value };
    setPhase("bank");
    if (!bankWindow.current || bankWindow.current.closed) bankWindow.current = openBankWindow();
    if (!bankWindow.current) {
      setBankBlocked(true);
    } else {
      setBankBlocked(false);
      postToBank(url, value);
      bankWindow.current.focus();
    }
    poll(0, 0);
  };

  const reopenBank = () => {
    if (!bankData.current) return;
    bankWindow.current = openBankWindow();
    if (!bankWindow.current) return;
    setBankBlocked(false);
    postToBank(bankData.current.url, bankData.current.value);
  };

  /** Asks whether the bank approved. Polls faster once the bank window has been closed, and gives up after a while. */
  const poll = (attempt: number, closedPolls: number) => {
    pollTimer.current = setTimeout(
      async () => {
        if (!alive.current) return;
        const windowClosed = !!bankWindow.current?.closed;
        try {
          const status = await fetchPurchaseStatus(quoteId);
          if (!alive.current) return;
          if (status.state === "approved") {
            closeBank();
            setPhase("processing");
            await send(true);
            return;
          }
          if (status.state === "issued") {
            finish({ status: "issued", policeNo: status.policeNo });
            return;
          }
          if (status.state === "failed") {
            closeBank();
            setBanner(status.message);
            setCallCenter(status.callCenter);
            setPhase("form");
            return;
          }
        } catch {
          // a missed answer is not a refusal: keep asking
        }
        const closedCount = windowClosed ? closedPolls + 1 : closedPolls;
        if (attempt + 1 >= MAX_POLLS || closedCount >= 30) {
          closeBank();
          setBanner("Banka doğrulaması tamamlanmadı. Dilerseniz kartınızla yeniden deneyebilirsiniz.");
          setPhase("form");
          return;
        }
        poll(attempt + 1, closedCount);
      },
      closedPolls > 0 ? 1000 : POLL_MS,
    );
  };

  const validate = () => {
    const found: Partial<Record<FieldKey, string>> = {};
    if (!/^[\p{L} .'-]{6,60}$/u.test(form.holder.trim())) found.holder = "Kart üzerindeki ad soyadı yazın.";
    if (!isValidCardNumber(form.number)) found.number = "Geçerli bir kart numarası yazın.";
    if (!parseExpiry(form.expiry)) found.expiry = "Son kullanma tarihini AA/YY yazın.";
    if (!/^\d{3,4}$/.test(form.cvv)) found.cvv = "Güvenlik kodunu yazın.";
    if (!isValidTckn(form.tckn)) found.tckn = "Kart sahibinin T.C. kimlik numarasını yazın.";
    if (!form.consent) found.consent = "Devam etmek için onay vermelisiniz.";
    return found;
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (phase !== "form") return;
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    const expiry = parseExpiry(form.expiry);
    if (!expiry) return;
    setBanner("");
    setCallCenter(false);
    payload.current = {
      offerId: offer.id,
      cardHolder: form.holder.trim(),
      cardNumber: form.number.replace(/\D/g, ""),
      expiryMonth: expiry.month,
      expiryYear: expiry.year,
      cvv: form.cvv,
      holderTckn: form.tckn,
      consent: true,
    };
    // The bank window must be opened inside the click, before any await, or the browser blocks it.
    if (threeDSecure) bankWindow.current = openBankWindow();
    setPhase("processing");
    void send(false);
  };

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
    if (key in errors) setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const openDocument = async (kind: "policy" | "receipt") => {
    setDocError("");
    setDocBusy(kind);
    const target = window.open("", "_blank");
    try {
      const { url } = await fetchDocumentUrl(quoteId, kind);
      if (target) {
        target.opener = null;
        target.location.href = url;
      } else {
        window.location.assign(url);
      }
    } catch (error) {
      target?.close();
      setDocError(error instanceof QuoteError ? error.message : "Belge şu an alınamadı. Lütfen biraz sonra tekrar deneyin.");
    } finally {
      setDocBusy(null);
    }
  };

  const logo = logoOf(offer.companyCode);
  const reference = quoteId.slice(-6).toUpperCase();
  const advisorHref = `${CONTACT.whatsappUrl}?text=${encodeURIComponent(`Merhaba, ${serviceName} için ${offer.company} teklifinin ödemesini tamamlamak istiyorum. Teklif no: ${reference}`)}`;
  const busy = phase === "processing" || phase === "bank";

  return (
    <div className={compact ? "on-light text-ink" : "on-light relative bg-white p-6 text-ink sm:p-8 lg:p-12"}>
      {phase === "issued" ? (
        <div className="step-next py-2 text-center" role="status">
          <span className="mx-auto grid size-16 place-items-center rounded-full bg-gold/20 text-gold-deep ring-1 ring-gold/50">
            <CheckIcon className="size-8" strokeWidth={2.2} />
          </span>
          <h3 className="mt-5 font-display text-[1.875rem] leading-tight">Poliçeniz oluşturuldu</h3>
          <p className="mx-auto mt-3 max-w-sm leading-relaxed text-ink-soft">
            {offer.company} {serviceName.toLowerCase()} poliçeniz için ödemeniz alındı.
          </p>
          <dl className="mx-auto mt-6 grid max-w-sm gap-2 rounded-2xl bg-pearl p-5 text-left text-[0.9375rem]">
            <div className="flex justify-between gap-4">
              <dt className="text-ink-soft">Sigorta şirketi</dt>
              <dd className="font-semibold">{offer.company}</dd>
            </div>
            {policeNo && (
              <div className="flex justify-between gap-4">
                <dt className="text-ink-soft">Poliçe no</dt>
                <dd className="font-semibold">{policeNo}</dd>
              </div>
            )}
            <div className="flex justify-between gap-4">
              <dt className="text-ink-soft">Ödenen tutar</dt>
              <dd className="font-semibold">
                {formatAmount(offer.premium)} {currencySymbol(offer.currency)}
              </dd>
            </div>
          </dl>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              disabled={docBusy !== null}
              onClick={() => void openDocument("policy")}
              className="inline-flex h-12 items-center rounded-full bg-gold px-6 text-[0.9375rem] font-semibold text-night transition-colors hover:bg-gold-hi disabled:opacity-70"
            >
              {docBusy === "policy" ? "Hazırlanıyor…" : "Poliçeyi indir"}
            </button>
            <button
              type="button"
              disabled={docBusy !== null}
              onClick={() => void openDocument("receipt")}
              className="inline-flex h-12 items-center rounded-full border border-ink/20 px-6 text-[0.9375rem] font-medium transition-colors hover:border-ink hover:bg-ink hover:text-white disabled:opacity-70"
            >
              {docBusy === "receipt" ? "Hazırlanıyor…" : "Makbuzu indir"}
            </button>
          </div>
          {docError && (
            <p role="alert" className="mx-auto mt-4 max-w-sm text-[0.875rem] text-red-700">
              {docError}
            </p>
          )}
        </div>
      ) : phase === "unknown" ? (
        <div className="step-next py-2" role="alert">
          <span className="grid size-14 place-items-center rounded-full bg-gold/20 text-gold-deep ring-1 ring-gold/50">
            <ShieldIcon className="size-7" />
          </span>
          <h3 className="mt-5 font-display text-[1.875rem] leading-tight">Ödeme sonucunu doğruluyoruz</h3>
          <p className="mt-3 max-w-md leading-relaxed text-ink-soft">{unknownMessage}</p>
          <p className="mt-2 text-[0.875rem] text-ink-soft">Teklif no: {reference}</p>
          <a
            href={advisorHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex h-12 items-center gap-2 rounded-full bg-gold px-6 text-[0.9375rem] font-semibold text-night transition-colors hover:bg-gold-hi"
          >
            <WhatsAppIcon className="size-[1.125rem]" />
            Danışmanla yazış
          </a>
        </div>
      ) : (
        <form onSubmit={onSubmit} noValidate autoComplete="on">
          <h3 className="font-display text-[1.875rem] leading-tight">Ödeme</h3>

          <div className="mt-4 flex items-center gap-4 rounded-2xl border border-ink/10 bg-pearl p-4">
            <span className="grid h-11 w-16 shrink-0 place-items-center overflow-hidden rounded-lg border border-ink/10 bg-white px-2">
              {logo ? <Image src={logo} alt="" width={120} height={60} className="h-full w-full object-contain" /> : <ShieldIcon className="size-5 text-ink-soft" />}
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-semibold leading-tight">{offer.company}</p>
              {offer.installment && <p className="mt-0.5 text-[0.8125rem] text-ink-soft">{offer.installment}</p>}
            </div>
            <p className="text-right font-display text-[1.5rem] leading-none">
              {formatAmount(offer.premium)}
              <span className="ml-1 font-sans text-[0.55em] font-semibold text-ink-soft">{currencySymbol(offer.currency)}</span>
            </p>
          </div>

          <div className="mt-6">
            <CardPreview number={form.number} holder={form.holder} expiry={form.expiry} />
          </div>

          <fieldset disabled={busy} className="mt-6 space-y-4">
            <div>
              <label htmlFor="co-holder" className={labelClass}>
                Kart üzerindeki ad soyad
              </label>
              <input
                id="co-holder"
                value={form.holder}
                onChange={(event) => set("holder", event.target.value.slice(0, 60))}
                autoComplete="cc-name"
                aria-invalid={!!errors.holder}
                className={`${inputClass} ${errors.holder ? "border-red-500/70" : "border-ink/15"} uppercase`}
              />
              {errors.holder && <p role="alert" className="mt-1.5 text-[0.8125rem] text-red-600">{errors.holder}</p>}
            </div>
            <div>
              <label htmlFor="co-number" className={labelClass}>
                Kart numarası
              </label>
              <input
                id="co-number"
                value={form.number}
                onChange={(event) => set("number", maskCardNumber(event.target.value))}
                inputMode="numeric"
                autoComplete="cc-number"
                placeholder="0000 0000 0000 0000"
                aria-invalid={!!errors.number}
                className={`${inputClass} ${errors.number ? "border-red-500/70" : "border-ink/15"} font-mono tracking-wider`}
              />
              {errors.number && <p role="alert" className="mt-1.5 text-[0.8125rem] text-red-600">{errors.number}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="co-expiry" className={labelClass}>
                  Son kullanma (AA/YY)
                </label>
                <input
                  id="co-expiry"
                  value={form.expiry}
                  onChange={(event) => set("expiry", maskExpiry(event.target.value))}
                  inputMode="numeric"
                  autoComplete="cc-exp"
                  placeholder="AA/YY"
                  aria-invalid={!!errors.expiry}
                  className={`${inputClass} ${errors.expiry ? "border-red-500/70" : "border-ink/15"}`}
                />
                {errors.expiry && <p role="alert" className="mt-1.5 text-[0.8125rem] text-red-600">{errors.expiry}</p>}
              </div>
              <div>
                <label htmlFor="co-cvv" className={labelClass}>
                  Güvenlik kodu (CVV)
                </label>
                <input
                  id="co-cvv"
                  type="password"
                  value={form.cvv}
                  onChange={(event) => set("cvv", event.target.value.replace(/\D/g, "").slice(0, 4))}
                  inputMode="numeric"
                  autoComplete="cc-csc"
                  placeholder="•••"
                  aria-invalid={!!errors.cvv}
                  className={`${inputClass} ${errors.cvv ? "border-red-500/70" : "border-ink/15"}`}
                />
                {errors.cvv && <p role="alert" className="mt-1.5 text-[0.8125rem] text-red-600">{errors.cvv}</p>}
              </div>
            </div>
            <div>
              <label htmlFor="co-tckn" className={labelClass}>
                Kart sahibinin T.C. kimlik no
              </label>
              <input
                id="co-tckn"
                value={form.tckn}
                onChange={(event) => set("tckn", event.target.value.replace(/\D/g, "").slice(0, 11))}
                inputMode="numeric"
                autoComplete="off"
                aria-invalid={!!errors.tckn}
                className={`${inputClass} ${errors.tckn ? "border-red-500/70" : "border-ink/15"}`}
              />
              {errors.tckn && <p role="alert" className="mt-1.5 text-[0.8125rem] text-red-600">{errors.tckn}</p>}
            </div>
            <div>
              <label className="flex cursor-pointer items-start gap-3 text-[0.875rem] leading-relaxed text-ink-soft">
                <input
                  type="checkbox"
                  checked={form.consent}
                  onChange={(event) => set("consent", event.target.checked)}
                  className="mt-1 size-4 shrink-0 accent-[#c8963c]"
                />
                <span>
                  <a href={CONTACT.insuranceInfoUrl} target="_blank" rel="noopener" className="font-medium text-ink underline underline-offset-2">
                    Sigorta ön bilgilendirmesini ve poliçe genel şartlarını
                  </a>{" "}
                  okudum; bu poliçenin satın alınmasını ve kartımdan çekim yapılmasını onaylıyorum.
                </span>
              </label>
              {errors.consent && <p role="alert" className="mt-1.5 text-[0.8125rem] text-red-600">{errors.consent}</p>}
            </div>
          </fieldset>

          {banner && (
            <div role="alert" className="step-fade mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[0.9375rem] text-red-800">
              <p>{banner}</p>
              {callCenter && (
                <a href={CONTACT.phoneHref} className="mt-2 inline-block font-semibold underline underline-offset-2">
                  Müşteri hizmetlerini arayın: {CONTACT.phone}
                </a>
              )}
            </div>
          )}

          {phase === "bank" && (
            <div role="status" className="step-fade mt-5 rounded-xl border border-gold/50 bg-gold/10 px-4 py-3 text-[0.9375rem] text-ink">
              <p className="font-semibold">Bankanızın doğrulama penceresini tamamlayın</p>
              <p className="mt-1 text-ink-soft">İşlem bitince bu sayfa otomatik devam eder. Pencereyi kapatmayın.</p>
              {bankBlocked && (
                <button type="button" onClick={reopenBank} className="mt-3 h-10 rounded-full bg-ink px-5 text-[0.875rem] font-semibold text-white">
                  Doğrulama penceresini aç
                </button>
              )}
            </div>
          )}

          <div className="mt-6 flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                closeBank();
                onBack();
              }}
              disabled={phase === "processing"}
              className="h-12 shrink-0 rounded-full border border-ink/20 px-5 text-[0.9375rem] font-medium transition-colors hover:border-ink hover:bg-ink hover:text-white disabled:opacity-50"
            >
              Geri
            </button>
            <button
              type="submit"
              disabled={busy}
              className="group inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-gold px-6 text-[0.9375rem] font-semibold text-night transition-colors hover:bg-gold-hi disabled:cursor-wait disabled:opacity-80"
            >
              {busy ? (
                <>
                  <span aria-hidden className="size-4 animate-spin rounded-full border-2 border-night/30 border-t-night" />
                  {phase === "bank" ? "Banka onayı bekleniyor…" : "Ödeme alınıyor…"}
                </>
              ) : (
                <>
                  <LockIcon className="size-4" />
                  {formatAmount(offer.premium)} {currencySymbol(offer.currency)} öde
                  <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" strokeWidth={2.2} />
                </>
              )}
            </button>
          </div>

          <p className="mt-4 flex items-start justify-center gap-2 text-center text-[0.8125rem] leading-relaxed text-ink-soft">
            <LockIcon className="mt-0.5 size-3.5 shrink-0" />
            Kart bilgileriniz şifreli bağlantıyla iletilir ve saklanmaz.
          </p>
          <p className="mt-2 text-center text-[0.8125rem] text-ink-soft">
            Kartla ödemek istemiyor musunuz?{" "}
            <a href={advisorHref} target="_blank" rel="noopener noreferrer" className="font-medium text-gold-ink underline decoration-gold/60 underline-offset-4">
              Danışmanla tamamlayın
            </a>
          </p>
        </form>
      )}
    </div>
  );
}
