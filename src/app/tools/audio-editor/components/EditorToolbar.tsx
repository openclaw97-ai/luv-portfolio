'use client';

import { Play, Pause, SkipBack, Scissors, Crop, ArrowDownToLine, Undo2, Redo2 } from 'lucide-react';
import { formatTime } from '@/lib/audio-utils';

interface EditorToolbarProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  hasRegion: boolean;
  canUndo: boolean;
  canRedo: boolean;
  fadeInDuration: number;
  fadeOutDuration: number;
  onPlayPause: () => void;
  onStop: () => void;
  onTrim: () => void;
  onCut: () => void;
  onFadeIn: () => void;
  onFadeOut: () => void;
  onDownload: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onFadeInChange: (val: number) => void;
  onFadeOutChange: (val: number) => void;
}

const EditorToolbar = ({
  isPlaying,
  currentTime,
  duration,
  hasRegion,
  canUndo,
  canRedo,
  fadeInDuration,
  fadeOutDuration,
  onPlayPause,
  onStop,
  onTrim,
  onCut,
  onFadeIn,
  onFadeOut,
  onDownload,
  onUndo,
  onRedo,
  onFadeInChange,
  onFadeOutChange,
}: EditorToolbarProps) => {
  return (
    <div className="border border-grid-strong bg-neutral-900/40 p-4 flex items-center gap-3 flex-wrap">
      {/* Playback */}
      <div className="flex items-center gap-2">
        <button
          onClick={onStop}
          className="inline-flex items-center justify-center px-3 py-2 border border-grid-strong bg-neutral-900 hover:border-accent/50 transition-all"
          title="Stop & rewind"
        >
          <SkipBack className="w-4 h-4 text-foreground" />
        </button>
        <button
          onClick={onPlayPause}
          className="inline-flex items-center justify-center px-3 py-2 bg-accent text-background hover:bg-accent-muted transition-all"
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
      </div>

      {/* Time display */}
      <div className="font-mono text-xs text-accent-muted px-3 min-w-[140px]">
        <span className="text-foreground">{formatTime(currentTime)}</span>
        <span className="mx-1">/</span>
        <span>{formatTime(duration)}</span>
      </div>

      <div className="w-px h-6 bg-grid-strong mx-1" />

      {/* Edit actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className="inline-flex items-center justify-center px-3 py-2 border border-grid-strong bg-neutral-900 hover:border-accent/50 disabled:opacity-30 disabled:hover:border-grid-strong transition-all"
          title="Undo"
        >
          <Undo2 className="w-4 h-4 text-foreground" />
        </button>
        <button
          onClick={onRedo}
          disabled={!canRedo}
          className="inline-flex items-center justify-center px-3 py-2 border border-grid-strong bg-neutral-900 hover:border-accent/50 disabled:opacity-30 disabled:hover:border-grid-strong transition-all"
          title="Redo"
        >
          <Redo2 className="w-4 h-4 text-foreground" />
        </button>
      </div>

      <div className="w-px h-6 bg-grid-strong mx-1" />

      <div className="flex items-center gap-2">
        <button
          onClick={onTrim}
          disabled={!hasRegion}
          className="inline-flex items-center justify-center px-3 py-2 border border-grid-strong bg-neutral-900 hover:border-accent/50 disabled:opacity-30 disabled:hover:border-grid-strong transition-all"
          title="Trim to selection"
        >
          <Crop className="w-4 h-4 text-foreground" />
          <span className="ml-1.5 hidden sm:inline text-foreground text-xs">Trim</span>
        </button>
        <button
          onClick={onCut}
          disabled={!hasRegion}
          className="inline-flex items-center justify-center px-3 py-2 border border-red-500/50 bg-red-500/10 hover:bg-red-500/20 disabled:opacity-30 disabled:hover:bg-red-500/10 transition-all"
          title="Cut selection"
        >
          <Scissors className="w-4 h-4 text-red-400" />
          <span className="ml-1.5 hidden sm:inline text-red-400 text-xs">Cut</span>
        </button>
      </div>

      <div className="w-px h-6 bg-grid-strong mx-1" />

      {/* Faders */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-xs text-accent-muted whitespace-nowrap font-mono">Fade In</span>
          <input
            type="range"
            min={0}
            max={5}
            step={0.1}
            value={fadeInDuration}
            onChange={(e) => onFadeInChange(parseFloat(e.target.value))}
            className="w-20 h-1 accent-accent bg-grid-strong cursor-pointer"
          />
          <span className="text-xs font-mono text-accent-muted w-10">{fadeInDuration.toFixed(1)}s</span>
          <button
            onClick={onFadeIn}
            className="inline-flex items-center justify-center px-3 py-1.5 border border-yellow-500/50 bg-yellow-500/10 hover:bg-yellow-500/20 transition-all text-xs text-yellow-400"
            title="Apply fade in"
          >
            Apply
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-accent-muted whitespace-nowrap font-mono">Fade Out</span>
          <input
            type="range"
            min={0}
            max={5}
            step={0.1}
            value={fadeOutDuration}
            onChange={(e) => onFadeOutChange(parseFloat(e.target.value))}
            className="w-20 h-1 accent-accent bg-grid-strong cursor-pointer"
          />
          <span className="text-xs font-mono text-accent-muted w-10">{fadeOutDuration.toFixed(1)}s</span>
          <button
            onClick={onFadeOut}
            className="inline-flex items-center justify-center px-3 py-1.5 border border-yellow-500/50 bg-yellow-500/10 hover:bg-yellow-500/20 transition-all text-xs text-yellow-400"
            title="Apply fade out"
          >
            Apply
          </button>
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1 hidden lg:block" />

      {/* Download */}
      <button
        onClick={onDownload}
        className="inline-flex items-center gap-2 bg-accent text-background px-4 py-3 font-mono font-bold text-xs tracking-widest hover:bg-accent-muted transition-all"
        title="Download WAV"
      >
        <ArrowDownToLine className="w-4 h-4" />
        <span>Export WAV</span>
      </button>
    </div>
  );
};

export default EditorToolbar;
