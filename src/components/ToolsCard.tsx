"use client";

import { motion } from "framer-motion";
import { Wrench, Clock, Shield, Zap } from "lucide-react";

export const ToolsCard = () => {
  const tags = ["Productivity", "Web Tools", "Free"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="group relative overflow-hidden rounded-xs border border-grid-strong bg-neutral-900/40 p-8 backdrop-blur-sm"
    >
      {/* Engineering Corner Accents */}
      <div className="absolute top-0 left-0 h-8 w-8 border-t border-l border-accent/20 transition-colors group-hover:border-accent/60" />
      <div className="absolute bottom-0 right-0 h-8 w-8 border-b border-r border-accent/20 transition-colors group-hover:border-accent/60" />

      {/* Background Decorative Pattern */}
      <div className="absolute inset-0 -z-10 opacity-5 transition-opacity group-hover:opacity-10">
        <div className="h-full w-full bg-[radial-gradient(var(--color-accent)_1px,transparent_1px)] [background-size:16px_16px]" />
      </div>

      <div className="flex flex-col gap-6">
        {/* Header Section */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-accent">
              <Wrench size={18} />
              <span className="text-[10px] font-mono uppercase tracking-[0.2em]">
                Free Utilities
              </span>
            </div>
            <h3 className="text-3xl font-bold tracking-tight text-foreground transition-colors group-hover:text-accent">
              Web Tools Suite
            </h3>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-grid-strong bg-neutral-900 group-hover:border-accent/40 transition-colors">
            <Zap className="text-accent/40 group-hover:text-accent group-hover:animate-pulse transition-colors" />
          </div>
        </div>

        {/* Content Section */}
        <div className="space-y-4">
          <p className="text-accent-muted leading-relaxed font-sans text-lg">
            A collection of free, privacy-focused utilities designed to eliminate annoying 
            tasks from your daily workflow. URL shorteners, download helpers, and more—built 
            because I was tired of ad-ridden alternatives that harvest your data.
          </p>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-full border border-accent/20 bg-accent/5 px-3 py-1 text-[10px] font-mono text-accent uppercase tracking-wider"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Technical Footer Section */}
        <div className="mt-4 grid grid-cols-2 gap-4 border-t border-grid pt-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center bg-neutral-800 border border-grid">
              <Shield size={14} className="text-accent/60" />
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-mono uppercase text-accent-muted">Privacy</span>
              <span className="text-xs font-semibold text-foreground italic">No Tracking</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center bg-neutral-800 border border-grid">
              <Clock size={14} className="text-accent/60" />
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-mono uppercase text-accent-muted">Time Saved</span>
              <span className="text-xs font-semibold text-foreground italic">5-10 min/task</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hover Scanning Line Effect */}
      <motion.div
        initial={{ top: "-100%" }}
        whileHover={{ top: "100%" }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        className="absolute left-0 right-0 h-px bg-accent/20 blur-[1px] pointer-events-none"
      />
    </motion.div>
  );
};
