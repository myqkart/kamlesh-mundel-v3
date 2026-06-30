"use client";

import React from "react";
import FacetPrism from "./FacetPrism";

interface PrismBadgeProps {
  children: React.ReactNode;
  accent?: string;
  className?: string;
}

export default function PrismBadge({ children, accent = "#00ffaa", className = "" }: PrismBadgeProps) {
  return (
    <FacetPrism
      variant="chip"
      accent={accent}
      tilt={false}
      depth={4}
      className={`inline-block w-fit ${className}`}
      faceClassName="!rounded-full px-3.5 py-1.5"
    >
      <span className="text-[10px] font-mono tracking-widest text-zinc-300 uppercase whitespace-nowrap">
        {children}
      </span>
    </FacetPrism>
  );
}
