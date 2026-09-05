import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronUp, ChevronDown, Music, Folder, Upload, Search } from 'lucide-react';

interface Track {
  id: string;
  name: string;
  artist?: string;
  bpm?: number;
  duration?: string;
  file?: File;
}

interface TrackLibraryProps {
  onLoadTrack: (deck: 'A' | 'B', file: File) => void;
  isOpen?: boolean;
  selectedIndex?: number;
}

export function TrackLibrary({ onLoadTrack, isOpen, selectedIndex = 0 }: TrackLibraryProps) {
  const [isExpanded, setIsExpanded] = useState(isOpen || false);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [dragTarget, setDragTarget] = useState<'A' | 'B' | null>(null);

  const handleFilesSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newTracks: Track[] = Array.from(files).map((file, i) => ({
      id: `${Date.now()}-${i}`,
      name: file.name.replace(/\.[^/.]+$/, ''),
      file,
    }));

    setTracks(prev => [...prev, ...newTracks]);
  };

  const handleDragStart = (e: React.DragEvent, track: Track) => {
    e.dataTransfer.setData('track', JSON.stringify({ id: track.id }));
  };

  const handleLoadToDeck = (track: Track, deck: 'A' | 'B') => {
    if (track.file) {
      onLoadTrack(deck, track.file);
    }
  };

  const filteredTracks = tracks.filter(track =>
    track.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    track.artist?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sync with external isOpen prop
  React.useEffect(() => {
    if (isOpen !== undefined) {
      setIsExpanded(isOpen);
    }
  }, [isOpen]);

  // Handle browse index from MIDI
  const activeIndex = selectedIndex % Math.max(filteredTracks.length, 1);

  return (
    <div 
      className={`fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-white/10 transition-all duration-300 z-50 ${
        isExpanded ? 'h-48' : 'h-10'
      }`}
    >
      {/* Header Bar - Always Visible */}
      <div 
        className="h-10 flex items-center justify-between px-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <Folder className="w-4 h-4 text-purple-400" />
          <span className="font-semibold text-sm">Library</span>
          <span className="text-xs text-gray-500">({tracks.length})</span>
        </div>
        
        <div className="flex items-center gap-2">
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          )}
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="h-[calc(100%-2.5rem)] flex flex-col px-4 pb-2">
          {/* Search & Add */}
          <div className="flex items-center gap-3 mb-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search tracks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-purple-500"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            <label>
              <input
                type="file"
                accept="audio/*"
                multiple
                className="hidden"
                onChange={handleFilesSelect}
              />
              <Button variant="outline" size="sm" className="gap-2" asChild>
                <span>
                  <Upload className="w-4 h-4" />
                  Add Tracks
                </span>
              </Button>
            </label>
          </div>

          {/* Track List */}
          <div className="flex-1 overflow-y-auto">
            {filteredTracks.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <Music className="w-12 h-12 mb-2 opacity-50" />
                <p>No tracks loaded</p>
                <p className="text-sm">Add audio files to get started</p>
              </div>
            ) : (
              <div className="space-y-1">
                {filteredTracks.map((track, index) => (
                  <div
                    key={track.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, track)}
                    className={`flex items-center gap-3 p-2 rounded-lg cursor-grab active:cursor-grabbing group transition-colors ${
                      index === activeIndex ? 'bg-purple-500/20 ring-1 ring-purple-500/50' : 'hover:bg-white/5'
                    }`}
                  >
                    <Music className="w-4 h-4 text-gray-500" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate">{track.name}</p>
                      {track.artist && (
                        <p className="text-xs text-gray-500 truncate">{track.artist}</p>
                      )}
                    </div>
                    {track.bpm && (
                      <span className="text-xs text-purple-400">{track.bpm} BPM</span>
                    )}
                    <div className="flex gap-1 opacity-100 transition-opacity">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 px-2 text-xs bg-purple-500/20 border-purple-500/50 hover:bg-purple-500/30"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLoadToDeck(track, 'A');
                        }}
                      >
                        → A
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 px-2 text-xs bg-blue-500/20 border-blue-500/50 hover:bg-blue-500/30"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLoadToDeck(track, 'B');
                        }}
                      >
                        → B
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default TrackLibrary;
