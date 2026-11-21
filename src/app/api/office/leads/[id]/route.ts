import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { setEnquiryStatus } from "@/lib/enquiries";
import { clientIp } from "@/lib/rateLimit";
import { currentUser } from "@/lib/session";

const STAGES = ["new", "contacted", "quoted", "booked", "lost"] as const;

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Sign in required." }, { status: 401 });

  const { id } = await context.params;
  let stage = "";
  let lostReason = "";
  try {
    const body = (await request.json()) as { stage?: string; lostReason?: string };
    stage = String(body.stage ?? "");
    lostReason = String(body.lostReason ?? "").slice(0, 300);
  } catch {
    return NextResponse.json({ error: "Could not read that." }, { status: 400 });
  }
  if (!STAGES.includes(stage as (typeof STAGES)[number])) {
    return NextResponse.json({ error: "Choose a stage from the list." }, { status: 400 });
  }

  const lead = await db.lead.update({
    where: { id },
    data: { stage, lostReason: stage === "lost" ? lostReason : "" },
  }).catch(() => null);
  if (!lead) return NextResponse.json({ error: "That lead is not on the desk." }, { status: 404 });

  if (stage === "new" || stage === "contacted") {
    await setEnquiryStatus(id, stage);
  }
  await db.auditLog.create({
    data: {
      userId: user.id,
      action: "update",
      entity: "lead",
      entityId: id,
      ipAddress: clientIp(request),
      userAgent: request.headers.get("user-agent") || "",
    },
  });
  return NextResponse.json({ lead });
}
