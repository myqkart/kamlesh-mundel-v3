"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

interface CreativePlaygroundProps {
  experimentId: string;
  onClose: () => void;
}

export default function CreativePlayground({ experimentId, onClose }: CreativePlaygroundProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [params, setParams] = useState({
    speed: 1.0,
    density: 50,
    intensity: 0.8,
  });

  // Entrance reveal
  useEffect(() => {
    if (modalRef.current) {
      gsap.fromTo(
        modalRef.current,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.4, ease: "power3.out" }
      );
    }
  }, []);

  // Close animation helper
  const handleClose = () => {
    if (modalRef.current) {
      gsap.to(modalRef.current, {
        opacity: 0,
        scale: 0.95,
        duration: 0.3,
        ease: "power2.in",
        onComplete: onClose,
      });
    } else {
      onClose();
    }
  };

  // Run Canvas Simulation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.clientWidth);
    let height = (canvas.height = canvas.clientHeight);

    // Mouse tracking inside the canvas
    const mouse = { x: width / 2, y: height / 2, px: width / 2, py: height / 2 };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.px = mouse.x;
      mouse.py = mouse.y;
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    canvas.addEventListener("mousemove", handleMouseMove);

    const handleResize = () => {
      width = canvas.width = canvas.clientWidth;
      height = canvas.height = canvas.clientHeight;
    };
    window.addEventListener("resize", handleResize);

    // ─────────────────────────────────────────────
    // EXPERIMENT 1: Fluid Shader Trail
    // ─────────────────────────────────────────────
    interface FluidParticle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      age: number;
      maxAge: number;
      color: string;
    }
    const fluidParticles: FluidParticle[] = [];

    // ─────────────────────────────────────────────
    // EXPERIMENT 2: Audio Points
    // ─────────────────────────────────────────────
    const audioBarCount = 40;
    const audioBars = Array.from({ length: audioBarCount }, (_, i) => ({
      x: (width / audioBarCount) * i + (width / audioBarCount) / 2,
      targetHeight: 20,
      currentHeight: 20,
    }));

    // ─────────────────────────────────────────────
    // EXPERIMENT 4: GPU Particles Simulation
    // ─────────────────────────────────────────────
    interface GpuParticle {
      x: number;
      y: number;
      angle: number;
      speed: number;
      size: number;
    }
    const gpuParticles: GpuParticle[] = Array.from({ length: 150 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      angle: Math.random() * Math.PI * 2,
      speed: 0.5 + Math.random() * 1.5,
      size: 1 + Math.random() * 2,
    }));

    let frame = 0;

    // Simulation Loop
    const draw = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      if (experimentId === "fluid") {
        // Fluid trails
        ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
        ctx.fillRect(0, 0, width, height);

        // Spawn trails based on mouse velocity
        const dx = mouse.x - mouse.px;
        const dy = mouse.y - mouse.py;
        const speed = Math.sqrt(dx * dx + dy * dy);

        if (speed > 2 && fluidParticles.length < params.density * 3) {
          fluidParticles.push({
            x: mouse.x,
            y: mouse.y,
            vx: dx * 0.15 + (Math.random() - 0.5) * 1,
            vy: dy * 0.15 + (Math.random() - 0.5) * 1,
            age: 0,
            maxAge: 30 + Math.random() * 40,
            color: `rgba(0, 255, 170, ${params.intensity})`,
          });
        }

        // Draw and update particles
        for (let i = fluidParticles.length - 1; i >= 0; i--) {
          const p = fluidParticles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.vx *= 0.98;
          p.vy *= 0.98;
          p.age++;

          const size = (1 - p.age / p.maxAge) * 14;
          ctx.beginPath();
          ctx.arc(p.x, p.y, Math.max(0.1, size), 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();

          if (p.age >= p.maxAge) {
            fluidParticles.splice(i, 1);
          }
        }
      } else if (experimentId === "audio") {
        // Audio wave point cloud
        ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
        ctx.fillRect(0, 0, width, height);

        audioBars.forEach((bar, i) => {
          // Fake audio analysis wave calculations
          const dist = Math.abs(mouse.x - bar.x);
          const force = Math.max(0, 1 - dist / 120);
          
          bar.targetHeight = 
            (Math.sin(frame * params.speed * 0.1 + i * 0.4) * 45 + 55) * params.intensity + 
            force * 90;

          bar.currentHeight += (bar.targetHeight - bar.currentHeight) * 0.12;

          ctx.beginPath();
          ctx.rect(
            bar.x - 2,
            height / 2 - bar.currentHeight / 2,
            4,
            bar.currentHeight
          );
          ctx.fillStyle = i % 2 === 0 ? "#00ffaa" : "#ffffff";
          ctx.fill();
        });
      } else if (experimentId === "particles") {
        // GPU particle drift simulation
        ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
        ctx.fillRect(0, 0, width, height);

        gpuParticles.forEach((p) => {
          // Dynamic flow angle calculations
          const forceX = (mouse.x - p.x) * 0.0001 * params.intensity;
          const forceY = (mouse.y - p.y) * 0.0001 * params.intensity;
          
          p.angle += (Math.sin(p.x * 0.01 + frame * 0.01) * 0.05 + Math.cos(p.y * 0.01) * 0.05) * params.speed;
          p.x += Math.cos(p.angle) * p.speed * params.speed + forceX * 10;
          p.y += Math.sin(p.angle) * p.speed * params.speed + forceY * 10;

          // Wrap boundaries
          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0, 255, 170, ${0.45 + (p.size / 3) * 0.55})`;
          ctx.fill();
        });
      } else if (experimentId === "portal") {
        // Volumetric clouds
        const grad = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          5,
          mouse.x,
          mouse.y,
          80 + params.density * 1.5
        );
        grad.addColorStop(0, `rgba(0, 255, 170, ${0.45 * params.intensity})`);
        grad.addColorStop(0.3, `rgba(0, 255, 170, ${0.12 * params.intensity})`);
        grad.addColorStop(1, "rgba(0, 0, 0, 0)");

        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);

        // Ring pulses
        const pulse = (Math.sin(frame * params.speed * 0.05) * 15 + 60) * params.intensity;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, pulse, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(0, 255, 170, 0.15)";
        ctx.lineWidth = 1;
        ctx.stroke();
      } else {
        // Physics or generic fallback
        ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
        ctx.fillRect(0, 0, width, height);

        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 45, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0, 255, 170, 0.15)";
        ctx.fill();
        ctx.strokeStyle = "#00ffaa";
        ctx.stroke();
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, [experimentId, params]);

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-lg p-4 md:p-8"
    >
      <div className="glass-panel w-full max-w-5xl h-[80vh] rounded-3xl border border-white/10 flex flex-col md:flex-row overflow-hidden shadow-2xl relative">
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full border border-white/10 bg-black/40 text-zinc-400 hover:text-white hover:border-emerald-400/30 transition-all flex items-center justify-center cursor-pointer z-50 pointer-events-auto"
        >
          ✕
        </button>

        {/* Left Visual Stage */}
        <div className="flex-1 h-full bg-zinc-950/40 relative">
          <canvas ref={canvasRef} className="w-full h-full block cursor-crosshair pointer-events-auto" />
          <div className="absolute bottom-6 left-6 pointer-events-none">
            <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase">Interactive Screen</span>
            <p className="text-[10px] font-mono text-emerald-400">Move cursor to interact with grid variables.</p>
          </div>
        </div>

        {/* Right Controls Panel */}
        <div className="w-full md:w-[320px] h-full border-t md:border-t-0 md:border-l border-white/5 p-8 flex flex-col justify-between bg-black/20">
          
          <div className="flex flex-col gap-6">
            <div>
              <span className="text-[9px] font-mono tracking-widest text-emerald-400 uppercase">
                ✦ Experiment Sandbox
              </span>
              <h4 className="font-display font-bold text-xl uppercase text-white tracking-tight mt-2">
                {experimentId === "fluid" ? "Fluid Dynamics" :
                 experimentId === "audio" ? "Audio Point Cloud" :
                 experimentId === "physics" ? "DOM Elastic Grid" :
                 experimentId === "particles" ? "GPU Particle Drift" :
                 experimentId === "typography" ? "3D Text Warper" : "Light Portal"}
              </h4>
            </div>

            {/* Config Sliders */}
            <div className="flex flex-col gap-5 pt-4 border-t border-white/5">
              <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase">
                ✦ Parameters
              </span>

              {/* Slider 1 */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-[10px] font-mono text-zinc-400">
                  <span>Simulation Speed</span>
                  <span>{params.speed.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="3.0"
                  step="0.1"
                  value={params.speed}
                  onChange={(e) => setParams({ ...params, speed: parseFloat(e.target.value) })}
                  className="w-full accent-emerald-400 pointer-events-auto cursor-pointer"
                />
              </div>

              {/* Slider 2 */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-[10px] font-mono text-zinc-400">
                  <span>Ecosystem Density</span>
                  <span>{params.density}</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={params.density}
                  onChange={(e) => setParams({ ...params, density: parseInt(e.target.value) })}
                  className="w-full accent-emerald-400 pointer-events-auto cursor-pointer"
                />
              </div>

              {/* Slider 3 */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-[10px] font-mono text-zinc-400">
                  <span>Interaction Force</span>
                  <span>{Math.round(params.intensity * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1.5"
                  step="0.05"
                  value={params.intensity}
                  onChange={(e) => setParams({ ...params, intensity: parseFloat(e.target.value) })}
                  className="w-full accent-emerald-400 pointer-events-auto cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Stats details */}
          <div className="flex flex-col gap-3 pt-6 border-t border-white/5">
            <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase">
              ✦ Telemetry
            </span>
            <div className="flex justify-between text-[10px] font-mono text-zinc-500">
              <span>Target framerate:</span>
              <span className="text-emerald-400">60 FPS</span>
            </div>
            <div className="flex justify-between text-[10px] font-mono text-zinc-500">
              <span>Vector points:</span>
              <span className="text-white">Active</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
