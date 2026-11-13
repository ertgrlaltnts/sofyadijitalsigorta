"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import type { FaqCategory } from "@/lib/faq";
import { FaqAccordion } from "./faq-accordion";
import { Glyph } from "./glyph";

/**
 * Category tabs above one accordion per category. Every panel stays in the DOM (inactive ones are only hidden), so
 * crawlers and the structured data see all questions. Arrow keys, Home and End move between tabs.
 */
export function FaqTabs({ categories }: { categories: FaqCategory[] }) {
  const [active, setActive] = useState(categories[0].id);
  const tabs = useRef<Record<string, HTMLButtonElement | null>>({});

  const select = (id: string) => {
    setActive(id);
    // On phones the tab row scrolls sideways: bring the chosen tab to the middle.
    tabs.current[id]?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  };

  const move = (event: KeyboardEvent, index: number) => {
    const last = categories.length - 1;
    const target =
      event.key === "ArrowRight" ? (index + 1) % categories.length
      : event.key === "ArrowLeft" ? (index - 1 + categories.length) % categories.length
      : event.key === "Home" ? 0
      : event.key === "End" ? last
      : -1;
    if (target < 0) return;
    event.preventDefault();
    const next = categories[target].id;
    select(next);
    tabs.current[next]?.focus();
  };

  return (
    <div>
      <div className="-mx-5 overflow-x-auto px-5 pb-3 sm:mx-0 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div role="tablist" aria-label="Soru kategorileri" className="flex w-max gap-2 sm:w-auto sm:flex-wrap">
          {categories.map((category, index) => {
            const selected = category.id === active;
            return (
              <button
                key={category.id}
                ref={(el) => {
                  tabs.current[category.id] = el;
                }}
                role="tab"
                id={`faq-tab-${category.id}`}
                aria-selected={selected}
                aria-controls={`faq-panel-${category.id}`}
                tabIndex={selected ? 0 : -1}
                type="button"
                onClick={() => select(category.id)}
                onKeyDown={(event) => move(event, index)}
                className={`group relative inline-flex h-12 shrink-0 items-center gap-2.5 rounded-full border px-5 text-[0.9375rem] font-medium transition-[background-color,border-color,color,box-shadow] duration-300 ${
                  selected
                    ? "border-ink bg-ink text-white shadow-[0_16px_30px_-18px_rgba(15,26,48,0.7)]"
                    : "border-ink/15 bg-white text-ink-soft hover:border-gold hover:text-ink"
                }`}
              >
                <Glyph
                  name={category.icon}
                  className={`size-[1.125rem] transition-colors duration-300 ${selected ? "text-gold" : "text-gold-deep"}`}
                />
                {category.label}
                <span
                  className={`rounded-full px-2 py-0.5 text-[0.75rem] font-semibold transition-colors duration-300 ${
                    selected ? "bg-white/15 text-white" : "bg-pearl text-ink-soft"
                  }`}
                >
                  {category.items.length}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-8">
        {categories.map((category) => (
          <div
            key={category.id}
            role="tabpanel"
            id={`faq-panel-${category.id}`}
            aria-labelledby={`faq-tab-${category.id}`}
            hidden={category.id !== active}
            className={category.id === active ? "step-fade" : undefined}
          >
            <FaqAccordion items={category.items} />
          </div>
        ))}
      </div>
    </div>
  );
}
