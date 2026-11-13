import { TESTIMONIALS } from "@/lib/content";
import { Reveal } from "./reveal";
import { H2, WRAP, toneClass, type Tone } from "./sections";
import { TestimonialCarousel } from "./testimonial-carousel";

/** Customer testimonials sliding in a row of cards. */
export function Reviews({ tone = "gray" }: { tone?: Tone }) {
  return (
    <section className={`on-light ${toneClass(tone)} overflow-hidden py-20 text-ink lg:py-28`}>
      <div className={WRAP}>
        <Reveal>
          <TestimonialCarousel
            items={TESTIMONIALS}
            header={<h2 className={`${H2} max-w-2xl`}>Müşterilerimiz Sofya&apos;yı anlatıyor.</h2>}
          />
        </Reveal>
      </div>
    </section>
  );
}
