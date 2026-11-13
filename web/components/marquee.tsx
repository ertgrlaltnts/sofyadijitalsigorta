import { MARQUEE_ITEMS } from "@/lib/content";

/** Endless ticker of insurance types; the list is rendered twice so the loop is seamless. */
export function Marquee() {
  return (
    <div className="marquee relative overflow-hidden border-b border-ink/10 bg-white py-6" aria-hidden>
      <div className="marquee-track">
        {[0, 1].map((copy) => (
          <ul key={copy} className="flex shrink-0 items-center">
            {MARQUEE_ITEMS.map((item) => (
              <li key={item} className="flex items-center">
                <span className="px-8 font-display text-[2.25rem] leading-none whitespace-nowrap text-ink/80 sm:text-[3rem]">
                  {item}
                </span>
                <svg viewBox="0 0 12 12" className="size-3 shrink-0 text-gold" fill="currentColor">
                  <path d="M6 0l1.4 4.6L12 6 7.4 7.4 6 12 4.6 7.4 0 6l4.6-1.4z" />
                </svg>
              </li>
            ))}
          </ul>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent" />
    </div>
  );
}
