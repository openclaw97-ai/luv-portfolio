'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Link2, Youtube, ArrowRight } from 'lucide-react';

const TOOLS = [
  {
    id: 'url-shortener',
    name: 'URL Shortener',
    description: 'Generate shortened links with custom aliases',
    icon: Link2,
    href: '/tools/url-shortener',
    tags: ['Utility', 'Web'],
  },
  {
    id: 'youtube-downloader',
    name: 'YouTube Downloader',
    description: 'Download videos and audio from YouTube',
    icon: Youtube,
    href: '/tools/youtube-downloader',
    tags: ['Media', 'Download'],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function FunctionsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Background */}
      <div className="fixed inset-0 z-[-1] bg-grid-pattern opacity-50 pointer-events-none" />
      <div className="fixed inset-0 z-[-1] bg-[radial-gradient(circle_at_center,transparent_0%,#050505_100%)] pointer-events-none" />

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12 pt-32">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 space-y-4"
        >
          <div className="flex items-center gap-3 text-accent-muted">
            <div className="h-px w-8 bg-accent/30" />
            <span className="text-xs font-mono uppercase tracking-[0.3em]">Tool_Registry</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            Utility <span className="text-accent underline decoration-grid-strong underline-offset-[12px] decoration-4">Functions</span>
          </h1>
          <p className="text-lg text-accent-muted max-w-2xl">
            Lightweight utilities built for efficiency. No tracking, no bloat.
          </p>
        </motion.div>

        {/* Tools Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {TOOLS.map((tool) => (
            <motion.div key={tool.id} variants={itemVariants}>
              <Link
                href={tool.href}
                className="group relative overflow-hidden rounded-sm border border-grid-strong bg-neutral-900/40 p-8 backdrop-blur-sm block hover:border-accent/40 transition-all duration-300"
              >
                {/* Corner accents */}
                <div className="absolute top-0 left-0 h-8 w-8 border-t border-l border-accent/20 transition-colors group-hover:border-accent/60" />
                <div className="absolute bottom-0 right-0 h-8 w-8 border-b border-r border-accent/20 transition-colors group-hover:border-accent/60" />

                <div className="flex flex-col gap-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-accent">
                        <tool.icon className="w-5 h-5" />
                        <span className="text-[10px] font-mono uppercase tracking-[0.2em]">Function_{tool.id}</span>
                      </div>
                      <h2 className="text-3xl font-bold tracking-tight text-foreground transition-colors group-hover:text-accent">
                        {tool.name}
                      </h2>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-grid-strong bg-neutral-900 group-hover:border-accent/40 transition-colors">
                      <ArrowRight className="w-5 h-5 text-accent/40 group-hover:text-accent transition-colors" />
                    </div>
                  </div>

                  <p className="text-accent-muted leading-relaxed">
                    {tool.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {tool.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-full border border-accent/20 bg-accent/5 px-3 py-1 text-[10px] font-mono text-accent uppercase tracking-wider"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Back to Home */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-accent-muted hover:text-accent transition-colors"
          >
            ← Return to Portfolio
          </Link>
        </motion.div>
      </main>
    </div>
  );
}