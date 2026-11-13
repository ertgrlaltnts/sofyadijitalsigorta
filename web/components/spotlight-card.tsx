"use client";

import type { PointerEvent, ReactNode } from "react";

/** A plain card that publishes the pointer position as --x / --y so a `.spot` layer inside can follow the cursor. */
export function SpotlightCard({ className, children }: { className: string; children: ReactNode }) {
  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    const el = event.currentTarget;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--x", `${event.clientX - rect.left}px`);
    el.style.setProperty("--y", `${event.clientY - rect.top}px`);
  };

  return (
    <article className={className} onPointerMove={onPointerMove}>
      {children}
    </article>
  );
}
