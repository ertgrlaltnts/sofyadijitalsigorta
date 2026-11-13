"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ASK_EVENT, OPEN_EVENT } from "@/lib/content";
import { SofyaChat } from "./sofya-chat";

/**
 * The chat launcher at the bottom right of every page. It also carries on what is typed into the home page hero chat: that
 * chat only hands the message over (ASK_EVENT), and this one opens and answers.
 */
export function FloatingChat() {
  const [open, setOpen] = useState(false);
  const [hint, setHint] = useState(true);

  useEffect(() => {
    const show = () => {
      setOpen(true);
      setHint(false);
    };
    window.addEventListener(OPEN_EVENT, show);
    window.addEventListener(ASK_EVENT, show);
    return () => {
      window.removeEventListener(OPEN_EVENT, show);
      window.removeEventListener(ASK_EVENT, show);
    };
  }, []);

  // Opened (by the button, or by a message from the home page chat): put the cursor in the message field once it has slid in.
  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => document.getElementById("sofya-float-input")?.focus({ preventScroll: true }), 350);
    return () => clearTimeout(timer);
  }, [open]);

  // Escape closes the chat.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <div
        aria-hidden
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-[64] bg-night/45 backdrop-blur-[2px] transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <div
        data-open={open}
        inert={!open}
        className="chat-pop fixed right-3 bottom-[5.5rem] z-[65] w-[min(46rem,calc(100vw-1.5rem))] sm:right-6 sm:bottom-24"
      >
        <SofyaChat id="sofya-float" className="h-[min(48rem,calc(100dvh-7.5rem))] sm:h-[min(48rem,calc(100dvh-8.5rem))]" />
      </div>

      <div className="chat-launcher fixed right-4 bottom-4 z-[65] flex items-center gap-3 sm:right-6">
        {hint && !open && (
          <p className="fade-up hidden rounded-full border border-white/10 bg-navy px-4 py-2 text-[0.875rem] text-pearl shadow-xl [--d:1.5s] sm:block">
            Merhaba, ben Sofya. Sormak ister misiniz?
          </p>
        )}
        <button
          type="button"
          aria-expanded={open}
          aria-label={open ? "Sohbeti kapat" : "Sofya ile sohbet et"}
          onClick={() => {
            setOpen((value) => !value);
            setHint(false);
          }}
          className="relative grid size-16 place-items-center rounded-full border border-gold/70 bg-night shadow-[0_8px_30px_rgba(226,184,106,0.35)] transition-transform hover:scale-105"
        >
          {!open && <span aria-hidden className="launcher-ring absolute inset-0 rounded-full border border-gold" />}
          {open ? (
            <svg viewBox="0 0 24 24" className="size-6 text-gold" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          ) : (
            <span className="relative size-14 overflow-hidden rounded-full">
              <Image src="/sofya-avatar.png" alt="" fill sizes="56px" quality={90} className="object-cover" />
            </span>
          )}
        </button>
      </div>
    </>
  );
}
