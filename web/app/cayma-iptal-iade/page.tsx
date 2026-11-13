import { LegalPage, legalMetadata } from "@/components/legal-page";
import { REFUND_DOC } from "@/lib/legal-contracts";

export const metadata = legalMetadata(REFUND_DOC);

export default function RefundPage() {
  return <LegalPage doc={REFUND_DOC} other={{ href: "/sigorta-bilgilendirme", label: "Sigorta Ön Bilgilendirme" }} />;
}
