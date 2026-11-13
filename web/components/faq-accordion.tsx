"use client";

import { useId, useState } from "react";
import { PlusIcon } from "./icons";
import { Reveal } from "./reveal";

/**
 * Question cards, one open at a time. Answers stay in the DOM (they are only collapsed with CSS), so crawlers and
 * screen readers still get them. The open card turns white, gets a gold edge and its plus turns into a cross.
 */
export function FaqAccordion({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  const base = useId();

  return (
    <ul className="space-y-3">
      {items.map((item, index) => {
        const isOpen = open === index;
        const buttonId = `${base}-q${index}`;
        const panelId = `${base}-a${index}`;
        return (
          <li key={item.q}>
            <Reveal delay={index * 70}>
              <div
                className={`relative overflow-hidden rounded-[1.25rem] border transition-[background-color,border-color,box-shadow] duration-500 ${
                  isOpen
                    ? "border-gold/70 bg-white shadow-[0_28px_44px_-30px_rgba(15,26,48,0.4)]"
                    : "border-ink/10 bg-pearl hover:border-ink/25 hover:bg-white"
                }`}
              >
                <span
                  aria-hidden
                  className={`absolute inset-y-0 left-0 w-1 origin-top bg-gradient-to-b from-gold to-gold-deep transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isOpen ? "scale-y-100" : "scale-y-0"
                  }`}
                />
                <h3>
                  <button
                    type="button"
                    id={buttonId}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? null : index)}
                    className="flex w-full items-center justify-between gap-5 px-6 py-5 text-left sm:px-8 sm:py-6"
                  >
                    <span className="font-display text-[1.375rem] leading-snug sm:text-[1.625rem]">{item.q}</span>
                    <span
                      aria-hidden
                      className={`grid size-10 shrink-0 place-items-center rounded-full border transition-[background-color,border-color,color,rotate] duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                        isOpen ? "rotate-[135deg] border-gold bg-gold text-night" : "border-ink/20 text-ink"
                      }`}
                    >
                      <PlusIcon className="size-4" strokeWidth={2.2} />
                    </span>
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  aria-hidden={!isOpen}
                  className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p
                      className={`max-w-2xl px-6 pb-6 text-[1.0625rem] leading-relaxed text-ink-soft transition-[translate] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:px-8 sm:pb-7 ${
                        isOpen ? "translate-y-0" : "-translate-y-2"
                      }`}
                    >
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          </li>
        );
      })}
    </ul>
  );
}
