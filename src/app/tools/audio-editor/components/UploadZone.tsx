'use client';

import { useCallback, useState } from "react";
import { Upload, FileAudio } from "lucide-react";

interface UploadZoneProps {
  onFileLoaded: (file: File) => void;
}

const UploadZone = ({ onFileLoaded }: UploadZoneProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("audio/")) {
        onFileLoaded(file);
      }
    },
    [onFileLoaded]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) onFileLoaded(file);
    },
    [onFileLoaded]
  );

  return (
    <div className="flex items-center justify-center min-h-[70vh] px-8">
      <label
        className={`drop-zone ${isDragging ? "drop-zone-active" : ""} flex flex-col items-center justify-center w-full max-w-2xl py-24 px-8 cursor-pointer border-2 border-dashed border-border/30 rounded-xl hover:border-accent/40 bg-neutral-900/30 transition-all duration-300`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-6">
          {isDragging ? (
            <FileAudio className="w-8 h-8 text-accent animate-pulse" />
          ) : (
            <Upload className="w-8 h-8 text-accent" />
          )}
        </div>
        <h2 className="text-xl font-semibold text-foreground mb-2">
          Drop your audio file here
        </h2>
        <p className="text-sm text-accent-muted mb-6">
          or click to browse · WAV, MP3, OGG, FLAC, M4A
        </p>
        <div className="px-6 py-2.5 text-sm font-semibold bg-foreground text-background rounded-sm hover:bg-foreground/90 transition-colors shadow-lg">
          Choose File
        </div>
        <input
          type="file"
          accept="audio/*"
          onChange={handleFileInput}
          className="hidden"
        />
      </label>
    </div>
  );
};

export default UploadZone;
