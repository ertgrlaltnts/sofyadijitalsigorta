import type { Metadata } from "next";
import { Playground } from "@/components/playground/playground";

export const metadata: Metadata = { title: "Test Alanı" };

export default function PlaygroundPage() {
  return <Playground />;
}
