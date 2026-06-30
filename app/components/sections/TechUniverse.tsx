"use client";

import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface TechCluster {
  id: string;
  name: string;
  color: string;
  nodes: string[];
}

const clusters: TechCluster[] = [
  { id: "frontend", name: "Frontend", color: "#61dafb", nodes: ["React", "Next.js", "TypeScript", "JavaScript", "Tailwind CSS", "Framer Motion", "GSAP", "HTML", "CSS"] },
  { id: "backend", name: "Backend", color: "#3d85c6", nodes: ["Node.js", "Express", "FastAPI", "Django", "Python", "REST APIs", "Auth", "WebSockets"] },
  { id: "databases", name: "Databases", color: "#8e7cc3", nodes: ["MongoDB", "MySQL", "PostgreSQL", "Firebase", "Redis", "Prisma"] },
  { id: "devops", name: "DevOps", color: "#6aa84f", nodes: ["Docker", "GitHub", "Git", "Linux", "Nginx", "Vercel", "Cloudflare", "CI/CD"] },
  { id: "ai", name: "AI / ML", color: "#e06666", nodes: ["OpenAI APIs", "LangChain", "RAG", "Prompt Eng", "Vector DBs", "AI Agents"] },
  { id: "design", name: "Design", color: "#f1c232", nodes: ["Figma", "Motion Design", "Design Systems", "Accessibility", "Typography", "UI Architecture"] },
];

interface ProjectOrb {
  id: string;
  name: string;
  stack: string[];
}

const projects: ProjectOrb[] = [
  { id: "hospital", name: "Hospital Platform", stack: ["React", "TypeScript", "Node.js", "MongoDB", "Auth", "Tailwind CSS", "Accessibility"] },
  { id: "travel", name: "Travel Platform", stack: ["Next.js", "React", "Tailwind CSS", "Framer Motion", "GSAP", "Vercel", "REST APIs"] },
  { id: "saas", name: "SaaS Dashboard", stack: ["React", "TypeScript", "Node.js", "PostgreSQL", "Docker", "Redis", "Cloudflare", "CI/CD"] },
  { id: "ai_prod", name: "AI Products", stack: ["Python", "FastAPI", "OpenAI APIs", "Vector DBs", "LangChain", "RAG", "AI Agents"] },
  { id: "doctor", name: "Doctor Portfolio", stack: ["Next.js", "React", "Tailwind CSS", "Framer Motion", "Accessibility", "Vercel"] },
  { id: "corporate", name: "Corporate Portal", stack: ["Next.js", "React", "TypeScript", "Nginx", "Linux", "UI Architecture", "Figma"] },
];

const dependencyMatrix: Record<string, string[]> = {
  React: ["JavaScript", "HTML", "CSS", "Figma", "UI Architecture"],
  "Next.js": ["React", "TypeScript", "Vercel", "REST APIs", "Auth"],
  TypeScript: ["JavaScript", "Next.js", "Node.js"],
  "Framer Motion": ["React", "JavaScript", "Motion Design"],
  GSAP: ["JavaScript", "HTML", "CSS", "Motion Design"],
  "Node.js": ["Express", "Auth", "REST APIs"],
  Express: ["Node.js", "MongoDB", "PostgreSQL", "Auth"],
  FastAPI: ["Python", "REST APIs", "OpenAI APIs", "Vector DBs"],
  Python: ["FastAPI", "Django", "LangChain"],
  MongoDB: ["Prisma", "Express", "REST APIs"],
  PostgreSQL: ["Prisma", "Express", "REST APIs"],
  Vercel: ["Next.js", "GitHub", "Cloudflare"],
  Docker: ["Linux", "CI/CD", "Nginx"],
  "OpenAI APIs": ["FastAPI", "Python", "RAG", "AI Agents"],
  LangChain: ["Python", "OpenAI APIs", "Vector DBs", "AI Agents"],
  "Vector DBs": ["FastAPI", "OpenAI APIs", "RAG"],
  Figma: ["UI Architecture", "Design Systems", "Motion Design"],
  "Design Systems": ["Figma", "Typography", "Accessibility"],
  Accessibility: ["HTML", "CSS", "UI Architecture"],
  "UI Architecture": ["React", "Next.js", "Design Systems"],
};

/** Hand-tuned anchors — no overlap */
const CLUSTER_ANCHORS: Record<string, { x: number; y: number; face: number }> = {
  frontend: { x: 50, y: 13, face: 0 },
  design: { x: 14, y: 28, face: 28 },
  backend: { x: 86, y: 28, face: -28 },
  ai: { x: 14, y: 72, face: 28 },
  databases: { x: 86, y: 72, face: -28 },
  devops: { x: 50, y: 87, face: 0 },
};

const PROJECT_ANCHORS: Record<string, { x: number; y: number }> = {
  hospital: { x: 32, y: 5 },
  travel: { x: 68, y: 5 },
  corporate: { x: 4, y: 50 },
  saas: { x: 96, y: 50 },
  doctor: { x: 32, y: 95 },
  ai_prod: { x: 68, y: 95 },
};

function findClusterForNode(node: string) {
  return clusters.find((c) => c.nodes.includes(node));
}

export default function TechUniverse() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const outroRef = useRef<HTMLDivElement>(null);

  const fragmentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const projectFragmentRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const [focusedCluster, setFocusedCluster] = useState<string | null>(null);
  const [lockedCluster, setLockedCluster] = useState<string | null>(null);
  const [isFragmented, setIsFragmented] = useState(false);
  const [pulseActive, setPulseActive] = useState(false);
  const [isHoveringStage, setIsHoveringStage] = useState(false);
  const [mobileIndex, setMobileIndex] = useState(0);

  const autoRotateRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0 });

  const clusterLayouts = useMemo(
    () =>
      clusters.map((cl) => ({
        ...cl,
        ...CLUSTER_ANCHORS[cl.id],
      })),
    []
  );

  const projectLayouts = useMemo(
    () =>
      projects.map((p) => ({
        ...p,
        ...PROJECT_ANCHORS[p.id],
      })),
    []
  );

  const expandedCluster = lockedCluster || focusedCluster;

  // Auto-rotate orbit when idle
  useEffect(() => {
    if (window.innerWidth < 768) return;

    let raf = 0;
    const tick = () => {
      if (orbitRef.current && !isHoveringStage && !isFragmented && !expandedCluster) {
        autoRotateRef.current += 0.06;
        gsap.set(orbitRef.current, { rotateY: autoRotateRef.current });
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isHoveringStage, isFragmented, expandedCluster]);

  useEffect(() => {
    const container = containerRef.current;
    const sticky = stickyRef.current;
    const orbit = orbitRef.current;
    const intro = introRef.current;
    const outro = outroRef.current;

    if (!container || !sticky || !orbit || !intro || !outro || window.innerWidth < 768) return;

    gsap.set(outro, { opacity: 0, scale: 0.92, pointerEvents: "none" });
    gsap.set(fragmentRefs.current, { transformPerspective: 1200 });

    const tween = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: () => `+=${window.innerHeight * 3}`,
        pin: sticky,
        scrub: 1.2,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    tween.fromTo(intro, { opacity: 0, y: -12 }, { opacity: 1, y: 0, duration: 0.2 });
    tween.fromTo(
      fragmentRefs.current,
      { opacity: 0, z: -100, scale: 0.5 },
      { opacity: 1, z: 0, scale: 1, duration: 0.35, stagger: 0.07, ease: "power3.out" },
      0.05
    );
    tween.fromTo(
      projectFragmentRefs.current,
      { opacity: 0, scale: 0.3 },
      { opacity: 1, scale: 1, duration: 0.3, stagger: 0.05, ease: "back.out(1.5)" },
      0.12
    );
    tween.to({}, { duration: 0.55 });

    tween.to(fragmentRefs.current, {
      x: () => gsap.utils.random(-50, 50),
      y: () => gsap.utils.random(-35, 35),
      z: () => gsap.utils.random(-60, 60),
      rotationX: () => gsap.utils.random(-20, 20),
      rotationZ: () => gsap.utils.random(-15, 15),
      duration: 0.35,
      ease: "power2.inOut",
      onStart: () => setIsFragmented(true),
    });
    tween.to(
      projectFragmentRefs.current,
      { x: () => gsap.utils.random(-30, 30), y: () => gsap.utils.random(-25, 25), duration: 0.35 },
      "<"
    );
    tween.to({}, {
      duration: 0.4,
      onStart: () => {
        setPulseActive(true);
        setTimeout(() => setPulseActive(false), 600);
      },
    });
    tween.to([...fragmentRefs.current, ...projectFragmentRefs.current], {
      x: 0,
      y: 0,
      z: 0,
      rotationX: 0,
      rotationZ: 0,
      duration: 0.55,
      ease: "elastic.out(1, 0.55)",
      onStart: () => setIsFragmented(false),
    });
    tween.to({}, { duration: 0.5 });
    tween.to([tiltRef.current, intro], { opacity: 0, scale: 0.88, duration: 0.3 });
    tween.to(outro, { opacity: 1, scale: 1, pointerEvents: "auto", duration: 0.35 }, "-=0.15");
    tween.to({}, { duration: 0.4 });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  const handleStageMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (window.innerWidth < 768 || isFragmented || !orbitRef.current) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouseRef.current = { x, y };

      autoRotateRef.current = x * 18;
      gsap.to(orbitRef.current, {
        rotateY: x * 18,
        rotateX: -y * 12,
        duration: 0.6,
        ease: "power2.out",
      });
    },
    [isFragmented]
  );

  const getNodeState = (label: string): "active" | "dimmed" | "normal" => {
    if (activeNode) {
      if (activeNode === label) return "active";
      return (dependencyMatrix[activeNode] || []).includes(label) ? "active" : "dimmed";
    }
    if (activeProject) {
      const proj = projects.find((p) => p.id === activeProject);
      return proj?.stack.includes(label) ? "active" : "dimmed";
    }
    return "normal";
  };

  const dependencyLinks = useMemo(() => {
    if (!activeNode || isFragmented) return [];
    const deps = dependencyMatrix[activeNode] || [];
    const source = findClusterForNode(activeNode);
    if (!source) return [];
    const sourceAnchor = CLUSTER_ANCHORS[source.id];
    return deps
      .map((dep) => {
        const target = findClusterForNode(dep);
        if (!target) return null;
        const targetAnchor = CLUSTER_ANCHORS[target.id];
        return {
          key: `${activeNode}-${dep}`,
          x1: sourceAnchor.x,
          y1: sourceAnchor.y,
          x2: targetAnchor.x,
          y2: targetAnchor.y,
        };
      })
      .filter(Boolean) as { key: string; x1: number; y1: number; x2: number; y2: number }[];
  }, [activeNode, isFragmented]);

  const handleClusterClick = (id: string) => {
    setLockedCluster((prev) => (prev === id ? null : id));
    setFocusedCluster(id);
  };

  return (
    <div className="relative w-full">
      <section
        ref={containerRef}
        className="hidden md:block relative w-full bg-transparent text-white select-none overflow-hidden"
      >
        <div ref={stickyRef} className="relative w-full h-screen flex flex-col overflow-hidden">
          <div ref={introRef} className="relative z-30 shrink-0 pt-8 px-10 text-center pointer-events-none">
            <span className="glass-panel inline-block px-3.5 py-1.5 rounded-full text-[10px] font-mono tracking-widest text-zinc-400 uppercase mb-2">
              ✦ Engineering Stack
            </span>
            <h2 className="font-display font-extrabold text-[1.5rem] lg:text-[1.85rem] leading-none tracking-tight uppercase text-white">
              Every Great Product Is An Ecosystem
            </h2>
            <p className="text-[10px] text-zinc-500 mt-2 font-mono">
              Hover satellites to expand · Click to lock · Trace tech dependencies
            </p>
          </div>

          <div
            className="relative flex-1 min-h-0 mx-6 lg:mx-10 mb-2 pointer-events-auto"
            onMouseMove={handleStageMouseMove}
            onMouseEnter={() => setIsHoveringStage(true)}
            onMouseLeave={() => {
              setIsHoveringStage(false);
              if (orbitRef.current) {
                gsap.to(orbitRef.current, { rotateX: 0, duration: 1, ease: "power2.out" });
              }
            }}
            style={{ perspective: "1400px", perspectiveOrigin: "50% 48%" }}
          >
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none z-[1]"
              viewBox="0 0 100 100"
              preserveAspectRatio="xMidYMid meet"
            >
              {!isFragmented &&
                clusterLayouts.map((cl) => {
                  const hot =
                    expandedCluster === cl.id ||
                    (activeProject && projects.find((p) => p.id === activeProject)?.stack.some((t) => cl.nodes.includes(t)));
                  return (
                    <line
                      key={`spoke-${cl.id}`}
                      x1="50"
                      y1="50"
                      x2={cl.x}
                      y2={cl.y}
                      stroke={hot ? "rgba(0, 255, 170, 0.35)" : "rgba(0, 255, 170, 0.1)"}
                      strokeWidth={hot ? 0.25 : 0.12}
                      className={hot ? "tech-line-pulse" : undefined}
                    />
                  );
                })}

              {!isFragmented &&
                dependencyLinks.map((link) => (
                  <line
                    key={link.key}
                    x1={link.x1}
                    y1={link.y1}
                    x2={link.x2}
                    y2={link.y2}
                    stroke="rgba(255, 255, 255, 0.45)"
                    strokeWidth="0.22"
                    strokeDasharray="1.2 0.6"
                    className="tech-line-pulse"
                  />
                ))}

              {!isFragmented &&
                activeProject &&
                (() => {
                  const proj = projectLayouts.find((p) => p.id === activeProject);
                  const stack = projects.find((p) => p.id === activeProject)?.stack || [];
                  if (!proj) return null;
                  const touched = new Set<string>();
                  return stack.map((tech) => {
                    const cl = clusterLayouts.find((c) => c.nodes.includes(tech));
                    if (!cl || touched.has(cl.id)) return null;
                    touched.add(cl.id);
                    return (
                      <line
                        key={`proj-${tech}`}
                        x1={proj.x}
                        y1={proj.y}
                        x2={cl.x}
                        y2={cl.y}
                        stroke="rgba(0, 255, 170, 0.5)"
                        strokeWidth="0.2"
                        strokeDasharray="1 0.8"
                        className="tech-line-pulse"
                      />
                    );
                  });
                })()}
            </svg>

            {/* Core */}
            <div
              className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[3] pointer-events-none transition-transform duration-500 ${
                pulseActive || activeNode || activeProject ? "scale-110" : ""
              }`}
            >
              <div
                className="w-[72px] h-[72px] rounded-full flex items-center justify-center"
                style={{
                  background: "radial-gradient(circle, rgba(0,255,170,0.3) 0%, transparent 70%)",
                  boxShadow: activeNode || activeProject ? "0 0 40px rgba(0,255,170,0.35)" : "0 0 24px rgba(0,255,170,0.12)",
                  border: "1px solid rgba(0,255,170,0.35)",
                }}
              >
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_#00ffaa]" />
              </div>
              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[7px] font-mono uppercase tracking-[0.25em] text-emerald-400/90 whitespace-nowrap">
                Core Engine
              </span>
            </div>

            {pulseActive && (
              <div className="absolute left-1/2 top-[56%] -translate-x-1/2 z-[5] glass-panel px-4 py-2 rounded-lg border border-emerald-500/25 pointer-events-none">
                <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-widest">
                  Recalibrating Architecture
                </span>
              </div>
            )}

            {/* Active node HUD */}
            {activeNode && !isFragmented && (
              <div className="absolute top-2 left-1/2 -translate-x-1/2 z-[5] glass-panel px-4 py-2 rounded-full border border-emerald-500/20 pointer-events-none">
                <span className="text-[10px] font-mono text-emerald-400">
                  {activeNode}
                </span>
                <span className="text-[9px] font-mono text-zinc-500 ml-2">
                  → {(dependencyMatrix[activeNode] || []).length} links
                </span>
              </div>
            )}

            {/* 3D layers: tilt (static) → parallax (mouse) → satellites */}
            <div
              ref={tiltRef}
              className="absolute inset-0"
              style={{ transformStyle: "preserve-3d", transform: "rotateX(14deg)" }}
            >
              <div
                ref={orbitRef}
                className="absolute inset-0"
                style={{ transformStyle: "preserve-3d" }}
              >
                {clusterLayouts.map((cl, idx) => {
                  const isExpanded = expandedCluster === cl.id;
                  const isDimmed = expandedCluster && expandedCluster !== cl.id;

                  return (
                    <div
                      key={cl.id}
                      className="absolute"
                      style={{
                        left: `${cl.x}%`,
                        top: `${cl.y}%`,
                        zIndex: isExpanded ? 40 : Math.round(30 - cl.y * 0.2),
                      }}
                    >
                      <div
                        ref={(el) => {
                          fragmentRefs.current[idx] = el;
                        }}
                        style={{ transformStyle: "preserve-3d" }}
                      >
                        <div
                          className="relative -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ease-out pointer-events-auto"
                          style={{
                            transform: `rotateY(${cl.face}deg) translateZ(${isExpanded ? 80 : 20}px) scale(${isDimmed ? 0.72 : isExpanded ? 1.08 : 1})`,
                            transformStyle: "preserve-3d",
                            opacity: isDimmed ? 0.4 : 1,
                            filter: isDimmed ? "blur(0.5px)" : "none",
                          }}
                          onMouseEnter={() => !isFragmented && setFocusedCluster(cl.id)}
                          onMouseLeave={() => {
                            if (!lockedCluster) setFocusedCluster(null);
                          }}
                          onClick={() => handleClusterClick(cl.id)}
                        >
                          {/* Compact crystal (default) */}
                          <div
                            className={`flex flex-col items-center justify-center rounded-2xl border backdrop-blur-md transition-all duration-500 cursor-pointer ${
                              isExpanded
                                ? "opacity-0 scale-75 absolute inset-0 pointer-events-none"
                                : "opacity-100 w-[76px] h-[76px]"
                            }`}
                            style={{
                              borderColor: `${cl.color}44`,
                              background: `radial-gradient(circle at 30% 30%, ${cl.color}18, rgba(0,0,0,0.75))`,
                              boxShadow: `0 0 20px ${cl.color}22`,
                            }}
                          >
                            <span
                              className="text-[8px] font-mono font-bold uppercase tracking-wider text-center leading-tight px-1"
                              style={{ color: cl.color }}
                            >
                              {cl.name}
                            </span>
                            <span className="text-[7px] font-mono text-zinc-500 mt-1">{cl.nodes.length} tools</span>
                          </div>

                          {/* Expanded panel */}
                          <div
                            className={`glass-panel rounded-xl border transition-all duration-500 origin-center ${
                              isExpanded
                                ? "w-[176px] opacity-100 scale-100 p-3 border-emerald-400/35 shadow-[0_0_32px_rgba(0,255,170,0.1)]"
                                : "w-[76px] h-0 opacity-0 scale-90 overflow-hidden p-0 border-transparent pointer-events-none"
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/5">
                              <span className="w-1.5 h-1.5 rounded-full" style={{ background: cl.color }} />
                              <span className="text-[9px] font-mono font-bold uppercase tracking-wider" style={{ color: cl.color }}>
                                {cl.name}
                              </span>
                              {lockedCluster === cl.id && (
                                <span className="ml-auto text-[7px] font-mono text-emerald-400">LOCKED</span>
                              )}
                            </div>
                            <div className="grid grid-cols-2 gap-1">
                              {cl.nodes.map((node) => {
                                const state = getNodeState(node);
                                return (
                                  <button
                                    key={node}
                                    type="button"
                                    onMouseEnter={(e) => {
                                      e.stopPropagation();
                                      setActiveNode(node);
                                    }}
                                    onMouseLeave={() => setActiveNode(null)}
                                    onClick={(e) => e.stopPropagation()}
                                    className={`text-[8px] font-mono px-1.5 py-1 rounded border text-left transition-all duration-200 cursor-pointer ${
                                      state === "active"
                                        ? "border-emerald-400/60 bg-emerald-950/50 text-white scale-105"
                                        : state === "dimmed"
                                        ? "border-transparent text-zinc-600 opacity-25"
                                        : "border-white/8 text-zinc-400 hover:border-white/20 hover:text-white"
                                    }`}
                                  >
                                    {node}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {projectLayouts.map((proj, idx) => {
                  const isActive = activeProject === proj.id;
                  return (
                    <div
                      key={proj.id}
                      className="absolute pointer-events-none"
                      style={{ left: `${proj.x}%`, top: `${proj.y}%`, zIndex: isActive ? 35 : 10 }}
                    >
                      <div
                        ref={(el) => {
                          projectFragmentRefs.current[idx] = el;
                        }}
                        className="-translate-x-1/2 -translate-y-1/2"
                        style={{ transformStyle: "preserve-3d", transform: "translateZ(40px)" }}
                      >
                        <button
                          type="button"
                          disabled={isFragmented}
                          onMouseEnter={() => setActiveProject(proj.id)}
                          onMouseLeave={() => setActiveProject(null)}
                          onClick={() => setActiveProject((p) => (p === proj.id ? null : proj.id))}
                          className={`pointer-events-auto w-[64px] h-[64px] rounded-full flex flex-col items-center justify-center border transition-all duration-400 cursor-pointer ${
                            isActive
                              ? "border-emerald-400 bg-emerald-950/40 shadow-[0_0_28px_rgba(0,255,170,0.3)] scale-110"
                              : "border-white/12 bg-zinc-950/70 backdrop-blur hover:border-emerald-400/40 hover:scale-105"
                          }`}
                        >
                          <span className="text-[6px] font-mono uppercase tracking-widest text-zinc-500">Project</span>
                          <span className="text-[7px] font-medium text-white text-center leading-tight px-1 mt-0.5">
                            {proj.name}
                          </span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="shrink-0 px-10 pb-5 flex justify-between text-zinc-600 text-[10px] font-mono z-30">
            <span>
              {lockedCluster ? "Click satellite again to unlock" : "Move mouse to orbit · Click satellite to lock open"}
            </span>
            <span>✦ Kamlesh Mundel</span>
          </div>

          <div
            ref={outroRef}
            className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none bg-black/50 backdrop-blur-sm"
          >
            <div className="text-center max-w-xl px-8">
              <span className="glass-panel inline-block px-3.5 py-1.5 rounded-full text-[10px] font-mono tracking-widest text-emerald-400 uppercase mb-5">
                ✦ Architecture In Action
              </span>
              <h3 className="font-display font-extrabold text-[2.2rem] lg:text-[3rem] leading-[1.05] uppercase text-white mb-4">
                Engineered Solutions
                <br />
                For Real Challenges
              </h3>
              <p className="text-sm text-zinc-400">Scroll down to explore selected platforms.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile unchanged */}
      <section className="block md:hidden relative w-full bg-black py-16 px-6 overflow-hidden">
        <div className="flex flex-col gap-3 mb-8">
          <span className="glass-panel w-fit px-3.5 py-1.5 rounded-full text-[9px] font-mono tracking-widest text-zinc-400 uppercase">
            ✦ Engineering stack
          </span>
          <h2 className="font-display font-extrabold text-[2rem] leading-[1.1] tracking-tight uppercase text-white">
            Architecture Ecosystem
          </h2>
        </div>
        <div
          onScroll={(e) => setMobileIndex(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}
          className="flex w-full overflow-x-auto snap-x snap-mandatory no-scrollbar gap-4"
        >
          {clusters.map((cl, idx) => (
            <div key={cl.id} className="w-full flex-shrink-0 snap-start glass-panel rounded-xl p-5 border border-white/5">
              <span className="text-[9px] font-mono font-bold tracking-wider px-2 py-0.5 border border-white/5 rounded-full" style={{ color: cl.color }}>
                {cl.name}
              </span>
              <div className="flex flex-wrap gap-2 mt-4">
                {cl.nodes.map((n) => (
                  <span key={n} className="glass-panel px-2.5 py-1 rounded text-[10px] font-mono text-zinc-300 border border-white/5">
                    {n}
                  </span>
                ))}
              </div>
              <div className="mt-6 pt-3 border-t border-white/5 text-[9px] font-mono text-zinc-500">
                {idx + 1} / {clusters.length}
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-1.5 mt-6">
          {clusters.map((_, idx) => (
            <div
              key={idx}
              className="h-[3px] rounded-full transition-all duration-300"
              style={{
                width: idx === mobileIndex ? 16 : 6,
                backgroundColor: idx === mobileIndex ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.15)",
              }}
            />
          ))}
        </div>
      </section>

      <style jsx global>{`
        @keyframes tech-line-dash {
          to {
            stroke-dashoffset: -8;
          }
        }
        .tech-line-pulse {
          animation: tech-line-dash 0.8s linear infinite;
        }
      `}</style>
    </div>
  );
}
