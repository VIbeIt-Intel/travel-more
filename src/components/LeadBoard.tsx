"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { formatWhen } from "@/lib/format";

export type LeadCard = {
  id: string;
  name: string;
  destination: string;
  email: string;
  stage: string;
  createdAt: string;
  month: string;
  year: string;
};

const STAGES = [
  { id: "new", label: "New" },
  { id: "contacted", label: "Contacted" },
  { id: "quoted", label: "Quoted" },
  { id: "booked", label: "Booked" },
  { id: "lost", label: "Lost" },
  { id: "converted", label: "Converted" },
];

export function LeadBoard({ leads }: { leads: LeadCard[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [view, setView] = useState<"board" | "list">("board");
  const [dragging, setDragging] = useState("");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState("");
  const [rows, setRows] = useState(leads);

  useEffect(() => {
    setRows(leads);
  }, [leads]);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return rows;
    return rows.filter((lead) =>
      `${lead.name} ${lead.destination} ${lead.email}`.toLowerCase().includes(needle),
    );
  }, [rows, query]);

  async function move(id: string, stage: string) {
    setError("");
    setSaved("");
    const previous = rows;
    setRows((current) => current.map((lead) => (lead.id === id ? { ...lead, stage } : lead)));
    const response = await fetch(`/api/office/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stage }),
    });
    if (!response.ok) {
      setRows(previous);
      setError("Could not move that lead.");
      return;
    }
    setSaved("Saved");
    router.refresh();
  }

  return (
    <div>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search name, destination or email"
          className="min-h-11 w-full border border-sand-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#1a7d76] sm:w-auto sm:min-w-0 sm:flex-1"
        />
        <div className="flex gap-2">
          <button type="button" onClick={() => setView("board")} className={`min-h-11 border px-4 text-sm font-semibold ${view === "board" ? "border-[#1a7d76] bg-[#1a7d76] text-white" : "border-navy-900/15 bg-white"}`}>
            Board
          </button>
          <button type="button" onClick={() => setView("list")} className={`min-h-11 border px-4 text-sm font-semibold ${view === "list" ? "border-[#1a7d76] bg-[#1a7d76] text-white" : "border-navy-900/15 bg-white"}`}>
            List
          </button>
        </div>
      </div>
      {error ? <p className="mt-3 text-sm text-red-700">{error}</p> : null}
      {saved ? <p className="mt-3 text-sm font-semibold text-[#1a7d76]">{saved}</p> : null}

      {view === "list" ? (
        <div className="mt-4 space-y-3">
          {visible.length === 0 ? <Empty /> : visible.map((lead) => <LeadRow key={lead.id} lead={lead} onMove={move} />)}
        </div>
      ) : (
        <div className="mt-4 flex gap-3 overflow-x-auto pb-2 lg:grid lg:grid-cols-3 lg:overflow-visible xl:grid-cols-6">
          {STAGES.map((stage) => (
            <section
              key={stage.id}
              onDragOver={(event) => event.preventDefault()}
              onDrop={() => dragging && void move(dragging, stage.id)}
              className="w-60 shrink-0 border border-sand-300 bg-white/70 p-3 lg:w-auto"
            >
              <h2 className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-navy-800/55">
                {stage.label}
              </h2>
              <div className="mt-3 space-y-2">
                {visible
                  .filter((lead) => lead.stage === stage.id)
                  .map((lead) => (
                    <article
                      key={lead.id}
                      draggable
                      onDragStart={() => setDragging(lead.id)}
                      className="cursor-grab border border-sand-300 bg-white px-3 py-3"
                    >
                      <Link href={`/office/leads/${lead.id}`} className="font-semibold text-navy-900 hover:underline">
                        {lead.name}
                      </Link>
                      {lead.stage === "converted" ? <StageBadge /> : null}
                      <p className="text-sm text-navy-800/70">
                        {lead.destination} · {lead.month} {lead.year}
                      </p>
                    </article>
                  ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

function LeadRow({ lead, onMove }: { lead: LeadCard; onMove: (id: string, stage: string) => void }) {
  return (
    <article className="border border-sand-300 bg-white px-4 py-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link href={`/office/leads/${lead.id}`} className="font-display text-2xl text-navy-900 hover:underline">
            {lead.name}
          </Link>
          <p className="text-sm text-navy-800/70">
            {lead.destination} · {lead.email} · {formatWhen(lead.createdAt)}
          </p>
        </div>
        <label className="w-full text-xs uppercase tracking-[0.14em] text-navy-800/50 sm:w-44">
          Stage
          <select
            value={lead.stage}
            onChange={(event) => onMove(lead.id, event.target.value)}
            className="mt-1 block min-h-11 w-full border border-sand-300 bg-sand-100 px-2 text-sm normal-case tracking-normal text-navy-900"
          >
            {STAGES.map((stage) => (
              <option key={stage.id} value={stage.id}>
                {stage.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </article>
  );
}

function StageBadge() {
  return (
    <span className="mt-2 inline-flex rounded-full bg-[#1a7d76]/10 px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[#1a7d76]">
      Converted
    </span>
  );
}

function Empty() {
  return <p className="border border-sand-300 bg-white px-5 py-8 text-sm text-navy-800/70">No leads match that search.</p>;
}
