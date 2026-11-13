import type { Metadata } from "next";
import { AppLink } from "@/components/app-link";
import { Glyph } from "@/components/glyph";
import { ArrowRightIcon } from "@/components/icons";
import { PageHero } from "@/components/page-hero";
import { PageTransition } from "@/components/page-transition";
import { Reveal } from "@/components/reveal";
import { FinalCta, WRAP } from "@/components/sections";
import { GUIDES } from "@/lib/guides";
import { OG_IMAGES, TWITTER_IMAGES } from "@/lib/site";

const DESCRIPTION =
  "Araç yakıt hesaplama, kasko değer listesi, trafik sigortası basamakları, Tramer kaydı ve trafik sigortası fiyatları hakkında sade rehberler.";

export const metadata: Metadata = {
  title: "Rehber ve hesaplama araçları",
  description: DESCRIPTION,
  openGraph: {
    title: "Rehber ve hesaplama araçları | Sofya Dijital Sigorta",
    description: DESCRIPTION,
    url: "/rehber",
    locale: "tr_TR",
    type: "website",
    siteName: "Sofya Dijital Sigorta",
    images: OG_IMAGES,
  },
  twitter: { card: "summary_large_image", title: "Rehber ve hesaplama araçları | Sofya Dijital Sigorta", description: DESCRIPTION, images: TWITTER_IMAGES },
};

export default function GuidesPage() {
  return (
    <PageTransition>
      <PageHero
        crumbs={[{ label: "Rehber" }]}
        title="Rehber ve hesaplama araçları"
        intro="Araç ve sigorta konusunda işinize yarayacak sade rehberler ve pratik hesap araçları."
      />

      <section className="on-light bg-pearl py-16 text-ink lg:py-24">
        <div className={`${WRAP} max-w-5xl`}>
          <ul className="grid gap-4 sm:grid-cols-2">
            {GUIDES.map((guide, i) => (
              <li key={guide.slug} className="flex">
                <Reveal delay={(i % 2) * 100} className="flex w-full">
                  <AppLink
                    href={`/rehber/${guide.slug}`}
                    className="group relative flex h-full w-full flex-col overflow-hidden rounded-[1.5rem] border border-ink/10 bg-white p-7 transition-[translate,box-shadow,border-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:border-gold hover:shadow-[0_34px_50px_-34px_rgba(15,26,48,0.45)]"
                  >
                    <span
                      aria-hidden
                      className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-gold via-gold-hi to-gold transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100"
                    />
                    <div className="flex items-start justify-between gap-4">
                      <span className="grid size-14 place-items-center rounded-full bg-gold/20 text-gold-deep ring-1 ring-gold/50">
                        <Glyph name={guide.icon} className="size-7" />
                      </span>
                      <span className="rounded-full bg-pearl px-3 py-1 text-[0.8125rem] font-medium text-ink-soft">
                        {guide.kind === "calculator" ? "Hesaplama aracı" : "Rehber"}
                      </span>
                    </div>
                    <h2 className="mt-6 font-display text-[1.75rem] leading-tight">{guide.label}</h2>
                    <p className="mt-2 flex-1 leading-relaxed text-ink-soft">{guide.teaser}</p>
                    <span className="mt-6 inline-flex items-center gap-2 text-[0.9375rem] font-semibold text-ink">
                      {guide.kind === "calculator" ? "Hesapla" : "Oku"}
                      <ArrowRightIcon className="size-4 text-gold-deep transition-transform group-hover:translate-x-1" />
                    </span>
                  </AppLink>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <FinalCta />
    </PageTransition>
  );
}
