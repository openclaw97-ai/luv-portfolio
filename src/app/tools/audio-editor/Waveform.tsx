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
  zoom: number;
  onReady: (ws: WaveSurferInstance) => void;
  onUnmount: () => void;
  onPlayStateChange: (playing: boolean) => void;
  onTimeUpdate: (time: number) => void;
  onRegionChange: (region: { start: number; end: number } | null) => void;
  blobUrlRef: React.MutableRefObject<string | null>;
}

export default function Waveform({ buffer, containerRef, zoom, onReady, onUnmount, onPlayStateChange, onTimeUpdate, onRegionChange, blobUrlRef }: WaveformProps) {
  const wsRef = useRef<WaveSurferInstance | null>(null);
  const isInternalReady = useRef(false);

  // Handle zoom changes safely
  useEffect(() => {
    if (wsRef.current && isInternalReady.current) {
      try {
        wsRef.current.zoom(zoom);
      } catch (e) {
        console.warn('Zoom failed: audio not ready');
      }
    }
  }, [zoom]);

  useEffect(() => {
    if (!containerRef.current) return;

    isInternalReady.current = false;

    // Destroy existing instance if present
    if (wsRef.current) {
      wsRef.current.destroy();
    }

    // Create new WaveSurfer instance
    const regions = RegionsPlugin.create();
    const ws = WaveSurfer.create({
      container: containerRef.current,
      waveColor: 'rgba(255, 255, 255, 0.3)',
      progressColor: '#ffffff',
      cursorColor: '#ffffff',
      cursorWidth: 1,
      height: 180,
      barWidth: 2,
      barGap: 1,
      barRadius: 2,
      normalize: true,
      autoScroll: true,
      plugins: [regions],
    });

    // Ensure container handles horizontal scroll when zoomed
    if (containerRef.current) {
      containerRef.current.style.overflowX = 'auto';
      containerRef.current.style.overflowY = 'hidden';
    }

    // Generate blob URL for this load
    const blobUrl = URL.createObjectURL(audioBufferToWav(buffer));
    blobUrlRef.current = blobUrl;
    
    // Handle the load promise to catch AbortErrors
    ws.load(blobUrl).catch((err) => {
      if (err.name === 'AbortError') return;
      console.error('WaveSurfer load error:', err);
    });

    let activeRegion: any = null;
    regions.enableDragSelection({
      color: 'rgba(255, 255, 255, 0.1)',
    });

    regions.on('region-created', (region: any) => {
      // Clear previous region when starting a new selection
      regions.getRegions().forEach((r: any) => {
        if (r !== region) r.remove();
      });
      
      activeRegion = region;
      region.setOptions({
        color: 'rgba(255, 255, 255, 0.2)',
        borderColor: 'rgba(255, 255, 255, 0.5)',
        borderWidth: 1,
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

    // Double-click to clear selection
    ws.on('dblclick', () => {
      regions.getRegions().forEach((r: any) => r.remove());
      activeRegion = null;
      onRegionChange(null);
    });

    // Add getRegions method and regions to the ws object
    const wsWithRegions = Object.assign(ws, {
      getRegions: () => regions.getRegions(),
      regions: regions
    }) as WaveSurferInstance;
    
    wsRef.current = wsWithRegions;
    
    ws.on('ready', () => {
      isInternalReady.current = true;
      // Apply initial zoom if needed
      if (zoom > 0) ws.zoom(zoom);
      onReady(wsWithRegions);
    });

    // Cleanup on unmount
    return () => {
      isInternalReady.current = false;
      const currentWs = wsRef.current;
      wsRef.current = null;
      
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = null;
      }
      
      if (currentWs) {
        currentWs.destroy();
      }
      onUnmount();
    };
  }, [buffer, onReady, onUnmount, onPlayStateChange, onTimeUpdate, onRegionChange, blobUrlRef]);

  return null;
}
