import { NextResponse } from "next/server";
import { revalidateDesk } from "@/lib/deskCache";
import { db } from "@/lib/db";
import { clientIp } from "@/lib/rateLimit";
import { currentUser } from "@/lib/session";

function clean(value: unknown, max: number) {
  return String(value ?? "").trim().slice(0, max);
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  const { id } = await context.params;
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Could not read that." }, { status: 400 });
  }
  const firstName = clean(body.firstName, 80);
  const email = clean(body.email, 120);
  if (firstName.length < 1) return NextResponse.json({ error: "Add a first name." }, { status: 400 });
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "That email does not look right." }, { status: 400 });
  }
  const dob = clean(body.dateOfBirth, 10);
  const client = await db.client
    .update({
      where: { id },
      data: {
        firstName,
        lastName: clean(body.lastName, 80),
        email,
        phone: clean(body.phone, 30),
        idOrPassport: clean(body.idOrPassport, 40),
        dateOfBirth: dob ? new Date(`${dob}T00:00:00.000Z`) : null,
        address: clean(body.address, 300),
        notes: clean(body.notes, 2000),
        marketingConsent: Boolean(body.marketingConsent),
      },
    })
    .catch(() => null);
  if (!client) return NextResponse.json({ error: "That client is not on the desk." }, { status: 404 });
  await db.auditLog.create({
    data: {
      userId: user.id,
      action: "update",
      entity: "client",
      entityId: id,
      ipAddress: clientIp(request),
      userAgent: request.headers.get("user-agent") || "",
    },
  });
  revalidateDesk(["/office", "/office/clients", `/office/clients/${id}`]);
  return NextResponse.json({ client });
}
