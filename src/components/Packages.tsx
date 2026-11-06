"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import type { Special } from "@/lib/specials";
import specialsFile from "../../data/specials.json";
import { SectionHeading } from "./SectionHeading";

const specials = specialsFile as Special[];

export function Packages() {

  return (
    <section id="specials" className="scroll-mt-28 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          eyebrow="Specials"
          title="Curated starting points, fully customisable"
          description="Offers Travel More is holding right now. The price, the flights and what is included are on the card."
        />

        {specials.length === 0 ? (
          <div className="mx-auto max-w-2xl border border-sand-300 bg-sand-100 px-8 py-12 text-center">
            <p className="font-display text-3xl text-navy-900">Nothing is posted right now.</p>
            <p className="mt-3 text-sm leading-relaxed text-navy-800/70">
              Ask us what is on offer this month and we will build it around your dates.
            </p>
            <Link
              href="/#contact"
              className="mt-6 inline-flex bg-navy-900 px-6 py-3 text-sm font-semibold text-sand-100"
            >
              Ask about a special
            </Link>
          </div>
        ) : (
          <div
            className={`grid gap-x-6 gap-y-8 md:grid-rows-[auto_auto_auto_auto_auto_1fr_auto] md:gap-y-0 ${
              specials.length === 1
                ? "mx-auto max-w-md"
                : specials.length === 2
                  ? "mx-auto max-w-4xl md:grid-cols-2"
                  : "md:grid-cols-2 lg:grid-cols-3"
            }`}
          >
            {specials.map((special, index) => (
              <motion.article
                key={special.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                className="grid grid-rows-[auto_auto_auto_auto_auto_auto_auto] overflow-hidden rounded-2xl border border-sand-300/80 bg-white shadow-[0_18px_40px_-28px_rgba(15,33,55,0.45)] md:row-span-7 md:grid-rows-subgrid"
              >
                <SpecialMedia special={special} />
                <p className="px-6 pt-5 text-sm font-semibold uppercase tracking-[0.18em] text-teal-600">
                  {special.destination}
                </p>
                <h3 className="px-6 pt-2 font-display text-3xl font-semibold leading-tight text-navy-900">
                  {special.name}
                </h3>
                <div className="px-6 pt-4">
                  <p className="font-display text-3xl font-semibold leading-none text-gold-600">
                    TBD
                  </p>
                  <p className="mt-2 min-h-[2.5rem] text-sm leading-snug text-navy-800/70">
                    {special.priceNote}
                  </p>
                </div>
                <div className="px-6 pt-1">
                  {special.flights ? (
                    <>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-600">Flights</p>
                      <p className="mt-1 text-sm leading-snug text-navy-800">{special.flights}</p>
                    </>
                  ) : null}
                </div>
                <ul className="grid content-start gap-2 px-6 pt-4">
                  {special.included.map((item) => (
                    <li
                      key={item}
                      className="flex min-h-[2rem] items-center rounded-full border border-sand-300 bg-sand-100 px-3 py-1.5 text-xs text-navy-800"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="px-6 pb-6 pt-6">
                  <Link
                    href="/#contact"
                    className="block rounded-full bg-[#1a7d76] py-3.5 text-center text-sm font-semibold text-white transition hover:bg-[#166963]"
                  >
                    Get my personalised quote
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        )}

        <p className="mx-auto mt-10 max-w-2xl text-center text-sm text-navy-800/65">
          <strong className="font-semibold text-navy-900">Price match promise:</strong> Share a
          comparable quote and we&apos;ll match it when booking through Travel More.
        </p>
      </div>
    </section>
  );
}

function SpecialMedia({ special }: { special: Special }) {
  const [play, setPlay] = useState(true);
  const ref = useRef<HTMLDivElement>(null);
  const near = useInView(ref, { once: true, margin: "300px 0px" });

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setPlay(!media.matches);
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);

  return (
    <div ref={ref} className="relative aspect-[16/10] overflow-hidden bg-sand-200">
      {special.image ? (
        <Image
          src={special.image}
          alt={special.alt}
          fill
          quality={90}
          sizes="(max-width: 768px) 100vw, 33vw"
          className={`object-cover ${special.video && play ? "" : "special-drift"}`}
        />
      ) : null}
      {special.video && play && near ? (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          aria-hidden
        >
          <source src={special.video} type="video/mp4" />
        </video>
      ) : null}
      {special.badge ? (
        <span className="absolute left-4 top-4 inline-flex rounded-full bg-white/95 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-wider text-teal-700 shadow-sm">
          {special.badge}
        </span>
      ) : null}
    </div>
  );
}
