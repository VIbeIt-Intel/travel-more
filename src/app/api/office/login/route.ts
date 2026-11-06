import { NextResponse } from "next/server";
import { officeConfigured, officeCookieName, officeToken, passwordMatches } from "@/lib/enquiries";
import { clear, clientIp, hit } from "@/lib/rateLimit";

export async function POST(request: Request) {
  if (!officeConfigured()) {
    return NextResponse.json({ error: "The back office password is not set yet." }, { status: 503 });
  }

  const key = `login:${clientIp(request)}`;
  const attempt = hit(key, 5, 15 * 60 * 1000);
  if (!attempt.allowed) {
    return NextResponse.json(
      { error: "Too many attempts. Try again in a few minutes." },
      { status: 429, headers: { "Retry-After": String(attempt.retryAfter) } },
    );
  }

  let password = "";
  try {
    const body = (await request.json()) as { password?: string };
    password = String(body.password ?? "");
  } catch {
    password = "";
  }

  if (!passwordMatches(password)) {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return NextResponse.json({ error: "That password is not right." }, { status: 401 });
  }

  clear(key);
  const response = NextResponse.json({ ok: true });
  response.cookies.set(officeCookieName(), officeToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(officeCookieName(), "", { httpOnly: true, path: "/", maxAge: 0 });
  return response;
}
