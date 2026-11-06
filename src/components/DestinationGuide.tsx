import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { TripEnquiry } from "@/components/TripEnquiry";
import { GUIDES, type Guide } from "@/lib/guides";

export function DestinationGuide({ guide }: { guide: Guide }) {
  const others = GUIDES.filter((item) => item.slug !== guide.slug);

  return (
    <>
      <Header />
      <main id="main-content">
        <section className="relative flex min-h-[78vh] items-end">
          <Image
            src={guide.image}
            alt={guide.alt}
            fill
            priority
            quality={90}
            className={`object-cover ${guide.objectPosition}`}
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/35 to-navy-950/25" />
          <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-14 pt-32 lg:px-8 lg:pb-20">
            <Link
              href="/#destinations"
              className="text-xs font-semibold uppercase tracking-[0.22em] text-white/80 transition hover:text-white"
            >
              All destinations
            </Link>
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.22em] text-[#9ef0e4]">
              Travel guide
            </p>
            <h1 className="mt-3 max-w-3xl font-display text-5xl font-semibold text-white md:text-7xl">
              {guide.name}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/90">{guide.lead}</p>
          </div>
        </section>

        <section className="bg-sand-100 py-16 md:py-24">
          <div className="mx-auto grid max-w-6xl items-start gap-10 px-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-x-14 lg:px-8">
            <div className="min-w-0 pt-8">
              <h2 className="font-display text-4xl font-semibold leading-[1.08] text-navy-900 md:text-5xl">
                What it is like
              </h2>
              <div className="mt-6 space-y-5 text-base leading-relaxed text-navy-800/80 md:text-lg">
                {guide.feel.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <h2 className="mt-14 font-display text-4xl font-semibold leading-[1.08] text-navy-900 md:text-5xl">
                How we usually plan it
              </h2>
              <p className="mt-6 text-base leading-relaxed text-navy-800/80 md:text-lg">{guide.trip}</p>
            </div>

            <aside className="min-w-0 h-fit rounded-3xl bg-white px-7 pb-8 pt-8 shadow-xl shadow-navy-950/5 md:px-8 md:pb-10 lg:sticky lg:top-28">
              <h2 className="font-display text-4xl font-semibold leading-[1.08] text-navy-900 md:text-5xl">
                Good to know
              </h2>
              <p className="mt-6 text-base leading-relaxed text-navy-800/75">
                The practical points travellers ask about before they commit. Entry rules change, and we recheck them for your passport before anything is ticketed.
              </p>
              <dl className="mt-8 space-y-6">
                {guide.facts.map((fact) => (
                  <div key={fact.label}>
                    <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1a7d76]">
                      {fact.label}
                    </dt>
                    <dd className="mt-1.5 text-base leading-relaxed text-navy-800/85">{fact.detail}</dd>
                  </div>
                ))}
              </dl>
            </aside>
          </div>

          <div className="mx-auto mt-16 max-w-6xl px-5 lg:px-8">
            <h2 className="font-display text-4xl font-semibold text-navy-900 md:text-5xl">
              Places of interest
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-navy-800/75 md:text-lg">
              Not a checklist to finish. These are the places worth building the days around.
            </p>
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {guide.places.map((place) => (
                <article
                  key={place.name}
                  className="overflow-hidden rounded-3xl bg-white shadow-lg shadow-navy-950/5"
                >
                  <div className="relative aspect-[16/10]">
                    <Image
                      src={place.image}
                      alt={place.alt}
                      fill
                      quality={90}
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 560px"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-3xl font-semibold text-navy-900">{place.name}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-navy-800/80 md:text-base">
                      {place.detail}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="mx-auto mt-20 max-w-6xl px-5 lg:px-8">
            <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-12">
              <div className="relative aspect-[16/10] overflow-hidden lg:sticky lg:top-28">
                <Image
                  src={guide.image}
                  alt={guide.alt}
                  fill
                  quality={90}
                  className={`object-cover ${guide.objectPosition}`}
                  sizes="(max-width: 1024px) 100vw, 560px"
                />
              </div>
              <TripEnquiry destination={guide.name} />
            </div>
          </div>

          <div className="mx-auto mt-16 max-w-6xl px-5 lg:px-8">
            <h2 className="font-display text-2xl font-semibold text-navy-900">Other guides</h2>
            <div className="mt-5 flex flex-wrap gap-3">
              {others.map((item) => (
                <Link
                  key={item.slug}
                  href={`/destinations/${item.slug}`}
                  className="rounded-full border border-navy-900/15 bg-white px-4 py-2 text-sm font-medium text-navy-900 transition hover:border-[#2a9d94] hover:text-[#1a6d68]"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
