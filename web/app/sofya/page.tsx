import type { Metadata } from "next";
import { AskButton } from "@/components/ask-button";
import { FaqAccordion } from "@/components/faq-accordion";
import { ArrowRightIcon, ClockIcon, ShieldIcon } from "@/components/icons";
import { JsonLd } from "@/components/json-ld";
import { PageHero } from "@/components/page-hero";
import { PageTransition } from "@/components/page-transition";
import { Reveal } from "@/components/reveal";
import { H2, WRAP } from "@/components/sections";
import { SectionNav } from "@/components/section-nav";
import { Capabilities, Examples, Guarantees, Handoff, HowItWorks, SOFYA_FAQ, SofyaVisual } from "@/components/sofya-sections";
import { OG_IMAGES, TWITTER_IMAGES } from "@/lib/site";

const TITLE = "Sofya: Yapay Zeka Sigorta Asistanı";
const DESCRIPTION =
  "Sofya, yapay zeka destekli sigorta asistanıdır: sigorta sorularınızı yanıtlar, terimleri sadeleştirir, sizi teklife yönlendirir. Nasıl çalıştığını öğrenin.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: `${TITLE} | Sofya Dijital Sigorta`,
    description: DESCRIPTION,
    url: "/sofya",
    locale: "tr_TR",
    type: "website",
    siteName: "Sofya Dijital Sigorta",
    images: OG_IMAGES,
  },
  twitter: { card: "summary_large_image", title: `${TITLE} | Sofya Dijital Sigorta`, description: DESCRIPTION, images: TWITTER_IMAGES },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: SOFYA_FAQ.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

export default function SofyaPage() {
  return (
    <PageTransition>
      <SectionNav
        items={[
          { id: "ne-yapar", label: "Ne yapar" },
          { id: "nasil", label: "Nasıl çalışır" },
          { id: "guvence", label: "Güvence" },
          { id: "sorular", label: "Sorular" },
          { id: "danisman", label: "Danışman" },
          { id: "sss", label: "SSS" },
        ]}
      />
      <JsonLd data={faqSchema} />

      <PageHero
        crumbs={[{ label: "Sofya" }]}
        title="Tanışın: Sofya."
        intro="Sofya, yapay zeka destekli sigorta asistanınızdır. Sorularınızı yanıtlar, sigorta terimlerini sadeleştirir ve teklife giden yolda size eşlik eder."
        visual={<SofyaVisual />}
      >
        <div className="flex flex-wrap gap-3">
          <AskButton className="group inline-flex h-12 items-center gap-2 rounded-full bg-gold px-6 text-[0.9375rem] font-semibold text-night transition-colors hover:bg-gold-hi">
            Sofya&apos;yla konuşun
            <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" strokeWidth={2.2} />
          </AskButton>
          <a
            href="#nasil"
            className="inline-flex h-12 items-center gap-2 rounded-full border border-white/25 px-6 text-[0.9375rem] font-medium text-white transition-colors hover:border-white/60 hover:bg-white/10"
          >
            Nasıl çalışır?
          </a>
        </div>
        <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-[0.9375rem] text-pearl/75">
          <li className="flex items-center gap-2">
            <ClockIcon className="size-[1.125rem] text-gold" />
            7/24 yanıt verir
          </li>
          <li className="flex items-center gap-2">
            <ShieldIcon className="size-[1.125rem] text-gold" />
            Hassas bilgileri maskeler
          </li>
        </ul>
      </PageHero>

      <Capabilities />
      <HowItWorks />
      <Guarantees />
      <Examples />
      <Handoff />

      <section id="sss" className="on-light scroll-mt-28 bg-pearl py-20 text-ink lg:scroll-mt-16 lg:py-28">
        <div className={`${WRAP} grid gap-12 lg:grid-cols-[5fr_7fr] lg:gap-20`}>
          <Reveal className="lg:sticky lg:top-28 lg:self-start">
            <h2 className={H2}>Sofya hakkında sık sorulanlar</h2>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-ink-soft">
              Aradığınızı bulamadıysanız doğrudan Sofya&apos;ya sorabilirsiniz.
            </p>
            <AskButton className="group mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-ink px-6 text-[0.9375rem] font-semibold text-white transition-colors hover:bg-ink-soft">
              Sofya&apos;ya sorun
              <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
            </AskButton>
          </Reveal>
          <FaqAccordion items={SOFYA_FAQ} />
        </div>
      </section>
    </PageTransition>
  );
}
