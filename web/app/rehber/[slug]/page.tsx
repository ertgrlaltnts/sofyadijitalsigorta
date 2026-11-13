import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GuidePage, guideMetadata } from "@/components/guide-page";
import { GUIDES, getGuide } from "@/lib/guides";

export function generateStaticParams() {
  return GUIDES.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: PageProps<"/rehber/[slug]">): Promise<Metadata> {
  const guide = getGuide((await params).slug);
  return guide ? guideMetadata(guide) : {};
}

export default async function GuideRoute({ params }: PageProps<"/rehber/[slug]">) {
  const guide = getGuide((await params).slug);
  if (!guide) notFound();
  return <GuidePage guide={guide} />;
}
