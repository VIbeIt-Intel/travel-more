import { randomBytes, scryptSync } from "node:crypto";
import path from "node:path";
import Database from "better-sqlite3";

const MIN_PASSWORD_LENGTH = 10;
const email = (process.env.OFFICE_OWNER_EMAIL || "").trim().toLowerCase();
const password = process.env.OFFICE_PASSWORD || "";
const name = (process.env.OFFICE_OWNER_NAME || "Fransmari").trim() || "Fransmari";

if (!email) {
  console.error("Set OFFICE_OWNER_EMAIL in .env.local.");
  process.exit(1);
}
if (!password) {
  console.error("Set OFFICE_PASSWORD in .env.local.");
  process.exit(1);
}
if (password.length < MIN_PASSWORD_LENGTH) {
  console.warn(
    `OFFICE_PASSWORD is under ${MIN_PASSWORD_LENGTH} characters. It is kept so the current desk password still works. New passwords must be longer.`,
  );
}

const fileUrl = process.env.DATABASE_URL || "file:./data/office.db";
const filePath = fileUrl.startsWith("file:") ? fileUrl.slice("file:".length) : fileUrl;
const databasePath = path.isAbsolute(filePath) ? filePath : path.resolve(process.cwd(), filePath);
const db = new Database(databasePath);

const salt = randomBytes(16);
const hash = scryptSync(password, salt, 64);

const settings = db.prepare("SELECT id FROM CompanySettings WHERE id = 'default'").get();
if (!settings) {
  db.prepare(
    `INSERT INTO CompanySettings (
      id, businessName, email, phone, website, address, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    "default",
    "TravelMORE",
    "fransmari@travelmorebl.com",
    "076 481 2699",
    "https://travelmorebl.com",
    "Gauteng, South Africa",
    new Date().toISOString(),
  );
  console.log("Company settings created.");
} else {
  console.log("Company settings already exist.");
}

const existing = db.prepare("SELECT id FROM User WHERE email = ?").get(email);
if (existing) {
  console.log("Owner already exists. Password left unchanged.");
} else {
  db.prepare(
    `INSERT INTO User (
      id, name, email, passwordHash, passwordSalt, role, active, createdAt, updatedAt
    ) VALUES (?, ?, ?, ?, ?, 'owner', 1, ?, ?)`,
  ).run(`owner_${Date.now()}`, name, email, hash.toString("hex"), salt.toString("hex"), new Date().toISOString(), new Date().toISOString());
  console.log("Owner created.");
}

db.close();
