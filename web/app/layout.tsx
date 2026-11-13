import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Plus_Jakarta_Sans } from "next/font/google";
import { CookieConsent } from "@/components/cookie-consent";
import { FloatingChat } from "@/components/floating-chat";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { JsonLd } from "@/components/json-ld";
import { CONTACT } from "@/lib/content";
import { LEGAL_ENTITY } from "@/lib/legal";
import { HOME_DESCRIPTION, OG_IMAGES, SITE_NAME, SITE_URL, TWITTER_IMAGES } from "@/lib/site";
import "./globals.css";

const sans = Plus_Jakarta_Sans({
  variable: "--font-jakarta-sans",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const serif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin", "latin-ext"],
  weight: "400",
  display: "swap",
});

const title = "Sofya Dijital Sigorta | Yapay zeka sigorta danışmanınız";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: title, template: "%s | Sofya Dijital Sigorta" },
  description: HOME_DESCRIPTION,
  applicationName: SITE_NAME,
  alternates: { canonical: "./" },
  openGraph: { title, description: HOME_DESCRIPTION, locale: "tr_TR", type: "website", siteName: SITE_NAME, url: "./", images: OG_IMAGES },
  twitter: { card: "summary_large_image", title, description: HOME_DESCRIPTION, images: TWITTER_IMAGES },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  verification: process.env.GOOGLE_SITE_VERIFICATION ? { google: process.env.GOOGLE_SITE_VERIFICATION } : undefined,
};

const organization = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "InsuranceAgency",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      alternateName: "Sofya AI",
      url: SITE_URL,
      logo: `${SITE_URL}/logo.png`,
      description: HOME_DESCRIPTION,
      telephone: CONTACT.phone,
      email: CONTACT.email,
      areaServed: { "@type": "Country", name: "Türkiye" },
      availableLanguage: "Turkish",
      contactPoint: { "@type": "ContactPoint", contactType: "customer service", telephone: CONTACT.phone, email: CONTACT.email, areaServed: "TR", availableLanguage: "Turkish" },
      ...(LEGAL_ENTITY.address && { address: { "@type": "PostalAddress", streetAddress: LEGAL_ENTITY.address, addressCountry: "TR" } }),
      ...(CONTACT.sameAs.length > 0 && { sameAs: CONTACT.sameAs }),
    },
    { "@type": "WebSite", "@id": `${SITE_URL}/#website`, url: SITE_URL, name: SITE_NAME, inLanguage: "tr-TR", publisher: { "@id": `${SITE_URL}/#organization` } },
  ],
};

export const viewport: Viewport = {
  themeColor: "#0b1322",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="tr" className={`${sans.variable} ${serif.variable} h-full`}>
      <body className="flex min-h-full flex-col">
        <JsonLd data={organization} />
        <a
          href="#icerik"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-full focus:bg-gold focus:px-5 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-night"
        >
          İçeriğe geç
        </a>
        <noscript>
          <style>{".reveal,.fade-up,.bubble-pop,.stage-in,.sofya-rise{opacity:1!important;transform:none!important}.word>span{transform:none!important}"}</style>
        </noscript>
        <SiteHeader />
        <main id="icerik" className="flex-1">{children}</main>
        <SiteFooter />
        <FloatingChat />
        <CookieConsent />
      </body>
    </html>
  );
}
