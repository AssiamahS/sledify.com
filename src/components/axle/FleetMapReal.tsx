import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  Truck,
  Navigation,
  Fuel,
  Clock,
  AlertTriangle,
  Maximize2,
  Layers,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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
  route?: [number, number][];
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
    lat: 37.5407,
    lng: -77.4360,
    route: [[37.5407, -77.4360], [38.9072, -77.0369], [39.2904, -76.6122]],
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
    lat: 36.1627,
    lng: -86.7816,
    route: [[36.1627, -86.7816], [35.1495, -90.0490], [34.7465, -92.2896]],
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
    lat: 35.2271,
    lng: -80.8431,
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
    lat: 33.7490,
    lng: -84.3880,
    route: [[33.7490, -84.3880], [32.0809, -81.0912], [30.3322, -81.6557]],
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
    lat: 30.3322,
    lng: -81.6557,
  },
];

// Custom truck icon
const createTruckIcon = (status: Vehicle["status"]) => {
  const color = status === "active" ? "#22c55e" : status === "idle" ? "#eab308" : status === "maintenance" ? "#f97316" : "#ef4444";
  return L.divIcon({
    className: "custom-truck-icon",
    html: `
      <div style="
        width: 36px;
        height: 36px;
        background: ${color};
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 3px solid white;
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
      ">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
          <path d="M1 3h15v13H1z"/><path d="m16 8 4 4v4h-3"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
        </svg>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });
};

// Map center controller
const MapController = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, map.getZoom());
  }, [center, map]);
  return null;
};

const FleetMapReal = () => {
  const [vehicles, setVehicles] = useState(mockVehicles);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([35.5, -82]);
  const [mapStyle, setMapStyle] = useState<"streets" | "satellite">("streets");

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setVehicles((prev) =>
        prev.map((v) => ({
          ...v,
          speed: v.status === "active" ? Math.max(45, Math.min(70, v.speed + (Math.random() - 0.5) * 4)) : v.speed,
          fuel: v.status === "active" ? Math.max(0, v.fuel - Math.random() * 0.1) : v.fuel,
          lat: v.status === "active" ? v.lat + (Math.random() - 0.5) * 0.01 : v.lat,
          lng: v.status === "active" ? v.lng + (Math.random() - 0.5) * 0.01 : v.lng,
        }))
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

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

  const tileUrl = mapStyle === "streets" 
    ? "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    : "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";

  return (
    <section id="tracking" className="py-16 md:py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Live Fleet Tracking</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Monitor your entire fleet in real-time with GPS tracking, driver status, and vehicle telemetry.
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
          {/* Real Map */}
          <Card className="lg:col-span-2 overflow-hidden">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Navigation className="w-5 h-5 text-primary" />
                Fleet Map
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setMapStyle(mapStyle === "streets" ? "satellite" : "streets")}
                >
                  <Layers className="w-4 h-4 mr-1" />
                  {mapStyle === "streets" ? "Satellite" : "Streets"}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[500px] relative">
                <MapContainer
                  center={mapCenter}
                  zoom={6}
                  style={{ height: "100%", width: "100%" }}
                  className="z-0"
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url={tileUrl}
                  />
                  <MapController center={mapCenter} />
                  
                  {/* Vehicle Markers */}
                  {vehicles.map((vehicle) => (
                    <Marker
                      key={vehicle.id}
                      position={[vehicle.lat, vehicle.lng]}
                      icon={createTruckIcon(vehicle.status)}
                      eventHandlers={{
                        click: () => {
                          setSelectedVehicle(vehicle);
                          setMapCenter([vehicle.lat, vehicle.lng]);
                        },
                      }}
                    >
                      <Popup>
                        <div className="p-2 min-w-[200px]">
                          <div className="font-bold text-lg">{vehicle.id}</div>
                          <div className="text-sm text-gray-600 mb-2">{vehicle.name}</div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>Driver:</div>
                            <div className="font-medium">{vehicle.driver}</div>
                            <div>Speed:</div>
                            <div className="font-medium">{vehicle.speed.toFixed(0)} mph</div>
                            <div>Fuel:</div>
                            <div className="font-medium">{vehicle.fuel.toFixed(0)}%</div>
                            <div>ETA:</div>
                            <div className="font-medium">{vehicle.eta}</div>
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  ))}

                  {/* Route Lines */}
                  {vehicles
                    .filter((v) => v.route)
                    .map((vehicle) => (
                      <Polyline
                        key={`route-${vehicle.id}`}
                        positions={vehicle.route as [number, number][]}
                        color={vehicle.status === "active" ? "#3b82f6" : "#6b7280"}
                        weight={3}
                        opacity={0.7}
                        dashArray={vehicle.status === "active" ? undefined : "10, 10"}
                      />
                    ))}
                </MapContainer>
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
              <div className="divide-y divide-border max-h-[500px] overflow-y-auto">
                {vehicles.map((vehicle) => (
                  <button
                    key={vehicle.id}
                    className={`w-full p-4 text-left hover:bg-muted/50 transition-colors ${
                      selectedVehicle?.id === vehicle.id ? "bg-muted" : ""
                    }`}
                    onClick={() => {
                      setSelectedVehicle(vehicle);
                      setMapCenter([vehicle.lat, vehicle.lng]);
                    }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-medium">{vehicle.id}</div>
                        <div className="text-sm text-muted-foreground">{vehicle.driver}</div>
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
                    {vehicle.fuel < 40 && (
                      <div className="flex items-center gap-1 mt-2 text-xs text-yellow-500">
                        <AlertTriangle className="w-3 h-3" />
                        Low fuel warning
                      </div>
                    )}
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
                <span>{selectedVehicle.id} - {selectedVehicle.name}</span>
                {getStatusBadge(selectedVehicle.status)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-5 gap-6">
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
                  <div className="text-sm text-muted-foreground mb-1">Coordinates</div>
                  <div className="font-medium text-sm">{selectedVehicle.lat.toFixed(4)}, {selectedVehicle.lng.toFixed(4)}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Fuel Level</div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          selectedVehicle.fuel > 50 ? "bg-green-500" : selectedVehicle.fuel > 25 ? "bg-yellow-500" : "bg-red-500"
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

export default FleetMapReal;
