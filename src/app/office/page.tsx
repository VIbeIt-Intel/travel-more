import type { Metadata } from "next";
import { OfficeDesk } from "@/components/OfficeDesk";

export const metadata: Metadata = {
  title: "Trip requests",
  robots: { index: false, follow: false },
};

export default function OfficePage() {
  return (
    <main id="main-content">
      <OfficeDesk />
    </main>
  );
}
