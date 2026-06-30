"use client";

import { useEffect, useState } from "react";
import Lenis from "lenis";
import Hero from "./components/sections/Hero";
import About from "./components/sections/About";
import TechUniverse from "./components/sections/TechUniverse";
import SelectedWork from "./components/sections/SelectedWork";
import CaseStudyBridge from "./components/sections/CaseStudyBridge";
import CaseStudies from "./components/sections/CaseStudies";
import Experience from "./components/sections/Experience";
import CreativeLab from "./components/sections/CreativeLab";
import Testimonials from "./components/sections/Testimonials";
import Contact from "./components/sections/Contact";
import Footer from "./components/sections/Footer";
import BackgroundCanvas from "./components/sections/BackgroundCanvas";
import SharePulse from "./components/ui/SharePulse";

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return (
    <main id="main-content" className="flex min-h-screen flex-col w-full bg-black text-white overflow-x-hidden relative">
      {/* Shared WebGL Background Canvas */}
      <BackgroundCanvas isLoaded={isLoaded} />

      {/* Sections */}
      <Hero setIsLoaded={setIsLoaded} />
      <About />
      <TechUniverse />
      <SelectedWork />
      <CaseStudyBridge />
      <CaseStudies />
      <Experience />
      <CreativeLab />
      <Testimonials />
      <Contact />
      <Footer />
      <SharePulse />
    </main>
  );
}
