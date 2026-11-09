"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { SITE } from "@/lib/constants";
import { isStaticPublicSite } from "@/lib/publicSite";
import {
  QUESTIONS,
  buildItinerary,
  defaultRateTable,
  summariseForEnquiry,
  type PlannerAnswers,
  type RateTable,
} from "@/lib/tripPlanner";
import { SectionHeading } from "./SectionHeading";

const ease = [0.22, 1, 0.36, 1] as const;

export function TripPlanner() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<PlannerAnswers>>({});
  const [rates, setRates] = useState<RateTable | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isStaticPublicSite()) {
      setRates(defaultRateTable());
      return;
    }
    let active = true;
    fetch("/api/rates")
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { rates?: RateTable } | null) => {
        if (active) setRates(data?.rates ?? defaultRateTable());
      })
      .catch(() => {
        if (active) setRates(defaultRateTable());
      });
    return () => {
      active = false;
    };
  }, []);

  const finished = step >= QUESTIONS.length;
  const itinerary = useMemo(
    () => (finished && rates ? buildItinerary(answers as PlannerAnswers, rates) : null),
    [finished, answers, rates],
  );

  const advancing = useRef(false);

  function choose(id: keyof PlannerAnswers, value: PlannerAnswers[keyof PlannerAnswers]) {
    if (advancing.current) return;
    advancing.current = true;
    setAnswers((prev) => ({ ...prev, [id]: value }));
    window.setTimeout(() => {
      advancing.current = false;
      setStep((s) => s + 1);
      if (step === QUESTIONS.length - 1) {
        panelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 220);
  }

  function restart() {
    setAnswers({});
    setStep(0);
    panelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <section
      id="live-quotes"
      className="relative scroll-mt-28 overflow-hidden border-b border-sand-300/50 py-20 md:py-28"
    >
      <MarineField />
      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          light
          eyebrow="Trip planner"
          title="Your trip, sketched in under a minute"
          description="Answer five quick questions and get a plan for each day, with an estimated cost. Like it? Send it to us and we'll turn it into a real quote."
        />

        <div ref={panelRef} className="scroll-mt-28">
          <AnimatePresence mode="wait">
            {!finished ? (
              <QuestionStep
                key={step}
                step={step}
                selected={answers[QUESTIONS[step].id]}
                onChoose={choose}
                onBack={() => setStep((s) => Math.max(0, s - 1))}
              />
            ) : !itinerary ? (
              <p className="text-center text-sm text-navy-800/70">Working out the estimate.</p>
            ) : (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease }}
                  className="overflow-hidden rounded-3xl border border-sand-300/60 bg-sand-100 shadow-xl shadow-navy-950/5"
                >
                  <ItineraryCover itinerary={itinerary} />
                  <div className="grid gap-10 p-6 md:p-10 lg:grid-cols-[1fr_360px]">
                    <DayTimeline days={itinerary.days} />
                    <PriceCard
                      itinerary={itinerary}
                      answers={answers as PlannerAnswers}
                      onRestart={restart}
                    />
                  </div>
                </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function MarineField() {
  const [play, setPlay] = useState(true);
  const ref = useRef<HTMLDivElement>(null);
  const near = useInView(ref, { once: true, margin: "400px 0px" });

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setPlay(!media.matches);
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);

  return (
    <div ref={ref} className="pointer-events-none absolute inset-0" aria-hidden>
      <Image
        src="/images/reef-poster.jpg"
        alt=""
        fill
        sizes="100vw"
        className="object-cover"
      />
      {play && near && (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="/videos/reef-web.mp4" type="video/mp4" />
        </video>
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-navy-950/60 via-navy-950/28 to-navy-950/50" />
    </div>
  );
}

function QuestionStep({
  step,
  selected,
  onChoose,
  onBack,
}: {
  step: number;
  selected: PlannerAnswers[keyof PlannerAnswers] | undefined;
  onChoose: (id: keyof PlannerAnswers, value: PlannerAnswers[keyof PlannerAnswers]) => void;
  onBack: () => void;
}) {
  const question = QUESTIONS[step];
  const progress = ((step + 1) / QUESTIONS.length) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, x: 32 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -32 }}
      transition={{ duration: 0.35, ease }}
      className="mx-auto max-w-3xl rounded-3xl border border-white/20 bg-navy-950/25 p-6 shadow-2xl shadow-navy-950/30 backdrop-blur-md md:p-10"
    >
      <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.2em] text-sand-100/80">
        <span>
          Question {step + 1} of {QUESTIONS.length}
        </span>
        {step > 0 && (
          <button
            type="button"
            onClick={onBack}
            className="rounded-full px-3 py-1 text-sand-100 transition hover:bg-white/15"
          >
            ← Back
          </button>
        )}
      </div>
      <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/20">
        <motion.div
          className="h-full rounded-full bg-gold-500"
          initial={false}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease }}
        />
      </div>

      <h3 className="font-display mt-8 text-3xl font-semibold text-white md:text-4xl">
        {question.title}
      </h3>

      <div
        className={`mt-8 grid gap-3 ${question.options.length === 4 ? "sm:grid-cols-2" : "sm:grid-cols-3"}`}
        role="radiogroup"
        aria-label={question.title}
      >
        {question.options.map((option, i) => {
          const isSelected = selected === option.value;
          return (
            <motion.button
              key={String(option.value)}
              type="button"
              role="radio"
              aria-checked={isSelected}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.05 * i, ease }}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onChoose(question.id, option.value)}
              className={`group rounded-2xl border p-5 text-left transition ${
                isSelected
                  ? "border-gold-500 bg-white shadow-md shadow-gold-500/15"
                  : "border-transparent bg-sand-100 hover:border-gold-400 hover:bg-white hover:shadow-md"
              }`}
            >
              <span className="block font-display text-xl font-semibold text-navy-900">
                {option.label}
              </span>
              <span className="mt-1 block text-sm text-navy-800/65">{option.hint}</span>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}

function ItineraryCover({ itinerary }: { itinerary: NonNullable<ReturnType<typeof buildItinerary>> }) {
  const [cover, ...gallery] = itinerary.destination.images;
  const nights = itinerary.days.length - 1;

  return (
    <div className="relative isolate min-h-[340px] overflow-hidden md:min-h-[420px]">
      <motion.div
        className="absolute inset-0 -z-10"
        initial={{ scale: 1.12 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.6, ease }}
      >
        <Image
          src={cover.src}
          alt={cover.alt}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 1280px) 100vw, 1280px"
        />
      </motion.div>
      <div
        className="absolute inset-0 -z-[5] bg-gradient-to-t from-navy-950 via-navy-950/50 to-navy-950/10"
        aria-hidden
      />

      <div className="flex h-full min-h-[340px] flex-col justify-end gap-6 p-6 md:min-h-[420px] md:flex-row md:items-end md:justify-between md:p-10">
        <div className="text-sand-100">
          {itinerary.recommended && (
            <span className="mb-3 inline-block rounded-full bg-gold-500 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-navy-950">
              Our pick for you
            </span>
          )}
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">
            {itinerary.destination.region} · {nights} nights
          </p>
          <h3 className="font-display mt-2 text-4xl font-semibold md:text-6xl">
            {itinerary.destination.name}
          </h3>
          <p className="mt-3 max-w-lg text-base text-sand-200/90 md:text-lg">
            {itinerary.destination.tagline}
          </p>
        </div>

        {gallery.length > 0 && (
          <div className="flex gap-3">
            {gallery.map((img, i) => (
              <motion.div
                key={img.src}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + i * 0.1, ease }}
                className="relative h-20 w-28 overflow-hidden rounded-xl ring-2 ring-white/70 md:h-24 md:w-36"
              >
                <Image src={img.src} alt={img.alt} fill className="object-cover" sizes="144px" />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function DayTimeline({ days }: { days: { title: string; detail: string }[] }) {
  return (
    <div>
      <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-600">
        Your days
      </h4>
      <ol className="relative mt-6 space-y-6 border-l border-gold-400/40 pl-8">
        {days.map((day, i) => (
          <motion.li
            key={`${i}-${day.title}`}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.3 + i * 0.06, ease }}
            className="relative"
          >
            <span
              className="absolute -left-[41px] top-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-gold-500 bg-sand-100"
              aria-hidden
            >
              <span className="h-1.5 w-1.5 rounded-full bg-gold-500" />
            </span>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gold-600">
              Day {i + 1}
            </p>
            <p className="font-display mt-1 text-xl font-semibold text-navy-900">{day.title}</p>
            <p className="mt-1 text-sm leading-relaxed text-navy-800/75 md:text-base">
              {day.detail}
            </p>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}

function PriceCard({
  itinerary,
  answers,
  onRestart,
}: {
  itinerary: NonNullable<ReturnType<typeof buildItinerary>>;
  answers: PlannerAnswers;
  onRestart: () => void;
}) {
  const summary = summariseForEnquiry(answers, itinerary);
  const whatsappHref = `${SITE.whatsapp}?text=${encodeURIComponent(summary)}`;
  const [primaryEmail, ...ccEmails] = SITE.emails;
  const cc = ccEmails.length > 0 ? `cc=${ccEmails.join(",")}&` : "";
  const emailHref = `mailto:${primaryEmail}?${cc}subject=${encodeURIComponent(
    `Trip planner: ${itinerary.destination.name}, ${answers.nights} nights`,
  )}&body=${encodeURIComponent(summary)}`;

  return (
    <motion.aside
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5, ease }}
      className="h-fit rounded-2xl bg-navy-950 p-6 text-sand-100 lg:sticky lg:top-28 md:p-8"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">
        Estimated cost
      </p>
      <p className="font-display mt-2 text-3xl font-semibold md:text-4xl">
        TBD
      </p>
      <p className="mt-1 text-sm text-sand-200/70">{itinerary.priceNote}</p>

      <ul className="mt-6 space-y-2 border-t border-white/10 pt-6">
        {itinerary.includes.map((item) => (
          <li key={item} className="flex items-center gap-2 text-sm text-sand-200">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold-400" aria-hidden />
            {item}
          </li>
        ))}
      </ul>

      <div className="mt-8 space-y-3">
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center rounded-full bg-gold-500 py-3.5 text-sm font-semibold text-navy-950 transition hover:bg-gold-400"
        >
          Send this plan on WhatsApp
        </a>
        <a
          href={emailHref}
          className="flex w-full items-center justify-center rounded-full border border-gold-400/40 py-3.5 text-sm font-semibold text-gold-400 transition hover:bg-gold-400/10"
        >
          Email it to us
        </a>
        <button
          type="button"
          onClick={onRestart}
          className="w-full py-2 text-sm text-sand-200/70 underline-offset-4 transition hover:text-sand-100 hover:underline"
        >
          Start over
        </button>
      </div>

      <p className="mt-6 text-xs leading-relaxed text-sand-200/50">
        Estimates are indicative and depend on dates and availability. We&apos;ll confirm real
        prices in your personalised quote, and we match comparable quotes.
      </p>
    </motion.aside>
  );
}
