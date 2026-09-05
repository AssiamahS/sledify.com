import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Disc } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center glow-primary">
              <Disc className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold tracking-tight bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">SlyDecks</span>
          </Link>

          {/* Center Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#mixer" className="text-sm text-muted-foreground hover-glow hover:text-foreground transition-colors">
              Mixer
            </a>
            <a href="#effects" className="text-sm text-muted-foreground hover-glow hover:text-foreground transition-colors">
              Effects
            </a>
            <a href="#features" className="text-sm text-muted-foreground hover-glow hover:text-foreground transition-colors">
              Features
            </a>
          </div>

          {/* CTA Button */}
          <Link to="/studio">
            <Button variant="nav" size="sm" className="glow-primary">
              Launch Studio
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
