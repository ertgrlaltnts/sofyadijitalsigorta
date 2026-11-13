import { AppLink } from "@/components/app-link";
import { PageHero } from "@/components/page-hero";

export default function NotFound() {
  return (
    <PageHero title="Bu sayfayı bulamadık." intro="Aradığınız sayfa taşınmış ya da hiç var olmamış olabilir.">
      <AppLink
        href="/"
        className="inline-flex h-12 items-center rounded-full bg-gold px-6 text-[0.9375rem] font-semibold text-night transition-colors hover:bg-gold-hi"
      >
        Anasayfaya dön
      </AppLink>
    </PageHero>
  );
}
