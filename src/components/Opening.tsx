"use client";

import { useEffect, useLayoutEffect, useState } from "react";

const SEEN = "tm-opened";
const HOLD_MS = 2200;
const FADE_MS = 700;

type Phase = "play" | "leave" | "done";

export function Opening() {
  const [phase, setPhase] = useState<Phase>("play");

  useLayoutEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN) === "1";
    } catch {
      seen = false;
    }
    if (reduce || seen) setPhase("done");
  }, []);

  useEffect(() => {
    if (phase === "done") return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== "play") return;
    const hold = window.setTimeout(() => setPhase("leave"), HOLD_MS);
    return () => window.clearTimeout(hold);
  }, [phase]);

  useEffect(() => {
    if (phase !== "leave") return;
    try {
      sessionStorage.setItem(SEEN, "1");
    } catch {
      /* Private browsing can block storage. The opening still closes. */
    }
    const fade = window.setTimeout(() => setPhase("done"), FADE_MS);
    return () => window.clearTimeout(fade);
  }, [phase]);

  if (phase === "done") return null;

  return (
    <div
      className={`fixed inset-0 z-[80] flex items-center justify-center bg-[#f7f3ed] transition-opacity duration-700 ${
        phase === "leave" ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      role="presentation"
    >
      <video
        className="h-48 w-48 rounded-full object-cover shadow-[0_18px_50px_rgba(15,33,55,0.18)] sm:h-64 sm:w-64"
        src="/logo-loop.mp4"
        poster="/logo.webp"
        autoPlay
        muted
        playsInline
        preload="auto"
        aria-label="TravelMORE"
      />
    </div>
  );
}
