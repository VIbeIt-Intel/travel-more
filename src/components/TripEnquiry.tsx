"use client";

import { FormEvent, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SITE } from "@/lib/constants";
import { isStaticPublicSite } from "@/lib/publicSite";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
  "Not sure yet",
];

const NIGHTS = ["5 nights", "7 nights", "10 nights", "14 nights", "Not sure yet"];
const TRIPS = ["Holiday", "Honeymoon", "Family", "Business", "Not sure yet"];
const STEPS = 5;

const choiceClass = (active: boolean) =>
  `border px-3 py-3 text-left text-sm transition ${
    active
      ? "border-[#1a7d76] bg-[#1a7d76] text-white"
      : "border-sand-300 bg-sand-100 text-navy-900 hover:border-[#1a7d76]"
  }`;

export function TripEnquiry({ destination }: { destination: string }) {
  const years = useMemo(() => {
    const start = new Date().getFullYear();
    return [String(start), String(start + 1), String(start + 2)];
  }, []);
  const [step, setStep] = useState(0);
  const [month, setMonth] = useState("");
  const [year, setYear] = useState(years[0]);
  const [flexible, setFlexible] = useState(false);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [nights, setNights] = useState("");
  const [trip, setTrip] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  function chooseAndContinue(apply: () => void) {
    apply();
    window.setTimeout(() => setStep((current) => Math.min(current + 1, STEPS - 1)), 180);
  }

  async function send(event: FormEvent) {
    event.preventDefault();
    if (name.trim().length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Add your name and a valid email so we can send the quote.");
      setStatus("error");
      return;
    }
    if (isStaticPublicSite()) {
      setError(
        `For a quote, WhatsApp us on ${SITE.phone} or email ${SITE.emails[0]}. We will reply personally.`,
      );
      setStatus("error");
      return;
    }
    setStatus("sending");
    setError("");
    const response = await fetch("/api/enquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        destination,
        month,
        year,
        flexible,
        adults,
        children,
        nights,
        trip,
        name,
        email,
        phone,
        notes,
      }),
    });
    if (!response.ok) {
      if (response.status === 404) {
        setError(
          `Online requests are not open yet. WhatsApp us on ${SITE.phone} or email ${SITE.emails[0]}.`,
        );
      } else {
        const data = (await response.json().catch(() => null)) as { error?: string } | null;
        setError(data?.error || "We could not send that. Please try again.");
      }
      setStatus("error");
      return;
    }
    setStatus("sent");
  }

  if (status === "sent") {
    return (
      <div className="bg-white px-6 py-10 shadow-[0_18px_40px_rgba(10,22,40,0.08)] md:px-10 md:py-12">
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[#1a7d76]">
          Request received
        </p>
        <h2 className="mt-3 font-display text-4xl font-semibold text-navy-900">We have your {destination} trip</h2>
        <p className="mt-4 text-base leading-relaxed text-navy-800/75">
          Travel More will come back with a route and a quote, usually within one business day.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={send}
      className="bg-white px-6 py-8 shadow-[0_18px_40px_rgba(10,22,40,0.08)] md:px-10 md:py-10"
    >
      <div className="flex items-center justify-between text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-navy-800/55">
        <span>
          {step + 1} of {STEPS}
        </span>
        {step > 0 ? (
          <button type="button" onClick={() => setStep((current) => current - 1)} className="text-[#1a7d76]">
            Back
          </button>
        ) : (
          <span>Plan {destination}</span>
        )}
      </div>
      <div className="mt-3 h-1 bg-sand-200">
        <div className="h-full bg-[#1a7d76] transition-all duration-500" style={{ width: `${((step + 1) / STEPS) * 100}%` }} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.28 }}
          className="mt-8"
        >
          {step === 0 && (
            <>
              <h2 className="font-display text-3xl font-semibold text-navy-900 md:text-4xl">When do you want to go?</h2>
              <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {MONTHS.map((item) => (
                  <button key={item} type="button" onClick={() => setMonth(item)} className={choiceClass(month === item)}>
                    {item}
                  </button>
                ))}
              </div>
              <p className="mt-6 text-sm font-medium text-navy-900">Which year?</p>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {years.map((item) => (
                  <button key={item} type="button" onClick={() => setYear(item)} className={choiceClass(year === item)}>
                    {item}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setFlexible((current) => !current)}
                className={`mt-3 w-full ${choiceClass(flexible)}`}
              >
                {flexible ? "Dates can move" : "Dates are fixed"}
              </button>
              <button
                type="button"
                disabled={!month}
                onClick={() => setStep(1)}
                className="mt-6 w-full bg-navy-900 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-navy-800 disabled:opacity-40"
              >
                Continue
              </button>
            </>
          )}

          {step === 1 && (
            <>
              <h2 className="font-display text-3xl font-semibold text-navy-900 md:text-4xl">Who is going?</h2>
              <Counter label="Adults" value={adults} min={1} max={20} onChange={setAdults} />
              <Counter label="Children" value={children} min={0} max={12} onChange={setChildren} />
              <button
                type="button"
                onClick={() => setStep(2)}
                className="mt-8 w-full bg-navy-900 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-navy-800"
              >
                Continue
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="font-display text-3xl font-semibold text-navy-900 md:text-4xl">How long do you want to stay?</h2>
              <div className="mt-6 grid gap-2">
                {NIGHTS.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => chooseAndContinue(() => setNights(item))}
                    className={choiceClass(nights === item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="font-display text-3xl font-semibold text-navy-900 md:text-4xl">What is the trip for?</h2>
              <div className="mt-6 grid gap-2 sm:grid-cols-2">
                {TRIPS.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => chooseAndContinue(() => setTrip(item))}
                    className={`${choiceClass(trip === item)} py-5 font-display text-xl`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <h2 className="font-display text-3xl font-semibold text-navy-900 md:text-4xl">Where should we send the quote?</h2>
              <div className="mt-6 space-y-4">
                <UnderlineField label="Your name" value={name} onChange={setName} autoComplete="name" />
                <UnderlineField label="Email" type="email" value={email} onChange={setEmail} autoComplete="email" />
                <UnderlineField label="Phone" type="tel" value={phone} onChange={setPhone} autoComplete="tel" />
                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-navy-800/50">
                    Anything we should know
                  </span>
                  <textarea
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                    rows={3}
                    className="mt-2 w-full resize-y border-b border-sand-300 bg-transparent py-2 text-base text-navy-900 outline-none focus:border-[#1a7d76]"
                  />
                </label>
              </div>
              {error ? <p className="mt-4 text-sm text-red-700">{error}</p> : null}
              <button
                type="submit"
                disabled={status === "sending"}
                className="mt-6 w-full bg-[#1a7d76] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#146860] disabled:opacity-70"
              >
                {status === "sending" ? "Sending" : "Send my answers"}
              </button>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </form>
  );
}

function Counter({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="mt-6 flex items-center justify-between border-b border-sand-300 py-4">
      <span className="font-display text-2xl text-navy-900">{label}</span>
      <div className="flex items-center gap-4">
        <button
          type="button"
          aria-label={`Fewer ${label.toLowerCase()}`}
          onClick={() => onChange(Math.max(min, value - 1))}
          className="h-11 w-11 border border-sand-300 text-2xl text-navy-900 transition hover:border-[#1a7d76]"
        >
          −
        </button>
        <span className="w-8 text-center font-display text-3xl text-navy-900">{value}</span>
        <button
          type="button"
          aria-label={`More ${label.toLowerCase()}`}
          onClick={() => onChange(Math.min(max, value + 1))}
          className="h-11 w-11 border border-sand-300 text-2xl text-navy-900 transition hover:border-[#1a7d76]"
        >
          +
        </button>
      </div>
    </div>
  );
}

function UnderlineField({
  label,
  value,
  onChange,
  type = "text",
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-[0.16em] text-navy-800/50">{label}</span>
      <input
        type={type}
        value={value}
        autoComplete={autoComplete}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 w-full border-b border-sand-300 bg-transparent py-2 text-lg text-navy-900 outline-none focus:border-[#1a7d76]"
      />
    </label>
  );
}
