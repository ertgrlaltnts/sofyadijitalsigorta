import Image from "next/image";
import type { CSSProperties } from "react";
import { BoltIcon, CheckIcon, CompareIcon, LockIcon } from "./icons";
import { Reveal } from "./reveal";
import { H2, WRAP, toneClass, type Tone } from "./sections";

const POINTS = [
  {
    title: "Güvenli altyapı",
    body: "TC kimlik no, kart no, IBAN gibi hassas bilgiler kaydedilmeden ve yapay zekaya gönderilmeden önce maskelenir. Verileriniz yalnızca ihtiyaç duyulan kadar işlenir.",
    Icon: LockIcon,
  },
  {
    title: "Şeffaf ve karşılaştırmalı teklif",
    body: "Anlaşmalı şirketlerin teklifleri yan yana gelir. Teminatlar, muafiyetler ve fiyat farkları sade bir dille anlatılır; gizli kalem bırakılmaz.",
    Icon: CompareIcon,
  },
  {
    title: "Hızlı ve kolay süreç",
    body: "Uzun formlar yok. İhtiyacınızı sohbete yazın, Sofya tek tek sade sorular sorsun. Teklifiniz dakikalar içinde hazır olsun.",
    Icon: BoltIcon,
  },
];

const CHIPS = [
  { text: "Bilgileriniz maskelenir", className: "top-[5%] right-0 sm:-right-4", Icon: LockIcon, fd: "0s", fdur: "7s" },
  { text: "Teklifler yan yana", className: "top-[64%] right-0 sm:-right-6", Icon: CompareIcon, fd: "-2s", fdur: "8s" },
  { text: "Dakikalar içinde", className: "bottom-[8%] left-1 sm:-left-2", Icon: BoltIcon, fd: "-4s", fdur: "6.5s" },
];

/** Three promises (security, transparent comparison, speed) next to Sofya. */
export function Trust({ tone = "gray" }: { tone?: Tone }) {
  return (
    <section className={`on-light ${toneClass(tone)} overflow-hidden py-20 text-ink lg:py-28`}>
      <div className={`${WRAP} grid items-center gap-14 lg:grid-cols-[5fr_7fr] lg:gap-20`}>
        <Reveal variant="scale" className="order-2 lg:order-1">
          <div className="relative mx-auto aspect-square w-full max-w-[28rem]">
            <div aria-hidden className="absolute inset-[6%] rounded-full bg-gradient-to-b from-gold/35 via-gold/15 to-transparent" />
            <div aria-hidden className="absolute inset-[6%] rounded-full ring-1 ring-gold/50" />
            <div aria-hidden className="absolute inset-[-1%] rounded-full border border-dashed border-ink/15" />

            <Image
              src="/sofya-hello.png"
              alt="Sofya, yapay zeka sigorta danışmanı"
              width={1600}
              height={1600}
              quality={90}
              sizes="(min-width: 1024px) 448px, 90vw"
              className="absolute inset-0 size-full object-contain [mask-image:linear-gradient(to_bottom,black_82%,transparent)]"
            />

            {CHIPS.map(({ text, className, Icon, fd, fdur }) => (
              <div
                key={text}
                className={`bubble-float absolute z-10 flex items-center gap-2 rounded-full border border-ink/10 bg-white py-2 pr-4 pl-2 text-[0.875rem] font-medium shadow-[0_18px_30px_-16px_rgba(15,26,48,0.35)] ${className}`}
                style={{ "--fd": fd, "--fdur": fdur } as CSSProperties}
              >
                <span className="grid size-7 place-items-center rounded-full bg-ink text-gold">
                  <Icon className="size-4" />
                </span>
                {text}
              </div>
            ))}
          </div>
        </Reveal>

        <div className="order-1 lg:order-2">
          <Reveal>
            <h2 className={`${H2} max-w-2xl`}>Şeffaf, hızlı ve güvenli.</h2>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-soft">
              Sigorta almak karmaşık olmak zorunda değil. Sofya her adımda ne yaptığını açıkça söyler.
            </p>
          </Reveal>

          <ul className="mt-10 space-y-4">
            {POINTS.map(({ title, body, Icon }, index) => (
              <li key={title}>
                <Reveal variant="right" delay={index * 140}>
                  <div className="group relative flex gap-5 rounded-[1.5rem] border border-ink/10 bg-white p-5 transition-[translate,box-shadow,border-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-gold hover:shadow-[0_28px_40px_-28px_rgba(15,26,48,0.4)] sm:p-6">
                    <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-ink text-gold">
                      <Icon className="size-7" strokeWidth={1.6} />
                    </span>
                    <div>
                      <h3 className="flex items-center gap-2 text-xl font-semibold tracking-tight">
                        {title}
                        <CheckIcon className="size-4 text-gold-deep" strokeWidth={2.4} />
                      </h3>
                      <p className="mt-1.5 leading-relaxed text-ink-soft">{body}</p>
                    </div>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
