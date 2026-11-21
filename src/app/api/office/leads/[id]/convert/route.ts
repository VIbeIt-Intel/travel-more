import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { clientIp } from "@/lib/rateLimit";
import { currentUser } from "@/lib/session";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  const { id } = await context.params;
  const lead = await db.lead.findUnique({ where: { id } });
  if (!lead) return NextResponse.json({ error: "That lead is not on the desk." }, { status: 404 });
  if (lead.clientId) return NextResponse.json({ clientId: lead.clientId });

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
  await db.lead.update({ where: { id }, data: { clientId: client.id } });
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
  return NextResponse.json({ clientId: client.id });
}
