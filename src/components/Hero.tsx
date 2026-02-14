"use client";

import { motion } from "framer-motion";

export const Hero = () => {
  const words = "Turning Complex Problems Into Elegant Solutions".split(" ");
  
  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.15 * i,
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
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          {words.map((word, index) => (
            <motion.span variants={child} key={index} className="inline-block mr-3">
              {word}
            </motion.span>
          ))}
        </h1>
        
        <motion.p
          variants={child}
          className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-accent-muted sm:text-xl"
        >
          I build web applications and automation systems that save you time, cut costs, 
          and let you focus on what actually matters—growing your business.
        </motion.p>
        
        <motion.p
          variants={child}
          className="mx-auto mt-4 max-w-xl text-sm text-accent-muted/70"
        >
          From sleek customer-facing apps to behind-the-scenes tools that make your team's life easier.
        </motion.p>

        <motion.div
          variants={child}
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="/#projects"
            className="rounded-md bg-accent px-8 py-4 text-sm font-semibold text-background shadow-xs hover:bg-accent/90 transition-all w-full sm:w-auto text-center"
          >
            See What I've Built
          </a>
          <a
            href="/#contact"
            className="text-sm font-semibold text-foreground hover:text-accent transition-all flex items-center gap-2"
          >
            Let's Work Together <span aria-hidden="true">→</span>
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
};
