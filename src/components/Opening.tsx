"use client";

import { useEffect, useLayoutEffect, useState } from "react";

const SEEN = "tm-opened";
const HOLD_MS = 4000;
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
        className="h-[100vmin] w-[100vmin] max-h-[100svh] max-w-[100vw] rounded-full object-cover"
        src="/logo-open.mp4"
        poster="/logo-open.jpg"
        autoPlay
        muted
        playsInline
        preload="auto"
        aria-label="TravelMORE"
      />
    </div>
  );
}
