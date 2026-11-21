import type { Metadata } from "next";
import { Suspense } from "react";
import { DeskHeading } from "@/components/OfficeShell";
import { OfficeRates } from "@/components/OfficeRates";
import { OfficeSpecials } from "@/components/OfficeSpecials";
import { readRates } from "@/lib/rates";
import { listSpecials } from "@/lib/specials";

export const metadata: Metadata = { title: "Website" };
export const dynamic = "force-dynamic";

export default function WebsitePage() {
  return (
    <>
      <DeskHeading
        eyebrow="Website"
        title="Specials and estimates"
        lede="These are the offers and planner figures the public site uses. The homepage specials update after the next Pages build."
      />
      <Suspense fallback={<WebsiteSkeleton />}>
        <WebsiteData />
      </Suspense>
    </>
  );
}

async function WebsiteData() {
  const [specials, rates] = await Promise.all([listSpecials(), readRates()]);
  return (
    <>
      <OfficeSpecials specials={specials} />
      <OfficeRates rates={rates} />
    </>
  );
}

function WebsiteSkeleton() {
  return (
    <div className="mt-10 space-y-4" aria-busy="true" aria-label="Loading specials and estimates">
      <div className="h-8 w-40 animate-pulse bg-sand-200" />
      <div className="h-16 animate-pulse border border-sand-300 bg-sand-100" />
      <div className="h-16 animate-pulse border border-sand-300 bg-sand-100" />
      <div className="h-16 animate-pulse border border-sand-300 bg-sand-100" />
      <div className="mt-8 h-8 w-52 animate-pulse bg-sand-200" />
      <div className="h-40 animate-pulse border border-sand-300 bg-sand-100" />
    </div>
  );
}
