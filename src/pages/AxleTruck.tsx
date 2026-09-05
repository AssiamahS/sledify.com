import { useEffect } from "react";
import {
  Navbar,
  HeroSection,
  FleetMap,
  Dashboard,
  Features,
  Footer,
} from "@/components/axle";

const AxleTruck = () => {
  useEffect(() => {
    document.title = "Axle Truck | Fleet Tracking Platform";
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <HeroSection />
        <Features />
        <FleetMap />
        <Dashboard />
      </main>
      <Footer />
    </div>
  );
};

export default AxleTruck;
