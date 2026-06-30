"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ─────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────
const navStars = [
  { label: "Home",         x: 0.50, y: 0.20, href: "#" },
  { label: "About",        x: 0.18, y: 0.38, href: "#about" },
  { label: "Projects",     x: 0.76, y: 0.32, href: "#projects" },
  { label: "Case Studies", x: 0.12, y: 0.66, href: "#casestudies" },
  { label: "Journey",      x: 0.62, y: 0.72, href: "#journey" },
  { label: "Creative Lab", x: 0.34, y: 0.82, href: "#lab" },
  { label: "Recognition",  x: 0.84, y: 0.58, href: "#recognition" },
  { label: "Contact",      x: 0.46, y: 0.52, href: "#contact" },
];

// Edges: which stars connect to which (index pairs)
const navEdges: [number, number][] = [
  [0, 1], [0, 2], [0, 7], [1, 3], [1, 5], [2, 6], [2, 7], [3, 5],
  [4, 5], [4, 6], [6, 7], [3, 4],
];

const philosophyThoughts = [
  "Curiosity scales.",
  "Performance is empathy.",
  "Every interaction tells a story.",
  "Simple is difficult.",
  "Design is invisible.",
  "Motion creates meaning.",
  "Code is just language.",
  "Great work speaks quietly.",
];

const socials = [
  { label: "GitHub",   icon: "⊕", accent: "#ffffff", href: "https://github.com" },
  { label: "LinkedIn", icon: "⬡", accent: "#0ea5e9", href: "https://linkedin.com" },
  { label: "Email",    icon: "✉", accent: "#00ffaa", href: "mailto:kamlesh@example.com" },
  { label: "Instagram",icon: "◎", accent: "#f472b6", href: "https://instagram.com" },
  { label: "X",        icon: "✕", accent: "#e4e4e7", href: "https://x.com" },
];

const statusItems = [
  "Award-Winning Websites",
  "Motion Systems",
  "AI Products",
  "Product Engineering",
];

// ─────────────────────────────────────────────
// ENERGY SCULPTURE CANVAS
// Rotating wireframe icosahedron with pulsing edges
// ─────────────────────────────────────────────
function EnergySculpture() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();

    const W = () => canvas.offsetWidth;
    const H = () => canvas.offsetHeight;

    // Icosahedron vertices (normalized)
    const phi = (1 + Math.sqrt(5)) / 2;
    const rawVerts: [number, number, number][] = [
      [-1, phi, 0], [1, phi, 0], [-1, -phi, 0], [1, -phi, 0],
      [0, -1, phi], [0, 1, phi], [0, -1, -phi], [0, 1, -phi],
      [phi, 0, -1], [phi, 0, 1], [-phi, 0, -1], [-phi, 0, 1],
    ];
    const verts = rawVerts.map(([x, y, z]) => {
      const len = Math.sqrt(x * x + y * y + z * z);
      return [x / len, y / len, z / len] as [number, number, number];
    });

    const icoFaces = [
      [0,11,5],[0,5,1],[0,1,7],[0,7,10],[0,10,11],
      [1,5,9],[5,11,4],[11,10,2],[10,7,6],[7,1,8],
      [3,9,4],[3,4,2],[3,2,6],[3,6,8],[3,8,9],
      [4,9,5],[2,4,11],[6,2,10],[8,6,7],[9,8,1],
    ];
    const edgeSet = new Set<string>();
    const edges: [number, number][] = [];
    for (const face of icoFaces) {
      for (let i = 0; i < 3; i++) {
        const a = face[i], b = face[(i + 1) % 3];
        const key = `${Math.min(a, b)}-${Math.max(a, b)}`;
        if (!edgeSet.has(key)) { edgeSet.add(key); edges.push([a, b]); }
      }
    }

    // Edge pulse state
    const edgePulses = edges.map(() => ({ t: Math.random(), speed: 0.003 + Math.random() * 0.004 }));

    let rotX = 0.3, rotY = 0;
    let raf = 0;
    const SCALE = Math.min(W(), H()) * 0.3;

    const rotateVert = (v: [number, number, number], rx: number, ry: number): [number, number, number] => {
      let [x, y, z] = v;
      // Rotate Y
      const cy = Math.cos(ry), sy = Math.sin(ry);
      [x, z] = [x * cy - z * sy, x * sy + z * cy];
      // Rotate X
      const cx = Math.cos(rx), sx = Math.sin(rx);
      [y, z] = [y * cx - z * sx, y * sx + z * cx];
      return [x, y, z];
    };

    const project = (v: [number, number, number]): [number, number] => {
      const fov = 4 / (4 + v[2]);
      return [W() / 2 + v[0] * fov * SCALE, H() / 2 - v[1] * fov * SCALE];
    };

    const draw = () => {
      ctx.clearRect(0, 0, W(), H());
      rotY += 0.006;
      rotX = 0.22 + Math.sin(rotY * 0.3) * 0.15;

      const projected = verts.map(v => {
        const rv = rotateVert(v, rotX, rotY);
        return { p: project(rv), z: rv[2] };
      });

      // Sort edges by avg Z (painter's algorithm)
      const sortedEdges = edges
        .map((e, i) => ({ e, i, z: (projected[e[0]].z + projected[e[1]].z) / 2 }))
        .sort((a, b) => a.z - b.z);

      for (const { e, i } of sortedEdges) {
        const p0 = projected[e[0]].p;
        const p1 = projected[e[1]].p;
        const pulse = edgePulses[i];
        pulse.t = (pulse.t + pulse.speed) % 1;

        const avgZ = (projected[e[0]].z + projected[e[1]].z) / 2;
        const brightness = 0.25 + (avgZ + 1) * 0.25;

        // Base edge
        ctx.beginPath();
        ctx.moveTo(p0[0], p0[1]);
        ctx.lineTo(p1[0], p1[1]);
        ctx.strokeStyle = `rgba(100, 220, 255, ${brightness * 0.35})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();

        // Pulse dot traveling along edge
        const px = p0[0] + (p1[0] - p0[0]) * pulse.t;
        const py = p0[1] + (p1[1] - p0[1]) * pulse.t;
        const grad = ctx.createRadialGradient(px, py, 0, px, py, 5);
        grad.addColorStop(0, `rgba(100, 255, 200, ${brightness * 0.9})`);
        grad.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(px, py, 5, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }

      // Vertices as glowing dots
      projected.forEach(({ p, z }) => {
        const brightness = 0.4 + (z + 1) * 0.3;
        const r = 2 + (z + 1) * 1.5;
        const g = ctx.createRadialGradient(p[0], p[1], 0, p[0], p[1], r * 3);
        g.addColorStop(0, `rgba(180, 255, 240, ${brightness})`);
        g.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(p[0], p[1], r * 3, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
      });

      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ opacity: 0.85, mixBlendMode: "screen" }}
    />
  );
}

// ─────────────────────────────────────────────
// CONSTELLATION NAV CANVAS
// ─────────────────────────────────────────────
function ConstellationNav() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1, y: -1 });

  const handleMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }, []);
  const handleLeave = useCallback(() => { mouseRef.current = { x: -1, y: -1 }; }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize);

    const W = () => canvas.offsetWidth;
    const H = () => canvas.offsetHeight;

    // Pulse state per edge
    const edgePulses = navEdges.map(() => ({
      t: Math.random(),
      speed: 0.004 + Math.random() * 0.004,
    }));

    let raf = 0;
    const draw = () => {
      ctx.clearRect(0, 0, W(), H());

      const stars = navStars.map(s => ({ ...s, px: s.x * W(), py: s.y * H() }));
      const mx = mouseRef.current.x, my = mouseRef.current.y;

      // Find hovered star
      let hoveredIdx = -1;
      let minDist = 40;
      stars.forEach((s, i) => {
        const d = Math.sqrt((s.px - mx) ** 2 + (s.py - my) ** 2);
        if (d < minDist) { minDist = d; hoveredIdx = i; }
      });

      // Draw edges
      navEdges.forEach(([a, b], i) => {
        const s0 = stars[a], s1 = stars[b];
        const lit = hoveredIdx === a || hoveredIdx === b;
        const pulse = edgePulses[i];
        pulse.t = (pulse.t + pulse.speed) % 1;

        ctx.beginPath();
        ctx.moveTo(s0.px, s0.py);
        ctx.lineTo(s1.px, s1.py);
        ctx.strokeStyle = lit ? "rgba(100, 220, 255, 0.4)" : "rgba(255, 255, 255, 0.07)";
        ctx.lineWidth = lit ? 1 : 0.5;
        ctx.stroke();

        if (lit) {
          const px = s0.px + (s1.px - s0.px) * pulse.t;
          const py = s0.py + (s1.py - s0.py) * pulse.t;
          ctx.beginPath();
          ctx.arc(px, py, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(100, 255, 200, 0.8)";
          ctx.fill();
        }
      });

      // Draw stars
      stars.forEach((s, i) => {
        const isHovered = i === hoveredIdx;
        const nearHovered = hoveredIdx !== -1 && navEdges.some(
          ([a, b]) => (a === i || b === i) && (a === hoveredIdx || b === hoveredIdx)
        );

        const r = isHovered ? 5 : nearHovered ? 3.5 : 2;
        const alpha = isHovered ? 1 : nearHovered ? 0.7 : 0.4;

        // Glow
        const glow = ctx.createRadialGradient(s.px, s.py, 0, s.px, s.py, r * 5);
        glow.addColorStop(0, `rgba(150, 220, 255, ${alpha * 0.6})`);
        glow.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(s.px, s.py, r * 5, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.arc(s.px, s.py, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 240, 255, ${alpha})`;
        ctx.fill();

        // Label
        if (isHovered || nearHovered) {
          ctx.font = `${isHovered ? "bold " : ""}9px monospace`;
          ctx.fillStyle = isHovered ? "rgba(100, 255, 200, 0.95)" : "rgba(180, 220, 255, 0.5)";
          ctx.textAlign = "center";
          ctx.fillText(s.label, s.px, s.py - r - 7);
        }
      });

      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full cursor-pointer"
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    />
  );
}

// ─────────────────────────────────────────────
// SOCIAL ORB
// ─────────────────────────────────────────────
function SocialOrb({ social }: { social: typeof socials[0] }) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLAnchorElement>(null);

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2);
    const y = (e.clientY - rect.top - rect.height / 2);
    gsap.to(ref.current, { x: x * 0.3, y: y * 0.3, duration: 0.3, ease: "power2.out" });
  }, []);

  const onMouseLeave = useCallback(() => {
    setHovered(false);
    gsap.to(ref.current, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1,0.4)" });
  }, []);

  return (
    <a
      ref={ref}
      href={social.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={social.label}
      className="relative flex flex-col items-center gap-2 cursor-pointer select-none group no-underline"
      onMouseEnter={() => setHovered(true)}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <div
        className="relative w-12 h-12 rounded-full flex items-center justify-center text-base transition-all duration-300"
        style={{
          background: hovered
            ? `radial-gradient(circle at 38% 38%, ${social.accent}22, rgba(0,0,0,0.5))`
            : "rgba(255,255,255,0.05)",
          border: `1px solid ${hovered ? social.accent + "60" : "rgba(255,255,255,0.08)"}`,
          boxShadow: hovered
            ? `0 0 24px ${social.accent}30, 0 0 8px ${social.accent}20, inset 0 1px 0 rgba(255,255,255,0.1)`
            : "0 4px 16px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
          backdropFilter: "blur(12px)",
          color: hovered ? social.accent : "rgba(255,255,255,0.4)",
          transform: hovered ? "scale(1.1)" : "scale(1)",
          animation: `footerOrbFloat ${4 + socials.indexOf(social)}s ease-in-out infinite alternate`,
        }}
      >
        {/* Glass highlight */}
        <div className="absolute top-[10%] left-[18%] w-[35%] h-[25%] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(255,255,255,0.25), transparent)" }} />
        <span className="relative z-10 text-sm">{social.icon}</span>

        {/* Particle burst on hover */}
        {hovered && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="absolute w-1 h-1 rounded-full"
                style={{
                  background: social.accent,
                  left: "50%", top: "50%",
                  animation: `orbParticle 0.6s ease-out ${i * 0.05}s both`,
                  transform: `rotate(${i * 60}deg) translateY(-20px)`,
                }}
              />
            ))}
          </div>
        )}
      </div>
      <span className="text-[8px] font-mono tracking-widest uppercase transition-colors duration-200"
        style={{ color: hovered ? social.accent : "rgba(255,255,255,0.25)" }}>
        {social.label}
      </span>
    </a>
  );
}

// ─────────────────────────────────────────────
// DIGITAL DESK (SVG floating workspace)
// ─────────────────────────────────────────────
function DigitalDesk({ mouseX, mouseY }: { mouseX: number; mouseY: number }) {
  const parallax = (depth: number) => ({
    transform: `translate(${(mouseX - 0.5) * depth * -12}px, ${(mouseY - 0.5) * depth * -10}px)`,
    transition: "transform 0.4s ease",
  });

  return (
    <div className="relative w-[340px] h-[220px] select-none pointer-events-none">
      {/* Monitor */}
      <div className="absolute" style={{ left: "30%", top: "5%", ...parallax(0.6) }}>
        <svg width="90" height="70" viewBox="0 0 90 70" fill="none">
          <rect x="5" y="2" width="80" height="52" rx="4" stroke="rgba(100,220,255,0.3)" strokeWidth="1" fill="rgba(10,20,30,0.4)" />
          <rect x="10" y="7" width="70" height="42" rx="2" fill="rgba(0,20,40,0.6)" />
          {/* Screen glow */}
          <rect x="10" y="7" width="70" height="42" rx="2" fill="none" stroke="rgba(0,200,255,0.1)" />
          {/* Code lines */}
          {[15, 22, 29, 36, 43].map((y, i) => (
            <rect key={i} x={14} y={y} width={30 + (i % 3) * 12} height="1.5" rx="1" fill={`rgba(100,255,200,${0.15 + (i % 2) * 0.1})`} />
          ))}
          {/* Cursor blink */}
          <rect x="14" y="43" width="5" height="1.5" rx="1" fill="rgba(100,255,200,0.7)" style={{ animation: "footerBlink 1s step-end infinite" }} />
          {/* Stand */}
          <rect x="40" y="54" width="10" height="8" rx="1" fill="rgba(100,220,255,0.15)" />
          <rect x="32" y="62" width="26" height="2" rx="1" fill="rgba(100,220,255,0.2)" />
        </svg>
      </div>

      {/* Mechanical keyboard */}
      <div className="absolute" style={{ left: "22%", top: "68%", ...parallax(0.4) }}>
        <svg width="110" height="36" viewBox="0 0 110 36" fill="none">
          <rect x="1" y="4" width="108" height="28" rx="4" fill="rgba(20,25,35,0.7)" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
          {[...Array(10)].map((_, c) => [...Array(3)].map((__, r) => (
            <rect key={`${c}-${r}`} x={6 + c * 10} y={8 + r * 8} width="7" height="5" rx="1.5"
              fill={`rgba(${c % 2 === 0 ? "80,160,255" : "100,200,180"},0.12)`}
              stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
          )))}
        </svg>
      </div>

      {/* Notebook */}
      <div className="absolute" style={{ left: "65%", top: "45%", ...parallax(0.8) }}>
        <svg width="55" height="70" viewBox="0 0 55 70" fill="none">
          <rect x="6" y="2" width="44" height="66" rx="3" fill="rgba(240,230,210,0.08)" stroke="rgba(255,230,180,0.2)" strokeWidth="1" />
          {/* Binding */}
          <rect x="6" y="2" width="5" height="66" rx="2" fill="rgba(200,160,80,0.15)" />
          {/* Lines */}
          {[18, 26, 34, 42, 50, 58].map((y, i) => (
            <rect key={i} x="14" y={y} width={20 + (i % 2) * 8} height="1" rx="1" fill="rgba(255,230,180,0.12)" />
          ))}
          {/* Sketch doodle */}
          <circle cx="30" cy="14" r="6" stroke="rgba(255,200,100,0.2)" strokeWidth="0.8" fill="none" />
          <path d="M25 14 L30 9 L35 14" stroke="rgba(255,200,100,0.15)" strokeWidth="0.8" fill="none" />
        </svg>
      </div>

      {/* Coffee mug */}
      <div className="absolute" style={{ left: "5%", top: "30%", ...parallax(1.0) }}>
        <svg width="38" height="44" viewBox="0 0 38 44" fill="none">
          <path d="M6 12 L32 12 L29 38 Q19 42 9 38 Z" fill="rgba(60,30,10,0.4)" stroke="rgba(255,160,60,0.2)" strokeWidth="1" />
          <ellipse cx="19" cy="12" rx="13" ry="4" fill="rgba(80,40,10,0.5)" stroke="rgba(255,160,60,0.15)" strokeWidth="1" />
          {/* Steam */}
          <path d="M14 8 Q16 4 14 1" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeLinecap="round" style={{ animation: "footerSteam 2s ease-in-out infinite" }} />
          <path d="M19 7 Q21 3 19 0" stroke="rgba(255,255,255,0.12)" strokeWidth="1" strokeLinecap="round" style={{ animation: "footerSteam 2s ease-in-out infinite 0.4s" }} />
          <path d="M24 8 Q26 4 24 1" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeLinecap="round" style={{ animation: "footerSteam 2s ease-in-out infinite 0.8s" }} />
          {/* Handle */}
          <path d="M32 16 Q42 18 40 28 Q38 36 32 34" stroke="rgba(255,160,60,0.2)" strokeWidth="1.5" fill="none" />
        </svg>
      </div>

      {/* Sketchbook */}
      <div className="absolute" style={{ left: "12%", top: "60%", ...parallax(0.5) }}>
        <svg width="48" height="34" viewBox="0 0 48 34" fill="none">
          <rect x="2" y="2" width="44" height="30" rx="2" fill="rgba(240,235,220,0.06)" stroke="rgba(255,230,180,0.12)" strokeWidth="1" />
          <circle cx="24" cy="17" r="8" stroke="rgba(100,200,255,0.15)" strokeWidth="0.8" fill="none" strokeDasharray="2 2" />
          <line x1="10" y1="8" x2="38" y2="8" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
        </svg>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// PHILOSOPHY ROTATOR
// ─────────────────────────────────────────────
function PhilosophyRotator() {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const cycle = () => {
      setVisible(false);
      setTimeout(() => {
        setIdx(i => (i + 1) % philosophyThoughts.length);
        setVisible(true);
      }, 800);
    };
    const interval = setInterval(cycle, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-6 flex items-center justify-center overflow-hidden">
      <p
        className="text-[11px] font-mono italic text-zinc-500 transition-all duration-700"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(8px)",
        }}
      >
        &ldquo;{philosophyThoughts[idx]}&rdquo;
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────
// CLOSING TERMINAL
// ─────────────────────────────────────────────
function ClosingTerminal() {
  const ref = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<"idle" | "particles" | "message" | "ready">("idle");
  const [typedText, setTypedText] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && phase === "idle") {
          setPhase("particles");
          setTimeout(() => setPhase("message"), 1500);
          setTimeout(() => setPhase("ready"), 3500);
        }
      },
      { threshold: 0.8 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [phase]);

  // Type "> Ready."
  useEffect(() => {
    if (phase !== "ready") return;
    const target = "> Ready.";
    let i = 0;
    const interval = setInterval(() => {
      if (i === 0) setTypedText(""); // reset on first tick
      i++;
      setTypedText(target.slice(0, i));
      if (i >= target.length) clearInterval(interval);
    }, 80);
    return () => clearInterval(interval);
  }, [phase]);

  // Blink cursor
  useEffect(() => {
    const interval = setInterval(() => setCursorVisible(v => !v), 530);
    return () => clearInterval(interval);
  }, []);

  return (
    <div ref={ref} className="flex flex-col items-center gap-8">
      {/* Particle escape visual */}
      {(phase === "particles" || phase === "message" || phase === "ready") && (
        <div className="relative w-32 h-32">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 rounded-full"
              style={{
                left: "50%", top: "50%",
                background: `hsl(${160 + i * 10}, 100%, 70%)`,
                animation: `footerParticleEscape 2s ease-out ${i * 0.08}s both`,
                transform: `rotate(${i * 18}deg) translateY(-${30 + (i % 5) * 15}px)`,
              }}
            />
          ))}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-cyan-400/40 animate-ping" style={{ animationDuration: "1.5s" }} />
          </div>
        </div>
      )}

      {/* Closing message */}
      {(phase === "message" || phase === "ready") && (
        <h2
          className="font-display font-black text-[2.5rem] md:text-[4rem] lg:text-[5rem] leading-[0.95] tracking-tighter uppercase text-center"
          style={{ animation: "footerFadeUp 1s ease both" }}
        >
          {["See You", "In The", "Next", "Project."].map((word, i) => (
            <span key={i} className="block overflow-hidden">
              <span className="block" style={{ color: i === 3 ? "#00ffaa" : "white" }}>{word}</span>
            </span>
          ))}
        </h2>
      )}

      {/* Terminal "> Ready." */}
      {phase === "ready" && (
        <div
          className="glass-panel px-6 py-3 rounded-xl border border-cyan-400/15 font-mono text-sm text-cyan-300"
          style={{ animation: "footerFadeUp 0.8s ease 0.5s both", minWidth: "160px" }}
        >
          <span>{typedText}</span>
          <span
            className="inline-block w-2 h-4 ml-0.5 align-middle bg-cyan-400"
            style={{ opacity: cursorVisible ? 1 : 0, transition: "opacity 0.1s" }}
          />
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN FOOTER COMPONENT
// ─────────────────────────────────────────────
export default function Footer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sculptureRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const constellationRef = useRef<HTMLDivElement>(null);
  const desksocialRef = useRef<HTMLDivElement>(null);
  const closingRef = useRef<HTMLDivElement>(null);
  const copyrightRef = useRef<HTMLDivElement>(null);

  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });
  const [statusIdx, setStatusIdx] = useState(0);
  const [localTime, setLocalTime] = useState("");

  // Mouse tracking for parallax desk
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMouse({ x: e.clientX / rect.width, y: e.clientY / rect.height });
  }, []);

  // Live clock
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setLocalTime(now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }));
    };
    tick();
    const interval = setInterval(tick, 60000);
    return () => clearInterval(interval);
  }, []);

  // Status cycle
  useEffect(() => {
    const interval = setInterval(() => setStatusIdx(i => (i + 1) % statusItems.length), 3000);
    return () => clearInterval(interval);
  }, []);

  // Entrance animations triggered by IntersectionObserver
  useEffect(() => {
    const targets = [sculptureRef, headingRef, constellationRef, desksocialRef, closingRef, copyrightRef];
    targets.forEach(ref => ref.current && gsap.set(ref.current, { opacity: 0, y: 30 }));

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            gsap.to(entry.target, { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" });
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    targets.forEach(ref => ref.current && obs.observe(ref.current));
    return () => obs.disconnect();
  }, []);

  return (
    <footer
      ref={containerRef}
      className="relative w-full min-h-[120vh] bg-black overflow-hidden text-white"
      aria-label="Footer — The Living Ending"
      onMouseMove={handleMouseMove}
    >
      {/* ── Starfield background ── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        {/* Aurora gradient (Unified emerald accents) */}
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at 50% 0%, rgba(0,255,170,0.04) 0%, transparent 70%)",
        }} />
        {/* Star particles via box-shadow trick */}
        <div className="footer-stars absolute inset-0" />
        {/* Noise overlay */}
        <div className="noise-overlay" />
      </div>

      {/* ════════════════════════════════════════
          DESKTOP LAYOUT
          ════════════════════════════════════════ */}
      <div className="hidden md:flex flex-col items-center gap-24 px-16 pt-24 pb-20 relative z-10">

        {/* ── Energy Sculpture ── */}
        <div ref={sculptureRef} className="flex flex-col items-center gap-6 opacity-0">
          <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase">
            ✦ Kamlesh Mundel · Digital Portfolio
          </span>
          <div className="w-[260px] h-[260px]">
            <EnergySculpture />
          </div>
          <PhilosophyRotator />
        </div>

        {/* ── Final Message ── */}
        <div ref={headingRef} className="text-center max-w-5xl opacity-0">
          <h2 className="font-display font-black text-[4rem] lg:text-[6rem] xl:text-[7rem] leading-[0.92] tracking-tighter uppercase mb-8">
            {["Every", "Great", "Experience", "Leaves", "A Memory."].map((word, i) => (
              <span key={i} className="block overflow-hidden">
                <span className="block" style={{ color: i === 4 ? "#00ffaa" : i === 3 ? "rgba(255,255,255,0.7)" : "white" }}>
                  {word}
                </span>
              </span>
            ))}
          </h2>
          <p className="text-sm text-zinc-400 font-light leading-relaxed mx-auto char-limit-desktop char-limit-tablet">
            Technology changes every year. Frameworks come and go. But a product that genuinely moves someone—that lingers. That&apos;s the only thing worth building.
          </p>
        </div>

        {/* ── Constellation Nav ── */}
        <div ref={constellationRef} className="flex flex-col items-center gap-4 w-full max-w-2xl opacity-0">
          <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase">
            ✦ Navigate · Hover to illuminate
          </span>
          <div className="w-full h-[220px] rounded-2xl overflow-hidden glass-panel border border-white/5">
            <ConstellationNav />
          </div>
        </div>

        {/* ── Desk + Socials row ── */}
        <div ref={desksocialRef} className="flex items-center justify-between w-full max-w-5xl opacity-0 gap-12">
          {/* Digital Desk */}
          <div className="flex flex-col gap-4">
            <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase">
              ✦ Where ideas begin
            </span>
            <DigitalDesk mouseX={mouse.x} mouseY={mouse.y} />
          </div>

          {/* Center: live status + philosophy */}
          <div className="flex flex-col items-center gap-6 flex-1">
            {/* Live status widget */}
            <div className="glass-panel rounded-2xl p-5 border border-white/5 w-full max-w-xs">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Currently Building</span>
              </div>
              <div className="h-6 overflow-hidden">
                <p
                  className="text-xs font-mono text-white transition-all duration-500"
                  key={statusIdx}
                  style={{ animation: "footerFadeUp 0.5s ease" }}
                >
                  {statusItems[statusIdx]}
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-[9px] font-mono text-zinc-600">Local time</span>
                <span className="text-[9px] font-mono text-zinc-400">{localTime} IST</span>
              </div>
            </div>
          </div>

          {/* Social orbs */}
          <div className="flex flex-col items-end gap-6">
            <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase">
              ✦ Find me
            </span>
            <div className="flex gap-5">
              {socials.map(s => <SocialOrb key={s.label} social={s} />)}
            </div>
          </div>
        </div>

        {/* ── Closing Terminal ── */}
        <div ref={closingRef} className="flex flex-col items-center gap-6 opacity-0 py-12">
          <ClosingTerminal />
        </div>

        {/* ── Copyright ── */}
        <div ref={copyrightRef} className="flex flex-col items-center gap-2 opacity-0 pb-4">
          <div className="w-16 h-px bg-white/5 mb-4" />
          <p className="text-[10px] font-mono text-zinc-600 tracking-widest">
            © Kamlesh Mundel
          </p>
          <p className="text-[9px] font-mono text-zinc-700 italic">
            Engineered with curiosity, crafted with intention.
          </p>
        </div>
      </div>

      {/* ════════════════════════════════════════
          MOBILE LAYOUT
          ════════════════════════════════════════ */}
      <div className="flex md:hidden flex-col items-center gap-16 px-5 pt-16 pb-12 relative z-10 text-center">
        {/* Sculpture */}
        <div className="flex flex-col items-center gap-4">
          <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase">✦ Kamlesh Mundel</span>
          <div className="w-[180px] h-[180px]">
            <EnergySculpture />
          </div>
          <PhilosophyRotator />
        </div>

        {/* Final message */}
        <div>
          <h2 className="font-display font-black text-[2.5rem] leading-[0.95] tracking-tighter uppercase mb-5">
            {["Every", "Great", "Experience", "Leaves", "A Memory."].map((w, i) => (
              <span key={i} className="block" style={{ color: i === 4 ? "#00ffaa" : i === 3 ? "rgba(255,255,255,0.7)" : "white" }}>{w}</span>
            ))}
          </h2>
          <p className="text-xs text-zinc-400 font-light leading-relaxed">
            Technology changes. But a product that moves someone—that lingers. That&apos;s the only thing worth building.
          </p>
        </div>

        {/* Social orbs */}
        <div className="flex flex-col items-center gap-4">
          <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase">✦ Find me</span>
          <div className="flex gap-4 flex-wrap justify-center">
            {socials.map(s => <SocialOrb key={s.label} social={s} />)}
          </div>
        </div>

        {/* Live status */}
        <div className="glass-panel rounded-2xl p-4 border border-white/5 w-full max-w-xs">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Currently Building</span>
          </div>
          <p className="text-xs font-mono text-white">{statusItems[statusIdx]}</p>
          <div className="mt-3 pt-3 border-t border-white/5 text-[9px] font-mono text-zinc-600 flex justify-between">
            <span>Local time</span>
            <span className="text-zinc-400">{localTime} IST</span>
          </div>
        </div>

        {/* Constellation nav on mobile (simplified) */}
        <div className="w-full">
          <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase block mb-3">✦ Navigate</span>
          <div className="w-full h-[180px] rounded-xl overflow-hidden glass-panel border border-white/5">
            <ConstellationNav />
          </div>
        </div>

        {/* Closing */}
        <ClosingTerminal />

        {/* Copyright */}
        <div className="flex flex-col items-center gap-1 mt-4">
          <div className="w-10 h-px bg-white/5 mb-3" />
          <p className="text-[10px] font-mono text-zinc-600">© Kamlesh Mundel</p>
          <p className="text-[9px] font-mono text-zinc-700 italic">Engineered with curiosity, crafted with intention.</p>
        </div>
      </div>
    </footer>
  );
}
