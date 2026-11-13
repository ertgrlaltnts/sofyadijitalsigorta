import { FAQ, PRODUCTS } from "@/lib/content";
import { AppLink } from "./app-link";
import { AskButton } from "./ask-button";
import Image from "next/image";
import { ArrowRightIcon } from "./icons";
import { JsonLd } from "./json-ld";
import { Reveal } from "./reveal";
import { Faq, H2, WRAP, toneClass, type Tone } from "./sections";

const GUIDE = [
  {
    title: "Araç sigortaları: kasko, trafik ve İMM",
    body: "Zorunlu trafik sigortası, kazada karşı tarafa verdiğiniz zararları karşılar ve aracı olan herkes için yasal bir zorunluluktur. Kasko isteğe bağlıdır; çarpma, çalınma ve yangın gibi risklerde aracınızın kendi hasarını güvence altına alır. İMM (İhtiyari Mali Mesuliyet) sigortası ise trafik sigortası limitleri yetersiz kaldığında ek teminat sağlar. Teklifleri karşılaştırırken yalnızca fiyata değil, teminat kapsamına ve muafiyet tutarına da bakın.",
    slugs: ["kasko", "trafik-sigortasi", "imm"],
  },
  {
    title: "Ev ve eşyalar: DASK ve konut sigortası",
    body: "DASK, tapu kaydı olan konutlar için zorunlu deprem sigortasıdır ve yalnızca binayı güvence altına alır. Evin içindeki eşyalar için yangın, su baskını ve hırsızlık gibi risklere karşı konut sigortası gerekir. Kiracılar da kendi eşyaları için konut sigortası yaptırabilir.",
    slugs: ["dask", "konut-sigortasi"],
  },
  {
    title: "Sağlık, seyahat ve kişisel güvence",
    body: "Tamamlayıcı sağlık sigortası, SGK'lıların anlaşmalı özel hastanelerde ilave fark ücreti ödemeden hizmet almasına yardımcı olur. Seyahat sigortası yurt dışı yolculuklarda sağlık giderlerine karşı teminat sağlar ve bazı ülkelerin vize başvurularında istenir. Ferdi kaza sigortası ise kaza sonucu oluşabilecek ölüm, sakatlık ve tedavi giderlerine karşı güvence verir.",
    slugs: ["tamamlayici-saglik", "seyahat-sigortasi", "ferdi-kaza"],
  },
  {
    title: "Sofya size nasıl yardımcı olur?",
    body: "Sofya, form doldurmanızı beklemeden ihtiyacınızı sohbet ederek anlar. Muafiyet, teminat ve limit gibi sigorta terimlerini sade bir dille açıklar, bilmediği konuda bilgi uydurmaz ve kesin fiyat ile poliçe işlemleri için sizi uzman danışmanlarımıza yönlendirir.",
    slugs: [] as string[],
  },
];

/** Plain, crawlable explanation of the products, with internal links to each product page. */
export function SeoContent({ tone = "gray" }: { tone?: Tone }) {
  return (
    <section className={`on-light ${toneClass(tone)} py-20 text-ink lg:py-28`}>
      <div className={`${WRAP} grid gap-12 lg:grid-cols-[5fr_7fr] lg:gap-20`}>
        <Reveal className="lg:sticky lg:top-28 lg:self-start">
          <h2 className={H2}>Sigortanızı bilinçli seçmenin kolay yolu</h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-ink-soft">
            Sofya Dijital Sigorta, yapay zeka destekli sigorta asistanınızdır. Kasko, trafik, DASK, konut, sağlık ve seyahat
            sigortasında sorularınızı yanıtlar, teminatları sade bir dille anlatır ve teklif almanız için sizi yönlendirir.
          </p>
          <AskButton className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-ink px-6 text-[0.9375rem] font-semibold text-white transition-colors hover:bg-ink-soft">
            Sofya&apos;ya sorun
          </AskButton>
        </Reveal>

        <div className="divide-y divide-ink/10 border-y border-ink/10">
          {GUIDE.map((block, index) => (
            <Reveal key={block.title} delay={index * 80}>
              <article className="py-8">
                <h3 className="font-display text-[1.75rem] leading-tight">{block.title}</h3>
                <p className="mt-3 leading-relaxed text-ink-soft">{block.body}</p>
                {block.slugs.length > 0 && (
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {block.slugs.map((slug) => {
                      const product = PRODUCTS.find((item) => item.slug === slug);
                      if (!product) return null;
                      return (
                        <li key={slug}>
                          <AppLink
                            href={`/urunler/${slug}`}
                            className="group inline-flex items-center gap-1.5 rounded-full border border-ink/15 bg-white px-4 py-2 text-[0.9375rem] font-medium transition-colors hover:border-gold hover:bg-gold/15"
                          >
                            {product.name}
                            <ArrowRightIcon className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                          </AppLink>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Home FAQ. The same questions are published as FAQPage structured data. */
export function HomeFaq({ tone = "white" }: { tone?: Tone }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <section className={`on-light ${toneClass(tone)} py-20 text-ink lg:py-28`}>
      <JsonLd data={schema} />
      <div className={`${WRAP} grid gap-12 lg:grid-cols-[5fr_7fr] lg:gap-20`}>
        <Reveal className="lg:sticky lg:top-28 lg:self-start">
          <h2 className={H2}>Sık sorulan sorular</h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-ink-soft">
            Sigortayla ilgili en çok merak edilenler. Aradığınızı bulamazsanız Sofya&apos;ya sorabilirsiniz.
          </p>
          <AppLink
            href="/sss"
            className="group mt-8 inline-flex h-12 items-center gap-2 rounded-full border border-ink/20 px-6 text-[0.9375rem] font-medium transition-colors hover:border-ink hover:bg-ink hover:text-white"
          >
            Tüm sorular
            <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
          </AppLink>

          <div className="mt-10 hidden items-center gap-4 rounded-[1.5rem] border border-ink/10 bg-pearl p-5 lg:flex">
            <span className="relative size-14 shrink-0 overflow-hidden rounded-full bg-white ring-2 ring-gold/60">
              <Image src="/sofya-avatar.png" alt="" fill sizes="56px" quality={90} className="object-cover" />
            </span>
            <div>
              <p className="font-semibold">Aradığınızı bulamadınız mı?</p>
              <AskButton className="mt-1 text-[0.9375rem] font-medium text-gold-ink underline decoration-gold/60 underline-offset-4 transition-colors hover:text-ink">
                Sofya&apos;ya sorun
              </AskButton>
            </div>
          </div>
        </Reveal>
        <Faq />
      </div>
    </section>
  );
}
