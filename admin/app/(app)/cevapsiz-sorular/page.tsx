import type { Metadata } from "next";
import { UnansweredList } from "@/components/unanswered/unanswered-list";

export const metadata: Metadata = { title: "Cevapsız Sorular" };

export default function UnansweredPage() {
  return <UnansweredList />;
}
