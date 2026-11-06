import Link from "next/link";
import { NAV, SITE } from "@/lib/constants";
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
              <li>
                <a href={`tel:${SITE.phoneTel}`} className="hover:text-sand-100">
                  {SITE.phone}
                </a>
              </li>
              {SITE.emails.map((email) => (
                <li key={email}>
                  <a href={`mailto:${email}`} className="hover:text-sand-100">
                    {email}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-white/10 pt-8 text-xs text-sand-200/55 sm:flex-row sm:items-center sm:justify-between sm:pr-16">
          <p>
            © {year} {SITE.name}. All rights reserved.
          </p>
          <p>{SITE.location}</p>
        </div>
      </div>
    </footer>
  );
}
