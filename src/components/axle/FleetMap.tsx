import { useState, useEffect } from "react";
import {
  Truck,
  MapPin,
  Navigation,
  Fuel,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Vehicle {
  id: string;
  name: string;
  driver: string;
  status: "active" | "idle" | "maintenance" | "offline";
  location: string;
  speed: number;
  fuel: number;
  eta: string;
  lat: number;
  lng: number;
}

const mockVehicles: Vehicle[] = [
  {
    id: "TRK-001",
    name: "Freightliner Cascadia",
    driver: "John Smith",
    status: "active",
    location: "I-95 North, Richmond VA",
    speed: 62,
    fuel: 78,
    eta: "2h 15m",
    lat: 37.5,
    lng: -77.4,
  },
  {
    id: "TRK-002",
    name: "Peterbilt 579",
    driver: "Maria Garcia",
    status: "active",
    location: "I-40 West, Nashville TN",
    speed: 58,
    fuel: 45,
    eta: "4h 30m",
    lat: 36.1,
    lng: -86.7,
  },
  {
    id: "TRK-003",
    name: "Kenworth T680",
    driver: "Mike Johnson",
    status: "idle",
    location: "Truck Stop, Charlotte NC",
    speed: 0,
    fuel: 92,
    eta: "On Break",
    lat: 35.2,
    lng: -80.8,
  },
  {
    id: "TRK-004",
    name: "Volvo VNL 860",
    driver: "Sarah Wilson",
    status: "active",
    location: "I-75 South, Atlanta GA",
    speed: 55,
    fuel: 34,
    eta: "1h 45m",
    lat: 33.7,
    lng: -84.3,
  },
  {
    id: "TRK-005",
    name: "Mack Anthem",
    driver: "David Brown",
    status: "maintenance",
    location: "Service Center, Jacksonville FL",
    speed: 0,
    fuel: 60,
    eta: "N/A",
    lat: 30.3,
    lng: -81.6,
  },
];

const FleetMap = () => {
  const [vehicles, setVehicles] = useState(mockVehicles);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setVehicles((prev) =>
        prev.map((v) => ({
          ...v,
          speed:
            v.status === "active"
              ? Math.max(45, Math.min(70, v.speed + (Math.random() - 0.5) * 4))
              : v.speed,
          fuel:
            v.status === "active"
              ? Math.max(0, v.fuel - Math.random() * 0.1)
              : v.fuel,
        }))
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: Vehicle["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "idle":
        return "bg-yellow-500";
      case "maintenance":
        return "bg-orange-500";
      case "offline":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusBadge = (status: Vehicle["status"]) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Active</Badge>;
      case "idle":
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Idle</Badge>;
      case "maintenance":
        return <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">Maintenance</Badge>;
      case "offline":
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Offline</Badge>;
      default:
        return null;
    }
  };

  const activeCount = vehicles.filter((v) => v.status === "active").length;
  const idleCount = vehicles.filter((v) => v.status === "idle").length;
  const maintenanceCount = vehicles.filter((v) => v.status === "maintenance").length;

  return (
    <section id="tracking" className="py-16 md:py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Live Fleet Tracking
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Monitor your entire fleet in real-time with GPS tracking, driver
            status, and vehicle telemetry.
          </p>
        </div>

        {/* Fleet Summary */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card className="bg-green-500/10 border-green-500/20">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-green-400">{activeCount}</div>
              <div className="text-sm text-muted-foreground">Active</div>
            </CardContent>
          </Card>
          <Card className="bg-yellow-500/10 border-yellow-500/20">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-yellow-400">{idleCount}</div>
              <div className="text-sm text-muted-foreground">Idle</div>
            </CardContent>
          </Card>
          <Card className="bg-orange-500/10 border-orange-500/20">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-orange-400">{maintenanceCount}</div>
              <div className="text-sm text-muted-foreground">Maintenance</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Map Visualization */}
          <Card className="lg:col-span-2 overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Fleet Map
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {/* Simulated Map */}
              <div className="relative h-[400px] bg-gradient-to-br from-slate-900 to-slate-800 overflow-hidden">
                {/* Grid Pattern */}
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage: `
                      linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                    `,
                    backgroundSize: "50px 50px",
                  }}
                />

                {/* Route Lines */}
                <svg className="absolute inset-0 w-full h-full">
                  <path
                    d="M 100 100 Q 200 150, 300 200 T 500 300"
                    stroke="rgba(59, 130, 246, 0.5)"
                    strokeWidth="3"
                    strokeDasharray="10,5"
                    fill="none"
                  />
                  <path
                    d="M 150 350 Q 250 300, 400 250 T 600 150"
                    stroke="rgba(59, 130, 246, 0.5)"
                    strokeWidth="3"
                    strokeDasharray="10,5"
                    fill="none"
                  />
                </svg>

                {/* Vehicle Markers */}
                {vehicles.map((vehicle, index) => (
                  <button
                    key={vehicle.id}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
                      selectedVehicle?.id === vehicle.id ? "scale-125 z-10" : ""
                    }`}
                    style={{
                      left: `${15 + index * 18}%`,
                      top: `${20 + (index % 3) * 25}%`,
                    }}
                    onClick={() => setSelectedVehicle(vehicle)}
                  >
                    <div className="relative">
                      <div
                        className={`w-10 h-10 rounded-full ${getStatusColor(
                          vehicle.status
                        )} flex items-center justify-center shadow-lg`}
                      >
                        <Truck className="w-5 h-5 text-white" />
                      </div>
                      {vehicle.status === "active" && (
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping" />
                      )}
                      {vehicle.fuel < 40 && (
                        <AlertTriangle className="absolute -bottom-1 -right-1 w-4 h-4 text-yellow-400" />
                      )}
                    </div>
                    <div className="mt-1 px-2 py-1 bg-background/90 rounded text-xs font-medium whitespace-nowrap">
                      {vehicle.id}
                    </div>
                  </button>
                ))}

                {/* Map Legend */}
                <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm rounded-lg p-3">
                  <div className="text-xs font-medium mb-2">Legend</div>
                  <div className="flex flex-col gap-1.5 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-green-500" />
                      <span>Active</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-yellow-500" />
                      <span>Idle</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-orange-500" />
                      <span>Maintenance</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vehicle List */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-primary" />
                Vehicles
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border max-h-[400px] overflow-y-auto">
                {vehicles.map((vehicle) => (
                  <button
                    key={vehicle.id}
                    className={`w-full p-4 text-left hover:bg-muted/50 transition-colors ${
                      selectedVehicle?.id === vehicle.id ? "bg-muted" : ""
                    }`}
                    onClick={() => setSelectedVehicle(vehicle)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-medium">{vehicle.id}</div>
                        <div className="text-sm text-muted-foreground">
                          {vehicle.driver}
                        </div>
                      </div>
                      {getStatusBadge(vehicle.status)}
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Navigation className="w-3 h-3" />
                        {vehicle.speed.toFixed(0)} mph
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Fuel className="w-3 h-3" />
                        {vehicle.fuel.toFixed(0)}%
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {vehicle.eta}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Selected Vehicle Details */}
        {selectedVehicle && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>
                  {selectedVehicle.id} - {selectedVehicle.name}
                </span>
                {getStatusBadge(selectedVehicle.status)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-6">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Driver</div>
                  <div className="font-medium">{selectedVehicle.driver}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Location</div>
                  <div className="font-medium">{selectedVehicle.location}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Speed</div>
                  <div className="font-medium">{selectedVehicle.speed.toFixed(0)} mph</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Fuel Level</div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          selectedVehicle.fuel > 50
                            ? "bg-green-500"
                            : selectedVehicle.fuel > 25
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                        style={{ width: `${selectedVehicle.fuel}%` }}
                      />
                    </div>
                    <span className="font-medium">{selectedVehicle.fuel.toFixed(0)}%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
};

export default FleetMap;
