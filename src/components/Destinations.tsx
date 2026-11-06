"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { SectionHeading } from "./SectionHeading";

const destinations = [
  {
    id: "mauritius",
    name: "Mauritius",
    image: "/images/destinations/mauritius-lagoon.jpg",
    alt: "Aerial view of Le Morne Brabant and the turquoise lagoon in Mauritius",
    blurb:
      "Paradise Island. Pristine beaches, turquoise lagoons and the warmest welcome in the Indian Ocean.",
    objectPosition: "object-center",
  },
  {
    id: "zanzibar",
    name: "Zanzibar",
    image: "/images/destinations/zanzibar-beach.jpg",
    alt: "White sand, palm trees and turquoise water on the coast of Zanzibar",
    blurb:
      "Dhows on a pale beach, spice markets in Stone Town, and days that move at island pace.",
    objectPosition: "object-center",
  },
  {
    id: "seychelles",
    name: "Seychelles",
    image: "/images/destinations/seychelles-digue.jpg",
    alt: "Granite boulders and clear water at Anse Source d'Argent, La Digue",
    blurb:
      "Granite boulders, powder sand and quiet coves on La Digue, Praslin and Mahé.",
    objectPosition: "object-center",
  },
  {
    id: "maldives",
    name: "Maldives",
    image: "/images/destinations/maldives-card.jpg",
    alt: "Overwater villas above a coral reef in the Maldives",
    blurb:
      "Overwater villas on a clear lagoon, reached by seaplane or speedboat.",
    objectPosition: "object-center",
  },
  {
    id: "europe",
    name: "Europe",
    image: "/images/destinations/europe-sharp.jpg",
    alt: "Hallstatt church and village reflected in the lake in Austria",
    blurb:
      "Lakeside villages, city breaks and countryside stays, shaped around how you like to travel.",
    objectPosition: "object-[center_38%]",
  },
];

function DestinationCard({
  dest,
  index,
  className = "",
}: {
  dest: (typeof destinations)[0];
  index: number;
  className?: string;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay: index * 0.08 }}
      id={dest.id}
      className={`group relative isolate aspect-[4/5] scroll-mt-28 overflow-hidden rounded-3xl shadow-xl shadow-navy-950/10 ${className}`}
    >
      <Image
        src={dest.image}
        alt={dest.alt}
        fill
        quality={90}
        className={`-z-10 object-cover transition duration-700 group-hover:scale-[1.04] ${dest.objectPosition}`}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 720px"
      />
      <div
        className="absolute inset-x-0 bottom-0 -z-[5] h-[62%] bg-gradient-to-t from-navy-950 via-navy-950/55 to-transparent"
        aria-hidden
      />
      <div className="absolute inset-x-0 bottom-0 p-6 md:p-7">
        <h3 className="font-display text-3xl font-semibold text-white md:text-4xl">{dest.name}</h3>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/90 md:text-[0.95rem]">
          {dest.blurb}
        </p>
        <Link
          href={`/destinations/${dest.id}`}
          className="explore-pulse mt-5 inline-block border border-white/90 px-5 py-3 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-white transition-[color] duration-500 hover:bg-white hover:text-navy-900"
          style={{ animationDelay: `${index * 0.45}s` }}
        >
          Explore {dest.name}
        </Link>
      </div>
    </motion.article>
  );
}

export function Destinations() {
  return (
    <section id="destinations" className="scroll-mt-28 bg-sand-100 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          eyebrow="Destinations and travel guides"
          title="Where your next chapter unfolds"
          description="Mauritius is where most of our travellers start. Zanzibar, Seychelles, the Maldives and Europe are planned the same way: flights, stays and the days in between."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {destinations.map((dest, index) => (
            <DestinationCard key={dest.id} dest={dest} index={index} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <Link
            href="#contact"
            className="inline-flex rounded-full bg-[#2a9d94] px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-[#1f857d]"
          >
            Request a destination quote
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
