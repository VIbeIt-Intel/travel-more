import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";

export function storageDir() {
  return path.resolve(process.cwd(), process.env.STORAGE_DIR || "data/uploads");
}

function safeKey(key: string) {
  const name = path.basename(key);
  if (!name || name !== key || name.includes("..")) return "";
  return name;
}

export async function savePrivateFile(file: File) {
  const ext = path.extname(file.name).toLowerCase().replace(/[^.a-z0-9]/g, "").slice(0, 8);
  const key = `${randomUUID()}${ext}`;
  const dir = storageDir();
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, key), Buffer.from(await file.arrayBuffer()));
  return { key, fileName: path.basename(file.name).slice(0, 120) };
}

export async function readPrivateFile(key: string) {
  const name = safeKey(key);
  if (!name) return null;
  try {
    return await fs.readFile(path.join(storageDir(), name));
  } catch {
    return null;
  }
}
