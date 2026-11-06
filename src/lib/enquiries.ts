import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";

export type EnquiryStatus = "new" | "contacted";

export type Enquiry = {
  id: string;
  createdAt: string;
  destination: string;
  month: string;
  year: string;
  flexible: boolean;
  adults: number;
  children: number;
  nights: string;
  trip: string;
  name: string;
  email: string;
  phone: string;
  notes: string;
  status: EnquiryStatus;
};

const FILE = path.join(process.cwd(), "data", "enquiries.json");
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
  "Not sure yet",
];

const NIGHTS = ["5 nights", "7 nights", "10 nights", "14 nights", "Not sure yet"];
const TRIPS = ["Holiday", "Honeymoon", "Family", "Business", "Not sure yet"];

export {
  officeConfigured,
  officeCookieName,
  officeToken,
  passwordMatches,
  tokenMatches,
} from "./officeAuth";

async function readAll(): Promise<Enquiry[]> {
  try {
    const raw = await fs.readFile(FILE, "utf8");
    const parsed = JSON.parse(raw) as Enquiry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeAll(items: Enquiry[]) {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(items, null, 2), "utf8");
}

function clean(value: unknown, max: number) {
  return String(value ?? "").trim().slice(0, max);
}

export function parseEnquiry(body: unknown, destination: string): Enquiry | string {
  if (!body || typeof body !== "object") return "Please complete the form.";
  const input = body as Record<string, unknown>;
  const month = clean(input.month, 20);
  const year = clean(input.year, 4);
  const nights = clean(input.nights, 20);
  const trip = clean(input.trip, 20);
  const name = clean(input.name, 80);
  const email = clean(input.email, 120);
  const phone = clean(input.phone, 30);
  const notes = clean(input.notes, 1000);
  const adults = Number(input.adults);
  const children = Number(input.children);
  const thisYear = new Date().getFullYear();

  if (!MONTHS.includes(month)) return "Choose the month you want to travel.";
  if (!/^\d{4}$/.test(year) || Number(year) < thisYear || Number(year) > thisYear + 3) {
    return "Choose a year.";
  }
  if (!Number.isInteger(adults) || adults < 1 || adults > 20) return "Tell us how many adults are travelling.";
  if (!Number.isInteger(children) || children < 0 || children > 12) return "Tell us how many children are travelling.";
  if (!NIGHTS.includes(nights)) return "Choose how long you want to stay.";
  if (!TRIPS.includes(trip)) return "Choose what the trip is for.";
  if (name.length < 2) return "Add your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Add a valid email address.";

  return {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    destination: clean(destination, 80),
    month,
    year,
    flexible: Boolean(input.flexible),
    adults,
    children,
    nights,
    trip,
    name,
    email,
    phone,
    notes,
    status: "new",
  };
}

export async function addEnquiry(enquiry: Enquiry) {
  const items = await readAll();
  items.unshift(enquiry);
  await writeAll(items.slice(0, 2000));
  return enquiry;
}

export async function listEnquiries() {
  return readAll();
}

export async function setEnquiryStatus(id: string, status: EnquiryStatus) {
  const items = await readAll();
  const item = items.find((entry) => entry.id === id);
  if (!item) return null;
  item.status = status;
  await writeAll(items);
  return item;
}
