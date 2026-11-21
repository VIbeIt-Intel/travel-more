"use client";

import { FormEvent, useEffect, useState } from "react";
import { OfficeAuthShell, OfficePasswordInput, OfficePrimaryButton, officeInputClass } from "./OfficeAuthShell";
import { PasswordRecovery } from "./OfficePassword";

export function OfficeLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [recovering, setRecovering] = useState(false);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("reset") === "done") {
      setNotice("Your new password is saved. Sign in with it below.");
      window.history.replaceState(null, "", "/office");
    }
  }, []);

  async function signIn(event: FormEvent) {
    event.preventDefault();
    setError("");
    const response = await fetch("/api/office/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as { error?: string } | null;
      setError(data?.error || "Could not sign in.");
      return;
    }
    window.location.assign("/office");
  }

  if (recovering) return <PasswordRecovery onBack={() => setRecovering(false)} />;

  return (
    <OfficeAuthShell
      title="Welcome back"
      lead="Sign in to open the desk. Only the TravelMORE team uses this — it never appears on the public site."
    >
      <form onSubmit={signIn}>
        <label className="block text-sm font-medium text-navy-900">
          Email
          <input
            type="email"
            required
            autoComplete="username"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@travelmorebl.com"
            className={officeInputClass}
          />
        </label>
        <label className="mt-4 block text-sm font-medium text-navy-900">
          Password
          <OfficePasswordInput
            value={password}
            onChange={setPassword}
            autoComplete="current-password"
            placeholder="Enter your password"
          />
        </label>
        {notice ? <p className="mt-4 rounded-xl bg-[#1a7d76]/10 px-4 py-3 text-sm text-[#15665f]">{notice}</p> : null}
        {error ? <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p> : null}
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
