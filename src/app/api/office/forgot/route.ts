import { NextResponse } from "next/server";
import { SITE } from "@/lib/constants";
import { mailConfigured, sendMail } from "@/lib/mailer";
import { startReset } from "@/lib/officeAuth";
import { clientIp, hit } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

const SENT = "If the desk is set up for email, a reset link is on its way to the Travel More inboxes.";

export async function POST(request: Request) {
  if (!hit(`forgot:${clientIp(request)}`, 3, 15 * 60 * 1000).allowed) {
    return NextResponse.json({ error: "Too many requests. Try again in a few minutes." }, { status: 429 });
  }

  const dev = process.env.NODE_ENV !== "production";
  if (!mailConfigured() && !dev) {
    return NextResponse.json({ error: "Password emails are not set up yet." }, { status: 503 });
  }

  const reset = await startReset();
  if (!reset) return NextResponse.json({ ok: true, message: SENT });

  const origin = process.env.SITE_URL || new URL(request.url).origin;
  const link = `${origin}/office/reset?token=${reset.token}`;
  const text = [
    "Someone asked to reset the Travel More back office password.",
    "",
    `Choose a new password here (the link works for ${reset.minutes} minutes):`,
    link,
    "",
    "If this was not you, ignore this email. The current password stays the same.",
  ].join("\n");
  const html = `<p>Someone asked to reset the Travel More back office password.</p>
<p><a href="${link}">Choose a new password</a>. The link works for ${reset.minutes} minutes.</p>
<p>If this was not you, ignore this email. The current password stays the same.</p>`;

  if (!mailConfigured()) {
    console.info(`[office] Email is not set up. Reset link: ${link}`);
    return NextResponse.json({ ok: true, message: SENT });
  }

  try {
    await sendMail([...SITE.emails], "Reset your Travel More back office password", text, html);
  } catch (error) {
    console.error("[office] Could not send the reset email", error);
    return NextResponse.json({ error: "The email could not be sent. Try again later." }, { status: 502 });
  }
  return NextResponse.json({ ok: true, message: SENT });
}
