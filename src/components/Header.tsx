"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NAV, SITE, type NavItem } from "@/lib/constants";

const linkClass = (overHero: boolean) =>
  `relative text-[13px] font-semibold tracking-[0.01em] leading-tight transition-colors duration-300 after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:transition-all after:duration-300 hover:after:w-full xl:text-sm ${
    overHero
      ? "text-navy-950/90 hover:text-navy-950 after:bg-[#1a7d76] [text-shadow:0_0_10px_rgba(255,255,255,0.85),0_1px_1px_rgba(255,255,255,0.9)]"
      : "text-white/95 hover:text-white after:bg-white"
  }`;

export function Header({ solid = false }: { solid?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const overHero = !solid && !scrolled && !menuOpen;
  const closeMenu = () => {
    setMenuOpen(false);
    setOpenGroup(null);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        overHero
          ? "bg-gradient-to-b from-white/70 via-white/35 to-transparent backdrop-blur-[2px]"
          : "border-b border-white/15 bg-[#1a9aab]/95 shadow-[0_8px_28px_rgba(12,70,80,0.22)] backdrop-blur-md"
      }`}
    >
      <div className="relative z-10 mx-auto flex max-w-[90rem] items-center justify-between gap-4 px-4 py-3 lg:px-6">
        <Link
          href="/"
          className="group flex shrink-0 flex-col leading-tight"
          onClick={closeMenu}
          aria-label={`${SITE.name} home`}
        >
          <span
            className={`font-display text-xl font-semibold transition-colors ${
              overHero ? "text-navy-950" : "text-white"
            }`}
          >
            {SITE.name}
          </span>
          <span
            className={`hidden text-[0.65rem] font-semibold uppercase tracking-[0.18em] transition-colors sm:block ${
              overHero ? "text-navy-900/80" : "text-white/80"
            }`}
          >
            {SITE.subtitle}
          </span>
        </Link>

        <nav className="hidden items-center gap-3 lg:flex xl:gap-5" aria-label="Main">
          {NAV.map((item) =>
            item.children ? (
              <DesktopMenu key={item.href} item={item} overHero={overHero} />
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={`${linkClass(overHero)} whitespace-nowrap`}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <button
          type="button"
          className="relative z-50 flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-navy-900/25 bg-white/70 text-navy-900 shadow-sm lg:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="sr-only">{menuOpen ? "Close" : "Menu"}</span>
          <div className="flex w-5 flex-col gap-1.5">
            <span className={`h-0.5 bg-current transition ${menuOpen ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`h-0.5 bg-current transition ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`h-0.5 bg-current transition ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`} />
          </div>
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="relative z-10 max-h-[calc(100svh-4.5rem)] overflow-y-auto border-t border-white/40 lg:hidden"
          >
            <div className="absolute inset-0 bg-[#f7f2ea]/98" aria-hidden />
            <nav className="relative flex flex-col gap-1 px-5 py-6" aria-label="Mobile">
              {NAV.map((item) =>
                item.children ? (
                  <div key={item.href}>
                    <button
                      type="button"
                      className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-left text-base font-medium text-[#3d342c] hover:bg-[#efe6da]"
                      aria-expanded={openGroup === item.label}
                      onClick={() => setOpenGroup((current) => (current === item.label ? null : item.label))}
                    >
                      {item.label}
                      <span aria-hidden className="text-[#2a9d94]">
                        {openGroup === item.label ? "–" : "+"}
                      </span>
                    </button>
                    {openGroup === item.label && (
                      <div className="mb-2 ml-3 flex flex-col border-l border-[#2a9d94]/40 pl-3">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="rounded-lg px-3 py-2.5 font-display text-lg text-[#3d342c] transition hover:bg-[#efe6da] hover:text-[#1a6d68]"
                            onClick={closeMenu}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-lg px-3 py-3 text-base font-medium text-[#3d342c] hover:bg-[#efe6da]"
                    onClick={closeMenu}
                  >
                    {item.label}
                  </Link>
                ),
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function DesktopMenu({ item, overHero }: { item: NavItem; overHero: boolean }) {
  return (
    <div className="group relative">
      <Link
        href={item.href}
        className={`inline-flex items-center gap-1 ${linkClass(overHero)}`}
        aria-haspopup="true"
      >
        {item.label}
        <Chevron />
      </Link>
      <div className="invisible absolute left-1/2 top-full z-50 -translate-x-1/2 pt-4 opacity-0 transition duration-300 ease-out group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
        <div className="min-w-72 overflow-hidden rounded-2xl border border-[#eadfce] bg-[#fbf7f2]/95 p-2 shadow-[0_22px_50px_rgba(60,40,20,0.14)] backdrop-blur-md">
          <div className="mx-3 mb-1 h-px bg-gradient-to-r from-transparent via-[#2a9d94]/70 to-transparent" />
          {item.children?.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              className="block rounded-xl border-l-2 border-transparent px-4 py-2.5 font-display text-lg tracking-wide text-[#3d342c] transition-all duration-300 hover:border-[#2a9d94] hover:bg-[#f3ebe1] hover:pl-5 hover:text-[#1a6d68]"
            >
              {child.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function Chevron() {
  return (
    <svg className="h-3 w-3 opacity-70 transition duration-300 group-hover:translate-y-0.5" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path d="M2.5 4.5 6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
