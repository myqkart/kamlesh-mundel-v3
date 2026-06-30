"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import FacetPrism from "../ui/FacetPrism";
import PrismBadge from "../ui/PrismBadge";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Stage {
  num: string;
  title: string;
  desc: string;
  accent: string;
}

const stages: Stage[] = [
  {
    num: "00 // The Context",
    title: "Cinematic Luxury Travel Showcases",
    desc: "AVN Holidays requested a digital flagship presence that could capture the emotional anticipation of luxury travel. Standard layouts could not represent the premium, bespoke journeys they offer.",
    accent: "#94a3b8",
  },
  {
    num: "01 // The Problem",
    title: "Static, Slow, and Impersonal Interfaces",
    desc: "Existing platforms relied on slow monolithic frameworks and static image grids. Bounce rate was high — page loads exceeded 4.2s with zero cinematic storytelling.",
    accent: "#f87171",
  },
  {
    num: "02 // The Strategy",
    title: "Next.js Core & Edge Routing Engine",
    desc: "Architected on Next.js with Edge middleware and ISR for sub-500ms global loads. Mapped a database schema built for fast relational queries at scale.",
    accent: "#60a5fa",
  },
  {
    num: "03 // The Design System",
    title: "Cinematic Motion & Fluid Aesthetics",
    desc: "Fluid layout system with variable fonts, backdrop-filters, custom vector grids, and scroll-driven parallax to guide visitors through itineraries.",
    accent: "#fbbf24",
  },
  {
    num: "04 // The Engineering",
    title: "GSAP Scrubbers & Three.js Shaders",
    desc: "Custom WebGL canvas for volumetric atmospheric lighting. Interaction tuned to 200ms — snappy clicks, buttery layout transitions.",
    accent: "#a78bfa",
  },
  {
    num: "05 // The Outcome",
    title: "Speed, Conversion & Awards Recognition",
    desc: "99/100 Lighthouse score, +350% mobile inquiry conversion, and pre-qualification for CSSDA and Awwwards design recognition.",
    accent: "#00ffaa",
  },
];

const metrics = [
  { label: "Load Speed", value: "0.4s", hot: false },
  { label: "Performance", value: "99/100", hot: false },
  { label: "Mobile Inquiries", value: "+350%", hot: true },
  { label: "FPS Target", value: "60fps", hot: false },
];

const STEP_SPACING = 280;

function stageTransform(idx: number, progress: number) {
  const distance = idx - progress;
  const absDist = Math.abs(distance);
  const lane = idx % 2 === 0 ? -1 : 1;

  const z = 180 - absDist * 95;
  const y = distance * STEP_SPACING;
  const x = lane * Math.min(72, absDist * 38);
  const rotateY = lane * Math.min(24, 6 + absDist * 10);
  const rotateX = 14 + distance * -7;
  const scale = Math.max(0.72, 1.08 - absDist * 0.1);
  const opacity = Math.max(0.18, 1 - absDist * 0.32);

  return { x, y, z, rotateX, rotateY, scale, opacity, absDist };
}

export default function CaseStudies() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const corridorRef = useRef<HTMLDivElement>(null);
  const stageRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [activeIdx, setActiveIdx] = useState(0);
  const [pipelineProgress, setPipelineProgress] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const bumpIdx = useCallback((idx: number) => setActiveIdx(idx), []);

  useEffect(() => {
    const container = containerRef.current;
    const sticky = stickyRef.current;
    const corridor = corridorRef.current;
    if (!container || !sticky || !corridor || window.innerWidth < 768) return;

    gsap.set(corridor, {
      rotateX: 16,
      transformPerspective: 1600,
      left: "50%",
      top: "50%",
      xPercent: -50,
      yPercent: -50,
      force3D: true,
    });

    const scrollTrigger = ScrollTrigger.create({
      trigger: container,
      start: "top top",
      end: () => `+=${window.innerHeight * (stages.length - 1 + 0.7)}`,
      pin: sticky,
      scrub: 1.1,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const floatIdx = self.progress * (stages.length - 1);
        setPipelineProgress(floatIdx);
        bumpIdx(Math.min(stages.length - 1, Math.round(floatIdx)));
      },
    });

    return () => {
      scrollTrigger.kill();
    };
  }, [bumpIdx]);

  // Mobile: simple stagger reveal
  useEffect(() => {
    if (typeof window === "undefined" || window.innerWidth >= 768) return;

    stageRefs.current.forEach((el) => {
      if (!el) return;
      gsap.fromTo(
        el,
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!corridorRef.current || window.innerWidth < 768) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    gsap.to(corridorRef.current, {
      rotateY: x * 22,
      rotateX: 16 - y * 12,
      xPercent: -50,
      yPercent: -50,
      duration: 0.6,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    if (!corridorRef.current) return;
    gsap.to(corridorRef.current, {
      rotateY: 0,
      rotateX: 16,
      xPercent: -50,
      yPercent: -50,
      duration: 0.9,
      ease: "power2.out",
    });
  };

  return (
    <section
      ref={containerRef}
      id="casestudies"
      className="relative w-full bg-transparent text-white select-none overflow-x-hidden pt-8 md:pt-0"
    >
      {/* ─── Desktop: pinned 3D investigation pipeline ─── */}
      <div className="hidden md:block relative">
        <div
          ref={stickyRef}
          className="relative w-full h-screen grid md:grid-cols-[minmax(18rem,30%)_1fr]"
        >
          <div className="absolute inset-0 case-blueprint-bg pointer-events-none opacity-60" />
          <div className="absolute inset-0 case-pipeline-glow pointer-events-none" />

          {/* Left: dossier sidebar */}
          <div className="relative z-20 w-full max-w-[22rem] lg:max-w-[26rem] shrink-0 flex flex-col justify-between py-12 pl-10 lg:pl-14 pr-8">
            <div className="flex flex-col gap-5">
              <PrismBadge>✦ Deep Dive Case Study</PrismBadge>
              <h2 className="font-display font-extrabold text-[1.75rem] lg:text-[2.35rem] leading-[1.05] tracking-tight uppercase text-white">
                How Do I
                <br />
                Solve Problems?
              </h2>
              <p className="text-[11px] lg:text-xs text-zinc-400 leading-relaxed font-light max-w-sm">
                Scroll the investigation pipeline — six forensic stages from context to measurable outcome on the AVN Holidays flagship.
              </p>
            </div>

            {/* Active stage HUD */}
            <div className="flex flex-col gap-3 my-6">
              <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
                Active Phase
              </span>
              <FacetPrism
                variant="chip"
                accent={stages[activeIdx].accent}
                tilt={false}
                glow
                faceClassName="px-4 py-2"
              >
                <span className="text-[10px] font-mono uppercase tracking-wider" style={{ color: stages[activeIdx].accent }}>
                  {stages[activeIdx].num}
                </span>
              </FacetPrism>
            </div>

            {/* Metrics */}
            <div className="flex flex-col gap-3">
              <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase">
                ✦ Case Metrics
              </span>
              <div className="grid grid-cols-2 gap-2">
                {metrics.map((m) => (
                  <FacetPrism
                    key={m.label}
                    variant="chip"
                    accent={m.hot && activeIdx >= 4 ? "#00ffaa" : "#ffffff"}
                    tilt={false}
                    glow={m.hot && activeIdx >= 4}
                    faceClassName="p-3"
                  >
                    <div className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest mb-0.5">
                      {m.label}
                    </div>
                    <div
                      className="text-lg font-bold font-mono transition-colors duration-500"
                      style={{ color: m.hot && activeIdx >= 4 ? "#00ffaa" : "#fff" }}
                    >
                      {m.value}
                    </div>
                  </FacetPrism>
                ))}
              </div>
            </div>

            {/* Step rail */}
            <div className="flex items-center gap-2">
              {stages.map((st, idx) => (
                <button
                  key={st.num}
                  type="button"
                  className={`h-1.5 rounded-full transition-all duration-400 ${
                    activeIdx === idx ? "case-active-node" : ""
                  }`}
                  style={{
                    width: activeIdx === idx ? 22 : 7,
                    background: activeIdx === idx ? st.accent : "rgba(255,255,255,0.12)",
                  }}
                  aria-label={`Phase ${idx}`}
                />
              ))}
            </div>
          </div>

          {/* Right: 3D pipeline corridor */}
          <div
            className="relative flex-1 min-w-0 z-10 flex items-center justify-center px-4 lg:px-8 xl:px-12"
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={handleMouseLeave}
          >
            <div
              className="relative w-full max-w-3xl h-full case-pipeline-viewport"
              style={{ perspective: "1600px", perspectiveOrigin: "50% 46%" }}
            >
              {/* Vertical spine SVG */}
              <svg
                className="absolute left-1/2 -translate-x-1/2 top-[6%] bottom-[6%] w-10 pointer-events-none opacity-50"
                viewBox="0 0 20 400"
                preserveAspectRatio="none"
              >
                <path
                  d="M10 0 V400"
                  stroke="rgba(0,255,170,0.35)"
                  strokeWidth="0.6"
                  strokeDasharray="4 4"
                />
                {stages.map((_, i) => {
                  const dist = Math.abs(i - pipelineProgress);
                  return (
                    <circle
                      key={i}
                      cx="10"
                      cy={20 + i * (360 / (stages.length - 1))}
                      r={dist < 0.5 ? 4 : 1.5}
                      fill={dist < 0.5 ? stages[i].accent : "rgba(255,255,255,0.2)"}
                    />
                  );
                })}
              </svg>

              <div
                className="absolute inset-0 case-pipeline-stage"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div
                  ref={corridorRef}
                  className="absolute w-[min(100%,40rem)]"
                  style={{
                    transformStyle: "preserve-3d",
                    willChange: "transform",
                  }}
                >
                  {stages.map((st, idx) => {
                    const { x, y, z, rotateX, rotateY, scale, opacity, absDist } =
                      stageTransform(idx, pipelineProgress);
                    const isActive = absDist < 0.45;

                    return (
                      <div
                        key={st.num}
                        className="absolute left-1/2 top-1/2 w-full case-pipeline-card"
                        style={{
                          transform: `translate3d(calc(-50% + ${x}px), calc(-50% + ${y}px), ${z}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`,
                          transformStyle: "preserve-3d",
                          opacity,
                          zIndex: Math.round(100 - absDist * 10),
                          pointerEvents: isActive ? "auto" : "none",
                        }}
                      >
                        <FacetPrism
                          variant="monolith"
                          accent={st.accent}
                          glow={isActive}
                          tilt={isActive}
                          tiltIntensity={0.85}
                          depth={32}
                          faceClassName="p-6 lg:p-7"
                        >
                        <div className="flex flex-col gap-3">
                          <div className="flex justify-between items-center">
                            <span
                              className="text-[10px] font-mono tracking-widest uppercase"
                              style={{ color: st.accent }}
                            >
                              {st.num}
                            </span>
                            <span className="text-[9px] font-mono text-zinc-600">
                              Phase {idx + 1}/{stages.length}
                            </span>
                          </div>
                          <h3 className="font-display font-bold text-base lg:text-lg uppercase text-white tracking-tight leading-tight">
                            {st.title}
                          </h3>
                          <p className="text-[11px] lg:text-xs text-zinc-400 font-light leading-relaxed">
                            {st.desc}
                          </p>
                          {isActive && (
                            <div
                              className="mt-1 h-px w-full"
                              style={{
                                background: `linear-gradient(90deg, transparent, ${st.accent}88, transparent)`,
                              }}
                            />
                          )}
                        </div>
                      </FacetPrism>
                    </div>
                  );
                  })}
                </div>
              </div>

              <p className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[9px] font-mono text-zinc-600 uppercase tracking-widest pointer-events-none whitespace-nowrap">
                {isHovering ? "Parallax active" : "Scroll to advance pipeline"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Mobile: stacked dossier cards ─── */}
      <div className="block md:hidden py-20 px-6 max-w-xl mx-auto w-full">
        <div className="flex flex-col gap-4 mb-10">
          <PrismBadge>✦ Case Study</PrismBadge>
          <h2 className="font-display font-extrabold text-[2rem] uppercase text-white leading-none">
            How Do I Solve Problems?
          </h2>
          <p className="text-xs text-zinc-400 font-light">
            AVN Holidays — six stages from problem to outcome.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-10">
          {metrics.map((m) => (
            <FacetPrism key={m.label} variant="chip" accent="#00ffaa" tilt={false} faceClassName="p-3">
              <div className="text-[8px] font-mono text-zinc-500 uppercase">{m.label}</div>
              <div className="text-base font-mono font-bold text-emerald-400">{m.value}</div>
            </FacetPrism>
          ))}
        </div>

        <div className="flex flex-col gap-6">
          {stages.map((st, idx) => (
            <div key={st.num} ref={(el) => { stageRefs.current[idx] = el; }}>
              <FacetPrism variant="slab" accent={st.accent} glow faceClassName="p-5">
                <span className="text-[9px] font-mono uppercase tracking-widest" style={{ color: st.accent }}>
                  {st.num}
                </span>
                <h3 className="font-display font-bold text-sm uppercase text-white mt-2 leading-tight">
                  {st.title}
                </h3>
                <p className="text-[11px] text-zinc-400 mt-2 font-light leading-relaxed">{st.desc}</p>
              </FacetPrism>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
