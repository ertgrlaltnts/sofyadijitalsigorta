"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import { CONTACT } from "@/lib/content";
import { AppLink } from "./app-link";
import { CheckIcon } from "./icons";

const KEY = "sofya.cookie-consent";
const CHANGE = "sofya:cookie-consent";

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(CHANGE, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CHANGE, onChange);
  };
}

/** True once the visitor accepted. On the server it is true, so nothing flashes before the browser is checked. */
const accepted = () => {
  try {
    return localStorage.getItem(KEY) !== null;
  } catch {
    // Storage blocked: keep the banner out of the way instead of showing it on every page.
    return true;
  }
};

/** Asks first-time visitors to accept the cookie policy. The choice is remembered in this browser only. */
export function CookieConsent() {
  const isAccepted = useSyncExternalStore(subscribe, accepted, () => true);
  // Every page but the home page has the round Sofya button at the bottom right; sit above it there.
  const abovePill = usePathname() !== "/";
  if (isAccepted) return null;

  const accept = () => {
    try {
      localStorage.setItem(KEY, JSON.stringify({ v: 1, at: new Date().toISOString() }));
    } catch {}
    window.dispatchEvent(new Event(CHANGE));
  };

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-title"
      aria-describedby="cookie-text"
      className={`cookie-in fixed inset-x-3 bottom-3 z-[70] overflow-hidden rounded-[1.75rem] bg-night/95 p-5 text-pearl shadow-[0_40px_90px_-24px_rgba(0,0,0,0.8)] ring-1 ring-white/10 backdrop-blur-xl sm:right-6 sm:left-auto sm:max-w-[27rem] ${abovePill ? "sm:bottom-24" : "sm:bottom-6"} sm:p-6`}
    >
      <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
      <span aria-hidden className="pointer-events-none absolute -top-16 -left-12 size-44 rounded-full bg-gold/20 blur-3xl" />

      <div className="relative flex items-start gap-4">
        <span className="relative mt-0.5 size-12 shrink-0 overflow-hidden rounded-full bg-white ring-2 ring-gold/60">
          <Image src="/sofya-avatar.png" alt="" fill sizes="48px" quality={90} className="object-cover" />
        </span>
        <div className="min-w-0">
          <h2 id="cookie-title" className="font-display text-[1.625rem] leading-none text-white">
            Çerez politikası
          </h2>
          <p id="cookie-text" className="mt-2.5 text-[0.875rem] leading-relaxed text-pearl/70">
            Sitemiz yalnızca Sofya sohbetinin çalışması için gerekli tarayıcı depolamasını kullanır. Reklam ya da takip çerezi yoktur.
          </p>
        </div>
      </div>

      <div className="relative mt-5 flex items-center gap-3">
        <button
          type="button"
          onClick={accept}
          autoFocus
          className="group inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-gold px-5 text-[0.9375rem] font-semibold text-night transition-[background-color,box-shadow] duration-300 hover:bg-gold-hi hover:shadow-[0_10px_30px_-8px_rgba(226,184,106,0.6)]"
        >
          <CheckIcon className="size-4" strokeWidth={2.4} />
          Kabul ediyorum
        </button>
        <AppLink
          href={CONTACT.cookieUrl}
          className="inline-flex h-11 shrink-0 items-center rounded-full px-4 text-[0.875rem] font-medium text-pearl/80 underline decoration-white/25 underline-offset-4 transition-colors hover:text-gold hover:decoration-gold/60"
        >
          Politikayı oku
        </AppLink>
      </div>
    </div>
  );
}

/** Footer link that forgets the choice, so the banner asks again. */
export function CookiePreferencesButton({ className }: { className?: string }) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        try {
          localStorage.removeItem(KEY);
        } catch {}
        window.dispatchEvent(new Event(CHANGE));
      }}
    >
      Çerez tercihleri
    </button>
  );
}
