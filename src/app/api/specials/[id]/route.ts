import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { officeCookieName, tokenMatches } from "@/lib/enquiries";
import { deleteSpecial, listSpecials, parseSpecial, removeUploadedImage, updateSpecial } from "@/lib/specials";

export const dynamic = "force-dynamic";

type Context = { params: Promise<{ id: string }> };

async function authorised() {
  const jar = await cookies();
  return tokenMatches(jar.get(officeCookieName())?.value);
}

export async function PATCH(request: Request, context: Context) {
  if (!(await authorised())) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const { id } = await context.params;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Could not read that special." }, { status: 400 });
  }

  const parsed = parseSpecial(body, id);
  if (typeof parsed === "string") {
    return NextResponse.json({ error: parsed }, { status: 400 });
  }

  const previous = (await listSpecials()).find((item) => item.id === id);
  const saved = await updateSpecial(id, parsed);
  if (!saved) return NextResponse.json({ error: "That special is no longer on the desk." }, { status: 404 });
  if (previous && previous.image !== saved.image) await removeUploadedImage(previous.image);
  return NextResponse.json({ special: saved });
}

export async function DELETE(_request: Request, context: Context) {
  if (!(await authorised())) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const { id } = await context.params;
  const removed = await deleteSpecial(id);
  if (!removed) return NextResponse.json({ error: "That special is no longer on the desk." }, { status: 404 });
  await removeUploadedImage(removed.image);
  return NextResponse.json({ ok: true });
}
