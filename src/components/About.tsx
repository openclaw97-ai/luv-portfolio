"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export const About = () => {
  return (
    <section id="about" className="py-24 relative overflow-hidden">
      {/* Background Grid Pattern (Tighter for detail) */}
      <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(to_right,transparent,var(--color-grid-strong),transparent)]" />
      
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
          {/* Image Side */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full lg:w-[45%] relative group"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-xs border border-grid-strong bg-neutral-900/50">
              {/* Engineering Corner Accents */}
              <div className="absolute top-4 left-4 w-6 h-6 border-t border-l border-accent/20 z-20 group-hover:border-accent/50 transition-colors" />
              <div className="absolute bottom-4 right-4 w-6 h-6 border-b border-r border-accent/20 z-20 group-hover:border-accent/50 transition-colors" />
              
              <Image
                src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1000&auto=format&fit=crop" 
                alt="Luv - Autonomous Systems Engineer"
                fill
                className="object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-700 contrast-125"
                sizes="(max-width: 1024px) 100vw, 45vw"
              />
              
              {/* Data Overlay Effect */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,#050505_150%)] z-10 opacity-60" />
            </div>
            
            {/* Technical Caption Box */}
            <div className="absolute -bottom-6 -right-4 bg-neutral-900 border border-grid-strong p-3 hidden sm:block">
              <div className="flex items-center gap-3">
                <div className="w-10 h-1 bg-accent" />
                <span className="text-[10px] font-mono tracking-tighter text-accent-muted underline decoration-accent/20">UID: LUV_SYS_ARCH_01</span>
              </div>
            </div>
          </motion.div>

          {/* Content Side */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            className="w-full lg:w-[55%] space-y-10"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-accent-muted">
                <div className="h-px w-8 bg-accent/30" />
                <span className="text-xs font-mono uppercase tracking-[0.3em]">Personnel_Log_004</span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Architecting <span className="text-accent underline decoration-grid-strong underline-offset-[12px] decoration-4">Autonomous Intelligence</span>
              </h2>
            </div>

            <div className="space-y-6 text-lg text-accent-muted leading-relaxed font-sans max-w-2xl">
              <p>
                Luv is a systems engineer specializing in the intersection of autonomous robotics and high-performance computing. With a focus on building resilient, self-healing architectures, Luv designs the invisible layers that power the future of autonomous systems.
              </p>
              <p>
                Engineering, at its core, is the management of entropy. Whether optimizing real-time data protocols for decentralized robotic swarms or hardening edge-compute nodes against extreme environmentals, the vision remains consistent: zero-compromise reliability in every line of code and every circuit path.
              </p>
            </div>

            {/* Stats/Metrics Grid */}
            <div className="grid grid-cols-2 gap-8 border-t border-grid pt-12 max-w-lg">
              <div className="space-y-2">
                <h4 className="text-[10px] font-mono uppercase tracking-widest text-accent/50">Specialization</h4>
                <p className="text-base font-semibold text-foreground italic">Swarm Dynamics & Edge Resilience</p>
              </div>
              <div className="space-y-2">
                <h4 className="text-[10px] font-mono uppercase tracking-widest text-accent/50">Core Stack</h4>
                <p className="text-base font-semibold text-foreground italic">C++, Rust, Distributed Systems</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
