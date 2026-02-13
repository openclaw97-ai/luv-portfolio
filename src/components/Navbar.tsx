'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Link2, Youtube, ArrowRight } from 'lucide-react';

const TOOLS = [
  { name: 'URL Shortener', href: '/tools/url-shortener', icon: Link2 },
  { name: 'YouTube Downloader', href: '/tools/youtube-downloader', icon: Youtube },
];

const NAV_LINKS = [
  { name: 'About', href: '#about', isSection: true },
  { name: 'Projects', href: '#projects', isSection: true },
  { name: 'Tools', href: '/tools', hasDropdown: true },
];

export const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const pathname = usePathname();
  const isToolsPage = pathname?.startsWith('/tools');

  const handleNavClick = (href: string, isSection: boolean) => {
    if (isToolsPage && isSection) {
      window.location.href = `/${href}`;
      return;
    }
    
    if (href.startsWith('/')) {
      window.location.href = href;
      return;
    }
    
    const element = document.getElementById(href.replace('#', ''));
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToContact = () => {
    if (isToolsPage) {
      window.location.href = '/#contact';
      return;
    }
    
    const element = document.getElementById('contact');
    if (element) {
      const telegramButton = element.querySelector('a[href*="t.me/lovie97"]');
      if (telegramButton) {
        telegramButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
        telegramButton.classList.add('animate-pulse');
        setTimeout(() => telegramButton.classList.remove('animate-pulse'), 2000);
      } else {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 flex justify-center py-10 px-4 pointer-events-none">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="rounded-full px-8 py-4 flex items-center gap-16 pointer-events-auto border border-white/10 bg-neutral-900/40 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.8)]"
      >
        <Link href="/" className="font-bold tracking-tighter text-xl group text-foreground">
          LUV<span className="text-accent group-hover:text-accent/80 transition-colors">.</span>
        </Link>
        <div className="hidden lg:flex items-center gap-10">
          {NAV_LINKS.map((link) => (
            <div
              key={link.name}
              className="relative"
              onMouseEnter={() => link.hasDropdown && setShowDropdown(true)}
              onMouseLeave={() => link.hasDropdown && setShowDropdown(false)}
            >
              <button
                onClick={() => handleNavClick(link.href, link.isSection || false)}
                className="text-[10px] uppercase tracking-[0.3em] font-bold text-accent-muted hover:text-accent transition-colors"
              >
                {link.name}
              </button>
              
              {/* Dropdown for Tools */}
              <AnimatePresence>
                {link.hasDropdown && showDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 pt-4"
                  >
                    <div className="border border-white/10 bg-neutral-900/80 backdrop-blur-xl rounded-sm overflow-hidden shadow-[0_8px_32px_0_rgba(0,0,0,0.8)] min-w-[220px]">
                      {TOOLS.map((tool) => (
                        <Link
                          key={tool.name}
                          href={tool.href}
                          className="flex items-center gap-3 px-4 py-3 text-[10px] uppercase tracking-[0.2em] font-bold text-accent-muted hover:text-accent hover:bg-white/5 transition-all group border-b border-white/5 last:border-0"
                        >
                          <tool.icon className="w-4 h-4 text-accent/50 group-hover:text-accent transition-colors" />
                          <span>{tool.name}</span>
                          <ArrowRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
        <button
          onClick={scrollToContact}
          className="hidden md:block px-6 py-2 bg-accent text-background text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-accent-muted transition-colors shadow-2xl"
        >
          Connect
        </button>
      </motion.div>
    </nav>
  );
};
