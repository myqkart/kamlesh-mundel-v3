"use client";

import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CreativePlayground from "./CreativePlayground";
import CreativeLabBackground from "./CreativeLabBackground";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Experiment {
  id: string;
  num: string;
  title: string;
  desc: string;
  category: string;
}

const experiments: Experiment[] = [
  {
    id: "fluid",
    num: "01 // WebGL",
    category: "Fluid Shader",
    title: "Interactive Fluid Dynamics Shader",
    desc: "A custom GLSL fragment shader displaying real-time pressure grids and cursor-induced force vector flows inside a WebGL buffer."
  },
  {
    id: "audio",
    num: "02 // Canvas",
    category: "Audio Reactive",
    title: "Audio Volumetric Point Cloud",
    desc: "A 3D frequency vertex cloud mapped from audio analyzer inputs, warping grid heights based on bass and high-end transients."
  },
  {
    id: "physics",
    num: "03 // DOM",
    category: "GSAP Physics",
    title: "Elastic DOM Physics System",
    desc: "An experimental interactive interface utilizing custom spring equations and boundary collision boxes on normal HTML button elements."
  },
  {
    id: "particles",
    num: "04 // Three.js",
    category: "GPU Simulation",
    title: "Infinite Custom GPU Particle Drifter",
    desc: "A custom vertex shader rendering 100k independent coordinates, floating along dynamic curl noise vectors mapped at runtime."
  },
  {
    id: "typography",
    num: "05 // CSS 3D",
    category: "Layout Engine",
    title: "Retro CSS 3D Typography Grid",
    desc: "An editorial grid of text that dynamically warps and pivots in isometric space based on mouse cursor distance indices."
  },
  {
    id: "portal",
    num: "06 // WebGL",
    category: "Volumetric Light",
    title: "WebGL Volumetric Cloud Portal",
    desc: "A multi-layered noise portal utilizing custom raymarching steps inside a sphere geometry to simulate deep atmospheric light shafts."
  }
];

export default function CreativeLab() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const quoteRef = useRef<HTMLDivElement>(null);
  const [selectedExp, setSelectedExp] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || window.innerWidth < 768) return;

    // Grid cards staggered reveal
    cardRefs.current.forEach((el, idx) => {
      if (!el) return;
      gsap.fromTo(
        el,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    // Fade-in quote at the bottom on scroll
    if (quoteRef.current) {
      gsap.fromTo(
        quoteRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 0.6,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: quoteRef.current,
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }
  }, []);

  return (
    <section
      ref={containerRef}
      id="creativelab"
      className="relative w-full min-h-[160vh] bg-transparent text-white select-none py-24 px-6 md:px-16 lg:px-24 overflow-hidden"
    >
      <CreativeLabBackground />

      <div className="max-w-7xl mx-auto flex flex-col gap-16 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col gap-4 max-w-2xl">
          <span className="glass-panel w-fit px-3.5 py-1.5 rounded-full text-[10px] font-mono tracking-widest text-zinc-400 uppercase">
            ✦ R&D Playground
          </span>
          <h2 className="font-display font-extrabold text-[2.8rem] lg:text-[3.8rem] leading-none tracking-tight uppercase text-white">
            Creative Lab & Experiments
          </h2>
          <p className="text-xs lg:text-sm text-zinc-400 leading-relaxed font-light char-limit-desktop char-limit-tablet">
            A sandbox for performance exploration, shaders, and UI design systems. Click any card to launch the interactive simulation view.
          </p>
        </div>

        {/* 3-Column Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {experiments.map((exp, idx) => (
            <button
              key={exp.id}
              ref={(el) => { cardRefs.current[idx] = el; }}
              onClick={() => setSelectedExp(exp.id)}
              className="glass-panel p-6 border border-white/5 rounded-2xl flex flex-col gap-4 text-left hover:border-emerald-500/20 hover:shadow-[0_0_20px_rgba(0,255,170,0.04)] active:scale-98 transition-all duration-300 pointer-events-auto cursor-pointer"
            >
              <div className="flex justify-between items-center w-full">
                <span className="text-[9px] font-mono tracking-widest text-emerald-400 uppercase">
                  {exp.num}
                </span>
                <span className="glass-panel px-2 py-0.5 rounded text-[8px] font-mono text-zinc-500 uppercase tracking-widest border border-white/5">
                  {exp.category}
                </span>
              </div>
              
              <h3 className="font-display font-bold text-base uppercase text-white tracking-tight mt-2">
                {exp.title}
              </h3>
              
              <p className="text-[11px] lg:text-xs text-zinc-400 leading-relaxed font-light char-limit-desktop char-limit-tablet">
                {exp.desc}
              </p>
              
              <div className="mt-4 pt-4 border-t border-white/5 text-[9px] font-mono text-emerald-400 uppercase tracking-widest flex items-center gap-1.5 hover:text-white transition-colors">
                <span>Launch playground</span>
                <span className="text-xs">→</span>
              </div>
            </button>
          ))}
        </div>

        {/* Footer Quote */}
        <div 
          ref={quoteRef}
          className="flex flex-col items-center text-center mt-12 pt-8 border-t border-white/5 opacity-60"
        >
          <p className="font-display font-black text-2xl md:text-3xl leading-none uppercase tracking-tighter text-zinc-600 char-limit-desktop char-limit-tablet">
            &ldquo;Simple things should be simple. Complex things should be possible.&rdquo;
          </p>
          <span className="text-[9px] font-mono text-zinc-700 uppercase tracking-widest mt-3">
            ✦ Alan Kay
          </span>
        </div>
      </div>

      {/* Interactive simulation overlay */}
      {selectedExp && (
        <CreativePlayground 
          experimentId={selectedExp} 
          onClose={() => setSelectedExp(null)} 
        />
      )}
    </section>
  );
}
