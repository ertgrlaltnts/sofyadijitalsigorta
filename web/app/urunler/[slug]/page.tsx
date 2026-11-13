import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppLink } from "@/components/app-link";
import { AskButton } from "@/components/ask-button";
import { ArrowRightIcon, CheckIcon } from "@/components/icons";
import { PageHero } from "@/components/page-hero";
import { PageTransition } from "@/components/page-transition";
import { Reveal } from "@/components/reveal";
import { FinalCta, H2, WRAP } from "@/components/sections";
import { ProductLanding } from "@/components/product-landing";
import { CONTACT, getProduct, PRODUCTS } from "@/lib/content";
import { PRODUCT_PAGES } from "@/lib/product-pages";
import { OG_IMAGES, TWITTER_IMAGES } from "@/lib/site";

export function generateStaticParams() {
  return PRODUCTS.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: PageProps<"/urunler/[slug]">): Promise<Metadata> {
  const product = getProduct((await params).slug);
  if (!product) return {};
  const page = PRODUCT_PAGES[product.slug];
  const title = page?.title ?? product.name;
  const description = page?.description ?? product.summary;
  const shareTitle = `${title} | Sofya Dijital Sigorta`;
  return {
    title,
    description,
    openGraph: {
      title: shareTitle,
      description,
      url: `/urunler/${product.slug}`,
      locale: "tr_TR",
      type: "website",
      siteName: "Sofya Dijital Sigorta",
      images: OG_IMAGES,
    },
    twitter: { card: "summary_large_image", title: shareTitle, description, images: TWITTER_IMAGES },
  };
}

export default async function ProductPage({ params }: PageProps<"/urunler/[slug]">) {
  const product = getProduct((await params).slug);
  if (!product) notFound();

  const landing = PRODUCT_PAGES[product.slug];
  if (landing) return <ProductLanding product={product} page={landing} />;

  const index = PRODUCTS.findIndex((item) => item.slug === product.slug);
  const next = PRODUCTS[(index + 1) % PRODUCTS.length];

  return (
    <PageTransition>
      <PageHero
        title={product.name}
        intro={product.summary}
        crumbs={[{ label: "Ürünlerimiz", href: "/urunler" }, { label: product.name }]}
      >
        <div className="flex flex-wrap gap-3">
          <a
            href={`${CONTACT.quoteBase}/${product.quote}`}
            className="group inline-flex h-12 items-center gap-2 rounded-full bg-gold px-6 text-[0.9375rem] font-semibold text-night transition-colors hover:bg-gold-hi"
          >
            Teklif al
            <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" strokeWidth={2.2} />
          </a>
          <AskButton
            question={product.question}
            className="inline-flex h-12 items-center gap-2 rounded-full border border-white/25 px-6 text-[0.9375rem] font-medium text-white transition-colors hover:border-white/60 hover:bg-white/10"
          >
            Sofya&apos;ya sor
          </AskButton>
        </div>
      </PageHero>

      <section className="on-light bg-pearl py-20 text-ink lg:py-28">
        <div className={`${WRAP} grid gap-14 lg:grid-cols-[7fr_5fr] lg:gap-20`}>
          <Reveal>
            <h2 className={H2}>Nedir?</h2>
            <p className="mt-6 max-w-2xl text-xl leading-relaxed text-ink-soft sm:text-2xl sm:leading-relaxed">{product.intro}</p>
          </Reveal>
          <div>
            <Reveal>
              <h2 className="font-display text-[2rem] leading-tight">Dikkat edilecekler</h2>
            </Reveal>
            <ul className="mt-6 space-y-5">
              {product.points.map((point, i) => (
                <li key={point}>
                  <Reveal delay={i * 120} variant="right" className="flex gap-4">
                    <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-ink text-gold">
                      <CheckIcon className="size-4" strokeWidth={2.4} />
                    </span>
                    <p className="leading-relaxed text-ink-soft">{point}</p>
                  </Reveal>
                </li>
              ))}
            </ul>
            <p className="mt-8 text-[0.875rem] leading-relaxed text-ink-soft/80">
              Teminat kapsamı, limitler ve muafiyetler şirkete ve poliçeye göre değişir. Satın almadan önce poliçe şartlarını
              okuyun.
            </p>
          </div>
        </div>
      </section>

      <section className="on-light bg-white py-20 text-ink lg:py-28">
        <div className={WRAP}>
          <Reveal>
            <h2 className={`${H2} max-w-2xl`}>Sofya&apos;ya sorabileceğiniz sorular</h2>
          </Reveal>
          <ul className="mt-10 flex flex-wrap gap-3">
            {product.questions.map((question, i) => (
              <li key={question}>
                <Reveal delay={i * 100} variant="scale">
                  <AskButton
                    question={question}
                    className="rounded-full border border-ink/20 bg-pearl px-5 py-3 text-left text-[1rem] transition-[translate,scale,rotate,transform,background-color,color,border-color] duration-300 hover:-translate-y-1 hover:border-ink hover:bg-ink hover:text-white"
                  >
                    {question}
                  </AskButton>
                </Reveal>
              </li>
            ))}
          </ul>

          <Reveal className="mt-16 border-t border-ink/10 pt-8">
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
      </section>

      <FinalCta />
    </PageTransition>
  );
}
