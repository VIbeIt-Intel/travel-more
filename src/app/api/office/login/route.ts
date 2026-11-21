import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { clear, clientIp, hit } from "@/lib/rateLimit";
import { OFFICE_COOKIE, checkPassword, endSession, officeCookieOptions, startSession } from "@/lib/session";

export async function POST(request: Request) {
  const key = `login:${clientIp(request)}`;
  const attempt = hit(key, 5, 15 * 60 * 1000);
  if (!attempt.allowed) {
    return NextResponse.json(
      { error: "Too many attempts. Try again in a few minutes." },
      { status: 429, headers: { "Retry-After": String(attempt.retryAfter) } },
    );
  }

  let email = "";
  let password = "";
  try {
    const body = (await request.json()) as { email?: string; password?: string };
    email = String(body.email ?? "");
    password = String(body.password ?? "");
  } catch {
    email = "";
  }

  const user = await checkPassword(email, password);
  if (!user) {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return NextResponse.json({ error: "That email or password is not right." }, { status: 401 });
  }

  clear(key);
  const token = await startSession(user.id, request);
  await db.auditLog.create({
    data: {
      userId: user.id,
      action: "sign-in",
      entity: "user",
      entityId: user.id,
      ipAddress: clientIp(request),
      userAgent: request.headers.get("user-agent") || "",
    },
  });
  const response = NextResponse.json({ ok: true });
  response.cookies.set(OFFICE_COOKIE, token, officeCookieOptions(60 * 60 * 24 * 14));
  return response;
}

export async function DELETE() {
  await endSession();
  const response = NextResponse.json({ ok: true });
  response.cookies.set(OFFICE_COOKIE, "", officeCookieOptions(0));
  return response;
}
