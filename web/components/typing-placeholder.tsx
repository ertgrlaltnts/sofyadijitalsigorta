"use client";

import { useEffect, useState } from "react";

const TYPE_MS = 65;
const START_DELAY_MS = 400;
/** How long the finished sentence waits, with the caret blinking, before it is typed again. */
const HOLD_MS = 5000;

/**
 * A placeholder that types itself out letter by letter, blinks its caret for a few seconds, then starts over. It sits on top of
 * an empty field and ignores the pointer, so the field stays fully usable. With reduced motion it is the plain sentence.
 */
export function TypingPlaceholder({ text, className = "" }: { text: string; className?: string }) {
  const [shown, setShown] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (reduced) return;
    let timer: ReturnType<typeof setTimeout>;
    const step = (count: number) => {
      setShown(count);
      timer = setTimeout(() => (count < text.length ? step(count + 1) : step(0)), count < text.length ? (count === 0 ? START_DELAY_MS : TYPE_MS) : HOLD_MS);
    };
    step(0);
    return () => clearTimeout(timer);
  }, [text, reduced]);

  const done = reduced || shown >= text.length;
  return (
    <span aria-hidden className={`pointer-events-none select-none ${className}`}>
      {reduced ? text : text.slice(0, shown)}
      {!reduced && (
        <span
          className="ml-px inline-block h-[1.1em] w-px translate-y-[0.2em] bg-gold-hi"
          style={done ? { animation: "caret-blink 1s steps(1) infinite" } : undefined}
        />
      )}
    </span>
  );
}
