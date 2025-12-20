import { useState, useEffect } from "react";
import { Battery, Gauge, Mountain, Thermometer } from "lucide-react";

interface TelemetryData {
  battery: number;
  velocity: number;
  altitude: number;
  temp: number;
}

const TelemetryPanel = () => {
  const [data, setData] = useState<TelemetryData>({
    battery: 87,
    velocity: 42,
    altitude: 156,
    temp: 22,
  });

  // Simulate live data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => ({
        battery: Math.max(0, Math.min(100, prev.battery + (Math.random() - 0.5) * 2)),
        velocity: Math.max(0, Math.min(80, prev.velocity + (Math.random() - 0.5) * 8)),
        altitude: Math.max(0, Math.min(500, prev.altitude + (Math.random() - 0.5) * 10)),
        temp: Math.max(15, Math.min(35, prev.temp + (Math.random() - 0.5) * 2)),
      }));
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  const telemetryItems = [
    {
      label: "BATTERY",
      value: `${Math.round(data.battery)}%`,
      icon: <Battery className="w-5 h-5" />,
      color: data.battery > 50 ? "text-accent" : data.battery > 20 ? "text-primary" : "text-destructive",
    },
    {
      label: "VELOCITY",
      value: `${Math.round(data.velocity)} km/h`,
      icon: <Gauge className="w-5 h-5" />,
      color: "text-primary",
    },
    {
      label: "ALTITUDE",
      value: `${Math.round(data.altitude)} m`,
      icon: <Mountain className="w-5 h-5" />,
      color: "text-primary",
    },
    {
      label: "TEMP",
      value: `${Math.round(data.temp)}°C`,
      icon: <Thermometer className="w-5 h-5" />,
      color: data.temp < 25 ? "text-primary" : "text-destructive",
    },
  ];

  return (
    <section className="py-20 md:py-32" id="technology">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16 fade-in-up">
          <p className="hero-subheading mb-4">REAL-TIME TELEMETRY</p>
          <h2 className="text-3xl md:text-5xl font-extralight">
            Live Sled Data
          </h2>
        </div>

        {/* Telemetry Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto">
          {telemetryItems.map((item, index) => (
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

        {/* Coordinates Display */}
        <div className="mt-12 text-center">
          <div className="glass inline-block rounded-xl px-8 py-4">
            <p className="tech-text text-muted-foreground mb-1">CURRENT COORDINATES</p>
            <p className="font-mono text-lg md:text-xl text-primary">
              37.7749° N, 122.4194° W
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TelemetryPanel;
