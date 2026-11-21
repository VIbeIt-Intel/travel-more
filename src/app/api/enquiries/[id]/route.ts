import { NextResponse } from "next/server";
import { setEnquiryStatus, type EnquiryStatus } from "@/lib/enquiries";
import { currentUser } from "@/lib/session";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!(await currentUser())) {
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
