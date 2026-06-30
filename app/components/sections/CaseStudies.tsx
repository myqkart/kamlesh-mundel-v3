"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Stage {
  num: string;
  title: string;
  desc: string;
}

const stages: Stage[] = [
  {
    num: "00 // The Context",
    title: "Cinematic Luxury Travel Showcases",
    desc: "AVN Holidays requested a digital flagship presence that could capture the emotional anticipation of luxury travel. Standard layouts could not represent the premium, bespoke journeys they offer."
  },
  {
    num: "01 // The Problem",
    title: "Static, Slow, and Impersonal Interfaces",
    desc: "Existing platforms relied on slow monolithic frameworks and static image grids. The bounce rate was high because the page load times exceeded 4.2 seconds, and the static interfaces lacked any sense of cinematic premium storytelling."
  },
  {
    num: "02 // The Strategy",
    title: "Next.js Core & Edge Routing Engine",
    desc: "I architected the application on Next.js with Edge middleware and ISR. This guaranteed instantaneous load times under 500ms globally while maintaining fully dynamic luxury itineraries. We mapped out a database schema built for fast relational queries."
  },
  {
    num: "03 // The Design System",
    title: "Cinematic Motion & Fluid Aesthetics",
    desc: "In collaboration with creative designers, we developed a fluid layout system. Utilizing variable font weightings, smooth backdrop-filters, custom vector grids, and scroll-driven parallax imagery to guide the visitor through itineraries."
  },
  {
    num: "04 // The Engineering",
    title: "GSAP scrubbers and Three.js Shaders",
    desc: "We built a customized WebGL canvas to paint volumetric atmospheric dust and lighting behind the panels. The interaction speeds were configuration-tuned to 200ms to keep clicks snappy while keeping layout changes buttery smooth."
  },
  {
    num: "05 // The Outcome",
    title: "Speed, Conversion, and Awards Recognition",
    desc: "The launch resulted in a 99/100 Lighthouse performance index, a +350% increase in mobile inquiry conversion rates, and a complete pre-qualification for multiple digital design awards including CSSDA and Awwwards."
  }
];

export default function CaseStudies() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (typeof window === "undefined" || window.innerWidth < 768) return;

    cardRefs.current.forEach((el) => {
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
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });
  }, []);

  return (
    <section
      ref={containerRef}
      id="casestudies"
      className="relative w-full min-h-[160vh] bg-transparent text-white select-none py-24 px-6 md:px-16 lg:px-24 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16 relative z-10">
        <div className="w-full md:w-[40%] md:sticky md:top-28 md:h-fit flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <span className="glass-panel w-fit px-3.5 py-1.5 rounded-full text-[10px] font-mono tracking-widest text-zinc-400 uppercase">
              ✦ Deep Dive Case Study
            </span>
            <h2 className="font-display font-extrabold text-[2rem] lg:text-[2.6rem] leading-[1.1] tracking-tight uppercase text-white">
              How Do I Solve Problems?
            </h2>
          </div>

          <p className="text-xs lg:text-sm text-zinc-400 leading-relaxed font-light char-limit-tablet">
            An end-to-end breakdown of the AVN Holidays digital flagship. Explore how analytical performance and motion storytelling came together to produce measurable product success.
          </p>

          <div className="flex flex-col gap-4 border-t border-white/5 pt-8 mt-4">
            <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase">
              ✦ Case Metrics (AVN Holidays)
            </span>

            <div className="grid grid-cols-2 gap-4">
              <div className="glass-panel p-4 border border-white/5 rounded-xl">
                <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1">Load Speed</div>
                <div className="text-xl font-bold font-mono text-emerald-400">0.4s</div>
              </div>
              <div className="glass-panel p-4 border border-white/5 rounded-xl">
                <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1">Performance</div>
                <div className="text-xl font-bold font-mono text-white">99/100</div>
              </div>
              <div className="glass-panel p-4 border border-white/5 rounded-xl">
                <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1">Mobile inquiries</div>
                <div className="text-xl font-bold font-mono text-emerald-400">+350%</div>
              </div>
              <div className="glass-panel p-4 border border-white/5 rounded-xl">
                <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1">FPS Target</div>
                <div className="text-xl font-bold font-mono text-white">60fps</div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full md:w-[60%] flex flex-col gap-16 md:pl-20">
          {stages.map((st, idx) => (
            <div
              key={idx}
              ref={(el) => { cardRefs.current[idx] = el; }}
              className="glass-panel p-8 border border-white/5 rounded-2xl flex flex-col gap-4 hover:border-emerald-500/10 hover:shadow-[0_0_20px_rgba(0,255,170,0.02)] transition-all duration-300"
            >
              <div className="flex justify-between items-center w-full">
                <span className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase">
                  {st.num}
                </span>
                <span className="text-[9px] font-mono text-zinc-600">
                  {`Step 0${idx + 1}`}
                </span>
              </div>

              <h3 className="font-display font-bold text-lg lg:text-xl uppercase text-white tracking-tight">
                {st.title}
              </h3>

              <p className="text-xs lg:text-sm text-zinc-400 leading-relaxed font-light char-limit-desktop char-limit-tablet">
                {st.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
