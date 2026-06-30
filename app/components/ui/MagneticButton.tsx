"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  range?: number; // How far away the magnetic pull reaches
  strength?: number; // How strong the magnetic pull is
  textStrength?: number; // Strength of text movement (parallax)
  variant?: "primary" | "secondary";
}

export default function MagneticButton({
  children,
  className = "",
  range = 80,
  strength = 0.35,
  textStrength = 0.15,
  variant = "primary",
  ...props
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const reflectionRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const button = buttonRef.current;
    const text = textRef.current;
    const reflection = reflectionRef.current;
    if (!button) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const rect = button.getBoundingClientRect();
      const x = clientX - (rect.left + rect.width / 2);
      const y = clientY - (rect.top + rect.height / 2);
      const distance = Math.sqrt(x * x + y * y);

      if (distance < range) {
        // Magnetic pull on button
        gsap.to(button, {
          x: x * strength,
          y: y * strength,
          duration: 0.4,
          ease: "power2.out",
        });

        // Parallax effect on text
        if (text) {
          gsap.to(text, {
            x: x * textStrength,
            y: y * textStrength,
            duration: 0.4,
            ease: "power2.out",
          });
        }

        // Move reflection sheen relative to mouse
        if (reflection) {
          const rx = (clientX - rect.left) / rect.width * 100;
          const ry = (clientY - rect.top) / rect.height * 100;
          gsap.to(reflection, {
            left: `${rx}%`,
            top: `${ry}%`,
            opacity: 0.15,
            duration: 0.3,
            ease: "power1.out",
          });
        }
      } else {
        resetAnimations();
      }
    };

    const handleMouseLeave = () => {
      resetAnimations();
    };

    const resetAnimations = () => {
      gsap.to(button, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: "elastic.out(1, 0.3)",
      });

      if (text) {
        gsap.to(text, {
          x: 0,
          y: 0,
          duration: 0.6,
          ease: "elastic.out(1, 0.3)",
        });
      }

      if (reflection) {
        gsap.to(reflection, {
          opacity: 0,
          duration: 0.5,
          ease: "power2.out",
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    button.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (button) {
        button.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [range, strength, textStrength]);

  const baseStyles = "relative inline-flex items-center justify-center rounded-full font-medium tracking-wide overflow-hidden transition-all duration-300 pointer-events-auto cursor-pointer";
  
  const variantStyles = variant === "primary"
    ? "px-8 py-4 bg-white text-black text-sm md:text-base border border-transparent font-semibold shadow-lg shadow-white/10 hover:shadow-white/20 active:scale-95"
    : "px-8 py-4 bg-zinc-900/60 text-zinc-300 text-sm md:text-base border border-white/10 hover:border-white/20 hover:text-white backdrop-blur-md active:scale-95";

  return (
    <button
      ref={buttonRef}
      className={`${baseStyles} ${variantStyles} ${className}`}
      {...props}
    >
      {/* Liquid border container */}
      {variant === "primary" && (
        <span className="absolute inset-0 bg-gradient-to-r from-neutral-200 via-white to-neutral-400 opacity-10 blur-sm pointer-events-none" />
      )}

      {/* Reflection glass sheen */}
      <span
        ref={reflectionRef}
        className="absolute w-24 h-24 bg-white/40 rounded-full pointer-events-none blur-md transform -translate-x-1/2 -translate-y-1/2 opacity-0 mix-blend-screen"
        style={{ left: "50%", top: "50%" }}
      />

      <span ref={textRef} className="relative z-10 block pointer-events-none">
        {children}
      </span>
    </button>
  );
}
