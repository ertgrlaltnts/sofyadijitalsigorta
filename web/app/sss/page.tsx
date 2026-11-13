import type { Metadata } from "next";
import { AskButton } from "@/components/ask-button";
import { FaqTabs } from "@/components/faq-tabs";
import { JsonLd } from "@/components/json-ld";
import { PageHero } from "@/components/page-hero";
import { PageTransition } from "@/components/page-transition";
import { FinalCta, WRAP } from "@/components/sections";
import { ALL_FAQ_ITEMS, FAQ_CATEGORIES } from "@/lib/faq";
import { OG_IMAGES, TWITTER_IMAGES } from "@/lib/site";

const TITLE = "Sık sorulan sorular";
const DESCRIPTION = "Kasko, trafik, DASK, konut, sağlık ve seyahat sigortası hakkında en çok merak edilenler. Kategoriye göre sorulara göz atın.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: `${TITLE} | Sofya Dijital Sigorta`,
    description: DESCRIPTION,
    url: "/sss",
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
  mainEntity: ALL_FAQ_ITEMS.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

export default function FaqPage() {
  return (
    <PageTransition>
      <JsonLd data={faqSchema} />
      <PageHero
        crumbs={[{ label: "Sık sorulan sorular" }]}
        title="Sık sorulan sorular"
        intro="Teminatlar, poliçe yenilemeleri ve en çok merak edilen konular. Aradığınızı bulamazsanız Sofya'ya sorun."
      >
        <AskButton className="inline-flex h-12 items-center rounded-full bg-gold px-6 text-[0.9375rem] font-semibold text-night transition-colors hover:bg-gold-hi">
          Sofya&apos;ya sorun
        </AskButton>
      </PageHero>

      <section className="on-light bg-pearl py-16 text-ink lg:py-24">
        <div className={`${WRAP} max-w-5xl`}>
          <FaqTabs categories={FAQ_CATEGORIES} />
        </div>
      </section>

      <FinalCta />
    </PageTransition>
  );
}
