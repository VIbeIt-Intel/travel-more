"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const holidays = [
  {
    id: "family-holidays",
    title: "Family Holidays",
    detail:
      "Resorts with space for everyone, interconnecting rooms and days that work for both the children and the adults.",
    icon: "family",
  },
  {
    id: "honeymoons",
    title: "Honeymoons and Romantic Holidays",
    detail:
      "Private dinners, quieter resorts and a pace set for two. Mauritius, Seychelles and the Maldives are the ones we plan most.",
    icon: "honeymoon",
  },
  {
    id: "luxury-holidays",
    title: "Luxury holidays",
    detail:
      "Villas and iconic hotels, with flights, transfers and the small arrangements handled before you land.",
    icon: "luxury",
  },
  {
    id: "golfing-holidays",
    title: "Golfing holidays",
    detail:
      "Tee times, resort stays and the travel around them, in South Africa, Mauritius and further afield.",
    icon: "golf",
  },
  {
    id: "sports-travel",
    title: "Sports Travel",
    detail:
      "F1, rugby, tennis and soccer. Match tickets, hotels near the ground and flights timed around the fixture.",
    icon: "sports",
  },
] as const;

function HolidayIcon({ name }: { name: (typeof holidays)[number]["icon"] }) {
  return (
    <span
      className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#1a9aab]/10 text-[#1a9aab]"
      aria-hidden
    >
      <svg
        viewBox="0 0 32 32"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
      >
        {name === "family" && (
          <>
            <circle cx="12" cy="9" r="3.1" />
            <circle cx="21.5" cy="11.2" r="2.3" />
            <path d="M5.5 25c.6-5.4 3.2-8 6.5-8s5.9 2.6 6.5 8" />
            <path d="M16.8 25c.4-4 2.2-6 4.6-6s4.1 2 4.5 6" />
          </>
        )}
        {name === "honeymoon" && (
          <>
            <circle cx="12.2" cy="16" r="6.4" />
            <circle cx="19.8" cy="16" r="6.4" />
          </>
        )}
        {name === "luxury" && (
          <>
            <path d="M16 5 26 14 16 27 6 14 16 5Z" />
            <path d="M6 14h20" />
            <path d="M16 5 11.5 14 16 27 20.5 14 16 5" />
          </>
        )}
        {name === "golf" && (
          <>
            <path d="M12 26V6.5" />
            <path d="M12 6.5h10.5L19.6 10l2.9 3.5H12" />
            <path d="M6.5 26c3.4 1.5 7.2 2 10.4 1.2 3.2-.8 6.4-2.2 9.6-1.2" />
          </>
        )}
        {name === "sports" && (
          <>
            <circle cx="16" cy="16" r="9.5" />
            <path d="M8.2 12.2c2.6 1.8 5.2 2.6 7.8 2.6s5.2-.8 7.8-2.6" />
            <path d="M8.2 19.8c2.6-1.8 5.2-2.6 7.8-2.6s5.2.8 7.8 2.6" />
          </>
        )}
      </svg>
    </span>
  );
}

export function Holidays() {
  return (
    <section id="holidays" className="relative scroll-mt-28 overflow-hidden py-24 md:py-32">
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,#fbf7f2_0%,#f3ece3_42%,#ebe3d6_100%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(ellipse_at_top,rgba(201,169,98,0.2),transparent_68%)]"
        aria-hidden
      />
      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mb-16 max-w-5xl text-center md:mb-20"
        >
          <p className="mb-5 text-lg font-semibold uppercase tracking-[0.22em] text-teal-600 md:text-xl">
            Type of holidays
          </p>
          <h2 className="font-display text-4xl font-semibold tracking-tight text-navy-900 md:text-5xl lg:text-[3.5rem] lg:leading-[1.12]">
            Welcome to Travel More, where travel is thoughtfully designed around the moments that
            matter most.
          </h2>
          <div className="mx-auto mt-8 max-w-4xl space-y-6 text-base leading-8 text-navy-800/75 md:mt-10 md:text-lg md:leading-9">
            <p>
              From sun-soaked island escapes and exotic ocean hideaways to inspiring European
              journeys, local favourites, and unforgettable global adventures, we curate holidays
              that feel seamless, personal, and deeply rewarding. Whether you&apos;re planning
              quality time with family, a refined golf escape, or a long-awaited dream trip, every
              detail is handled with care and intention.
            </p>
            <p>No matter the destination, we turn travel into something truly special.</p>
          </div>
          <p className="mt-10 font-display text-2xl italic text-navy-900 md:text-[1.7rem]">
            Let&apos;s plan something exceptional.
          </p>
        </motion.div>

        <div className="grid items-stretch gap-4 md:grid-cols-2 lg:grid-cols-3">
          {holidays.map((holiday, index) => (
            <motion.article
              key={holiday.id}
              id={holiday.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.05 }}
              whileHover={{ y: -3 }}
              className="scroll-mt-28 rounded-2xl bg-[linear-gradient(155deg,rgba(126,224,210,0.95),rgba(26,154,171,0.28)_42%,rgba(26,154,171,0.72))] p-px shadow-[0_16px_34px_-26px_rgba(26,154,171,0.7)]"
            >
              <div className="flex h-full flex-col rounded-[15px] bg-[#fffcf8]/95 px-5 py-4">
                <HolidayIcon name={holiday.icon} />
                <h3 className="font-display text-2xl font-semibold tracking-tight text-navy-900">
                  {holiday.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-navy-800/70">
                  {holiday.detail}
                </p>
                <Link
                  href="#contact"
                  className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#146870] transition hover:text-[#1a9aab]"
                >
                  Ask about this trip
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
