import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Lab01Card } from "@/components/Lab01Card";
import { ToolsCard } from "@/components/ToolsCard";
import { PhoneBotCard } from "@/components/PhoneBotCard";
import { Contact } from "@/components/Contact";

export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero />
      <About />
      
      <section id="projects" className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="mb-16 space-y-4">
            <div className="flex items-center gap-3 text-accent-muted">
              <div className="h-px w-8 bg-accent/30" />
              <span className="text-xs font-mono uppercase tracking-[0.3em]">Recent Work</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Projects That{" "}
              <span className="text-accent underline decoration-grid-strong underline-offset-[12px] decoration-4">
                Deliver Results
              </span>
            </h2>
            <p className="text-lg text-accent-muted max-w-2xl">
              Here's what I've been building—tools and platforms that solve real problems 
              and make life easier for users and businesses.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Lab01Card />
            <ToolsCard />
            <PhoneBotCard />
          </div>
        </div>
      </section>
      
      <Contact />
      
      <div className="w-full max-w-7xl px-6 pb-24 sm:px-8 lg:px-12">
        {/* Further sections will go here */}
      </div>
    </div>
  );
}
