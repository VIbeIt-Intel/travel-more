import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { officeCookieName, setEnquiryStatus, tokenMatches, type EnquiryStatus } from "@/lib/enquiries";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const jar = await cookies();
  if (!tokenMatches(jar.get(officeCookieName())?.value)) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const { id } = await context.params;
  let body: { status?: EnquiryStatus };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Missing status." }, { status: 400 });
  }

  if (body.status !== "new" && body.status !== "contacted") {
    return NextResponse.json({ error: "Unknown status." }, { status: 400 });
  }

  const updated = await setEnquiryStatus(id, body.status);
  if (!updated) return NextResponse.json({ error: "Request not found." }, { status: 404 });
  return NextResponse.json({ enquiry: updated });
}
