"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  accent: boolean;
}

export default function CreativeLabBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const glow = glowRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isMobile = window.innerWidth < 768;
    const PARTICLE_COUNT = isMobile ? 35 : 90;
    const CONNECTION_DIST = isMobile ? 90 : 130;
    const MOUSE_RADIUS = isMobile ? 120 : 200;

    let animId = 0;
    let width = 0;
    let height = 0;
    let inView = false;

    const mouse = { x: 0, y: 0, active: false };
    const smoothMouse = { x: 0, y: 0 };
    const particles: Particle[] = [];

    const initParticles = () => {
      particles.length = 0;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          size: Math.random() * 1.4 + 0.4,
          accent: Math.random() > 0.45,
        });
      }
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (particles.length === 0) initParticles();
    };

    const updateGlow = (x: number, y: number) => {
      if (!glow) return;
      const xPct = (x / Math.max(width, 1)) * 100;
      const yPct = (y / Math.max(height, 1)) * 100;
      glow.style.setProperty("--lab-x", `${xPct}%`);
      glow.style.setProperty("--lab-y", `${yPct}%`);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const inside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      if (!inside) {
        mouse.active = false;
        return;
      }

      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
      updateGlow(mouse.x, mouse.y);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);

    const draw = (time: number) => {
      animId = requestAnimationFrame(draw);
      if (!inView) return;

      smoothMouse.x += (mouse.x - smoothMouse.x) * 0.07;
      smoothMouse.y += (mouse.y - smoothMouse.y) * 0.07;

      if (!mouse.active) {
        smoothMouse.x += Math.sin(time * 0.0008) * 0.3;
        smoothMouse.y += Math.cos(time * 0.0006) * 0.3;
        updateGlow(smoothMouse.x, smoothMouse.y);
      }

      ctx.clearRect(0, 0, width, height);

      // Flow field — particles ride invisible curl noise
      for (const p of particles) {
        const angle =
          Math.sin(p.x * 0.008 + time * 0.0009) * Math.cos(p.y * 0.008 + time * 0.0007) *
          Math.PI *
          2;
        p.vx += Math.cos(angle) * 0.004;
        p.vy += Math.sin(angle) * 0.004;

        if (mouse.active) {
          const dx = smoothMouse.x - p.x;
          const dy = smoothMouse.y - p.y;
          const dist = Math.hypot(dx, dy);
          if (dist < MOUSE_RADIUS && dist > 1) {
            const pull = (1 - dist / MOUSE_RADIUS) * 0.035;
            p.vx += (dx / dist) * pull;
            p.vy += (dy / dist) * pull;
          }
        }

        p.vx *= 0.96;
        p.vy *= 0.96;
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;
      }

      // Particle-to-particle connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.hypot(dx, dy);
          if (dist < CONNECTION_DIST) {
            const alpha = (1 - dist / CONNECTION_DIST) * 0.12;
            ctx.strokeStyle = `rgba(0, 255, 170, ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Cursor neural links
      if (mouse.active) {
        for (const p of particles) {
          const dx = smoothMouse.x - p.x;
          const dy = smoothMouse.y - p.y;
          const dist = Math.hypot(dx, dy);
          if (dist < MOUSE_RADIUS * 0.75) {
            const alpha = (1 - dist / (MOUSE_RADIUS * 0.75)) * 0.3;
            ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(smoothMouse.x, smoothMouse.y);
            ctx.stroke();
          }
        }

        // Cursor pulse ring
        const pulse = 0.5 + Math.sin(time * 0.004) * 0.15;
        ctx.strokeStyle = `rgba(0, 255, 170, ${0.15 * pulse})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(smoothMouse.x, smoothMouse.y, 28 * pulse, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw nodes
      for (const p of particles) {
        const twinkle = 0.35 + Math.sin(time * 0.003 + p.x * 0.05) * 0.2;
        ctx.fillStyle = p.accent
          ? `rgba(0, 255, 170, ${twinkle})`
          : `rgba(255, 255, 255, ${twinkle * 0.55})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-0 overflow-hidden pointer-events-none"
      aria-hidden
    >
      <div
        ref={glowRef}
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          background: `
            radial-gradient(ellipse 45% 35% at var(--lab-x, 50%) var(--lab-y, 50%), rgba(0, 255, 170, 0.09) 0%, transparent 70%),
            radial-gradient(ellipse 30% 25% at calc(var(--lab-x, 50%) + 12%) calc(var(--lab-y, 50%) - 8%), rgba(255, 255, 255, 0.04) 0%, transparent 65%)
          `,
          ["--lab-x" as string]: "50%",
          ["--lab-y" as string]: "50%",
        }}
      />
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 170, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 170, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
          maskImage:
            "radial-gradient(ellipse 70% 60% at var(--lab-x, 50%) var(--lab-y, 50%), black 20%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 60% at var(--lab-x, 50%) var(--lab-y, 50%), black 20%, transparent 75%)",
        }}
      />
    </div>
  );
}
