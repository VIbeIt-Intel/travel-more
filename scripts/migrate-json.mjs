import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";

const root = process.cwd();
const fileUrl = process.env.DATABASE_URL || "file:./data/office.db";
const filePath = fileUrl.startsWith("file:") ? fileUrl.slice("file:".length) : fileUrl;
const databasePath = path.isAbsolute(filePath) ? filePath : path.resolve(root, filePath);
const db = new Database(databasePath);
const now = new Date().toISOString();

function readJson(name) {
  const file = path.join(root, "data", name);
  const before = fs.readFileSync(file);
  const parsed = JSON.parse(before.toString("utf8"));
  const after = fs.readFileSync(file);
  if (!before.equals(after)) throw new Error(`${name} changed while reading.`);
  return { rows: Array.isArray(parsed) ? parsed : [], bytes: before.length };
}

const specials = readJson("specials.json");
const enquiries = readJson("enquiries.json");

const saveSpecial = db.prepare(
  `INSERT INTO Special (
    id, destination, name, badge, price, priceNote, flights, included, image, alt, video, sortOrder, createdAt, updatedAt
  ) VALUES (
    @id, @destination, @name, @badge, @price, @priceNote, @flights, @included, @image, @alt, @video, @sortOrder, @createdAt, @updatedAt
  )
  ON CONFLICT(id) DO UPDATE SET
    destination = excluded.destination,
    name = excluded.name,
    badge = excluded.badge,
    price = excluded.price,
    priceNote = excluded.priceNote,
    flights = excluded.flights,
    included = excluded.included,
    image = excluded.image,
    alt = excluded.alt,
    video = excluded.video,
    sortOrder = excluded.sortOrder,
    updatedAt = excluded.updatedAt`,
);

const saveLead = db.prepare(
  `INSERT INTO Lead (
    id, createdAt, updatedAt, destination, month, year, flexible, adults, children, nights, trip,
    name, email, phone, notes, source, stage, lostReason
  ) VALUES (
    @id, @createdAt, @updatedAt, @destination, @month, @year, @flexible, @adults, @children, @nights, @trip,
    @name, @email, @phone, @notes, 'website', @stage, ''
  )
  ON CONFLICT(id) DO UPDATE SET
    destination = excluded.destination,
    month = excluded.month,
    year = excluded.year,
    flexible = excluded.flexible,
    adults = excluded.adults,
    children = excluded.children,
    nights = excluded.nights,
    trip = excluded.trip,
    name = excluded.name,
    email = excluded.email,
    phone = excluded.phone,
    notes = excluded.notes,
    stage = excluded.stage,
    updatedAt = excluded.updatedAt`,
);

const importAll = db.transaction(() => {
  specials.rows.forEach((item, index) => {
    const included = Array.isArray(item.included) ? item.included.filter(Boolean).join("\n") : "";
    saveSpecial.run({
      id: String(item.id),
      destination: String(item.destination ?? ""),
      name: String(item.name ?? ""),
      badge: String(item.badge ?? ""),
      price: String(item.price ?? ""),
      priceNote: String(item.priceNote ?? ""),
      flights: String(item.flights ?? ""),
      included,
      image: String(item.image ?? ""),
      alt: String(item.alt ?? ""),
      video: String(item.video ?? ""),
      sortOrder: index,
      createdAt: now,
      updatedAt: now,
    });
  });
  enquiries.rows.forEach((item) => {
    const stage = item.status === "contacted" ? "contacted" : "new";
    saveLead.run({
      id: String(item.id),
      createdAt: item.createdAt || now,
      updatedAt: now,
      destination: String(item.destination ?? ""),
      month: String(item.month ?? ""),
      year: String(item.year ?? ""),
      flexible: item.flexible ? 1 : 0,
      adults: Number(item.adults) || 1,
      children: Number(item.children) || 0,
      nights: String(item.nights ?? ""),
      trip: String(item.trip ?? ""),
      name: String(item.name ?? ""),
      email: String(item.email ?? ""),
      phone: String(item.phone ?? ""),
      notes: String(item.notes ?? ""),
      stage,
    });
  });
});

importAll();
console.log(`specials: ${specials.rows.length} imported (${specials.bytes} bytes left untouched)`);
console.log(`enquiries: ${enquiries.rows.length} imported (${enquiries.bytes} bytes left untouched)`);
console.log(`specials in database: ${db.prepare("SELECT COUNT(*) AS n FROM Special").get().n}`);
console.log(`leads in database: ${db.prepare("SELECT COUNT(*) AS n FROM Lead").get().n}`);
db.close();
