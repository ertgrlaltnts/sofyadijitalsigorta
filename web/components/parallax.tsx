"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** Publishes the pointer position (-0.5..0.5) as --mx / --my so `.px` layers can drift at their own depth. */
export function Parallax({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(hover: none), (prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const clamp = (value: number) => Math.max(-0.5, Math.min(0.5, value));
    const onMove = (event: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        el.style.setProperty("--mx", clamp((event.clientX - rect.left) / rect.width - 0.5).toFixed(3));
        el.style.setProperty("--my", clamp((event.clientY - rect.top) / rect.height - 0.5).toFixed(3));
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
