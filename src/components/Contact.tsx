"use client";

import { motion } from "framer-motion";
import { Send, MessageSquare, Terminal } from "lucide-react";

export const Contact = () => {
  return (
    <section id="contact" className="py-24 relative overflow-hidden bg-grid-pattern">
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto border border-grid-strong bg-neutral-900/40 backdrop-blur-sm p-8 md:p-16 rounded-xs relative group overflow-hidden">
          {/* Decorative Corner */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-6 text-center md:text-left">
              <div className="space-y-4">
                <div className="flex items-center justify-center md:justify-start gap-3 text-accent-muted">
                  <Terminal className="w-4 h-4 text-accent/50" />
                  <span className="text-xs font-mono uppercase tracking-[0.3em]">Get in Touch</span>
                </div>
                
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                  Ready to{" "}
                  <span className="text-accent underline decoration-grid-strong underline-offset-[12px] decoration-4">
                    Build Something
                  </span>?
                </h2>
                
                <p className="text-accent-muted text-lg max-w-md leading-relaxed">
                  Whether you have a clear project in mind or just know you need help streamlining 
                  something, let's talk. No pressure, no sales pitches—just a conversation about 
                  what you're trying to solve.
                </p>
                
                <p className="text-accent-muted/70 text-sm max-w-md">
                  Response time: Usually within a few hours. Emergency? Mention it and I'll prioritize.
                </p>
              </div>
              
              <div className="pt-4 flex justify-center md:justify-start">
                <a
                  href="https://www.linkedin.com/in/luv-patel97/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-accent text-background px-8 py-4 font-mono font-bold text-sm tracking-widest hover:bg-accent-muted transition-all duration-300 group shadow-lg shadow-accent/10"
                >
                  Start a Conversation
                  <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </a>
              </div>
            </div>
            
            <div className="w-full md:w-auto flex flex-col items-center group/icon">
              <div className="relative w-32 h-32 flex items-center justify-center border border-grid-strong rounded-full bg-neutral-900/80 group-hover:border-accent/30 transition-colors duration-500">
                <MessageSquare className="w-12 h-12 text-accent/20 group-hover/icon:text-accent/60 transition-colors duration-500" />
                {/* Rotating Ring */}
                <div className="absolute inset-0 border border-t-accent/40 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-[spin_4s_linear_infinite]" />
              </div>
              <div className="mt-6 text-[10px] font-mono text-accent-muted tracking-[0.5em] uppercase">
                Usually Online
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
