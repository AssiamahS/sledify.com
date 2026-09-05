import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { ArrowLeft, Volume2, Disc, Keyboard, Usb, Rows, Columns } from 'lucide-react';
import { Deck } from '@/components/Deck';
import { TrackLibrary } from '@/components/TrackLibrary';
import audioEngine from '@/lib/audioEngine';
import { keyboardController } from '@/lib/keyboardController';
import { midiController } from '@/lib/midiController';
import { hotCueSystem } from '@/lib/hotCueSystem';

export default function Studio() {
  const [crossfade, setCrossfade] = useState(50);
  const [masterVolume, setMasterVolume] = useState(80);
  const [midiConnected, setMidiConnected] = useState(false);
  const [midiDevice, setMidiDevice] = useState('');
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [deckABpm, setDeckABpm] = useState(128);
  const [deckBBpm, setDeckBBpm] = useState(128);
  const [vinylMode, setVinylMode] = useState({ A: true, B: true });
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [browseIndex, setBrowseIndex] = useState(0);
  const [layout, setLayout] = useState<'horizontal' | 'vertical'>('horizontal'); // Layout toggle
  
  // Refs for deck file inputs
  const deckAFileRef = useRef<HTMLInputElement>(null);
  const deckBFileRef = useRef<HTMLInputElement>(null);

  // Initialize controllers
  useEffect(() => {
    // Keyboard controller
    keyboardController.init();

    // MIDI controller
    midiController.init().then((success) => {
      if (success) {
        const status = midiController.getConnectionStatus();
        setMidiConnected(status.connected);
        setMidiDevice(status.deviceName);
      }
    });

    // MIDI event handler
    midiController.onMessage((action, value, deck, hotcueIndex) => {
      console.log(`🎛️ Studio received: ${action} val=${value} deck=${deck} cue=${hotcueIndex}`);
      
      switch (action) {
        case 'crossfade':
          const cfValue = value * 100;
          setCrossfade(cfValue);
          audioEngine.setCrossfade(value);
          break;
          
        case 'volume':
          if (deck) {
            audioEngine.setVolume(deck, value);
          }
          break;
          
        case 'pitch':
          if (deck) {
            // Value is already the playback rate from MIDI controller
            audioEngine.setPitch(deck, value);
            console.log(`🎚️ Pitch Deck ${deck}: ${((value - 1) * 100).toFixed(1)}%`);
          }
          break;
          
        case 'play':
          if (deck && value === 1) {
            // Must init audio context on user interaction (browser requirement)
            audioEngine.init().then(() => {
              if (audioEngine.isPlaying(deck)) {
                audioEngine.pause(deck);
                console.log(`⏸️ MIDI: Paused Deck ${deck}`);
              } else {
                audioEngine.play(deck);
                console.log(`▶️ MIDI: Playing Deck ${deck}`);
              }
            });
          }
          break;
          
        case 'cue':
          if (deck && value === 1) {
            audioEngine.seek(deck, 0);
            audioEngine.play(deck);
          }
          break;
          
        case 'cueRelease':
          if (deck) {
            audioEngine.pause(deck);
          }
          break;
          
        case 'hotcue':
          if (deck && hotcueIndex !== undefined && value === 1) {
            const isShift = midiController.isShiftPressed(deck);
            const cue = hotCueSystem.getCue(deck, hotcueIndex);
            
            // Dispatch event to Deck component for proper state sync
            const hotCueEvent = new CustomEvent('slydecks:midiHotCue', {
              detail: {
                deck,
                index: hotcueIndex,
                action: (isShift || !cue) ? 'set' : 'jump'
              }
            });
            window.dispatchEvent(hotCueEvent);
            
            console.log(`🎹 MIDI Hot Cue ${hotcueIndex + 1} Deck ${deck}: ${isShift || !cue ? 'SET' : 'JUMP'}`);
          }
          break;
          
        case 'sync':
          if (deck) {
            // Sync BPM to other deck
            const otherDeck = deck === 'A' ? 'B' : 'A';
            const otherBpm = otherDeck === 'A' ? deckABpm : deckBBpm;
            const currentBpm = deck === 'A' ? deckABpm : deckBBpm;
            if (otherBpm > 0 && currentBpm > 0) {
              const ratio = otherBpm / currentBpm;
              audioEngine.setPitch(deck, ratio);
            }
          }
          break;
          
        case 'vinyl':
          if (deck && value === 1) {
            setVinylMode(prev => ({ ...prev, [deck]: !prev[deck] }));
            console.log(`💿 Vinyl mode ${deck}: ${!vinylMode[deck] ? 'ON' : 'OFF'}`);
          }
          break;
          
        case 'jogScratch':
          // Jog platter - for scratching (when vinyl mode on and touching)
          if (deck && vinylMode[deck] && midiController.isJogTouched(deck) && audioEngine.isLoaded(deck)) {
            const scratchAmount = value * 0.003; // value is already signed from MIDI handler
            const currentTime = audioEngine.getCurrentTime(deck);
            const duration = audioEngine.getDuration(deck);
            const newTime = Math.max(0, Math.min(duration, currentTime + scratchAmount));
            audioEngine.seek(deck, newTime);
          }
          break;
          
        case 'jogBend':
          // Jog outer ring - for pitch bend (temporary speed change)
          if (deck && audioEngine.isLoaded(deck) && audioEngine.isPlaying(deck)) {
            // Pitch bend - temporarily adjust speed
            const bendAmount = value * 0.0005;
            const currentTime = audioEngine.getCurrentTime(deck);
            const duration = audioEngine.getDuration(deck);
            const newTime = Math.max(0, Math.min(duration, currentTime + bendAmount));
            audioEngine.seek(deck, newTime);
          }
          break;
          
        case 'jogTouch':
          // Jog wheel touch sensor
          if (deck) {
            if (value === 1) {
              console.log(`👆 Jog touch Deck ${deck} - ${vinylMode[deck] ? 'SCRATCH' : 'BEND'} mode`);
            }
          }
          break;
          
        case 'browse':
          // Browse encoder: value > 64 = turn right, value < 64 = turn left
          if (value > 64) {
            setBrowseIndex(prev => prev + 1);
          } else if (value < 64) {
            setBrowseIndex(prev => Math.max(0, prev - 1));
          }
          setLibraryOpen(true);
          break;
          
        case 'loadTrack':
          if (deck && value === 1) {
            // Trigger file dialog for the deck
            if (deck === 'A') {
              deckAFileRef.current?.click();
            } else {
              deckBFileRef.current?.click();
            }
          }
          break;
      }
    });

    // Keyboard crossfade sync
    const interval = setInterval(() => {
      const kbCrossfade = keyboardController.getCrossfade();
      setCrossfade(kbCrossfade * 100);
    }, 100);

    return () => {
      keyboardController.destroy();
      clearInterval(interval);
    };
  }, [deckABpm, deckBBpm, vinylMode]);

  const handleCrossfadeChange = useCallback((value: number[]) => {
    const cf = value[0];
    setCrossfade(cf);
    audioEngine.setCrossfade(cf / 100);
    keyboardController.setCrossfade(cf / 100);
  }, []);

  const handleMasterVolumeChange = useCallback((value: number[]) => {
    const vol = value[0];
    setMasterVolume(vol);
    audioEngine.setMasterVolume(vol / 100);
  }, []);

  const handleLoadTrack = useCallback(async (deck: 'A' | 'B', file: File) => {
    console.log(`📂 Loading track "${file.name}" to Deck ${deck}`);
    try {
      await audioEngine.loadFile(deck, file);
      // Dispatch event so Deck component can update its state
      const event = new CustomEvent('slydecks:loadTrack', { detail: { deck, file } });
      window.dispatchEvent(event);
    } catch (err) {
      console.error('Error loading track:', err);
    }
  }, []);

  const shortcuts = keyboardController.getShortcuts();

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 overflow-hidden">
      {/* Header */}
      <header className="h-14 flex-shrink-0 border-b border-white/10 bg-black/50 backdrop-blur-md">
        <div className="h-full container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Disc className="w-6 h-6 text-purple-400 animate-spin-slow" />
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                SlyDecks Studio
              </span>
            </div>
          </div>

          {/* Status Indicators */}
          <div className="flex items-center gap-4">
            {/* MIDI Status */}
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs ${
              midiConnected ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
            }`}>
              <Usb className="w-3 h-3" />
              {midiConnected ? midiDevice || 'MIDI Connected' : 'No MIDI'}
            </div>

            {/* Layout Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLayout(layout === 'horizontal' ? 'vertical' : 'horizontal')}
              className="gap-2"
              title={layout === 'horizontal' ? 'Switch to Vertical' : 'Switch to Horizontal'}
            >
              {layout === 'horizontal' ? <Rows className="w-4 h-4" /> : <Columns className="w-4 h-4" />}
            </Button>

            {/* Keyboard Shortcuts */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowShortcuts(!showShortcuts)}
              className="gap-2"
            >
              <Keyboard className="w-4 h-4" />
            </Button>

            {/* Master Volume */}
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-gray-400" />
              <div className="w-24">
                <Slider
                  value={[masterVolume]}
                  onValueChange={handleMasterVolumeChange}
                  max={100}
                  step={1}
                />
              </div>
              <span className="text-xs text-gray-400 w-8">{masterVolume}%</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Performance Area - with padding for sticky footer */}
      <main className="flex-1 min-h-0 p-2 pb-12 overflow-hidden">
        <div className={`h-full flex gap-2 ${layout === 'horizontal' ? 'flex-col' : 'flex-row'}`}>
          {/* Deck A */}
          <div className="flex-1 min-h-0 min-w-0">
            <Deck deckId="A" onBpmChange={setDeckABpm} />
          </div>

          {/* Compact Mixer Strip */}
          <div className={`glass-card rounded-lg p-2 flex-shrink-0 ${layout === 'horizontal' ? '' : 'w-20'}`}>
            <div className={`flex items-center gap-2 ${layout === 'horizontal' ? 'flex-row' : 'flex-col h-full'}`}>
              {/* BPM A */}
              <div className="text-center">
                <div className="text-[8px] text-gray-500">A</div>
                <div className="text-sm font-mono text-purple-400 font-bold">{deckABpm.toFixed(1)}</div>
              </div>

              {/* Crossfader */}
              <div className={`flex items-center gap-1 ${layout === 'horizontal' ? 'flex-1' : 'flex-col flex-1'}`}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCrossfadeChange([0])}
                  className="h-5 w-5 p-0 text-[10px] text-purple-400"
                >
                  A
                </Button>
                
                <Slider
                  value={[crossfade]}
                  onValueChange={handleCrossfadeChange}
                  max={100}
                  step={1}
                  orientation={layout === 'horizontal' ? 'horizontal' : 'vertical'}
                  className={layout === 'horizontal' ? 'flex-1' : 'h-full'}
                />
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCrossfadeChange([100])}
                  className="h-5 w-5 p-0 text-[10px] text-blue-400"
                >
                  B
                </Button>
              </div>

              {/* Sync Indicator */}
              <div className={`px-2 py-1 rounded text-[10px] font-bold ${
                Math.abs(deckABpm - deckBBpm) < 1 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'bg-yellow-500/20 text-yellow-400'
              }`}>
                {Math.abs(deckABpm - deckBBpm) < 1 ? '✓' : `Δ${Math.abs(deckABpm - deckBBpm).toFixed(0)}`}
              </div>

              {/* BPM B */}
              <div className="text-center">
                <div className="text-[8px] text-gray-500">B</div>
                <div className="text-sm font-mono text-blue-400 font-bold">{deckBBpm.toFixed(1)}</div>
              </div>
            </div>
          </div>

          {/* Deck B */}
          <div className="flex-1 min-h-0 min-w-0">
            <Deck deckId="B" onBpmChange={setDeckBBpm} />
          </div>
        </div>
      </main>

      {/* Track Library Drawer */}
      <TrackLibrary 
        onLoadTrack={handleLoadTrack} 
        isOpen={libraryOpen}
        selectedIndex={browseIndex}
      />

      {/* Keyboard Shortcuts Modal */}
      {showShortcuts && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setShowShortcuts(false)}
        >
          <div 
            className="glass-card rounded-xl p-6 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Keyboard className="w-5 h-5 text-purple-400" />
                Keyboard Shortcuts
              </h2>
              <Button variant="ghost" size="sm" onClick={() => setShowShortcuts(false)}>
                ✕
              </Button>
            </div>
            <div className="space-y-2">
              {shortcuts.map((shortcut, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="text-gray-400">{shortcut.description}</span>
                  <kbd className="px-2 py-1 bg-white/10 rounded text-sm font-mono">
                    {shortcut.key}
                  </kbd>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-4">
              Hot Cues: Hold <kbd className="px-1 bg-white/10 rounded">Shift</kbd> + key to set, tap to jump
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
