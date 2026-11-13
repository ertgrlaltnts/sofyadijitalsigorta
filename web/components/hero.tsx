import Image from "next/image";
import type { CSSProperties } from "react";
import { CONTACT, HERO_BUBBLES } from "@/lib/content";
import { AppLink } from "./app-link";
import { Bubble } from "./bubble";
import { ArrowRightIcon, ClockIcon, ShieldIcon, WhatsAppIcon } from "./icons";
import { Parallax } from "./parallax";
import { SofyaChat } from "./sofya-chat";
import { TechPattern } from "./tech-pattern";
import { Words } from "./words";

const BUBBLE_LAYOUT = [
  { className: "left-0 top-[6%]", delay: 1.0, depth: 26, float: 7 },
  { className: "right-0 top-[20%]", delay: 1.5, depth: -22, float: 8 },
  { className: "-left-1 top-[38%] hidden sm:block", delay: 2.0, depth: 34, float: 6.5 },
  { className: "right-0 top-[44%] hidden sm:block", delay: 2.5, depth: -30, float: 7.5 },
  { className: "left-[3%] top-[66%]", delay: 3.0, depth: 22, float: 8.5 },
  { className: "right-[2%] top-[70%] hidden sm:block", delay: 3.5, depth: -18, float: 6 },
];

const SPARKLES = [
  "left-[22%] top-[10%]",
  "right-[24%] top-[6%]",
  "left-[8%] top-[52%]",
  "right-[10%] top-[58%]",
  "left-[40%] top-[88%]",
  "right-[34%] top-[30%]",
];

export function Hero() {
  return (
    <section
      id="hero"
      className="relative isolate -mt-16 overflow-hidden bg-night pt-[4.5rem] pb-20 text-pearl lg:pt-[5.5rem] lg:pb-28"
    >
      <div aria-hidden className="aurora" />
      <TechPattern />

      <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-5 sm:px-8 lg:grid-cols-[1.2fr_1fr] lg:gap-6">
        <Parallax className="relative mx-auto w-full max-w-[42rem]">
          <div className="relative mx-auto h-[26rem] w-full sm:h-[33rem]">
            <div
              className="px absolute inset-x-0 top-0 mx-auto aspect-square w-[21rem] sm:w-[29rem]"
              style={{ "--depth": -16 } as CSSProperties}
            >
              <svg viewBox="0 0 100 100" aria-hidden className="size-full -rotate-90">
                <circle cx="50" cy="50" r="49" fill="none" stroke="rgba(226,184,106,0.16)" strokeWidth="0.3" />
                <circle
                  cx="50"
                  cy="50"
                  r="49"
                  fill="none"
                  stroke="url(#hero-ring)"
                  strokeWidth="0.8"
                  strokeLinecap="round"
                  pathLength={1}
                  className="ring-draw"
                />
                <g className="ring-spin">
                  <circle cx="50" cy="1" r="1.4" fill="#f0c97a" />
                </g>
                <defs>
                  <linearGradient id="hero-ring" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#f0c97a" />
                    <stop offset="1" stopColor="#b98a3c" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {SPARKLES.map((position, i) => (
              <span
                key={position}
                aria-hidden
                className={`twinkle absolute size-1.5 rounded-full bg-gold ${position}`}
                style={{ "--td": `${i * 0.7}s`, "--tdur": `${3 + (i % 3)}s` } as CSSProperties}
              />
            ))}

            <div
              className="px absolute inset-x-0 bottom-0 z-10 mx-auto w-[19.5rem] sm:w-[29rem]"
              style={{ "--depth": -9 } as CSSProperties}
            >
              <div className="sofya-rise">
                <div className="sofya-breathe">
                  <Image
                    src="/sofya-master.png"
                    alt="Sofya, yapay zeka sigorta danışmanı"
                    width={1600}
                    height={1600}
                    priority
                    quality={90}
                    sizes="(min-width: 640px) 464px, 312px"
                    className="aspect-square w-full -translate-x-[3%] [mask-image:linear-gradient(to_bottom,black_80%,transparent)]"
                  />
                </div>
              </div>
            </div>

            {HERO_BUBBLES.map((bubble, i) => (
              <Bubble key={bubble.text} from={bubble.from} text={bubble.text} {...BUBBLE_LAYOUT[i]} />
            ))}
          </div>

          <div className="relative z-20 -mt-14 text-center sm:-mt-16">
            <h1 className="font-display text-[2.75rem] leading-[1.02] tracking-[-0.02em] text-balance text-white sm:text-[3.75rem] xl:text-[4.25rem]">
              <Words text="Sigorta teklifi almak bir sohbet kadar kolay." base={0.15} />
            </h1>
            <p className="fade-up mx-auto mt-5 max-w-[34rem] text-[1.0625rem] leading-relaxed text-pearl/75 [--d:1.4s] sm:text-lg">
              Sofya sorularınızı yanıtlar, teminatları sade bir dille anlatır ve teklif için sizi doğru yere götürür. Form yok,
              bekleme yok.
            </p>

            <div className="fade-up mt-7 flex flex-wrap justify-center gap-3 [--d:1.6s]">
              <a
                href={`${CONTACT.quoteBase}/kasko-sigortasi`}
                className="group inline-flex h-12 items-center gap-2 rounded-full bg-gold px-6 text-[0.9375rem] font-semibold text-night transition-colors hover:bg-gold-hi"
              >
                Kasko teklifi al
                <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" strokeWidth={2.2} />
              </a>
              <AppLink
                href="/urunler"
                className="inline-flex h-12 items-center gap-2 rounded-full border border-white/20 px-6 text-[0.9375rem] font-medium text-white transition-colors hover:border-white/50"
              >
                Sigorta türleri
              </AppLink>
              <a
                href={CONTACT.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp ile danışmana yazın"
                className="hidden size-12 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:border-[#25d366] hover:text-[#25d366] sm:inline-flex"
              >
                <WhatsAppIcon className="size-5" />
              </a>
            </div>

            <ul className="fade-up mt-8 flex flex-wrap justify-center gap-x-8 gap-y-3 text-[0.9375rem] text-pearl/65 [--d:1.8s]">
              <li className="flex items-center gap-2.5">
                <ClockIcon className="size-[1.125rem] text-gold" />
                7/24 destek
              </li>
              <li className="flex items-center gap-2.5">
                <ShieldIcon className="size-[1.125rem] text-gold" />
                Şeffaf ve güvenilir
              </li>
            </ul>
          </div>
        </Parallax>

        <div className="stage-in mx-auto w-full max-w-[30rem] lg:mr-0 lg:ml-auto lg:self-center">
          <SofyaChat mode="launcher" className="h-[min(40rem,calc(100svh-6rem))] min-h-[30rem]" />
        </div>
      </div>
    </section>
  );
}
