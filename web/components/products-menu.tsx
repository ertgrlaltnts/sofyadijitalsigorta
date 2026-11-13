"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { PRODUCTS, QUOTE_ACTION } from "@/lib/content";
import { AppLink } from "./app-link";
import { AskButton } from "./ask-button";
import { ArrowRightIcon, ChevronDownIcon } from "./icons";

const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";

function ProductIcon({ slug, className }: { slug: string; className: string }) {
  return <Image src={`/icons/${slug}.png`} alt="" width={96} height={96} className={`${className} object-contain`} />;
}

/**
 * Desktop "Ürünlerimiz" item: the label still goes to /urunler, the chevron (or hover/focus) opens a panel with every
 * product and its icon. Closes on Escape, outside click and navigation.
 */
export function ProductsMenu({ label, href, active, tone }: { label: string; href: string; active: boolean; tone: string }) {
  const pathname = usePathname();
  // Open only for the page it was opened on, so navigating closes it without an effect.
  const [openAt, setOpenAt] = useState<string | null>(null);
  const open = openAt === pathname;
  const root = useRef<HTMLDivElement>(null);
  const timer = useRef(0);

  const show = () => {
    window.clearTimeout(timer.current);
    setOpenAt(pathname);
  };
  const hide = () => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOpenAt(null), 140);
  };

  useEffect(() => () => window.clearTimeout(timer.current), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpenAt(null);
      root.current?.querySelector("button")?.focus();
    };
    const onDown = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpenAt(null);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  return (
    <div
      ref={root}
      className="relative"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={(event) => {
        if (!root.current?.contains(event.relatedTarget as Node)) hide();
      }}
    >
      <div className={`flex items-center transition-colors ${tone}`}>
        <AppLink
          href={href}
          aria-current={active ? "page" : undefined}
          className="group relative rounded-full py-2 pr-1 pl-4 text-[0.9375rem]"
        >
          {label}
          <span
            className={`absolute right-1 -bottom-0.5 left-4 h-px origin-left bg-gold transition-transform duration-300 ${
              active || open ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
            }`}
          />
        </AppLink>
        <button
          type="button"
          aria-expanded={open}
          aria-controls="products-menu"
          aria-label="Ürünlerimiz menüsünü aç"
          onClick={() => (open ? setOpenAt(null) : show())}
          className="grid size-8 place-items-center rounded-full"
        >
          <ChevronDownIcon className={`size-4 transition-transform duration-300 ${EASE} ${open ? "rotate-180" : ""}`} />
        </button>
      </div>

      <div
        id="products-menu"
        className={`absolute top-full left-1/2 z-50 w-[46rem] origin-top -translate-x-1/2 pt-4 transition-[opacity,translate,scale,visibility] duration-300 ${EASE} ${
          open ? "visible translate-y-0 scale-100 opacity-100" : "invisible translate-y-2 scale-[0.98] opacity-0"
        }`}
        onClick={(event) => {
          if ((event.target as HTMLElement).closest("a,button")) setOpenAt(null);
        }}
      >
        <div className="on-light relative overflow-hidden rounded-[1.5rem] border border-ink/10 bg-white p-3 text-ink shadow-[0_44px_90px_-30px_rgba(15,26,48,0.5)]">
          <span aria-hidden className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-gold via-gold-hi to-gold" />
          <div className="grid grid-cols-[1fr_15rem] gap-3">
            <ul className="grid grid-cols-2 content-start gap-1">
              {PRODUCTS.map((product, i) => (
                <li
                  key={product.slug}
                  className={`transition-[opacity,translate] duration-500 ${EASE} ${open ? "translate-y-0 opacity-100" : "translate-y-1.5 opacity-0"}`}
                  style={{ transitionDelay: open ? `${80 + i * 35}ms` : "0ms" } as CSSProperties}
                >
                  <AppLink
                    href={`/urunler/${product.slug}`}
                    className="group flex items-center gap-3 rounded-2xl p-2.5 transition-colors duration-300 hover:bg-pearl"
                  >
                    <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-pearl transition-colors duration-300 group-hover:bg-white">
                      <ProductIcon slug={product.slug} className="size-10 transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-110" />
                    </span>
                    <span className="min-w-0 flex-1 text-[0.9375rem] leading-snug font-semibold">{product.name}</span>
                    <ArrowRightIcon className="size-4 shrink-0 -translate-x-1 text-gold-deep opacity-0 transition-[opacity,translate] duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
                  </AppLink>
                </li>
              ))}
              <li
                className={`col-span-2 mt-1 transition-[opacity,translate] duration-500 ${EASE} ${open ? "translate-y-0 opacity-100" : "translate-y-1.5 opacity-0"}`}
                style={{ transitionDelay: open ? `${80 + PRODUCTS.length * 35}ms` : "0ms" } as CSSProperties}
              >
                <a
                  href={QUOTE_ACTION.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 rounded-2xl border border-gold/50 bg-gold/10 p-2.5 transition-colors duration-300 hover:bg-gold/20"
                >
                  <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-white">
                    <ProductIcon slug={QUOTE_ACTION.slug} className="size-10 transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-110" />
                  </span>
                  <span className="flex-1 text-[0.9375rem] font-semibold">{QUOTE_ACTION.name}</span>
                  <ArrowRightIcon className="size-4 text-gold-deep transition-transform duration-300 group-hover:translate-x-1" />
                </a>
              </li>
            </ul>

            <aside className="relative flex flex-col overflow-hidden rounded-[1.1rem] bg-pearl p-5">
              <div aria-hidden className="pointer-events-none absolute -top-16 -right-16 size-48 rounded-full bg-gold/25 blur-3xl" />
              <span className="relative size-14 overflow-hidden rounded-full bg-white ring-2 ring-gold/60">
                <Image src="/sofya-avatar.png" alt="" fill sizes="56px" quality={90} className="object-cover" />
              </span>
              <p className="relative mt-4 font-display text-[1.5rem] leading-tight">Hangi sigorta size uygun?</p>
              <p className="relative mt-2 text-[0.875rem] leading-relaxed text-ink-soft">
                Birkaç cümleyle anlatın, Sofya doğru teminata yönlendirsin.
              </p>
              <AskButton className="relative mt-5 inline-flex h-10 items-center justify-center rounded-full bg-ink px-5 text-[0.875rem] font-semibold text-white transition-colors hover:bg-ink-soft">
                Sofya&apos;ya sorun
              </AskButton>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Mobile "Ürünlerimiz" row: the label links to /urunler, the round button unfolds the product list. */
export function MobileProducts({
  label,
  href,
  active,
  onNavigate,
  linkRef,
}: {
  label: string;
  href: string;
  active: boolean;
  onNavigate: () => void;
  linkRef?: React.Ref<HTMLAnchorElement>;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex items-center gap-3">
        <AppLink
          ref={linkRef}
          href={href}
          aria-current={active ? "page" : undefined}
          onClick={onNavigate}
          className={`flex flex-1 items-center gap-3 py-4 font-display text-[2.25rem] leading-[1.1] transition-colors sm:text-[2.75rem] ${
            active ? "text-gold" : "text-white hover:text-gold"
          }`}
        >
          {active && <span className="size-2 rounded-full bg-gold" />}
          {label}
        </AppLink>
        <button
          type="button"
          aria-expanded={open}
          aria-controls="mobile-products"
          aria-label="Ürünlerimiz listesini aç"
          onClick={() => setOpen((value) => !value)}
          className="grid size-11 shrink-0 place-items-center rounded-full border border-white/20 text-white transition-colors hover:border-gold hover:text-gold"
        >
          <ChevronDownIcon className={`size-5 transition-transform duration-300 ${EASE} ${open ? "rotate-180" : ""}`} />
        </button>
      </div>
      <div
        id="mobile-products"
        inert={!open}
        className={`grid transition-[grid-template-rows,opacity] duration-500 ${EASE} ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
      >
        <div className="overflow-hidden">
          <ul className="mb-4 grid grid-cols-1 gap-1 rounded-3xl border border-white/10 bg-white/[0.06] p-1.5 sm:grid-cols-2">
            {PRODUCTS.map((product) => (
              <li key={product.slug}>
                <AppLink
                  href={`/urunler/${product.slug}`}
                  onClick={onNavigate}
                  className="flex items-center gap-3 rounded-2xl p-2 text-[1rem] font-medium text-white transition-colors hover:bg-white/10"
                >
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-pearl">
                    <ProductIcon slug={product.slug} className="size-9" />
                  </span>
                  {product.name}
                </AppLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
