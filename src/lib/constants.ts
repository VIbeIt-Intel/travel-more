export const SITE = {
  name: "Travel More",
  subtitle: "Business & Leisure",
  tagline: "Your Next Chapter Starts with Travel More.",
  location: "Gauteng, South Africa",
  emails: ["info@travelmore.co.za", "fransmari@travelmorebl.com"],
  phone: "076 481 2699",
  phoneTel: "+27764812699",
  whatsapp: "https://wa.me/27764812699",
  instagram: "https://www.instagram.com/travelmore_business_leisure",
  instagramHandle: "@travelmore_business_leisure",
  facebook: "https://www.facebook.com/travelmoreBusinessLeisure",
} as const;

export const BUILDER = {
  name: "VibeIt",
  tagline: "the vibe, the website",
  cta: "Want a site like this?",
  logo: "/vibeit-logo.png",
  url: "https://vibeit-intel.net/",
} as const;

export type NavChild = { href: string; label: string };

export type NavItem = {
  href: string;
  label: string;
  children?: NavChild[];
};

export const NAV: NavItem[] = [
  {
    href: "/about",
    label: "About us",
    children: [
      { href: "/about#about-me", label: "About me" },
      { href: "/about#reviews", label: "Reviews" },
    ],
  },
  {
    href: "/#holidays",
    label: "Type of holidays",
    children: [
      { href: "/#family-holidays", label: "Family Holidays" },
      { href: "/#honeymoons", label: "Honeymoons and Romantic Holidays" },
      { href: "/#luxury-holidays", label: "Luxury holidays" },
      { href: "/#golfing-holidays", label: "Golfing holidays" },
      { href: "/#sports-travel", label: "Sports Travel, F1, Rugby, Tennis, Soccer" },
    ],
  },
  {
    href: "/#destinations",
    label: "Destinations and travel guides",
    children: [
      { href: "/destinations/mauritius", label: "Mauritius" },
      { href: "/destinations/zanzibar", label: "Zanzibar" },
      { href: "/destinations/seychelles", label: "Seychelles" },
      { href: "/destinations/maldives", label: "Maldives" },
      { href: "/destinations/europe", label: "Europe" },
    ],
  },
  { href: "/#specials", label: "Specials" },
  { href: "/#live-quotes", label: "Live Quotes" },
  { href: "/#contact", label: "Booking requests / Contact me" },
];

export const IMAGES = {
  hero:
    "https://images.unsplash.com/photo-1540202404-a7f290332e47?q=80&w=2400&auto=format&fit=crop",
  mauritius: "/images/destinations/mauritius-lagoon.jpg",
  southAfrica: "/images/destinations/south-africa.jpg",
  headerShore:
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1920&auto=format&fit=crop",
} as const;
