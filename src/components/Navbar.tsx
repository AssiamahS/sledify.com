import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center glow-primary">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold tracking-tight">Sledify</span>
          </div>

          {/* Center Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#fleet" className="text-sm text-muted-foreground hover-glow hover:text-foreground transition-colors">
              Fleet
            </a>
            <a href="#technology" className="text-sm text-muted-foreground hover-glow hover:text-foreground transition-colors">
              Technology
            </a>
            <a href="#tracking" className="text-sm text-muted-foreground hover-glow hover:text-foreground transition-colors">
              Tracking
            </a>
          </div>

          {/* CTA Button */}
          <Button variant="nav" size="sm">
            Order Now
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
