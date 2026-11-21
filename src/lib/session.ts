import { createHash, randomBytes } from "crypto";
import { cookies } from "next/headers";
import { db } from "./db";
import { passwordMatches } from "./passwords";

export const OFFICE_COOKIE = "tm_office";
const FOURTEEN_DAYS_MS = 1000 * 60 * 60 * 24 * 14;

export function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function officeCookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  };
}

export async function currentUser() {
  const jar = await cookies();
  const token = jar.get(OFFICE_COOKIE)?.value;
  if (!token) return null;
  const session = await db.session.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { user: true },
  });
  if (!session || session.expiresAt.getTime() <= Date.now() || !session.user.active) return null;
  return session.user;
}

export async function startSession(userId: string, request: Request) {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + FOURTEEN_DAYS_MS);
  await db.session.create({
    data: {
      userId,
      tokenHash: hashToken(token),
      expiresAt,
      ipAddress: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "",
      userAgent: request.headers.get("user-agent") || "",
    },
  });
  await db.user.update({ where: { id: userId }, data: { lastLoginAt: new Date() } });
  return token;
}

export async function endSession() {
  const jar = await cookies();
  const token = jar.get(OFFICE_COOKIE)?.value;
  if (!token) return;
  await db.session.deleteMany({ where: { tokenHash: hashToken(token) } });
}

export async function checkPassword(email: string, password: string) {
  const user = await db.user.findUnique({ where: { email: email.trim().toLowerCase() } });
  if (!user || !user.active) return null;
  if (!passwordMatches(password, user.passwordHash, user.passwordSalt)) return null;
  return user;
}
