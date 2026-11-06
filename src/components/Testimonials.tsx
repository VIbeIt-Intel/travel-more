"use client";

import { motion } from "framer-motion";
import { SITE } from "@/lib/constants";
import { SectionHeading } from "./SectionHeading";

type Testimonial = {
  quote: string;
  author: string;
  role: string;
  source?: "facebook";
};

const testimonials: Testimonial[] = [
  {
    quote:
      "Travel More goes out of their way and makes the extra effort to make your travel arrangements as easy and comfortable as possible for you. I will use them again and again and can recommend them to anyone. Thank you very much Frans-Mari!!",
    author: "Marié van der Walt",
    role: "Recommended on Facebook · April 2025",
    source: "facebook",
  },
  {
    quote:
      "The attention to detail was impeccable. Our corporate retreat felt like a personal vacation.",
    author: "Sarah J.",
    role: "CEO, Johannesburg",
  },
  {
    quote:
      "Simply the best travel partner in South Africa. They handle everything from flights to villas.",
    author: "Mark & Elena",
    role: "Cape Town",
  },
];

function FacebookIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.5 0-1.96.93-1.96 1.89v2.26h3.32l-.53 3.5h-2.8V24C19.62 23.1 24 18.1 24 12.07" />
    </svg>
  );
}

export function Testimonials() {
  return (
    <section id="reviews" className="scroll-mt-28 border-y border-sand-300/50 bg-sand-200/40 py-20 md:py-28" aria-label="Reviews">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading eyebrow="Client stories" title="Trusted by leaders and leisure travellers" />

        <motion.a
          href={`${SITE.facebook}/reviews`}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto -mt-6 mb-12 flex w-fit items-center gap-3 rounded-full border border-sand-300 bg-white px-5 py-2.5 text-sm shadow-sm transition hover:border-[#1877F2]/40 hover:shadow-md"
        >
          <FacebookIcon className="h-5 w-5 text-[#1877F2]" />
          <span className="font-semibold text-navy-900">100% recommend</span>
          <span className="text-navy-800/65">5 reviews on Facebook</span>
          <span className="text-teal-600" aria-hidden>
            →
          </span>
        </motion.a>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((item, index) => (
            <motion.blockquote
              key={item.author}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative flex flex-col rounded-2xl bg-white p-8 shadow-sm md:p-9"
            >
              <span className="font-display text-6xl leading-none text-gold-400/40" aria-hidden>
                &ldquo;
              </span>
              <p className="font-display -mt-6 flex-1 text-xl leading-relaxed text-navy-900">
                {item.quote}
              </p>
              <footer className="mt-6 flex items-center justify-between gap-3 border-t border-sand-200 pt-6">
                <cite className="not-italic">
                  <span className="block font-semibold text-navy-900">{item.author}</span>
                  <span className="text-sm text-navy-800/65">{item.role}</span>
                </cite>
                {item.source === "facebook" && (
                  <FacebookIcon className="h-6 w-6 shrink-0 text-[#1877F2]" />
                )}
              </footer>
            </motion.blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
