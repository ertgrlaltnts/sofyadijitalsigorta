import Image from "next/image";
import type { ReactNode } from "react";
import { PRODUCTS, type Product } from "@/lib/content";
import type { ProductPage } from "@/lib/product-pages";
import { SITE_URL } from "@/lib/site";
import { AppLink } from "./app-link";
import { AskButton } from "./ask-button";
import { FaqAccordion } from "./faq-accordion";
import { Glyph } from "./glyph";
import { ArrowRightIcon, CheckIcon } from "./icons";
import { JsonLd } from "./json-ld";
import { PageHero } from "./page-hero";
import { PageTransition } from "./page-transition";
import { Partners } from "./partners";
import { LiveQuoteForm } from "./live-quote-form";
import { Reveal } from "./reveal";
import { H2, WRAP, toneClass, type Tone } from "./sections";
import { SectionNav } from "./section-nav";
import { SpotlightCard } from "./spotlight-card";

function Section({ tone, id, tightTop = false, children }: { tone: Tone; id?: string; tightTop?: boolean; children: ReactNode }) {
  return (
    <section id={id} className={`on-light ${toneClass(tone)} scroll-mt-28 text-ink lg:scroll-mt-16 ${tightTop ? "pt-20 pb-20 lg:pt-28 lg:pb-28" : "py-20 lg:py-28"}`}>
      {children}
    </section>
  );
}

function Heading({ title, intro, center = false }: { title: string; intro?: string; center?: boolean }) {
  return (
    <Reveal className={center ? "mx-auto text-center" : undefined}>
      <h2 className={`${H2} max-w-3xl ${center ? "mx-auto" : ""}`}>{title}</h2>
      {intro && <p className={`mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft ${center ? "mx-auto" : ""}`}>{intro}</p>}
    </Reveal>
  );
}

function Ripples() {
  return (
    <>
      <span aria-hidden className="ripple" />
      <span aria-hidden className="ripple ripple-late" />
    </>
  );
}

/**
 * One coverage card. The first one is a dark feature card, the last one runs wide, the rest are light cards that
 * follow the cursor with a gold glow, draw a gold edge and ripple their icon, like the product tiles on the home page.
 */
function CoverCard({ cover, variant }: { cover: ProductPage["covers"][number]; variant: "feature" | "wide" | "plain" }) {
  if (variant === "feature") {
    return (
      <article className="group relative flex h-full w-full flex-col overflow-hidden rounded-[1.75rem] bg-night p-8 text-pearl shadow-[0_44px_80px_-44px_rgba(11,19,34,0.9)] sm:p-10">
        <div aria-hidden className="pointer-events-none absolute -top-28 -left-20 size-96 rounded-full bg-gold/25 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -right-24 -bottom-24 size-96 rounded-full bg-[#345496]/40 blur-3xl" />
        <Glyph name={cover.icon} className="pointer-events-none absolute -right-8 -bottom-10 size-80 text-white/[0.05]" />

        <span className="relative inline-flex w-fit rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-[0.8125rem] font-medium text-gold">
          Temel teminat
        </span>
        <span className="tile-icon relative mt-8 grid size-20 place-items-center rounded-full bg-gold/15 ring-1 ring-gold/50">
          <Ripples />
          <span className="icon-hop relative grid place-items-center">
            <Glyph name={cover.icon} className="size-10 text-gold" />
          </span>
        </span>
        <h3 className="relative mt-8 font-display text-[2.5rem] leading-none sm:text-[3rem]">{cover.title}</h3>
        <p className="relative mt-4 max-w-md text-lg leading-relaxed text-pearl/75">{cover.body}</p>
      </article>
    );
  }

  const wide = variant === "wide";
  return (
    <SpotlightCard
      className={`group relative flex h-full w-full overflow-hidden rounded-[1.5rem] border border-ink/10 bg-pearl p-6 transition-[translate,scale,rotate,transform,box-shadow,border-color,background-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:border-gold hover:bg-white hover:shadow-[0_34px_50px_-34px_rgba(15,26,48,0.45)] ${
        wide ? "flex-col gap-5 sm:flex-row sm:items-center sm:gap-8 sm:p-8" : "flex-col"
      }`}
    >
      <span aria-hidden className="spot pointer-events-none absolute inset-0" />
      <span aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <span className="card-shine absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/70 to-transparent" />
      </span>
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-gold via-gold-hi to-gold transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100"
      />

      <span className="tile-icon relative grid size-16 shrink-0 place-items-center rounded-full bg-gold/20 ring-1 ring-gold/50">
        <Ripples />
        <span className="icon-hop relative grid place-items-center">
          <Glyph name={cover.icon} className="size-8 text-gold-deep" />
        </span>
      </span>
      <div className={`relative ${wide ? "" : "mt-5"}`}>
        <h3 className="text-xl font-semibold tracking-tight">{cover.title}</h3>
        <p className="mt-2 leading-relaxed text-ink-soft">{cover.body}</p>
      </div>
    </SpotlightCard>
  );
}

/**
 * Product page with the quote form beside the headline and long-form guidance underneath: what it covers, packages,
 * what drives the price, what to check, what to do after a claim, FAQ. Content comes from lib/product-pages.ts.
 */
export function ProductLanding({ product, page }: { product: Product; page: ProductPage }) {
  const index = PRODUCTS.findIndex((item) => item.slug === product.slug);
  const next = PRODUCTS[(index + 1) % PRODUCTS.length];

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: page.title,
      serviceType: page.h1,
      description: page.description,
      url: `${SITE_URL}/urunler/${product.slug}`,
      provider: { "@id": `${SITE_URL}/#organization` },
      areaServed: { "@type": "Country", name: "Türkiye" },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: page.faq.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    },
  ];

  return (
    <PageTransition>
      <SectionNav
        items={[
          { id: "teklif-formu", label: "Teklif al" },
          { id: "teminatlar", label: page.nav.cover },
          { id: "paketler", label: page.nav.packages },
          { id: "fiyat", label: page.nav.factors },
          { id: "dikkat", label: page.nav.tips },
          { id: "hasar", label: page.nav.claim },
          { id: "sirketler", label: "Şirketler" },
          { id: "sss", label: "SSS" },
        ]}
      />
      {schema.map((data) => (
        <JsonLd key={data["@type"]} data={data} />
      ))}

      <PageHero
        title={page.h1}
        crumbs={[{ label: "Ürünlerimiz", href: "/urunler" }, { label: product.name }]}
        compact
      />

      <section className="on-light relative z-10 -mt-20 pb-0 text-ink lg:-mt-24 lg:pb-0">
        <div className={WRAP}>
          <Reveal>
            <div
              id="teklif-formu"
              className="scroll-mt-28 overflow-hidden rounded-[2rem] border border-ink/10 bg-white shadow-[0_60px_110px_-50px_rgba(15,26,48,0.6)] lg:grid lg:grid-cols-[5fr_7fr]"
            >
              <aside className="relative flex flex-col overflow-hidden bg-pearl p-6 sm:p-8 lg:p-12">
                <div aria-hidden className="pointer-events-none absolute -top-24 -left-24 size-72 rounded-full bg-gold/25 blur-3xl" />
                <div aria-hidden className="pointer-events-none absolute -right-24 -bottom-24 size-72 rounded-full bg-[#345496]/10 blur-3xl" />

                <h2 className="relative font-display text-[2.25rem] leading-[1.05] text-balance sm:text-[2.75rem]">
                  {page.shortName} teklifiniz üç adımda yolda
                </h2>
                <p className="relative mt-4 leading-relaxed text-ink-soft">{page.intro}</p>

                <ol className="relative mt-9 hidden space-y-7 md:block">
                  {page.quoteSteps.map((step, i) => (
                    <li key={step.title} className="relative flex gap-4">
                      {i < page.quoteSteps.length - 1 && (
                        <span aria-hidden className="absolute top-11 -bottom-7 left-[1.0625rem] w-px bg-gradient-to-b from-gold to-gold/10" />
                      )}
                      <span className="relative grid size-[2.125rem] shrink-0 place-items-center rounded-full bg-ink font-display text-lg text-gold ring-4 ring-pearl">
                        {i + 1}
                      </span>
                      <div className="pt-0.5">
                        <p className="font-semibold">{step.title}</p>
                        <p className="mt-0.5 text-[0.9375rem] leading-relaxed text-ink-soft">{step.body}</p>
                      </div>
                    </li>
                  ))}
                </ol>

                <div className="relative mt-auto hidden border-t border-ink/10 pt-6 md:block lg:mt-10">
                  <ul className="space-y-2.5">
                    {page.assurances.map((line) => (
                      <li key={line} className="flex items-center gap-2.5 text-[0.9375rem] text-ink">
                        <span className="grid size-5 shrink-0 place-items-center rounded-full bg-gold/25 text-gold-ink">
                          <CheckIcon className="size-3" strokeWidth={2.8} />
                        </span>
                        {line}
                      </li>
                    ))}
                  </ul>
                </div>
              </aside>
              <LiveQuoteForm product={page.form} shortName={page.shortName} serviceName={page.h1} />
            </div>
          </Reveal>
        </div>
      </section>

      <Section tone="white" id="teminatlar" tightTop>
        <div className={WRAP}>
          <Heading title={page.coverTitle} intro={page.coverIntro} />
          <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {page.covers.map((cover, i) => {
              const variant = i === 0 ? "feature" : i === page.covers.length - 1 ? "wide" : "plain";
              // With six cards the last one runs the full row, with eight it takes two columns.
              const wideSpan = page.covers.length % 4 === 0 ? "sm:col-span-2" : "sm:col-span-2 lg:col-span-4";
              return (
                <li
                  key={cover.title}
                  className={`flex ${variant === "feature" ? "sm:col-span-2 lg:row-span-2" : ""} ${variant === "wide" ? wideSpan : ""}`}
                >
                  <Reveal delay={(i % 4) * 90} className="flex w-full">
                    <CoverCard cover={cover} variant={variant} />
                  </Reveal>
                </li>
              );
            })}
          </ul>
        </div>
      </Section>

      <Section tone="gray" id="paketler">
        <div className={WRAP}>
          <Heading title={page.packagesTitle} />
          <ul className="mt-14 grid gap-5 lg:grid-cols-3">
            {page.packages.map((pack, i) => (
              <li key={pack.title} className="flex">
                <Reveal delay={i * 120} className="flex w-full">
                  <article
                    className={`relative flex w-full flex-col overflow-hidden rounded-[1.75rem] border bg-white p-8 ${
                      i === 0 ? "border-gold shadow-[0_34px_50px_-34px_rgba(15,26,48,0.45)]" : "border-ink/10"
                    }`}
                  >
                    {i === 0 && <span aria-hidden className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-gold via-gold-hi to-gold" />}
                    <span className="inline-flex w-fit rounded-full bg-gold/20 px-3 py-1 text-[0.8125rem] font-semibold text-gold-ink">{pack.tag}</span>
                    <h3 className="mt-5 font-display text-[2.25rem] leading-none">{pack.title}</h3>
                    <p className="mt-4 flex-1 leading-relaxed text-ink-soft">{pack.body}</p>
                  </article>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section tone="white" id="fiyat">
        <div className={`${WRAP} grid gap-12 lg:grid-cols-[5fr_7fr] lg:gap-20`}>
          <Reveal className="lg:sticky lg:top-28 lg:self-start">
            <h2 className={H2}>{page.factorsTitle}</h2>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-ink-soft">
              {page.factorsIntro}
            </p>
            <AskButton
              question={page.factorsCta.question}
              className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-ink px-6 text-[0.9375rem] font-semibold text-white transition-colors hover:bg-ink-soft"
            >
              {page.factorsCta.label}
            </AskButton>
          </Reveal>
          <ul className="grid gap-x-10 sm:grid-cols-2">
            {page.factors.map((factor, i) => (
              <li key={factor.title} className="border-t border-ink/10 py-6">
                <Reveal delay={(i % 2) * 100}>
                  <h3 className="flex items-center gap-3 text-lg font-semibold">
                    <span aria-hidden className="size-2.5 rounded-full bg-gold" />
                    {factor.title}
                  </h3>
                  <p className="mt-2 leading-relaxed text-ink-soft">{factor.body}</p>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section tone="gray" id="dikkat">
        <div className={`${WRAP} grid gap-12 lg:grid-cols-[7fr_5fr] lg:gap-16`}>
          <div>
            <Heading title={page.tipsTitle} />
            <ul className="mt-10 space-y-4">
              {page.tips.map((tip, i) => (
                <li key={tip.title}>
                  <Reveal delay={i * 90} variant="right" className="flex gap-4 rounded-[1.25rem] border border-ink/10 bg-white p-5">
                    <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-ink text-gold">
                      <CheckIcon className="size-4" strokeWidth={2.4} />
                    </span>
                    <div>
                      <h3 className="font-semibold">{tip.title}</h3>
                      <p className="mt-1 leading-relaxed text-ink-soft">{tip.body}</p>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>

          <Reveal variant="scale" className="lg:sticky lg:top-28 lg:self-start">
            <aside className="relative overflow-hidden rounded-[1.75rem] border border-ink/10 bg-white p-8 text-center shadow-[0_34px_60px_-40px_rgba(15,26,48,0.4)]">
              <div aria-hidden className="pointer-events-none absolute -top-24 left-1/2 size-72 -translate-x-1/2 rounded-full bg-gold/25 blur-3xl" />
              <span className="relative mx-auto block size-24 overflow-hidden rounded-full bg-pearl ring-2 ring-gold/60">
                <Image src="/sofya-avatar.png" alt="" fill sizes="96px" quality={90} className="object-cover" />
              </span>
              <h3 className="relative mt-5 font-display text-[2rem] leading-tight">{page.tipsAside.title}</h3>
              <p className="relative mt-3 leading-relaxed text-ink-soft">
                {page.tipsAside.body}
              </p>
              <AskButton
                question={page.tipsAside.question}
                className="relative mt-6 inline-flex h-12 items-center gap-2 rounded-full bg-gold px-6 text-[0.9375rem] font-semibold text-night transition-colors hover:bg-gold-hi"
              >
                Sofya&apos;ya sorun
              </AskButton>
            </aside>
          </Reveal>
        </div>
      </Section>

      <Section tone="white" id="hasar">
        <div className={WRAP}>
          <Heading title={page.claimTitle} />
          <ol className="mt-14 grid gap-12 md:grid-cols-2 md:gap-x-10 lg:grid-cols-4">
            {page.claimSteps.map((step, i) => (
              <li key={step.title}>
                <Reveal delay={i * 140}>
                  <div className="h-0.5 bg-ink/10">
                    <div className="draw-line h-full bg-ink" style={{ transitionDelay: `${i * 140 + 300}ms` }} />
                  </div>
                  <span className="mt-6 block font-display text-[4rem] leading-none text-gold-ink">{i + 1}</span>
                  <h3 className="mt-4 text-xl font-semibold tracking-tight">{step.title}</h3>
                  <p className="mt-2 leading-relaxed text-ink-soft">{step.body}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      <Partners tone="gray" id="sirketler" />

      <Section tone="white" id="sss">
        <div className={`${WRAP} grid gap-12 lg:grid-cols-[5fr_7fr] lg:gap-20`}>
          <Reveal className="lg:sticky lg:top-28 lg:self-start">
            <h2 className={H2}>{page.shortName} hakkında sık sorulanlar</h2>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-ink-soft">
              Aradığınızı bulamadıysanız Sofya&apos;ya sorabilir ya da danışmanımıza yazabilirsiniz.
            </p>
          </Reveal>
          <FaqAccordion items={page.faq} />
        </div>

        <div className={`${WRAP} mt-16`}>
          <Reveal>
            <h2 className="font-display text-[2rem] leading-tight">{page.related.title}</h2>
            <ul className="mt-5 flex flex-wrap gap-3">
              {page.related.slugs.map((slug) => {
                const related = PRODUCTS.find((item) => item.slug === slug);
                if (!related) return null;
                return (
                  <li key={slug}>
                    <AppLink
                      href={`/urunler/${slug}`}
                      className="group inline-flex items-center gap-2 rounded-full border border-ink/15 bg-pearl px-5 py-3 text-[0.9375rem] font-medium transition-colors hover:border-gold hover:bg-gold/15"
                    >
                      {related.name}
                      <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
                    </AppLink>
                  </li>
                );
              })}
            </ul>
          </Reveal>
        </div>

        <div className={`${WRAP} mt-14`}>
          <Reveal className="border-t border-ink/10 pt-8">
            <AppLink href={`/urunler/${next.slug}`} className="group flex items-center justify-between gap-6">
              <span>
                <span className="block text-[0.875rem] text-ink-soft">Sıradaki sigorta</span>
                <span className="mt-1 block font-display text-[2.5rem] leading-none transition-colors group-hover:text-gold-ink sm:text-[3.5rem]">
                  {next.name}
                </span>
              </span>
              <span className="grid size-14 shrink-0 place-items-center rounded-full border border-ink/20 transition-all duration-300 group-hover:border-gold group-hover:bg-gold group-hover:text-night">
                <ArrowRightIcon className="size-5" />
              </span>
            </AppLink>
          </Reveal>
        </div>
      </Section>

    </PageTransition>
  );
}
