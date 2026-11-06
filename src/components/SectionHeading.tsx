"use client";

import { motion } from "framer-motion";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  light?: boolean;
  centered?: boolean;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  light = false,
  centered = true,
}: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={`mb-12 md:mb-16 ${centered ? "mx-auto max-w-4xl text-center" : "max-w-2xl"}`}
    >
      {eyebrow && (
        <p
          className={`mb-4 text-lg font-semibold uppercase tracking-[0.22em] md:text-xl ${
            light ? "text-gold-400" : "text-teal-600"
          }`}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={`font-display text-4xl font-semibold tracking-tight md:text-5xl lg:text-[3.5rem] lg:leading-[1.12] ${
          light ? "text-sand-100" : "text-navy-900"
        }`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`mt-4 text-base leading-relaxed md:text-lg ${
            light ? "text-sand-200/90" : "text-navy-800/75"
          }`}
        >
          {description}
        </p>
      )}
    </motion.div>
  );
}
