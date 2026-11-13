import type { Metadata } from "next";
import { KnowledgeList } from "@/components/knowledge/knowledge-list";

export const metadata: Metadata = { title: "Bilgi Tabanı" };

export default function KnowledgePage() {
  return <KnowledgeList />;
}
