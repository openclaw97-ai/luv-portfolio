'use client';

import { useRef, useEffect, useCallback, useState, useMemo } from 'react';
import WaveSurfer from 'wavesurfer.js';
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.js';
import type { Region } from 'wavesurfer.js/dist/plugins/regions.js';
import { audioBufferToWav } from '@/lib/audio-utils';

interface WaveformEditorProps {
  audioBuffer: AudioBuffer;
  onReady: (ws: WaveSurfer) => void;
  onRegionChange: (region: { start: number; end: number } | null) => void;
  onTimeUpdate: (time: number) => void;
  onPlayStateChange: (playing: boolean) => void;
}

const WaveformEditor = ({
  audioBuffer,
  onReady,
  onRegionChange,
  onTimeUpdate,
  onPlayStateChange,
}: WaveformEditorProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WaveSurfer | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Create a blob URL from the AudioBuffer so WaveSurfer can actually play it
  const blobUrl = useMemo(() => {
    const wav = audioBufferToWav(audioBuffer);
    return URL.createObjectURL(wav);
  }, [audioBuffer]);

  // Clean up blob URL on unmount
  useEffect(() => {
    return () => {
      URL.revokeObjectURL(blobUrl);
    };
  }, [blobUrl]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Destroy previous instance
    if (wsRef.current) {
      wsRef.current.destroy();
      wsRef.current = null;
    }

    const regions = RegionsPlugin.create();
    const ws = WaveSurfer.create({
      container: containerRef.current,
      waveColor: 'hsl(174, 72%, 50%)',
      progressColor: 'hsl(174, 80%, 35%)',
      cursorColor: 'hsl(0, 0%, 80%)',
      cursorWidth: 1,
      height: 180,
      barWidth: 2,
      barGap: 1,
      barRadius: 2,
      normalize: true,
      plugins: [regions],
    });

    // Load from blob URL so playback works
    ws.load(blobUrl);

    let activeRegion: Region | null = null;

    regions.enableDragSelection({
      color: 'hsla(174, 72%, 50%, 0.15)',
    });

    regions.on('region-created', (region: Region) => {
      if (activeRegion && activeRegion !== region) {
        activeRegion.remove();
      }
      activeRegion = region;
      region.setOptions({
        color: 'hsla(174, 72%, 50%, 0.25)',
      });
      onRegionChange({ start: region.start, end: region.end });
    });

    regions.on('region-updated', (region: Region) => {
      onRegionChange({ start: region.start, end: region.end });
    });

    ws.on('timeupdate', (time: number) => onTimeUpdate(time));
    ws.on('play', () => onPlayStateChange(true));
    ws.on('pause', () => onPlayStateChange(false));
    ws.on('finish', () => onPlayStateChange(false));
    ws.on('ready', () => {
      setIsLoaded(true);
    });

    wsRef.current = ws;
    onReady(ws);

    return () => {
      ws.destroy();
      wsRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blobUrl]);

  return (
    <div className="border border-grid-strong bg-neutral-900/40 p-4 relative">
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-sm text-accent-muted animate-pulse">
            Loading waveform...
          </div>
        </div>
      )}
      <div ref={containerRef} className="w-full" />
      <p className="text-xs text-accent-muted mt-3 text-center opacity-60">
        Click and drag on the waveform to select a region for editing
      </p>
    </div>
  );
};

export default WaveformEditor;
