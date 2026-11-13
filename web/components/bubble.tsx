import type { CSSProperties } from "react";

type BubbleProps = {
  from: "user" | "bot";
  text: string;
  className?: string;
  /** Seconds before the bubble pops in. */
  delay: number;
  /** How far the bubble drifts with the pointer, in px. Negative values move against it. */
  depth: number;
  /** Seconds for one float cycle. */
  float?: number;
};

export function Bubble({ from, text, className = "", delay, depth, float = 7 }: BubbleProps) {
  const user = from === "user";
  return (
    <div className={`px absolute z-20 ${className}`} style={{ "--depth": depth } as CSSProperties}>
      <div className="bubble-pop" style={{ "--d": `${delay}s` } as CSSProperties}>
        <div className="bubble-float" style={{ "--fdur": `${float}s`, "--fd": `${-delay * 2}s` } as CSSProperties}>
          <p
            className={`max-w-[10.5rem] px-3.5 py-2.5 text-[0.75rem] leading-snug shadow-[0_12px_30px_-10px_rgba(0,0,0,0.6)] sm:max-w-[14rem] sm:px-4 sm:py-3 sm:text-[0.875rem] ${
              user
                ? "rounded-[1.25rem] rounded-br-md bg-pearl font-medium text-ink"
                : "rounded-[1.25rem] rounded-bl-md border border-white/12 bg-navy-2 text-pearl"
            }`}
          >
            {text}
          </p>
        </div>
      </div>
    </div>
  );
}
