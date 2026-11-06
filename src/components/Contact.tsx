"use client";

import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import { SITE } from "@/lib/constants";
import { SocialLinks } from "./SocialLinks";

type FormStatus = "idle" | "submitting" | "success";

const TRIPS = [
  { value: "business", label: "Business" },
  { value: "leisure", label: "Leisure" },
  { value: "bleisure", label: "Bleisure" },
  { value: "mauritius", label: "Mauritius" },
] as const;

export function Contact() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [trip, setTrip] = useState("");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    window.setTimeout(() => setStatus("success"), 800);
  }

  return (
    <section id="contact" className="scroll-mt-28 bg-[#f7f2ea] py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <div className="rounded-[28px] bg-[linear-gradient(145deg,rgba(126,224,210,0.95),rgba(26,154,171,0.28)_46%,rgba(26,154,171,0.7))] p-px shadow-[0_24px_50px_-32px_rgba(26,154,171,0.65)]">
          <div className="grid overflow-hidden rounded-[27px] bg-[#fffcf8] lg:grid-cols-[0.9fr_1.1fr]">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col px-7 py-10 md:px-10 md:py-12 lg:border-r lg:border-[#1a9aab]/20"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#1a9aab] md:text-base">
                Contact
              </p>
              <h2 className="font-display mt-4 text-4xl font-semibold leading-[1.08] text-navy-900 md:text-5xl">
                Write to the desk
              </h2>
              <p className="mt-5 max-w-sm text-base leading-relaxed text-navy-800/75">
                Share the trip you have in mind. We answer ourselves, usually within one business day.
              </p>

              <a
                href={`tel:${SITE.phoneTel}`}
                className="font-display mt-10 text-4xl font-semibold tracking-tight text-navy-900 transition hover:text-[#146870] md:text-5xl"
              >
                {SITE.phone}
              </a>
              <p className="mt-2 text-sm text-navy-800/60">Phone and WhatsApp</p>

              <div className="mt-8 flex flex-col items-start gap-3">
                <a
                  href={SITE.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 rounded-full bg-[#25D366] px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-[#25D366]/25 transition hover:brightness-105 hover:shadow-lg"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Chat on WhatsApp
                </a>
                {SITE.emails.map((email) => (
                  <a
                    key={email}
                    href={`mailto:${email}`}
                    className="inline-flex items-center gap-3 rounded-full border border-[#1a9aab]/45 bg-white px-6 py-3 text-sm font-medium text-navy-900 transition hover:border-[#1a9aab] hover:bg-[#1a9aab] hover:text-white"
                  >
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                    >
                      <rect x="3" y="5" width="18" height="14" rx="2" />
                      <path d="m3.5 6.5 8.5 6.5 8.5-6.5" />
                    </svg>
                    {email}
                  </a>
                ))}
              </div>

              <p className="mt-8 text-sm text-navy-800/70">{SITE.location}</p>
              <div className="mt-4">
                <SocialLinks tone="ink" />
              </div>
            </motion.div>

            <motion.form
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08 }}
              onSubmit={handleSubmit}
              className="bg-[#fbf7f2] px-7 py-10 md:px-10 md:py-12"
              aria-label="Contact form"
            >
              <p className="font-display text-2xl text-navy-900">Your note</p>
              <div className="mt-8 grid gap-7 sm:grid-cols-2">
                <Field label="First name" name="firstName" required autoComplete="given-name" />
                <Field label="Last name" name="lastName" required autoComplete="family-name" />
                <Field
                  label="Email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="sm:col-span-2"
                />
                <Field
                  label="Phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  className="sm:col-span-2"
                />
              </div>

              <fieldset className="mt-8">
                <legend className="text-xs font-semibold uppercase tracking-[0.16em] text-[#146870]">
                  Trip
                </legend>
                <div className="mt-3 flex flex-wrap gap-2">
                  {TRIPS.map((item) => (
                    <label key={item.value} className="cursor-pointer">
                      <input
                        type="radio"
                        name="tripType"
                        value={item.value}
                        required
                        checked={trip === item.value}
                        onChange={() => setTrip(item.value)}
                        className="peer sr-only"
                      />
                      <span className="inline-block border border-[#1a9aab]/30 px-4 py-2 text-sm text-navy-900 transition peer-checked:border-[#1a9aab] peer-checked:bg-[#1a9aab] peer-checked:text-white hover:border-[#1a9aab]">
                        {item.label}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <div className="mt-8">
                <label
                  htmlFor="message"
                  className="text-xs font-semibold uppercase tracking-[0.16em] text-[#146870]"
                >
                  The trip
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  placeholder="Dates, travellers, where you are thinking of going"
                  className="mt-2 w-full resize-y border-0 border-b border-[#1a9aab]/35 bg-transparent py-2 font-display text-2xl text-navy-900 outline-none placeholder:font-sans placeholder:text-base placeholder:text-navy-800/35 focus:border-[#1a9aab]"
                />
              </div>

              <button
                type="submit"
                disabled={status === "submitting" || status === "success"}
                className="mt-8 border border-[#1a9aab] px-8 py-3.5 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-[#146870] transition hover:bg-[#1a9aab] hover:text-white disabled:opacity-70"
              >
                {status === "submitting"
                  ? "Sending"
                  : status === "success"
                    ? "Note received"
                    : "Send the note"}
              </button>
              {status === "success" && (
                <p className="mt-4 text-sm leading-relaxed text-navy-800/70" role="status">
                  We have your note on this page. Email from the form is not connected yet, so call or
                  WhatsApp if it is urgent.
                </p>
              )}
            </motion.form>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  autoComplete,
  className = "",
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <label
        htmlFor={name}
        className="text-xs font-semibold uppercase tracking-[0.16em] text-[#146870]"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        className="mt-2 w-full border-0 border-b border-[#1a9aab]/35 bg-transparent py-2 font-display text-2xl text-navy-900 outline-none focus:border-[#1a9aab]"
      />
    </div>
  );
}
