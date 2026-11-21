"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

const field = "mt-1 block min-h-11 w-full border border-sand-300 bg-sand-100 px-3 text-sm outline-none focus:border-[#1a7d76]";

export function ClientCreateForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setBusy(true);
    setError("");
    const response = await fetch("/api/office/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: form.get("firstName"),
        lastName: form.get("lastName"),
        email: form.get("email"),
        phone: form.get("phone"),
        notes: form.get("notes"),
        marketingConsent: form.get("marketingConsent") === "on",
      }),
    });
    const data = (await response.json().catch(() => null)) as { client?: { id: string }; error?: string } | null;
    setBusy(false);
    if (!response.ok || !data?.client) {
      setError(data?.error || "Could not save the client.");
      return;
    }
    router.push(`/office/clients/${data.client.id}`);
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="mt-8 grid gap-4 border border-sand-300 bg-white px-5 py-5 sm:grid-cols-2">
      <h2 className="font-display text-2xl text-navy-900 sm:col-span-2">Add a client</h2>
      <label className="text-sm text-navy-900">
        First name
        <input name="firstName" required className={field} />
      </label>
      <label className="text-sm text-navy-900">
        Last name
        <input name="lastName" className={field} />
      </label>
      <label className="text-sm text-navy-900">
        Email
        <input name="email" type="email" className={field} />
      </label>
      <label className="text-sm text-navy-900">
        Phone
        <input name="phone" className={field} />
      </label>
      <label className="text-sm text-navy-900 sm:col-span-2">
        Notes
        <textarea name="notes" rows={3} className={field} />
      </label>
      <label className="flex items-center gap-2 text-sm sm:col-span-2">
        <input name="marketingConsent" type="checkbox" className="h-4 w-4" />
        They agreed to hear about future trips
      </label>
      {error ? <p className="text-sm text-red-700 sm:col-span-2">{error}</p> : null}
      <button type="submit" disabled={busy} className="min-h-11 bg-[#1a7d76] px-5 text-sm font-semibold text-white disabled:opacity-60 sm:col-span-2 sm:w-fit">
        {busy ? "Saving" : "Save client"}
      </button>
    </form>
  );
}
