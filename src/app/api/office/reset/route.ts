import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { MIN_PASSWORD_LENGTH, hashPassword } from "@/lib/passwords";
import { hashToken } from "@/lib/session";
import { clientIp, hit } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!hit(`reset:${clientIp(request)}`, 10, 15 * 60 * 1000).allowed) {
    return NextResponse.json({ error: "Too many attempts. Try again in a few minutes." }, { status: 429 });
  }

  let token = "";
  let password = "";
  try {
    const body = (await request.json()) as { token?: string; password?: string };
    token = String(body.token ?? "");
    password = String(body.password ?? "");
  } catch {
    return NextResponse.json({ error: "Could not read that." }, { status: 400 });
  }

  if (password.length < MIN_PASSWORD_LENGTH || password.length > 200) {
    return NextResponse.json(
      { error: `Use at least ${MIN_PASSWORD_LENGTH} characters.` },
      { status: 400 },
    );
  }

  const reset = await db.passwordReset.findUnique({ where: { tokenHash: hashToken(token) } });
  if (!reset || reset.expiresAt.getTime() <= Date.now()) {
    return NextResponse.json(
      { error: "This link has expired or was already used. Ask for a new one." },
      { status: 400 },
    );
  }

  const { hash, salt } = hashPassword(password);
  await db.user.update({
    where: { id: reset.userId },
    data: { passwordHash: hash, passwordSalt: salt },
  });
  await db.passwordReset.delete({ where: { id: reset.id } });
  await db.session.deleteMany({ where: { userId: reset.userId } });
  return NextResponse.json({ ok: true });
}
