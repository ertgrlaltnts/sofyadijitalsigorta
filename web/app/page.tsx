import type { Metadata } from "next";
import { Hero } from "@/components/hero";
import { HomeFaq, SeoContent } from "@/components/home-seo";
import { Marquee } from "@/components/marquee";
import { PageTransition } from "@/components/page-transition";
import { Partners } from "@/components/partners";
import { ProductGrid } from "@/components/product-grid";
import { Reveal } from "@/components/reveal";
import { H2, WRAP } from "@/components/sections";
import { Trust } from "@/components/trust";
import { HOME_DESCRIPTION, HOME_TITLE, OG_IMAGES, TWITTER_IMAGES } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: HOME_TITLE },
  description: HOME_DESCRIPTION,
  openGraph: { title: HOME_TITLE, description: HOME_DESCRIPTION, url: "/", locale: "tr_TR", type: "website", siteName: "Sofya Dijital Sigorta", images: OG_IMAGES },
  twitter: { card: "summary_large_image", title: HOME_TITLE, description: HOME_DESCRIPTION, images: TWITTER_IMAGES },
};

// The customer-testimonial section (components/reviews.tsx) is left out on purpose until real, consented quotes exist.
export default function Home() {
  return (
    <PageTransition>
      <Hero />
      <Marquee />

      <section className="on-light bg-white py-20 text-ink lg:py-28">
        <div className={WRAP}>
          <Reveal>
            <h2 className={`${H2} max-w-2xl`}>Hangi sigortayı arıyorsunuz?</h2>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-ink-soft">
              Birini seçin, ayrıntıları görün ve Sofya&apos;ya sorun.
            </p>
          </Reveal>
          <div className="mt-12">
            <ProductGrid surface="white" />
          </div>
        </div>
      </section>

      <Trust tone="gray" />
      <Partners />
      <SeoContent tone="gray" />
      <HomeFaq tone="white" />
    </PageTransition>
  );
}
