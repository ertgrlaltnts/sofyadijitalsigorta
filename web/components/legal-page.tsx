import type { Metadata } from "next";
import { LEGAL_CONTACT_LINES, LEGAL_UPDATED, type Block, type LegalDoc } from "@/lib/legal";
import { OG_IMAGES, TWITTER_IMAGES } from "@/lib/site";
import { AppLink } from "./app-link";
import { PageHero } from "./page-hero";
import { PageTransition } from "./page-transition";
import { Reveal } from "./reveal";
import { WRAP } from "./sections";

export function legalMetadata(doc: LegalDoc): Metadata {
  return {
    title: doc.title,
    description: doc.description,
    openGraph: {
      title: `${doc.title} | Sofya Dijital Sigorta`,
      description: doc.description,
      url: `/${doc.slug}`,
      locale: "tr_TR",
      type: "website",
      siteName: "Sofya Dijital Sigorta",
      images: OG_IMAGES,
    },
    twitter: { card: "summary_large_image", title: `${doc.title} | Sofya Dijital Sigorta`, description: doc.description, images: TWITTER_IMAGES },
  };
}

export function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <div className="mt-4 space-y-4">
      {blocks.map((block, i) => {
        if (block.kind === "p") return <p key={i} className="leading-relaxed text-ink-soft">{block.text}</p>;
        if (block.kind === "ul")
          return (
            <ul key={i} className="space-y-2.5">
              {block.items.map((item) => (
                <li key={item} className="flex gap-3 leading-relaxed text-ink-soft">
                  <span aria-hidden className="mt-[0.6rem] size-1.5 shrink-0 rounded-full bg-gold-deep" />
                  {item}
                </li>
              ))}
            </ul>
          );
        if (block.kind === "table")
          return (
            <div key={i} className="overflow-x-auto rounded-2xl border border-ink/10">
              <table className="w-full min-w-[34rem] border-collapse text-left text-[0.9375rem]">
                <thead>
                  <tr className="bg-pearl">
                    {block.head.map((cell) => (
                      <th key={cell} className="px-4 py-3 font-semibold text-ink">
                        {cell}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {block.rows.map((row) => (
                    <tr key={row[0]} className="border-t border-ink/10 align-top">
                      {row.map((cell, c) => (
                        <td key={c} className={`px-4 py-3 leading-relaxed ${c === 0 ? "font-medium text-ink" : "text-ink-soft"}`}>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        return (
          <address key={i} className="rounded-2xl border border-gold/40 bg-gold/10 p-5 text-[0.9375rem] leading-relaxed text-ink not-italic">
            {LEGAL_CONTACT_LINES.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </address>
        );
      })}
    </div>
  );
}

/** A legal text: dark title band, a sticky table of contents beside the numbered sections, and a link to its sibling. */
export function LegalPage({ doc, other }: { doc: LegalDoc; other: { href: string; label: string } }) {
  return (
    <PageTransition>
      <PageHero crumbs={[{ label: doc.title }]} title={doc.heroTitle} intro={doc.intro} />

      <section className="on-light bg-white py-16 text-ink lg:py-24">
        <div className={`${WRAP} grid grid-cols-1 gap-12 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-16`}>
          <aside className="min-w-0 lg:sticky lg:top-24 lg:self-start">
            <p className="text-[0.8125rem] text-ink-soft">Son güncelleme: {LEGAL_UPDATED}</p>
            <nav aria-label="İçindekiler" className="mt-4">
              <ul className="space-y-1 border-l border-ink/10">
                {doc.sections.map((section) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="-ml-px block border-l-2 border-transparent py-1.5 pl-4 text-[0.9375rem] text-ink-soft transition-colors hover:border-gold hover:text-ink"
                    >
                      {section.title.replace(/^\d+\.\s*/, "")}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <AppLink
              href={other.href}
              className="mt-6 inline-flex rounded-full border border-ink/15 px-4 py-2 text-[0.875rem] font-medium transition-colors hover:border-gold hover:bg-gold/15"
            >
              {other.label}
            </AppLink>
          </aside>

          <div className="min-w-0 max-w-3xl space-y-12">
            {doc.sections.map((section) => (
              <Reveal key={section.id}>
                <section id={section.id} className="scroll-mt-28">
                  <h2 className="font-display text-[2rem] leading-tight">{section.title}</h2>
                  <Blocks blocks={section.blocks} />
                </section>
              </Reveal>
            ))}
            <p className="rounded-2xl bg-pearl p-5 text-[0.875rem] leading-relaxed text-ink-soft">
              Bu metin bilgilendirme amaçlıdır. Sigorta teminatları ve fiyatlar için poliçe şartlarına ve danışmanlarımıza başvurunuz.
            </p>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
