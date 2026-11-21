import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { SITE } from "@/lib/constants";
import { db } from "@/lib/db";
import { mailConfigured, sendMail } from "@/lib/mailer";
import { hashToken } from "@/lib/session";
import { clientIp, hit } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

const SENT = "If the desk is set up for email, a reset link is on its way to the TravelMORE inbox.";
const COOLDOWN_MS = 2 * 60 * 1000;
const RESET_MINUTES = 30;

export async function POST(request: Request) {
  if (!hit(`forgot:${clientIp(request)}`, 3, 15 * 60 * 1000).allowed) {
    return NextResponse.json({ error: "Too many requests. Try again in a few minutes." }, { status: 429 });
  }

  const dev = process.env.NODE_ENV !== "production";
  if (!mailConfigured() && !dev) {
    return NextResponse.json({ error: "Password emails are not set up yet." }, { status: 503 });
  }

  const owner = await db.user.findFirst({ where: { role: "owner", active: true }, orderBy: { createdAt: "asc" } });
  if (!owner) return NextResponse.json({ ok: true, message: SENT });

  const recent = await db.passwordReset.findFirst({
    where: { userId: owner.id },
    orderBy: { createdAt: "desc" },
  });
  if (recent && Date.now() - recent.createdAt.getTime() < COOLDOWN_MS) {
    return NextResponse.json({ ok: true, message: SENT });
  }

  const token = randomBytes(32).toString("hex");
  await db.passwordReset.create({
    data: {
      userId: owner.id,
      tokenHash: hashToken(token),
      expiresAt: new Date(Date.now() + RESET_MINUTES * 60 * 1000),
    },
  });

  const origin = process.env.SITE_URL || new URL(request.url).origin;
  const link = `${origin}/office/reset?token=${token}`;
  const text = [
    "Someone asked to reset the TravelMORE back office password.",
    "",
    `Choose a new password here (the link works for ${RESET_MINUTES} minutes):`,
    link,
    "",
    "If this was not you, ignore this email. The current password stays the same.",
  ].join("\n");
  const html = `<p>Someone asked to reset the TravelMORE back office password.</p>
<p><a href="${link}">Choose a new password</a>. The link works for ${RESET_MINUTES} minutes.</p>
<p>If this was not you, ignore this email. The current password stays the same.</p>`;

  if (!mailConfigured()) {
    console.info(`[office] Email is not set up. Reset link: ${link}`);
    return NextResponse.json({ ok: true, message: SENT });
  }

  try {
    await sendMail([...SITE.emails], "Reset your TravelMORE back office password", text, html);
  } catch (error) {
    console.error("[office] Could not send the reset email", error);
    return NextResponse.json({ error: "The email could not be sent. Try again later." }, { status: 502 });
  }
  return NextResponse.json({ ok: true, message: SENT });
}
