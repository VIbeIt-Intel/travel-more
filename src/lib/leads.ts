import { SITE } from "./constants";
import { db } from "./db";
import type { Enquiry } from "./enquiries";
import { mailConfigured, sendMail } from "./mailer";

export async function saveLeadFromEnquiry(
  enquiry: Enquiry,
  request?: { ipAddress?: string; userAgent?: string },
) {
  const lead = await db.lead.upsert({
    where: { id: enquiry.id },
    create: {
      id: enquiry.id,
      createdAt: new Date(enquiry.createdAt),
      destination: enquiry.destination,
      month: enquiry.month,
      year: enquiry.year,
      flexible: enquiry.flexible,
      adults: enquiry.adults,
      children: enquiry.children,
      nights: enquiry.nights,
      trip: enquiry.trip,
      name: enquiry.name,
      email: enquiry.email,
      phone: enquiry.phone,
      notes: enquiry.notes,
      source: "website",
      stage: "new",
    },
    update: {},
  });

  await db.auditLog.create({
    data: {
      action: "create",
      entity: "lead",
      entityId: lead.id,
      ipAddress: request?.ipAddress || "",
      userAgent: request?.userAgent || "",
    },
  });

  if (!mailConfigured()) return lead;

  const subject = `New ${enquiry.destination} trip request`;
  const text = [
    `${enquiry.name} asked about ${enquiry.destination}.`,
    "",
    `When: ${enquiry.month} ${enquiry.year}${enquiry.flexible ? " (dates can move)" : ""}`,
    `Stay: ${enquiry.nights}`,
    `Trip: ${enquiry.trip}`,
    `Travellers: ${enquiry.adults} adults, ${enquiry.children} children`,
    `Email: ${enquiry.email}`,
    enquiry.phone ? `Phone: ${enquiry.phone}` : "",
    enquiry.notes ? "" : "",
    enquiry.notes,
  ]
    .filter((line) => line !== "")
    .join("\n");
  const html = text
    .split("\n")
    .map((line) => (line ? `<p>${line.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</p>` : "<br>"))
    .join("");

  try {
    await sendMail([...SITE.emails], subject, text, html);
  } catch (error) {
    console.error("[leads] Could not email the office", error);
  }

  return lead;
}
