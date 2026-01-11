import { CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";

interface Stage {
  id: number;
  label: string;
  sublabel: string;
  icon: React.ReactNode;
  status: "completed" | "active" | "locked";
}

const ProgressTracker = () => {
  const [hoveredStage, setHoveredStage] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };
  
  const stages: Stage[] = [
    {
      id: 1,
      label: "Order Confirmed",
      sublabel: "PROCESSING COMPLETE",
      icon: <img src="/OIG9.jpeg" alt="Order Confirmed" className="w-10 h-10 rounded-lg object-cover" />,
      status: "completed",
    },
    {
      id: 2,
      label: "In Motion",
      sublabel: "SLED EN ROUTE",
      icon: <img src="/OIG2.jpeg" alt="In Motion" className="w-10 h-10 rounded-lg object-cover" />,
      status: "active",
    },
    {
      id: 3,
      label: "Delivered",
      sublabel: "AWAITING ARRIVAL",
      icon: <CheckCircle2 className="w-6 h-6" />,
      status: "locked",
    },
  ];

  const getStageStyles = (stage: Stage, isHovered: boolean) => {
    const base = "relative flex flex-col items-center transition-all duration-500";
    
    switch (stage.status) {
      case "completed":
        return `${base} text-primary`;
      case "active":
        return `${base} text-primary ${isHovered ? '' : 'pulse-glow'}`;
      case "locked":
        return `${base} text-muted-foreground/40`;
      default:
        return base;
    }
  };

  const getIconContainerStyles = (stage: Stage, isHovered: boolean) => {
    const base = "w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center transition-all duration-500 relative z-10";
    
    switch (stage.status) {
      case "completed":
        return `${base} bg-primary/20 border-2 border-primary glow-primary`;
      case "active":
        return `${base} bg-primary/30 border-2 border-primary pulse-glow ${isHovered ? 'scale-110' : ''}`;
      case "locked":
        return `${base} bg-muted/30 border border-border/50`;
      default:
        return base;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <div className="glass-strong rounded-3xl p-8 md:p-12 float">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="hero-subheading mb-2">LIVE TRACKING</p>
          <h3 className="text-2xl md:text-3xl font-light">Shipment #SLD-2847X</h3>
        </div>

        {/* Progress Bar Background */}
        <div className="relative">
          {/* Connection Line */}
          <div className="absolute top-8 md:top-10 left-[15%] right-[15%] h-1 bg-muted/30 rounded-full" />
          
          {/* Completed Progress */}
          <div className="absolute top-8 md:top-10 left-[15%] h-1 bg-gradient-to-r from-primary to-primary/80 rounded-full progress-glow"
               style={{ width: '35%' }} />
          
          {/* Active Glow Point */}
          <div className="absolute top-8 md:top-10 left-[50%] -translate-x-1/2 w-3 h-3 rounded-full bg-primary pulse-glow" />

          {/* Stages */}
          <div className="relative flex justify-between items-start">
            {stages.map((stage, index) => {
              const isHovered = hoveredStage === stage.id;
              
              return (
                <div
                  key={stage.id}
                  className={getStageStyles(stage, isHovered)}
                  onMouseEnter={() => setHoveredStage(stage.id)}
                  onMouseLeave={() => setHoveredStage(null)}
                >
                  {/* Icon Container */}
                  <div className={getIconContainerStyles(stage, isHovered)}>
                    <div className={stage.status === "active" && isHovered ? "vibrate" : ""}>
                      {stage.icon}
                    </div>
                    
                    {/* Active Pulse Ring */}
                    {stage.status === "active" && (
                      <div className="absolute inset-0 rounded-2xl border-2 border-primary animate-ping opacity-20" />
                    )}
                  </div>

                  {/* Labels */}
                  <div className="mt-4 text-center">
                    <p className={`font-medium text-sm md:text-base transition-all duration-300 ${
                      stage.status === "active" && isHovered ? "glow-text" : ""
                    }`}>
                      {stage.label}
                    </p>
                    <p className="tech-text mt-1 text-[10px] md:text-xs">
                      {stage.sublabel}
                    </p>
                  </div>

                  {/* Stage Number */}
                  <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                    ${stage.status === "completed" ? "bg-primary text-primary-foreground" : 
                      stage.status === "active" ? "bg-primary text-primary-foreground pulse-glow" : 
                      "bg-muted text-muted-foreground"}`}>
                    {stage.id}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ETA */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground text-sm">Current Time</p>
          <p className="text-2xl md:text-3xl font-light mt-1 glow-text">Today, {formatTime(currentTime)}</p>
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;
