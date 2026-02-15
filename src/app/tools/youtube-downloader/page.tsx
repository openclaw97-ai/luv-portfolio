'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Youtube, ArrowLeft, Download, Video, Music, Loader2 } from 'lucide-react';

const API_URL = 'http://192.168.68.101:3001';

export default function YouTubeDownloader() {
  const [url, setUrl] = useState('');
  const [format, setFormat] = useState<'mp4' | 'mp3'>('mp4');
  const [loading, setLoading] = useState(false);
  const [videoInfo, setVideoInfo] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFetch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setVideoInfo(null);

    try {
      const response = await fetch(`${API_URL}/api/info`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Error ${response.status}`);
      }

      const data = await response.json();
      setVideoInfo({
        title: data.title,
        thumbnail: data.thumbnail,
        duration: data.duration,
        author: data.uploader,
      });
    } catch (err: any) {
      setError(err.message || 'Failed to fetch video info');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!videoInfo) return;
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/download`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url,
          formatId: format === 'mp3' ? 'bestaudio' : 'best',
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Error ${response.status}`);
      }

      // Get the blob and trigger immediate download
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `${videoInfo.title.replace(/[^a-zA-Z0-9]/g, '_')}.${format === 'mp3' ? 'mp3' : 'mp4'}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err: any) {
      setError(err.message || 'Download failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 z-[-1] bg-grid-pattern opacity-50 pointer-events-none" />
      <div className="fixed inset-0 z-[-1] bg-[radial-gradient(circle_at_center,transparent_0%,#050505_100%)] pointer-events-none" />
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12 pt-32">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <Link href="/tools.html" className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-accent-muted hover:text-accent transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Tools
          </Link>
          <div className="flex items-center gap-3 text-accent-muted mb-4">
            <Youtube className="w-5 h-5 text-accent" />
            <span className="text-xs font-mono uppercase tracking-[0.3em]">Function_YT_Downloader</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">YouTube <span className="text-accent">Downloader</span></h1>
          <p className="text-accent-muted max-w-xl">Download videos and audio from YouTube. Supports MP4 and MP3 formats.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="max-w-2xl">
          <form onSubmit={handleFetch} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase tracking-widest text-accent-muted">YouTube URL</label>
              <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://youtube.com/watch?v=..." required className="w-full px-4 py-3 bg-neutral-900/50 border border-grid-strong text-foreground placeholder:text-accent-muted/50 focus:border-accent focus:outline-none transition-colors text-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase tracking-widest text-accent-muted">Format</label>
              <div className="flex gap-4">
                <button type="button" onClick={() => setFormat('mp4')} className={`flex items-center gap-2 px-6 py-3 border transition-all ${format === 'mp4' ? 'border-accent bg-accent/10 text-accent' : 'border-grid-strong text-accent-muted hover:border-accent/50'}`}>
                  <Video className="w-4 h-4" /><span className="text-sm font-medium">MP4 (Video)</span>
                </button>
                <button type="button" onClick={() => setFormat('mp3')} className={`flex items-center gap-2 px-6 py-3 border transition-all ${format === 'mp3' ? 'border-accent bg-accent/10 text-accent' : 'border-grid-strong text-accent-muted hover:border-accent/50'}`}>
                  <Music className="w-4 h-4" /><span className="text-sm font-medium">MP3 (Audio)</span>
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading || !url} className="inline-flex items-center gap-3 bg-accent text-background px-8 py-4 font-mono font-bold text-sm tracking-widest hover:bg-accent-muted transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Fetching...</> : <><Download className="w-4 h-4" /> Fetch Info</>}
            </button>
          </form>

          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 p-4 border border-red-500/30 bg-red-500/10 text-red-400 text-sm">{error}</motion.div>
          )}

          {videoInfo && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 p-6 border border-grid-strong bg-neutral-900/40">
              <div className="flex gap-6 flex-col md:flex-row">
                <img src={videoInfo.thumbnail} alt={videoInfo.title} className="w-full md:w-64 aspect-video object-cover border border-grid-strong" />
                <div className="flex-1 space-y-3">
                  <h3 className="text-lg font-bold text-foreground">{videoInfo.title}</h3>
                  <p className="text-sm text-accent-muted">{videoInfo.author}</p>
                  <p className="text-sm text-accent-muted">Duration: {videoInfo.duration}s</p>
                  <button onClick={handleDownload} disabled={loading} className="inline-flex items-center gap-2 bg-accent text-background px-6 py-3 font-mono font-bold text-xs tracking-widest hover:bg-accent-muted transition-all mt-4 disabled:opacity-50">
                    {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Downloading...</> : <><Download className="w-4 h-4" /> Download {format.toUpperCase()}</>}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
