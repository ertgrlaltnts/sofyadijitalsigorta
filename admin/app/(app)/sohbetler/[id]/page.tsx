import type { Metadata } from "next";
import { ConversationDetailView } from "@/components/conversations/conversation-detail";

export const metadata: Metadata = { title: "Sohbet Detayı" };

export default async function ConversationPage({ params }: PageProps<"/sohbetler/[id]">) {
  const { id } = await params;
  return <ConversationDetailView id={id} />;
}
