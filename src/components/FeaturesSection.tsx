import { Shield, Zap, Globe, Clock } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Lightning Fast",
      description: "Same-day delivery powered by autonomous sleds reaching speeds of 80 km/h.",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure Transit",
      description: "Military-grade encryption and biometric locks protect every package.",
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Global Network",
      description: "Operating across 50+ cities with real-time cross-continental routing.",
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "24/7 Operations",
      description: "Autonomous fleet operates around the clock, rain or shine.",
    },
  ];

  return (
    <section className="py-20 md:py-32 relative" id="fleet">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="hero-subheading mb-4">CAPABILITIES</p>
          <h2 className="text-3xl md:text-5xl font-extralight">
            Engineered for Excellence
          </h2>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="glass rounded-2xl p-8 transition-all duration-500 hover:scale-105 hover:glow-primary group fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Icon */}
              <div className="text-primary mb-6 transition-all duration-300 group-hover:scale-110">
                {feature.icon}
              </div>

              {/* Title */}
              <h3 className="text-xl font-medium mb-3 group-hover:glow-text transition-all duration-300">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
