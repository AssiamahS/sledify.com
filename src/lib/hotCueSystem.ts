// Hot Cue System for SlyDecks
// Supports keyboard shortcuts and visual feedback

export interface HotCue {
  index: number;
  time: number; // Position in seconds
  color: string;
  label?: string;
}

export interface DeckHotCues {
  A: (HotCue | null)[];
  B: (HotCue | null)[];
}

// Default hot cue colors (matching Serato style)
export const HOT_CUE_COLORS = [
  '#ef4444', // Red
  '#f97316', // Orange
  '#eab308', // Yellow
  '#22c55e', // Green
  '#3b82f6', // Blue
  '#8b5cf6', // Purple
  '#ec4899', // Pink
  '#06b6d4', // Cyan
];

class HotCueSystem {
  private hotCues: DeckHotCues = {
    A: [null, null, null, null],
    B: [null, null, null, null],
  };
  
  private listeners: Set<(hotCues: DeckHotCues) => void> = new Set();

  // Set a hot cue at the current playback position
  setCue(deck: 'A' | 'B', index: number, time: number): HotCue {
    const cue: HotCue = {
      index,
      time,
      color: HOT_CUE_COLORS[index % HOT_CUE_COLORS.length],
    };
    
    this.hotCues[deck][index] = cue;
    this.notifyListeners();
    
    console.log(`Set Deck ${deck} Cue ${index + 1} at ${time.toFixed(2)}s`);
    return cue;
  }

  // Get a hot cue
  getCue(deck: 'A' | 'B', index: number): HotCue | null {
    return this.hotCues[deck][index] || null;
  }

  // Get all hot cues for a deck
  getDeckCues(deck: 'A' | 'B'): (HotCue | null)[] {
    return [...this.hotCues[deck]];
  }

  // Clear a hot cue
  clearCue(deck: 'A' | 'B', index: number): void {
    this.hotCues[deck][index] = null;
    this.notifyListeners();
    console.log(`Cleared Deck ${deck} Cue ${index + 1}`);
  }

  // Clear all hot cues for a deck
  clearAllCues(deck: 'A' | 'B'): void {
    this.hotCues[deck] = [null, null, null, null];
    this.notifyListeners();
  }

  // Load hot cues (e.g., from Serato metadata)
  loadCues(deck: 'A' | 'B', cues: (HotCue | null)[]): void {
    this.hotCues[deck] = cues.slice(0, 4).map((cue, i) => 
      cue ? { ...cue, color: cue.color || HOT_CUE_COLORS[i] } : null
    );
    // Pad with nulls if needed
    while (this.hotCues[deck].length < 4) {
      this.hotCues[deck].push(null);
    }
    this.notifyListeners();
  }

  // Subscribe to hot cue changes
  subscribe(callback: (hotCues: DeckHotCues) => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private notifyListeners(): void {
    this.listeners.forEach(cb => cb(this.hotCues));
  }

  // Get all hot cues
  getAllCues(): DeckHotCues {
    return {
      A: [...this.hotCues.A],
      B: [...this.hotCues.B],
    };
  }
}

// Singleton
export const hotCueSystem = new HotCueSystem();
export default hotCueSystem;
