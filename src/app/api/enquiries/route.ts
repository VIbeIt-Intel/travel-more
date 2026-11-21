import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  addEnquiry,
  listEnquiries,
  officeCookieName,
  parseEnquiry,
  tokenMatches,
} from "@/lib/enquiries";
import { clientIp, hit } from "@/lib/rateLimit";

async function authorised() {
  const jar = await cookies();
  return tokenMatches(jar.get(officeCookieName())?.value);
}

export async function GET() {
  if (!(await authorised())) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }
  const enquiries = await listEnquiries();
  return NextResponse.json({ enquiries });
}

export async function POST(request: Request) {
  if (!hit(`enquiry:${clientIp(request)}`, 5, 10 * 60 * 1000).allowed) {
    return NextResponse.json(
      { error: "We have your requests. Please wait a few minutes before sending another." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Please complete the form." }, { status: 400 });
  }

  const destination =
    body && typeof body === "object" ? String((body as { destination?: string }).destination ?? "") : "";
  const parsed = parseEnquiry(body, destination);
  if (typeof parsed === "string") {
    return NextResponse.json({ error: parsed }, { status: 400 });
  }

  await addEnquiry(parsed);
  return NextResponse.json({ ok: true });
}
