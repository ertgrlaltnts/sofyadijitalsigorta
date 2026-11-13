import { LegalPage, legalMetadata } from "@/components/legal-page";
import { COOKIE_DOC } from "@/lib/legal";

export const metadata = legalMetadata(COOKIE_DOC);

export default function CookiePolicyPage() {
  return <LegalPage doc={COOKIE_DOC} other={{ href: "/gizlilik-politikasi", label: "Gizlilik Politikası" }} />;
}
