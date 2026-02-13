'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Link2, ArrowLeft, Copy, Check, Scissors } from 'lucide-react';

export default function URLShortener() {
  const [url, setUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [shortened, setShortened] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleShorten = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const alias = customAlias || Math.random().toString(36).substring(2, 8);
    setShortened(`https://luv.ink/${alias}`);
    setLoading(false);
  };

  const copyToClipboard = async () => {
    if (shortened) {
      await navigator.clipboard.writeText(shortened);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 z-[-1] bg-grid-pattern opacity-50 pointer-events-none" />
      <div className="fixed inset-0 z-[-1] bg-[radial-gradient(circle_at_center,transparent_0%,#050505_100%)] pointer-events-none" />

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12 pt-32">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-accent-muted hover:text-accent transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Tools
          </Link>
          
          <div className="flex items-center gap-3 text-accent-muted mb-4">
            <Link2 className="w-5 h-5 text-accent" />
            <span className="text-xs font-mono uppercase tracking-[0.3em]">Function_URL_Shortener</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            URL <span className="text-accent">Shortener</span>
          </h1>
          <p className="text-accent-muted max-w-xl">
            Generate shortened links with optional custom aliases. No tracking, no expiration.
          </p>
        </motion.div>

        {/* Shortener Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-2xl"
        >
          <form onSubmit={handleShorten} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase tracking-widest text-accent-muted">
                Long URL
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/super-long-url-path"
                required
                className="w-full px-4 py-3 bg-neutral-900/50 border border-grid-strong text-foreground placeholder:text-accent-muted/50 focus:border-accent focus:outline-none transition-colors text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase tracking-widest text-accent-muted">
                Custom Alias (optional)
              </label>
              <div className="flex gap-2">
                <span className="px-4 py-3 bg-neutral-900/30 border border-grid-strong border-r-0 text-accent-muted text-sm flex items-center">
                  luv.ink/
                </span>
                <input
                  type="text"
                  value={customAlias}
                  onChange={(e) => setCustomAlias(e.target.value)}
                  placeholder="my-link"
                  className="flex-1 px-4 py-3 bg-neutral-900/50 border border-grid-strong text-foreground placeholder:text-accent-muted/50 focus:border-accent focus:outline-none transition-colors text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !url}
              className="inline-flex items-center gap-3 bg-accent text-background px-8 py-4 font-mono font-bold text-sm tracking-widest hover:bg-accent-muted transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Scissors className="w-4 h-4" />
              {loading ? 'Processing...' : 'Shorten URL'}
            </button>
          </form>

          {/* Result */}
          {shortened && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 p-6 border border-accent/20 bg-success/10 rounded-sm"
            >
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-accent-muted block mb-1">
                    Shortened URL
                  </span>
                  <code className="text-accent font-mono text-lg">{shortened}</code>
                </div>
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-2 px-4 py-2 border border-accent/20 bg-accent/10 hover:bg-accent/20 text-accent transition-colors"
                >
                  {copied ? (
                    <><Check className="w-4 h-4" /> Copied</>
                  ) : (
                    <><Copy className="w-4 h-4" /> Copy</>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Recent Shortens */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-16 pt-16 border-t border-grid-strong/50"
        >
          <h2 className="text-xl font-bold tracking-tight mb-6 text-accent-muted">
            Recent Links
          </h2>
          <div className="text-sm text-accent-muted/60">
            No local storage. Links will appear here after implementation of backend storage.
          </div>
        </motion.div>
      </main>
    </div>
  );
}