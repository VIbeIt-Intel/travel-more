"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const inputClass =
  "mt-2 w-full rounded-xl border border-sand-300/90 bg-white px-4 py-3 text-sm text-navy-900 shadow-sm outline-none transition focus:border-[#1a7d76] focus:ring-2 focus:ring-[#1a7d76]/25";

export const officeInputClass = inputClass;

function EyeIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-5 w-5" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1 1 0 0 1 0-.644C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      </svg>
    );
  }
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-5 w-5" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
    </svg>
  );
}

export function OfficePasswordInput({
  value,
  onChange,
  placeholder,
  autoComplete,
  minLength,
  required,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoComplete?: string;
  minLength?: number;
  required?: boolean;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative mt-2">
      <input
        type={visible ? "text" : "password"}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        minLength={minLength}
        required={required}
        className={`${inputClass} pr-12`}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute right-1 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-navy-800/55 hover:bg-sand-100 hover:text-navy-900"
        aria-label={visible ? "Hide password" : "Show password"}
      >
        <EyeIcon open={visible} />
      </button>
    </div>
  );
}

export function OfficePrimaryButton({
  children,
  disabled,
  type = "submit",
}: {
  children: React.ReactNode;
  disabled?: boolean;
  type?: "submit" | "button";
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className="w-full rounded-full bg-gradient-to-r from-[#1a7d76] to-[#1a9aab] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#1a7d76]/25 transition hover:brightness-105 disabled:opacity-60 sm:w-auto"
    >
      {children}
    </button>
  );
}

export function OfficeAuthShell({
  title,
  lead,
  children,
  footer,
}: {
  title: string;
  lead: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-sand-100">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(26,157,171,0.12),transparent_55%),radial-gradient(ellipse_at_bottom_left,_rgba(212,175,55,0.08),transparent_50%)]" />
      <div className="relative mx-auto grid min-h-screen max-w-6xl lg:grid-cols-[1.05fr_0.95fr]">
        <aside className="relative hidden overflow-hidden lg:block">
          <Image
            src="/images/leisure-pool.jpg"
            alt=""
            fill
            priority
            quality={90}
            sizes="50vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-navy-950/75 via-navy-900/55 to-[#1a7d76]/40" />
          <div className="relative flex h-full flex-col justify-between p-10 text-white">
            <div>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.32em] text-sand-100/90">
                TravelMORE
              </p>
              <p className="mt-2 font-display text-3xl font-semibold leading-tight">
                Business &amp; Leisure
              </p>
            </div>
            <div>
              <p className="font-display text-4xl font-semibold leading-snug">
                Your desk for trips, specials, and quotes.
              </p>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-sand-100/85">
                Review traveller requests, refresh the specials on the website, and keep planner
                estimates up to date — all in one place.
              </p>
              <ul className="mt-8 space-y-3 text-sm text-sand-100/90">
                <li className="flex gap-2">
                  <span className="text-gold-400" aria-hidden>
                    ✦
                  </span>
                  Trip requests from destination pages
                </li>
                <li className="flex gap-2">
                  <span className="text-gold-400" aria-hidden>
                    ✦
                  </span>
                  Specials cards visitors see on the homepage
                </li>
                <li className="flex gap-2">
                  <span className="text-gold-400" aria-hidden>
                    ✦
                  </span>
                  Live quote figures for the trip planner
                </li>
              </ul>
            </div>
            <Link
              href="/"
              className="text-sm font-medium text-sand-100/80 underline-offset-4 hover:text-white hover:underline"
            >
              Back to the public website
            </Link>
          </div>
        </aside>

        <div className="flex flex-col justify-center px-5 py-12 sm:px-8 lg:px-10 lg:py-16">
          <div className="mx-auto w-full max-w-md">
            <div className="overflow-hidden rounded-3xl border border-white/60 bg-white/90 p-8 shadow-2xl shadow-navy-950/10 backdrop-blur-sm sm:p-10">
              <div className="flex items-center gap-4">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-sand-100 ring-2 ring-[#1a7d76]/20">
                  <video
                    className="h-full w-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                    aria-hidden
                  >
                    <source src="/logo-loop.mp4" type="video/mp4" />
                  </video>
                </div>
                <div>
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-[#1a7d76]">
                    Agent desk
                  </p>
                  <h1 className="font-display text-2xl font-semibold text-navy-900 sm:text-3xl">
                    {title}
                  </h1>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-navy-800/75">{lead}</p>
              <div className="mt-8">{children}</div>
              {footer ? <div className="mt-6 border-t border-sand-200/80 pt-6">{footer}</div> : null}
            </div>
            <p className="mt-6 text-center text-xs text-navy-800/50 lg:hidden">
              <Link href="/" className="underline underline-offset-2 hover:text-[#1a7d76]">
                View the public website
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
