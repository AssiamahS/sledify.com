import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import MixerPanel from "@/components/MixerPanel";
import FeaturesSection from "@/components/FeaturesSection";
import Footer from "@/components/Footer";

const Index = () => {
  useEffect(() => {
    // Update page title and meta
    document.title = "SlyDecks | Pro DJ Mixer";
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <main>
        <HeroSection />
        <MixerPanel />
        <FeaturesSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
