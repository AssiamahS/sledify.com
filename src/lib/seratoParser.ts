// Serato Metadata Parser for SlyDecks
// Reads Serato DJ cue points from MP3 ID3 tags
// Serato stores data in GEOB (General Encapsulated Object) frames

import { HotCue, HOT_CUE_COLORS } from './hotCueSystem';

// Serato marker types
const SERATO_MARKERS_TAG = 'Serato Markers_';
const SERATO_MARKERS2_TAG = 'Serato Markers2';

interface SeratoMarker {
  type: 'CUE' | 'LOOP' | 'INVALID';
  index: number;
  position: number; // in milliseconds
  color: { r: number; g: number; b: number };
  name?: string;
}

// Parse Serato color to hex
function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}

// Decode Serato's base64-like encoding
function decodeSeratoBase64(encoded: string): Uint8Array {
  // Serato uses a custom base64 variant
  const decoded: number[] = [];
  
  for (let i = 0; i < encoded.length; i += 4) {
    const chunk = encoded.slice(i, i + 4);
    if (chunk.length < 4) break;
    
    // Decode 4 characters to 3 bytes
    const b1 = chunk.charCodeAt(0) & 0x3F;
    const b2 = chunk.charCodeAt(1) & 0x3F;
    const b3 = chunk.charCodeAt(2) & 0x3F;
    const b4 = chunk.charCodeAt(3) & 0x3F;
    
    decoded.push((b1 << 2) | (b2 >> 4));
    decoded.push(((b2 & 0x0F) << 4) | (b3 >> 2));
    decoded.push(((b3 & 0x03) << 6) | b4);
  }
  
  return new Uint8Array(decoded);
}

// Parse Serato Markers2 data
function parseSeratoMarkers2(data: Uint8Array): SeratoMarker[] {
  const markers: SeratoMarker[] = [];
  
  // Skip header (first 2 bytes are version)
  let offset = 2;
  
  while (offset < data.length - 1) {
    // Read entry type (null-terminated string)
    let typeEnd = offset;
    while (typeEnd < data.length && data[typeEnd] !== 0) typeEnd++;
    
    const entryType = new TextDecoder().decode(data.slice(offset, typeEnd));
    offset = typeEnd + 1;
    
    if (offset >= data.length - 4) break;
    
    // Read entry length (4 bytes, big-endian)
    const entryLength = (data[offset] << 24) | (data[offset + 1] << 16) | 
                        (data[offset + 2] << 8) | data[offset + 3];
    offset += 4;
    
    if (entryLength === 0 || offset + entryLength > data.length) break;
    
    const entryData = data.slice(offset, offset + entryLength);
    offset += entryLength;
    
    // Parse CUE entries
    if (entryType === 'CUE') {
      const marker = parseCueEntry(entryData);
      if (marker) markers.push(marker);
    }
    // Parse LOOP entries
    else if (entryType === 'LOOP') {
      const marker = parseLoopEntry(entryData);
      if (marker) markers.push(marker);
    }
  }
  
  return markers;
}

// Parse a CUE entry
function parseCueEntry(data: Uint8Array): SeratoMarker | null {
  if (data.length < 13) return null;
  
  // Byte 0: Index (0-7)
  const index = data[0];
  
  // Bytes 1-4: Position in milliseconds (big-endian)
  const position = (data[1] << 24) | (data[2] << 16) | (data[3] << 8) | data[4];
  
  // Byte 5: Unknown (always 0)
  
  // Bytes 6-8: RGB color
  const r = data[6];
  const g = data[7];
  const b = data[8];
  
  // Bytes 9-10: Unknown
  
  // Remaining: Name (null-terminated UTF-8)
  let name: string | undefined;
  if (data.length > 11) {
    const nameBytes = data.slice(11);
    const nullIndex = nameBytes.indexOf(0);
    if (nullIndex > 0) {
      name = new TextDecoder().decode(nameBytes.slice(0, nullIndex));
    }
  }
  
  return {
    type: 'CUE',
    index,
    position,
    color: { r, g, b },
    name,
  };
}

// Parse a LOOP entry
function parseLoopEntry(data: Uint8Array): SeratoMarker | null {
  if (data.length < 21) return null;
  
  const index = data[0];
  const startPosition = (data[1] << 24) | (data[2] << 16) | (data[3] << 8) | data[4];
  
  return {
    type: 'LOOP',
    index,
    position: startPosition,
    color: { r: data[14], g: data[15], b: data[16] },
  };
}

// Read ID3v2 tags from an ArrayBuffer
async function readID3Tags(buffer: ArrayBuffer): Promise<Map<string, Uint8Array>> {
  const tags = new Map<string, Uint8Array>();
  const view = new DataView(buffer);
  
  // Check for ID3v2 header
  const id3 = String.fromCharCode(view.getUint8(0), view.getUint8(1), view.getUint8(2));
  if (id3 !== 'ID3') {
    console.log('No ID3v2 header found');
    return tags;
  }
  
  // ID3v2 version
  const majorVersion = view.getUint8(3);
  // const minorVersion = view.getUint8(4);
  
  // ID3v2 size (syncsafe integer)
  const size = ((view.getUint8(6) & 0x7F) << 21) |
               ((view.getUint8(7) & 0x7F) << 14) |
               ((view.getUint8(8) & 0x7F) << 7) |
               (view.getUint8(9) & 0x7F);
  
  let offset = 10; // Start after header
  const endOffset = 10 + size;
  
  // Parse frames
  while (offset < endOffset - 10) {
    // Frame ID (4 bytes for ID3v2.3+, 3 bytes for ID3v2.2)
    const frameIdLength = majorVersion >= 3 ? 4 : 3;
    let frameId = '';
    for (let i = 0; i < frameIdLength; i++) {
      const char = view.getUint8(offset + i);
      if (char === 0) break;
      frameId += String.fromCharCode(char);
    }
    
    if (!frameId || frameId[0] === '\0') break;
    
    offset += frameIdLength;
    
    // Frame size
    let frameSize: number;
    if (majorVersion >= 4) {
      // ID3v2.4 uses syncsafe integers for frame size
      frameSize = ((view.getUint8(offset) & 0x7F) << 21) |
                  ((view.getUint8(offset + 1) & 0x7F) << 14) |
                  ((view.getUint8(offset + 2) & 0x7F) << 7) |
                  (view.getUint8(offset + 3) & 0x7F);
    } else if (majorVersion >= 3) {
      frameSize = view.getUint32(offset);
    } else {
      frameSize = (view.getUint8(offset) << 16) |
                  (view.getUint8(offset + 1) << 8) |
                  view.getUint8(offset + 2);
    }
    
    offset += majorVersion >= 3 ? 4 : 3;
    
    // Frame flags (2 bytes for ID3v2.3+)
    if (majorVersion >= 3) {
      offset += 2;
    }
    
    if (frameSize === 0 || offset + frameSize > buffer.byteLength) break;
    
    // Extract frame data
    const frameData = new Uint8Array(buffer, offset, frameSize);
    
    // Store GEOB frames (where Serato data lives)
    if (frameId === 'GEOB') {
      // Parse GEOB frame
      const { description, data } = parseGEOBFrame(frameData);
      if (description.startsWith('Serato')) {
        tags.set(description, data);
      }
    }
    
    offset += frameSize;
  }
  
  return tags;
}

// Parse GEOB (General Encapsulated Object) frame
function parseGEOBFrame(data: Uint8Array): { description: string; data: Uint8Array } {
  let offset = 0;
  
  // Text encoding byte
  const encoding = data[offset++];
  
  // MIME type (null-terminated)
  let mimeEnd = offset;
  while (mimeEnd < data.length && data[mimeEnd] !== 0) mimeEnd++;
  offset = mimeEnd + 1;
  
  // Filename (null-terminated, encoding-dependent)
  if (encoding === 0 || encoding === 3) {
    // ISO-8859-1 or UTF-8
    while (offset < data.length && data[offset] !== 0) offset++;
    offset++;
  } else {
    // UTF-16
    while (offset < data.length - 1 && !(data[offset] === 0 && data[offset + 1] === 0)) offset += 2;
    offset += 2;
  }
  
  // Description (null-terminated)
  let descEnd = offset;
  if (encoding === 0 || encoding === 3) {
    while (descEnd < data.length && data[descEnd] !== 0) descEnd++;
    const description = new TextDecoder().decode(data.slice(offset, descEnd));
    offset = descEnd + 1;
    return { description, data: data.slice(offset) };
  } else {
    while (descEnd < data.length - 1 && !(data[descEnd] === 0 && data[descEnd + 1] === 0)) descEnd += 2;
    const description = new TextDecoder('utf-16').decode(data.slice(offset, descEnd));
    offset = descEnd + 2;
    return { description, data: data.slice(offset) };
  }
}

// Main function: Parse Serato cue points from an audio file
export async function parseSeratoCuePoints(file: File): Promise<HotCue[]> {
  const hotCues: HotCue[] = [];
  
  try {
    const buffer = await file.arrayBuffer();
    const tags = await readID3Tags(buffer);
    
    // Try Serato Markers2 first (newer format)
    let markers2Data = tags.get(SERATO_MARKERS2_TAG);
    if (markers2Data) {
      // Decode base64 content (skip "application/octet-stream" header if present)
      const textContent = new TextDecoder().decode(markers2Data);
      if (textContent.includes('\x00')) {
        // Binary data, parse directly
        const decoded = decodeSeratoBase64(textContent.replace(/[\x00-\x1F]/g, ''));
        const markers = parseSeratoMarkers2(decoded);
        
        for (const marker of markers) {
          if (marker.type === 'CUE' && marker.index < 8) {
            hotCues.push({
              index: marker.index,
              time: marker.position / 1000, // Convert ms to seconds
              color: rgbToHex(marker.color.r, marker.color.g, marker.color.b),
              label: marker.name,
            });
          }
        }
      }
    }
    
    // Fallback: Try older Serato Markers_ format
    if (hotCues.length === 0) {
      const markers1Data = tags.get(SERATO_MARKERS_TAG);
      if (markers1Data) {
        // Parse older format (simpler structure)
        console.log('Found Serato Markers_ tag, parsing...');
        // Implementation for older format would go here
      }
    }
    
    console.log(`Parsed ${hotCues.length} Serato cue points`);
    
  } catch (err) {
    console.error('Error parsing Serato metadata:', err);
  }
  
  // Fill in default colors if missing
  return hotCues.map((cue, i) => ({
    ...cue,
    color: cue.color || HOT_CUE_COLORS[i % HOT_CUE_COLORS.length],
  }));
}

// Detect BPM from Serato tags
export async function parseSeratoBPM(file: File): Promise<number | null> {
  try {
    const buffer = await file.arrayBuffer();
    const view = new DataView(buffer);
    
    // Quick scan for TBPM frame
    const text = new TextDecoder().decode(new Uint8Array(buffer, 0, Math.min(buffer.byteLength, 10000)));
    const bpmMatch = text.match(/TBPM[\x00-\xFF]{4,8}(\d+\.?\d*)/);
    
    if (bpmMatch) {
      return parseFloat(bpmMatch[1]);
    }
  } catch (err) {
    console.error('Error parsing BPM:', err);
  }
  
  return null;
}

export default { parseSeratoCuePoints, parseSeratoBPM };
