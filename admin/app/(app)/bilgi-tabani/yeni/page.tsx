import type { Metadata } from "next";
import { NewKnowledgeForm } from "@/components/knowledge/knowledge-form";

export const metadata: Metadata = { title: "Yeni Kayıt" };

export default async function NewKnowledgePage({ searchParams }: PageProps<"/bilgi-tabani/yeni">) {
  const { title, unanswered } = await searchParams;
  return (
    <NewKnowledgeForm
      prefillTitle={typeof title === "string" ? title : undefined}
      unansweredId={typeof unanswered === "string" ? unanswered : undefined}
    />
  );
}
