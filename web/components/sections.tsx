import Image from "next/image";
import { CONTACT, FAQ, PRIVACY_POINTS, STEPS } from "@/lib/content";
import { AppLink } from "./app-link";
import { AskButton } from "./ask-button";
import { FaqAccordion } from "./faq-accordion";
import { ArrowRightIcon, PhoneIcon, ShieldIcon, WhatsAppIcon } from "./icons";
import { Reveal } from "./reveal";

export const WRAP = "mx-auto w-full max-w-7xl px-5 sm:px-8";
export const H2 = "font-display text-[2.5rem] leading-[1.05] tracking-[-0.015em] text-balance sm:text-[3.5rem]";

export type Tone = "white" | "gray";
export const toneClass = (tone: Tone) => (tone === "white" ? "bg-white" : "bg-pearl");

export function Steps({ tone = "gray" }: { tone?: Tone }) {
  return (
    <section className={`on-light ${toneClass(tone)} py-20 text-ink lg:py-28`}>
      <div className={WRAP}>
        <Reveal>
          <h2 className={`${H2} max-w-2xl`}>Üç adımda, dakikalar içinde.</h2>
        </Reveal>
        <ol className="mt-14 grid gap-12 md:grid-cols-3 md:gap-8">
          {STEPS.map((step, index) => (
            <li key={step.title}>
              <Reveal delay={index * 160}>
                <div className="h-0.5 bg-ink/10">
                  <div className="draw-line h-full bg-ink" style={{ transitionDelay: `${index * 160 + 300}ms` }} />
                </div>
                <span className="mt-6 block font-display text-[4.5rem] leading-none text-gold-ink">{index + 1}</span>
                <h3 className="mt-4 text-xl font-semibold tracking-tight">{step.title}</h3>
                <p className="mt-2 leading-relaxed text-ink-soft">{step.body}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Privacy({ link = false, tone = "gray" }: { link?: boolean; tone?: Tone }) {
  return (
    <section className={`on-light ${toneClass(tone)} py-20 text-ink lg:py-28`}>
      <div className={WRAP}>
        <Reveal variant="scale">
          <div className="relative overflow-hidden rounded-[2rem] border border-ink/10 bg-white p-8 shadow-[0_30px_60px_-40px_rgba(15,26,48,0.25)] sm:p-12 lg:p-16">
            <div aria-hidden className="pointer-events-none absolute -top-32 -left-32 size-96 rounded-full bg-gold/20 blur-3xl" />
            <div className="relative grid gap-12 lg:grid-cols-[5fr_7fr] lg:gap-16">
              <div>
                <h2 className={H2}>Verileriniz sohbette de güvende.</h2>
                <p className="mt-5 max-w-md text-lg leading-relaxed text-ink-soft">
                  Sigorta kişisel bilgi demektir. Sofya&apos;yı, ihtiyaç duymadığı hiçbir bilgiyi tutmayacak şekilde kurduk.
                </p>
                {link && (
                  <AppLink
                    href="/sofya"
                    className="group mt-8 inline-flex h-12 items-center gap-2 rounded-full border border-ink/20 px-6 text-[0.9375rem] font-medium transition-colors hover:border-ink hover:bg-ink hover:text-white"
                  >
                    Sofya nasıl çalışır?
                    <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
                  </AppLink>
                )}
              </div>
              <ul className="space-y-7">
                {PRIVACY_POINTS.map((point, index) => (
                  <li key={point.title}>
                    <Reveal variant="right" delay={200 + index * 140} className="flex gap-4">
                      <span className="grid size-11 shrink-0 place-items-center rounded-full bg-ink text-gold">
                        <ShieldIcon className="size-5" />
                      </span>
                      <div>
                        <h3 className="text-lg font-semibold">{point.title}</h3>
                        <p className="mt-1.5 leading-relaxed text-ink-soft">{point.body}</p>
                      </div>
                    </Reveal>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Faq({ items = FAQ }: { items?: typeof FAQ }) {
  return <FaqAccordion items={items} />;
}

/**
 * Closing call to action: a dark card with Sofya waving on the right, a headline, and three ways to continue
 * (ask Sofya, WhatsApp, phone). The section sits on a very light tint between white and the pearl gray used by the neighbouring sections.
 */
export function FinalCta({ title = "Poliçenizi birlikte netleştirelim." }: { title?: string }) {
  const channel =
    "group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-sm transition-[background-color,border-color,translate] duration-300 hover:-translate-y-0.5 hover:border-gold/60 hover:bg-white/10";

  return (
    <section className="relative bg-[#f9fafc] pt-6 pb-16 text-pearl lg:pt-10 lg:pb-24">
      <div className={WRAP}>
        <Reveal variant="scale">
          <div className="relative isolate overflow-hidden rounded-[2rem] bg-navy text-pearl ring-1 ring-white/10 shadow-[0_40px_90px_-40px_rgba(0,0,0,0.7)] lg:rounded-[2.5rem]">
            <div aria-hidden className="aurora" />
            <div aria-hidden className="pointer-events-none absolute -top-32 -left-24 -z-10 size-[28rem] rounded-full bg-gold/15 blur-3xl" />
            <svg
              viewBox="0 0 100 100"
              aria-hidden
              className="ring-spin pointer-events-none absolute top-1/2 -right-32 -z-10 size-[34rem] -translate-y-1/2 text-gold/30 [animation-duration:90s] lg:right-0 lg:size-[40rem]"
            >
              <circle cx="50" cy="50" r="49" fill="none" stroke="currentColor" strokeWidth="0.25" strokeDasharray="0.6 1.4" />
              <circle cx="50" cy="50" r="38" fill="none" stroke="currentColor" strokeWidth="0.25" />
              <circle cx="50" cy="12" r="1.2" fill="#f0c97a" />
            </svg>

            <div className="grid items-center gap-10 px-6 pt-12 sm:px-12 lg:grid-cols-[1.25fr_0.75fr] lg:gap-6 lg:px-16 lg:pt-16">
              <div className="pb-12 lg:pb-16">
                <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-3.5 py-1.5 text-[0.8125rem] font-medium text-gold">
                  <span className="size-2 rounded-full bg-online shadow-[0_0_0_4px_rgba(46,229,106,0.18)]" />
                  Sofya çevrimiçi, 7/24 yanıt verir
                </span>
                <h2 className="mt-6 max-w-2xl font-display text-[2.5rem] leading-[1.05] tracking-[-0.015em] text-balance text-white sm:text-[3.5rem]">
                  {title}
                </h2>
                <p className="mt-5 max-w-xl text-lg leading-relaxed text-pearl/75">
                  Sorunuzu Sofya&apos;ya yazın ya da danışmanlarımızla konuşun. Size en uygun poliçeyi belirlemenize ve risklerinizi yönetmenize yardımcı olalım.
                </p>

                <div className="mt-8 grid max-w-xl gap-3 sm:grid-cols-2">
                  <AskButton className={`${channel} text-left`}>
                    <span className="relative size-12 shrink-0 overflow-hidden rounded-full bg-white ring-2 ring-gold/60">
                      <Image src="/sofya-avatar.png" alt="" fill sizes="48px" quality={90} className="object-cover" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold text-white">Sofya&apos;ya sorun</span>
                      <span className="block text-[0.8125rem] text-pearl/60">Hemen yanıtlasın</span>
                    </span>
                    <ArrowRightIcon className="size-4 shrink-0 text-gold transition-transform group-hover:translate-x-1" />
                  </AskButton>

                  <a href={CONTACT.whatsappUrl} target="_blank" rel="noopener noreferrer" className={channel}>
                    <span className="grid size-12 shrink-0 place-items-center rounded-full bg-[#25D366] text-white">
                      <WhatsAppIcon className="size-7" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold text-white">WhatsApp</span>
                      <span className="block text-[0.8125rem] text-pearl/60">Danışmana yazın</span>
                    </span>
                    <ArrowRightIcon className="size-4 shrink-0 text-gold transition-transform group-hover:translate-x-1" />
                  </a>
                </div>

                <a
                  href={CONTACT.phoneHref}
                  className="mt-5 inline-flex items-center gap-2 text-[0.9375rem] text-pearl/70 transition-colors hover:text-gold"
                >
                  <PhoneIcon className="size-4 text-gold" />
                  Ya da arayın: {CONTACT.phone}
                </a>
              </div>

              <div className="relative mx-auto -mb-px hidden w-full max-w-[26rem] self-end sm:block lg:max-w-none">
                <div aria-hidden className="absolute inset-0 bg-[radial-gradient(closest-side_at_50%_46%,rgba(226,184,106,0.28),transparent_72%)]" />
                <Image
                  src="/sofya-hello.png"
                  alt=""
                  width={1600}
                  height={1600}
                  quality={90}
                  sizes="(min-width: 1024px) 420px, 340px"
                  className="relative aspect-square w-full [mask-image:linear-gradient(to_bottom,black_88%,transparent)]"
                />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
