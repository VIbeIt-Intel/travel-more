import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { About } from "@/components/About";
import { Testimonials } from "@/components/Testimonials";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";

export const metadata: Metadata = {
  title: "About us",
  description:
    "Travel More is a Gauteng travel studio led by FransMari Grant. Read about the company, the founder, and what clients say.",
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
