"use client";

import { useCallback, useState } from "react";
import { siteConfig } from "../../lib/site";

type ShareState = "idle" | "shared" | "copied";

export default function SharePulse() {
  const [state, setState] = useState<ShareState>("idle");

  const share = useCallback(async () => {
    const url = window.location.href;
    const payload = {
      title: siteConfig.title,
      text: `${siteConfig.tagline} — ${siteConfig.description}`,
      url,
    };

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share(payload);
        setState("shared");
      } catch {
        // User dismissed — no action needed
      }
    } else if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(url);
      setState("copied");
    }

    window.setTimeout(() => setState("idle"), 2200);
  }, []);

  const label =
    state === "shared" ? "Shared!" : state === "copied" ? "Link copied" : "Share";

  return (
    <button
      type="button"
      onClick={share}
      aria-label="Share this portfolio"
      className="fixed bottom-6 right-6 z-50 group flex items-center gap-3 pointer-events-auto"
    >
      <span
        className="hidden sm:block text-[10px] font-mono tracking-widest uppercase text-zinc-500 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
        aria-hidden
      >
        {label}
      </span>
      <span
        className="relative flex h-12 w-12 items-center justify-center rounded-full border border-emerald-400/30 bg-black/80 backdrop-blur-md text-emerald-400 shadow-[0_0_24px_rgba(0,255,170,0.15)] transition-transform duration-300 group-hover:scale-110 group-active:scale-95"
        style={{
          animation: state !== "idle" ? "none" : "sharePulse 3s ease-in-out infinite",
        }}
      >
        <span className="absolute inset-0 rounded-full border border-emerald-400/20 animate-ping opacity-40" />
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <path d="M8.59 13.51 15.42 17.49" />
          <path d="M15.41 6.51 8.59 10.49" />
        </svg>
      </span>
    </button>
  );
}
