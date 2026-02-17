'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Link2, Youtube, Music, Menu, X } from 'lucide-react';

const TOOLS = [
  { name: 'URL Shortener', href: '/tools/url-shortener', icon: Link2 },
  { name: 'YouTube Downloader', href: '/tools/youtube-downloader', icon: Youtube },
  { name: 'Audio Studio', href: '/tools/audio-editor', icon: Music },
];

export const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const closeMenu = () => setMobileOpen(false);

  // SSR fallback - show clickable LUV text
  if (!isClient) {
    return (
      <nav className="fixed top-0 left-0 w-full z-50 flex justify-center py-6 px-4">
        <div className="rounded-full px-6 py-3 flex items-center gap-8 md:gap-16 border border-white/10 bg-neutral-900/60 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.8)]">
          <a href="/" className="lg:hidden font-bold tracking-tighter text-xl text-foreground">
            LUV<span className="text-accent">.</span>
          </a>
          <a href="/" className="hidden lg:flex font-bold tracking-tighter text-xl text-foreground hover:opacity-80 transition-opacity">
            LUV<span className="text-accent">.</span>
          </a>
          <div className="hidden lg:flex items-center gap-10">
            <a href="/#about" className="text-xs uppercase tracking-wider font-bold text-white/50 hover:text-white transition-colors">About</a>
            <a href="/#projects" className="text-xs uppercase tracking-wider font-bold text-white/50 hover:text-white transition-colors">Projects</a>
            <a href="/tools" className="text-xs uppercase tracking-wider font-bold text-white/50 hover:text-white transition-colors">Tools</a>
          </div>
          <a href="/#contact" className="hidden lg:flex px-6 py-2 bg-accent text-background text-xs font-bold uppercase tracking-wider rounded-full hover:bg-accent/80 transition-colors">
            Connect
          </a>
        </div>
      </nav>
    );
  }

  return (
    <nav className="fixed top-0 left-0 w-full z-50 flex justify-center py-6 px-4">
      <div className="rounded-full px-6 py-3 flex items-center gap-8 md:gap-16 border border-white/10 bg-neutral-900/60 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.8)]">
        {/* Mobile Logo - Links to home */}
        <a href="/" className="lg:hidden font-bold tracking-tighter text-xl text-foreground hover:opacity-80 transition-opacity">
          LUV<span className="text-accent">.</span>
        </a>

        {/* Desktop Logo */}
        <a href="/" className="hidden lg:flex font-bold tracking-tighter text-xl text-foreground hover:opacity-80 transition-opacity">
          LUV<span className="text-accent">.</span>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-10">
          <a href="/#about" className="text-xs uppercase tracking-wider font-bold text-white/50 hover:text-white transition-colors">
            About
          </a>
          <a href="/#projects" className="text-xs uppercase tracking-wider font-bold text-white/50 hover:text-white transition-colors">
            Projects
          </a>
          {/* Desktop Tools Dropdown */}
          <div className="relative group">
            <a href="/tools" className="text-xs uppercase tracking-wider font-bold text-white/50 hover:text-white transition-colors">
              Tools
            </a>
            <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity">
              <div className="bg-neutral-900/95 border border-white/10 rounded-xl shadow-2xl overflow-hidden min-w-[220px]">
                {TOOLS.map((tool) => (
                  <a
                    key={tool.name}
                    href={tool.href}
                    className="flex items-center gap-3 px-4 py-3 text-xs uppercase font-bold text-white/50 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <tool.icon className="w-4 h-4" />
                    <span>{tool.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Connect */}
        <a href="/#contact" className="hidden lg:flex px-6 py-2 bg-accent text-background text-xs font-bold uppercase tracking-wider rounded-full hover:bg-accent/80 transition-colors">
          Connect
        </a>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden p-2 text-white/70 hover:text-white transition-colors"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-[9998] lg:hidden"
          onClick={() => setMobileOpen(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          {/* Menu */}
          <div
            className="absolute top-20 left-1/2 -translate-x-1/2 w-[90vw] max-w-[320px] bg-neutral-900/95 border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-2">
              {/* About */}
              <a
                href="/#about"
                onClick={closeMenu}
                className="block px-4 py-4 text-sm uppercase tracking-wider font-bold text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                About
              </a>
              {/* Projects */}
              <a
                href="/#projects"
                onClick={closeMenu}
                className="block px-4 py-4 text-sm uppercase tracking-wider font-bold text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                Projects
              </a>
              {/* Tools Section */}
              <a
                href="/tools"
                onClick={closeMenu}
                className="block px-4 py-3 text-sm uppercase tracking-wider font-bold text-accent bg-white/5 rounded-lg mt-1"
              >
                Tools
              </a>
              <div className="pl-4 pb-2">
                {TOOLS.map((tool) => (
                  <a
                    key={tool.name}
                    href={tool.href}
                    onClick={closeMenu}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-white/50 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <tool.icon className="w-4 h-4 text-accent" />
                    <span>{tool.name}</span>
                  </a>
                ))}
              </div>
              {/* Connect */}
              <a
                href="/#contact"
                onClick={closeMenu}
                className="block px-4 py-4 text-sm uppercase tracking-wider font-bold text-accent border-t border-white/10 mt-2 hover:bg-white/5 rounded-lg transition-colors"
              >
                Connect
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
