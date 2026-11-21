import { readPublishedSpecials } from "@/lib/specials";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Holidays } from "@/components/Holidays";
import { Destinations } from "@/components/Destinations";
import { TripPlanner } from "@/components/TripPlanner";
import { Packages } from "@/components/Packages";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";

export default async function Home() {
  const specials = await readPublishedSpecials();
  return (
    <>
      <Header />
      <main id="main-content">
        <Hero />
        <Holidays />
        <Destinations />
        <TripPlanner />
        <Packages specials={specials} />
        <Contact />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
