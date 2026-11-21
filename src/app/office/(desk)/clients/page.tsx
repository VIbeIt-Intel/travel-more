import type { Metadata } from "next";
import Link from "next/link";
import { ClientCreateForm } from "@/components/ClientCreateForm";
import { DeskHeading } from "@/components/OfficeShell";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "Clients" };

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const query = q.trim();
  const clients = await db.client.findMany({
    where: {
      anonymisedAt: null,
      ...(query
        ? {
            OR: [
              { firstName: { contains: query } },
              { lastName: { contains: query } },
              { email: { contains: query } },
              { phone: { contains: query } },
            ],
          }
        : {}),
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <>
      <DeskHeading
        eyebrow="Clients"
        title="People we travel with"
        lede="A client holds the travellers, documents and, later, the quotes and invoices."
      />
      <form className="mt-6" action="/office/clients">
        <input
          name="q"
          defaultValue={query}
          placeholder="Search name, email or phone"
          className="min-h-11 w-full max-w-md border border-sand-300 bg-white px-3 text-sm outline-none focus:border-[#1a7d76]"
        />
      </form>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <article className="border border-sand-300 bg-white px-5 py-4">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-navy-800/50">Clients</p>
          <p className="mt-2 font-display text-3xl text-navy-900">{clients.length}</p>
        </article>
      </div>
      {clients.length === 0 ? (
        <p className="mt-4 border border-sand-300 bg-white px-5 py-8 text-sm text-navy-800/70">
          No clients yet. Convert a lead, or add someone below.
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {clients.map((client) => (
            <li key={client.id} className="border border-sand-300 bg-white px-5 py-4">
              <Link href={`/office/clients/${client.id}`} className="break-words font-display text-2xl text-navy-900 hover:underline">
                {client.firstName} {client.lastName}
              </Link>
              <p className="text-sm text-navy-800/70">
                {client.email || "No email"}
                {client.phone ? ` · ${client.phone}` : ""}
              </p>
            </li>
          ))}
        </ul>
      )}
      <ClientCreateForm />
    </>
  );
}
