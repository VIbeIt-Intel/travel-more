"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const STAGES = [
  ["new", "New"],
  ["contacted", "Contacted"],
  ["quoted", "Quoted"],
  ["booked", "Booked"],
  ["lost", "Lost"],
  ["converted", "Converted"],
] as const;

export function LeadActions({
  id,
  stage,
  lostReason,
  clientId,
}: {
  id: string;
  stage: string;
  lostReason: string;
  clientId: string | null;
}) {
  const router = useRouter();
  const [nextStage, setNextStage] = useState(stage);
  const [reason, setReason] = useState(lostReason);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState("");
  const [busy, setBusy] = useState(false);
  const [linkedClient, setLinkedClient] = useState(clientId);
  const [shownStage, setShownStage] = useState(stage);

  useEffect(() => {
    setNextStage(stage);
    setShownStage(stage);
    setLinkedClient(clientId);
  }, [stage, clientId]);

  async function saveStage() {
    setBusy(true);
    setError("");
    setSaved("");
    const response = await fetch(`/api/office/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stage: nextStage, lostReason: reason }),
    });
    setBusy(false);
    if (!response.ok) {
      setError("Could not save the stage.");
      return;
    }
    setShownStage(nextStage);
    setSaved("Saved");
    router.refresh();
  }

  async function convert() {
    setBusy(true);
    setError("");
    setSaved("");
    const response = await fetch(`/api/office/leads/${id}/convert`, { method: "POST" });
    const data = (await response.json().catch(() => null)) as { clientId?: string; error?: string } | null;
    setBusy(false);
    if (!response.ok || !data?.clientId) {
      setError(data?.error || "Could not create the client.");
      return;
    }
    setLinkedClient(data.clientId);
    setShownStage("converted");
    setSaved("Saved");
    router.push(`/office/clients/${data.clientId}`);
    router.refresh();
  }

  return (
    <section className="border border-sand-300 bg-white px-5 py-5">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="font-display text-2xl text-navy-900">Next step</h2>
        {shownStage === "converted" ? (
          <span className="rounded-full bg-[#1a7d76]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#1a7d76]">
            Converted
          </span>
        ) : null}
      </div>
      <label className="mt-4 block text-xs uppercase tracking-[0.14em] text-navy-800/50">
        Stage
        <select
          value={nextStage}
          onChange={(event) => setNextStage(event.target.value)}
          className="mt-1 block min-h-11 w-full border border-sand-300 bg-sand-100 px-2 text-sm normal-case tracking-normal text-navy-900"
        >
          {STAGES.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>
      {nextStage === "lost" ? (
        <label className="mt-3 block text-xs uppercase tracking-[0.14em] text-navy-800/50">
          Why it was lost
          <input
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            className="mt-1 block min-h-11 w-full border border-sand-300 bg-sand-100 px-3 text-sm normal-case tracking-normal"
          />
        </label>
      ) : null}
      <button type="button" disabled={busy} onClick={saveStage} className="mt-4 min-h-11 bg-[#1a7d76] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
        {busy ? "Saving" : "Save stage"}
      </button>
      <div className="mt-6 space-y-3">
        {linkedClient ? (
          <a href={`/office/clients/${linkedClient}`} className="block min-h-11 border border-navy-900/15 px-4 py-3 text-center text-sm font-semibold">
            Open the client
          </a>
        ) : (
          <button type="button" disabled={busy} onClick={convert} className="min-h-11 w-full border border-navy-900/15 px-4 py-3 text-sm font-semibold disabled:opacity-60">
            {busy ? "Saving" : "Convert to client"}
          </button>
        )}
        <p className="text-sm text-navy-800/70">Quotes are next. You can keep this lead here until that section is ready.</p>
      </div>
      {error ? <p className="mt-3 text-sm text-red-700">{error}</p> : null}
      {saved ? <p className="mt-3 text-sm font-semibold text-[#1a7d76]">{saved}</p> : null}
    </section>
  );
}
