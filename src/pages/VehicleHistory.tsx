import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Search, Truck, Calendar, MapPin, Fuel, Wrench, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface HistoryEvent {
  id: string;
  date: string;
  type: "trip" | "maintenance" | "fuel" | "incident";
  description: string;
  details: string;
  cost?: number;
}

interface Vehicle {
  id: string;
  name: string;
  status: "active" | "idle" | "maintenance";
  mileage: number;
  lastService: string;
  history: HistoryEvent[];
}

const mockVehicles: Vehicle[] = [
  {
    id: "TRK-001",
    name: "Freightliner Cascadia",
    status: "active",
    mileage: 245680,
    lastService: "2026-01-10",
    history: [
      { id: "1", date: "2026-01-15", type: "trip", description: "Delivery completed", details: "Richmond VA → Baltimore MD (156 mi)" },
      { id: "2", date: "2026-01-14", type: "fuel", description: "Refueling", details: "85 gallons at $3.89/gal", cost: 330.65 },
      { id: "3", date: "2026-01-10", type: "maintenance", description: "Oil change", details: "Regular maintenance - 10,000 mile service", cost: 425 },
      { id: "4", date: "2026-01-08", type: "trip", description: "Delivery completed", details: "Atlanta GA → Richmond VA (532 mi)" },
      { id: "5", date: "2026-01-05", type: "incident", description: "Minor delay", details: "Traffic congestion on I-95, 45 min delay" },
    ],
  },
  {
    id: "TRK-002",
    name: "Peterbilt 579",
    status: "active",
    mileage: 189450,
    lastService: "2026-01-05",
    history: [
      { id: "1", date: "2026-01-15", type: "trip", description: "In transit", details: "Nashville TN → Little Rock AR (320 mi)" },
      { id: "2", date: "2026-01-12", type: "fuel", description: "Refueling", details: "72 gallons at $3.85/gal", cost: 277.20 },
      { id: "3", date: "2026-01-05", type: "maintenance", description: "Brake inspection", details: "Routine brake check - all clear", cost: 150 },
    ],
  },
  {
    id: "TRK-005",
    name: "Mack Anthem",
    status: "maintenance",
    mileage: 312890,
    lastService: "2026-01-15",
    history: [
      { id: "1", date: "2026-01-15", type: "maintenance", description: "Engine repair", details: "Turbo replacement - in progress", cost: 2850 },
      { id: "2", date: "2026-01-10", type: "incident", description: "Breakdown", details: "Engine warning light - towed to service center" },
      { id: "3", date: "2026-01-08", type: "trip", description: "Delivery completed", details: "Miami FL → Jacksonville FL (340 mi)" },
    ],
  },
];

const VehicleHistory = () => {
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle>(mockVehicles[0]);
  const [filterType, setFilterType] = useState<string>("all");

  const getEventIcon = (type: HistoryEvent["type"]) => {
    switch (type) {
      case "trip": return <MapPin className="w-4 h-4 text-green-500" />;
      case "fuel": return <Fuel className="w-4 h-4 text-blue-500" />;
      case "maintenance": return <Wrench className="w-4 h-4 text-orange-500" />;
      case "incident": return <AlertTriangle className="w-4 h-4 text-red-500" />;
    }
  };

  const getEventBadge = (type: HistoryEvent["type"]) => {
    switch (type) {
      case "trip": return <Badge className="bg-green-500/20 text-green-400">Trip</Badge>;
      case "fuel": return <Badge className="bg-blue-500/20 text-blue-400">Fuel</Badge>;
      case "maintenance": return <Badge className="bg-orange-500/20 text-orange-400">Maintenance</Badge>;
      case "incident": return <Badge className="bg-red-500/20 text-red-400">Incident</Badge>;
    }
  };

  const filteredHistory = filterType === "all" 
    ? selectedVehicle.history 
    : selectedVehicle.history.filter((e) => e.type === filterType);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/"><Button variant="ghost" size="icon"><ArrowLeft className="w-5 h-5" /></Button></Link>
          <div>
            <h1 className="text-3xl font-bold">Vehicle History</h1>
            <p className="text-muted-foreground">Track maintenance, trips, and events</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Vehicle Selector */}
          <Card className="lg:col-span-1">
            <CardHeader><CardTitle className="flex items-center gap-2"><Truck className="w-5 h-5" />Vehicles</CardTitle></CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {mockVehicles.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVehicle(v)}
                    className={`w-full p-4 text-left hover:bg-muted/50 transition-colors ${selectedVehicle.id === v.id ? "bg-muted" : ""}`}
                  >
                    <div className="font-medium">{v.id}</div>
                    <div className="text-sm text-muted-foreground">{v.name}</div>
                    <div className="text-xs text-muted-foreground mt-1">{v.mileage.toLocaleString()} miles</div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Vehicle Details & History */}
          <div className="lg:col-span-3 space-y-6">
            {/* Vehicle Summary */}
            <Card>
              <CardHeader>
                <CardTitle>{selectedVehicle.id} - {selectedVehicle.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div><div className="text-sm text-muted-foreground">Status</div><Badge className={selectedVehicle.status === "active" ? "bg-green-500/20 text-green-400" : "bg-orange-500/20 text-orange-400"}>{selectedVehicle.status}</Badge></div>
                  <div><div className="text-sm text-muted-foreground">Mileage</div><div className="font-medium">{selectedVehicle.mileage.toLocaleString()} mi</div></div>
                  <div><div className="text-sm text-muted-foreground">Last Service</div><div className="font-medium">{selectedVehicle.lastService}</div></div>
                  <div><div className="text-sm text-muted-foreground">Total Events</div><div className="font-medium">{selectedVehicle.history.length}</div></div>
                </div>
              </CardContent>
            </Card>

            {/* History Table */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2"><Calendar className="w-5 h-5" />Event History</CardTitle>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-[150px]"><SelectValue placeholder="Filter" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Events</SelectItem>
                    <SelectItem value="trip">Trips</SelectItem>
                    <SelectItem value="fuel">Fuel</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="incident">Incidents</SelectItem>
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Details</TableHead>
                      <TableHead className="text-right">Cost</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredHistory.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell className="font-medium">{event.date}</TableCell>
                        <TableCell>{getEventBadge(event.type)}</TableCell>
                        <TableCell>{event.description}</TableCell>
                        <TableCell className="text-muted-foreground">{event.details}</TableCell>
                        <TableCell className="text-right">{event.cost ? `$${event.cost.toFixed(2)}` : "-"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleHistory;
