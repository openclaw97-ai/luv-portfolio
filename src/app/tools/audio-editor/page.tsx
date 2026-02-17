'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import WaveSurfer from 'wavesurfer.js';
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.js';
import { decodeAudioFile, audioBufferToWav, trimAudio, cutAudio, applyFadeIn, applyFadeOut } from '@/lib/audio-utils';
import UploadZone from './components/UploadZone';
import EditorToolbar from './components/EditorToolbar';
import Waveform from './Waveform';

type WaveSurferInstance = WaveSurfer & {
  regions: any;
  getRegions: () => any[];
  stop: () => void;
  setTime: (time: number) => void;
  pause: () => void;
  play: () => void;
 };

export default function AudioEditorPage() {
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hasRegion, setHasRegion] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [fadeInDuration, setFadeInDuration] = useState(1);
  const [fadeOutDuration, setFadeOutDuration] = useState(1);
  const [editKey, setEditKey] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const wsRef = useRef<WaveSurferInstance | null>(null);
  const containerRef = useRef<HTMLDivElement>(null!);
  const undoRef = useRef<AudioBuffer[]>([]);
  const redoRef = useRef<AudioBuffer[]>([]);
  const currentBufferRef = useRef<AudioBuffer | null>(null);
  const blobUrlRef = useRef<string | null>(null);

  // Cleanup blob URL on unmount
  useEffect(() => {
    return () => {
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
      }
      if (wsRef.current) {
        wsRef.current.destroy();
      }
    };
  }, []);

  const handleFileLoaded = useCallback(async (file: File) => {
    try {
      const buffer = await decodeAudioFile(file);
      setAudioBuffer(buffer);
      currentBufferRef.current = buffer;
      undoRef.current = [];
      redoRef.current = [];
      setCanUndo(false);
      setCanRedo(false);
      setDuration(buffer.duration);

      // Clean up any previous blob URL
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = null;
      }
      // Force waveform reload with new file
      setEditKey(prev => prev + 1);
    } catch (error) {
      console.error('Error loading audio file:', error);
    }
  }, []);

  const handleRegionChange = useCallback((region: { start: number; end: number } | null) => {
    setHasRegion(!!region);
  }, []);

  const handleTimeUpdate = useCallback((time: number) => {
    setCurrentTime(time);
  }, []);

  const handlePlayStateChange = useCallback((playing: boolean) => {
    setIsPlaying(playing);
  }, []);

  const handleReady = useCallback((ws: WaveSurferInstance) => {
    console.log('[DEBUG] Waveform ready, ws instance:', ws);
    wsRef.current = ws;
  }, []);

  const handleUnmount = useCallback(() => {
    console.log('[DEBUG] Waveform unmounting, clearing wsRef');
    wsRef.current = null;
  }, []);

  const handleStop = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.stop();
      wsRef.current.setTime(0);
      setCurrentTime(0);
      setIsPlaying(false);
    }
  }, []);

  const handlePlayPause = useCallback(() => {
    if (wsRef.current) {
      if (isPlaying) {
        wsRef.current.pause();
      } else {
        wsRef.current.play();
      }
    }
  }, [isPlaying]);

  const handleTrim = useCallback(() => {
    console.log('[DEBUG] handleTrim called');
    if (!wsRef.current || !currentBufferRef.current) {
      console.log('[DEBUG] Early return - wsRef or currentBuffer missing');
      return;
    }

    const regions = wsRef.current.getRegions();
    console.log('[DEBUG] Regions found:', regions.length, regions);
    if (regions.length === 0) {
      console.log('[DEBUG] No regions - returning early');
      return;
    }

    const region = regions[0];
    const startTime = region.start;
    const endTime = region.end;

    const trimmedBuffer = trimAudio(currentBufferRef.current, startTime, endTime);

    saveToUndo(trimmedBuffer);
    currentBufferRef.current = trimmedBuffer;
    setAudioBuffer(trimmedBuffer);
    setDuration(trimmedBuffer.duration);

    regions.forEach((r: any) => r.remove());
    setHasRegion(false);
    setCurrentTime(0);

    // Clean up current blob URL and force waveform reload
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
      blobUrlRef.current = null;
    }
    setEditKey(prev => prev + 1);
    if (wsRef.current) {
      wsRef.current.setTime(0);
    }
  }, []);

  const handleCut = useCallback(() => {
    console.log('[DEBUG] handleCut called');
    if (!wsRef.current || !currentBufferRef.current) {
      console.log('[DEBUG] Early return - wsRef or currentBuffer missing');
      return;
    }
    
    const regions = wsRef.current.getRegions();
    console.log('[DEBUG] Regions found:', regions.length, regions);
    if (regions.length === 0) {
      console.log('[DEBUG] No regions - returning early');
      return;
    }

    const region = regions[0];
    const startTime = region.start;
    const endTime = region.end;

    const cutBuffer = cutAudio(currentBufferRef.current, startTime, endTime);

    saveToUndo(cutBuffer);
    currentBufferRef.current = cutBuffer;
    setAudioBuffer(cutBuffer);
    setDuration(cutBuffer.duration);

    regions.forEach((r: any) => r.remove());
    setHasRegion(false);
    setCurrentTime(Math.min(currentTime, cutBuffer.duration));

    // Clean up current blob URL and force waveform reload
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
      blobUrlRef.current = null;
    }
    setEditKey(prev => prev + 1);
  }, [currentTime]);

  const handleFadeIn = useCallback(() => {
    if (!currentBufferRef.current) return;

    const fadedBuffer = applyFadeIn(currentBufferRef.current, fadeInDuration);
    saveToUndo(fadedBuffer);
    currentBufferRef.current = fadedBuffer;
    setAudioBuffer(fadedBuffer);

    // Clean up current blob URL and force waveform reload
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
      blobUrlRef.current = null;
    }
    setEditKey(prev => prev + 1);
  }, [fadeInDuration]);

  const handleFadeOut = useCallback(() => {
    if (!currentBufferRef.current) return;

    const fadedBuffer = applyFadeOut(currentBufferRef.current, fadeOutDuration);
    saveToUndo(fadedBuffer);
    currentBufferRef.current = fadedBuffer;
    setAudioBuffer(fadedBuffer);

    // Clean up current blob URL and force waveform reload
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
      blobUrlRef.current = null;
    }
    setEditKey(prev => prev + 1);
  }, [fadeOutDuration]);

  const handleDownload = useCallback(() => {
    if (!currentBufferRef.current) return;

    const wavBlob = audioBufferToWav(currentBufferRef.current);
    const url = URL.createObjectURL(wavBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'audio-edit.wav';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  const handleUndo = useCallback(() => {
    if (undoRef.current.length > 0) {
      const previousBuffer = undoRef.current[undoRef.current.length - 1];
      redoRef.current.push(currentBufferRef.current!);
      currentBufferRef.current = previousBuffer;
      setAudioBuffer(previousBuffer);
      setCanUndo(undoRef.current.length > 1);
      setCanRedo(true);

      // Clean up current blob URL and force waveform reload
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = null;
      }
      setEditKey(prev => prev + 1);
    }
  }, []);

  const handleRedo = useCallback(() => {
    if (redoRef.current.length > 0) {
      const nextBuffer = redoRef.current[redoRef.current.length - 1];
      undoRef.current.push(currentBufferRef.current!);
      currentBufferRef.current = nextBuffer;
      setAudioBuffer(nextBuffer);
      setCanRedo(redoRef.current.length > 1);
      setCanUndo(true);

      // Clean up current blob URL and force waveform reload
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = null;
      }
      setEditKey(prev => prev + 1);
    }
  }, []);

  const saveToUndo = useCallback((newBuffer: AudioBuffer) => {
    console.log('[DEBUG] saveToUndo called, newBuffer duration:', newBuffer.duration);
    undoRef.current.push(currentBufferRef.current!);
    setCanUndo(true);
    redoRef.current = [];
    setCanRedo(false);
    console.log('[DEBUG] Undo stack size:', undoRef.current.length);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 z-[-1] bg-grid-pattern opacity-50 pointer-events-none" />
      <div className="fixed inset-0 z-[-1] bg-[radial-gradient(circle_at_center,transparent_0%,#050505_100%)] pointer-events-none" />

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12 pt-32">
        <div className="mb-8 space-y-4">
          <div className="flex items-center gap-3 text-accent-muted">
            <div className="h-px w-8 bg-accent/30" />
            <span className="text-xs font-mono uppercase tracking-[0.3em]">Audio_Studio</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            Audio Editor
          </h1>
          <p className="text-lg text-accent-muted max-w-2xl">
            Edit, trim, cut, and apply fades to audio files. All processing happens in your browser.
          </p>
        </div>

        {audioBuffer ? (
          <div className="space-y-6">
            <EditorToolbar
              isPlaying={isPlaying}
              currentTime={currentTime}
              duration={duration}
              hasRegion={hasRegion}
              canUndo={canUndo}
              canRedo={canRedo}
              fadeInDuration={fadeInDuration}
              fadeOutDuration={fadeOutDuration}
              onPlayPause={handlePlayPause}
              onStop={handleStop}
              onTrim={handleTrim}
              onCut={handleCut}
              onFadeIn={handleFadeIn}
              onFadeOut={handleFadeOut}
              onDownload={handleDownload}
              onUndo={handleUndo}
              onRedo={handleRedo}
              onFadeInChange={setFadeInDuration}
              onFadeOutChange={setFadeOutDuration}
            />

            <div className="border border-grid-strong bg-neutral-900/40 p-4 relative">
              <div ref={containerRef} className="w-full min-h-[200px]">
                {audioBuffer && (
                  <Waveform
                key={editKey}
                buffer={audioBuffer}
                containerRef={containerRef}
                onReady={handleReady}
                onUnmount={handleUnmount}
                onPlayStateChange={handlePlayStateChange}
                onTimeUpdate={handleTimeUpdate}
                onRegionChange={handleRegionChange}
                blobUrlRef={blobUrlRef}
              />
                )}
              </div>
              <p className="text-xs text-accent-muted mt-3 text-center opacity-60">
                Click and drag on the waveform to select a region for editing
              </p>
            </div>
          </div>
        ) : (
          <UploadZone onFileLoaded={handleFileLoaded} />
        )}

        <div className="mt-16">
          <a
            href="/tools"
            className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-accent-muted hover:text-accent transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
            Back to Tools
          </a>
        </div>
      </main>
    </div>
  );
}
