"use client";

import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import MagneticButton from "../ui/MagneticButton";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Project {
  id: string;
  name: string;
  industry: string;
  role: string;
  duration: string;
  challenge: string;
  outcome: string;
  impact: string;
  stack: string[];
  accent: string;
}

const projects: Project[] = [
  {
    id: "avn",
    name: "AVN Holidays",
    industry: "Luxury Travel",
    role: "Lead Architect",
    duration: "4 Months",
    challenge: "Converting static holiday packages into highly interactive, cinematic, custom-crafted digital showcases.",
    outcome: "Boosted direct booking inquiries by 350% and lowered page response latency to sub-400ms globally.",
    impact: "+350% Conversion Increase / 0.4s Paint Speed",
    stack: ["Next.js", "WebGL", "GSAP", "Tailwind CSS"],
    accent: "#00ffaa",
  },
  {
    id: "med",
    name: "MediFlow",
    industry: "Healthcare Tech",
    role: "Senior Developer",
    duration: "6 Months",
    challenge: "Optimizing doctors' complex appointment scheduler queues and patient telemetry sync latency.",
    outcome: "Decreased state synchronization wait times from 2.5s down to 80ms via Edge API pipelines.",
    impact: "80ms Hydration Sync / HIPAA Compliant Sandbox",
    stack: ["React", "Turborepo", "WebSockets", "Node.js"],
    accent: "#ffffff",
  },
  {
    id: "soma",
    name: "SOMA Labs",
    industry: "Creative AI",
    role: "Creative Engineer",
    duration: "3 Months",
    challenge: "Synthesizing real-time text-to-music audio frequencies into fluid visual shader coordinates.",
    outcome: "Painted thousands of particle nodes at 60 FPS utilizing custom raw fragment shaders.",
    impact: "60 FPS GPU Shader Output / 100k Active Particles",
    stack: ["Three.js", "GLSL Shaders", "React-Three-Fiber"],
    accent: "#00ffaa",
  },
  {
    id: "nova",
    name: "Nova Retail",
    industry: "E-Commerce",
    role: "Tech Lead",
    duration: "5 Months",
    challenge: "Rebuilding modular checkout pipelines to prevent user drop-offs during high-concurrency launches.",
    outcome: "Secured cart transaction processing capacity for up to 10k simultaneous active shoppers.",
    impact: "Zero Checkout Outages / 99 Lighthouse Audits",
    stack: ["Next.js", "Redis cache", "Stripe API", "GraphQL"],
    accent: "#ffffff",
  },
  {
    id: "apex",
    name: "Apex Finance",
    industry: "Fintech Dashboard",
    role: "Frontend Architect",
    duration: "8 Months",
    challenge: "Consolidating multiple high-frequency market tickers into single-paint visual graphs.",
    outcome: "Achieved seamless client-side ticker rendering with clean sub-pixel alignments.",
    impact: "Sub-millisecond data paint / 100% WCAG AA Score",
    stack: ["TypeScript", "Canvas 2D", "D3.js Core", "Tailwind CSS"],
    accent: "#00ffaa",
  },
  {
    id: "orbit",
    name: "Orbit Spaces",
    industry: "Real Estate SaaS",
    role: "Creative Engineer",
    duration: "4 Months",
    challenge: "Constructing interactive 3D floor plan layout views readable across standard mobile browser layers.",
    outcome: "Optimized complex spatial mesh assets to load instantly with zero UI thread freezing.",
    impact: "32% Visual Asset Size Reduction / 0ms Thread Lock",
    stack: ["Three.js", "Vite", "GSAP Scroll", "Postprocessing"],
    accent: "#ffffff",
  }
];

export default function SelectedWork() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  
  const [activeProjectIdx, setActiveProjectIdx] = useState(0);
  const [mobileActiveIdx, setMobileActiveIdx] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    const sticky = stickyRef.current;
    const track = trackRef.current;
    if (!container || !sticky || !track || window.innerWidth < 768) return;

    const totalPanels = projects.length + 2; // intro + projects + outro
    const SCROLL_PER_PANEL = 1.35; // viewport-heights of scroll per panel

    const getMaxScroll = () => Math.max(track.scrollWidth - window.innerWidth, 1);

    const getSnapProgress = (progress: number) => {
      const maxScroll = getMaxScroll();
      const children = Array.from(track.children) as HTMLElement[];
      const snapPoints = children.map((child) =>
        Math.min(1, Math.max(0, child.offsetLeft / maxScroll))
      );
      snapPoints.push(1);
      return snapPoints.reduce((closest, point) =>
        Math.abs(point - progress) < Math.abs(closest - progress) ? point : closest
      );
    };

    const tween = gsap.to(track, {
      x: () => -getMaxScroll(),
      ease: "none",
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: () => `+=${window.innerHeight * totalPanels * SCROLL_PER_PANEL}`,
        pin: sticky,
        scrub: 1.8,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        snap: {
          snapTo: (progress) => getSnapProgress(progress),
          duration: { min: 0.25, max: 0.55 },
          delay: 0.08,
          ease: "power2.inOut",
        },
        onUpdate: () => {
          const children = Array.from(track.children) as HTMLElement[];
          const maxScroll = getMaxScroll();
          const currentX = Math.abs(gsap.getProperty(track, "x") as number);
          let closestIdx = 0;
          let closestDist = Infinity;
          children.forEach((child, i) => {
            const dist = Math.abs(child.offsetLeft - currentX);
            if (dist < closestDist) {
              closestDist = dist;
              closestIdx = i;
            }
          });
          const projIdx = Math.min(
            Math.max(closestIdx - 1, 0),
            projects.length - 1
          );
          setActiveProjectIdx(projIdx);
        },
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  const handleMobileScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const width = el.clientWidth;
    const index = Math.round(el.scrollLeft / width);
    setMobileActiveIdx(index);
  };

  return (
    <div className="relative w-full">
      {/* ========================================================
          DESKTOP & TABLET GALLERY SHOWCASE (Horizontal Scroll Pinned)
          ======================================================== */}
      <section
        ref={containerRef}
        className="hidden md:block relative w-full bg-transparent text-white select-none overflow-hidden"
      >
        <div
          ref={stickyRef}
          className="relative w-full h-screen flex items-center overflow-hidden"
        >
          {/* Horizontal slider track */}
          <div
            ref={trackRef}
            className="flex items-center flex-nowrap gap-16 px-16 h-fit shrink-0 relative z-20 pointer-events-auto"
            style={{ willChange: "transform" }}
          >
            {/* 1. INTRO SEGMENT */}
            <div className="w-[80vw] lg:w-[60vw] shrink-0 flex flex-col justify-center items-start text-left gap-6 pr-12">
              <span className="glass-panel w-fit px-3.5 py-1.5 rounded-full text-[10px] font-mono tracking-widest text-zinc-400 uppercase">
                ✦ Selected Work Portfolio
              </span>
              <h2 className="font-display font-extrabold text-[3rem] lg:text-[4.5rem] leading-none tracking-tight uppercase text-white">
                Products Designed<br />
                To Be Remembered.
              </h2>
              <p className="text-sm text-zinc-400 leading-relaxed font-light char-limit-desktop char-limit-tablet">
                Every project begins with understanding people, goals, and architectures before writing a single line of code. We engineer digital interfaces that bridge engineering and human emotion.
              </p>
              <div className="flex items-center gap-2 mt-4 text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                <span>Scroll down to slide</span>
                <span className="animate-pulse">→</span>
              </div>
            </div>

            {/* 2. PROJECT CARDS */}
            {projects.map((proj, idx) => (
              <div
                key={proj.id}
                className="w-[85vw] lg:w-[70vw] shrink-0 h-[68vh] glass-panel p-8 border border-white/5 rounded-2xl flex flex-col md:flex-row justify-between gap-12 bg-zinc-950/40 relative"
              >
                {/* Left side info */}
                <div className="flex-1 flex flex-col justify-between h-full">
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-mono tracking-widest uppercase" style={{ color: proj.accent }}>
                      Flagship Reveal 0{idx + 1} — {proj.industry}
                    </span>
                    <h3 className="font-display font-extrabold text-[2.2rem] lg:text-[3rem] leading-none tracking-tight uppercase text-white">
                      {proj.name}
                    </h3>
                    
                    <div className="flex gap-6 mt-2 border-b border-white/5 pb-4 text-[10px] font-mono text-zinc-400">
                      <div>Role: <span className="text-white">{proj.role}</span></div>
                      <div>Duration: <span className="text-white">{proj.duration}</span></div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 my-4">
                    <p className="text-xs lg:text-sm text-zinc-400 leading-relaxed font-light char-limit-desktop char-limit-tablet">
                      <span className="text-white font-medium">Challenge:</span> {proj.challenge}
                    </p>
                    <p className="text-xs lg:text-sm text-zinc-400 leading-relaxed font-light char-limit-desktop char-limit-tablet">
                      <span className="text-white font-medium">Outcome:</span> {proj.outcome}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mt-auto">
                    {proj.stack.map((tech, tIdx) => (
                      <span
                        key={tIdx}
                        className="glass-panel px-2.5 py-1 rounded text-[9px] font-mono text-zinc-300 border border-white/5"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right side stats */}
                <div className="w-full md:w-[240px] shrink-0 h-full border-t md:border-t-0 md:border-l border-white/5 pt-6 md:pt-0 md:pl-8 flex flex-col justify-between items-start md:items-end text-left md:text-right">
                  <div className="flex flex-col gap-2 w-full">
                    <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase">Ecosystem Impact</span>
                    <div className="glass-panel p-4 border border-white/5 rounded-xl w-full">
                      <p className="text-xs font-mono text-emerald-400 font-bold uppercase leading-relaxed">
                        {proj.impact}
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 md:mt-0 w-full flex justify-start md:justify-end">
                    <MagneticButton variant="primary" className="text-xs py-3 px-6">
                      Explore Process
                    </MagneticButton>
                  </div>
                </div>
              </div>
            ))}

            {/* 3. OUTRO SEGMENT */}
            <div className="w-[85vw] lg:w-[60vw] shrink-0 flex flex-col justify-center items-start text-left gap-6 pl-12 pr-24">
              <span className="glass-panel w-fit px-3.5 py-1.5 rounded-full text-[10px] font-mono tracking-widest text-emerald-400 uppercase">
                ✦ Engineering Core
              </span>
              <h2 className="font-display font-extrabold text-[2.5rem] lg:text-[3.5rem] leading-none tracking-tight uppercase text-white">
                Different Industries.<br />
                One Engineering Philosophy.
              </h2>
              <p className="text-xs lg:text-sm text-zinc-400 leading-relaxed font-light char-limit-desktop char-limit-tablet">
                Whether building analytics platforms, healthcare schedulers, or luxury travel platforms, every product utilizes consistent architecture, sub-millisecond scaling pipelines, and fluid responsive motion layouts.
              </p>
            </div>
          </div>

          {/* Background guides overlay */}
          <div className="absolute bottom-10 left-16 right-16 flex justify-between items-center text-zinc-500 text-[10px] font-mono z-20 pointer-events-none">
            <div className="flex items-center gap-4">
              <span>Scroll vertically to pan gallery</span>
              <div className="flex items-center gap-1.5">
                {projects.map((_, idx) => (
                  <span
                    key={idx}
                    className="block rounded-full transition-all duration-300"
                    style={{
                      width: activeProjectIdx === idx ? 16 : 6,
                      height: 6,
                      background:
                        activeProjectIdx === idx
                          ? "#00ffaa"
                          : "rgba(255,255,255,0.15)",
                    }}
                  />
                ))}
              </div>
            </div>
            <span>✦ Kamlesh Mundel</span>
          </div>
        </div>
      </section>

      {/* ========================================================
          MOBILE LAYOUT (Horizontal Carousel swipe - Untouched/Smooth)
          ======================================================= */}
      <div className="flex md:hidden flex-col gap-12 px-5 py-16 relative z-10">
        <div className="flex flex-col gap-4">
          <span className="glass-panel w-fit px-3.5 py-1.5 rounded-full text-[10px] font-mono tracking-widest text-zinc-400 uppercase">
            ✦ Selected Work
          </span>
          <h2 className="font-display font-extrabold text-4xl uppercase leading-none text-white tracking-tight">
            Products Designed To Be Remembered.
          </h2>
          <p className="text-xs text-zinc-400 font-light leading-relaxed">
            Every project begins with understanding people, goals, and architectures before coding. We build interfaces bridging engineering and emotion.
          </p>
        </div>

        {/* Swipe carousel */}
        <div 
          className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-6 w-full no-scrollbar pointer-events-auto"
          onScroll={handleMobileScroll}
        >
          {projects.map((proj) => (
            <div 
              key={proj.id}
              className="w-[85vw] shrink-0 snap-center glass-panel p-6 border border-white/5 rounded-2xl flex flex-col gap-6"
            >
              <div className="flex flex-col gap-1.5">
                <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase">
                  ✦ {proj.industry}
                </span>
                <h3 className="font-display font-bold text-xl uppercase text-white tracking-tight leading-none">
                  {proj.name}
                </h3>
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-xs text-zinc-400 leading-relaxed font-light">
                  <span className="text-white font-medium">Challenge:</span> {proj.challenge}
                </p>
                <p className="text-xs text-zinc-400 leading-relaxed font-light">
                  <span className="text-white font-medium">Outcome:</span> {proj.outcome}
                </p>
              </div>

              <div className="border-t border-white/5 pt-4">
                <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest block mb-2">Metrics Impact</span>
                <p className="text-xs font-mono text-emerald-400 font-medium uppercase">{proj.impact}</p>
              </div>

              <div className="flex flex-wrap gap-1 mt-2">
                {proj.stack.map((tech) => (
                  <span key={tech} className="glass-panel px-2.5 py-0.5 rounded text-[8px] font-mono text-zinc-400">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Slide Indicators */}
        <div className="flex justify-center gap-1.5">
          {projects.map((_, idx) => (
            <span 
              key={idx} 
              className="w-1.5 h-1.5 rounded-full transition-all duration-300"
              style={{
                background: mobileActiveIdx === idx ? "#00ffaa" : "rgba(255,255,255,0.15)",
                transform: mobileActiveIdx === idx ? "scale(1.2)" : "scale(1)",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
