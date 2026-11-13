import type { Metadata } from "next";
import { getGuide, type Guide } from "@/lib/guides";
import { OG_IMAGES, TWITTER_IMAGES } from "@/lib/site";
import { AppLink } from "./app-link";
import { FaqAccordion } from "./faq-accordion";
import { FuelCalculator } from "./fuel-calculator";
import { Glyph } from "./glyph";
import { ArrowRightIcon } from "./icons";
import { JsonLd } from "./json-ld";
import { Blocks } from "./legal-page";
import { PageHero } from "./page-hero";
import { PageTransition } from "./page-transition";
import { Reveal } from "./reveal";
import { FinalCta, H2, WRAP } from "./sections";

export function guideMetadata(guide: Guide): Metadata {
  return {
    title: guide.title,
    description: guide.description,
    openGraph: {
      title: `${guide.title} | Sofya Dijital Sigorta`,
      description: guide.description,
      url: `/rehber/${guide.slug}`,
      locale: "tr_TR",
      type: "article",
      siteName: "Sofya Dijital Sigorta",
      images: OG_IMAGES,
    },
    twitter: { card: "summary_large_image", title: `${guide.title} | Sofya Dijital Sigorta`, description: guide.description, images: TWITTER_IMAGES },
  };
}

/** A guide or calculator: title band, optional calculator, a table of contents beside the article, FAQ and a product call-to-action. */
export function GuidePage({ guide }: { guide: Guide }) {
  const related = guide.related.map(getGuide).filter((item): item is Guide => !!item);

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: guide.faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <PageTransition>
      <JsonLd data={schema} />
      <PageHero crumbs={[{ label: "Rehber", href: "/rehber" }, { label: guide.label }]} title={guide.h1} intro={guide.intro} />

      {guide.kind === "calculator" && (
        <section className="on-light bg-pearl py-14 text-ink lg:py-20">
          <div className={`${WRAP} max-w-6xl`}>
            <Reveal variant="scale">
              <FuelCalculator />
            </Reveal>
          </div>
        </section>
      )}

      <section className="on-light bg-white py-16 text-ink lg:py-24">
        <div className={`${WRAP} grid grid-cols-1 gap-12 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-16`}>
          <aside className="min-w-0 lg:sticky lg:top-24 lg:self-start">
            <p className="text-[0.8125rem] font-semibold text-ink">Bu sayfada</p>
            <nav aria-label="İçindekiler" className="mt-4">
              <ul className="space-y-1 border-l border-ink/10">
                {guide.sections.map((section) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="-ml-px block border-l-2 border-transparent py-1.5 pl-4 text-[0.9375rem] text-ink-soft transition-colors hover:border-gold hover:text-ink"
                    >
                      {section.title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          <div className="min-w-0 max-w-3xl space-y-12">
            {guide.sections.map((section) => (
              <Reveal key={section.id}>
                <section id={section.id} className="scroll-mt-28">
                  <h2 className="font-display text-[2rem] leading-tight">{section.title}</h2>
                  <Blocks blocks={section.blocks} />
                </section>
              </Reveal>
            ))}

            {guide.official && (
              <Reveal>
                <div className="rounded-2xl border border-gold/40 bg-gold/10 p-6">
                  <p className="leading-relaxed text-ink">{guide.official.note}</p>
                  <a
                    href={guide.official.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group mt-4 inline-flex h-11 items-center gap-2 rounded-full bg-ink px-5 text-[0.9375rem] font-semibold text-white transition-colors hover:bg-ink-soft"
                  >
                    {guide.official.label}
                    <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
                  </a>
                </div>
              </Reveal>
            )}
          </div>
        </div>
      </section>

      <section className="on-light bg-pearl py-16 text-ink lg:py-24">
        <div className={`${WRAP} max-w-5xl`}>
          <Reveal variant="scale">
            <div className="relative isolate overflow-hidden rounded-[2rem] bg-night p-8 text-pearl ring-1 ring-white/10 sm:p-12">
              <div aria-hidden className="aurora" />
              <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
                <div>
                  <h2 className="max-w-xl font-display text-[2rem] leading-tight text-balance text-white sm:text-[2.5rem]">{guide.cta.title}</h2>
                  <p className="mt-4 max-w-xl text-lg leading-relaxed text-pearl/75">{guide.cta.body}</p>
                </div>
                <AppLink
                  href={`/urunler/${guide.cta.slug}`}
                  className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-gold px-6 text-[0.9375rem] font-semibold text-night transition-colors hover:bg-gold-hi"
                >
                  {guide.cta.button}
                  <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" strokeWidth={2.2} />
                </AppLink>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="on-light bg-white py-16 text-ink lg:py-24">
        <div className={`${WRAP} grid gap-12 lg:grid-cols-[5fr_7fr] lg:gap-20`}>
          <Reveal className="lg:sticky lg:top-28 lg:self-start">
            <h2 className={H2}>Sık sorulanlar</h2>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-ink-soft">Aradığınızı bulamadıysanız Sofya&apos;ya sorabilirsiniz.</p>
          </Reveal>
          <FaqAccordion items={guide.faq} />
        </div>

        {related.length > 0 && (
          <div className={`${WRAP} mt-16`}>
            <Reveal>
              <h2 className="font-display text-[2rem] leading-tight">İlginizi çekebilecek diğer rehberler</h2>
              <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                {related.map((item) => (
                  <li key={item.slug}>
                    <AppLink
                      href={`/rehber/${item.slug}`}
                      className="group flex h-full items-center gap-4 rounded-2xl border border-ink/10 bg-pearl p-5 transition-[translate,border-color,background-color] duration-300 hover:-translate-y-1 hover:border-gold hover:bg-white"
                    >
                      <span className="grid size-12 shrink-0 place-items-center rounded-full bg-gold/20 text-gold-deep ring-1 ring-gold/50">
                        <Glyph name={item.icon} className="size-6" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-semibold">{item.label}</span>
                        <span className="mt-0.5 block text-[0.875rem] text-ink-soft">{item.teaser}</span>
                      </span>
                      <ArrowRightIcon className="size-4 shrink-0 text-gold-deep transition-transform group-hover:translate-x-1" />
                    </AppLink>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        )}
      </section>

      <FinalCta />
    </PageTransition>
  );
}

