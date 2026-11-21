import type { Metadata } from "next";
import Link from "next/link";
import { DeskHeading } from "@/components/OfficeShell";
import { db } from "@/lib/db";
import { formatRands, formatWhen, johannesburgMonthStart } from "@/lib/format";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const monthStart = johannesburgMonthStart();
  const [newLeads, leadCount, clientCount, latest] = await Promise.all([
    db.lead.count({ where: { stage: "new" } }),
    db.lead.count({ where: { createdAt: { gte: monthStart } } }),
    db.client.count({ where: { anonymisedAt: null } }),
    db.lead.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
  ]);

  const money = [
    ["Bookings", "0"],
    ["Sales", formatRands(0)],
    ["Commission", formatRands(0)],
    ["Net profit", formatRands(0)],
  ] as const;

  return (
    <>
      <DeskHeading
        eyebrow="Desk"
        title="Dashboard"
        lede="A snapshot of trips, money and what needs a reply. Figures are for this month in Johannesburg."
      />
      <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {money.map(([label, value]) => (
          <article key={label} className="border border-sand-300 bg-white px-5 py-4">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-navy-800/50">{label}</p>
            <p className="mt-2 font-display text-3xl text-navy-900">{value}</p>
          </article>
        ))}
      </div>
      <p className="mt-3 text-sm leading-relaxed text-navy-800/60">
        Quotes, bookings and invoices are not in this section yet, so sales, commission and profit stay at zero.
      </p>
      <p className="mt-1 text-sm leading-relaxed text-navy-800/60">
        {leadCount} {leadCount === 1 ? "lead" : "leads"} arrived this month. {clientCount}{" "}
        {clientCount === 1 ? "client" : "clients"} on file.
      </p>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <section className="border border-sand-300 bg-white px-5 py-5">
          <h2 className="font-display text-2xl text-navy-900">New leads</h2>
          <p className="mt-1 text-sm text-navy-800/70">{newLeads} still marked new.</p>
          {latest.length === 0 ? (
            <p className="mt-4 text-sm text-navy-800/70">No trip requests yet. They appear when someone sends a destination form.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {latest.map((lead) => (
                <li key={lead.id} className="border border-sand-300/80 px-3 py-3">
                  <Link href={`/office/leads/${lead.id}`} className="break-words font-semibold text-navy-900 hover:underline">
                    {lead.name} · {lead.destination}
                  </Link>
                  <p className="text-sm text-navy-800/70">
                    {lead.stage} · {formatWhen(lead.createdAt)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
        <section className="border border-sand-300 bg-white px-5 py-5">
          <h2 className="font-display text-2xl text-navy-900">Waiting on you</h2>
          <ul className="mt-4 space-y-3 text-sm text-navy-800/75">
            <li>No departures in the next 14 days yet. Bookings will fill this in.</li>
            <li>No quotes are waiting on a client yet.</li>
            <li>No deposits or invoices are overdue yet.</li>
          </ul>
        </section>
      </div>
    </>
  );
}
