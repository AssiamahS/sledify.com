// MIDI Controller System with Pioneer DDJ-SB3 Mapping
// Based on official Pioneer DDJ-SB3 MIDI specification
// Reference: https://www.pioneerdj.com/-/media/pioneerdj/software-info/controller/ddj-sb3/ddj-sb3_midi_message_list_e1.pdf

export interface MIDIMapping {
  type: 'cc' | 'note';
  channel: number;
  number: number;
  action: string;
  deck?: 'A' | 'B';
  hotcueIndex?: number;
}

// Pioneer DDJ-SB3 MIDI Mapping
// Deck 1 = Channel 0, Deck 2 = Channel 1
// Channel 6 (0x06) is used for some global controls

// CC (Control Change) mappings for faders/knobs
export const DDJ_SB3_CC_MAP: MIDIMapping[] = [
  // === MIXER SECTION ===
  // Crossfader (Channel 6, CC 31)
  { type: 'cc', channel: 6, number: 31, action: 'crossfade' },
  
  // Channel Faders (Volume)
  { type: 'cc', channel: 0, number: 19, action: 'volume', deck: 'A' },
  { type: 'cc', channel: 1, number: 19, action: 'volume', deck: 'B' },
  
  // Trim/Gain
  { type: 'cc', channel: 0, number: 16, action: 'gain', deck: 'A' },
  { type: 'cc', channel: 1, number: 16, action: 'gain', deck: 'B' },
  
  // EQ High
  { type: 'cc', channel: 0, number: 23, action: 'eqHigh', deck: 'A' },
  { type: 'cc', channel: 1, number: 23, action: 'eqHigh', deck: 'B' },
  
  // EQ Mid
  { type: 'cc', channel: 0, number: 24, action: 'eqMid', deck: 'A' },
  { type: 'cc', channel: 1, number: 24, action: 'eqMid', deck: 'B' },
  
  // EQ Low
  { type: 'cc', channel: 0, number: 25, action: 'eqLow', deck: 'A' },
  { type: 'cc', channel: 1, number: 25, action: 'eqLow', deck: 'B' },
  
  // Filter
  { type: 'cc', channel: 0, number: 26, action: 'filter', deck: 'A' },
  { type: 'cc', channel: 1, number: 26, action: 'filter', deck: 'B' },
  
  // === DECK SECTION ===
  // Tempo/Pitch Fader MSB (CC 0) - Main pitch value
  { type: 'cc', channel: 0, number: 0, action: 'pitch', deck: 'A' },
  { type: 'cc', channel: 1, number: 0, action: 'pitch', deck: 'B' },
  
  // Tempo/Pitch Fader LSB (CC 32) - Fine pitch value (14-bit resolution)
  { type: 'cc', channel: 0, number: 32, action: 'pitchLSB', deck: 'A' },
  { type: 'cc', channel: 1, number: 32, action: 'pitchLSB', deck: 'B' },
  
  // Jog Wheel - Platter (for scratching when touched)
  { type: 'cc', channel: 0, number: 34, action: 'jogScratch', deck: 'A' },
  { type: 'cc', channel: 1, number: 34, action: 'jogScratch', deck: 'B' },
  
  // Jog Wheel - Outer ring (for pitch bend)
  { type: 'cc', channel: 0, number: 33, action: 'jogBend', deck: 'A' },
  { type: 'cc', channel: 1, number: 33, action: 'jogBend', deck: 'B' },
  
  // === BROWSER SECTION ===
  // Browse/Rotary encoder (Channel 6, CC 64)
  { type: 'cc', channel: 6, number: 64, action: 'browse' },
  // Also try channel 0
  { type: 'cc', channel: 0, number: 64, action: 'browse' },
];

// Note mappings for buttons (Note On/Off)
export const DDJ_SB3_NOTE_MAP: MIDIMapping[] = [
  // === TRANSPORT SECTION ===
  // Play/Pause (Note 11)
  { type: 'note', channel: 0, number: 11, action: 'play', deck: 'A' },
  { type: 'note', channel: 1, number: 11, action: 'play', deck: 'B' },
  
  // Cue (Note 12)
  { type: 'note', channel: 0, number: 12, action: 'cue', deck: 'A' },
  { type: 'note', channel: 1, number: 12, action: 'cue', deck: 'B' },
  
  // Sync (Note 88)
  { type: 'note', channel: 0, number: 88, action: 'sync', deck: 'A' },
  { type: 'note', channel: 1, number: 88, action: 'sync', deck: 'B' },
  
  // === JOG WHEEL ===
  // Vinyl/Jog Mode button (Note 101)
  { type: 'note', channel: 0, number: 101, action: 'vinyl', deck: 'A' },
  { type: 'note', channel: 1, number: 101, action: 'vinyl', deck: 'B' },
  
  // Jog wheel touch sensor (Note 54)
  { type: 'note', channel: 0, number: 54, action: 'jogTouch', deck: 'A' },
  { type: 'note', channel: 1, number: 54, action: 'jogTouch', deck: 'B' },
  
  // === PERFORMANCE PADS - HOT CUE MODE ===
  // Hot Cue pads 1-4 (Notes 0-3)
  { type: 'note', channel: 0, number: 0, action: 'hotcue', deck: 'A', hotcueIndex: 0 },
  { type: 'note', channel: 0, number: 1, action: 'hotcue', deck: 'A', hotcueIndex: 1 },
  { type: 'note', channel: 0, number: 2, action: 'hotcue', deck: 'A', hotcueIndex: 2 },
  { type: 'note', channel: 0, number: 3, action: 'hotcue', deck: 'A', hotcueIndex: 3 },
  { type: 'note', channel: 1, number: 0, action: 'hotcue', deck: 'B', hotcueIndex: 0 },
  { type: 'note', channel: 1, number: 1, action: 'hotcue', deck: 'B', hotcueIndex: 1 },
  { type: 'note', channel: 1, number: 2, action: 'hotcue', deck: 'B', hotcueIndex: 2 },
  { type: 'note', channel: 1, number: 3, action: 'hotcue', deck: 'B', hotcueIndex: 3 },
  
  // === ALL PAD MODES -> FORCE HOT CUE BEHAVIOR ===
  // No matter what pad mode is selected on the controller,
  // all pads will act as Hot Cues 1-4
  
  // Pad FX mode (Notes 20-23) -> Hot Cues
  { type: 'note', channel: 0, number: 20, action: 'hotcue', deck: 'A', hotcueIndex: 0 },
  { type: 'note', channel: 0, number: 21, action: 'hotcue', deck: 'A', hotcueIndex: 1 },
  { type: 'note', channel: 0, number: 22, action: 'hotcue', deck: 'A', hotcueIndex: 2 },
  { type: 'note', channel: 0, number: 23, action: 'hotcue', deck: 'A', hotcueIndex: 3 },
  { type: 'note', channel: 1, number: 20, action: 'hotcue', deck: 'B', hotcueIndex: 0 },
  { type: 'note', channel: 1, number: 21, action: 'hotcue', deck: 'B', hotcueIndex: 1 },
  { type: 'note', channel: 1, number: 22, action: 'hotcue', deck: 'B', hotcueIndex: 2 },
  { type: 'note', channel: 1, number: 23, action: 'hotcue', deck: 'B', hotcueIndex: 3 },
  
  // Auto Loop mode (Notes 16-19) -> Hot Cues
  { type: 'note', channel: 0, number: 16, action: 'hotcue', deck: 'A', hotcueIndex: 0 },
  { type: 'note', channel: 0, number: 17, action: 'hotcue', deck: 'A', hotcueIndex: 1 },
  { type: 'note', channel: 0, number: 18, action: 'hotcue', deck: 'A', hotcueIndex: 2 },
  { type: 'note', channel: 0, number: 19, action: 'hotcue', deck: 'A', hotcueIndex: 3 },
  { type: 'note', channel: 1, number: 16, action: 'hotcue', deck: 'B', hotcueIndex: 0 },
  { type: 'note', channel: 1, number: 17, action: 'hotcue', deck: 'B', hotcueIndex: 1 },
  { type: 'note', channel: 1, number: 18, action: 'hotcue', deck: 'B', hotcueIndex: 2 },
  { type: 'note', channel: 1, number: 19, action: 'hotcue', deck: 'B', hotcueIndex: 3 },
  
  // Sampler mode (Notes 32-35) -> Hot Cues
  { type: 'note', channel: 0, number: 32, action: 'hotcue', deck: 'A', hotcueIndex: 0 },
  { type: 'note', channel: 0, number: 33, action: 'hotcue', deck: 'A', hotcueIndex: 1 },
  { type: 'note', channel: 0, number: 34, action: 'hotcue', deck: 'A', hotcueIndex: 2 },
  { type: 'note', channel: 0, number: 35, action: 'hotcue', deck: 'A', hotcueIndex: 3 },
  { type: 'note', channel: 1, number: 32, action: 'hotcue', deck: 'B', hotcueIndex: 0 },
  { type: 'note', channel: 1, number: 33, action: 'hotcue', deck: 'B', hotcueIndex: 1 },
  { type: 'note', channel: 1, number: 34, action: 'hotcue', deck: 'B', hotcueIndex: 2 },
  { type: 'note', channel: 1, number: 35, action: 'hotcue', deck: 'B', hotcueIndex: 3 },
  
  // Pad Scratch mode (Notes 40-43) -> Hot Cues
  { type: 'note', channel: 0, number: 40, action: 'hotcue', deck: 'A', hotcueIndex: 0 },
  { type: 'note', channel: 0, number: 41, action: 'hotcue', deck: 'A', hotcueIndex: 1 },
  { type: 'note', channel: 0, number: 42, action: 'hotcue', deck: 'A', hotcueIndex: 2 },
  { type: 'note', channel: 0, number: 43, action: 'hotcue', deck: 'A', hotcueIndex: 3 },
  { type: 'note', channel: 1, number: 40, action: 'hotcue', deck: 'B', hotcueIndex: 0 },
  { type: 'note', channel: 1, number: 41, action: 'hotcue', deck: 'B', hotcueIndex: 1 },
  { type: 'note', channel: 1, number: 42, action: 'hotcue', deck: 'B', hotcueIndex: 2 },
  { type: 'note', channel: 1, number: 43, action: 'hotcue', deck: 'B', hotcueIndex: 3 },
  
  // Additional pad scratch notes (Notes 48-51) -> Hot Cues
  { type: 'note', channel: 0, number: 48, action: 'hotcue', deck: 'A', hotcueIndex: 0 },
  { type: 'note', channel: 0, number: 49, action: 'hotcue', deck: 'A', hotcueIndex: 1 },
  { type: 'note', channel: 0, number: 50, action: 'hotcue', deck: 'A', hotcueIndex: 2 },
  { type: 'note', channel: 0, number: 51, action: 'hotcue', deck: 'A', hotcueIndex: 3 },
  { type: 'note', channel: 1, number: 48, action: 'hotcue', deck: 'B', hotcueIndex: 0 },
  { type: 'note', channel: 1, number: 49, action: 'hotcue', deck: 'B', hotcueIndex: 1 },
  { type: 'note', channel: 1, number: 50, action: 'hotcue', deck: 'B', hotcueIndex: 2 },
  { type: 'note', channel: 1, number: 51, action: 'hotcue', deck: 'B', hotcueIndex: 3 },
  
  // === PAD MODE BUTTONS ===
  // Hot Cue mode button (Note 27)
  { type: 'note', channel: 0, number: 27, action: 'padModeHotCue', deck: 'A' },
  { type: 'note', channel: 1, number: 27, action: 'padModeHotCue', deck: 'B' },
  
  // Pad FX mode button (Note 28)  
  { type: 'note', channel: 0, number: 28, action: 'padModeFx', deck: 'A' },
  { type: 'note', channel: 1, number: 28, action: 'padModeFx', deck: 'B' },
  
  // Auto Loop mode button (Note 29)
  { type: 'note', channel: 0, number: 29, action: 'padModeLoop', deck: 'A' },
  { type: 'note', channel: 1, number: 29, action: 'padModeLoop', deck: 'B' },
  
  // Sampler mode button (Note 30)
  { type: 'note', channel: 0, number: 30, action: 'padModeSampler', deck: 'A' },
  { type: 'note', channel: 1, number: 30, action: 'padModeSampler', deck: 'B' },
  
  // === BROWSER SECTION ===
  // Load buttons (Channel 6, Note 70 for Deck A, Note 71 for Deck B)
  { type: 'note', channel: 6, number: 70, action: 'loadTrack', deck: 'A' },
  { type: 'note', channel: 6, number: 71, action: 'loadTrack', deck: 'B' },
  // Alternative on deck channels
  { type: 'note', channel: 0, number: 70, action: 'loadTrack', deck: 'A' },
  { type: 'note', channel: 1, number: 70, action: 'loadTrack', deck: 'B' },
  
  // Back button (Channel 6, Note 101)
  { type: 'note', channel: 6, number: 101, action: 'browseBack' },
  
  // === SHIFT BUTTONS ===
  { type: 'note', channel: 0, number: 63, action: 'shift', deck: 'A' },
  { type: 'note', channel: 1, number: 63, action: 'shift', deck: 'B' },
  
  // === HEADPHONE ===
  // Headphone Cue buttons
  { type: 'note', channel: 0, number: 84, action: 'headphoneCue', deck: 'A' },
  { type: 'note', channel: 1, number: 84, action: 'headphoneCue', deck: 'B' },
];

// Actions to ignore (not implemented but shouldn't cause errors)
const IGNORED_ACTIONS = ['padModeHotCue', 'padModeFx', 'padModeLoop', 'padModeSampler', 'browseBack', 'headphoneCue', 'gain'];

export type MIDIEventCallback = (action: string, value: number, deck?: 'A' | 'B', hotcueIndex?: number) => void;

class MIDIController {
  private midiAccess: MIDIAccess | null = null;
  private inputs: MIDIInput[] = [];
  private outputs: MIDIOutput[] = [];
  private callback: MIDIEventCallback | null = null;
  private isConnected = false;
  private deviceName = '';
  private shiftPressed: { A: boolean; B: boolean } = { A: false, B: false };
  private vinylMode: { A: boolean; B: boolean } = { A: true, B: true };
  private jogTouched: { A: boolean; B: boolean } = { A: false, B: false };
  
  // Pitch fader state for high-resolution and filtering
  private pitchMSB: { A: number; B: number } = { A: 64, B: 64 };
  private pitchLSB: { A: number; B: number } = { A: 0, B: 0 };
  private lastPitchRate: { A: number; B: number } = { A: 1.0, B: 1.0 };

  async init(): Promise<boolean> {
    if (!navigator.requestMIDIAccess) {
      console.warn('Web MIDI API not supported in this browser');
      return false;
    }

    try {
      this.midiAccess = await navigator.requestMIDIAccess({ sysex: false });
      this.setupInputs();
      this.setupOutputs();
      
      this.midiAccess.onstatechange = () => {
        this.setupInputs();
        this.setupOutputs();
      };

      console.log('🎛️ MIDI Controller initialized');
      return true;
    } catch (err) {
      console.error('Failed to initialize MIDI:', err);
      return false;
    }
  }

  private setupInputs(): void {
    if (!this.midiAccess) return;

    this.inputs = [];
    let foundDevice = false;
    
    this.midiAccess.inputs.forEach((input) => {
      console.log(`🎹 MIDI Input: ${input.name} (${input.manufacturer})`);
      this.inputs.push(input);
      input.onmidimessage = this.handleMIDIMessage.bind(this);
      
      const name = input.name?.toLowerCase() || '';
      const isDJController = name.includes('ddj') || name.includes('numark') || 
                            name.includes('pioneer') || name.includes('traktor') ||
                            name.includes('hercules') || name.includes('denon');
      
      if (!foundDevice || isDJController) {
        this.deviceName = input.name || 'MIDI Device';
        this.isConnected = true;
        foundDevice = true;
        console.log(`🎛️ Connected to: ${input.name}`);
      }
    });
    
    if (this.inputs.length === 0) {
      console.log('⚠️ No MIDI devices found');
      this.isConnected = false;
      this.deviceName = '';
    }
  }

  private setupOutputs(): void {
    if (!this.midiAccess) return;
    this.outputs = [];
    this.midiAccess.outputs.forEach((output) => {
      this.outputs.push(output);
    });
  }

  private handleMIDIMessage(event: MIDIMessageEvent): void {
    const data = event.data;
    if (!data || data.length < 2) return;
    
    const [status, data1, data2] = data;
    const messageType = status >> 4;
    const channel = status & 0x0f;
    
    console.log(`🎹 MIDI: type=${messageType.toString(16)} ch=${channel} d1=${data1} d2=${data2}`);
    
    // Control Change (CC) - 0xB
    if (messageType === 0x0b) {
      this.handleCC(channel, data1, data2);
    }
    // Note On - 0x9
    else if (messageType === 0x09) {
      this.handleNoteOn(channel, data1, data2);
    }
    // Note Off - 0x8
    else if (messageType === 0x08) {
      this.handleNoteOff(channel, data1, data2);
    }
  }

  private handleCC(channel: number, cc: number, value: number): void {
    // Find mapping
    const mapping = DDJ_SB3_CC_MAP.find(m => m.channel === channel && m.number === cc);
    
    if (mapping) {
      if (IGNORED_ACTIONS.includes(mapping.action)) {
        return;
      }
      
      // Handle different CC types
      switch (mapping.action) {
        case 'crossfade':
          // Value 0-127 -> 0-1
          this.emitAction('crossfade', value / 127);
          break;
          
        case 'volume':
        case 'eqHigh':
        case 'eqMid':
        case 'eqLow':
        case 'filter':
          this.emitAction(mapping.action, value / 127, mapping.deck);
          break;
          
        case 'pitchLSB':
          // Store LSB (CC 32) for 14-bit resolution
          const lsbDeck = mapping.deck || 'A';
          this.pitchLSB[lsbDeck] = value;
          // Don't emit here - wait for MSB to trigger the update
          break;
          
        case 'pitch':
          // DDJ-SB3 Pitch Fader Calibration
          // Store MSB (CC 0) - this is the main pitch value
          const deckKey = mapping.deck || 'A';
          this.pitchMSB[deckKey] = value;
          
          // Calculate 14-bit value if we have LSB, otherwise use 7-bit
          // 14-bit: MSB * 128 + LSB (0-16383, center at 8192)
          // 7-bit: value (0-127, center at 64)
          const has14bit = this.pitchLSB[deckKey] !== 0;
          let pitchValue: number;
          let centerValue: number;
          let maxRange: number;
          
          if (has14bit) {
            pitchValue = (this.pitchMSB[deckKey] * 128) + this.pitchLSB[deckKey];
            centerValue = 8192;
            maxRange = 8192;
          } else {
            pitchValue = value;
            centerValue = 64;
            maxRange = 64;
          }
          
          // Normalize to -1 to +1 range (center = 0)
          // Fader at top (0) = +1, center = 0, bottom (max) = -1
          const normalized = (centerValue - pitchValue) / maxRange;
          
          // Apply pitch range (±8%)
          const pitchPercent = normalized * 8; // -8 to +8
          
          // Convert to playback rate (1.0 = normal)
          const rate = 1 + (pitchPercent / 100);
          
          // Clamp to valid range
          const clampedRate = Math.max(0.92, Math.min(1.08, rate));
          
          // Dead zone filter: only emit if change is significant (>0.1%)
          const lastRate = this.lastPitchRate[deckKey];
          const rateDiff = Math.abs(clampedRate - lastRate);
          
          if (rateDiff > 0.001) { // 0.1% threshold
            this.lastPitchRate[deckKey] = clampedRate;
            this.emitAction('pitch', clampedRate, mapping.deck);
          }
          break;
          
        case 'jogScratch':
        case 'jogBend':
          // Jog wheel: relative value
          // 1-63 = clockwise (forward), 65-127 = counter-clockwise (backward)
          const jogValue = value < 64 ? value : value - 128;
          this.emitAction(mapping.action, jogValue, mapping.deck);
          break;
          
        case 'browse':
          // Rotary encoder: 1 = clockwise, 127 = counter-clockwise
          this.emitAction('browse', value);
          break;
          
        default:
          this.emitAction(mapping.action, value / 127, mapping.deck);
      }
      return;
    }

    console.log(`❓ Unmapped CC: ch=${channel} cc=${cc} val=${value}`);
  }

  private handleNoteOn(channel: number, note: number, velocity: number): void {
    if (velocity === 0) {
      this.handleNoteOff(channel, note, 0);
      return;
    }

    const mapping = DDJ_SB3_NOTE_MAP.find(m => m.channel === channel && m.number === note);
    
    if (mapping) {
      if (IGNORED_ACTIONS.includes(mapping.action)) {
        console.log(`🚫 Ignored: ${mapping.action}`);
        return;
      }
      
      console.log(`🎹 ${mapping.action} (Deck ${mapping.deck || '-'})`);
      
      // Special handling
      switch (mapping.action) {
        case 'shift':
          this.shiftPressed[mapping.deck || 'A'] = true;
          break;
        case 'jogTouch':
          this.jogTouched[mapping.deck || 'A'] = true;
          this.emitAction('jogTouch', 1, mapping.deck);
          break;
        case 'vinyl':
          this.vinylMode[mapping.deck || 'A'] = !this.vinylMode[mapping.deck || 'A'];
          this.emitAction('vinyl', this.vinylMode[mapping.deck || 'A'] ? 1 : 0, mapping.deck);
          break;
        default:
          this.emitAction(mapping.action, 1, mapping.deck, mapping.hotcueIndex);
      }
      return;
    }

    console.log(`❓ Unmapped Note: ch=${channel} note=${note} vel=${velocity}`);
  }

  private handleNoteOff(channel: number, note: number, _velocity: number): void {
    const mapping = DDJ_SB3_NOTE_MAP.find(m => m.channel === channel && m.number === note);
    
    if (mapping) {
      switch (mapping.action) {
        case 'shift':
          this.shiftPressed[mapping.deck || 'A'] = false;
          break;
        case 'cue':
          this.emitAction('cueRelease', 0, mapping.deck);
          break;
        case 'jogTouch':
          this.jogTouched[mapping.deck || 'A'] = false;
          this.emitAction('jogTouch', 0, mapping.deck);
          break;
      }
    }
  }

  isShiftPressed(deck: 'A' | 'B'): boolean {
    return this.shiftPressed[deck] || false;
  }

  isVinylMode(deck: 'A' | 'B'): boolean {
    return this.vinylMode[deck];
  }

  isJogTouched(deck: 'A' | 'B'): boolean {
    return this.jogTouched[deck];
  }

  private emitAction(action: string, value: number, deck?: 'A' | 'B', hotcueIndex?: number): void {
    if (this.callback) {
      this.callback(action, value, deck, hotcueIndex);
    }
  }

  onMessage(callback: MIDIEventCallback): void {
    this.callback = callback;
  }

  getConnectionStatus(): { connected: boolean; deviceName: string } {
    return { connected: this.isConnected, deviceName: this.deviceName };
  }

  getInputs(): MIDIInput[] {
    return this.inputs;
  }

  getOutputs(): MIDIOutput[] {
    return this.outputs;
  }

  sendLED(channel: number, note: number, velocity: number): void {
    this.outputs.forEach((output) => {
      output.send([0x90 + channel, note, velocity]);
    });
  }
}

export const midiController = new MIDIController();
export default midiController;
