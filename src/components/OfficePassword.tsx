"use client";

import { FormEvent, useState } from "react";
import { SITE } from "@/lib/constants";
import { OfficeAuthShell, OfficePasswordInput, OfficePrimaryButton } from "./OfficeAuthShell";

const MIN_LENGTH = 10;

async function errorFrom(response: Response, fallback: string) {
  const data = (await response.json().catch(() => null)) as { error?: string } | null;
  return data?.error || fallback;
}

export function PasswordRecovery({ onBack }: { onBack: () => void }) {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState("");
  const [error, setError] = useState("");

  async function send(event: FormEvent) {
    event.preventDefault();
    setError("");
    setSending(true);
    const response = await fetch("/api/office/forgot", { method: "POST" });
    setSending(false);
    if (!response.ok) {
      setError(await errorFrom(response, "Could not send the email."));
      return;
    }
    setSent("Check your inbox. The link works for 30 minutes. If nothing arrives, look in spam.");
  }

  return (
    <OfficeAuthShell
      title="Recover password"
      lead="We will email a reset link. It only goes to the TravelMORE inboxes below — not to any address someone types in."
    >
      <form onSubmit={send}>
        <ul className="space-y-2 rounded-xl bg-sand-100/80 px-4 py-3 text-sm font-medium text-navy-900">
          {SITE.emails.map((email) => (
            <li key={email}>{email}</li>
          ))}
        </ul>
        {sent ? (
          <p className="mt-4 rounded-xl bg-[#1a7d76]/10 px-4 py-3 text-sm text-[#15665f]">{sent}</p>
        ) : null}
        {error ? (
          <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>
        ) : null}
        <div className="mt-6 space-y-4">
          {!sent ? (
            <OfficePrimaryButton disabled={sending}>
              {sending ? "Sending…" : "Email me a reset link"}
            </OfficePrimaryButton>
          ) : null}
          <button
            type="button"
            onClick={onBack}
            className="block w-full text-center text-sm font-medium text-navy-800/80 underline underline-offset-4 hover:text-[#1a7d76]"
          >
            Back to sign in
          </button>
        </div>
      </form>
    </OfficeAuthShell>
  );
}

export function ResetPassword({ token }: { token: string }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function save(event: FormEvent) {
    event.preventDefault();
    setError("");
    if (password.length < MIN_LENGTH) {
      setError(`Use at least ${MIN_LENGTH} characters.`);
      return;
    }
    if (password !== confirm) {
      setError("The two passwords do not match.");
      return;
    }
    setSaving(true);
    const response = await fetch("/api/office/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    setSaving(false);
    if (!response.ok) {
      setError(await errorFrom(response, "Could not save the password."));
      return;
    }
    window.location.replace("/office?reset=done");
  }

  if (!token) {
    return (
      <OfficeAuthShell
        title="Choose a new password"
        lead="This link is missing its code. Open the link from the email again, or ask for a new one from the sign-in page."
      >
        <a
          href="/office"
          className="inline-block text-sm font-medium text-[#1a7d76] underline underline-offset-4"
        >
          Back to sign in
        </a>
      </OfficeAuthShell>
    );
  }

  return (
    <OfficeAuthShell
      title="Choose a new password"
      lead={`Use at least ${MIN_LENGTH} characters. A short sentence is easy to remember and hard to guess.`}
    >
      <form onSubmit={save}>
        <label className="block text-sm font-medium text-navy-900">
          New password
          <OfficePasswordInput
            value={password}
            onChange={setPassword}
            autoComplete="new-password"
            minLength={MIN_LENGTH}
            required
          />
        </label>
        <label className="mt-4 block text-sm font-medium text-navy-900">
          Type it again
          <OfficePasswordInput
            value={confirm}
            onChange={setConfirm}
            autoComplete="new-password"
            required
          />
        </label>
        {error ? (
          <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>
        ) : null}
        <div className="mt-6 space-y-4">
          <OfficePrimaryButton disabled={saving}>
            {saving ? "Saving…" : "Save new password"}
          </OfficePrimaryButton>
          <a
            href="/office"
            className="block text-center text-sm font-medium text-navy-800/80 underline underline-offset-4 hover:text-[#1a7d76]"
          >
            Back to sign in
          </a>
        </div>
      </form>
    </OfficeAuthShell>
  );
}
