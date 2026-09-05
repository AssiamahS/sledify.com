import { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, Square, Upload, SkipBack, RotateCcw } from 'lucide-react';
import { Waveform } from './Waveform';
import audioEngine from '@/lib/audioEngine';
import { hotCueSystem, HotCue, HOT_CUE_COLORS } from '@/lib/hotCueSystem';
import { parseSeratoCuePoints, parseSeratoBPM } from '@/lib/seratoParser';

interface DeckProps {
  deckId: 'A' | 'B';
  color?: string;
  onBpmChange?: (bpm: number) => void;
  compact?: boolean; // Compact mode for bigger waveforms
}

export function Deck({ deckId, color, onBpmChange, compact = false }: DeckProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80);
  const [pitch, setPitch] = useState(0);
  const [baseBpm, setBaseBpm] = useState<number>(128.0); // Original track BPM
  
  // Effective BPM = base BPM adjusted by pitch
  const bpm = baseBpm * (1 + pitch / 100);
  const [trackName, setTrackName] = useState<string>('');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [hotCues, setHotCues] = useState<(HotCue | null)[]>([null, null, null, null]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const deckColor = color || (deckId === 'A' ? '#a855f7' : '#3b82f6');

  // Sync base BPM from audio engine when it changes
  useEffect(() => {
    const syncBpm = () => {
      const engineBpm = audioEngine.getBPM(deckId);
      if (engineBpm !== baseBpm && audioEngine.isBPMDetected(deckId)) {
        setBaseBpm(engineBpm);
      }
    };
    
    // Check periodically for BPM updates (in case of async detection)
    const interval = setInterval(syncBpm, 500);
    return () => clearInterval(interval);
  }, [deckId, baseBpm]);

  // Notify parent of effective BPM changes (when pitch or base BPM changes)
  useEffect(() => {
    onBpmChange?.(bpm);
  }, [bpm, onBpmChange]);

  // Subscribe to hot cue changes
  useEffect(() => {
    const unsubscribe = hotCueSystem.subscribe((allCues) => {
      setHotCues(allCues[deckId]);
    });
    return unsubscribe;
  }, [deckId]);

  // Listen for MIDI hot cue events
  useEffect(() => {
    const handleMidiHotCue = (e: CustomEvent<{ deck: 'A' | 'B'; index: number; action: 'jump' | 'set' }>) => {
      if (e.detail.deck !== deckId) return;
      
      const { index, action } = e.detail;
      
      if (action === 'set') {
        // Set hot cue at current position
        hotCueSystem.setCue(deckId, index, currentTime);
      } else {
        // Jump to hot cue
        const cue = hotCueSystem.getCue(deckId, index);
        if (cue) {
          audioEngine.seek(deckId, cue.time);
          setCurrentTime(cue.time);
          if (!isPlaying) {
            audioEngine.play(deckId);
            setIsPlaying(true);
          }
        }
      }
    };

    window.addEventListener('slydecks:midiHotCue', handleMidiHotCue as EventListener);
    return () => {
      window.removeEventListener('slydecks:midiHotCue', handleMidiHotCue as EventListener);
    };
  }, [deckId, currentTime, isPlaying]);

  // Listen for external track load events (from library or MIDI)
  useEffect(() => {
    const handleExternalLoad = async (e: CustomEvent<{ deck: 'A' | 'B'; file: File }>) => {
      if (e.detail.deck !== deckId) return;
      
      const file = e.detail.file;
      console.log(`🎵 Deck ${deckId} received external load: ${file.name}`);
      
      setTrackName(file.name.replace(/\.[^/.]+$/, ''));
      setAudioFile(file);
      
      try {
        const dur = audioEngine.getDuration(deckId);
        setDuration(dur);
        setIsLoaded(true);
        setCurrentTime(0);
        setIsPlaying(false);

        // Parse Serato cue points
        const seratoCues = await parseSeratoCuePoints(file);
        if (seratoCues.length > 0) {
          hotCueSystem.loadCues(deckId, seratoCues);
        }

        // Try to get BPM from Serato tags first, then auto-detect
        let detectedBpm = await parseSeratoBPM(file);
        if (!detectedBpm) {
          detectedBpm = audioEngine.detectBPM(deckId);
          console.log(`🎵 Auto-detected BPM for Deck ${deckId}: ${detectedBpm}`);
        }
        setBaseBpm(detectedBpm);
      } catch (err) {
        console.error('Error processing loaded file:', err);
      }
    };

    window.addEventListener('slydecks:loadTrack', handleExternalLoad as EventListener);
    return () => {
      window.removeEventListener('slydecks:loadTrack', handleExternalLoad as EventListener);
    };
  }, [deckId, onBpmChange]);

  // Update time display continuously while playing
  useEffect(() => {
    let frameId: number;
    
    const updateTime = () => {
      const playing = audioEngine.isPlaying(deckId);
      const time = audioEngine.getCurrentTime(deckId);
      
      // Update state
      setCurrentTime(time);
      
      // Sync isPlaying state with audio engine
      if (playing !== isPlaying) {
        setIsPlaying(playing);
      }
      
      // Keep the loop running
      frameId = requestAnimationFrame(updateTime);
    };
    
    // Start the update loop
    frameId = requestAnimationFrame(updateTime);
    
    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [deckId, isPlaying]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset state first
    setIsLoaded(false);
    setCurrentTime(0);
    setPitch(0);
    setTrackName(file.name.replace(/\.[^/.]+$/, ''));
    
    try {
      // Load audio first and wait for it
      const dur = await audioEngine.loadFile(deckId, file);
      
      // Now set the file for waveform (after audio is loaded)
      setAudioFile(file);
      setDuration(dur);
      setIsLoaded(true);

      console.log(`✅ Deck ${deckId} loaded: ${file.name} (${dur.toFixed(1)}s)`);

      // Parse Serato cue points
      const seratoCues = await parseSeratoCuePoints(file);
      if (seratoCues.length > 0) {
        hotCueSystem.loadCues(deckId, seratoCues);
        console.log(`Loaded ${seratoCues.length} Serato cues for Deck ${deckId}`);
      }

      // Try to get BPM from Serato tags first, then auto-detect
      let detectedBpm = await parseSeratoBPM(file);
      if (!detectedBpm) {
        // Auto-detect BPM from audio
        detectedBpm = audioEngine.detectBPM(deckId);
        console.log(`🎵 Auto-detected BPM for Deck ${deckId}: ${detectedBpm}`);
      } else {
        console.log(`🎵 Serato BPM for Deck ${deckId}: ${detectedBpm}`);
      }
      setBaseBpm(detectedBpm);
    } catch (err) {
      console.error('Error loading file:', err);
      setIsLoaded(false);
    }
  };

  const handlePlay = async () => {
    if (!isLoaded) return;
    
    if (isPlaying) {
      audioEngine.pause(deckId);
      setIsPlaying(false);
    } else {
      await audioEngine.init();
      audioEngine.play(deckId);
      setIsPlaying(true);
    }
  };

  const handleStop = () => {
    audioEngine.stop(deckId);
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleCue = () => {
    audioEngine.seek(deckId, 0);
    setCurrentTime(0);
  };

  const handleVolumeChange = (value: number[]) => {
    const vol = value[0];
    setVolume(vol);
    audioEngine.setVolume(deckId, vol / 100);
  };

  const handlePitchChange = (value: number[]) => {
    const pitchPercent = value[0];
    setPitch(pitchPercent);
    const rate = 1 + (pitchPercent / 100);
    audioEngine.setPitch(deckId, rate);
  };

  const handleSeek = (time: number) => {
    audioEngine.seek(deckId, time);
    setCurrentTime(time);
  };

  const handleHotCueClick = (index: number, e: React.MouseEvent) => {
    if (e.shiftKey) {
      // Set cue
      hotCueSystem.setCue(deckId, index, currentTime);
    } else {
      // Jump to cue
      const cue = hotCueSystem.getCue(deckId, index);
      if (cue) {
        audioEngine.seek(deckId, cue.time);
        setCurrentTime(cue.time);
        if (!isPlaying) {
          audioEngine.play(deckId);
          setIsPlaying(true);
        }
      }
    }
  };

  const handleHotCueClear = (index: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    hotCueSystem.clearCue(deckId, index);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 100);
    return `${mins}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  const cueKeys = deckId === 'A' ? ['1', '2', '3', '4'] : ['6', '7', '8', '9'];

  return (
    <div className="glass-card rounded-xl p-2 h-full flex flex-col">
      {/* Compact Header Row */}
      <div className="flex items-center gap-2 mb-1 px-1">
        {/* Deck indicator */}
        <div 
          className="w-3 h-3 rounded-full flex-shrink-0"
          style={{ 
            backgroundColor: deckColor,
            boxShadow: isPlaying ? `0 0 8px ${deckColor}` : 'none',
          }}
        />
        <span className="font-bold text-sm">{deckId}</span>
        
        {/* Track Name */}
        <div className="flex-1 text-xs text-gray-400 truncate">
          {trackName || 'No track'}
        </div>
        
        {/* Time & BPM */}
        <span className="text-green-400 text-xs font-mono">{formatTime(currentTime)}</span>
        <span className="text-purple-400 text-xs font-bold">{bpm.toFixed(1)}</span>
        
        {/* Load Button */}
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          className="hidden"
          onChange={handleFileSelect}
        />
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          className="h-6 px-2 text-xs"
        >
          <Upload className="w-3 h-3" />
        </Button>
      </div>

      {/* LARGE Waveform - Takes most of the space */}
      <div className="flex-1 min-h-0">
        <Waveform
          deckId={deckId}
          audioFile={audioFile || undefined}
          onSeek={handleSeek}
          isPlaying={isPlaying}
          color={deckColor}
          height={200}
          bpm={bpm}
          hotCues={hotCues}
          currentTime={currentTime}
        />
      </div>

      {/* Compact Controls Row */}
      <div className="flex items-center gap-1 mt-1 px-1">
        {/* Hot Cues - Small */}
        {[0, 1, 2, 3].map((index) => {
          const cue = hotCues[index];
          return (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={(e) => handleHotCueClick(index, e)}
              onContextMenu={(e) => handleHotCueClear(index, e)}
              className="h-6 w-6 p-0 text-xs font-bold"
              style={{
                backgroundColor: cue ? cue.color + '40' : 'transparent',
                borderColor: cue ? cue.color : 'rgba(255,255,255,0.2)',
                color: cue ? cue.color : 'inherit',
              }}
            >
              {index + 1}
            </Button>
          );
        })}

        <div className="w-px h-4 bg-gray-700 mx-1" />

        {/* Transport - Compact */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleCue}
          disabled={!isLoaded}
          className="h-6 w-6 p-0"
        >
          <SkipBack className="w-3 h-3" />
        </Button>
        <Button
          variant="default"
          size="sm"
          onClick={handlePlay}
          disabled={!isLoaded}
          className="h-8 w-8 p-0 rounded-full"
          style={{ 
            backgroundColor: isPlaying ? '#22c55e' : deckColor,
          }}
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleStop}
          disabled={!isLoaded}
          className="h-6 w-6 p-0"
        >
          <Square className="w-3 h-3" />
        </Button>

        <div className="w-px h-4 bg-gray-700 mx-1" />

        {/* Pitch - Compact */}
        <Slider
          value={[pitch]}
          onValueChange={handlePitchChange}
          min={-8}
          max={8}
          step={0.1}
          className="flex-1 max-w-[100px]"
        />
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePitchChange([0])}
          className={`h-6 px-1 text-[10px] w-12 ${pitch === 0 ? 'border-green-500 text-green-400' : ''}`}
        >
          {pitch > 0 ? '+' : ''}{pitch.toFixed(1)}%
        </Button>
      </div>
    </div>
  );
}

export default Deck;
