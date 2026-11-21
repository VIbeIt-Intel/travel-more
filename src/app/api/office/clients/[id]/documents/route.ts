import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/session";
import { savePrivateFile } from "@/lib/storage";

const TYPES = new Set(["passport", "id", "other"]);

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  const { id } = await context.params;
  const client = await db.client.findUnique({ where: { id } });
  if (!client) return NextResponse.json({ error: "That client is not on the desk." }, { status: 404 });

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Could not read that file." }, { status: 400 });
  }
  const file = form.get("file");
  const type = String(form.get("type") ?? "other");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Choose a file." }, { status: 400 });
  }
  if (file.size > 8 * 1024 * 1024) {
    return NextResponse.json({ error: "Use a file under 8 MB." }, { status: 400 });
  }
  if (!TYPES.has(type)) return NextResponse.json({ error: "Choose a document type." }, { status: 400 });
  const saved = await savePrivateFile(file);
  const document = await db.clientDocument.create({
    data: { clientId: id, type, fileKey: saved.key, fileName: saved.fileName },
  });
  return NextResponse.json({ document });
}
