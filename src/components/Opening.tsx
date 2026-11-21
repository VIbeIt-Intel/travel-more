"use client";

import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useState } from "react";

const SEEN = "tm-opened";
const MAX_MS = 3000;

export function Opening() {
  const pathname = usePathname() || "";
  const office = pathname === "/office" || pathname.startsWith("/office/");
  const [play, setPlay] = useState(false);

  useLayoutEffect(() => {
    if (office) {
      setPlay(false);
      return;
    }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN) === "1";
    } catch {
      seen = false;
    }
    setPlay(!reduce && !seen);
  }, [office]);

  useEffect(() => {
    if (!play) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const timer = window.setTimeout(dismiss, MAX_MS);
    return () => {
      document.body.style.overflow = previous;
      window.clearTimeout(timer);
    };
  }, [play]);

  function dismiss() {
    try {
      sessionStorage.setItem(SEEN, "1");
    } catch {
      /* Private browsing can block storage. The opening still closes. */
    }
    setPlay(false);
  }

  if (office || !play) return null;

  return (
    <button
      type="button"
      onClick={dismiss}
      className="fixed inset-0 z-[80] flex items-center justify-center bg-[#f7f3ed]"
      aria-label="Skip introduction"
    >
      <video
        className="h-[100vmin] w-[100vmin] max-h-[100svh] max-w-[100vw] rounded-full object-cover"
        src="/logo-open.mp4"
        poster="/logo-open.jpg"
        autoPlay
        muted
        playsInline
        preload="auto"
        aria-hidden
      />
      <span className="absolute bottom-6 rounded-full border border-navy-900/15 bg-white/90 px-4 py-2 text-sm font-semibold text-navy-900">
        Skip
      </span>
    </button>
  );
}
