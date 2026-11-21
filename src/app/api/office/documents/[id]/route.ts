import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { clientIp } from "@/lib/rateLimit";
import { currentUser } from "@/lib/session";
import { readPrivateFile } from "@/lib/storage";

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  const { id } = await context.params;
  const document = await db.clientDocument.findUnique({ where: { id } });
  if (!document) return NextResponse.json({ error: "That file is not on the desk." }, { status: 404 });
  const bytes = await readPrivateFile(document.fileKey);
  if (!bytes) return NextResponse.json({ error: "That file is missing." }, { status: 404 });
  await db.auditLog.create({
    data: {
      userId: user.id,
      action: "view",
      entity: "client-document",
      entityId: document.id,
      ipAddress: clientIp(request),
      userAgent: request.headers.get("user-agent") || "",
    },
  });
  return new NextResponse(new Uint8Array(bytes), {
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Disposition": `attachment; filename="${document.fileName || "document"}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
