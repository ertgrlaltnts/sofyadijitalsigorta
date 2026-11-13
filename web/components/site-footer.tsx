import Image from "next/image";
import { LockIcon } from "./icons";
import { CONTACT, NAV, PRODUCTS } from "@/lib/content";
import { GUIDES } from "@/lib/guides";
import { AppLink } from "./app-link";
import { CookiePreferencesButton } from "./cookie-consent";
import { LEGAL_ENTITY } from "@/lib/legal";

const LEGAL_LINKS = [
  { href: CONTACT.insuranceInfoUrl, label: "Sigorta Ön Bilgilendirme" },
  { href: CONTACT.refundUrl, label: "Cayma, İptal ve İade" },
  { href: CONTACT.kvkkUrl, label: "KVKK Aydınlatma Metni" },
  { href: CONTACT.privacyUrl, label: "Gizlilik Politikası" },
  { href: CONTACT.cookieUrl, label: "Çerez Politikası" },
];

/** What the agency has to show on the site: who it is and its licence. Only the filled-in fields appear. */
const ENTITY_LINE = [
  LEGAL_ENTITY.agencyLicense &&
    `Sigorta acentesi: ${LEGAL_ENTITY.agencyLicense}`,
  LEGAL_ENTITY.mersis && `MERSİS: ${LEGAL_ENTITY.mersis}`,
  LEGAL_ENTITY.taxNo && `Vergi no: ${LEGAL_ENTITY.taxNo}`,
  LEGAL_ENTITY.address,
]
  .filter(Boolean)
  .join(" · ");

/** "araç yakıt hesaplama" becomes "Araç Yakıt Hesaplama" (Turkish i/İ rules). */
const titleCase = (text: string) =>
  text
    .split(" ")
    .map((word) => word.charAt(0).toLocaleUpperCase("tr") + word.slice(1))
    .join(" ");

export function SiteFooter() {
  return (
    <footer className="bg-night text-pearl">
      <div className="mx-auto grid w-full max-w-7xl gap-12 px-5 py-16 sm:px-8 md:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_1fr_1.2fr_auto]">
        <div>
          <Image
            src="/logo.png"
            alt="Sofya Dijital Sigorta"
            width={500}
            height={250}
            className="-ml-3 h-20 w-auto"
          />
          <p className="mt-2 max-w-xs text-[0.9375rem] leading-relaxed text-pearl/60">
            Sofya Dijital Sigorta, yapay zeka destekli sigorta asistanınızdır.
          </p>
        </div>

        <nav aria-label="Sayfalar">
          <h2 className="text-[0.9375rem] font-semibold text-white">
            Sayfalar
          </h2>
          <ul className="mt-4 space-y-2.5 text-[0.9375rem] text-pearl/65">
            {NAV.map((link) => (
              <li key={link.href}>
                <AppLink
                  href={link.href}
                  className="transition-colors hover:text-gold"
                >
                  {link.label}
                </AppLink>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Yasal bilgiler">
          <h2 className="text-[0.9375rem] font-semibold text-white">Yasal</h2>
          <ul className="mt-4 space-y-2.5 text-[0.9375rem] text-pearl/65">
            {LEGAL_LINKS.map((link) => (
              <li key={link.href}>
                <AppLink
                  href={link.href}
                  className="transition-colors hover:text-gold"
                >
                  {link.label}
                </AppLink>
              </li>
            ))}
            <li>
              <CookiePreferencesButton className="transition-colors hover:text-gold" />
            </li>
          </ul>
        </nav>

        <nav aria-label="Ürünlerimiz">
          <h2 className="text-[0.9375rem] font-semibold text-white">
            Ürünlerimiz
          </h2>
          <ul className="mt-4 space-y-2.5 text-[0.9375rem] text-pearl/65">
            {PRODUCTS.map((product) => (
              <li key={product.slug}>
                <AppLink
                  href={`/urunler/${product.slug}`}
                  className="transition-colors hover:text-gold"
                >
                  {product.name}
                </AppLink>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Hızlı erişim">
          <h2 className="text-[0.9375rem] font-semibold text-white">
            Hızlı Erişim
          </h2>
          <ul className="mt-4 space-y-2.5 text-[0.9375rem] text-pearl/65">
            {GUIDES.map((guide) => (
              <li key={guide.slug}>
                <AppLink
                  href={`/rehber/${guide.slug}`}
                  className="transition-colors hover:text-gold"
                >
                  {titleCase(guide.label)}
                </AppLink>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-[0.9375rem] font-semibold text-white">
            İletişim
          </h2>
          <ul className="mt-4 space-y-2.5 text-[0.9375rem] text-pearl/65">
            <li>
              <a
                href={CONTACT.phoneHref}
                className="transition-colors hover:text-gold"
              >
                {CONTACT.phone}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${CONTACT.email}`}
                className="whitespace-nowrap transition-colors hover:text-gold"
              >
                {CONTACT.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/[0.08]">
        <div className="mx-auto w-full max-w-7xl space-y-2 px-5 py-6 text-[0.8125rem] leading-relaxed text-pearl/45 sm:px-8">
          <p className="flex items-start gap-2">
            <LockIcon className="mt-0.5 size-3.5 shrink-0 text-gold/70" />
            <span>
              Ödemeler şifreli bağlantı üzerinden, sigorta şirketinin ödeme
              altyapısıyla alınır; kart bilgileriniz sitemizde saklanmaz.
              Poliçe, seçtiğiniz teklifteki sigorta şirketi tarafından
              düzenlenir.
            </span>
          </p>
          {ENTITY_LINE && <p>{ENTITY_LINE}</p>}
          <p>© 2026 Sofya Dijital Sigorta. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
}
