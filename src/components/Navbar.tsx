'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const NAV_LINKS = [
  { name: 'About', href: '#about' },
  { name: 'Projects', href: '#projects' },
  { name: 'Contact', href: '#contact' },
];

export const Navbar = () => {
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
            <button 
              key={link.name} 
              onClick={() => {
                const element = document.getElementById(link.href.replace('#', ''));
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="text-[10px] uppercase tracking-[0.3em] font-bold text-accent-muted hover:text-accent transition-colors"
            >
              {link.name}
            </button>
          ))}
        </div>

        <button 
            onClick={() => {
                const element = document.getElementById('contact');
                if (element) {
                  // Find the specific telegram link within the contact section
                  const telegramButton = element.querySelector('a[href*="t.me/lovie97"]');
                  if (telegramButton) {
                    telegramButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    // Visual feedback: pulse the button after scroll
                    telegramButton.classList.add('animate-pulse');
                    setTimeout(() => telegramButton.classList.remove('animate-pulse'), 2000);
                  } else {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }
            }}
            className="hidden md:block px-6 py-2 bg-accent text-background text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-accent-muted transition-colors shadow-2xl"
        >
          Connect
        </button>
      </motion.div>
    </nav>
  );
};
