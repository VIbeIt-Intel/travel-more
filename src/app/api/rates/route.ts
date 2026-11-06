import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { officeCookieName, tokenMatches } from "@/lib/enquiries";
import { parseRates, readRates, writeRates } from "@/lib/rates";

export async function GET() {
  return NextResponse.json({ rates: await readRates() });
}

export async function PUT(request: Request) {
  const jar = await cookies();
  if (!tokenMatches(jar.get(officeCookieName())?.value)) {
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
