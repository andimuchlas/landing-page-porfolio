"use client";

import { useRef } from "react";
import SmoothScroll from "@/components/SmoothScroll";
import Preloader from "@/components/fx/Preloader";
import ScrollProgress from "@/components/fx/ScrollProgress";
import Experience from "@/components/experience/Experience";
import Navbar from "@/components/ui/Navbar";
import Hero from "@/components/ui/Hero";
import Services from "@/components/ui/Services";
import Work from "@/components/ui/Work";
import Toolbox from "@/components/ui/Toolbox";
import GameSection from "@/components/ui/GameSection";
import Finale from "@/components/ui/Finale";

export default function LandingPage() {
  const container = useRef<HTMLDivElement>(null);

  return (
    <SmoothScroll>
      <Preloader />
      <ScrollProgress />
      <Navbar />
      <div ref={container} className="relative">
        <Experience source={container} />
        <main className="relative z-10">
          <Hero />
          <Work />
          <Services />
          <Toolbox />
          <GameSection />
          <Finale />
        </main>
      </div>
    </SmoothScroll>
  );
}
