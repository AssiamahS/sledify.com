import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TelemetryPanel from "@/components/TelemetryPanel";
import FeaturesSection from "@/components/FeaturesSection";
import Footer from "@/components/Footer";

const Index = () => {
  useEffect(() => {
    // Update page title and meta
    document.title = "Sledify | The Future of Autonomous Delivery";
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <main>
        <HeroSection />
        <TelemetryPanel />
        <FeaturesSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
