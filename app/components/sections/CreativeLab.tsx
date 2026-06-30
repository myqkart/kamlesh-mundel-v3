"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CreativePlayground from "./CreativePlayground";
import FacetPrism from "../ui/FacetPrism";
import PrismBadge from "../ui/PrismBadge";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Experiment {
  id: string;
  num: string;
  title: string;
  desc: string;
  category: string;
  accent: string;
}

const experiments: Experiment[] = [
  {
    id: "fluid",
    num: "01",
    category: "WebGL",
    title: "Fluid Dynamics Shader",
    desc: "Real-time pressure grids and cursor-induced force flows in a WebGL buffer.",
    accent: "#00ffaa",
  },
  {
    id: "audio",
    num: "02",
    category: "Canvas",
    title: "Audio Point Cloud",
    desc: "Frequency vertices warping on bass and high-end transients from live audio.",
    accent: "#7dd3fc",
  },
  {
    id: "physics",
    num: "03",
    category: "DOM Physics",
    title: "Elastic Spring System",
    desc: "Spring equations and boundary collisions on native HTML elements.",
    accent: "#fbbf24",
  },
  {
    id: "particles",
    num: "04",
    category: "GPU",
    title: "Particle Drifter",
    desc: "100k coordinates advected along curl-noise vectors in a vertex shader.",
    accent: "#c084fc",
  },
  {
    id: "typography",
    num: "05",
    category: "CSS 3D",
    title: "Iso Typography Grid",
    desc: "Editorial text warping in isometric space from cursor proximity.",
    accent: "#fb7185",
  },
  {
    id: "portal",
    num: "06",
    category: "Raymarch",
    title: "Volumetric Portal",
    desc: "Multi-step raymarched atmospheric light shafts inside a sphere.",
    accent: "#34d399",
  },
];

const HELIX_RADIUS = 300;
const COUNT = experiments.length;

function helixTransform(index: number, rotation: number) {
  const t = (index / COUNT) * Math.PI * 2 + rotation;
  const x = Math.cos(t) * HELIX_RADIUS;
  const z = Math.sin(t) * HELIX_RADIUS;
  const y = Math.sin(t * 2) * 55;
  const faceY = (-t * 180) / Math.PI + 90;
  const depth = (z + HELIX_RADIUS) / (HELIX_RADIUS * 2);
  return { x, y, z, faceY, depth, scale: 0.72 + depth * 0.38, opacity: 0.35 + depth * 0.65 };
}

export default function CreativeLab() {
  const sectionRef = useRef<HTMLElement>(null);
  const helixRef = useRef<HTMLDivElement>(null);
  const rotationRef = useRef(0);
  const targetRotationRef = useRef(0);
  const dragRef = useRef({ active: false, lastX: 0 });
  const rafRef = useRef(0);

  const [selectedExp, setSelectedExp] = useState<string | null>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [, tick] = useState(0);

  const bumpRender = useCallback(() => tick((n) => n + 1), []);

  // Smooth helix rotation loop
  useEffect(() => {
    const step = () => {
      const diff = targetRotationRef.current - rotationRef.current;
      if (Math.abs(diff) > 0.0001) {
        rotationRef.current += diff * 0.08;
        bumpRender();
      }
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [bumpRender]);

  // Scroll drives helix when section visible
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || window.innerWidth < 768) return;

    const st = ScrollTrigger.create({
      trigger: section,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (self) => {
        targetRotationRef.current = self.progress * Math.PI * 2.5;
      },
    });

    return () => st.kill();
  }, []);

  // Idle drift
  useEffect(() => {
    if (window.innerWidth < 768) return;
    let t = 0;
    const id = setInterval(() => {
      if (!dragRef.current.active) {
        t += 0.004;
        targetRotationRef.current += 0.003;
        bumpRender();
      }
    }, 32);
    return () => clearInterval(id);
  }, [bumpRender]);

  const handlePointerDown = (e: React.PointerEvent) => {
    dragRef.current = { active: true, lastX: e.clientX };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current.active) return;
    const dx = e.clientX - dragRef.current.lastX;
    dragRef.current.lastX = e.clientX;
    targetRotationRef.current += dx * 0.006;
    bumpRender();
  };

  const handlePointerUp = () => {
    dragRef.current.active = false;
  };

  const focusExperiment = (idx: number) => {
    setActiveIdx(idx);
    const target = (idx / COUNT) * Math.PI * 2;
    targetRotationRef.current = -target + Math.PI / 2;
  };

  const rotation = rotationRef.current;

  return (
    <section
      ref={sectionRef}
      id="creativelab"
      className="relative w-full min-h-[130vh] bg-transparent text-white select-none py-20 overflow-hidden"
    >
      {/* Isometric vault floor — unique to lab (not particle network) */}
      <div className="absolute inset-x-0 bottom-0 h-[55%] pointer-events-none z-0 overflow-hidden">
        <div className="lab-isometric-floor absolute inset-0 opacity-60" />
        <div className="absolute left-1/2 top-1/3 w-px h-[40%] -translate-x-1/2 bg-gradient-to-b from-transparent via-emerald-400/30 to-transparent helix-scan-beam" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 flex flex-col gap-10">
        <div className="flex flex-col gap-4 max-w-xl">
          <PrismBadge>✦ R&D Playground</PrismBadge>
          <h2 className="font-display font-extrabold text-[2.4rem] lg:text-[3.4rem] leading-none tracking-tight uppercase text-white">
            Creative Lab
            <br />
            <span className="text-zinc-500">& Experiments</span>
          </h2>
          <p className="text-xs lg:text-sm text-zinc-400 font-light leading-relaxed max-w-md">
            Drag the helix vault to orbit specimens. Click a monolith to launch its live simulation.
          </p>
        </div>

        {/* 3D Helix Vault — desktop */}
        <div
          className="hidden md:block relative w-full h-[min(68vh,560px)] cursor-grab active:cursor-grabbing"
          style={{ perspective: "1400px", perspectiveOrigin: "50% 42%" }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          <div
            ref={helixRef}
            className="absolute left-1/2 top-[46%] w-0 h-0"
            style={{ transformStyle: "preserve-3d", transform: "translate(-50%, -50%) rotateX(12deg)" }}
          >
            {/* Central axis column */}
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-48 bg-gradient-to-b from-transparent via-emerald-400/40 to-transparent pointer-events-none"
              style={{ transform: "translateZ(0px)" }}
            />

            {experiments.map((exp, idx) => {
              const { x, y, z, faceY, scale, opacity } = helixTransform(idx, rotation);
              const isActive = activeIdx === idx;

              return (
                <div
                  key={exp.id}
                  className="absolute left-0 top-0 transition-opacity duration-300"
                  style={{
                    transform: `translate3d(${x}px, ${y}px, ${z}px) rotateY(${faceY}deg) scale(${isActive ? scale * 1.08 : scale})`,
                    transformStyle: "preserve-3d",
                    opacity: isActive ? 1 : opacity,
                    zIndex: Math.round(z + HELIX_RADIUS),
                    width: 200,
                    marginLeft: -100,
                    marginTop: -80,
                  }}
                >
                  <FacetPrism
                    variant="vault"
                    accent={exp.accent}
                    as="button"
                    glow={isActive}
                    tilt
                    tiltIntensity={0.7}
                    className="w-full"
                    faceClassName="p-4 min-h-[148px]"
                    onClick={() => {
                      focusExperiment(idx);
                      setSelectedExp(exp.id);
                    }}
                  >
                    <div className="flex flex-col gap-3 text-left h-full">
                      <div className="flex justify-between items-start">
                        <span className="text-[9px] font-mono tracking-widest uppercase" style={{ color: exp.accent }}>
                          {exp.num} // {exp.category}
                        </span>
                        <span
                          className="w-2 h-2 rounded-sm rotate-45"
                          style={{ background: exp.accent, boxShadow: `0 0 8px ${exp.accent}` }}
                        />
                      </div>
                      <h3 className="font-display font-bold text-sm uppercase text-white leading-tight tracking-tight">
                        {exp.title}
                      </h3>
                      <p className="text-[10px] text-zinc-500 font-light leading-relaxed line-clamp-3">{exp.desc}</p>
                      <span className="mt-auto text-[8px] font-mono uppercase tracking-widest" style={{ color: exp.accent }}>
                        Launch →
                      </span>
                    </div>
                  </FacetPrism>
                </div>
              );
            })}
          </div>

          {/* Specimen index */}
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2 pointer-events-auto">
            {experiments.map((exp, idx) => (
              <button
                key={exp.id}
                type="button"
                onClick={() => focusExperiment(idx)}
                className="h-1.5 rounded-full transition-all duration-300"
                style={{
                  width: activeIdx === idx ? 24 : 8,
                  background: activeIdx === idx ? exp.accent : "rgba(255,255,255,0.15)",
                }}
                aria-label={`Focus ${exp.title}`}
              />
            ))}
          </div>
        </div>

        {/* Mobile: stacked vault monoliths */}
        <div className="flex md:hidden flex-col gap-4">
          {experiments.map((exp) => (
            <FacetPrism
              key={exp.id}
              variant="monolith"
              accent={exp.accent}
              as="button"
              glow
              faceClassName="p-5"
              onClick={() => setSelectedExp(exp.id)}
            >
              <span className="text-[9px] font-mono uppercase tracking-widest" style={{ color: exp.accent }}>
                {exp.num} // {exp.category}
              </span>
              <h3 className="font-display font-bold text-base uppercase text-white mt-2">{exp.title}</h3>
              <p className="text-[11px] text-zinc-400 mt-2 font-light">{exp.desc}</p>
            </FacetPrism>
          ))}
        </div>

        <div className="flex flex-col items-center text-center pt-8 border-t border-white/5 opacity-50">
          <p className="font-display font-black text-xl md:text-2xl uppercase tracking-tighter text-zinc-600 max-w-lg">
            &ldquo;Simple things should be simple. Complex things should be possible.&rdquo;
          </p>
          <span className="text-[9px] font-mono text-zinc-700 uppercase tracking-widest mt-3">✦ Alan Kay</span>
        </div>
      </div>

      {selectedExp && (
        <CreativePlayground experimentId={selectedExp} onClose={() => setSelectedExp(null)} />
      )}
    </section>
  );
}
