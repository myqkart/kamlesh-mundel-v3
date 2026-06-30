"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  accent: boolean;
}

interface CreativeLabBackgroundProps {
  focusX?: number;
  focusY?: number;
  accent?: string;
}

export default function CreativeLabBackground({
  focusX = 50,
  focusY = 50,
  accent = "#00ffaa",
}: CreativeLabBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (glowRef.current) {
      glowRef.current.style.setProperty("--lab-x", `${focusX}%`);
      glowRef.current.style.setProperty("--lab-y", `${focusY}%`);
      glowRef.current.style.setProperty("--lab-accent", accent);
    }
  }, [focusX, focusY, accent]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isMobile = window.innerWidth < 768;
    const COUNT = isMobile ? 40 : 110;

    let animId = 0;
    let width = 0;
    let height = 0;
    let inView = false;
    const mouse = { x: 0, y: 0, active: false };
    const smoothMouse = { x: 0, y: 0 };
    const particles: Particle[] = [];

    const init = () => {
      particles.length = 0;
      for (let i = 0; i < COUNT; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          size: Math.random() * 1.2 + 0.3,
          accent: Math.random() > 0.5,
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
      if (!particles.length) init();
    };

    const onMove = (e: MouseEvent) => {
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
    };

    const observer = new IntersectionObserver(([e]) => {
      inView = e.isIntersecting;
    }, { threshold: 0.05 });
    observer.observe(container);

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove);

    const draw = (time: number) => {
      animId = requestAnimationFrame(draw);
      if (!inView) return;

      const fx = (focusX / 100) * width;
      const fy = (focusY / 100) * height;

      smoothMouse.x += ((mouse.active ? mouse.x : fx) - smoothMouse.x) * 0.06;
      smoothMouse.y += ((mouse.active ? mouse.y : fy) - smoothMouse.y) * 0.06;

      ctx.clearRect(0, 0, width, height);

      // Vortex toward focus point
      for (const p of particles) {
        const dx = smoothMouse.x - p.x;
        const dy = smoothMouse.y - p.y;
        const dist = Math.hypot(dx, dy);
        const angle = Math.atan2(dy, dx) + Math.PI / 2;
        p.vx += Math.cos(angle) * 0.006 + dx * 0.00002;
        p.vy += Math.sin(angle) * 0.006 + dy * 0.00002;

        if (mouse.active && dist < 160 && dist > 1) {
          const pull = (1 - dist / 160) * 0.02;
          p.vx += (dx / dist) * pull;
          p.vy += (dy / dist) * pull;
        }

        p.vx *= 0.97;
        p.vy *= 0.97;
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dist = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
          if (dist < 100) {
            ctx.strokeStyle = `rgba(0, 255, 170, ${(1 - dist / 100) * 0.08})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Focus ring
      const pulse = 0.6 + Math.sin(time * 0.003) * 0.2;
      ctx.strokeStyle = `rgba(0, 255, 170, ${0.12 * pulse})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(smoothMouse.x, smoothMouse.y, 40 * pulse, 0, Math.PI * 2);
      ctx.stroke();

      for (const p of particles) {
        const tw = 0.3 + Math.sin(time * 0.002 + p.x) * 0.15;
        ctx.fillStyle = p.accent ? `rgba(0, 255, 170, ${tw})` : `rgba(255,255,255,${tw * 0.5})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    animId = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      observer.disconnect();
    };
  }, [focusX, focusY]);

  return (
    <div ref={containerRef} className="absolute inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden>
      <div
        ref={glowRef}
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 50% 40% at var(--lab-x, 50%) var(--lab-y, 50%), color-mix(in srgb, var(--lab-accent, #00ffaa) 18%, transparent) 0%, transparent 70%),
            radial-gradient(ellipse 80% 60% at 50% 50%, rgba(0,255,170,0.03) 0%, transparent 60%)
          `,
          ["--lab-x" as string]: `${focusX}%`,
          ["--lab-y" as string]: `${focusY}%`,
          ["--lab-accent" as string]: accent,
        }}
      />
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `linear-gradient(rgba(0,255,170,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,170,0.05) 1px, transparent 1px)`,
          backgroundSize: "56px 56px",
          maskImage: `radial-gradient(ellipse 65% 55% at ${focusX}% ${focusY}%, black 15%, transparent 72%)`,
          WebkitMaskImage: `radial-gradient(ellipse 65% 55% at ${focusX}% ${focusY}%, black 15%, transparent 72%)`,
        }}
      />
    </div>
  );
}
