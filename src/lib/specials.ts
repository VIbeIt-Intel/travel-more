import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";

export type Special = {
  id: string;
  destination: string;
  name: string;
  badge: string;
  price: string;
  priceNote: string;
  flights: string;
  included: string[];
  image: string;
  alt: string;
  video: string;
};

const FILE = path.join(process.cwd(), "data", "specials.json");

function clean(value: unknown, max: number) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

export function parseSpecial(input: unknown, id?: string): Special | string {
  if (!input || typeof input !== "object") return "Add the special details.";
  const body = input as Record<string, unknown>;
  const destination = clean(body.destination, 80);
  const name = clean(body.name, 80);
  const price = clean(body.price, 48);
  if (destination.length < 2) return "Add the destination.";
  if (name.length < 2) return "Add a name for the special.";
  if (!price) return "Add the price.";

  const includedRaw = Array.isArray(body.included)
    ? body.included
    : String(body.included ?? "").split("\n");
  const included = includedRaw
    .map((item) => clean(item, 80))
    .filter((item) => item.length >= 2)
    .slice(0, 8);

  const image = clean(body.image, 200);
  if (image && (!image.startsWith("/") || image.includes(".."))) {
    return "That picture cannot be used.";
  }
  const video = clean(body.video, 200);
  if (video && (!video.startsWith("/") || video.includes("..") || !video.endsWith(".mp4"))) {
    return "That clip cannot be used.";
  }

  return {
    id: id || randomUUID(),
    destination,
    name,
    badge: clean(body.badge, 32),
    price,
    priceNote: clean(body.priceNote, 80),
    flights: clean(body.flights, 120),
    included,
    image,
    alt: clean(body.alt, 160) || `${name}, ${destination}`,
    video,
  };
}

async function readAll(): Promise<Special[]> {
  try {
    const parsed = JSON.parse(await fs.readFile(FILE, "utf8")) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.flatMap((item) => {
      if (!item || typeof item !== "object") return [];
      const record = item as Partial<Special>;
      const special = parseSpecial(item, typeof record.id === "string" ? record.id : undefined);
      return typeof special === "string" ? [] : [special];
    });
  } catch {
    return [];
  }
}

async function writeAll(specials: Special[]) {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(specials, null, 2));
}

export async function listSpecials() {
  return readAll();
}

export async function addSpecial(special: Special) {
  const specials = await readAll();
  specials.push(special);
  await writeAll(specials);
  return special;
}

export async function updateSpecial(id: string, special: Special) {
  const specials = await readAll();
  const index = specials.findIndex((item) => item.id === id);
  if (index < 0) return null;
  specials[index] = special;
  await writeAll(specials);
  return special;
}

export async function deleteSpecial(id: string) {
  const specials = await readAll();
  const current = specials.find((item) => item.id === id);
  if (!current) return null;
  await writeAll(specials.filter((item) => item.id !== id));
  return current;
}

export async function orderSpecials(ids: string[]) {
  const specials = await readAll();
  const byId = new Map(specials.map((item) => [item.id, item]));
  const next = ids.flatMap((id) => {
    const item = byId.get(id);
    if (!item) return [];
    byId.delete(id);
    return [item];
  });
  next.push(...byId.values());
  await writeAll(next);
  return next;
}

export async function removeUploadedImage(image: string) {
  if (!image.startsWith("/specials/")) return;
  const name = path.basename(image);
  if (!/^[\w.-]+$/.test(name)) return;
  await fs.unlink(path.join(process.cwd(), "public", "specials", name)).catch(() => undefined);
}
