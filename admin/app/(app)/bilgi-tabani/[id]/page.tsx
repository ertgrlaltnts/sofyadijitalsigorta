import type { Metadata } from "next";
import { EditKnowledgeForm } from "@/components/knowledge/knowledge-form";

export const metadata: Metadata = { title: "Kaydı Düzenle" };

export default async function EditKnowledgePage({ params }: PageProps<"/bilgi-tabani/[id]">) {
  const { id } = await params;
  return <EditKnowledgeForm id={id} />;
}
