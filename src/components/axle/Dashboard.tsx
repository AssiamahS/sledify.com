import { TrendingUp, TrendingDown, Truck, Fuel, Clock, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: React.ElementType;
}

const StatCard = ({ title, value, change, trend, icon: Icon }: StatCardProps) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">
        {title}
      </CardTitle>
      <Icon className="w-4 h-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <div className={`flex items-center text-xs mt-1 ${
        trend === "up" ? "text-green-500" : "text-red-500"
      }`}>
        {trend === "up" ? (
          <TrendingUp className="w-3 h-3 mr-1" />
        ) : (
          <TrendingDown className="w-3 h-3 mr-1" />
        )}
        {change} from last month
      </div>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const stats: StatCardProps[] = [
    {
      title: "Total Vehicles",
      value: "248",
      change: "+12%",
      trend: "up",
      icon: Truck,
    },
    {
      title: "Fuel Efficiency",
      value: "7.2 MPG",
      change: "+8%",
      trend: "up",
      icon: Fuel,
    },
    {
      title: "Avg. Drive Time",
      value: "6.4 hrs",
      change: "-5%",
      trend: "down",
      icon: Clock,
    },
    {
      title: "Monthly Savings",
      value: "$42,500",
      change: "+18%",
      trend: "up",
      icon: DollarSign,
    },
  ];

  return (
    <section id="analytics" className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Fleet Analytics Dashboard
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Get actionable insights from your fleet data to optimize operations
            and reduce costs.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
