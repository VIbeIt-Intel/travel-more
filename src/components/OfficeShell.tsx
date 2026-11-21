"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const LINKS = [
  { href: "/office", label: "Dashboard" },
  { href: "/office/leads", label: "Leads" },
  { href: "/office/clients", label: "Clients" },
  { href: "/office/website", label: "Website" },
];

function isActive(pathname: string, href: string) {
  if (href === "/office") return pathname === "/office";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavLinks({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-1 px-3">
      {LINKS.map((link) => {
        const active = isActive(pathname, link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            className={`rounded-xl px-3 py-3 text-sm font-semibold ${
              active ? "bg-[#1a7d76] text-white" : "text-sand-100/85 hover:bg-white/10"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function OfficeShell({
  name,
  children,
}: {
  name: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  async function signOut() {
    await fetch("/api/office/login", { method: "DELETE" });
    window.location.assign("/office");
  }

  return (
    <div className="min-h-screen bg-sand-100 text-navy-900 md:flex">
      <aside className="hidden w-64 shrink-0 flex-col bg-navy-950 text-sand-100 md:flex">
        <div className="px-6 py-7">
          <p className="font-display text-3xl font-semibold leading-none">TravelMORE</p>
          <p className="mt-2 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-sand-100/60">
            Business &amp; Leisure
          </p>
        </div>
        <NavLinks pathname={pathname} />
      </aside>

      <div className="min-w-0 flex-1">
        <header className="flex items-center justify-between gap-3 border-b border-sand-300 bg-sand-100 px-4 py-3 md:px-8">
          <button
            type="button"
            className="min-h-11 rounded-xl border border-navy-900/15 px-3 py-2 text-sm font-semibold md:hidden"
            onClick={() => setOpen(true)}
          >
            Menu
          </button>
          <p className="hidden font-display text-xl font-semibold md:block">Desk</p>
          <div className="ml-auto flex items-center gap-4">
            <span className="hidden text-sm text-navy-800/70 sm:inline">{name}</span>
            <button type="button" onClick={signOut} className="min-h-11 text-sm font-semibold underline-offset-4 hover:underline">
              Sign out
            </button>
          </div>
        </header>
        <div className="px-4 py-8 md:px-8">{children}</div>
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <button type="button" className="absolute inset-0 bg-navy-950/50" aria-label="Close menu" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 flex w-72 flex-col bg-navy-950 pt-6 text-sand-100">
            <div className="mb-6 flex items-center justify-between px-5">
              <p className="font-display text-2xl font-semibold">TravelMORE</p>
              <button type="button" className="min-h-11 px-2 text-sm" onClick={() => setOpen(false)}>
                Close
              </button>
            </div>
            <NavLinks pathname={pathname} onNavigate={() => setOpen(false)} />
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function DeskHeading({
  eyebrow,
  title,
  lede,
  action,
}: {
  eyebrow: string;
  title: string;
  lede: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[#1a7d76]">{eyebrow}</p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-navy-900">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-navy-800/70">{lede}</p>
      </div>
      {action}
    </div>
  );
}
