import * as Tone from 'tone';

// Types
export interface DeckState {
  isPlaying: boolean;
  isLoaded: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  pitch: number;
  bpm: number;
}

// Audio Engine Class
class AudioEngine {
  private deckA: Tone.Player | null = null;
  private deckB: Tone.Player | null = null;
  private gainA: Tone.Gain;
  private gainB: Tone.Gain;
  private crossfader: Tone.CrossFade;
  private masterGain: Tone.Gain;
  private isInitialized = false;
  
  // Track playback position manually since Tone.js Player doesn't expose it well
  private startTimeA = 0;
  private startTimeB = 0;
  private seekOffsetA = 0;
  private seekOffsetB = 0;

  constructor() {
    this.gainA = new Tone.Gain(0.8);
    this.gainB = new Tone.Gain(0.8);
    this.crossfader = new Tone.CrossFade(0.5);
    this.masterGain = new Tone.Gain(0.8);
    
    this.gainA.connect(this.crossfader.a);
    this.gainB.connect(this.crossfader.b);
    this.crossfader.connect(this.masterGain);
    this.masterGain.toDestination();
  }

  async init(): Promise<void> {
    if (this.isInitialized) return;
    await Tone.start();
    this.isInitialized = true;
    console.log('🎛️ Audio engine initialized');
  }

  async loadFile(deck: 'A' | 'B', file: File): Promise<number> {
    await this.init();
    
    // Reset BPM to default immediately when loading new track
    if (deck === 'A') {
      this.bpmA = 128.0;
      this.bpmDetectedA = false;
    } else {
      this.bpmB = 128.0;
      this.bpmDetectedB = false;
    }
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          const audioBuffer = await Tone.context.decodeAudioData(arrayBuffer);
          
          const player = new Tone.Player(audioBuffer);
          player.loop = false;
          
          if (deck === 'A') {
            this.deckA?.dispose();
            this.deckA = player;
            this.deckA.connect(this.gainA);
            this.seekOffsetA = 0;
            this.startTimeA = 0;
          } else {
            this.deckB?.dispose();
            this.deckB = player;
            this.deckB.connect(this.gainB);
            this.seekOffsetB = 0;
            this.startTimeB = 0;
          }
          
          console.log(`🎵 Deck ${deck} loaded: ${file.name} (${audioBuffer.duration.toFixed(1)}s)`);
          resolve(audioBuffer.duration);
        } catch (err) {
          console.error(`❌ Error loading file:`, err);
          reject(err);
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  }

  play(deck: 'A' | 'B'): void {
    const player = deck === 'A' ? this.deckA : this.deckB;
    if (!player || !player.loaded) return;
    
    if (player.state !== 'started') {
      const offset = deck === 'A' ? this.seekOffsetA : this.seekOffsetB;
      player.start(undefined, offset);
      
      if (deck === 'A') {
        this.startTimeA = Tone.now();
      } else {
        this.startTimeB = Tone.now();
      }
      console.log(`▶️ Deck ${deck} playing from ${offset.toFixed(2)}s`);
    }
  }

  pause(deck: 'A' | 'B'): void {
    const player = deck === 'A' ? this.deckA : this.deckB;
    if (!player) return;
    
    if (player.state === 'started') {
      // Save current position before stopping
      const currentPos = this.getCurrentTime(deck);
      player.stop();
      
      if (deck === 'A') {
        this.seekOffsetA = currentPos;
      } else {
        this.seekOffsetB = currentPos;
      }
      console.log(`⏸️ Deck ${deck} paused at ${currentPos.toFixed(2)}s`);
    }
  }

  stop(deck: 'A' | 'B'): void {
    const player = deck === 'A' ? this.deckA : this.deckB;
    if (!player) return;
    
    player.stop();
    if (deck === 'A') {
      this.seekOffsetA = 0;
      this.startTimeA = 0;
    } else {
      this.seekOffsetB = 0;
      this.startTimeB = 0;
    }
    console.log(`⏹️ Deck ${deck} stopped`);
  }

  seek(deck: 'A' | 'B', time: number): void {
    const player = deck === 'A' ? this.deckA : this.deckB;
    if (!player || !player.loaded) return;
    
    const duration = player.buffer.duration;
    const clampedTime = Math.max(0, Math.min(time, duration));
    const wasPlaying = player.state === 'started';
    
    player.stop();
    
    if (deck === 'A') {
      this.seekOffsetA = clampedTime;
      this.startTimeA = Tone.now();
    } else {
      this.seekOffsetB = clampedTime;
      this.startTimeB = Tone.now();
    }
    
    if (wasPlaying) {
      player.start(undefined, clampedTime);
    }
    
    console.log(`⏩ Deck ${deck} seek to ${clampedTime.toFixed(2)}s`);
  }

  setVolume(deck: 'A' | 'B', volume: number): void {
    const gain = deck === 'A' ? this.gainA : this.gainB;
    gain.gain.value = Math.max(0, Math.min(1, volume));
  }

  setPitch(deck: 'A' | 'B', rate: number): void {
    const player = deck === 'A' ? this.deckA : this.deckB;
    if (player) {
      player.playbackRate = rate;
    }
  }

  setCrossfade(value: number): void {
    this.crossfader.fade.value = Math.max(0, Math.min(1, value));
  }

  setMasterVolume(volume: number): void {
    this.masterGain.gain.value = Math.max(0, Math.min(1, volume));
  }

  getCurrentTime(deck: 'A' | 'B'): number {
    const player = deck === 'A' ? this.deckA : this.deckB;
    if (!player || !player.loaded) return 0;
    
    const startTime = deck === 'A' ? this.startTimeA : this.startTimeB;
    const seekOffset = deck === 'A' ? this.seekOffsetA : this.seekOffsetB;
    
    if (player.state === 'started') {
      const elapsed = (Tone.now() - startTime) * player.playbackRate;
      const currentTime = seekOffset + elapsed;
      return Math.min(currentTime, player.buffer.duration);
    }
    
    return seekOffset;
  }

  getDuration(deck: 'A' | 'B'): number {
    const player = deck === 'A' ? this.deckA : this.deckB;
    return player?.buffer?.duration || 0;
  }

  isPlaying(deck: 'A' | 'B'): boolean {
    const player = deck === 'A' ? this.deckA : this.deckB;
    return player?.state === 'started';
  }

  isLoaded(deck: 'A' | 'B'): boolean {
    const player = deck === 'A' ? this.deckA : this.deckB;
    return player?.loaded || false;
  }

  getPlayer(deck: 'A' | 'B'): Tone.Player | null {
    return deck === 'A' ? this.deckA : this.deckB;
  }
  
  // Get audio buffer for waveform drawing
  getBuffer(deck: 'A' | 'B'): Float32Array | null {
    const player = deck === 'A' ? this.deckA : this.deckB;
    if (!player || !player.buffer) return null;
    return player.buffer.getChannelData(0);
  }

  // Stored BPM values for each deck
  private bpmA: number = 128.0;
  private bpmB: number = 128.0;
  private bpmDetectedA: boolean = false;
  private bpmDetectedB: boolean = false;

  // Get BPM - returns immediately with stored value (128.0 default)
  getBPM(deck: 'A' | 'B'): number {
    return deck === 'A' ? this.bpmA : this.bpmB;
  }

  // Set BPM manually
  setBPM(deck: 'A' | 'B', bpm: number): void {
    if (deck === 'A') {
      this.bpmA = bpm;
      this.bpmDetectedA = true;
    } else {
      this.bpmB = bpm;
      this.bpmDetectedB = true;
    }
    console.log(`🎵 Deck ${deck} BPM set to ${bpm}`);
  }

  // Check if BPM has been detected
  isBPMDetected(deck: 'A' | 'B'): boolean {
    return deck === 'A' ? this.bpmDetectedA : this.bpmDetectedB;
  }

  // Detect BPM from audio buffer using peak detection
  // Also stores the result and returns it immediately
  detectBPM(deck: 'A' | 'B'): number {
    const player = deck === 'A' ? this.deckA : this.deckB;
    if (!player || !player.buffer) {
      // Return stored BPM or default
      return this.getBPM(deck);
    }
    
    const buffer = player.buffer.getChannelData(0);
    const sampleRate = player.buffer.sampleRate;
    
    // Use first 30 seconds for analysis (or full track if shorter)
    const analysisLength = Math.min(buffer.length, sampleRate * 30);
    
    // Create energy envelope with peak detection
    const windowSize = Math.floor(sampleRate * 0.02); // 20ms windows
    const hopSize = Math.floor(windowSize / 2);
    const energies: number[] = [];
    
    for (let i = 0; i < analysisLength - windowSize; i += hopSize) {
      let energy = 0;
      for (let j = 0; j < windowSize; j++) {
        energy += buffer[i + j] * buffer[i + j];
      }
      energies.push(energy / windowSize);
    }
    
    // Find peaks (onset detection)
    const peaks: number[] = [];
    const threshold = energies.reduce((a, b) => a + b, 0) / energies.length * 1.5;
    
    for (let i = 1; i < energies.length - 1; i++) {
      if (energies[i] > threshold && 
          energies[i] > energies[i - 1] && 
          energies[i] > energies[i + 1]) {
        peaks.push(i);
      }
    }
    
    if (peaks.length < 4) {
      // Not enough peaks, keep default but mark as not detected
      return this.getBPM(deck);
    }
    
    // Calculate intervals between peaks
    const intervals: number[] = [];
    for (let i = 1; i < peaks.length; i++) {
      const interval = (peaks[i] - peaks[i - 1]) * hopSize / sampleRate;
      // Filter for reasonable beat intervals (60-200 BPM range)
      if (interval > 0.3 && interval < 1.0) {
        intervals.push(interval);
      }
    }
    
    if (intervals.length < 2) {
      return this.getBPM(deck);
    }
    
    // Get median interval
    intervals.sort((a, b) => a - b);
    const medianInterval = intervals[Math.floor(intervals.length / 2)];
    
    // Convert to BPM
    let bpm = 60 / medianInterval;
    
    // Adjust to common range (90-180 BPM)
    while (bpm < 90) bpm *= 2;
    while (bpm > 180) bpm /= 2;
    
    // Round to 1 decimal
    const detectedBpm = Math.round(bpm * 10) / 10;
    
    // Store the detected BPM
    this.setBPM(deck, detectedBpm);
    
    return detectedBpm;
  }

  // Async BPM detection that runs in background
  async detectBPMAsync(deck: 'A' | 'B'): Promise<number> {
    return new Promise((resolve) => {
      // Use setTimeout to not block the main thread
      setTimeout(() => {
        const bpm = this.detectBPM(deck);
        resolve(bpm);
      }, 100);
    });
  }
}

export const audioEngine = new AudioEngine();
export default audioEngine;
