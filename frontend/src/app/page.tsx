import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Doctors from "@/components/Doctors";
import Reviews from "@/components/Reviews";
import Promotions from "@/components/Promotions";
import Booking from "@/components/Booking";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="dark:bg-[#0a0f1a]">
        <div
          className="dark:!bg-[#0a0f1a]"
          style={{
            backgroundColor: "#0d1117",
            backgroundImage: "linear-gradient(160deg, #1a2035 0%, #141a2a 15%, #0d1117 30%, #111827 50%, #0d1117 70%, #151c2c 85%, #1a2438 100%)",
          }}
        >
          <Hero />
          <About />
        </div>
        <Services />
        <Doctors />
        <Reviews />
        <Promotions />
        <Booking />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
