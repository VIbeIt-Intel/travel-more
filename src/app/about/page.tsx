import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { About } from "@/components/About";
import { Testimonials } from "@/components/Testimonials";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";

const aboutDescription =
  "Travel More is a Gauteng travel studio led by FransMari Grant. Read about the company, the founder, and what clients say.";

export const metadata: Metadata = {
  title: "About us",
  description: aboutDescription,
  openGraph: {
    title: "About us",
    description: aboutDescription,
    url: "https://travelmorebl.com/about",
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "About us",
    description: aboutDescription,
    images: ["/og-image.jpg"],
  },
};

export default function AboutPage() {
  return (
    <>
      <Header solid />
      <main id="main-content" className="pt-24">
        <About />
        <Testimonials />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
