import { randomBytes, scryptSync, timingSafeEqual } from "crypto";

export const MIN_PASSWORD_LENGTH = 10;
const KEY_LENGTH = 64;

export function hashPassword(password: string, salt = randomBytes(16)) {
  const hash = scryptSync(password, salt, KEY_LENGTH);
  return { hash: hash.toString("hex"), salt: salt.toString("hex") };
}

export function passwordMatches(password: string, hashHex: string, saltHex: string) {
  const expected = Buffer.from(hashHex, "hex");
  const actual = scryptSync(password, Buffer.from(saltHex, "hex"), expected.length);
  if (actual.length !== expected.length) return false;
  return timingSafeEqual(actual, expected);
}
