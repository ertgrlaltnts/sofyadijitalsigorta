import { LegalPage, legalMetadata } from "@/components/legal-page";
import { INFO_DOC } from "@/lib/legal-contracts";

export const metadata = legalMetadata(INFO_DOC);

export default function InsuranceInfoPage() {
  return <LegalPage doc={INFO_DOC} other={{ href: "/cayma-iptal-iade", label: "Cayma, İptal ve İade" }} />;
}
