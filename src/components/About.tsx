"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { IMAGES } from "@/lib/constants";
import { SectionHeading } from "./SectionHeading";

export function About() {
  return (
    <>
      <section id="about" className="scroll-mt-28 pb-20 pt-8 md:pb-28 md:pt-12">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-2xl shadow-navy-950/15 lg:aspect-[5/6]"
            >
              <Image
                src={IMAGES.about}
                alt="Cape Town and Table Bay seen from Table Mountain"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-navy-950/10" />
            </motion.div>

            <div>
              <SectionHeading
                centered={false}
                eyebrow="About us"
                title="Travel, designed around the moments that matter"
              />

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="space-y-4 text-base leading-relaxed text-navy-800/80"
              >
                <p>
                  Welcome to Travel More, where travel is thoughtfully designed around the moments
                  that matter most.
                </p>
                <p>
                  From island escapes and exotic ocean hideaways to inspiring European
                  journeys, local favourites, and unforgettable global adventures, we curate
                  holidays that feel seamless, personal, and deeply rewarding. Whether you&apos;re
                  planning quality time with family, a refined golf escape, or a dream
                  trip, every detail is handled with care and intention.
                </p>
                <p>No matter the destination, we turn travel into something truly special.</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                <Link
                  href="/#contact"
                  className="mt-8 inline-flex rounded-full bg-[#2a9d94] px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-[#1f857d]"
                >
                  Let&apos;s plan something exceptional
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <section id="about-me" className="scroll-mt-28 bg-sand-100 py-20 md:py-28">
        <div className="mx-auto max-w-3xl px-5 lg:px-8">
          <SectionHeading eyebrow="About me" title="FransMari Grant" description="Founder of Travel More" />

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-4 text-base leading-relaxed text-navy-800/80"
          >
            <p>
              I&apos;m FransMari Grant, founder of Travel More, where we create travel experiences
              that are seamless, luxurious, and unforgettable. My journey began in 2015 at Flight
              Centre Retail, followed by Flight Centre Independent in 2017, and in 2025 I rebranded
              as Travel More to focus on bespoke family and golf escapes, and much more. I hold an
              Honours Degree in Tourism Management, combining professional expertise with a deep
              personal passion for travel.
            </p>
            <p>
              At Travel More, we believe that every journey should be tailored to the individual. We
              invest in travel ourselves to ensure we provide the best advice, value, and insider
              tips, and we partner with the most reputable operators and wholesalers worldwide. Our
              foundation is built on relationships, and we take pride in offering a personal touch
              to ensure every client&apos;s dream holiday meets their specific needs.
            </p>
            <p>
              While we specialise in tropical island escapes across Mauritius, the Maldives,
              Zanzibar, the Seychelles, Bali, and Thailand, our services extend far beyond. From
              cruises, ski trips, and flights to local travel, destination weddings, and corporate
              or incentive trips, we offer a wide range of experiences, all curated with care,
              expertise, and attention to detail.
            </p>
            <p>
              With Travel More, your holiday isn&apos;t just a trip. It&apos;s a collection of
              moments, memories, and experiences designed to last a lifetime.
            </p>
          </motion.div>
        </div>
      </section>
    </>
  );
}
