import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ClientProfile } from "@/components/ClientProfile";
import { DeskHeading } from "@/components/OfficeShell";
import { db } from "@/lib/db";
import { formatDay, formatWhen } from "@/lib/format";
import { currentUser } from "@/lib/session";

export const metadata: Metadata = { title: "Client" };

export default async function ClientPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { id } = await params;
  const { tab = "overview" } = await searchParams;
  const client = await db.client.findUnique({
    where: { id },
    include: { travellers: { orderBy: { createdAt: "asc" } }, documents: { orderBy: { createdAt: "desc" } } },
  });
  if (!client || client.anonymisedAt) notFound();
  const user = await currentUser();
  if (user) {
    await db.auditLog.create({
      data: { userId: user.id, action: "view", entity: "client", entityId: client.id },
    });
  }

  return (
    <>
      <DeskHeading
        eyebrow="Client"
        title={`${client.firstName} ${client.lastName}`.trim()}
        lede={client.email || "No email on file yet."}
        action={
          <Link href="/office/clients" className="min-h-11 border border-navy-900/15 bg-white px-4 py-3 text-sm font-semibold">
            All clients
          </Link>
        }
      />
      <ClientProfile
        tab={tab}
        client={{
          id: client.id,
          firstName: client.firstName,
          lastName: client.lastName,
          email: client.email,
          phone: client.phone,
          idOrPassport: client.idOrPassport,
          dateOfBirth: client.dateOfBirth ? client.dateOfBirth.toISOString().slice(0, 10) : "",
          address: client.address,
          notes: client.notes,
          marketingConsent: client.marketingConsent,
          consentSource: client.consentSource,
          consentAt: client.consentAt ? formatWhen(client.consentAt) : "",
        }}
        travellers={client.travellers.map((traveller) => ({
          id: traveller.id,
          firstName: traveller.firstName,
          lastName: traveller.lastName,
          passportNumber: traveller.passportNumber,
          dateOfBirth: formatDay(traveller.dateOfBirth),
          passportExpiry: formatDay(traveller.passportExpiry),
        }))}
        documents={client.documents.map((document) => ({
          id: document.id,
          type: document.type,
          fileName: document.fileName,
        }))}
      />
    </>
  );
}
