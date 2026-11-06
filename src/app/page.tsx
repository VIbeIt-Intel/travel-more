import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Holidays } from "@/components/Holidays";
import { Destinations } from "@/components/Destinations";
import { TripPlanner } from "@/components/TripPlanner";
import { Packages } from "@/components/Packages";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";

export default function Home() {
  return (
    <>
      <Header />
      <main id="main-content">
        <Hero />
        <Holidays />
        <Destinations />
        <TripPlanner />
        <Packages />
        <Contact />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
