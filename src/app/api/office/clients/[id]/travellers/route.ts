import { NextResponse } from "next/server";
import { revalidateDesk } from "@/lib/deskCache";
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
  const dob = isoDate(body.dateOfBirth);
  const expiry = isoDate(body.passportExpiry);
  if (dob === null || expiry === null) {
    return NextResponse.json({ error: "Use dates as dd/mm/yyyy." }, { status: 400 });
  }
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
  revalidateDesk([`/office/clients/${id}`]);
  return NextResponse.json({ traveller });
}

function isoDate(value: unknown) {
  const text = String(value ?? "").trim();
  if (!text) return "";
  const southAfrican = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(text);
  const iso = southAfrican ? `${southAfrican[3]}-${southAfrican[2]}-${southAfrican[1]}` : text;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null;
  const [year, month, day] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null;
  return iso;
}
