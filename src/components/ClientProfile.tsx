"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

const field = "mt-1 block min-h-11 w-full border border-sand-300 bg-sand-100 px-3 text-sm outline-none focus:border-[#1a7d76]";

const TABS = [
  ["overview", "Overview"],
  ["travellers", "Travellers"],
  ["documents", "Documents"],
  ["quotes", "Quotes"],
  ["bookings", "Bookings"],
  ["invoices", "Invoices and payments"],
  ["consent", "Consent and data"],
] as const;

type Traveller = {
  id: string;
  firstName: string;
  lastName: string;
  passportNumber: string;
  dateOfBirth: string;
  passportExpiry: string;
};

type DocumentRow = {
  id: string;
  type: string;
  fileName: string;
};

export function ClientProfile({
  client,
  travellers,
  documents,
  tab,
}: {
  client: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    idOrPassport: string;
    dateOfBirth: string;
    address: string;
    notes: string;
    marketingConsent: boolean;
    consentSource: string;
    consentAt: string;
  };
  travellers: Traveller[];
  documents: DocumentRow[];
  tab: string;
}) {
  const current = TABS.some(([id]) => id === tab) ? tab : "overview";
  return (
    <div className="mt-8">
      <div className="flex gap-2 overflow-x-auto pb-2">
        {TABS.map(([id, label]) => (
          <a
            key={id}
            href={`/office/clients/${client.id}?tab=${id}`}
            className={`shrink-0 px-3 py-2 text-sm font-semibold ${
              current === id ? "border-b-2 border-[#1a7d76] text-navy-900" : "text-navy-800/60"
            }`}
          >
            {label}
          </a>
        ))}
      </div>
      <div className="mt-4 border border-sand-300 bg-white px-5 py-5">
        {current === "overview" ? <Overview client={client} /> : null}
        {current === "travellers" ? <Travellers clientId={client.id} travellers={travellers} /> : null}
        {current === "documents" ? <Documents clientId={client.id} documents={documents} /> : null}
        {current === "quotes" ? <Later text="Quotes will sit here once the quote builder is in." /> : null}
        {current === "bookings" ? <Later text="Bookings will sit here once a quote is accepted." /> : null}
        {current === "invoices" ? <Later text="Invoices and payments will sit here with the invoice section." /> : null}
        {current === "consent" ? <Consent client={client} /> : null}
      </div>
    </div>
  );
}

function Overview({
  client,
}: {
  client: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    idOrPassport: string;
    dateOfBirth: string;
    address: string;
    notes: string;
    marketingConsent: boolean;
  };
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [saved, setSaved] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setError("");
    setSaved("");
    const response = await fetch(`/api/office/clients/${client.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: form.get("firstName"),
        lastName: form.get("lastName"),
        email: form.get("email"),
        phone: form.get("phone"),
        idOrPassport: form.get("idOrPassport"),
        dateOfBirth: form.get("dateOfBirth"),
        address: form.get("address"),
        notes: form.get("notes"),
        marketingConsent: form.get("marketingConsent") === "on",
      }),
    });
    const data = (await response.json().catch(() => null)) as { error?: string } | null;
    if (!response.ok) {
      setError(data?.error || "Could not save.");
      return;
    }
    setSaved("Saved");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
      <label className="text-sm">First name<input name="firstName" defaultValue={client.firstName} required className={field} /></label>
      <label className="text-sm">Last name<input name="lastName" defaultValue={client.lastName} className={field} /></label>
      <label className="text-sm">Email<input name="email" type="email" defaultValue={client.email} className={field} /></label>
      <label className="text-sm">Phone<input name="phone" defaultValue={client.phone} className={field} /></label>
      <label className="text-sm">ID or passport<input name="idOrPassport" defaultValue={client.idOrPassport} className={field} /></label>
      <label className="text-sm">Date of birth<input name="dateOfBirth" type="date" defaultValue={client.dateOfBirth} className={field} /></label>
      <label className="text-sm sm:col-span-2">Address<textarea name="address" defaultValue={client.address} rows={2} className={field} /></label>
      <label className="text-sm sm:col-span-2">Notes<textarea name="notes" defaultValue={client.notes} rows={3} className={field} /></label>
      <label className="flex items-center gap-2 text-sm sm:col-span-2">
        <input name="marketingConsent" type="checkbox" defaultChecked={client.marketingConsent} className="h-4 w-4" />
        They agreed to hear about future trips
      </label>
      {error ? <p className="text-sm text-red-700 sm:col-span-2">{error}</p> : null}
      {saved ? <p className="text-sm text-[#1a7d76] sm:col-span-2">{saved}</p> : null}
      <button type="submit" className="min-h-11 bg-[#1a7d76] px-5 text-sm font-semibold text-white sm:w-fit">
        Save
      </button>
    </form>
  );
}

function Travellers({ clientId, travellers }: { clientId: string; travellers: Traveller[] }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [saved, setSaved] = useState("");
  const [busy, setBusy] = useState(false);
  const [rows, setRows] = useState(travellers);

  useEffect(() => {
    setRows(travellers);
  }, [travellers]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const dateOfBirth = saToIso(String(form.get("dateOfBirth") ?? ""));
    const passportExpiry = saToIso(String(form.get("passportExpiry") ?? ""));
    if (dateOfBirth === null || passportExpiry === null) {
      setSaved("");
      setError("Use dates as dd/mm/yyyy.");
      return;
    }
    setBusy(true);
    setError("");
    setSaved("");
    const response = await fetch(`/api/office/clients/${clientId}/travellers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: form.get("firstName"),
        lastName: form.get("lastName"),
        passportNumber: form.get("passportNumber"),
        dateOfBirth,
        passportExpiry,
      }),
    });
    const data = (await response.json().catch(() => null)) as {
      error?: string;
      traveller?: { id: string; firstName: string; lastName: string; passportNumber: string; dateOfBirth: string | null; passportExpiry: string | null };
    } | null;
    setBusy(false);
    if (!response.ok || !data?.traveller) {
      setError(data?.error || "Could not add the traveller.");
      return;
    }
    const added = data.traveller;
    setRows((current) => [
      ...current,
      {
        id: added.id,
        firstName: added.firstName,
        lastName: added.lastName,
        passportNumber: added.passportNumber,
        dateOfBirth: added.dateOfBirth ? isoToSa(added.dateOfBirth.slice(0, 10)) : "",
        passportExpiry: added.passportExpiry ? isoToSa(added.passportExpiry.slice(0, 10)) : "",
      },
    ]);
    event.currentTarget.reset();
    setSaved("Saved");
    router.refresh();
  }

  return (
    <div>
      {rows.length === 0 ? <p className="text-sm text-navy-800/70">No other travellers yet.</p> : (
        <ul className="space-y-2">
          {rows.map((traveller) => (
            <li key={traveller.id} className="border border-sand-300/80 px-3 py-3 text-sm break-words">
              {traveller.firstName} {traveller.lastName}
              {traveller.dateOfBirth ? ` · born ${traveller.dateOfBirth}` : ""}
              {traveller.passportNumber ? ` · ${traveller.passportNumber}` : ""}
              {traveller.passportExpiry ? ` · passport expires ${traveller.passportExpiry}` : ""}
            </li>
          ))}
        </ul>
      )}
      <form onSubmit={submit} className="mt-5 grid gap-3 sm:grid-cols-2">
        <h3 className="font-display text-xl sm:col-span-2">Add a traveller</h3>
        <label className="text-sm">
          First name
          <input name="firstName" required autoComplete="given-name" className={field} />
        </label>
        <label className="text-sm">
          Last name
          <input name="lastName" autoComplete="family-name" className={field} />
        </label>
        <label className="text-sm sm:col-span-2">
          Passport number
          <input name="passportNumber" className={field} />
        </label>
        <label className="text-sm">
          Date of birth
          <input name="dateOfBirth" inputMode="numeric" placeholder="dd/mm/yyyy" autoComplete="bday" className={field} />
        </label>
        <label className="text-sm">
          Passport expiry
          <input name="passportExpiry" inputMode="numeric" placeholder="dd/mm/yyyy" className={field} />
        </label>
        {error ? <p className="text-sm text-red-700 sm:col-span-2">{error}</p> : null}
        {saved ? <p className="text-sm font-semibold text-[#1a7d76] sm:col-span-2">{saved}</p> : null}
        <button type="submit" disabled={busy} className="min-h-11 border border-navy-900/15 px-4 text-sm font-semibold disabled:opacity-60 sm:w-fit">
          {busy ? "Saving" : "Add traveller"}
        </button>
      </form>
    </div>
  );
}

function Documents({ clientId, documents }: { clientId: string; documents: DocumentRow[] }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [saved, setSaved] = useState("");
  const [busy, setBusy] = useState(false);
  const [rows, setRows] = useState(documents);

  useEffect(() => {
    setRows(documents);
  }, [documents]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const body = new FormData(event.currentTarget);
    setBusy(true);
    setError("");
    setSaved("");
    const response = await fetch(`/api/office/clients/${clientId}/documents`, { method: "POST", body });
    const data = (await response.json().catch(() => null)) as {
      error?: string;
      document?: DocumentRow;
    } | null;
    setBusy(false);
    if (!response.ok || !data?.document) {
      setError(data?.error || "Could not store that file.");
      return;
    }
    setRows((current) => [data.document as DocumentRow, ...current]);
    event.currentTarget.reset();
    setSaved("Saved");
    router.refresh();
  }

  return (
    <div>
      {rows.length === 0 ? <p className="text-sm text-navy-800/70">No documents stored yet.</p> : (
        <ul className="space-y-2">
          {rows.map((document) => (
            <li key={document.id}>
              <a className="text-sm font-semibold text-[#1a7d76] underline-offset-4 hover:underline" href={`/api/office/documents/${document.id}`}>
                {document.fileName || document.type}
              </a>
              <span className="ml-2 text-xs uppercase tracking-[0.14em] text-navy-800/50">{document.type}</span>
            </li>
          ))}
        </ul>
      )}
      <form onSubmit={submit} className="mt-5 grid gap-3 sm:grid-cols-2">
        <select name="type" className={field}>
          <option value="passport">Passport</option>
          <option value="id">ID</option>
          <option value="other">Other</option>
        </select>
        <input name="file" type="file" required className="text-sm" />
        {error ? <p className="text-sm text-red-700 sm:col-span-2">{error}</p> : null}
        {saved ? <p className="text-sm font-semibold text-[#1a7d76] sm:col-span-2">{saved}</p> : null}
        <button type="submit" disabled={busy} className="min-h-11 border border-navy-900/15 px-4 text-sm font-semibold disabled:opacity-60 sm:w-fit">
          {busy ? "Saving" : "Upload"}
        </button>
      </form>
    </div>
  );
}

function Consent({
  client,
}: {
  client: { marketingConsent: boolean; consentSource: string; consentAt: string };
}) {
  return (
    <div className="space-y-2 text-sm text-navy-800/80">
      <p>Consent recorded from {client.consentSource || "the desk"}{client.consentAt ? ` on ${client.consentAt}` : ""}.</p>
      <p>{client.marketingConsent ? "They agreed to hear about future trips." : "They have not agreed to marketing."}</p>
      <p>Export and deletion stay with the owner tools, which are not in this section yet.</p>
    </div>
  );
}

function saToIso(value: string) {
  const text = value.trim();
  if (!text) return "";
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(text);
  if (!match) return null;
  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null;
  return `${match[3]}-${match[2]}-${match[1]}`;
}

function isoToSa(iso: string) {
  const [year, month, day] = iso.split("-");
  if (!year || !month || !day) return "";
  return `${day}/${month}/${year}`;
}

function Later({ text }: { text: string }) {
  return <p className="text-sm text-navy-800/70">{text}</p>;
}
