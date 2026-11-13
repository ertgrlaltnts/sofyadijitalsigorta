import type { Metadata } from "next";
import { ConversationList } from "@/components/conversations/conversation-list";

export const metadata: Metadata = { title: "Sohbetler" };

export default function ConversationsPage() {
  return <ConversationList />;
}
