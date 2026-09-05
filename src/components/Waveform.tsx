import { useEffect, useRef, useState, useCallback } from 'react';
import { HotCue } from '@/lib/hotCueSystem';
import audioEngine from '@/lib/audioEngine';

interface WaveformProps {
  deckId: 'A' | 'B';
  audioFile?: File;
  onReady?: (duration: number) => void;
  onSeek?: (time: number) => void;
  isPlaying?: boolean;
  color?: string;
  height?: number;
  bpm?: number;
  hotCues?: (HotCue | null)[];
  currentTime?: number;
  centerPlayhead?: boolean; // If true, playhead stays at center for beatmatching
}

export function Waveform({
  deckId,
  audioFile,
  onReady,
  onSeek,
  isPlaying = false,
  color = '#a855f7',
  height = 120,
  bpm = 128,
  hotCues = [],
  currentTime = 0,
  centerPlayhead = true, // Default to centered for beatmatching
}: WaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [waveformData, setWaveformData] = useState<number[]>([]);
  const [duration, setDuration] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Generate waveform data from audio buffer
  const generateWaveform = useCallback((audioBuffer: Float32Array, numSamples: number = 500) => {
    const blockSize = Math.floor(audioBuffer.length / numSamples);
    const waveform: number[] = [];
    
    for (let i = 0; i < numSamples; i++) {
      const start = i * blockSize;
      let sum = 0;
      
      for (let j = 0; j < blockSize; j++) {
        sum += Math.abs(audioBuffer[start + j] || 0);
      }
      
      waveform.push(sum / blockSize);
    }
    
    // Normalize
    const max = Math.max(...waveform, 0.01);
    return waveform.map(v => v / max);
  }, []);

  // Load waveform when file changes
  useEffect(() => {
    if (!audioFile) {
      setWaveformData([]);
      setIsLoaded(false);
      setDuration(0);
      return;
    }

    const loadWaveform = () => {
      try {
        const buffer = audioEngine.getBuffer(deckId);
        const dur = audioEngine.getDuration(deckId);
        
        if (buffer && dur > 0) {
          const data = generateWaveform(buffer);
          setWaveformData(data);
          setDuration(dur);
          setIsLoaded(true);
          onReady?.(dur);
          console.log(`📊 Waveform generated for Deck ${deckId}: ${data.length} samples`);
          return true;
        }
        return false;
      } catch (err) {
        console.error('Error generating waveform:', err);
        return false;
      }
    };

    // Try immediately first
    if (!loadWaveform()) {
      // If not ready, retry a few times with short delays
      let attempts = 0;
      const maxAttempts = 10;
      const retryInterval = setInterval(() => {
        attempts++;
        if (loadWaveform() || attempts >= maxAttempts) {
          clearInterval(retryInterval);
        }
      }, 100);
      
      return () => clearInterval(retryInterval);
    }
  }, [audioFile, deckId, generateWaveform, onReady]);

  // Draw waveform
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height: h } = canvas;
    const centerY = h / 2;

    // Clear
    ctx.fillStyle = '#0a0a0f';
    ctx.fillRect(0, 0, width, h);

    if (waveformData.length === 0 || duration === 0) {
      // No data - draw placeholder
      ctx.strokeStyle = 'rgba(255,255,255,0.1)';
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(width, centerY);
      ctx.stroke();
      return;
    }

    const barWidth = width / waveformData.length;
    
    // Playhead position: centered for beatmatching, or scrolling
    const playheadX = centerPlayhead ? width / 2 : (currentTime / duration) * width;
    
    // Calculate offset to scroll waveform when playhead is centered
    const scrollOffset = centerPlayhead ? (currentTime / duration) * width - (width / 2) : 0;

    // Draw 4-beat grid across entire waveform
    // Calculate pixelsPerBeat: (BPM / 60) gives beats per second
    // Then multiply by (width / duration) to convert to pixels per beat
    if (bpm > 0 && duration > 0) {
      const beatsPerSecond = bpm / 60;
      const pixelsPerSecond = width / duration;
      const pixelsPerBeat = pixelsPerSecond / beatsPerSecond;
      
      // Total number of beats in the track
      const totalBeats = Math.ceil(duration * beatsPerSecond);
      
      for (let beatIndex = 0; beatIndex < totalBeats; beatIndex++) {
        // Calculate x position using pixelsPerBeat, adjusted for scroll
        const x = beatIndex * pixelsPerBeat - scrollOffset;
        
        // Skip if outside canvas (with some margin for labels)
        if (x < -20 || x > width + 20) continue;
        
        const beatInBar = beatIndex % 4; // 0=1, 1=2, 2=3, 3=4
        const isDownbeat = beatInBar === 0; // Every 4 beats (the "sticks")
        
        if (isDownbeat) {
          // Bright purple vertical line every 4 beats (the "sticks")
          ctx.strokeStyle = '#a855f7'; // Bright purple
          ctx.lineWidth = 2;
          
          // Draw the stick (full height line)
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, h);
          ctx.stroke();
        } else {
          // Beats 2, 3, 4 - lighter lines
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
          ctx.lineWidth = 1;
          
          // Draw beat line
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, h);
          ctx.stroke();
        }
        
        // Beat number at top (1, 2, 3, 4)
        ctx.fillStyle = isDownbeat ? '#a855f7' : 'rgba(255, 255, 255, 0.3)';
        ctx.font = isDownbeat ? 'bold 10px sans-serif' : '9px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText((beatInBar + 1).toString(), x, isDownbeat ? 12 : 10);
      }
    }

    // Draw waveform bars
    waveformData.forEach((value, index) => {
      const x = index * barWidth - scrollOffset;
      
      // Skip if outside canvas
      if (x < -barWidth || x > width) return;
      
      const barHeight = value * (h * 0.8);
      
      // Color based on position relative to playhead
      const isPast = x < playheadX;
      
      if (isPast) {
        ctx.fillStyle = 'rgba(100, 100, 100, 0.5)';
      } else {
        // Gradient effect
        const gradient = ctx.createLinearGradient(0, centerY - barHeight/2, 0, centerY + barHeight/2);
        gradient.addColorStop(0, color);
        gradient.addColorStop(0.5, color + 'cc');
        gradient.addColorStop(1, color);
        ctx.fillStyle = gradient;
      }
      
      // Draw symmetrical bar
      ctx.fillRect(x, centerY - barHeight/2, Math.max(barWidth - 1, 1), barHeight);
    });

    // Draw hot cue markers
    hotCues.forEach((cue) => {
      if (!cue) return;
      
      const x = (cue.time / duration) * width - scrollOffset;
      
      // Skip if outside canvas
      if (x < -10 || x > width + 10) return;
      
      // Cue line
      ctx.strokeStyle = cue.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
      
      // Cue triangle at top
      ctx.fillStyle = cue.color;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x - 8, 12);
      ctx.lineTo(x + 8, 12);
      ctx.closePath();
      ctx.fill();
      
      // Cue number
      ctx.fillStyle = '#000';
      ctx.font = 'bold 9px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText((cue.index + 1).toString(), x, 10);
    });

    // Draw playhead (fixed at center or scrolling)
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 3;
    ctx.shadowColor = '#22c55e';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.moveTo(playheadX, 0);
    ctx.lineTo(playheadX, h);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Playhead triangle at bottom
    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.moveTo(playheadX, h);
    ctx.lineTo(playheadX - 8, h - 12);
    ctx.lineTo(playheadX + 8, h - 12);
    ctx.closePath();
    ctx.fill();
    
    // Playhead triangle at top
    ctx.beginPath();
    ctx.moveTo(playheadX, 0);
    ctx.lineTo(playheadX - 8, 12);
    ctx.lineTo(playheadX + 8, 12);
    ctx.closePath();
    ctx.fill();

  }, [waveformData, duration, currentTime, color, bpm, hotCues, centerPlayhead]);

  // Handle click to seek
  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || duration === 0) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const canvasWidth = rect.width;
    
    let seekTime: number;
    
    if (centerPlayhead) {
      // In centered mode, clicking adjusts relative to current position
      // Click left of center = seek backward, click right = seek forward
      const centerX = canvasWidth / 2;
      const offsetRatio = (clickX - centerX) / canvasWidth;
      const currentRatio = currentTime / duration;
      seekTime = (currentRatio + offsetRatio) * duration;
    } else {
      // Normal mode: click position = absolute time
      const ratio = clickX / canvasWidth;
      seekTime = ratio * duration;
    }
    
    // Clamp to valid range
    seekTime = Math.max(0, Math.min(duration, seekTime));
    onSeek?.(seekTime);
  };

  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        width={600}
        height={height}
        className="w-full h-full rounded-lg cursor-pointer"
        onClick={handleClick}
      />
      
      {/* Loading overlay */}
      {audioFile && !isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-lg">
          <div className="flex flex-col items-center gap-2">
            <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-gray-400">Loading...</span>
          </div>
        </div>
      )}
      
      {/* Empty state */}
      {!audioFile && (
        <div className="absolute inset-0 flex items-center justify-center rounded-lg border-2 border-dashed border-gray-700/50">
          <span className="text-gray-600 text-sm">Drop track or click Load</span>
        </div>
      )}
    </div>
  );
}

export default Waveform;
