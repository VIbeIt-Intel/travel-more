"use client";

import { FormEvent, useEffect, useState } from "react";
import type { Enquiry } from "@/lib/enquiries";
import { OfficeRates } from "./OfficeRates";
import { OfficeAuthShell, OfficePasswordInput, OfficePrimaryButton } from "./OfficeAuthShell";
import { PasswordRecovery } from "./OfficePassword";
import { OfficeSpecials } from "./OfficeSpecials";

export function OfficeDesk() {
  const [ready, setReady] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [recovering, setRecovering] = useState(false);
  const [notice, setNotice] = useState("");
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);

  async function load() {
    const response = await fetch("/api/enquiries");
    if (response.status === 401) {
      setSignedIn(false);
      setReady(true);
      return;
    }
    const data = (await response.json()) as { enquiries: Enquiry[] };
    setEnquiries(data.enquiries);
    setSignedIn(true);
    setReady(true);
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (new URLSearchParams(window.location.search).get("reset") === "done") {
        setNotice("Your new password is saved. Sign in with it below.");
        window.history.replaceState(null, "", "/office");
      }
      void load();
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  async function signIn(event: FormEvent) {
    event.preventDefault();
    setError("");
    const response = await fetch("/api/office/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as { error?: string } | null;
      setError(data?.error || "Could not sign in.");
      return;
    }
    setPassword("");
    setNotice("");
    await load();
  }

  async function signOut() {
    await fetch("/api/office/login", { method: "DELETE" });
    setSignedIn(false);
    setEnquiries([]);
  }

  async function setStatus(id: string, status: Enquiry["status"]) {
    const response = await fetch(`/api/enquiries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) return;
    setEnquiries((current) => current.map((item) => (item.id === id ? { ...item, status } : item)));
  }

  if (!ready) {
    return (
      <OfficeAuthShell title="One moment" lead="Loading your desk…">
        <div className="h-10 animate-pulse rounded-xl bg-sand-200" />
      </OfficeAuthShell>
    );
  }

  if (!signedIn && recovering) {
    return <PasswordRecovery onBack={() => setRecovering(false)} />;
  }

  if (!signedIn) {
    return (
      <OfficeAuthShell
        title="Welcome back"
        lead="Sign in to open the desk. Only the Travel More team uses this — it never appears on the public site."
      >
        <form onSubmit={signIn}>
          <label className="block text-sm font-medium text-navy-900">
            Password
            <OfficePasswordInput
              value={password}
              onChange={setPassword}
              autoComplete="current-password"
              placeholder="Enter your password"
            />
          </label>
          {notice ? (
            <p className="mt-4 rounded-xl bg-[#1a7d76]/10 px-4 py-3 text-sm text-[#15665f]">{notice}</p>
          ) : null}
          {error ? (
            <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>
          ) : null}
          <div className="mt-6 space-y-4">
            <OfficePrimaryButton>Open the desk</OfficePrimaryButton>
            <button
              type="button"
              onClick={() => {
                setError("");
                setRecovering(true);
              }}
              className="block w-full text-center text-sm font-medium text-navy-800/80 underline underline-offset-4 hover:text-[#1a7d76]"
            >
              Forgot password?
            </button>
          </div>
        </form>
      </OfficeAuthShell>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-12 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[#1a7d76]">
            Travel More
          </p>
          <h1 className="mt-2 font-display text-4xl font-semibold text-navy-900">Trip requests</h1>
        </div>
        <button type="button" onClick={signOut} className="text-sm font-semibold text-navy-800 underline-offset-4 hover:underline">
          Sign out
        </button>
      </div>

      <OfficeSpecials />
      <OfficeRates />

      {enquiries.length === 0 ? (
        <p className="mt-10 border border-sand-300 bg-white px-6 py-10 text-sm text-navy-800/70">
          No trip requests yet. They appear here when someone sends the form on a destination page.
        </p>
      ) : (
        <ul className="mt-8 space-y-4">
          {enquiries.map((item) => (
            <li key={item.id} className="border border-sand-300 bg-white px-6 py-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-display text-2xl font-semibold text-navy-900">{item.destination}</p>
                  <p className="mt-1 text-sm text-navy-800/70">
                    {item.month} {item.year}
                    {item.flexible ? ", dates can move" : ""} · {item.nights} · {item.trip}
                  </p>
                </div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1a7d76]">
                  {item.status === "new" ? "New" : "Contacted"}
                </p>
              </div>
              <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-xs uppercase tracking-[0.14em] text-navy-800/50">Travellers</dt>
                  <dd className="mt-1 text-navy-900">
                    {item.adults} adult{item.adults === 1 ? "" : "s"}
                    {item.children ? `, ${item.children} ${item.children === 1 ? "child" : "children"}` : ""}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-[0.14em] text-navy-800/50">Received</dt>
                  <dd className="mt-1 text-navy-900">
                    {new Date(item.createdAt).toLocaleString("en-ZA", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-[0.14em] text-navy-800/50">Name</dt>
                  <dd className="mt-1 text-navy-900">{item.name}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-[0.14em] text-navy-800/50">Contact</dt>
                  <dd className="mt-1 text-navy-900">
                    <a className="underline-offset-4 hover:underline" href={`mailto:${item.email}`}>
                      {item.email}
                    </a>
                    {item.phone ? ` · ${item.phone}` : ""}
                  </dd>
                </div>
              </dl>
              {item.notes ? <p className="mt-4 text-sm leading-relaxed text-navy-800/80">{item.notes}</p> : null}
              <button
                type="button"
                onClick={() => setStatus(item.id, item.status === "new" ? "contacted" : "new")}
                className="mt-5 border border-navy-900/15 px-4 py-2 text-sm font-semibold text-navy-900"
              >
                {item.status === "new" ? "Mark as contacted" : "Mark as new"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
