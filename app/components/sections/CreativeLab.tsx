"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
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
  shortTitle: string;
  desc: string;
  category: string;
  accent: string;
  x: number;
  y: number;
  face: number;
}

const experiments: Experiment[] = [
  {
    id: "fluid",
    num: "01",
    shortTitle: "Fluid Shader",
    title: "Interactive Fluid Dynamics Shader",
    category: "WebGL",
    desc: "Real-time pressure grids and cursor-induced force vectors inside a custom GLSL fragment pipeline.",
    accent: "#22d3ee",
    x: 50,
    y: 14,
    face: 0,
  },
  {
    id: "audio",
    num: "02",
    shortTitle: "Audio Cloud",
    title: "Audio Volumetric Point Cloud",
    category: "Canvas",
    desc: "Frequency vertex clouds mapped from analyzer inputs — bass and transients warp the grid in real time.",
    accent: "#a78bfa",
    x: 86,
    y: 30,
    face: -28,
  },
  {
    id: "physics",
    num: "03",
    shortTitle: "DOM Physics",
    title: "Elastic DOM Physics System",
    category: "GSAP",
    desc: "Spring equations and boundary collisions applied to semantic HTML — UI that feels physically alive.",
    accent: "#fb923c",
    x: 86,
    y: 70,
    face: -28,
  },
  {
    id: "particles",
    num: "04",
    shortTitle: "GPU Drifter",
    title: "Infinite GPU Particle Drifter",
    category: "Three.js",
    desc: "100k independent coordinates adrift on curl noise — vertex shaders computed entirely on the GPU.",
    accent: "#00ffaa",
    x: 50,
    y: 86,
    face: 0,
  },
  {
    id: "typography",
    num: "05",
    shortTitle: "CSS 3D Type",
    title: "Retro CSS 3D Typography Grid",
    category: "CSS 3D",
    desc: "Editorial letterforms warp and pivot in isometric space based on cursor proximity indices.",
    accent: "#f4f4f5",
    x: 14,
    y: 70,
    face: 28,
  },
  {
    id: "portal",
    num: "06",
    shortTitle: "Cloud Portal",
    title: "WebGL Volumetric Cloud Portal",
    category: "Raymarch",
    desc: "Multi-layered noise portal with raymarched atmospheric light shafts inside a sphere volume.",
    accent: "#6366f1",
    x: 14,
    y: 30,
    face: 28,
  },
];

export default function CreativeLab() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const podFragmentRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [scrollIndex, setScrollIndex] = useState(0);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [lockedId, setLockedId] = useState<string | null>(null);
  const [selectedExp, setSelectedExp] = useState<string | null>(null);
  const [isHoveringStage, setIsHoveringStage] = useState(false);
  const [mobileIndex, setMobileIndex] = useState(0);

  const autoRotateRef = useRef(0);
  const lockedRef = useRef(lockedId);
  const hoveringRef = useRef(isHoveringStage);

  useEffect(() => {
    lockedRef.current = lockedId;
  }, [lockedId]);

  useEffect(() => {
    hoveringRef.current = isHoveringStage;
  }, [isHoveringStage]);

  const activeId = lockedId || hoveredId || experiments[scrollIndex]?.id;
  const activeExp = useMemo(
    () => experiments.find((e) => e.id === activeId) || experiments[scrollIndex],
    [activeId, scrollIndex]
  );

  useEffect(() => {
    if (window.innerWidth < 768) return;
    let raf = 0;
    const tick = () => {
      if (orbitRef.current && !isHoveringStage && !lockedId) {
        autoRotateRef.current += 0.04;
        const base = scrollIndex * 60;
        gsap.set(orbitRef.current, { rotateY: base + autoRotateRef.current });
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isHoveringStage, lockedId, scrollIndex]);

  useEffect(() => {
    const container = containerRef.current;
    const sticky = stickyRef.current;
    const orbit = orbitRef.current;
    const intro = introRef.current;

    if (!container || !sticky || !orbit || !intro || window.innerWidth < 768) return;

    const tween = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: () => `+=${window.innerHeight * 2.4}`,
        pin: sticky,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const idx = Math.min(experiments.length - 1, Math.floor(self.progress * experiments.length));
          setScrollIndex(idx);
          if (!lockedRef.current && !hoveringRef.current) {
            gsap.to(orbit, { rotateY: idx * 60, duration: 0.3, ease: "power2.out" });
          }
        },
      },
    });

    tween.fromTo(intro, { opacity: 0, y: -16 }, { opacity: 1, y: 0, duration: 0.15 });
    tween.fromTo(
      podFragmentRefs.current,
      { opacity: 0, z: -80, scale: 0.4 },
      { opacity: 1, z: 0, scale: 1, duration: 0.35, stagger: 0.08, ease: "back.out(1.6)" },
      0.05
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  const handleStageMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!orbitRef.current || window.innerWidth < 768) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      const baseRot = lockedId
        ? experiments.findIndex((ex) => ex.id === lockedId) * 60
        : scrollIndex * 60;

      gsap.to(orbitRef.current, {
        rotateY: baseRot + x * 22,
        rotateX: -y * 14,
        duration: 0.5,
        ease: "power2.out",
      });
    },
    [scrollIndex, lockedId]
  );

  const handlePodClick = (exp: Experiment) => {
    if (lockedId === exp.id) {
      setSelectedExp(exp.id);
    } else {
      setLockedId(exp.id);
      setHoveredId(exp.id);
    }
  };

  return (
    <>
      <section
        ref={containerRef}
        id="creativelab"
        className="hidden md:block relative w-full bg-transparent text-white select-none overflow-hidden"
      >
        <div ref={stickyRef} className="relative w-full h-screen flex flex-col overflow-hidden">
          <CreativeLabBackground focusX={activeExp.x} focusY={activeExp.y} accent={activeExp.accent} />

          <div ref={introRef} className="relative z-20 shrink-0 pt-8 px-10 text-center pointer-events-none">
            <span className="glass-panel inline-block px-3.5 py-1.5 rounded-full text-[10px] font-mono tracking-widest text-zinc-400 uppercase mb-2">
              ✦ R&D Playground
            </span>
            <h2 className="font-display font-extrabold text-[1.6rem] lg:text-[2.2rem] leading-none tracking-tight uppercase text-white">
              Creative Lab & Experiments
            </h2>
            <p className="text-[10px] font-mono text-zinc-500 mt-2">
              Scroll to orbit · Hover pods to inspect · Double-click to launch simulation
            </p>
          </div>

          {/* 3D pod ring */}
          <div
            className="relative flex-1 min-h-0 mx-8 pointer-events-auto"
            onMouseMove={handleStageMouseMove}
            onMouseEnter={() => setIsHoveringStage(true)}
            onMouseLeave={() => {
              setIsHoveringStage(false);
              if (orbitRef.current && !lockedId) {
                gsap.to(orbitRef.current, { rotateX: 0, rotateY: scrollIndex * 60, duration: 0.8 });
              }
            }}
            style={{ perspective: "1500px", perspectiveOrigin: "50% 46%" }}
          >
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none z-[1]"
              viewBox="0 0 100 100"
              preserveAspectRatio="xMidYMid meet"
            >
              {experiments.map((exp) => {
                const hot = exp.id === activeId;
                return (
                  <line
                    key={`beam-${exp.id}`}
                    x1="50"
                    y1="50"
                    x2={exp.x}
                    y2={exp.y}
                    stroke={hot ? `${exp.accent}88` : "rgba(0,255,170,0.08)"}
                    strokeWidth={hot ? 0.22 : 0.1}
                    className={hot ? "lab-beam-pulse" : undefined}
                  />
                );
              })}
            </svg>

            {/* Reactor core */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[3] pointer-events-none">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500"
                style={{
                  background: `radial-gradient(circle, ${activeExp.accent}33 0%, transparent 70%)`,
                  boxShadow: `0 0 36px ${activeExp.accent}44`,
                  border: `1px solid ${activeExp.accent}55`,
                }}
              >
                <div
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ background: activeExp.accent, boxShadow: `0 0 12px ${activeExp.accent}` }}
                />
              </div>
              <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[7px] font-mono uppercase tracking-[0.3em] text-emerald-400/80 whitespace-nowrap">
                Lab Core
              </span>
            </div>

            <div
              ref={tiltRef}
              className="absolute inset-0"
              style={{ transformStyle: "preserve-3d", transform: "rotateX(12deg)" }}
            >
              <div ref={orbitRef} className="absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
                {experiments.map((exp, idx) => {
                  const isActive = activeId === exp.id;
                  const isDimmed = activeId && activeId !== exp.id;

                  return (
                    <div
                      key={exp.id}
                      className="absolute"
                      style={{
                        left: `${exp.x}%`,
                        top: `${exp.y}%`,
                        zIndex: isActive ? 30 : 10,
                      }}
                    >
                      <div
                        ref={(el) => {
                          podFragmentRefs.current[idx] = el;
                        }}
                        style={{ transformStyle: "preserve-3d" }}
                      >
                        <button
                          type="button"
                          className="relative -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ease-out cursor-pointer group outline-none"
                          style={{
                            transform: `rotateY(${exp.face}deg) translateZ(${isActive ? 90 : 24}px) scale(${isDimmed ? 0.75 : isActive ? 1.1 : 1})`,
                            transformStyle: "preserve-3d",
                            opacity: isDimmed ? 0.45 : 1,
                          }}
                          onMouseEnter={() => setHoveredId(exp.id)}
                          onMouseLeave={() => {
                            if (!lockedId) setHoveredId(null);
                          }}
                          onClick={() => handlePodClick(exp)}
                          onDoubleClick={() => setSelectedExp(exp.id)}
                        >
                          {/* Wireframe prism */}
                          <div
                            className="absolute inset-0 -m-3 rounded-lg border opacity-40 group-hover:opacity-70 transition-opacity pointer-events-none"
                            style={{
                              borderColor: exp.accent,
                              transform: "translateZ(-8px) rotateX(45deg)",
                              boxShadow: `0 0 20px ${exp.accent}22`,
                            }}
                          />

                          {/* Compact crystal */}
                          <div
                            className={`flex flex-col items-center justify-center rounded-2xl border backdrop-blur-xl transition-all duration-500 ${
                              isActive ? "w-[200px] p-4" : "w-[80px] h-[88px] p-2"
                            }`}
                            style={{
                              borderColor: isActive ? `${exp.accent}66` : `${exp.accent}33`,
                              background: `linear-gradient(145deg, ${exp.accent}12, rgba(0,0,0,0.85))`,
                              boxShadow: isActive ? `0 0 40px ${exp.accent}25` : `0 0 16px ${exp.accent}15`,
                            }}
                          >
                            <span
                              className="text-[9px] font-mono font-bold tracking-widest"
                              style={{ color: exp.accent }}
                            >
                              {exp.num} // {exp.category}
                            </span>

                            {isActive ? (
                              <>
                                <h3 className="font-display font-bold text-sm uppercase text-white text-center leading-tight mt-2 mb-2">
                                  {exp.title}
                                </h3>
                                <p className="text-[10px] text-zinc-400 font-light leading-relaxed text-center mb-3">
                                  {exp.desc}
                                </p>
                                <span
                                  className="text-[8px] font-mono uppercase tracking-widest px-3 py-1.5 rounded-full border"
                                  style={{ borderColor: `${exp.accent}44`, color: exp.accent }}
                                >
                                  {lockedId === exp.id ? "Click again to launch →" : "Click to lock · Double-click launch"}
                                </span>
                              </>
                            ) : (
                              <>
                                <span className="text-[8px] font-mono text-white/90 text-center leading-tight mt-2 uppercase">
                                  {exp.shortTitle}
                                </span>
                              </>
                            )}
                          </div>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* HUD detail strip */}
          <div className="relative z-20 shrink-0 mx-8 mb-6">
            <div className="glass-panel rounded-2xl border border-white/8 px-6 py-4 flex items-center justify-between gap-6">
              <div className="flex items-center gap-4 min-w-0">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-mono text-sm font-bold"
                  style={{
                    background: `${activeExp.accent}18`,
                    color: activeExp.accent,
                    border: `1px solid ${activeExp.accent}44`,
                  }}
                >
                  {activeExp.num}
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] font-mono uppercase tracking-widest text-zinc-500">{activeExp.category}</p>
                  <p className="text-sm font-semibold text-white truncate">{activeExp.title}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {experiments.map((exp, i) => (
                  <button
                    key={exp.id}
                    type="button"
                    onClick={() => {
                      setScrollIndex(i);
                      setLockedId(exp.id);
                      setHoveredId(exp.id);
                      if (orbitRef.current) {
                        gsap.to(orbitRef.current, { rotateY: i * 60, duration: 0.6, ease: "power3.out" });
                      }
                    }}
                    className="rounded-full transition-all duration-300"
                    style={{
                      width: activeId === exp.id ? 20 : 6,
                      height: 6,
                      background: activeId === exp.id ? exp.accent : "rgba(255,255,255,0.15)",
                    }}
                    aria-label={exp.title}
                  />
                ))}
                <button
                  type="button"
                  onClick={() => setSelectedExp(activeExp.id)}
                  className="ml-2 px-4 py-2 rounded-full text-[10px] font-mono uppercase tracking-wider border border-emerald-400/30 text-emerald-400 hover:bg-emerald-950/30 transition-colors cursor-pointer"
                >
                  Launch
                </button>
              </div>
            </div>
          </div>

          <div className="absolute bottom-2 left-10 text-[9px] font-mono text-zinc-600 z-20">
            ✦ Kamlesh Mundel
          </div>
        </div>
      </section>

      {/* Mobile: 3D-tilt swipe deck */}
      <section className="block md:hidden relative w-full min-h-screen py-16 px-5 overflow-hidden">
        <CreativeLabBackground focusX={50} focusY={40} accent={experiments[mobileIndex].accent} />

        <div className="relative z-10 flex flex-col gap-6">
          <div>
            <span className="glass-panel inline-block px-3 py-1 rounded-full text-[9px] font-mono text-zinc-400 uppercase mb-3">
              ✦ R&D Playground
            </span>
            <h2 className="font-display font-extrabold text-[2rem] uppercase leading-none text-white">
              Creative Lab
            </h2>
          </div>

          <div
            className="flex overflow-x-auto snap-x snap-mandatory gap-4 no-scrollbar pb-4"
            onScroll={(e) => setMobileIndex(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}
          >
            {experiments.map((exp) => (
              <button
                key={exp.id}
                type="button"
                onClick={() => setSelectedExp(exp.id)}
                className="w-[88vw] shrink-0 snap-center text-left"
                style={{ perspective: "800px" }}
              >
                <div
                  className="glass-panel rounded-2xl p-6 border flex flex-col gap-4 min-h-[280px]"
                  style={{
                    borderColor: `${exp.accent}33`,
                    transform: "rotateX(4deg)",
                    boxShadow: `0 20px 60px ${exp.accent}15`,
                  }}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-mono font-bold" style={{ color: exp.accent }}>
                      {exp.num} // {exp.category}
                    </span>
                    <span
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-mono"
                      style={{ background: `${exp.accent}15`, color: exp.accent }}
                    >
                      {exp.num}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-xl uppercase text-white leading-tight">{exp.title}</h3>
                  <p className="text-xs text-zinc-400 font-light leading-relaxed flex-1">{exp.desc}</p>
                  <span className="text-[9px] font-mono uppercase tracking-widest" style={{ color: exp.accent }}>
                    Tap to launch simulation →
                  </span>
                </div>
              </button>
            ))}
          </div>

          <div className="flex justify-center gap-1.5">
            {experiments.map((exp, i) => (
              <div
                key={exp.id}
                className="h-[3px] rounded-full transition-all"
                style={{
                  width: i === mobileIndex ? 18 : 6,
                  background: i === mobileIndex ? exp.accent : "rgba(255,255,255,0.12)",
                }}
              />
            ))}
          </div>

          <p className="text-center font-display text-lg uppercase text-zinc-600 tracking-tight opacity-50 pt-4">
            &ldquo;Complex things should be possible.&rdquo;
          </p>
        </div>
      </section>

      {selectedExp && (
        <CreativePlayground experimentId={selectedExp} onClose={() => setSelectedExp(null)} />
      )}

      <style jsx global>{`
        @keyframes lab-beam-pulse {
          to {
            stroke-dashoffset: -10;
          }
        }
        .lab-beam-pulse {
          stroke-dasharray: 2 1.5;
          animation: lab-beam-pulse 0.7s linear infinite;
        }
      `}</style>
    </>
  );
}
