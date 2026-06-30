"use client";

import React, { useRef, useCallback, useState } from "react";
import gsap from "gsap";

export type FacetVariant = "monolith" | "slab" | "chip" | "vault" | "hologram";

interface FacetPrismProps {
  variant?: FacetVariant;
  accent?: string;
  children: React.ReactNode;
  className?: string;
  faceClassName?: string;
  as?: "div" | "button" | "a";
  tilt?: boolean;
  tiltIntensity?: number;
  depth?: number;
  onClick?: () => void;
  href?: string;
  target?: string;
  rel?: string;
  disabled?: boolean;
  glow?: boolean;
}

const DEPTH: Record<FacetVariant, number> = {
  monolith: 16,
  slab: 12,
  chip: 6,
  vault: 20,
  hologram: 8,
};

export default function FacetPrism({
  variant = "slab",
  accent = "#00ffaa",
  children,
  className = "",
  faceClassName = "",
  as = "div",
  tilt = true,
  tiltIntensity = 1,
  depth: depthProp,
  onClick,
  href,
  target,
  rel,
  disabled,
  glow = false,
}: FacetPrismProps) {
  const tiltRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const depth = depthProp ?? DEPTH[variant];
  const radius = variant === "chip" ? "9999px" : variant === "vault" ? "4px" : "14px";

  const handleMove = useCallback(
    (e: React.MouseEvent) => {
      if (!tilt || !tiltRef.current) return;
      const rect = tiltRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * tiltIntensity;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * tiltIntensity;
      gsap.to(tiltRef.current, {
        rotateY: x * 14,
        rotateX: -y * 10,
        duration: 0.35,
        ease: "power2.out",
      });
    },
    [tilt, tiltIntensity]
  );

  const handleLeave = useCallback(() => {
    setHovered(false);
    if (!tiltRef.current) return;
    gsap.to(tiltRef.current, {
      rotateY: 0,
      rotateX: 0,
      duration: 0.65,
      ease: "elastic.out(1, 0.45)",
    });
  }, []);

  const inner = (
    <div
      className={`facet-prism-root ${className}`}
      style={{ perspective: "1000px" }}
      onMouseEnter={() => setHovered(true)}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      <div
        ref={tiltRef}
        className="relative w-full"
        style={{
          transformStyle: "preserve-3d",
          filter: hovered && glow ? `drop-shadow(0 12px 28px ${accent}40)` : undefined,
          willChange: "transform",
        }}
      >
        <div className="relative" style={{ transformStyle: "preserve-3d" }}>
          {/* Front */}
          <div
            className={`relative z-[2] ${faceClassName}`}
            style={{
              borderRadius: radius,
              background:
                variant === "hologram"
                  ? `linear-gradient(145deg, ${accent}12 0%, rgba(5,8,10,0.9) 50%, rgba(2,4,6,0.95) 100%)`
                  : "rgba(5, 8, 12, 0.88)",
              border: `1px solid ${hovered ? `${accent}66` : "rgba(255,255,255,0.09)"}`,
              boxShadow: hovered
                ? `inset 0 1px 0 rgba(255,255,255,0.1), 0 24px 48px rgba(0,0,0,0.5), 0 0 0 1px ${accent}20`
                : "inset 0 1px 0 rgba(255,255,255,0.05), 0 16px 40px rgba(0,0,0,0.45)",
              transform: `translateZ(${depth}px)`,
              backfaceVisibility: "hidden",
            }}
          >
            {variant === "hologram" && <div className="facet-scanlines absolute inset-0 rounded-[inherit] pointer-events-none" />}
            <div
              className="absolute top-0 left-3 right-3 h-px transition-opacity duration-300 pointer-events-none"
              style={{ background: accent, opacity: hovered ? 1 : 0.35 }}
            />
            <div className="relative">{children}</div>
          </div>

          {/* Right extrusion */}
          <div
            aria-hidden
            className="absolute top-0 right-0 h-full origin-right"
            style={{
              width: depth,
              background: `linear-gradient(90deg, ${accent}30, #020405)`,
              transform: `rotateY(90deg) translateZ(-${depth / 2}px)`,
              transformOrigin: "right center",
              borderRadius: `0 ${radius} ${radius} 0`,
              backfaceVisibility: "hidden",
            }}
          />

          {/* Bottom extrusion */}
          <div
            aria-hidden
            className="absolute bottom-0 left-0 w-full origin-bottom"
            style={{
              height: depth,
              background: "linear-gradient(180deg, #0a1014, #010203)",
              transform: `rotateX(-90deg) translateZ(-${depth / 2}px)`,
              transformOrigin: "bottom center",
              backfaceVisibility: "hidden",
            }}
          />
        </div>
      </div>
    </div>
  );

  if (as === "button") {
    return (
      <button
        type="button"
        className="block w-full text-left border-0 bg-transparent p-0 cursor-pointer disabled:opacity-50"
        onClick={onClick}
        disabled={disabled}
      >
        {inner}
      </button>
    );
  }

  if (as === "a") {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        className="block w-full no-underline text-inherit"
        onClick={onClick}
      >
        {inner}
      </a>
    );
  }

  return inner;
}
