import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const fuelData = [
  { name: "Mon", consumption: 420, cost: 1680 },
  { name: "Tue", consumption: 380, cost: 1520 },
  { name: "Wed", consumption: 450, cost: 1800 },
  { name: "Thu", consumption: 390, cost: 1560 },
  { name: "Fri", consumption: 480, cost: 1920 },
  { name: "Sat", consumption: 320, cost: 1280 },
  { name: "Sun", consumption: 280, cost: 1120 },
];

const mileageData = [
  { name: "Week 1", miles: 12400 },
  { name: "Week 2", miles: 14200 },
  { name: "Week 3", miles: 11800 },
  { name: "Week 4", miles: 15600 },
];

const fleetStatusData = [
  { name: "Active", value: 42, color: "#22c55e" },
  { name: "Idle", value: 8, color: "#eab308" },
  { name: "Maintenance", value: 5, color: "#f97316" },
  { name: "Offline", value: 2, color: "#ef4444" },
];

const driverPerformance = [
  { name: "J. Smith", score: 94, trips: 28 },
  { name: "M. Garcia", score: 91, trips: 32 },
  { name: "M. Johnson", score: 88, trips: 25 },
  { name: "S. Wilson", score: 96, trips: 30 },
  { name: "D. Brown", score: 85, trips: 22 },
];

const AnalyticsCharts = () => {
  return (
    <section id="analytics" className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Fleet Analytics</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Comprehensive insights into your fleet performance, fuel consumption, and driver metrics.
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 max-w-md mx-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="fuel">Fuel</TabsTrigger>
            <TabsTrigger value="drivers">Drivers</TabsTrigger>
            <TabsTrigger value="routes">Routes</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Fleet Status Pie Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Fleet Status Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={fleetStatusData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}`}
                        >
                          {fleetStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex justify-center gap-4 mt-4">
                    {fleetStatusData.map((item) => (
                      <div key={item.name} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-sm">{item.name}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Weekly Mileage */}
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Mileage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={mileageData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="name" className="text-xs" />
                        <YAxis className="text-xs" />
                        <Tooltip
                          contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
                        />
                        <Bar dataKey="miles" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="fuel" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Fuel Consumption */}
              <Card>
                <CardHeader>
                  <CardTitle>Daily Fuel Consumption (Gallons)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={fuelData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="name" className="text-xs" />
                        <YAxis className="text-xs" />
                        <Tooltip
                          contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
                        />
                        <Area type="monotone" dataKey="consumption" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.3} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Fuel Cost */}
              <Card>
                <CardHeader>
                  <CardTitle>Daily Fuel Cost ($)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={fuelData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="name" className="text-xs" />
                        <YAxis className="text-xs" />
                        <Tooltip
                          contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
                          formatter={(value) => [`$${value}`, "Cost"]}
                        />
                        <Line type="monotone" dataKey="cost" stroke="#22c55e" strokeWidth={2} dot={{ fill: "#22c55e" }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="drivers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Driver Performance Scores</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={driverPerformance} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis type="number" domain={[0, 100]} className="text-xs" />
                      <YAxis dataKey="name" type="category" className="text-xs" width={80} />
                      <Tooltip
                        contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
                        formatter={(value, name) => [name === "score" ? `${value}%` : value, name === "score" ? "Safety Score" : "Total Trips"]}
                      />
                      <Bar dataKey="score" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="routes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Route Efficiency This Month</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                  <div>
                    <div className="text-3xl font-bold text-primary">847</div>
                    <div className="text-sm text-muted-foreground">Total Routes</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-green-500">94.2%</div>
                    <div className="text-sm text-muted-foreground">On-Time Delivery</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-yellow-500">12.4%</div>
                    <div className="text-sm text-muted-foreground">Route Optimization</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold">54,200</div>
                    <div className="text-sm text-muted-foreground">Miles Saved</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default AnalyticsCharts;
