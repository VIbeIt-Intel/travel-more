import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/session";

function clean(value: unknown, max: number) {
  return String(value ?? "").trim().slice(0, max);
}

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  const { id } = await context.params;
  const client = await db.client.findUnique({ where: { id } });
  if (!client) return NextResponse.json({ error: "That client is not on the desk." }, { status: 404 });
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Could not read that." }, { status: 400 });
  }
  const firstName = clean(body.firstName, 80);
  const lastName = clean(body.lastName, 80);
  if (firstName.length < 1) return NextResponse.json({ error: "Add the traveller's first name." }, { status: 400 });
  const dob = clean(body.dateOfBirth, 10);
  const expiry = clean(body.passportExpiry, 10);
  const traveller = await db.traveller.create({
    data: {
      clientId: id,
      firstName,
      lastName,
      dateOfBirth: dob ? new Date(`${dob}T00:00:00.000Z`) : null,
      passportNumber: clean(body.passportNumber, 40),
      passportExpiry: expiry ? new Date(`${expiry}T00:00:00.000Z`) : null,
    },
  });
  return NextResponse.json({ traveller });
}
