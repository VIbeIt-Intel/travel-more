import { createHash, createHmac, randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { readFileSync, promises as fs } from "fs";
import path from "path";

type Credentials = {
  hash?: string;
  salt?: string;
  resetHash?: string;
  resetExpires?: number;
  resetIssuedAt?: number;
};

const FILE = path.join(process.cwd(), "data", "office.json");
const COOKIE = "tm_office";
const RESET_MINUTES = 30;
const RESET_COOLDOWN_MS = 2 * 60 * 1000;
export const MIN_PASSWORD_LENGTH = 10;

function readCredentials(): Credentials {
  try {
    const parsed = JSON.parse(readFileSync(FILE, "utf8")) as unknown;
    return parsed && typeof parsed === "object" ? (parsed as Credentials) : {};
  } catch {
    return {};
  }
}

async function writeCredentials(credentials: Credentials) {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(credentials, null, 2), "utf8");
}

function envPassword() {
  return process.env.OFFICE_PASSWORD ?? "";
}

function sha256(value: string) {
  return createHash("sha256").update(value).digest();
}

function secret() {
  return readCredentials().hash || envPassword();
}

export function officeConfigured() {
  return secret().length > 0;
}

export function passwordMatches(attempt: string) {
  const { hash, salt } = readCredentials();
  if (hash && salt) {
    const expected = Buffer.from(hash, "hex");
    const actual = scryptSync(attempt, Buffer.from(salt, "hex"), expected.length);
    return timingSafeEqual(actual, expected);
  }
  const expected = envPassword();
  if (!expected || attempt.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(attempt), Buffer.from(expected));
}

export function officeToken() {
  return createHmac("sha256", secret()).update("travelmore-office").digest("hex");
}

export function officeCookieName() {
  return COOKIE;
}

export function tokenMatches(value: string | undefined) {
  if (!officeConfigured() || !value || value.length !== officeToken().length) return false;
  return timingSafeEqual(Buffer.from(value), Buffer.from(officeToken()));
}

export async function startReset() {
  const credentials = readCredentials();
  if (credentials.resetIssuedAt && Date.now() - credentials.resetIssuedAt < RESET_COOLDOWN_MS) {
    return null;
  }
  const token = randomBytes(32).toString("hex");
  await writeCredentials({
    ...credentials,
    resetHash: sha256(token).toString("hex"),
    resetExpires: Date.now() + RESET_MINUTES * 60 * 1000,
    resetIssuedAt: Date.now(),
  });
  return { token, minutes: RESET_MINUTES };
}

export function resetTokenValid(token: string) {
  const { resetHash, resetExpires } = readCredentials();
  if (!resetHash || !resetExpires || Date.now() > resetExpires || !/^[0-9a-f]{64}$/.test(token)) {
    return false;
  }
  return timingSafeEqual(sha256(token), Buffer.from(resetHash, "hex"));
}

export async function finishReset(token: string, newPassword: string) {
  if (!resetTokenValid(token)) return false;
  const salt = randomBytes(16);
  await writeCredentials({
    hash: scryptSync(newPassword, salt, 64).toString("hex"),
    salt: salt.toString("hex"),
  });
  return true;
}
