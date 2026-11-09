"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  return (
    <section
      className="relative isolate flex min-h-[100svh] items-center justify-center overflow-hidden bg-[#b7c9d4]"
      aria-label="Introduction"
    >
      <Image
        src="/header-shore.jpg"
        alt=""
        fill
        priority
        quality={90}
        sizes="100vw"
        className="pointer-events-none -z-20 object-cover object-[center_42%] contrast-[1.06] saturate-[1.12]"
      />
      {/* Soft fade only along the bottom, so the photo stays sharp above it */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[28%] bg-gradient-to-b from-transparent via-[#fbf7f2]/75 to-[#fbf7f2]"
        aria-hidden
      />

      <div className="px-5 pb-28 pt-28 text-center md:pb-36">
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease }}
          className="font-display text-[clamp(3.75rem,13vw,9.5rem)] font-semibold leading-[0.92] tracking-tight text-white [text-shadow:0_2px_2px_rgba(12,24,48,0.35),0_10px_28px_rgba(12,24,48,0.45)]"
        >
          Travel<span className="italic text-[#3ecfb8] [text-shadow:0_2px_2px_rgba(8,40,48,0.4),0_10px_24px_rgba(8,50,55,0.4)]">MORE</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4, ease }}
          className="mt-6 text-xs font-semibold uppercase tracking-[0.32em] text-white [text-shadow:0_1px_2px_rgba(12,24,48,0.55),0_6px_16px_rgba(12,24,48,0.45)] md:text-sm"
        >
          Business &amp; Leisure
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7, ease }}
          className="mt-10 md:mt-12"
        >
          <Link
            href="#specials"
            className="inline-block border border-white/90 px-8 py-4 text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-white backdrop-blur-[2px] transition hover:bg-white hover:text-navy-900 md:px-10 md:text-xs"
          >
            Explore the collection
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
