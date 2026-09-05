import { useState } from "react";
import { Link } from "react-router-dom";
import { User, Phone, Mail, Star, Truck, Clock, ArrowLeft, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: "available" | "driving" | "off-duty";
  rating: number;
  trips: number;
  hours: number;
  vehicle: string | null;
}

const mockDrivers: Driver[] = [
  { id: "DRV-001", name: "John Smith", email: "john.smith@axletruck.com", phone: "(555) 123-4567", status: "driving", rating: 4.9, trips: 342, hours: 1240, vehicle: "TRK-001" },
  { id: "DRV-002", name: "Maria Garcia", email: "maria.garcia@axletruck.com", phone: "(555) 234-5678", status: "driving", rating: 4.8, trips: 298, hours: 1180, vehicle: "TRK-002" },
  { id: "DRV-003", name: "Mike Johnson", email: "mike.johnson@axletruck.com", phone: "(555) 345-6789", status: "off-duty", rating: 4.7, trips: 256, hours: 980, vehicle: null },
  { id: "DRV-004", name: "Sarah Wilson", email: "sarah.wilson@axletruck.com", phone: "(555) 456-7890", status: "driving", rating: 4.9, trips: 412, hours: 1560, vehicle: "TRK-004" },
  { id: "DRV-005", name: "David Brown", email: "david.brown@axletruck.com", phone: "(555) 567-8901", status: "available", rating: 4.6, trips: 189, hours: 720, vehicle: null },
  { id: "DRV-006", name: "Emily Davis", email: "emily.davis@axletruck.com", phone: "(555) 678-9012", status: "available", rating: 4.8, trips: 267, hours: 1020, vehicle: null },
];

const Drivers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const filteredDrivers = mockDrivers.filter((d) =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: Driver["status"]) => {
    switch (status) {
      case "driving":
        return <Badge className="bg-green-500/20 text-green-400">Driving</Badge>;
      case "available":
        return <Badge className="bg-blue-500/20 text-blue-400">Available</Badge>;
      case "off-duty":
        return <Badge className="bg-gray-500/20 text-gray-400">Off Duty</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/">
            <Button variant="ghost" size="icon"><ArrowLeft className="w-5 h-5" /></Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Driver Management</h1>
            <p className="text-muted-foreground">Manage and monitor your fleet drivers</p>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search drivers..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <Button>Add Driver</Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDrivers.map((driver) => (
            <Card key={driver.id} className="hover:border-primary/50 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-primary/20 text-primary">{driver.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{driver.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{driver.id}</p>
                    </div>
                  </div>
                  {getStatusBadge(driver.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm"><Mail className="w-4 h-4 text-muted-foreground" />{driver.email}</div>
                <div className="flex items-center gap-2 text-sm"><Phone className="w-4 h-4 text-muted-foreground" />{driver.phone}</div>
                {driver.vehicle && <div className="flex items-center gap-2 text-sm"><Truck className="w-4 h-4 text-muted-foreground" />Assigned: {driver.vehicle}</div>}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                  <div className="text-center"><div className="flex items-center justify-center gap-1 text-yellow-500"><Star className="w-4 h-4 fill-current" />{driver.rating}</div><p className="text-xs text-muted-foreground">Rating</p></div>
                  <div className="text-center"><div className="font-semibold">{driver.trips}</div><p className="text-xs text-muted-foreground">Trips</p></div>
                  <div className="text-center"><div className="font-semibold">{driver.hours}h</div><p className="text-xs text-muted-foreground">Hours</p></div>
                </div>
                <Button variant="outline" className="w-full">View Details</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Drivers;
