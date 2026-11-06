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
  const title = `${guide.name} travel guide`;
  const url = `https://travelmorebl.com/destinations/${guide.slug}`;
  return {
    title,
    description: guide.lead,
    openGraph: {
      title,
      description: guide.lead,
      url,
      type: "article",
      images: [{ url: guide.image, width: 1200, height: 630, alt: guide.alt }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: guide.lead,
      images: [guide.image],
    },
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
