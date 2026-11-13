import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { PageTransition } from "@/components/page-transition";
import { ProductGrid } from "@/components/product-grid";
import { FinalCta, WRAP } from "@/components/sections";

export const metadata: Metadata = {
  title: "Ürünlerimiz",
  description: "Kasko, trafik, DASK, konut, tamamlayıcı sağlık, seyahat, İMM ve ferdi kaza sigortası hakkında sade bilgiler.",
};

export default function ProductsPage() {
  return (
    <PageTransition>
      <PageHero
        crumbs={[{ label: "Ürünlerimiz" }]}
        title="Hangi sigortayı arıyorsunuz?"
        intro="Her sigorta türü için neyi karşıladığını, nelere dikkat etmeniz gerektiğini ve Sofya'ya neler sorabileceğinizi bulun."
      />
      <section className="on-light bg-pearl py-16 text-ink lg:py-24">
        <div className={WRAP}>
          <ProductGrid surface="gray" />
        </div>
      </section>
      <FinalCta title="Emin değilseniz Sofya'ya sorun." />
    </PageTransition>
  );
}
