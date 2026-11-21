import type { Metadata } from "next";
import { DeskHeading } from "@/components/OfficeShell";
import { LeadBoard } from "@/components/LeadBoard";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "Leads" };

export default async function LeadsPage() {
  const leads = await db.lead.findMany({ orderBy: { createdAt: "desc" } });
  const fresh = leads.filter((lead) => lead.stage === "new").length;
  return (
    <>
      <DeskHeading
        eyebrow="Leads"
        title="Trip requests"
        lede="Drag a card to move it, or switch to the list and choose a stage. Destination forms land here."
      />
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <Stat label="All leads" value={String(leads.length)} />
        <Stat label="New" value={String(fresh)} />
        <Stat label="Booked" value={String(leads.filter((lead) => lead.stage === "booked").length)} />
      </div>
      <LeadBoard
        leads={leads.map((lead) => ({
          id: lead.id,
          name: lead.name,
          destination: lead.destination,
          email: lead.email,
          stage: lead.stage,
          createdAt: lead.createdAt.toISOString(),
          month: lead.month,
          year: lead.year,
        }))}
      />
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <article className="border border-sand-300 bg-white px-5 py-4">
      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-navy-800/50">{label}</p>
      <p className="mt-2 font-display text-3xl text-navy-900">{value}</p>
    </article>
  );
}
