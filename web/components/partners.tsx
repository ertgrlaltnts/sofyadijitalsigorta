import Image from "next/image";
import { PARTNERS } from "@/lib/content";
import { Reveal } from "./reveal";
import { H2, WRAP } from "./sections";

function Row({ items, reverse = false }: { items: typeof PARTNERS; reverse?: boolean }) {
  // One loop copy has to be wider than the widest screen, so each copy lists the partners twice.
  const loop = [...items, ...items];
  return (
    <div className={`marquee ${reverse ? "marquee-reverse" : ""} relative overflow-hidden py-2`}>
      <div className="marquee-track [animation-duration:70s]">
        {[0, 1].map((copy) => (
          <ul key={copy} aria-hidden={copy === 1} className="flex shrink-0">
            {loop.map((partner, i) => (
              <li key={`${partner.file}-${i}`} className="px-3">
                <div className="group grid h-24 w-44 place-items-center rounded-2xl border border-ink/10 bg-white px-4 transition-[translate,scale,rotate,transform,box-shadow,border-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:border-gold hover:shadow-[0_18px_30px_-18px_rgba(15,26,48,0.35)] sm:h-28 sm:w-52">
                  <Image
                    src={`/partners/${partner.file}.png`}
                    alt={copy === 0 && i < items.length ? partner.name : ""}
                    width={300}
                    height={150}
                    className="h-full w-full object-contain opacity-65 grayscale transition-[filter,opacity] duration-500 group-hover:opacity-100 group-hover:grayscale-0"
                  />
                </div>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

/** Two rows of contracted insurers drifting in opposite directions, container wide, no panel behind them. */
export function Partners({ tone = "white", id }: { tone?: "white" | "gray"; id?: string }) {
  const half = Math.ceil(PARTNERS.length / 2);
  const first = PARTNERS.slice(0, half);
  const second = PARTNERS.slice(half);

  return (
    <section id={id} className={`on-light ${tone === "white" ? "bg-white" : "bg-pearl"} scroll-mt-28 py-20 text-ink lg:scroll-mt-16 lg:py-28`}>
      <div className={WRAP}>
        <Reveal>
          <h2 className={`${H2} max-w-3xl`}>Gücümüzü sektörün liderlerinden alıyoruz.</h2>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-soft">
            Kapsamlı teminatlar sunabilmek için Türkiye&apos;nin önde gelen sigorta şirketleriyle birlikte çalışıyoruz.
          </p>
        </Reveal>
      </div>

      <Reveal variant="scale" className={`${WRAP} mt-12`}>
        <div className="relative overflow-hidden py-2">
          <div className="space-y-3">
            <Row items={first} />
            <Row items={second} reverse />
          </div>
          <div
            aria-hidden
            className={`pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r ${tone === "white" ? "from-white" : "from-pearl"} to-transparent sm:w-24`}
          />
          <div
            aria-hidden
            className={`pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l ${tone === "white" ? "from-white" : "from-pearl"} to-transparent sm:w-24`}
          />
        </div>
      </Reveal>
    </section>
  );
}
