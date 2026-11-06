import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DestinationGuide } from "@/components/DestinationGuide";
import { GUIDES, getGuide } from "@/lib/guides";

export function generateStaticParams() {
  return GUIDES.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return {};
  return {
    title: `${guide.name} travel guide`,
    description: guide.lead,
  };
}

export default async function DestinationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();
  return <DestinationGuide guide={guide} />;
}
