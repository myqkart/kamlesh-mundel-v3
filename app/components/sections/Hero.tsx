"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import MagneticButton from "../ui/MagneticButton";

// Individual Words for the reveal sequence
const revealWords = ["Building", "Experiences", "That", "People", "Remember."];

interface HeroProps {
  setIsLoaded: (val: boolean) => void;
}

export default function Hero({ setIsLoaded }: HeroProps) {
  
  // Element Refs (Only keep unique root elements)
  const scanLineRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Initial State Setup
    gsap.set(scanLineRef.current, { top: "-10%" });
    
    // Do NOT disable body scroll — progressive entrance

    // 2. Entrance Animation Timeline (Accelerated reveal: under 1.2s total)
    const tl = gsap.timeline({
      onComplete: () => {
        setIsLoaded(true);
      }
    });

    // Phase 1: Laser Scan line runs top-to-bottom rapidly
    tl.to(scanLineRef.current, {
      top: "110%",
      duration: 0.6,
      ease: "power2.inOut",
    });

    // Phase 2: Fade out loader black background
    tl.to(loaderRef.current, {
      opacity: 0,
      duration: 0.3,
      ease: "power1.inOut",
    }, "-=0.3");

    // Phase 3: Reveal name words (desktop & mobile classes targeted simultaneously)
    tl.to(".hero-word-1, .hero-word-2", {
      y: "0%",
      duration: 0.4,
      stagger: 0.08,
      ease: "power4.out",
    }, "-=0.1");

    // Phase 4: Staggered individual word reveals
    tl.to(".hero-reveal-word", {
      y: "0%",
      duration: 0.3,
      stagger: 0.05,
      ease: "power3.out",
    }, "-=0.1");

    // Phase 5: Fade-in Subtitle
    tl.fromTo(".hero-subtitle", 
      { opacity: 0, y: 10 },
      { opacity: 0.85, y: 0, duration: 0.4, ease: "power2.out" },
      "-=0.15"
    );

    // Phase 6: Fade-in Glass Badges & CTAs
    tl.fromTo([".hero-badges", ".hero-ctas"],
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: "power2.out" },
      "-=0.2"
    );

    // Phase 7: Reveal scroll indicator
    tl.fromTo(
      ".hero-scroll",
      { opacity: 0 },
      { opacity: 1, duration: 0.6, ease: "power2.out" },
      "-=0.1"
    );

    // 4. Scroll event listener for scroll progress updates
    const handleScroll = () => {
      const maxScroll = window.innerHeight;
      const current = window.scrollY;
      const progress = Math.min(Math.max(current / maxScroll, 0), 1);

      const desktopEnergy = document.querySelector(".hero-energy-desktop") as HTMLElement;
      const mobileEnergy = document.querySelector(".hero-energy-mobile") as HTMLElement;

      if (desktopEnergy) {
        desktopEnergy.style.height = `${progress * 100}%`;
      }
      if (mobileEnergy) {
        mobileEnergy.style.width = `${progress * 100}%`;
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.body.style.overflow = "";
    };
  }, [setIsLoaded]);

  return (
    <section id="top" aria-label="Introduction" className="relative w-full h-[120vh] bg-black select-none z-10 font-sans overflow-hidden">
      
      {/* 1. Cinematic Entry Loader Overlays */}
      <div 
        ref={loaderRef} 
        className="fixed inset-0 w-full h-full bg-black z-50 pointer-events-none flex items-center justify-center"
      >
        {/* Pitch black container */}
      </div>

      {/* Laser Scanning Line */}
      <div 
        ref={scanLineRef}
        className="fixed left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/80 to-transparent shadow-[0_0_15px_rgba(255,255,255,0.7)] z-50 pointer-events-none"
      />

      {/* 2. Three.js Canvas Scene is handled at the page level */}

      {/* 3. Ambient Grid Overlay (mouse reactive) */}
      <div className="grid-overlay" />

      {/* 4. Film Grain Noise Filter */}
      <div className="noise-overlay" />

      {/* 5. Spotlight Glow */}
      <div className="spotlight-glow" />

      {/* Background Details: Floating Code Snippets deleted for premium cleanup */}

      {/* ========================================================
          DESKTOP & TABLET HERO LAYOUT (Sticky for immersive feel)
          ======================================================== */}
      <div className="hidden md:flex sticky top-0 w-full h-screen flex-col justify-between items-center px-12 py-16 z-20 pointer-events-none">
        
        {/* Top bar: Glass Badges */}
        <div 
          className="w-full flex items-center justify-between pointer-events-auto hero-badges"
        >
          {/* Status Badge */}
          <div className="glass-panel px-4 py-2 rounded-full text-xs font-medium tracking-wide flex items-center gap-2 text-zinc-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Available for selected projects
          </div>

          {/* Technology Stack Badge */}
          <div className="glass-panel px-4 py-2 rounded-full text-xs font-medium tracking-wide text-zinc-400">
            Next.js • MERN • Python
          </div>

          {/* Location Badge */}
          <div className="glass-panel px-4 py-2 rounded-full text-xs font-medium tracking-wide text-zinc-300 flex items-center gap-1.5">
            Based in India <span className="text-[11px]">🇮🇳</span>
          </div>
        </div>

        {/* Center: Editorial Typography & Subtitle */}
        <div className="flex flex-col items-center text-center max-w-4xl mt-12">
          {/* Main Huge Typography */}
          <h1 className="font-display font-extrabold text-[4.5rem] lg:text-[6.5rem] leading-[1.05] tracking-tight uppercase select-none text-white">
            <div className="word-mask">
              <span className="word-inner pr-4 hero-word-1">KAMLESH</span>
            </div>
            <div className="word-mask">
              <span className="word-inner text-transparent bg-clip-text bg-gradient-to-r from-neutral-400 via-neutral-100 to-neutral-500 hero-word-2">MUNDEL</span>
            </div>
            
            {/* Morphing reveal phrase below */}
            <div className="block text-[2rem] lg:text-[2.8rem] font-sans font-light tracking-wide text-zinc-400 normal-case mt-4">
              {revealWords.map((word, idx) => (
                <div key={idx} className="word-mask mx-1.5">
                  <span className="word-inner block hero-reveal-word">
                    {word}
                  </span>
                </div>
              ))}
            </div>
          </h1>

          {/* Identity Subtitle */}
          <p 
            className="mt-8 text-sm lg:text-base text-zinc-400 leading-relaxed font-light tracking-wide char-limit-desktop char-limit-tablet hero-subtitle"
          >
            I engineer digital experiences where design, motion and code become one seamless product.
          </p>
        </div>

        {/* Bottom Area: CTAs & Scroll indicator */}
        <div className="w-full flex items-end justify-between">
          
          {/* Primary & Secondary CTAs */}
          <div 
            className="flex items-center gap-6 pointer-events-auto hero-ctas"
          >
            <MagneticButton variant="primary">
              Build Something Extraordinary
            </MagneticButton>
            <MagneticButton variant="secondary">
              Explore My Work
            </MagneticButton>
          </div>

          {/* Scroll Energy Indicator */}
          <div 
            className="flex flex-col items-center gap-4 mr-4 hero-scroll"
          >
            <span className="text-[10px] font-mono tracking-widest text-zinc-600 uppercase">Scroll</span>
            <div className="h-20 w-[1px] bg-zinc-800 relative overflow-hidden">
              <div 
                className="absolute top-0 left-0 w-full bg-white shadow-[0_0_8px_#fff] hero-energy-desktop"
                style={{ height: "0%" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          MOBILE HERO LAYOUT (Rebuilt from scratch, thumb-friendly)
          ======================================================== */}
      <div className="flex md:hidden sticky top-0 w-full h-screen flex-col justify-between px-6 py-12 z-20 pointer-events-none">
        
        {/* Top: Location Badge */}
        <div className="w-full flex justify-between items-center">
          <div className="glass-panel px-3 py-1.5 rounded-full text-[10px] font-medium tracking-wide text-zinc-300 flex items-center gap-1.5">
            Based in India 🇮🇳
          </div>
          <div className="glass-panel px-3 py-1.5 rounded-full text-[10px] font-medium tracking-wide text-zinc-400">
            Next.js • MERN • Python
          </div>
        </div>

        {/* Middle: Stacked Typography, subtitle and availability */}
        <div className="flex flex-col items-start max-w-full my-auto gap-5">
          {/* Availability badge */}
          <div className="glass-panel px-3.5 py-1.5 rounded-full text-[10px] font-medium tracking-wide flex items-center gap-2 text-zinc-300">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </span>
            Available for selected projects
          </div>

          <h1 className="font-display font-extrabold text-[2.8rem] leading-[1.05] tracking-tight uppercase text-white flex flex-col items-start">
            <div className="word-mask">
              <span className="word-inner hero-word-1">KAMLESH</span>
            </div>
            <div className="word-mask">
              <span className="word-inner text-transparent bg-clip-text bg-gradient-to-r from-neutral-400 to-neutral-200 hero-word-2">MUNDEL</span>
            </div>
            
            <div className="text-[1.25rem] font-sans font-light tracking-wide text-zinc-400 normal-case mt-3">
              {revealWords.map((word, idx) => (
                <div key={idx} className="word-mask mr-1.5">
                  <span className="word-inner block hero-reveal-word">
                    {word}
                  </span>
                </div>
              ))}
            </div>
          </h1>

          <p 
            className="text-xs text-zinc-400 max-w-[280px] leading-relaxed font-light tracking-wide hero-subtitle"
          >
            I engineer digital experiences where design, motion and code become one seamless product.
          </p>
        </div>

        {/* Bottom: Thumb-friendly CTAs & Simple Indicator */}
        <div className="w-full flex flex-col gap-4 pointer-events-auto hero-ctas">
          <div className="flex flex-col gap-3 w-full">
            <MagneticButton variant="primary" className="w-full py-3.5 text-xs text-center justify-center">
              Build Something Extraordinary
            </MagneticButton>
            <MagneticButton variant="secondary" className="w-full py-3.5 text-xs text-center justify-center">
              Explore My Work
            </MagneticButton>
          </div>

          {/* Simple scroll line */}
          <div className="flex items-center justify-between w-full mt-2 opacity-50 px-1 hero-scroll">
            <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase">Scroll to explore</span>
            <div className="w-12 h-[1px] bg-zinc-800 relative overflow-hidden">
              <div 
                className="absolute top-0 left-0 h-full bg-white shadow-[0_0_4px_#fff] hero-energy-mobile"
                style={{ width: "0%" }}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Visual buffer section for the scroll parallax transition */}
      <div className="w-full h-[20vh] pointer-events-none" />
    </section>
  );
}
