// Keyboard Controller for SlyDecks
// Maps keyboard keys to DJ actions

import audioEngine from './audioEngine';
import { hotCueSystem } from './hotCueSystem';

export type KeyAction = {
  key: string;
  action: string;
  deck?: 'A' | 'B';
  cueIndex?: number;
};

// Keyboard mapping
const KEY_MAPPINGS: KeyAction[] = [
  // Deck A Hot Cues: 1, 2, 3, 4
  { key: '1', action: 'hotcue', deck: 'A', cueIndex: 0 },
  { key: '2', action: 'hotcue', deck: 'A', cueIndex: 1 },
  { key: '3', action: 'hotcue', deck: 'A', cueIndex: 2 },
  { key: '4', action: 'hotcue', deck: 'A', cueIndex: 3 },
  
  // Deck B Hot Cues: 6, 7, 8, 9
  { key: '6', action: 'hotcue', deck: 'B', cueIndex: 0 },
  { key: '7', action: 'hotcue', deck: 'B', cueIndex: 1 },
  { key: '8', action: 'hotcue', deck: 'B', cueIndex: 2 },
  { key: '9', action: 'hotcue', deck: 'B', cueIndex: 3 },
  
  // Deck A Controls
  { key: 'q', action: 'play', deck: 'A' },
  { key: 'w', action: 'cue', deck: 'A' },
  { key: 'a', action: 'pitchDown', deck: 'A' },
  { key: 's', action: 'pitchUp', deck: 'A' },
  
  // Deck B Controls
  { key: 'p', action: 'play', deck: 'B' },
  { key: 'o', action: 'cue', deck: 'B' },
  { key: 'k', action: 'pitchDown', deck: 'B' },
  { key: 'l', action: 'pitchUp', deck: 'B' },
  
  // Crossfader: Z = full A, X = center, C = full B, V/B for nudge
  { key: 'z', action: 'crossfadeA' },
  { key: 'x', action: 'crossfadeCenter' },
  { key: 'c', action: 'crossfadeB' },
  { key: 'v', action: 'crossfadeNudgeLeft' },
  { key: 'b', action: 'crossfadeNudgeRight' },
  
  // Space = Play/Pause both decks (or last active)
  { key: ' ', action: 'masterPlay' },
];

export type KeyboardEventCallback = (action: string, deck?: 'A' | 'B', cueIndex?: number, isShiftHeld?: boolean) => void;

class KeyboardController {
  private callback: KeyboardEventCallback | null = null;
  private isEnabled = false;
  private pressedKeys: Set<string> = new Set();
  private deckPlayStates: { A: boolean; B: boolean } = { A: false, B: false };
  private currentCrossfade = 0.5; // 0 = A, 1 = B

  init(): void {
    if (this.isEnabled) return;
    
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
    this.isEnabled = true;
    
    console.log('Keyboard controller initialized');
  }

  destroy(): void {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    this.isEnabled = false;
  }

  private handleKeyDown = (event: KeyboardEvent): void => {
    // Ignore if typing in an input
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
      return;
    }

    // Keep numbers as-is, lowercase letters
    const key = /^[0-9]$/.test(event.key) ? event.key : event.key.toLowerCase();
    
    console.log(`⌨️ Key pressed: "${key}" (shift: ${event.shiftKey})`);
    
    // Prevent key repeat
    if (this.pressedKeys.has(key)) return;
    this.pressedKeys.add(key);

    const mapping = KEY_MAPPINGS.find(m => m.key === key);
    if (!mapping) {
      console.log(`⌨️ No mapping for key: ${key}`);
      return;
    }

    event.preventDefault();
    
    const isShiftHeld = event.shiftKey;
    
    console.log(`⌨️ Action: ${mapping.action} deck=${mapping.deck} cue=${mapping.cueIndex} shift=${isShiftHeld}`);
    
    // Handle the action
    this.executeAction(mapping, isShiftHeld);
    
    // Also emit to callback
    if (this.callback) {
      this.callback(mapping.action, mapping.deck, mapping.cueIndex, isShiftHeld);
    }
  };

  private handleKeyUp = (event: KeyboardEvent): void => {
    const key = /^[0-9]$/.test(event.key) ? event.key : event.key.toLowerCase();
    this.pressedKeys.delete(key);
  };

  private executeAction(mapping: KeyAction, isShiftHeld: boolean): void {
    const { action, deck, cueIndex } = mapping;

    switch (action) {
      case 'hotcue':
        if (deck && cueIndex !== undefined) {
          const cue = hotCueSystem.getCue(deck, cueIndex);
          
          if (isShiftHeld) {
            // Shift + Key = Set/overwrite cue at current position
            const currentTime = audioEngine.getCurrentTime(deck);
            hotCueSystem.setCue(deck, cueIndex, currentTime);
            console.log(`🔴 Set cue ${cueIndex + 1} on Deck ${deck} at ${currentTime.toFixed(2)}s`);
          } else if (cue) {
            // Key only + cue exists = Jump to cue
            audioEngine.seek(deck, cue.time);
            console.log(`⏩ Jump to cue ${cueIndex + 1} on Deck ${deck} at ${cue.time.toFixed(2)}s`);
            // Auto-play when jumping to cue
            if (!audioEngine.isPlaying(deck)) {
              audioEngine.play(deck);
            }
          } else {
            // Key only + no cue = Set new cue
            const currentTime = audioEngine.getCurrentTime(deck);
            hotCueSystem.setCue(deck, cueIndex, currentTime);
            console.log(`🔴 Set cue ${cueIndex + 1} on Deck ${deck} at ${currentTime.toFixed(2)}s (auto-set)`);
          }
        }
        break;

      case 'play':
        if (deck) {
          // Must init audio context on user interaction (browser requirement)
          audioEngine.init().then(() => {
            if (audioEngine.isPlaying(deck)) {
              audioEngine.pause(deck);
              this.deckPlayStates[deck] = false;
              console.log(`⏸️ Keyboard: Paused Deck ${deck}`);
            } else {
              audioEngine.play(deck);
              this.deckPlayStates[deck] = true;
              console.log(`▶️ Keyboard: Playing Deck ${deck}`);
            }
          });
        }
        break;

      case 'cue':
        if (deck) {
          audioEngine.seek(deck, 0);
        }
        break;

      case 'pitchUp':
        if (deck) {
          // Increase pitch by 0.5%
          const currentPitch = audioEngine.getPlayer(deck)?.playbackRate || 1;
          audioEngine.setPitch(deck, Math.min(currentPitch + 0.005, 1.08));
        }
        break;

      case 'pitchDown':
        if (deck) {
          const currentPitch = audioEngine.getPlayer(deck)?.playbackRate || 1;
          audioEngine.setPitch(deck, Math.max(currentPitch - 0.005, 0.92));
        }
        break;

      case 'crossfadeA':
        this.currentCrossfade = 0;
        audioEngine.setCrossfade(0);
        break;

      case 'crossfadeCenter':
        this.currentCrossfade = 0.5;
        audioEngine.setCrossfade(0.5);
        break;

      case 'crossfadeB':
        this.currentCrossfade = 1;
        audioEngine.setCrossfade(1);
        break;

      case 'crossfadeNudgeLeft':
        this.currentCrossfade = Math.max(0, this.currentCrossfade - 0.1);
        audioEngine.setCrossfade(this.currentCrossfade);
        break;

      case 'crossfadeNudgeRight':
        this.currentCrossfade = Math.min(1, this.currentCrossfade + 0.1);
        audioEngine.setCrossfade(this.currentCrossfade);
        break;

      case 'masterPlay':
        // Toggle both decks or last active
        if (this.deckPlayStates.A || this.deckPlayStates.B) {
          // Pause all
          audioEngine.pause('A');
          audioEngine.pause('B');
          this.deckPlayStates = { A: false, B: false };
        } else {
          // Play both if loaded
          if (audioEngine.isLoaded('A')) {
            audioEngine.play('A');
            this.deckPlayStates.A = true;
          }
          if (audioEngine.isLoaded('B')) {
            audioEngine.play('B');
            this.deckPlayStates.B = true;
          }
        }
        break;
    }
  }

  onAction(callback: KeyboardEventCallback): void {
    this.callback = callback;
  }

  getCrossfade(): number {
    return this.currentCrossfade;
  }

  setCrossfade(value: number): void {
    this.currentCrossfade = value;
  }

  // Get keyboard shortcuts help text
  getShortcuts(): { key: string; description: string }[] {
    return [
      { key: '1-4', description: 'Deck A Hot Cues (Shift + key to set)' },
      { key: '6-9', description: 'Deck B Hot Cues (Shift + key to set)' },
      { key: 'Q / P', description: 'Play/Pause Deck A / B' },
      { key: 'W / O', description: 'Cue (return to start) Deck A / B' },
      { key: 'A/S', description: 'Pitch Down/Up Deck A' },
      { key: 'K/L', description: 'Pitch Down/Up Deck B' },
      { key: 'Z / X / C', description: 'Crossfade: A / Center / B' },
      { key: 'V / B', description: 'Nudge crossfader left / right' },
      { key: 'Space', description: 'Play/Pause all' },
    ];
  }
}

// Singleton
export const keyboardController = new KeyboardController();
export default keyboardController;
