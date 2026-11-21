import { NextResponse } from "next/server";
import { addSpecial, listSpecials, orderSpecials, parseSpecial } from "@/lib/specials";

export const dynamic = "force-dynamic";

async function authorised() {
  const { currentUser } = await import("@/lib/session");
  return Boolean(await currentUser());
}

export async function GET() {
  return NextResponse.json(
    { specials: await listSpecials() },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function POST(request: Request) {
  if (!(await authorised())) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Could not read that special." }, { status: 400 });
  }

  const record = body && typeof body === "object" ? (body as { ids?: unknown; special?: unknown }) : {};
  if (Array.isArray(record.ids)) {
    const ids = record.ids.filter((id): id is string => typeof id === "string");
    return NextResponse.json({ specials: await orderSpecials(ids) });
  }

  const parsed = parseSpecial(record.special ?? body);
  if (typeof parsed === "string") {
    return NextResponse.json({ error: parsed }, { status: 400 });
  }

  await addSpecial(parsed);
  return NextResponse.json({ special: parsed });
}
