import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LeadActions } from "@/components/LeadActions";
import { DeskHeading } from "@/components/OfficeShell";
import { db } from "@/lib/db";
import { formatWhen } from "@/lib/format";

export const metadata: Metadata = { title: "Lead" };

export default async function LeadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lead = await db.lead.findUnique({ where: { id } });
  if (!lead) notFound();

  const rows = [
    ["Destination", lead.destination],
    ["When", `${lead.month} ${lead.year}${lead.flexible ? " · dates can move" : ""}`],
    ["Stay", lead.nights],
    ["Trip", lead.trip],
    ["Travellers", `${lead.adults} adults, ${lead.children} children`],
    ["Email", lead.email],
    ["Phone", lead.phone || "Not given"],
    ["Source", lead.source],
    ["Received", formatWhen(lead.createdAt)],
  ];

  return (
    <>
      <DeskHeading
        eyebrow="Lead"
        title={lead.name}
        lede="Everything they sent from the website, plus where this request sits."
        action={
          <Link href="/office/leads" className="min-h-11 border border-navy-900/15 bg-white px-4 py-3 text-sm font-semibold">
            All leads
          </Link>
        }
      />
      <div className="mt-8 grid gap-4 lg:grid-cols-[1.4fr_0.8fr]">
        <section className="border border-sand-300 bg-white px-6 py-6">
          <dl className="grid gap-4 sm:grid-cols-2">
            {rows.map(([label, value]) => (
              <div key={label}>
                <dt className="text-xs uppercase tracking-[0.14em] text-navy-800/50">{label}</dt>
                <dd className="mt-1 text-sm text-navy-900">{value}</dd>
              </div>
            ))}
          </dl>
          {lead.notes ? <p className="mt-5 text-sm leading-relaxed text-navy-800/80">{lead.notes}</p> : null}
        </section>
        <LeadActions id={lead.id} stage={lead.stage} lostReason={lead.lostReason} clientId={lead.clientId} />
      </div>
    </>
  );
}
