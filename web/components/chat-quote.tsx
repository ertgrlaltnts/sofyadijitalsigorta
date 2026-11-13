"use client";

import Image from "next/image";
import { useRef } from "react";
import { PRODUCT_ICON, PRODUCT_LABEL, PRODUCT_ORDER, PRODUCT_SERVICE, type LiveQuoteKey } from "@/lib/quote-products";
import { ArrowRightIcon, BoltIcon, CheckIcon } from "./icons";
import { QuoteFlow } from "./quote-flow";
import { QuoteScope } from "./quote-scope";

/** The line Sofya says after an answer about a product: the offer to look at its quotes. */
export const offerText = (product: LiveQuoteKey): string => `${PRODUCT_LABEL[product]} için anlaşmalı şirketlerden hızlıca teklif alabilirim. Tekliflere göz atmak ister misiniz?`;

/** The yes / no buttons under that offer. Once answered they give way to the answer, so the chat reads as a conversation. */
export function QuoteOfferActions({ answered, onAnswer }: { answered?: boolean; onAnswer: (yes: boolean) => void }) {
  if (answered) return null;
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => onAnswer(true)}
        className="inline-flex h-10 items-center gap-2 rounded-full bg-gold px-4 text-[0.875rem] font-semibold text-night transition-colors hover:bg-gold-hi"
      >
        <BoltIcon className="size-4" />
        Evet, teklifleri göster
      </button>
      <button
        type="button"
        onClick={() => onAnswer(false)}
        className="inline-flex h-10 items-center rounded-full border border-white/15 px-4 text-[0.875rem] font-medium text-pearl transition-colors hover:border-white/40"
      >
        Şimdilik hayır
      </button>
    </div>
  );
}

/** The product choices, shown when the user wants a quote but has not said for what. */
export function QuotePicker({ answered, onPick }: { answered?: boolean; onPick: (product: LiveQuoteKey) => void }) {
  if (answered) return null;
  return (
    <ul className="grid grid-cols-2 gap-2" aria-label="Sigorta türleri">
      {PRODUCT_ORDER.map((product) => (
        <li key={product}>
          <button
            type="button"
            onClick={() => onPick(product)}
            className="group flex h-11 w-full cursor-pointer items-center gap-2.5 rounded-xl bg-white/[0.05] pr-3 pl-2.5 text-left text-[0.8125rem] leading-tight font-medium text-pearl ring-1 ring-white/10 transition-[background-color,box-shadow] duration-300 hover:bg-white/[0.09] hover:ring-gold/50"
          >
            <Image src={`/icons/${PRODUCT_ICON[product]}.png`} alt="" width={48} height={48} className="size-6 shrink-0 object-contain" />
            <span className="min-w-0 flex-1 truncate">{PRODUCT_LABEL[product]}</span>
            <ArrowRightIcon className="size-3.5 shrink-0 text-gold/50 transition-[translate,color] duration-300 group-hover:translate-x-0.5 group-hover:text-gold" />
          </button>
        </li>
      ))}
    </ul>
  );
}

/**
 * The quote form inside the chat: a light card with the product's questions one screen at a time, then the waiting screen, then
 * the offers. The answers go straight to the quote API (never through the chat or the model) and are not kept in the chat history.
 */
export function QuoteFlowCard({ product }: { product: LiveQuoteKey }) {
  const card = useRef<HTMLDivElement>(null);

  return (
    <div ref={card} className="w-full max-w-[36rem] scroll-mt-16">
      <div className="overflow-hidden rounded-[1.25rem] rounded-tl-md bg-white shadow-[0_18px_40px_-18px_rgba(0,0,0,0.7)] ring-1 ring-white/10">
        <div className="flex items-center gap-2 bg-gradient-to-r from-gold/30 via-gold/10 to-transparent px-4 py-2.5 text-ink sm:px-5">
          <BoltIcon className="size-4 text-gold-deep" />
          <span className="text-[0.75rem] font-bold tracking-wide uppercase">Hızlı teklif</span>
          <span className="ml-auto inline-flex items-center gap-1.5 text-[0.75rem] font-medium text-ink-soft">
            <CheckIcon className="size-3.5 text-gold-deep" strokeWidth={2.4} />
            {PRODUCT_LABEL[product]}
          </span>
        </div>
        <div className="p-4 sm:p-5">
          <QuoteScope.Provider value="chat-">
            <QuoteFlow
              product={product}
              shortName={PRODUCT_LABEL[product]}
              serviceName={PRODUCT_SERVICE[product]}
              compact
              note="Kimlik bilgileriniz sohbet geçmişine kaydedilmez; yalnızca teklif hazırlamak için sigorta şirketlerine iletilir."
              onStage={() => card.current?.scrollIntoView({ block: "start", behavior: "smooth" })}
            />
          </QuoteScope.Provider>
        </div>
      </div>
    </div>
  );
}
