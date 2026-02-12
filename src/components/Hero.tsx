"use client";

import { motion } from "framer-motion";

export const Hero = () => {
  const words = "Building the Future of Autonomous Systems".split(" ");

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { 
        staggerChildren: 0.1, 
        delayChildren: 0.2 * i 
      },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
        duration: 0.4,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  } as const;

  return (
    <section className="relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden px-4 text-center sm:px-6 lg:px-8">
      {/* Background Grid Accent */}
      <div className="bg-grid-pattern absolute inset-0 -z-10 opacity-20" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-radial-[circle_at_center,_var(--color-grid)_0%,_transparent_70%] opacity-50" />

      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="max-w-4xl"
      >
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
          {words.map((word, index) => (
            <motion.span
              variants={child}
              key={index}
              className="inline-block mr-3"
            >
              {word}
            </motion.span>
          ))}
        </h1>
        
        <motion.p
          variants={child}
          className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-accent-muted sm:text-xl"
        >
          Pioneering next-generation intelligence through robust engineering
          and autonomous architecture.
        </motion.p>

        <motion.div
          variants={child}
          className="mt-10 flex items-center justify-center gap-x-6"
        >
          <a
            href="#projects"
            className="rounded-md bg-accent px-6 py-3 text-sm font-semibold text-background shadow-xs hover:bg-accent/90 transition-all"
          >
            Explore Projects
          </a>
          <a
            href="#contact"
            className="text-sm font-semibold leading-6 text-foreground hover:text-accent transition-all"
          >
            Get in touch <span aria-hidden="true">→</span>
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
};
