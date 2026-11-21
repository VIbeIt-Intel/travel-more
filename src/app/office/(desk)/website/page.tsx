import type { Metadata } from "next";
import { DeskHeading } from "@/components/OfficeShell";
import { OfficeRates } from "@/components/OfficeRates";
import { OfficeSpecials } from "@/components/OfficeSpecials";

export const metadata: Metadata = { title: "Website" };

export default function WebsitePage() {
  return (
    <>
      <DeskHeading
        eyebrow="Website"
        title="Specials and estimates"
        lede="These are the offers and planner figures the public site uses. The homepage specials update after the next Pages build."
      />
      <OfficeSpecials />
      <OfficeRates />
    </>
  );
}
