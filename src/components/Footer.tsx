import Image from "next/image";
import Link from "next/link";
import { BUILDER, NAV, SITE } from "@/lib/constants";
import { SocialLinks } from "./SocialLinks";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-navy-950 text-sand-200/80">
      <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
        <div className="grid gap-x-16 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="font-display text-2xl font-semibold text-sand-100">
              {SITE.name}
              <span className="block text-sm font-sans font-medium tracking-wide text-gold-400">
                {SITE.subtitle}
              </span>
            </p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed">{SITE.tagline}</p>
            <SocialLinks className="mt-6" />
          </div>

          <div>
            <h2 className="font-display text-2xl font-semibold text-sand-100">
              Explore
            </h2>
            <ul className="mt-4 space-y-3 text-sm leading-6">
              {NAV.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-sand-100">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-display text-2xl font-semibold text-sand-100">
              Connect
            </h2>
            <ul className="mt-4 space-y-3 text-sm leading-6">
              <li>
                <a
                  href={SITE.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-sand-100"
                >
                  <svg className="h-4 w-4 shrink-0 text-[#25D366]" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  WhatsApp · {SITE.phone}
                </a>
              </li>
              {SITE.emails.map((email) => (
                <li key={email}>
                  <a href={`mailto:${email}`} className="inline-flex items-center gap-2 hover:text-sand-100">
                    <svg
                      className="h-4 w-4 shrink-0 text-gold-400"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                    >
                      <rect x="3" y="5" width="18" height="14" rx="2" />
                      <path d="m3.5 6.5 8.5 6.5 8.5-6.5" />
                    </svg>
                    {email}
                  </a>
                </li>
              ))}
              <li>
                <a href={`tel:${SITE.phoneTel}`} className="hover:text-sand-100">
                  Phone · {SITE.phone}
                </a>
              </li>
              <li>
                <a
                  href={SITE.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="whitespace-nowrap hover:text-sand-100"
                >
                  Instagram {SITE.instagramHandle}
                </a>
              </li>
              <li>
                <a href={SITE.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-sand-100">
                  Facebook
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-8 text-xs text-sand-200/55 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-x-6 sm:pr-16">
          <p>
            © {year} {SITE.name}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-sand-200/75">
            <a
              href={SITE.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-[#6ee7a0] transition hover:text-[#25D366]"
            >
              WhatsApp
            </a>
            {SITE.emails.map((email) => (
              <a key={email} href={`mailto:${email}`} className="transition hover:text-sand-100">
                {email}
              </a>
            ))}
          </div>
          <p>{SITE.location}</p>
        </div>

        <a
          href={BUILDER.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group mt-10 flex flex-col items-center gap-1.5 border-t border-white/10 pt-8 text-center"
          aria-label={`${BUILDER.name} — ${BUILDER.cta}`}
        >
          <span className="font-display text-sm italic tracking-wide text-sand-200/70">
            {BUILDER.tagline}
          </span>
          <Image
            src={BUILDER.logo}
            alt={BUILDER.name}
            width={48}
            height={48}
            className="h-12 w-auto opacity-90 transition duration-300 group-hover:opacity-100"
          />
          <span className="font-display text-sm italic text-[#b58df0] transition duration-300 group-hover:text-[#cbb0f7]">
            {BUILDER.cta}
          </span>
        </a>
      </div>
    </footer>
  );
}
