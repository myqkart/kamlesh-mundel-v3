"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const SHARD_COUNT = 7;
const SHARD_COLORS = [
  "#94a3b8",
  "#f87171",
  "#60a5fa",
  "#fbbf24",
  "#a78bfa",
  "#00ffaa",
  "#e4e4e7",
];

function shardTransform(index: number, progress: number) {
  const orbitAngle = (index / SHARD_COUNT) * Math.PI * 2 + progress * Math.PI * 1.2;
  const scatterRadius = 220 * (1 - progress * 0.88);
  const stackY = (index - (SHARD_COUNT - 1) / 2) * 52 * progress;
  const stackX = index % 2 === 0 ? -36 * progress : 36 * progress;

  const x = Math.cos(orbitAngle) * scatterRadius * (1 - progress * 0.15) + stackX;
  const z = Math.sin(orbitAngle) * scatterRadius * (1 - progress * 0.15);
  const y = Math.sin(orbitAngle * 1.6) * 55 * (1 - progress) + stackY;

  const rotY = (orbitAngle * 180) / Math.PI + progress * 120;
  const rotX = 18 + index * 14 + progress * 40;
  const scale = 0.55 + progress * 0.35;

  return { x, y, z, rotX, rotY, scale };
}

export default function CaseStudyBridge() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sculptureRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    const sculpture = sculptureRef.current;
    const core = coreRef.current;
    const ring = ringRef.current;
    const grid = gridRef.current;
    const label = labelRef.current;
    if (!container || !sculpture || !core || !ring || !grid || !label) return;

    const tween = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top bottom",
        end: "bottom top",
        scrub: 1.4,
        invalidateOnRefresh: true,
        onUpdate: (self) => setProgress(self.progress),
      },
    });

    tween.to(
      sculpture,
      { rotateY: 180, ease: "none" },
      0
    );
    tween.to(
      core,
      {
        scale: 1.35,
        rotateX: 360,
        rotateZ: 180,
        ease: "none",
      },
      0
    );
    tween.to(
      ring,
      {
        rotateZ: -270,
        scale: 1.2,
        opacity: 1,
        ease: "none",
      },
      0
    );
    tween.fromTo(
      grid,
      { opacity: 0 },
      { opacity: 0.65, ease: "none" },
      0.55
    );
    tween.fromTo(
      label,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, ease: "none" },
      0.35
    );
    tween.to(label, { opacity: 0, y: -16, ease: "none" }, 0.82);

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!sculptureRef.current || window.innerWidth < 768) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    gsap.to(sculptureRef.current, {
      rotateX: -y * 12,
      duration: 0.7,
      ease: "power2.out",
    });
    gsap.to(ringRef.current, {
      rotateX: y * 8,
      duration: 0.7,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    gsap.to(sculptureRef.current, { rotateX: 0, duration: 0.9, ease: "power2.out" });
    gsap.to(ringRef.current, { rotateX: 0, duration: 0.9, ease: "power2.out" });
  };

  const labelOpacity =
    progress < 0.35 ? progress / 0.35 : progress > 0.82 ? Math.max(0, 1 - (progress - 0.82) / 0.18) : 1;

  return (
    <section
      ref={containerRef}
      id="case-bridge"
      aria-hidden={false}
      className="relative w-full bridge-section text-white select-none overflow-hidden"
    >
      <div
        className="sticky top-0 h-screen flex flex-col items-center justify-center"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div ref={gridRef} className="absolute inset-0 bridge-blueprint-grid opacity-0 pointer-events-none" />
        <div
          className="absolute inset-0 pointer-events-none bridge-vignette"
          style={{ opacity: 0.4 + progress * 0.35 }}
        />

        {/* Floating label */}
        <div
          ref={labelRef}
          className="absolute top-[18%] z-30 flex flex-col items-center gap-3 text-center px-6 pointer-events-none"
          style={{ opacity: labelOpacity }}
        >
          <span className="text-[9px] font-mono tracking-[0.35em] text-emerald-400/80 uppercase">
            ✦ Transition Buffer
          </span>
          <p className="font-display font-bold text-lg md:text-2xl uppercase tracking-tight text-white/90">
            {progress < 0.5 ? "Crystallizing Process" : "Pipeline Ready"}
          </p>
          <span className="text-[10px] font-mono text-zinc-500 max-w-xs">
            {progress < 0.5
              ? "Portfolio fragments reassemble into forensic stages"
              : "Entering deep-dive case study"}
          </span>
        </div>

        {/* 3D sculpture */}
        <div
          className="relative w-full h-full flex items-center justify-center"
          style={{ perspective: "1100px", perspectiveOrigin: "50% 48%" }}
        >
          <div
            ref={sculptureRef}
            className="relative bridge-sculpture"
            style={{ transformStyle: "preserve-3d", willChange: "transform" }}
          >
            {/* Orbit ring */}
            <div
              ref={ringRef}
              className="absolute left-1/2 top-1/2 bridge-orbit-ring"
              style={{
                marginLeft: -140,
                marginTop: -140,
                transform: `rotateX(68deg) scale(${0.85 + progress * 0.35})`,
                opacity: 0.25 + progress * 0.55,
              }}
              aria-hidden
            />

            {/* Core octahedron */}
            <div
              ref={coreRef}
              className="absolute left-1/2 top-1/2 bridge-core"
              style={{
                marginLeft: -48,
                marginTop: -48,
                transform: `scale(${0.7 + progress * 0.5})`,
                opacity: 0.5 + progress * 0.5,
              }}
              aria-hidden
            >
              <div className="bridge-core-face bridge-core-face-a" />
              <div className="bridge-core-face bridge-core-face-b" />
            </div>

            {/* Orbiting shards */}
            {Array.from({ length: SHARD_COUNT }).map((_, i) => {
              const t = shardTransform(i, progress);
              const color = SHARD_COLORS[i % SHARD_COLORS.length];
              return (
                <div
                  key={i}
                  className="absolute left-1/2 top-1/2 bridge-shard"
                  style={{
                    marginLeft: -28,
                    marginTop: -20,
                    transform: `translate3d(${t.x}px, ${t.y}px, ${t.z}px) rotateX(${t.rotX}deg) rotateY(${t.rotY}deg) scale(${t.scale})`,
                    transformStyle: "preserve-3d",
                    zIndex: Math.round(50 + t.z),
                  }}
                >
                  <div
                    className="bridge-shard-face bridge-shard-front"
                    style={{
                      borderColor: `${color}44`,
                      boxShadow: `0 0 20px ${color}22`,
                    }}
                  />
                  <div
                    className="bridge-shard-face bridge-shard-top"
                    style={{ background: `${color}33` }}
                  />
                  <div
                    className="bridge-shard-face bridge-shard-side"
                    style={{ background: `${color}18` }}
                  />
                </div>
              );
            })}

            {/* Vertical spine preview */}
            <div
              className="absolute left-1/2 top-1/2 w-px bridge-spine"
              style={{
                height: 280 * progress,
                marginLeft: -0.5,
                marginTop: -140 * progress,
                opacity: progress * 0.7,
                transform: `translateZ(${40 * progress}px)`,
              }}
              aria-hidden
            />
          </div>
        </div>

        {/* Progress rail */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3 pointer-events-none">
          <div className="w-48 h-px bg-white/10 relative overflow-hidden rounded-full">
            <div
              className="absolute left-0 top-0 h-full bg-emerald-400/70 rounded-full transition-none"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
          <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">
            Scroll to enter case study
          </span>
        </div>
      </div>
    </section>
  );
}
