import type { ReactNode } from "react";
import { SITE_URL } from "@/lib/site";
import { AppLink } from "./app-link";
import { ChevronDownIcon } from "./icons";
import { JsonLd } from "./json-ld";
import { TechPattern } from "./tech-pattern";
import { Words } from "./words";

export interface Crumb {
  label: string;
  /** Omit on the last crumb, which is the current page. */
  href?: string;
}

/**
 * Dark opening band shared by the inner pages, matching the home hero: aurora, faint circuit pattern, a slowly turning
 * gold ring, a breadcrumb trail (also published as BreadcrumbList data), the animated headline and intro text.
 * Square bottom edge.
 */
export function PageHero({
  title,
  intro,
  crumbs,
  compact = false,
  visual,
  children,
}: {
  title: string;
  intro?: string;
  crumbs?: Crumb[];
  /** Short band (breadcrumb and title only) with room at the bottom for a card pulled up over it. */
  compact?: boolean;
  /** Artwork beside the text on wide screens (below it on narrow ones). It sits on the bottom edge of the band. */
  visual?: ReactNode;
  children?: ReactNode;
}) {
  const trail: Crumb[] = crumbs ? [{ label: "Anasayfa", href: "/" }, ...crumbs] : [];

  return (
    <div className="-mt-16">
      <section
        id="hero"
        className={`relative isolate overflow-hidden bg-night text-pearl ${compact ? "pt-[6.25rem] pb-28 lg:pt-[7rem] lg:pb-32" : visual ? "pt-[7rem] pb-0 lg:pt-[8.5rem]" : "pt-[7rem] pb-16 lg:pt-[8.5rem] lg:pb-24"}`}
      >
        <div aria-hidden className="aurora" />
        <TechPattern />
        <svg
          viewBox="0 0 100 100"
          aria-hidden
          className="ring-spin pointer-events-none absolute top-1/2 -right-40 -z-10 size-[34rem] -translate-y-1/2 text-gold/30 [animation-duration:90s] lg:-right-24 lg:size-[44rem]"
        >
          <circle cx="50" cy="50" r="49" fill="none" stroke="currentColor" strokeWidth="0.25" strokeDasharray="0.6 1.4" />
          <circle cx="50" cy="50" r="38" fill="none" stroke="currentColor" strokeWidth="0.25" />
          <circle cx="50" cy="12" r="1.2" fill="#f0c97a" />
        </svg>

        <div
          className={`mx-auto w-full max-w-7xl px-5 sm:px-8 ${visual ? "grid items-end gap-4 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10" : ""}`}
        >
          <div className={visual ? "pb-6 lg:pb-24" : undefined}>
          {trail.length > 0 && (
            <>
              <JsonLd
                data={{
                  "@context": "https://schema.org",
                  "@type": "BreadcrumbList",
                  itemListElement: trail.map((crumb, i) => ({
                    "@type": "ListItem",
                    position: i + 1,
                    name: crumb.label,
                    ...(crumb.href ? { item: `${SITE_URL}${crumb.href === "/" ? "" : crumb.href}` } : {}),
                  })),
                }}
              />
              <nav aria-label="Sayfa yolu" className={`fade-up [--d:0.1s] ${compact ? "mb-4" : "mb-6"}`}>
                <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.8125rem] text-pearl/60">
                  {trail.map((crumb, i) => (
                    <li key={crumb.label} className="flex items-center gap-2">
                      {i > 0 && <ChevronDownIcon aria-hidden className="size-3.5 -rotate-90 text-gold/70" />}
                      {crumb.href ? (
                        <AppLink href={crumb.href} className="transition-colors hover:text-gold">
                          {crumb.label}
                        </AppLink>
                      ) : (
                        <span aria-current="page" className="font-medium text-white">
                          {crumb.label}
                        </span>
                      )}
                    </li>
                  ))}
                </ol>
              </nav>
            </>
          )}
          <h1 className={`max-w-4xl font-display leading-[1.02] tracking-[-0.02em] text-balance text-white ${compact ? "text-[2.5rem] sm:text-[3.25rem] lg:text-[3.75rem]" : "text-[3rem] sm:text-[4.5rem] lg:text-[5.5rem]"}`}>
            <Words text={title} base={0.15} />
          </h1>
          {intro && <p className="fade-up mt-6 max-w-2xl text-lg leading-relaxed text-pearl/75 [--d:0.7s] sm:text-xl">{intro}</p>}
          {children && <div className="fade-up mt-8 [--d:0.9s]">{children}</div>}
          </div>
          {visual}
        </div>
      </section>
    </div>
  );
}
