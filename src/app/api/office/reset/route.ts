import { NextResponse } from "next/server";
import { finishReset, MIN_PASSWORD_LENGTH } from "@/lib/officeAuth";
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

  if (!(await finishReset(token, password))) {
    return NextResponse.json(
      { error: "This link has expired or was already used. Ask for a new one." },
      { status: 400 },
    );
  }
  return NextResponse.json({ ok: true });
}
