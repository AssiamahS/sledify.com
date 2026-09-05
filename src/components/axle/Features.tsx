import { MapPin, BarChart3, Shield, Zap, Bell, Route } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: MapPin,
    title: "Real-Time GPS Tracking",
    description: "Track every vehicle in your fleet with precision GPS updates every 10 seconds.",
  },
  {
    icon: Route,
    title: "Route Optimization",
    description: "AI-powered route planning to reduce fuel costs and delivery times.",
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Comprehensive reports on driver behavior, fuel consumption, and fleet performance.",
  },
  {
    icon: Bell,
    title: "Smart Alerts",
    description: "Instant notifications for speeding, geofence breaches, and maintenance needs.",
  },
  {
    icon: Shield,
    title: "Driver Safety",
    description: "Monitor driving patterns and coach drivers to improve safety scores.",
  },
  {
    icon: Zap,
    title: "Fast Integration",
    description: "Connect with your existing systems via our REST API in minutes.",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-16 md:py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything You Need to Manage Your Fleet
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed for modern fleet operations.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Card key={feature.title} className="group hover:border-primary/50 transition-colors">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
