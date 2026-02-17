'use client';

import { useEffect, useRef } from 'react';
import WaveSurfer from 'wavesurfer.js';
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.js';
import { audioBufferToWav } from '@/lib/audio-utils';

type WaveSurferInstance = WaveSurfer & {
  regions: any;
  getRegions: () => any[];
  stop: () => void;
  setTime: (time: number) => void;
  pause: () => void;
  play: () => void;
};

interface WaveformProps {
  buffer: AudioBuffer;
  containerRef: React.RefObject<HTMLDivElement>;
  onReady: (ws: WaveSurferInstance) => void;
  onUnmount: () => void;
  onPlayStateChange: (playing: boolean) => void;
  onTimeUpdate: (time: number) => void;
  onRegionChange: (region: { start: number; end: number } | null) => void;
  blobUrlRef: React.MutableRefObject<string | null>;
}

export default function Waveform({ buffer, containerRef, onReady, onUnmount, onPlayStateChange, onTimeUpdate, onRegionChange, blobUrlRef }: WaveformProps) {
  const wsRef = useRef<WaveSurferInstance | null>(null);
  const regionsRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Destroy existing instance if present
    if (wsRef.current) {
      wsRef.current.destroy();
    }

    // Create new WaveSurfer instance
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

    // Generate blob URL for this load
    const blobUrl = URL.createObjectURL(audioBufferToWav(buffer));
    blobUrlRef.current = blobUrl;
    ws.load(blobUrl);

    let activeRegion: any = null;
    regions.enableDragSelection({
      color: 'hsla(174, 72%, 50%, 0.15)',
    });

    regions.on('region-created', (region: any) => {
      if (activeRegion && activeRegion !== region) {
        activeRegion.remove();
      }
      activeRegion = region;
      region.setOptions({
        color: 'hsla(174, 72%, 50%, 0.25)',
      });
      onRegionChange({ start: region.start, end: region.end });
    });

    regions.on('region-updated', (region: any) => {
      onRegionChange({ start: region.start, end: region.end });
    });

    ws.on('timeupdate', (time: number) => onTimeUpdate(time));
    ws.on('play', () => onPlayStateChange(true));
    ws.on('pause', () => onPlayStateChange(false));
    ws.on('finish', () => onPlayStateChange(false));

    // Store regions ref for cleanup
    regionsRef.current = regions;
    
    // Add getRegions method and regions to the ws object
    const wsWithRegions = Object.assign(ws, {
      getRegions: () => regions.getRegions(),
      regions: regions
    }) as WaveSurferInstance;
    
    wsRef.current = wsWithRegions;
    onReady(wsWithRegions);

    // Cleanup on unmount
    return () => {
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = null;
      }
      if (wsRef.current) {
        wsRef.current.destroy();
      }
      onUnmount();
    };
  }, [buffer, onReady, onUnmount, onPlayStateChange, onTimeUpdate, onRegionChange, blobUrlRef]);

  return null;
}
