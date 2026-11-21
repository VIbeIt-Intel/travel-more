import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { officeCookieName, tokenMatches } from "@/lib/enquiries";

export const dynamic = "force-dynamic";

const TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export async function POST(request: Request) {
  const jar = await cookies();
  if (!tokenMatches(jar.get(officeCookieName())?.value)) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Could not read that picture." }, { status: 400 });
  }

  const file = form.get("image");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Choose a picture." }, { status: 400 });
  }
  if (file.size > 8 * 1024 * 1024) {
    return NextResponse.json({ error: "Use a picture under 8 MB." }, { status: 400 });
  }

  const ext = TYPES[file.type];
  if (!ext) {
    return NextResponse.json({ error: "Use a JPG, PNG, or WebP picture." }, { status: 400 });
  }

  const name = `${randomUUID()}.${ext}`;
  const dir = path.join(process.cwd(), "public", "specials");
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()));
  return NextResponse.json({ image: `/specials/${name}` });
}
