import { Hero } from "@/components/Hero";
import { About } from "@/components/About";

export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero />
      <About />
      <div className="w-full max-w-7xl px-6 pb-24 sm:px-8 lg:px-12">
        {/* Further sections will go here */}
      </div>
    </div>
  );
}
