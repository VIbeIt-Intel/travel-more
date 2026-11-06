"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  DESTINATION_IDS,
  DESTINATIONS,
  type DestinationId,
  type RateTable,
} from "@/lib/tripPlanner";

type Field = "comfort" | "premium" | "luxury" | "transport";
type Draft = Record<DestinationId, Record<Field, string>>;

const FIELDS: { key: Field; label: string }[] = [
  { key: "comfort", label: "Comfort, per person per night" },
  { key: "premium", label: "Premium, per person per night" },
  { key: "luxury", label: "Ultra luxury, per person per night" },
  { key: "transport", label: "Flights or transfers, per person" },
];

function toDraft(rates: RateTable): Draft {
  return DESTINATION_IDS.reduce((draft, id) => {
    const row = rates[id];
    draft[id] = {
      comfort: String(row.nightlyRate.comfort),
      premium: String(row.nightlyRate.premium),
      luxury: String(row.nightlyRate.luxury),
      transport: String(row.transportCost),
    };
    return draft;
  }, {} as Draft);
}

export function OfficeRates() {
  const [draft, setDraft] = useState<Draft | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/api/rates")
      .then((response) => response.json())
      .then((data: { rates: RateTable }) => {
        if (active && data.rates) setDraft(toDraft(data.rates));
      })
      .catch(() => {
        if (active) setError("Could not load the estimates.");
      });
    return () => {
      active = false;
    };
  }, []);

  function setField(id: DestinationId, key: Field, value: string) {
    setMessage("");
    setDraft((current) =>
      current
        ? { ...current, [id]: { ...current[id], [key]: value.replace(/[^\d]/g, "") } }
        : current,
    );
  }

  async function save(event: FormEvent) {
    event.preventDefault();
    if (!draft) return;
    setSaving(true);
    setError("");
    setMessage("");

    const rates = DESTINATION_IDS.reduce((table, id) => {
      const row = draft[id];
      table[id] = {
        nightlyRate: {
          comfort: Number(row.comfort),
          premium: Number(row.premium),
          luxury: Number(row.luxury),
        },
        transportCost: Number(row.transport),
      };
      return table;
    }, {} as RateTable);

    const response = await fetch("/api/rates", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rates }),
    });
    const data = (await response.json().catch(() => null)) as { error?: string; rates?: RateTable } | null;
    setSaving(false);
    if (!response.ok || !data?.rates) {
      setError(data?.error || "Could not save.");
      return;
    }
    setDraft(toDraft(data.rates));
    setMessage("Saved. The next plan a traveller builds will use these figures.");
  }

  if (!draft) {
    return <p className="mt-10 text-sm text-navy-800/70">{error || "Loading estimates."}</p>;
  }

  return (
    <form onSubmit={save} className="mt-10 border border-sand-300 bg-white px-6 py-6">
      <h2 className="font-display text-3xl font-semibold text-navy-900">Planner estimates</h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-navy-800/70">
        These are the figures behind the trip planner on the website. A visitor sees a range around
        the nightly rate times the nights, plus flights or transfers. Saving here changes the next
        plan someone builds.
      </p>
      <div className="mt-6 space-y-6">
        {DESTINATION_IDS.map((id) => (
          <fieldset key={id} className="border border-sand-300/80 px-4 py-4">
            <legend className="px-2 font-display text-2xl text-navy-900">{DESTINATIONS[id].name}</legend>
            <p className="mb-3 text-xs uppercase tracking-[0.14em] text-navy-800/50">
              {DESTINATIONS[id].transportLabel}
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {FIELDS.map((field) => (
                <label key={field.key} className="block text-sm text-navy-900">
                  {field.label}
                  <span className="mt-1.5 flex items-center border border-sand-300 bg-sand-100">
                    <span className="px-3 text-navy-800/50">R</span>
                    <input
                      inputMode="numeric"
                      value={draft[id][field.key]}
                      onChange={(event) => setField(id, field.key, event.target.value)}
                      className="w-full bg-transparent py-2.5 pr-3 outline-none"
                      required
                    />
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        ))}
      </div>
      {error ? <p className="mt-4 text-sm text-red-700">{error}</p> : null}
      {message ? <p className="mt-4 text-sm text-[#1a7d76]">{message}</p> : null}
      <button
        type="submit"
        disabled={saving}
        className="mt-6 bg-[#1a7d76] px-6 py-3 text-sm font-semibold text-white disabled:opacity-60"
      >
        {saving ? "Saving" : "Save estimates"}
      </button>
    </form>
  );
}
