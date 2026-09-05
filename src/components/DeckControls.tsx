import { Play, Pause, SkipForward, Disc } from "lucide-react";
import { useState, useEffect } from "react";

interface Deck {
  id: number;
  label: string;
  track: string;
  bpm: number;
  status: "playing" | "paused" | "cued";
}

const DeckControls = () => {
  const [hoveredDeck, setHoveredDeck] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [deckA, setDeckA] = useState({ playing: true, position: 45 });
  const [deckB, setDeckB] = useState({ playing: false, position: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      if (deckA.playing) {
        setDeckA(prev => ({ ...prev, position: (prev.position + 1) % 100 }));
      }
      if (deckB.playing) {
        setDeckB(prev => ({ ...prev, position: (prev.position + 1) % 100 }));
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [deckA.playing, deckB.playing]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };
  
  const decks: Deck[] = [
    {
      id: 1,
      label: "Deck A",
      track: "Summer Vibes - DJ Snake",
      bpm: 128,
      status: deckA.playing ? "playing" : "paused",
    },
    {
      id: 2,
      label: "Crossfader",
      track: "50% Center",
      bpm: 0,
      status: "cued",
    },
    {
      id: 3,
      label: "Deck B",
      track: "Night Drive - Kavinsky",
      bpm: 126,
      status: deckB.playing ? "playing" : "paused",
    },
  ];

  const getDeckStyles = (deck: Deck, isHovered: boolean) => {
    const base = "relative flex flex-col items-center transition-all duration-500";
    
    switch (deck.status) {
      case "playing":
        return `${base} text-primary ${isHovered ? '' : 'pulse-glow'}`;
      case "paused":
        return `${base} text-muted-foreground`;
      case "cued":
        return `${base} text-accent`;
      default:
        return base;
    }
  };

  const getIconContainerStyles = (deck: Deck, isHovered: boolean) => {
    const base = "w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center transition-all duration-500 relative z-10 cursor-pointer";
    
    switch (deck.status) {
      case "playing":
        return `${base} bg-primary/30 border-2 border-primary pulse-glow ${isHovered ? 'scale-110' : ''}`;
      case "paused":
        return `${base} bg-muted/30 border border-border/50 ${isHovered ? 'scale-105 border-primary/50' : ''}`;
      case "cued":
        return `${base} bg-accent/20 border-2 border-accent`;
      default:
        return base;
    }
  };

  const toggleDeck = (deckId: number) => {
    if (deckId === 1) {
      setDeckA(prev => ({ ...prev, playing: !prev.playing }));
    } else if (deckId === 3) {
      setDeckB(prev => ({ ...prev, playing: !prev.playing }));
    }
  };

  const getDeckIcon = (deck: Deck) => {
    if (deck.id === 2) return <SkipForward className="w-6 h-6 rotate-90" />;
    return deck.status === "playing" ? 
      <Pause className="w-6 h-6" /> : 
      <Play className="w-6 h-6" />;
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <div className="glass-strong rounded-3xl p-8 md:p-12 float">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="hero-subheading mb-2">DUAL DECK CONTROL</p>
          <h3 className="text-2xl md:text-3xl font-light">Mix Station</h3>
        </div>

        {/* Progress Bar Background */}
        <div className="relative">
          {/* Connection Line */}
          <div className="absolute top-8 md:top-10 left-[15%] right-[15%] h-1 bg-muted/30 rounded-full" />
          
          {/* Deck A Progress */}
          <div className="absolute top-8 md:top-10 left-[15%] h-1 bg-gradient-to-r from-primary to-accent rounded-full progress-glow"
               style={{ width: `${deckA.position * 0.35}%` }} />
          
          {/* Crossfader Point */}
          <div className="absolute top-8 md:top-10 left-[50%] -translate-x-1/2 w-3 h-3 rounded-full bg-accent pulse-glow" />

          {/* Decks */}
          <div className="relative flex justify-between items-start">
            {decks.map((deck) => {
              const isHovered = hoveredDeck === deck.id;
              
              return (
                <div
                  key={deck.id}
                  className={getDeckStyles(deck, isHovered)}
                  onMouseEnter={() => setHoveredDeck(deck.id)}
                  onMouseLeave={() => setHoveredDeck(null)}
                  onClick={() => toggleDeck(deck.id)}
                >
                  {/* Icon Container */}
                  <div className={getIconContainerStyles(deck, isHovered)}>
                    <div className={deck.status === "playing" ? "animate-spin-slow" : ""}>
                      {deck.id !== 2 ? <Disc className="w-8 h-8" /> : getDeckIcon(deck)}
                    </div>
                    
                    {/* Playing Pulse Ring */}
                    {deck.status === "playing" && (
                      <div className="absolute inset-0 rounded-2xl border-2 border-primary animate-ping opacity-20" />
                    )}
                  </div>

                  {/* Labels */}
                  <div className="mt-4 text-center">
                    <p className={`font-medium text-sm md:text-base transition-all duration-300 ${
                      deck.status === "playing" && isHovered ? "glow-text" : ""
                    }`}>
                      {deck.label}
                    </p>
                    <p className="tech-text mt-1 text-[10px] md:text-xs truncate max-w-[100px]">
                      {deck.track}
                    </p>
                    {deck.bpm > 0 && (
                      <p className="tech-text mt-1 text-[10px] text-accent">
                        {deck.bpm} BPM
                      </p>
                    )}
                  </div>

                  {/* Status Badge */}
                  <div className={`absolute -top-2 -right-2 px-2 py-1 rounded-full flex items-center justify-center text-[10px] font-bold uppercase
                    ${deck.status === "playing" ? "bg-primary text-primary-foreground pulse-glow" : 
                      deck.status === "cued" ? "bg-accent text-accent-foreground" : 
                      "bg-muted text-muted-foreground"}`}>
                    {deck.status}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Session Time */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground text-sm">Session Time</p>
          <p className="text-2xl md:text-3xl font-light mt-1 glow-text">{formatTime(currentTime)}</p>
        </div>
      </div>
    </div>
  );
};

export default DeckControls;
