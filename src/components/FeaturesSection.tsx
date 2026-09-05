import { Music, Sliders, Waves, Headphones } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: <Music className="w-8 h-8" />,
      title: "Dual Decks",
      description: "Load and control two tracks simultaneously with independent pitch and tempo controls.",
    },
    {
      icon: <Sliders className="w-8 h-8" />,
      title: "Crossfader",
      description: "Smooth transitions between tracks with a professional-grade crossfader and EQ controls.",
    },
    {
      icon: <Waves className="w-8 h-8" />,
      title: "Effects Library",
      description: "Apply reverb, delay, flanger, and more effects to create unique sounds.",
    },
    {
      icon: <Headphones className="w-8 h-8" />,
      title: "Cue System",
      description: "Preview tracks in your headphones before mixing them into the live output.",
    },
  ];

  return (
    <section className="py-20 md:py-32 relative" id="features">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="hero-subheading mb-4">MIXING FEATURES</p>
          <h2 className="text-3xl md:text-5xl font-extralight">
            Professional DJ Tools
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
