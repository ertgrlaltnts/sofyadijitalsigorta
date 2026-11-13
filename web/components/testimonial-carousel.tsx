"use client";

import { useEffect, useRef, useState, type ReactNode, type TouchEvent } from "react";
import { ArrowRightIcon, QuoteIcon, StarIcon } from "./icons";

type Testimonial = { quote: string; name: string; detail: string };

const GAP = "1.25rem";
const EASE = "cubic-bezier(0.22,1,0.36,1)";

/**
 * Cards in a sliding row: one on phones, two on tablets, three on desktop. The list is repeated three times and the
 * track silently jumps back by one copy after each move, so it loops without ever rewinding. It advances when the
 * active dot's fill animation ends, pauses on hover/focus/touch, and stays still with reduced motion.
 */
export function TestimonialCarousel({ items, header }: { items: Testimonial[]; header: ReactNode }) {
  const n = items.length;
  const [pos, setPos] = useState(n);
  const [animate, setAnimate] = useState(true);
  const [paused, setPaused] = useState(false);
  const touchX = useRef<number | null>(null);

  const active = ((pos % n) + n) % n;
  const move = (to: number) => {
    setAnimate(true);
    setPos(to);
  };

  // After a slide settles inside the outer copies, jump back to the same view in the middle copy without animating.
  const onTransitionEnd = () => {
    if (pos >= 2 * n || pos < n) {
      setAnimate(false);
      setPos((p) => (p >= 2 * n ? p - n : p + n));
    }
  };
  useEffect(() => {
    if (animate) return;
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setAnimate(true)));
    return () => cancelAnimationFrame(id);
  }, [animate]);

  const onTouchStart = (event: TouchEvent) => {
    touchX.current = event.touches[0].clientX;
    setPaused(true);
  };
  const onTouchEnd = (event: TouchEvent) => {
    const start = touchX.current;
    touchX.current = null;
    setPaused(false);
    if (start === null) return;
    const delta = event.changedTouches[0].clientX - start;
    if (Math.abs(delta) > 48) move(pos + (delta < 0 ? 1 : -1));
  };

  const arrow =
    "grid size-11 place-items-center rounded-full border border-ink/15 bg-white text-ink transition-colors duration-300 hover:border-ink hover:bg-ink hover:text-white";

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Müşteri yorumları"
      className="[--v:1] md:[--v:2] lg:[--v:3]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="flex items-end justify-between gap-6">
        {header}
        <div className="hidden shrink-0 gap-3 sm:flex">
          <button type="button" aria-label="Önceki yorum" onClick={() => move(pos - 1)} className={arrow}>
            <ArrowRightIcon className="size-4 rotate-180" />
          </button>
          <button type="button" aria-label="Sonraki yorum" onClick={() => move(pos + 1)} className={arrow}>
            <ArrowRightIcon className="size-4" />
          </button>
        </div>
      </div>

      <div className="mt-12 overflow-hidden py-8 -my-8" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <ul
          onTransitionEnd={(event) => event.target === event.currentTarget && onTransitionEnd()}
          className="flex will-change-transform"
          style={{
            gap: GAP,
            transform: `translateX(calc(${-pos} * (100% + ${GAP}) / var(--v)))`,
            transition: animate ? `transform 900ms ${EASE}` : "none",
          }}
        >
          {[0, 1, 2].flatMap((copy) =>
            items.map((item) => {
              return (
                <li
                  key={`${copy}-${item.name}`}
                  aria-hidden={copy !== 1}
                  className="flex shrink-0"
                  style={{ width: `calc((100% - (var(--v) - 1) * ${GAP}) / var(--v))` }}
                >
                  <figure
                    className="relative flex w-full flex-col overflow-hidden rounded-[1.5rem] border border-ink/10 bg-white p-7 shadow-[0_24px_40px_-32px_rgba(15,26,48,0.35)] sm:p-8"
                  >
                    <span aria-hidden className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-gold via-gold-hi to-gold" />
                    <div className="flex items-center justify-between">
                      <div className="flex gap-0.5 text-gold" role="img" aria-label="5 üzerinden 5 yıldız">
                        {Array.from({ length: 5 }).map((_, s) => (
                          <StarIcon key={s} className="size-[1.125rem]" />
                        ))}
                      </div>
                      <QuoteIcon className="size-8 text-gold/35" />
                    </div>
                    <blockquote className="mt-5 flex-1 text-[1.0625rem] leading-relaxed text-ink">{item.quote}</blockquote>
                    <figcaption className="mt-7 flex items-center gap-3 border-t border-ink/10 pt-5">
                      <span className="grid size-11 shrink-0 place-items-center rounded-full bg-ink font-display text-lg text-gold">
                        {item.name[0]}
                      </span>
                      <span className="min-w-0">
                        <span className="block font-semibold">{item.name}</span>
                        <span className="block truncate text-[0.875rem] text-ink-soft">{item.detail}</span>
                      </span>
                    </figcaption>
                  </figure>
                </li>
              );
            }),
          )}
        </ul>
      </div>

      <div className="mt-10 flex items-center justify-center gap-2">
        {items.map((item, i) => (
          <button
            key={item.name}
            type="button"
            aria-label={`${i + 1}. yoruma git`}
            aria-current={i === active}
            onClick={() => move(pos - active + i)}
            className="group grid h-6 place-items-center"
          >
            <span className={`relative block h-1 overflow-hidden rounded-full bg-ink/15 transition-[width] duration-500 ${i === active ? "w-14" : "w-6 group-hover:bg-ink/30"}`}>
              {i === active && (
                <span
                  key={pos}
                  className="bar-fill absolute inset-0 origin-left rounded-full bg-gold-deep"
                  style={{ animationPlayState: paused ? "paused" : "running" }}
                  onAnimationEnd={() => move(pos + 1)}
                />
              )}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
