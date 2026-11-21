import type { Metadata } from "next";
import { DeskHeading } from "@/components/OfficeShell";

export const metadata: Metadata = { title: "Dashboard" };

export default function DashboardPage() {
  return <DeskHeading eyebrow="Desk" title="Dashboard" lede="A snapshot of trips, money and what needs a reply." />;
}
