"use client";

import { useEffect, useRef, useState } from "react";

export interface NavItem {
  id: string;
  label: string;
}

/**
 * Page ruler. On wide screens it is a slim ruler pinned to the right edge: one tick per section, the current one is
 * long and gold, hovering a tick names it, clicking scrolls there. On phones it becomes a chip bar under the header.
 * Both appear only after the top of the page has been scrolled past.
 */
export function SectionNav({ items }: { items: NavItem[] }) {
  const [active, setActive] = useState(items[0].id);
  const [visible, setVisible] = useState(false);
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sections = items.map((item) => document.getElementById(item.id)).filter((el): el is HTMLElement => !!el);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((section) => observer.observe(section));

    const onScroll = () => setVisible(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [items]);

  // Keep the current chip centered in the phone bar.
  useEffect(() => {
    const container = bar.current;
    const chip = container?.querySelector<HTMLElement>(`[data-id="${active}"]`);
    if (!container || !chip) return;
    container.scrollTo({ left: chip.offsetLeft - container.clientWidth / 2 + chip.clientWidth / 2, behavior: "smooth" });
  }, [active]);

  const go = (id: string) => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById(id)?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };

  return (
    <>
      <nav
        aria-label="Sayfa bölümleri"
        className={`fixed top-1/2 right-3 z-40 hidden -translate-y-1/2 transition-[opacity,translate] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] lg:block ${
          visible ? "translate-x-0 opacity-100" : "pointer-events-none translate-x-6 opacity-0"
        }`}
      >
        <ul className="flex flex-col items-end rounded-2xl bg-white/80 py-3 pr-2.5 pl-4 shadow-[0_18px_40px_-18px_rgba(15,26,48,0.45)] ring-1 ring-ink/10 backdrop-blur-md">
          {items.map((item, index) => {
            const current = item.id === active;
            return (
              <li key={item.id} className="flex flex-col items-end">
                <a
                  href={`#${item.id}`}
                  aria-current={current ? "true" : undefined}
                  aria-label={item.label}
                  onClick={(event) => {
                    event.preventDefault();
                    go(item.id);
                  }}
                  className="group relative flex h-7 w-full items-center justify-end"
                >
                  <span
                    className={`pointer-events-none absolute right-full mr-4 translate-x-1 rounded-full px-3 py-1 text-[0.8125rem] font-medium whitespace-nowrap opacity-0 shadow-[0_8px_20px_-8px_rgba(15,26,48,0.5)] transition-[opacity,translate] duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 ${
                      current ? "bg-gold text-night" : "bg-ink text-white"
                    }`}
                  >
                    {item.label}
                  </span>
                  <span
                    className={`block h-0.5 rounded-full transition-[width,background-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      current ? "w-8 bg-gold-deep" : "w-4 bg-ink/30 group-hover:w-6 group-hover:bg-ink/70"
                    }`}
                  />
                </a>
                {index < items.length - 1 && <span aria-hidden className="block h-px w-2 rounded-full bg-ink/15" />}
              </li>
            );
          })}
        </ul>
      </nav>

      <div
        className={`fixed inset-x-0 top-16 z-50 border-b border-ink/10 bg-white/90 backdrop-blur-md transition-[opacity,translate] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] lg:hidden ${
          visible ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-3 opacity-0"
        }`}
      >
        <div ref={bar} className="no-scrollbar flex gap-2 overflow-x-auto px-4 py-2">
          {items.map((item) => {
            const current = item.id === active;
            return (
              <a
                key={item.id}
                data-id={item.id}
                href={`#${item.id}`}
                aria-current={current ? "true" : undefined}
                onClick={(event) => {
                  event.preventDefault();
                  go(item.id);
                }}
                className={`shrink-0 rounded-full px-4 py-1.5 text-[0.875rem] font-medium transition-colors duration-300 ${
                  current ? "bg-ink text-white" : "bg-pearl text-ink-soft"
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </div>
      </div>
    </>
  );
}
