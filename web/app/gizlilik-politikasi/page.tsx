import { LegalPage, legalMetadata } from "@/components/legal-page";
import { PRIVACY_DOC } from "@/lib/legal";

export const metadata = legalMetadata(PRIVACY_DOC);

export default function PrivacyPage() {
  return <LegalPage doc={PRIVACY_DOC} other={{ href: "/kvkk", label: "KVKK Aydınlatma Metni" }} />;
}
