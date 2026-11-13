import { LegalPage, legalMetadata } from "@/components/legal-page";
import { KVKK_DOC } from "@/lib/legal";

export const metadata = legalMetadata(KVKK_DOC);

export default function KvkkPage() {
  return <LegalPage doc={KVKK_DOC} other={{ href: "/gizlilik-politikasi", label: "Gizlilik Politikası" }} />;
}
