import { useState, useEffect } from "react";
import { Volume2, Music, Zap, Disc } from "lucide-react";

interface MixerData {
  masterVolume: number;
  bpm: number;
  crossfader: number;
  effects: number;
}

const MixerPanel = () => {
  const [data, setData] = useState<MixerData>({
    masterVolume: 85,
    bpm: 128,
    crossfader: 50,
    effects: 42,
  });

  // Simulate live mixing updates
  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => ({
        masterVolume: Math.max(0, Math.min(100, prev.masterVolume + (Math.random() - 0.5) * 5)),
        bpm: Math.max(80, Math.min(180, prev.bpm + (Math.random() - 0.5) * 2)),
        crossfader: Math.max(0, Math.min(100, prev.crossfader + (Math.random() - 0.5) * 10)),
        effects: Math.max(0, Math.min(100, prev.effects + (Math.random() - 0.5) * 8)),
      }));
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  const mixerItems = [
    {
      label: "MASTER VOL",
      value: `${Math.round(data.masterVolume)}%`,
      icon: <Volume2 className="w-5 h-5" />,
      color: data.masterVolume > 90 ? "text-destructive" : "text-accent",
    },
    {
      label: "BPM",
      value: `${Math.round(data.bpm)}`,
      icon: <Music className="w-5 h-5" />,
      color: "text-primary",
    },
    {
      label: "CROSSFADE",
      value: `${Math.round(data.crossfader)}%`,
      icon: <Disc className="w-5 h-5" />,
      color: "text-primary",
    },
    {
      label: "FX WET",
      value: `${Math.round(data.effects)}%`,
      icon: <Zap className="w-5 h-5" />,
      color: data.effects > 70 ? "text-accent" : "text-primary",
    },
  ];

  return (
    <section className="py-20 md:py-32" id="effects">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16 fade-in-up">
          <p className="hero-subheading mb-4">REAL-TIME MIXING</p>
          <h2 className="text-3xl md:text-5xl font-extralight">
            Live Mixer Controls
          </h2>
        </div>

        {/* Mixer Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto">
          {mixerItems.map((item, index) => (
            <div
              key={item.label}
              className={`glass rounded-2xl p-6 text-center transition-all duration-500 hover:scale-105 fade-in-up`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Icon */}
              <div className={`${item.color} mb-4 flex justify-center`}>
                {item.icon}
              </div>

              {/* Value */}
              <p className={`text-2xl md:text-3xl font-light ${item.color} transition-all duration-300`}>
                {item.value}
              </p>

              {/* Label */}
              <p className="tech-text mt-2 text-muted-foreground">
                {item.label}
              </p>

              {/* Live Indicator */}
              <div className="flex items-center justify-center gap-2 mt-4">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span className="tech-text text-accent text-[10px]">LIVE</span>
              </div>
            </div>
          ))}
        </div>

        {/* Now Playing Display */}
        <div className="mt-12 text-center">
          <div className="glass inline-block rounded-xl px-8 py-4">
            <p className="tech-text text-muted-foreground mb-1">NOW PLAYING</p>
            <p className="font-mono text-lg md:text-xl text-primary">
              Track A → Track B | Sync Lock: ON
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MixerPanel;
