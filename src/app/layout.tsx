import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import { SITE } from "@/lib/constants";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

const siteUrl = "https://travelmorebl.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${SITE.name} | ${SITE.subtitle}, Boutique Travel, Gauteng`,
    template: `%s | ${SITE.name}`,
  },
  description:
    "Gauteng-based boutique travel agency specialising in bespoke business travel, bleisure itineraries, Mauritius resort packages, corporate retreats, and custom South African & Indian Ocean journeys.",
  keywords: [
    "Travel More",
    "bleisure travel South Africa",
    "Mauritius packages",
    "corporate travel Gauteng",
    "bespoke itineraries",
    "business leisure travel",
  ],
  openGraph: {
    title: `${SITE.name} | ${SITE.subtitle}`,
    description: SITE.tagline,
    url: siteUrl,
    siteName: SITE.name,
    locale: "en_ZA",
    type: "website",
    images: [
      {
        url: `${siteUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Travel More, Business & Leisure, South Africa",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} | ${SITE.subtitle}`,
    description: SITE.tagline,
    images: [`${siteUrl}/og-image.jpg`],
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [{ url: "/favicon.ico", sizes: "any" }, { url: "/icon.png", type: "image/png", sizes: "32x32" }],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-ZA" className={`${cormorant.variable} ${dmSans.variable}`}>
      <body className="min-h-screen antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-gold-500 focus:px-4 focus:py-2 focus:text-navy-950 focus:outline-none"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
