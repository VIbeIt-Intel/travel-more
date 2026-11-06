"use client";

import { FormEvent, useEffect, useState } from "react";
import type { Special } from "@/lib/specials";

type Draft = {
  id?: string;
  destination: string;
  name: string;
  badge: string;
  price: string;
  priceNote: string;
  flights: string;
  included: string;
  image: string;
  alt: string;
  video: string;
};

const emptyDraft = (): Draft => ({
  destination: "",
  name: "",
  badge: "",
  price: "",
  priceNote: "",
  flights: "",
  included: "",
  image: "",
  alt: "",
  video: "",
});

function toDraft(special: Special): Draft {
  return {
    id: special.id,
    destination: special.destination,
    name: special.name,
    badge: special.badge,
    price: special.price,
    priceNote: special.priceNote,
    flights: special.flights,
    included: special.included.join("\n"),
    image: special.image,
    alt: special.alt,
    video: special.video,
  };
}

export function OfficeSpecials() {
  const [specials, setSpecials] = useState<Special[]>([]);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/api/specials")
      .then((response) => response.json())
      .then((data: { specials?: Special[] }) => {
        if (active) setSpecials(data.specials ?? []);
      })
      .catch(() => {
        if (active) setError("Could not load the specials.");
      });
    return () => {
      active = false;
    };
  }, []);

  function setField<K extends keyof Draft>(key: K, value: Draft[K]) {
    setMessage("");
    setDraft((current) => ({ ...current, [key]: value }));
  }

  async function upload(file: File) {
    setUploading(true);
    setError("");
    const body = new FormData();
    body.set("image", file);
    const response = await fetch("/api/specials/upload", { method: "POST", body });
    const data = (await response.json().catch(() => null)) as { image?: string; error?: string } | null;
    setUploading(false);
    if (!response.ok || !data?.image) {
      setError(data?.error || "Could not add that picture.");
      return;
    }
    const image = data.image;
    const fallbackAlt = file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ");
    setDraft((current) => ({ ...current, image, alt: current.alt || fallbackAlt }));
  }

  async function save(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");
    const payload = {
      destination: draft.destination,
      name: draft.name,
      badge: draft.badge,
      price: draft.price,
      priceNote: draft.priceNote,
      flights: draft.flights,
      included: draft.included.split("\n"),
      image: draft.image,
      alt: draft.alt,
      video: draft.video,
    };
    const response = await fetch(draft.id ? `/api/specials/${draft.id}` : "/api/specials", {
      method: draft.id ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft.id ? payload : { special: payload }),
    });
    const data = (await response.json().catch(() => null)) as { special?: Special; error?: string } | null;
    setSaving(false);
    if (!response.ok || !data?.special) {
      setError(data?.error || "Could not save that special.");
      return;
    }
    setSpecials((current) => {
      const index = current.findIndex((item) => item.id === data.special?.id);
      if (index < 0) return [...current, data.special as Special];
      return current.map((item) => (item.id === data.special?.id ? (data.special as Special) : item));
    });
    setDraft(emptyDraft());
    setMessage(draft.id ? "Special updated." : "Special added. It is on the website now.");
  }

  async function remove(id: string) {
    setError("");
    const response = await fetch(`/api/specials/${id}`, { method: "DELETE" });
    if (!response.ok) {
      setError("Could not remove that special.");
      return;
    }
    setSpecials((current) => current.filter((item) => item.id !== id));
    if (draft.id === id) setDraft(emptyDraft());
  }

  async function move(id: string, direction: -1 | 1) {
    const index = specials.findIndex((item) => item.id === id);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= specials.length) return;
    const next = [...specials];
    const [item] = next.splice(index, 1);
    next.splice(target, 0, item);
    setSpecials(next);
    await fetch("/api/specials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: next.map((special) => special.id) }),
    });
  }

  return (
    <section className="mt-10 border border-sand-300 bg-white px-6 py-6">
      <h2 className="font-display text-3xl font-semibold text-navy-900">Specials</h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-navy-800/70">
        These cards are the Specials section on the website. Add the destination, the price, the
        flights, and what is included. One included item per line.
      </p>

      {specials.length === 0 ? (
        <p className="mt-6 text-sm text-navy-800/70">No specials yet. The website shows an empty offer until you add one.</p>
      ) : (
        <ul className="mt-6 space-y-3">
          {specials.map((special, index) => (
            <li key={special.id} className="flex flex-wrap items-center justify-between gap-3 border border-sand-300/80 px-4 py-3">
              <div>
                <p className="font-display text-xl text-navy-900">{special.name}</p>
                <p className="text-sm text-navy-800/70">
                  {special.destination} · {special.price}
                  {special.flights ? ` · ${special.flights}` : ""}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => move(special.id, -1)} disabled={index === 0} className="border border-navy-900/15 px-3 py-2 text-sm disabled:opacity-40">
                  Up
                </button>
                <button
                  type="button"
                  onClick={() => move(special.id, 1)}
                  disabled={index === specials.length - 1}
                  className="border border-navy-900/15 px-3 py-2 text-sm disabled:opacity-40"
                >
                  Down
                </button>
                <button type="button" onClick={() => setDraft(toDraft(special))} className="border border-navy-900/15 px-3 py-2 text-sm font-semibold">
                  Edit
                </button>
                <button type="button" onClick={() => remove(special.id)} className="px-3 py-2 text-sm font-semibold text-red-700">
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={save} className="mt-8 grid gap-4 border border-sand-300/80 px-4 py-5 sm:grid-cols-2">
        <h3 className="font-display text-2xl text-navy-900 sm:col-span-2">
          {draft.id ? "Edit this special" : "Add a special"}
        </h3>
        <label className="block text-sm text-navy-900">
          Destination
          <input value={draft.destination} onChange={(event) => setField("destination", event.target.value)} required className="mt-1.5 w-full border border-sand-300 bg-sand-100 px-3 py-2.5 outline-none focus:border-[#1a7d76]" />
        </label>
        <label className="block text-sm text-navy-900">
          Name
          <input value={draft.name} onChange={(event) => setField("name", event.target.value)} required className="mt-1.5 w-full border border-sand-300 bg-sand-100 px-3 py-2.5 outline-none focus:border-[#1a7d76]" />
        </label>
        <label className="block text-sm text-navy-900">
          Price
          <input value={draft.price} onChange={(event) => setField("price", event.target.value)} required placeholder="From R 32,500" className="mt-1.5 w-full border border-sand-300 bg-sand-100 px-3 py-2.5 outline-none focus:border-[#1a7d76]" />
        </label>
        <label className="block text-sm text-navy-900">
          Price detail
          <input value={draft.priceNote} onChange={(event) => setField("priceNote", event.target.value)} placeholder="per person, 7 nights" className="mt-1.5 w-full border border-sand-300 bg-sand-100 px-3 py-2.5 outline-none focus:border-[#1a7d76]" />
        </label>
        <label className="block text-sm text-navy-900 sm:col-span-2">
          Flights
          <input value={draft.flights} onChange={(event) => setField("flights", event.target.value)} placeholder="Return flights from Johannesburg included" className="mt-1.5 w-full border border-sand-300 bg-sand-100 px-3 py-2.5 outline-none focus:border-[#1a7d76]" />
        </label>
        <label className="block text-sm text-navy-900">
          Small label
          <input value={draft.badge} onChange={(event) => setField("badge", event.target.value)} placeholder="Most popular" className="mt-1.5 w-full border border-sand-300 bg-sand-100 px-3 py-2.5 outline-none focus:border-[#1a7d76]" />
        </label>
        <label className="block text-sm text-navy-900">
          Picture
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void upload(file);
            }}
            className="mt-1.5 block w-full text-sm"
          />
          <span className="mt-1 block text-xs text-navy-800/60">
            {uploading ? "Adding the picture." : draft.image ? "Picture ready." : "Optional. JPG, PNG, or WebP."}
          </span>
        </label>
        <label className="block text-sm text-navy-900 sm:col-span-2">
          Included, one item per line
          <textarea value={draft.included} onChange={(event) => setField("included", event.target.value)} rows={4} placeholder={"4 or 5 star beach resort\nAirport and resort transfers\nBreakfast"} className="mt-1.5 w-full border border-sand-300 bg-sand-100 px-3 py-2.5 outline-none focus:border-[#1a7d76]" />
        </label>
        {error ? <p className="text-sm text-red-700 sm:col-span-2">{error}</p> : null}
        {message ? <p className="text-sm text-[#1a7d76] sm:col-span-2">{message}</p> : null}
        <div className="flex flex-wrap gap-3 sm:col-span-2">
          <button type="submit" disabled={saving || uploading} className="bg-[#1a7d76] px-6 py-3 text-sm font-semibold text-white disabled:opacity-60">
            {saving ? "Saving" : draft.id ? "Update special" : "Add special"}
          </button>
          {draft.id ? (
            <button type="button" onClick={() => setDraft(emptyDraft())} className="px-4 py-3 text-sm font-semibold text-navy-900">
              Cancel edit
            </button>
          ) : null}
        </div>
      </form>
    </section>
  );
}
