import { Hero } from "@/components/Hero";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <Hero />
      <div className="w-full max-w-7xl px-6 pb-24 sm:px-8 lg:px-12">
        {/* Further sections will go here */}
      </div>
    </main>
  );
}
