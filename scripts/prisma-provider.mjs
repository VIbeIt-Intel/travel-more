import fs from "node:fs";
import path from "node:path";

const allowed = new Set(["sqlite", "postgresql"]);
const provider = process.env.DATABASE_PROVIDER || "sqlite";

if (!allowed.has(provider)) {
  console.error("DATABASE_PROVIDER must be sqlite or postgresql.");
  process.exit(1);
}

const file = path.join(process.cwd(), "prisma", "schema.prisma");
const source = fs.readFileSync(file, "utf8");
const next = source.replace(/provider\s*=\s*"(sqlite|postgresql)"/, `provider = "${provider}"`);

if (next === source && !source.includes(`provider = "${provider}"`)) {
  console.error("Could not find the datasource provider line in prisma/schema.prisma.");
  process.exit(1);
}

if (next !== source) fs.writeFileSync(file, next);
console.log(`Prisma provider is ${provider}.`);
