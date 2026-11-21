import path from "path";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function sqliteFileUrl() {
  const raw = process.env.DATABASE_URL || "file:./data/office.db";
  const filePath = raw.startsWith("file:") ? raw.slice("file:".length) : raw;
  return path.isAbsolute(filePath) ? filePath : path.resolve(process.cwd(), filePath);
}

function createClient() {
  const provider = process.env.DATABASE_PROVIDER || "sqlite";
  if (provider !== "sqlite") {
    throw new Error("Install @prisma/adapter-pg and wire it in src/lib/db.ts before using PostgreSQL.");
  }
  const adapter = new PrismaBetterSqlite3({ url: sqliteFileUrl() });
  return new PrismaClient({ adapter });
}

export const db = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
