"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { CONTACT, NAV } from "@/lib/content";
import { AppLink } from "./app-link";
import { AskButton } from "./ask-button";
import { ArrowRightIcon, WhatsAppIcon } from "./icons";
import { MobileProducts, ProductsMenu } from "./products-menu";

function isActive(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  // The menu is open only for the page it was opened on, so navigating closes it without an effect.
  const [openAt, setOpenAt] = useState<string | null>(null);
  const open = openAt === pathname;
  const [scrolled, setScrolled] = useState(false);
  const [heroBehind, setHeroBehind] = useState(true);
  const firstLink = useRef<HTMLAnchorElement>(null);
  const burger = useRef<HTMLButtonElement>(null);

  // Every page opens with a dark band (#hero). While it is behind the header the header goes transparent with the light logo.
  const onHero = heroBehind && !open;
  // The open mobile menu is dark, so the logo and burger use their light variants.
  const lightMark = onHero || open;
  const toneFor = (active: boolean) =>
    onHero
      ? active
        ? "text-white"
        : "text-pearl/65 hover:text-white"
      : active
        ? "text-ink"
        : "text-ink-soft hover:text-ink";

  useEffect(() => {
    const update = () => {
      setScrolled(window.scrollY > 12);
      const hero = document.getElementById("hero");
      setHeroBehind(!!hero && hero.getBoundingClientRect().bottom > 72);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    document.documentElement.style.overflow = "hidden";
    document.documentElement.setAttribute("data-menu-open", "");
    const timer = window.setTimeout(() => firstLink.current?.focus(), 350);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenAt(null);
        burger.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      document.documentElement.removeAttribute("data-menu-open");
      window.clearTimeout(timer);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // The hairline is a shadow, not a border, so the header stays exactly 4rem tall and the hero can tuck under it.
  const surface = onHero
    ? scrolled
      ? "bg-night/80 shadow-[0_1px_0_0_rgba(255,255,255,0.08)] backdrop-blur-md"
      : "bg-transparent shadow-[0_1px_0_0_transparent]"
    : open
      ? "bg-transparent shadow-[0_1px_0_0_transparent]"
      : scrolled
      ? "bg-white/85 shadow-[0_1px_0_0_rgba(15,26,48,0.1)] backdrop-blur-md"
      : "bg-transparent shadow-[0_1px_0_0_transparent]";

  return (
    <>
      <header className={`site-header sticky top-0 z-[60] transition-[background-color,box-shadow] duration-300 ${surface}`}>
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-6 px-5 sm:px-8">
          <AppLink href="/" aria-label="Sofya Dijital Sigorta, ana sayfa" className="relative -ml-2 shrink-0">
            <Image src="/logo-dark.png" alt="Sofya Dijital Sigorta" width={500} height={250} priority className="h-14 w-auto" />
            <Image
              src="/logo.png"
              alt=""
              width={500}
              height={250}
              priority
              className={`absolute inset-0 h-14 w-auto transition-opacity duration-300 ${lightMark ? "opacity-100" : "opacity-0"}`}
            />
          </AppLink>

          <nav aria-label="Ana menü" className="hidden items-center gap-1 lg:flex">
            {NAV.map((item) => {
              const active = isActive(pathname, item.href);
              if (item.href === "/urunler") {
                return <ProductsMenu key={item.href} label={item.label} href={item.href} active={active} tone={toneFor(active)} />;
              }
              return (
                <AppLink
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`group relative rounded-full px-4 py-2 text-[0.9375rem] transition-colors ${toneFor(active)}`}
                >
                  {item.label}
                  <span
                    className={`absolute inset-x-4 -bottom-0.5 h-px origin-left bg-gold transition-transform duration-300 ${
                      active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </AppLink>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={CONTACT.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`hidden h-10 items-center gap-2 rounded-full border px-4 text-[0.875rem] font-medium transition-colors sm:inline-flex ${
                onHero
                  ? "border-gold/60 text-gold hover:bg-gold hover:text-night"
                  : "border-ink/20 text-ink hover:border-ink hover:bg-ink hover:text-white"
              }`}
            >
              <WhatsAppIcon className="size-4" />
              WhatsApp&apos;tan yazın
            </a>

            <button
              ref={burger}
              type="button"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
              onClick={() => setOpenAt(open ? null : pathname)}
              className={`relative grid size-11 place-items-center rounded-full border transition-colors lg:hidden ${
                lightMark ? "border-white/20 text-white hover:border-gold" : "border-ink/15 text-ink hover:border-gold-ink"
              }`}
            >
              <span className="relative block h-[1.125rem] w-6">
                <span className="burger-line burger-line-1 absolute top-0 left-0 h-0.5 w-6 rounded-full bg-current" />
                <span className="burger-line burger-line-2 absolute top-[0.4375rem] left-0 h-0.5 w-4 rounded-full bg-current" />
                <span className="burger-line burger-line-3 absolute top-[0.875rem] left-0 h-0.5 w-5 rounded-full bg-current" />
              </span>
            </button>
          </div>
        </div>
      </header>

      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menü"
        data-open={open}
        inert={!open}
        className="menu-panel fixed inset-0 z-[55] overflow-y-auto bg-night text-pearl lg:hidden"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(30rem_26rem_at_100%_0%,rgba(226,184,106,0.2),transparent_70%),radial-gradient(34rem_30rem_at_0%_100%,rgba(52,84,150,0.35),transparent_70%)]"
        />

        <div className="relative z-10 flex min-h-full flex-col px-6 pt-24 pb-6 sm:px-10">
          <nav aria-label="Mobil menü">
            <ul className="border-t border-white/10">
              {NAV.map((item, index) => {
                const active = isActive(pathname, item.href);
                const isProducts = item.href === "/urunler";
                return (
                  <li key={item.href} className="menu-item border-b border-white/10" style={{ "--i": index } as CSSProperties}>
                    {isProducts ? (
                      <MobileProducts
                        label={item.label}
                        href={item.href}
                        active={active}
                        onNavigate={() => setOpenAt(null)}
                        linkRef={index === 0 ? firstLink : undefined}
                      />
                    ) : (
                      <AppLink
                        ref={index === 0 ? firstLink : undefined}
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        onClick={() => setOpenAt(null)}
                        className={`group flex items-center gap-3 py-4 font-display text-[2.25rem] leading-[1.1] transition-colors sm:text-[2.75rem] ${
                          active ? "text-gold" : "text-white hover:text-gold"
                        }`}
                      >
                        {active && <span className="size-2 rounded-full bg-gold" />}
                        <span className="flex-1">{item.label}</span>
                        <ArrowRightIcon className="size-5 text-white/30 transition-[translate,color] duration-300 group-hover:translate-x-1 group-hover:text-gold" />
                      </AppLink>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="menu-item mt-auto pt-10" style={{ "--i": 5 } as CSSProperties}>
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur-sm">
              <div aria-hidden className="pointer-events-none absolute -top-12 -right-12 size-40 rounded-full bg-gold/20 blur-3xl" />
              <div className="relative flex items-center gap-4">
                <span className="relative size-14 shrink-0 overflow-hidden rounded-full bg-white ring-2 ring-gold/70">
                  <Image src="/sofya-avatar.png" alt="" fill sizes="56px" quality={90} className="object-cover" />
                </span>
                <div className="min-w-0">
                  <p className="font-display text-[1.375rem] leading-tight text-white">Sofya size yardımcı olsun</p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-[0.8125rem] text-pearl/65">
                    <span className="size-1.5 rounded-full bg-online" />
                    Çevrimiçi, hemen yanıtlar
                  </p>
                </div>
              </div>
              <div className="relative mt-5 grid grid-cols-2 gap-3">
                <AskButton
                  onClick={() => setOpenAt(null)}
                  className="inline-flex h-12 cursor-pointer items-center justify-center rounded-full bg-gold px-4 text-[0.9375rem] font-semibold text-night transition-colors hover:bg-gold-hi"
                >
                  Sofya&apos;ya sorun
                </AskButton>
                <a
                  href={CONTACT.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/20 px-4 text-[0.9375rem] font-semibold text-white transition-colors hover:border-gold hover:text-gold"
                >
                  <WhatsAppIcon className="size-[1.125rem]" />
                  WhatsApp
                </a>
              </div>
            </div>
            <p className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-[0.875rem] text-pearl/65">
              <a href={CONTACT.phoneHref} className="hover:text-gold">
                {CONTACT.phone}
              </a>
              <a href={`mailto:${CONTACT.email}`} className="whitespace-nowrap hover:text-gold">
                {CONTACT.email}
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
