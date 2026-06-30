"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Testimonial {
  name: string;
  role: string;
  relationship: string;
  text: string;
}

const testimonials: Testimonial[] = [
  {
    name: "AVN Holidays Director",
    role: "Managing Director",
    relationship: "Client Partnership",
    text: "Kamlesh rebuilt our client-facing web application, converting it from a sluggish legacy site into an award-winning cinematic experience. Inquiry volume increased by 350% within three weeks of launch."
  },
  {
    name: "LTIMindtree Lead Architect",
    role: "Principal Architect",
    relationship: "Project Delivery Lead",
    text: "Kamlesh has a rare combination of visual sensitivity and coding discipline. He spearheaded the optimization of our state caching modules, decreasing runtime memory footprints by 32%."
  },
  {
    name: "Tech Collaborator",
    role: "Lead Systems Engineer",
    relationship: "Peer Engineer",
    text: "Working with Kamlesh is an exercise in engineering precision. He writes clean, predictable Javascript, builds accessible components, and pushes the boundary of what browser layout layers can do."
  }
];

export default function Testimonials() {
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
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });
  }, []);

  return (
    <section
      ref={containerRef}
      id="testimonials"
      className="relative w-full min-h-[100vh] bg-transparent text-white select-none py-24 px-6 md:px-16 lg:px-24 overflow-hidden flex items-center"
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-16 relative z-10 w-full">
        <div className="flex flex-col gap-4 text-center items-center max-w-2xl mx-auto">
          <span className="glass-panel w-fit px-3.5 py-1.5 rounded-full text-[10px] font-mono tracking-widest text-zinc-400 uppercase">
            ✦ Client & Peer Reviews
          </span>
          <h2 className="font-display font-extrabold text-[2.8rem] lg:text-[3.8rem] leading-none tracking-tight uppercase text-white">
            Trust Built Through Delivery
          </h2>
          <p className="text-xs lg:text-sm text-zinc-400 leading-relaxed font-light char-limit-desktop char-limit-tablet">
            Direct feedback from client directors, architectural leads, and technical collaborators who have experienced the engineering process first-hand.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              ref={(el) => { cardRefs.current[idx] = el; }}
              className="glass-panel p-8 border border-white/5 rounded-2xl flex flex-col justify-between gap-6 hover:border-emerald-500/10 hover:shadow-[0_0_20px_rgba(0,255,170,0.02)] transition-all duration-300"
            >
              <div className="flex flex-col gap-2">
                <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
                  &ldquo; Testimonial
                </span>
                <p className="text-xs lg:text-sm text-zinc-300 leading-relaxed font-light italic char-limit-desktop char-limit-tablet">
                  &ldquo;{t.text}&rdquo;
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/5 w-full">
                <div className="flex flex-col">
                  <h4 className="font-display font-bold text-xs uppercase text-white tracking-wide">
                    {t.name}
                  </h4>
                  <span className="text-[10px] text-zinc-500 font-light mt-0.5">
                    {t.role}
                  </span>
                </div>
                <span className="glass-panel px-2.5 py-1 rounded text-[8px] font-mono text-emerald-400 uppercase tracking-widest border border-white/5">
                  {t.relationship}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
