import { promises as fs } from "fs";
import path from "path";
import {
  DESTINATION_IDS,
  defaultRateTable,
  type RateTable,
  type Tier,
} from "./tripPlanner";

const FILE = path.join(process.cwd(), "data", "rates.json");
const TIERS: Tier[] = ["comfort", "premium", "luxury"];
const MAX = 500_000;

function asMoney(value: unknown) {
  if (typeof value === "number" && Number.isInteger(value) && value >= 0 && value <= MAX) return value;
  if (typeof value === "string" && /^\d+$/.test(value)) {
    const amount = Number(value);
    if (amount <= MAX) return amount;
  }
  return null;
}

export function parseRates(input: unknown): RateTable | string {
  if (!input || typeof input !== "object") return "Send a rate for each destination.";
  const source = input as Record<string, unknown>;
  const next = defaultRateTable();

  for (const id of DESTINATION_IDS) {
    const row = source[id];
    if (!row || typeof row !== "object") return "Each destination needs its own figures.";
    const record = row as Record<string, unknown>;
    const nightly = record.nightlyRate;
    if (!nightly || typeof nightly !== "object") {
      return "Each destination needs comfort, premium and ultra luxury rates.";
    }
    const nights = nightly as Record<string, unknown>;
    for (const tier of TIERS) {
      const amount = asMoney(nights[tier]);
      if (amount === null) return "Rates must be whole rands, from 0 to 500000.";
      next[id].nightlyRate[tier] = amount;
    }
    const transport = asMoney(record.transportCost);
    if (transport === null) return "Flights and transfers must be whole rands, from 0 to 500000.";
    next[id].transportCost = transport;
  }

  return next;
}

export async function readRates(): Promise<RateTable> {
  try {
    const parsed = parseRates(JSON.parse(await fs.readFile(FILE, "utf8")) as unknown);
    return typeof parsed === "string" ? defaultRateTable() : parsed;
  } catch {
    return defaultRateTable();
  }
}

export async function writeRates(table: RateTable) {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(table, null, 2));
}
