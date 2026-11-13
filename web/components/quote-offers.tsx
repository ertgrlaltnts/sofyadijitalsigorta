"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { CONTACT } from "@/lib/content";
import { currencySymbol, fetchPaymentConfig, fetchQuoteResults, formatAmount, formatPremium, isSafeForCards, logoOf, type Offer, type PaymentConfig, type QuoteResults } from "@/lib/quote-api";
import { QuoteCheckout } from "./quote-checkout";
import { QuoteProgress } from "./quote-progress";
import { ChevronDownIcon, LockIcon, StarIcon, WhatsAppIcon } from "./icons";

const POLL_MS = 4000;
/** Consecutive failed polls before we stop and offer a retry. */
const MAX_FAILURES = 4;

type Props = {
  quoteId: string;
  serviceName: string;
  shortName: string;
  /** ID number typed in the quote form; offered as the card holder's at checkout. */
  holderTckn: string;
  /** The chat's version: no outer padding, the chat card provides it. */
  compact?: boolean;
  onEdit: () => void;
};

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter((part) => part.length > 2)
    .slice(0, 2)
    .map((part) => part[0])
    .join("");

function whatsappHref(offer: Offer, quoteId: string, serviceName: string) {
  const reference = quoteId.slice(-6).toUpperCase();
  const message = `Merhaba, ${serviceName} için ${offer.company} teklifini (${formatPremium(offer.premium, offer.currency)}) değerlendirmek istiyorum. Teklif no: ${reference}`;
  return `${CONTACT.whatsappUrl}?text=${encodeURIComponent(message)}`;
}

function CompanyMark({ offer }: { offer: Offer }) {
  const logo = logoOf(offer.companyCode);
  return (
    <span className="grid h-11 w-14 shrink-0 place-items-center overflow-hidden rounded-xl border border-ink/10 bg-white px-2 sm:h-14 sm:w-24">
      {logo ? (
        <Image src={logo} alt="" width={150} height={75} className="h-full w-full object-contain" />
      ) : (
        <span className="font-display text-xl text-ink-soft" aria-hidden>
          {initials(offer.company)}
        </span>
      )}
    </span>
  );
}

function OfferCard({
  offer,
  best,
  quoteId,
  serviceName,
  index,
  onSelect,
}: {
  offer: Offer;
  best: boolean;
  quoteId: string;
  serviceName: string;
  index: number;
  /** Present when card payment is on: the button opens checkout instead of WhatsApp. */
  onSelect?: (offer: Offer) => void;
}) {
  const [open, setOpen] = useState(false);
  const panelId = `offer-${offer.id}-details`;

  return (
    <li
      className={`offer-in relative rounded-2xl border bg-white p-4 transition-shadow sm:p-5 ${
        best ? "border-gold shadow-[0_18px_40px_-24px_rgba(200,150,60,0.7)] ring-1 ring-gold/60" : "border-ink/10 hover:shadow-[0_14px_30px_-22px_rgba(15,26,48,0.45)]"
      }`}
      style={{ animationDelay: `${Math.min(index, 6) * 60}ms` }}
    >
      {best && (
        <span className="absolute -top-3 left-4 inline-flex items-center gap-1.5 rounded-full bg-gold px-3 py-1 text-[0.75rem] font-bold tracking-wide text-night uppercase">
          <StarIcon className="size-3.5" fill="currentColor" strokeWidth={0} />
          En uygun fiyat
        </span>
      )}

      <div className="flex items-center gap-3 sm:gap-4">
        <CompanyMark offer={offer} />
        <div className="min-w-0 flex-1">
          <p className="font-semibold leading-tight text-ink">{offer.company}</p>
          {offer.installment && (
            <p className="mt-1.5 inline-flex rounded-full bg-pearl px-2.5 py-0.5 text-[0.75rem] font-medium whitespace-nowrap text-ink-soft">{offer.installment}</p>
          )}
        </div>
        <div className="shrink-0 text-right">
          <p className="font-display text-[1.625rem] leading-none text-ink sm:text-[2rem]">
            {formatAmount(offer.premium)}
            <span className="ml-1 font-sans text-[0.55em] font-semibold text-ink-soft">{currencySymbol(offer.currency)}</span>
          </p>
          <p className="mt-1 text-[0.75rem] text-ink-soft">toplam prim</p>
        </div>
      </div>

      {offer.coverages.length > 0 && (
        <p className="mt-3.5 text-[0.8125rem] leading-relaxed text-ink-soft">
          {offer.coverages
            .slice(0, 3)
            .map((item) => `${item.name}: ${item.value}`)
            .join(" · ")}
        </p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {onSelect ? (
          <button
            type="button"
            onClick={() => onSelect(offer)}
            className={`inline-flex h-11 items-center gap-2 rounded-full px-5 text-[0.9375rem] font-semibold transition-colors ${
            best ? "bg-gold text-night hover:bg-gold-hi" : "bg-ink text-white hover:bg-ink-soft"
          }`}
          >
            <LockIcon className="size-[1.125rem]" />
            Bu teklifle devam et
          </button>
        ) : (
          <a
            href={whatsappHref(offer, quoteId, serviceName)}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex h-11 items-center gap-2 rounded-full px-5 text-[0.9375rem] font-semibold transition-colors ${
              best ? "bg-gold text-night hover:bg-gold-hi" : "bg-ink text-white hover:bg-ink-soft"
            }`}
          >
            <WhatsAppIcon className="size-[1.125rem]" />
            Bu teklifle devam et
          </a>
        )}
        {offer.coverages.length > 0 && (
          <button
            type="button"
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen((value) => !value)}
            className="inline-flex h-11 items-center gap-1.5 rounded-full px-4 text-[0.9375rem] font-medium text-ink-soft transition-colors hover:bg-pearl hover:text-ink"
          >
            Teminatlar
            <ChevronDownIcon className={`size-4 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
          </button>
        )}
      </div>

      {open && (
        <dl id={panelId} className="step-fade mt-4 grid gap-x-6 gap-y-2.5 border-t border-ink/10 pt-4 sm:grid-cols-2">
          {offer.coverages.map((item) => (
            <div key={item.name} className="flex items-baseline justify-between gap-3 text-[0.875rem]">
              <dt className="text-ink-soft">{item.name}</dt>
              <dd className="text-right font-medium text-ink">{item.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </li>
  );
}

function Skeleton() {
  return (
    <li aria-hidden className="rounded-2xl border border-ink/10 bg-white p-5">
      <div className="flex items-center gap-4">
        <span className="skeleton h-14 w-24 rounded-xl" />
        <span className="flex-1 space-y-2">
          <span className="skeleton block h-4 w-2/5 rounded" />
          <span className="skeleton block h-3 w-1/4 rounded" />
        </span>
        <span className="skeleton h-8 w-24 rounded" />
      </div>
    </li>
  );
}

/** Polls the quote until every insurer has answered, listing prices as they arrive, cheapest first. */
export function QuoteOffers({ quoteId, serviceName, shortName, holderTckn, compact = false, onEdit }: Props) {
  const [results, setResults] = useState<QuoteResults | null>(null);
  const [stalled, setStalled] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [payment, setPayment] = useState<PaymentConfig | null>(null);
  const [selected, setSelected] = useState<Offer | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetchPaymentConfig(controller.signal)
      .then((config) => setPayment(isSafeForCards() ? config : { ...config, enabled: false }))
      .catch(() => undefined);
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout> | undefined;
    let failures = 0;

    const poll = async () => {
      try {
        const next = await fetchQuoteResults(quoteId, controller.signal);
        failures = 0;
        setResults(next);
        if (next.status === "done") return;
      } catch {
        if (controller.signal.aborted) return;
        if (++failures >= MAX_FAILURES) {
          setStalled(true);
          return;
        }
      }
      timer = setTimeout(poll, POLL_MS);
    };

    void poll();
    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [quoteId, attempt]);

  const retry = () => {
    setStalled(false);
    setAttempt((value) => value + 1);
  };

  if (selected && payment?.enabled) {
    return (
      <QuoteCheckout
        quoteId={quoteId}
        offer={selected}
        serviceName={serviceName}
        defaultTckn={holderTckn}
        compact={compact}
        threeDSecure={payment.threeDSecure}
        onBack={() => setSelected(null)}
      />
    );
  }

  const offers = results?.offers ?? [];
  // Prices in different currencies cannot be compared: the API lists them grouped, and "best" only means something inside one group.
  const mixedCurrencies = new Set(offers.map((offer) => offer.currency)).size > 1;
  const bestIndex = offers.length > 1 && offers[1].currency === offers[0].currency ? 0 : -1;
  const done = results?.status === "done";
  const total = results?.progress.total ?? 0;
  const completed = results?.progress.completed ?? 0;
  const running = !done && !stalled;
  const titleClass = `font-display leading-tight ${compact ? "text-[1.375rem]" : "text-[1.875rem]"}`;

  return (
    <div className={compact ? "on-light text-ink" : "on-light relative bg-white p-6 text-ink sm:p-8 lg:p-12"}>
      {running ? (
        <>
          <h3 className={titleClass}>Teklifleriniz hazırlanıyor</h3>
          <div className="mt-4">
            <QuoteProgress phase="collecting" completed={completed} total={total} />
          </div>
        </>
      ) : (
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className={titleClass}>
              {done ? (offers.length > 0 ? `${offers.length} teklif hazır` : "Teklif bulunamadı") : "Teklifler alınamadı"}
            </h3>
            <p className="mt-1 text-[0.9375rem] text-ink-soft" role="status" aria-live="polite">
              {done
                ? offers.length > 0
                  ? mixedCurrencies
                    ? "Teklifler farklı para birimlerinde geldi."
                    : `${shortName} için en düşük fiyat ${formatPremium(offers[0].premium, offers[0].currency)}.`
                  : "Şu an hiçbir şirketten online fiyat alınamadı."
                : "Bağlantı sorunu yaşandı."}
            </p>
          </div>
        </div>
      )}

      {stalled && (
        <div role="alert" className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5">
          <p className="font-semibold text-red-900">Teklifler şu an alınamıyor.</p>
          <p className="mt-1 text-[0.9375rem] text-red-800">Bağlantı kesildi. Aldığımız teklifler korunuyor, tekrar deneyebilirsiniz.</p>
          <button
            type="button"
            onClick={retry}
            className="mt-4 h-11 rounded-full bg-ink px-5 text-[0.9375rem] font-semibold text-white transition-colors hover:bg-ink-soft"
          >
            Tekrar dene
          </button>
        </div>
      )}

      {(offers.length > 0 || (!done && !stalled)) && (
        <ul className="mt-7 space-y-5">
          {offers.map((offer, index) => (
            <OfferCard key={offer.id} offer={offer} best={index === bestIndex} quoteId={quoteId} serviceName={serviceName} index={index} onSelect={payment?.enabled ? setSelected : undefined} />
          ))}
          {!done && offers.length < 2 && Array.from({ length: 2 - offers.length }, (_, i) => <Skeleton key={i} />)}
        </ul>
      )}

      {done && offers.length === 0 && (
        <div className="step-fade mt-7 rounded-2xl border border-ink/10 bg-pearl p-6">
          <p className="font-semibold">Danışmanımız sizin için teklif hazırlasın</p>
          <p className="mt-1.5 leading-relaxed text-ink-soft">
            Sigorta şirketlerinin sistemleri bu sorguya anlık yanıt vermedi. Bilgilerinizi bir kez daha almadan, danışmanımız şirketlerden elle teklif alıp size dönebilir.
          </p>
          <a
            href={`${CONTACT.whatsappUrl}?text=${encodeURIComponent(`Merhaba, ${serviceName} için online teklif alamadım. Yardımcı olur musunuz? Teklif no: ${quoteId.slice(-6).toUpperCase()}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex h-12 items-center gap-2 rounded-full bg-gold px-6 text-[0.9375rem] font-semibold text-night transition-colors hover:bg-gold-hi"
          >
            <WhatsAppIcon className="size-[1.125rem]" />
            Danışmanla yazış
          </a>
        </div>
      )}

      {done && (
        <p className="mt-6 text-[0.8125rem] leading-relaxed text-ink-soft">
          {mixedCurrencies && "Farklı para birimlerindeki fiyatlar birbiriyle doğrudan karşılaştırılamaz. "}
          Fiyatlar anlık sorgulanır ve değişebilir. Teminat kapsamı, limitler ve muafiyetler şirkete göre farklıdır; satın almadan önce poliçe şartlarını okuyun.
        </p>
      )}

      <button
        type="button"
        onClick={onEdit}
        className="mt-5 text-[0.9375rem] font-medium text-gold-ink underline decoration-gold/60 underline-offset-4"
      >
        Bilgileri düzenle ve yeniden sorgula
      </button>
    </div>
  );
}
