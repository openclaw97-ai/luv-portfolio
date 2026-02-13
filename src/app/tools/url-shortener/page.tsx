'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Link2, ArrowLeft, Copy, Check, Scissors, Trash2, ExternalLink } from 'lucide-react';

interface ShortenedLink {
  shortUrl: string;
  originalUrl: string;
  createdAt: number;
}

export default function URLShortener() {
  const [url, setUrl] = useState('');
  const [shortened, setShortened] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<ShortenedLink[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('shortened-links');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch {
        setHistory([]);
      }
    }
  }, []);

  const handleShorten = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setShortened(null);

    try {
      const encodedUrl = encodeURIComponent(url);
      const response = await fetch(`https://tinyurl.com/api-create.php?url=${encodedUrl}`);
      
      if (!response.ok) throw new Error('Failed to shorten URL');
      
      const shortUrl = await response.text();
      
      if (!shortUrl || shortUrl.startsWith('Error') || !shortUrl.includes('tinyurl.com')) {
        throw new Error('URL shortening failed');
      }

      setShortened(shortUrl);
      
      const newLink: ShortenedLink = {
        shortUrl,
        originalUrl: url,
        createdAt: Date.now(),
      };
      
      const updated = [newLink, ...history.slice(0, 19)];
      setHistory(updated);
      localStorage.setItem('shortened-links', JSON.stringify(updated));
      setUrl('');
    } catch (err) {
      setError('Failed to shorten URL. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string, index?: number) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Fallback for non-secure contexts (non-localhost HTTP)
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.cssText = 'position:fixed;left:-9999px;top:-9999px;opacity:0;';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    if (index !== undefined) {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } else {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const deleteLink = (index: number) => {
    const updated = history.filter((_, i) => i !== index);
    setHistory(updated);
    localStorage.setItem('shortened-links', JSON.stringify(updated));
  };

  const formatDate = (ts: number) => {
    return new Date(ts).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 z-[-1] bg-grid-pattern opacity-50 pointer-events-none" />
      <div className="fixed inset-0 z-[-1] bg-[radial-gradient(circle_at_center,transparent_0%,#050505_100%)] pointer-events-none" />
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12 pt-32">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <Link href="/tools" className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-accent-muted hover:text-accent transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Tools
          </Link>
          <div className="flex items-center gap-3 text-accent-muted mb-4">
            <Link2 className="w-5 h-5 text-accent" />
            <span className="text-xs font-mono uppercase tracking-[0.3em]">Function_URL_Shortener</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4"> URL <span className="text-accent">Shortener</span> </h1>
          <p className="text-accent-muted max-w-xl"> Generate shortened links using TinyURL. Works everywhere.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="max-w-2xl">
          <form onSubmit={handleShorten} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase tracking-widest text-accent-muted"> Long URL </label>
              <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com/super-long-url-path" required className="w-full px-4 py-3 bg-neutral-900/50 border border-grid-strong text-foreground placeholder:text-accent-muted/50 focus:border-accent focus:outline-none transition-colors text-sm" />
            </div>
            {error && <div className="text-error text-sm">{error}</div>}
            <button type="submit" disabled={loading || !url} className="inline-flex items-center gap-3 bg-accent text-background px-8 py-4 font-mono font-bold text-sm tracking-widest hover:bg-accent-muted transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              <Scissors className="w-4 h-4" /> {loading ? 'Processing...' : 'Shorten URL'}
            </button>
          </form>

          {shortened && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 p-6 border border-accent/20 bg-success/10">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-accent-muted block mb-1"> Shortened URL </span>
                  <code className="text-accent font-mono text-lg break-all">{shortened}</code>
                </div>
                <button onClick={() => copyToClipboard(shortened)} className="flex items-center gap-2 px-4 py-2 border border-accent/20 bg-accent/10 hover:bg-accent/20 text-accent transition-colors">
                  {copied ? <><Check className="w-4 h-4" /> Copied</> : <><Copy className="w-4 h-4" /> Copy</>}
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>

        {history.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-16 pt-16 border-t border-grid-strong/50">
            <h2 className="text-xl font-bold tracking-tight mb-6 text-accent-muted"> Recent Links (this browser) </h2>
            <div className="space-y-4">
              {history.map((link, i) => (
                <div key={i} className="p-4 border border-grid-strong bg-neutral-900/30 flex items-center justify-between gap-4 flex-wrap">
                  <div className="min-w-0 flex-1">
                    <code className="text-accent font-mono text-sm">{link.shortUrl}</code>
                    <p className="text-xs text-accent-muted/60 truncate">→ {link.originalUrl}</p>
                    <span className="text-[10px] text-accent-muted/40">{formatDate(link.createdAt)}</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => copyToClipboard(link.shortUrl, i)} className={`p-2 transition-colors ${copiedIndex === i ? 'bg-success/20 text-success' : 'hover:bg-accent/10 text-accent'}`} title={copiedIndex === i ? 'Copied!' : 'Copy'}>
                      {copiedIndex === i ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <a href={link.shortUrl} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-accent/10 text-accent transition-colors" title="Open">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <button onClick={() => deleteLink(i)} className="p-2 hover:bg-error/10 text-error transition-colors" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
