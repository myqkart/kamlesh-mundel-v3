"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import MagneticButton from "../ui/MagneticButton";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Portal {
  label: string;
  hint: string;
  icon: string;
  href: string;
  accent: string;
}

const contactPortals: Portal[] = [
  {
    label: "Direct Email",
    hint: "kamlesh.mundel@gmail.com",
    icon: "✉",
    href: "mailto:kamlesh.mundel@gmail.com",
    accent: "#00ffaa",
  },
  {
    label: "LinkedIn Professional",
    hint: "connect / message",
    icon: "🔗",
    href: "https://linkedin.com",
    accent: "#ffffff",
  },
  {
    label: "Open Source GitHub",
    hint: "codebases / repositories",
    icon: "⌨",
    href: "https://github.com",
    accent: "#00ffaa",
  },
  {
    label: "Sync Calendar",
    hint: "schedule / book call",
    icon: "📅",
    href: "https://calendly.com",
    accent: "#ffffff",
  }
];

const availabilityFocus = [
  "Bespoke SaaS Architecture",
  "High-End Visual Products",
  "Interactive WebGL Engines",
  "React & Next.js Performance"
];

function ContactPortal({ portal }: { portal: Portal }) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLAnchorElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    gsap.to(ref.current, { rotateY: x * 10, rotateX: -y * 8, duration: 0.3, ease: "power2.out", transformPerspective: 600 });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHovered(false);
    gsap.to(ref.current, { rotateY: 0, rotateX: 0, duration: 0.6, ease: "elastic.out(1, 0.4)" });
  }, []);

  return (
    <a
      ref={ref}
      href={portal.href}
      target="_blank"
      rel="noopener noreferrer"
      className="relative glass-panel rounded-2xl p-5 flex flex-col gap-3 cursor-pointer select-none transition-all duration-300 no-underline flex-1 min-w-[200px]"
      style={{
        borderColor: hovered ? `${portal.accent}30` : "rgba(255,255,255,0.06)",
        boxShadow: hovered ? `0 0 30px ${portal.accent}05, 0 10px 30px rgba(0,0,0,0.5)` : "0 4px 16px rgba(0,0,0,0.4)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="absolute top-0 left-4 right-4 h-px rounded-full transition-opacity duration-300"
        style={{ background: portal.accent, opacity: hovered ? 0.8 : 0 }}
      />

      <div
        className="w-8 h-8 rounded-xl flex items-center justify-center text-sm transition-all duration-300"
        style={{
          background: hovered ? `${portal.accent}12` : "rgba(255,255,255,0.03)",
          border: `1px solid ${hovered ? portal.accent + "30" : "rgba(255,255,255,0.06)"}`,
          color: hovered ? portal.accent : "rgba(255,255,255,0.4)",
        }}
      >
        {portal.icon}
      </div>

      <div>
        <p className="text-xs font-bold text-white leading-none mb-1">{portal.label}</p>
        <p className="text-[10px] font-mono text-zinc-500">{portal.hint}</p>
      </div>

      <div
        className="absolute top-4 right-4 text-[9px] transition-all duration-300"
        style={{ color: portal.accent, opacity: hovered ? 1 : 0, transform: hovered ? "translate(2px, -2px)" : "translate(0,0)" }}
      >
        ↗
      </div>
    </a>
  );
}

export default function Contact() {
  const containerRef = useRef<HTMLDivElement>(null);
  const elementsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || window.innerWidth < 768) return;

    if (elementsRef.current) {
      gsap.fromTo(
        elementsRef.current.children,
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.12,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }
  }, []);

  return (
    <section
      ref={containerRef}
      id="contact"
      className="relative w-full min-h-[120vh] bg-transparent text-white select-none py-24 px-6 md:px-16 lg:px-24 overflow-hidden flex items-center"
    >
      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div ref={elementsRef} className="flex flex-col gap-16">
          <div className="flex flex-col gap-4 text-center items-center max-w-3xl mx-auto">
            <span className="glass-panel w-fit px-3.5 py-1.5 rounded-full text-[10px] font-mono tracking-widest text-zinc-400 uppercase">
              ✦ Initiate Collaboration
            </span>

            <h2 className="font-display font-extrabold text-[2.8rem] lg:text-[4.2rem] leading-none tracking-tighter uppercase text-white">
              Let&apos;s Create Something People Will Remember.
            </h2>

            <p className="text-xs lg:text-sm text-zinc-400 leading-relaxed font-light char-limit-desktop char-limit-tablet">
              Whether you are architecting a luxury showcase, optimizing production code libraries, or seeking UI leadership, the conversation starts with a single message.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 flex flex-col gap-8">
              <div className="flex flex-col gap-4">
                <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase">
                  ✦ Contact Portals
                </span>
                <div className="flex flex-wrap gap-4 w-full">
                  {contactPortals.map((portal) => (
                    <ContactPortal key={portal.label} portal={portal} />
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
                    Currently Booking For
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {availabilityFocus.map((f) => (
                    <span
                      key={f}
                      className="glass-panel px-3.5 py-1.5 rounded-full text-[10px] font-mono text-emerald-400 border border-emerald-400/10"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-8 glass-panel p-8 border border-white/5 rounded-2xl">
              <div className="flex flex-col gap-4 text-center lg:text-left">
                <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase">
                  ✦ Next Steps
                </span>
                <h3 className="font-display font-bold text-lg uppercase text-white tracking-tight leading-snug">
                  Ready to start?
                </h3>
                <p className="text-[11px] text-zinc-400 font-light leading-relaxed">
                  Select a portal on the left or launch the booking process instantly below. Keep code clean, design premium, and outcome targeted.
                </p>
              </div>

              <div className="flex flex-col items-center lg:items-start gap-4">
                <div className="relative w-full flex justify-center lg:justify-start">
                  <div
                    className="absolute inset-0 rounded-full animate-ping opacity-15 bg-emerald-400"
                    style={{ animationDuration: "2.5s" }}
                  />
                  <MagneticButton
                    variant="primary"
                    className="relative z-10 px-8 py-4 text-sm font-bold tracking-wide w-full max-w-[280px]"
                    onClick={() => window.open("mailto:kamlesh.mundel@gmail.com", "_blank")}
                  >
                    Launch Booking
                  </MagneticButton>
                </div>

                <div className="flex justify-center lg:justify-start gap-6 mt-2 w-full">
                  {[
                    { label: "View Resume", href: "#" },
                    { label: "Explore GitHub", href: "https://github.com" },
                  ].map((action) => (
                    <a
                      key={action.label}
                      href={action.href}
                      className="text-[10px] font-mono text-zinc-500 hover:text-emerald-400 transition-colors duration-200 underline underline-offset-4 decoration-zinc-800"
                    >
                      {action.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
