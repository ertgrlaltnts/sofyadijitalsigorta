"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

type Variant = "up" | "left" | "right" | "scale";

/** Fades content in when it scrolls into view. Pure DOM class toggle, so it never re-renders. */
export function Reveal({
  children,
  className = "",
  variant = "up",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  variant?: Variant;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      el.classList.add("is-in");
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.classList.add("is-in");
        observer.disconnect();
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.05 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const style: CSSProperties | undefined = delay ? { transitionDelay: `${delay}ms` } : undefined;
  return (
    <div ref={ref} style={style} className={`reveal reveal-${variant} ${className}`}>
      {children}
    </div>
  );
}
