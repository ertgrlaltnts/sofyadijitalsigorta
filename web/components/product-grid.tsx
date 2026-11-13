import { PRODUCTS, QUOTE_ACTION } from "@/lib/content";
import { ArrowRightIcon } from "./icons";
import { ProductIcon } from "./product-icon";
import { Reveal } from "./reveal";
import { SpotlightLink } from "./spotlight-link";

const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";

const TILES = [
  ...PRODUCTS.map((product) => ({ slug: product.slug, name: product.name, href: `/urunler/${product.slug}`, external: false })),
  { slug: QUOTE_ACTION.slug, name: QUOTE_ACTION.name, href: QUOTE_ACTION.href, external: true },
];

/**
 * Nine tiles, five to a row on wide screens (the last row is centered). `surface` is the background the grid
 * sits on: tiles take the opposite tone so they always stand out.
 */
export function ProductGrid({ surface = "white" }: { surface?: "white" | "gray" }) {
  const tone = surface === "white" ? "bg-pearl" : "bg-white";

  return (
    <ul className="flex flex-wrap justify-center gap-4">
      {TILES.map((tile, index) => (
        <li key={tile.slug} className="w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.7rem)] lg:w-[calc(20%-0.8rem)]">
          <Reveal delay={(index % 5) * 80} variant="up" className="h-full">
            <SpotlightLink
              href={tile.href}
              external={tile.external}
              className={`group relative flex h-full min-h-[16rem] flex-col items-center justify-start gap-6 overflow-hidden rounded-[1.5rem] border border-ink/10 px-4 pt-10 pb-8 text-center text-ink transition-[translate,scale,rotate,transform,box-shadow,border-color,background-color] duration-[700ms] ${EASE} ${tone} hover:-translate-y-3 hover:border-gold hover:bg-white hover:shadow-[0_40px_60px_-34px_rgba(15,26,48,0.45)] active:-translate-y-1.5 active:duration-150`}
            >
              <span aria-hidden className="spot pointer-events-none absolute inset-0" />
              <span aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
                <span className="card-shine absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/70 to-transparent" />
              </span>
              <span
                aria-hidden
                className={`pointer-events-none absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-gold via-gold-hi to-gold transition-transform duration-[900ms] ${EASE} group-hover:scale-x-100`}
              />

              <span
                aria-hidden
                className={`absolute top-3.5 right-3.5 grid size-8 place-items-center rounded-full border border-ink/15 text-ink/70 transition-[translate,rotate,transform,background-color,border-color,color] duration-[600ms] ${EASE} group-hover:-rotate-45 group-hover:border-gold group-hover:bg-gold group-hover:text-night`}
              >
                <ArrowRightIcon className="size-3.5" />
              </span>

              {/* The icon stays put and keeps its colors: gold rings ripple out and the icon hops once. */}
              <span className="tile-icon relative grid size-28 place-items-center rounded-full">
                <span aria-hidden className="ripple" />
                <span aria-hidden className="ripple ripple-late" />
                <span className="icon-hop relative grid place-items-center">
                  <ProductIcon slug={tile.slug} className="size-28 drop-shadow-[0_8px_10px_rgba(15,26,48,0.12)] transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-110" />
                </span>
              </span>

              <h3 className="relative min-h-[3.575rem] font-display text-[1.625rem] leading-[1.1] text-balance">{tile.name}</h3>
            </SpotlightLink>
          </Reveal>
        </li>
      ))}
    </ul>
  );
}
