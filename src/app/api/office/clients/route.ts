import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { clientIp } from "@/lib/rateLimit";
import { currentUser } from "@/lib/session";

function clean(value: unknown, max: number) {
  return String(value ?? "").trim().slice(0, max);
}

export async function POST(request: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Could not read that." }, { status: 400 });
  }
  const firstName = clean(body.firstName, 80);
  const lastName = clean(body.lastName, 80);
  const email = clean(body.email, 120);
  if (firstName.length < 1) return NextResponse.json({ error: "Add a first name." }, { status: 400 });
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "That email does not look right." }, { status: 400 });
  }
  const client = await db.client.create({
    data: {
      firstName,
      lastName,
      email,
      phone: clean(body.phone, 30),
      notes: clean(body.notes, 2000),
      consentSource: "desk",
      consentAt: new Date(),
      marketingConsent: Boolean(body.marketingConsent),
      createdById: user.id,
    },
  });
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
  return NextResponse.json({ client });
}
