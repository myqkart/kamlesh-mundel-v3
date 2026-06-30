"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Staggered principles for the sidebar / footer
const principles = [
  "Performance First",
  "Scalable Architecture",
  "Accessible By Default",
  "Pixel Perfect",
  "Meaningful Motion",
  "Clean Code",
  "SEO Optimized",
  "Product Thinking"
];

interface Chapter {
  id: string;
  num: string;
  title: string;
  text: string;
}

const chapters: Chapter[] = [
  {
    id: "problem",
    num: "01 // The Problem",
    title: "The Internet Doesn't Need Another Website.",
    text: "We are drowning in templates, slow load times, generic layouts, and broken interactions. A website should not be a digital brochure; it is the living engine of a brand."
  },
  {
    id: "curiosity",
    num: "02 // Curiosity",
    title: "It Starts With Curiosity.",
    text: "I dissect design systems, analyze user psychology, map network parameters, and script physics-based easing. To build products that stick, you must first understand the harmony of their elements."
  },
  {
    id: "engineering",
    num: "03 // Engineering",
    title: "Every Pixel Has A Purpose.",
    text: "Clean modules. Scalable components. Lightweight architectures. I bridge the gap between design vision and runtime efficiency, assembling interfaces that react seamlessly to the human touch."
  },
  {
    id: "obsession",
    num: "04 // Obsession",
    title: "Great Products Are Built In The Details.",
    text: "I obsess over the micro-interactions. Faint glares on buttons, smooth sub-pixel alignments, 100% lighthouse accessibility audits, SEO optimizations, and consistent 60 FPS transitions."
  },
  {
    id: "delivery",
    num: "05 // Delivery",
    title: "Design. Engineering. Impact.",
    text: "Translating abstract code systems into premium products that shape industries. From luxury travel and medical dashboards to SaaS and AI utilities."
  }
];

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null);
  const chapterRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (typeof window === "undefined" || window.innerWidth < 768) return;

    // Fade-in each chapter card on scroll
    chapterRefs.current.forEach((el, idx) => {
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

    // Draw the vertical connector lines on scroll
    lineRefs.current.forEach((line) => {
      if (!line) return;
      gsap.fromTo(
        line,
        { scaleY: 0 },
        {
          scaleY: 1,
          duration: 0.8,
          ease: "none",
          transformOrigin: "top center",
          scrollTrigger: {
            trigger: line,
            start: "top 80%",
            end: "bottom 60%",
            scrub: true,
          },
        }
      );
    });
  }, []);

  return (
    <section
      ref={containerRef}
      id="about"
      className="relative w-full min-h-[140vh] bg-transparent text-white select-none py-24 px-6 md:px-16 lg:px-24 overflow-hidden"
      style={{
        backgroundImage: "radial-gradient(circle at 50% 50%, rgba(18, 18, 18, 0.15) 0%, rgba(0, 0, 0, 1) 90%)",
      }}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16 relative z-10">
        
        {/* Left Column: Sticky Title & Principles (Desktop Only) */}
        <div className="w-full md:w-[40%] md:sticky md:top-28 md:h-fit flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <span className="glass-panel w-fit px-3.5 py-1.5 rounded-full text-[10px] font-mono tracking-widest text-zinc-400 uppercase">
              ✦ How Do I Think?
            </span>
            <h2 className="font-display font-extrabold text-[2rem] lg:text-[2.6rem] leading-[1.1] tracking-tight uppercase text-white">
              The Philosophy Behind the Code
            </h2>
          </div>
          
          <p className="text-xs lg:text-sm text-zinc-400 leading-relaxed font-light max-w-sm char-limit-tablet">
            I don&apos;t just build websites. I build experiences. By bridging design vision and system engineering, I translate concepts into lightweight, high-performance interfaces.
          </p>

          <div className="hidden lg:flex flex-col gap-2 mt-4">
            <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase">
              ✦ Governing Principles
            </span>
            <div className="flex flex-wrap gap-2 max-w-sm">
              {principles.map((pr, idx) => (
                <span
                  key={idx}
                  className="glass-panel px-3 py-1 rounded text-[10px] font-mono text-zinc-400 border border-white/5"
                >
                  ✦ {pr}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Chapters Scroll Stream */}
        <div className="w-full md:w-[60%] flex flex-col gap-32 md:pl-20 relative">
          
          {/* Aesthetic background timeline bar */}
          <div className="absolute left-0 top-0 bottom-0 w-px bg-white/5 hidden md:block" />

          {chapters.map((ch, idx) => (
            <div
              key={ch.id}
              ref={(el) => { chapterRefs.current[idx] = el; }}
              className="relative md:pl-10 flex flex-col items-start gap-4 transition-all"
            >
              {/* Timeline marker for desktop */}
              <div 
                className="absolute left-[-4px] top-1.5 w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#00ffaa] hidden md:block"
                style={{
                  transition: "all 0.3s ease",
                }}
              />

              <span className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase">
                {ch.num}
              </span>
              
              <h3 className="font-display font-extrabold text-[1.8rem] lg:text-[2.2rem] leading-tight tracking-tight uppercase text-white char-limit-desktop char-limit-tablet">
                {ch.title}
              </h3>
              
              <p className="text-xs lg:text-sm text-zinc-400 leading-relaxed font-light char-limit-desktop char-limit-tablet">
                {ch.text}
              </p>

              {idx < chapters.length - 1 && (
                <div 
                  ref={(el) => { lineRefs.current[idx] = el; }}
                  className="absolute left-0 top-6 bottom-0 w-px bg-emerald-400/30 hidden md:block origin-top"
                  style={{
                    height: "calc(100% + 3rem)",
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Principles for Mobile (shown below the scroll chapters) */}
      <div className="flex lg:hidden flex-col gap-3 mt-16 pt-10 border-t border-white/5">
        <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase">
          ✦ Governing Principles
        </span>
        <div className="flex flex-wrap gap-2">
          {principles.map((pr, idx) => (
            <span
              key={idx}
              className="glass-panel px-2.5 py-1 rounded text-[9px] font-mono text-zinc-400 border border-white/5"
            >
              ✦ {pr}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
