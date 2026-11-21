import { NextResponse } from "next/server";
import { parseRates, readRates, writeRates } from "@/lib/rates";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ rates: await readRates() }, { headers: { "Cache-Control": "no-store" } });
}

export async function PUT(request: Request) {
  const { currentUser } = await import("@/lib/session");
  if (!(await currentUser())) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Could not read those figures." }, { status: 400 });
  }

  const rates =
    body && typeof body === "object" && "rates" in body ? (body as { rates: unknown }).rates : body;
  const parsed = parseRates(rates);
  if (typeof parsed === "string") {
    return NextResponse.json({ error: parsed }, { status: 400 });
  }

  await writeRates(parsed);
  return NextResponse.json({ rates: parsed });
}
