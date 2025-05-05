import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import Pricing from "@/components/Pricing";
import DownloadCTA from "@/components/DownloadCTA";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import MobileAppBanner from "@/components/MobileAppBanner";
import SuggestedFeatures from "@/components/SuggestedFeatures";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Testimonials />
      <Pricing />
      <DownloadCTA />
      <FAQ />
      <SuggestedFeatures />
      <Footer />
      <MobileAppBanner />
    </div>
  );
}
