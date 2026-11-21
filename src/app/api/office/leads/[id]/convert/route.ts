import { NextResponse } from "next/server";
import { revalidateDesk } from "@/lib/deskCache";
import { db } from "@/lib/db";
import { clientIp } from "@/lib/rateLimit";
import { currentUser } from "@/lib/session";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  const { id } = await context.params;
  const lead = await db.lead.findUnique({ where: { id } });
  if (!lead) return NextResponse.json({ error: "That lead is not on the desk." }, { status: 404 });
  if (lead.clientId) {
    if (lead.stage !== "converted") {
      await db.lead.update({ where: { id }, data: { stage: "converted" } });
    }
    revalidateDesk(["/office", "/office/leads", `/office/leads/${id}`, "/office/clients", `/office/clients/${lead.clientId}`]);
    return NextResponse.json({ clientId: lead.clientId });
  }

  const [firstName, ...rest] = lead.name.trim().split(/\s+/);
  const client = await db.client.create({
    data: {
      firstName: firstName || lead.name,
      lastName: rest.join(" "),
      email: lead.email,
      phone: lead.phone,
      notes: lead.notes,
      consentAt: new Date(),
      consentSource: lead.source || "website",
      createdById: user.id,
    },
  });
  await db.lead.update({ where: { id }, data: { clientId: client.id, stage: "converted" } });
  await db.auditLog.create({
    data: {
      userId: user.id,
      action: "create",
      entity: "client",
      entityId: client.id,
      ipAddress: clientIp(request),
      userAgent: request.headers.get("user-agent") || "",
    },
  });
  revalidateDesk(["/office", "/office/leads", `/office/leads/${id}`, "/office/clients", `/office/clients/${client.id}`]);
  return NextResponse.json({ clientId: client.id });
}
