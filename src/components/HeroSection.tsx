import ProgressTracker from "./ProgressTracker";
import { ArrowDown } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="min-h-screen relative flex flex-col justify-center pt-20" id="tracking">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px]" />
        
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '100px 100px'
          }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Hero Text */}
        <div className="text-center mb-16 md:mb-24">
          <p className="hero-subheading mb-4 fade-in-up opacity-0" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
            THE FUTURE OF LOGISTICS
          </p>
          <h1 className="hero-heading mb-6 fade-in-up opacity-0" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
            <span className="text-foreground">Sledify</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto fade-in-up opacity-0" style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}>
            Autonomous delivery. Zero emissions. Unmatched precision.
          </p>
        </div>

        {/* Progress Tracker */}
        <div className="fade-in-up opacity-0" style={{ animationDelay: '500ms', animationFillMode: 'forwards' }}>
          <ProgressTracker />
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 fade-in-up opacity-0" style={{ animationDelay: '800ms', animationFillMode: 'forwards' }}>
          <div className="flex flex-col items-center gap-2 text-muted-foreground hover-glow cursor-pointer">
            <span className="tech-text text-xs">SCROLL</span>
            <ArrowDown className="w-4 h-4 animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
