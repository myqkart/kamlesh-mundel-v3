"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Milestone {
  year: string;
  role: string;
  company: string;
  desc: string;
  bullets: string[];
}

const milestones: Milestone[] = [
  {
    year: "2024 — Present",
    role: "Freelance Creative Engineer",
    company: "Remote & Contract",
    desc: "Partnering directly with global startups and agencies to engineer luxury showcases, interactive data platforms, and performance-tuned SaaS applications.",
    bullets: [
      "Crafting high-end user experiences using Next.js, WebGL/Three.js, and physics-driven motion engines.",
      "Optimizing Core Web Vitals to deliver sub-500ms paint benchmarks and consistent 60fps interaction rendering.",
      "Developing accessible (WCAG compliant) semantic architectures for large-scale production platforms."
    ]
  },
  {
    year: "2022 — 2024",
    role: "Senior Software Engineer",
    company: "LTIMindtree",
    desc: "Led frontend modules and performance initiatives for high-traffic financial dashboards and complex product portals.",
    bullets: [
      "Mentored junior engineers and instituted design system guidelines for reusable modular structures.",
      "Reduced build sizes by 32% and runtime bundle execution times by auditing third-party codebases.",
      "Established automated visual regression testing workflows to guarantee perfect interface compliance."
    ]
  },
  {
    year: "2021 — 2022",
    role: "Associate Engineer",
    company: "Cognizant",
    desc: "Focused on core frontend features, API integration pipelines, and cross-browser visual rendering compliance.",
    bullets: [
      "Refactored legacy code structures into clean, modular, client-side Javascript services.",
      "Created highly responsive layouts running flawlessly across device classes from mobile to ultra-wide screens.",
      "Collaborated with backend teams to optimize state hydration boundaries and query responses."
    ]
  },
  {
    year: "2020 — 2021",
    role: "Software Engineer (Intern)",
    company: "Datalink",
    desc: "Gained hands-on experience in production environments, code reviews, container pipelines, and layout engineering.",
    bullets: [
      "Engineered layout refinements and visual touchups for consumer-facing websites.",
      "Authored clean semantic markup and styled structures adhering to rigorous brand guide alignments.",
      "Gained deep literacy in Git branching models, task tracking architectures, and release lifecycles."
    ]
  }
];

export default function Experience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (typeof window === "undefined" || window.innerWidth < 768) return;

    nodeRefs.current.forEach((el, idx) => {
      if (!el) return;
      gsap.fromTo(
        el,
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
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
      id="experience"
      className="relative w-full min-h-[120vh] bg-transparent text-white select-none py-24 px-6 md:px-16 lg:px-24 overflow-hidden"
    >
      {/* Ambient depth — stays behind content, no cursor tracking */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        aria-hidden
        style={{
          background: `
            radial-gradient(ellipse 60% 40% at 20% 50%, rgba(0, 255, 170, 0.03) 0%, transparent 70%),
            radial-gradient(ellipse 50% 60% at 80% 30%, rgba(255, 255, 255, 0.02) 0%, transparent 65%)
          `,
        }}
      />

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16 relative z-10">
        
        {/* Left Column: Sticky Title (Desktop Only) */}
        <div className="w-full md:w-[40%] md:sticky md:top-28 md:h-fit flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <span className="glass-panel w-fit px-3.5 py-1.5 rounded-full text-[10px] font-mono tracking-widest text-zinc-400 uppercase">
              ✦ Professional Journey
            </span>
            <h2 className="font-display font-extrabold text-[2rem] lg:text-[2.6rem] leading-[1.1] tracking-tight uppercase text-white">
              The Path of Experience
            </h2>
          </div>
          
          <p className="text-xs lg:text-sm text-zinc-400 leading-relaxed font-light char-limit-tablet">
            A linear progression of building, learning, and refining. From early software testing foundations to architectural frontend leadership.
          </p>
        </div>

        {/* Right Column: Timeline nodes */}
        <div className="w-full md:w-[60%] flex flex-col gap-16 md:pl-20 relative">
          
          {/* Main timeline pipe */}
          <div className="absolute left-0 top-2 bottom-0 w-px bg-white/5 hidden md:block" />

          {milestones.map((ms, idx) => (
            <div
              key={idx}
              ref={(el) => { nodeRefs.current[idx] = el; }}
              className="relative md:pl-10 flex flex-col items-start gap-3 transition-all"
            >
              {/* Timeline dot */}
              <div 
                className="absolute left-[-4px] top-1.5 w-2.5 h-2.5 rounded-full bg-zinc-800 border border-zinc-700 transition-all duration-300 hidden md:block"
                style={{
                  boxShadow: "0 0 0 2px rgba(24,24,27,1)",
                }}
              />

              <span className="text-[10px] font-mono text-emerald-400 tracking-wider">
                {ms.year}
              </span>

              <div className="flex flex-col gap-1">
                <h3 className="font-display font-bold text-lg lg:text-xl uppercase text-white leading-none">
                  {ms.role}
                </h3>
                <span className="text-[11px] font-mono text-zinc-400">
                  ✦ {ms.company}
                </span>
              </div>

              <p className="text-xs lg:text-sm text-zinc-400 font-light leading-relaxed mt-2 char-limit-desktop char-limit-tablet">
                {ms.desc}
              </p>

              <ul className="flex flex-col gap-2 mt-2">
                {ms.bullets.map((b, bIdx) => (
                  <li 
                    key={bIdx} 
                    className="text-[11px] lg:text-xs text-zinc-500 font-light leading-relaxed flex items-start gap-2 max-w-xl char-limit-desktop char-limit-tablet"
                  >
                    <span className="text-emerald-400 mt-1">✦</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
