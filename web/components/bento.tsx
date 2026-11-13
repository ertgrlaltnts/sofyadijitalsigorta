import type { CSSProperties, ReactNode } from "react";
import { BENEFITS } from "@/lib/content";
import { Reveal } from "./reveal";

const TILE =
  "relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-ink/10 bg-white p-7 text-ink shadow-[0_1px_0_rgba(15,26,48,0.04)] transition-[translate,scale,rotate,transform,box-shadow] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:shadow-[0_30px_50px_-30px_rgba(15,26,48,0.3)] sm:p-8";

function Tile({ index, className, children }: { index: number; className: string; children: ReactNode }) {
  const item = BENEFITS[index];
  return (
    <Reveal delay={index * 110} variant="up" className={className}>
      <article className={TILE}>
        <div aria-hidden className="pointer-events-none absolute -top-24 -right-24 size-56 rounded-full bg-gold/20 blur-3xl" />
        <div className="relative min-h-[9.5rem] flex-1">{children}</div>
        <h3 className="relative mt-6 font-display text-[1.875rem] leading-tight">{item.title}</h3>
        <p className="relative mt-2 max-w-md leading-relaxed text-ink-soft">{item.body}</p>
      </article>
    </Reveal>
  );
}

function TypingDemo() {
  return (
    <div className="space-y-3" aria-hidden>
      <div className="ml-auto w-full max-w-[18.5rem] rounded-[1.25rem] rounded-br-md bg-ink px-4 py-3 text-[0.9375rem] font-medium text-white">
        <div className="type-line" style={{ animationTimingFunction: "steps(27, end)" }}>
          Aracım için kasko bakıyorum
        </div>
      </div>
      <div className="flex w-fit items-center gap-1.5 rounded-[1.25rem] rounded-bl-md border border-ink/10 bg-pearl px-4 py-3.5">
        {[0, 0.15, 0.3].map((delay) => (
          <i key={delay} className="typing-dot size-1.5 rounded-full bg-gold-ink" style={{ animationDelay: `${delay}s` }} />
        ))}
      </div>
    </div>
  );
}

function JargonDemo() {
  return (
    <div className="grid h-full place-items-center text-center" aria-hidden>
      <div className="grid [&>*]:col-start-1 [&>*]:row-start-1">
        <span className="swap-a self-center rounded-full border border-gold-ink/50 px-5 py-2.5 font-display text-[1.75rem] text-gold-ink">
          Muafiyet
        </span>
        <span className="swap-b self-center rounded-[1.25rem] bg-ink px-4 py-3 text-[0.9375rem] leading-snug font-medium text-white">
          Hasarın ilk kısmını
          <br />
          siz ödersiniz.
        </span>
      </div>
    </div>
  );
}

function Toggle({ label, on, delay = 0 }: { label: string; on: boolean; delay?: number }) {
  return (
    <div className={`flex items-center justify-between gap-4 rounded-2xl border border-ink/10 bg-pearl px-4 py-3 ${on ? "" : "opacity-60"}`}>
      <span className={`text-[0.9375rem] ${on ? "text-ink" : "text-ink-soft line-through"}`}>{label}</span>
      <span
        className={`toggle-bg relative h-6 w-11 shrink-0 rounded-full ${on ? "" : "bg-ink/15"}`}
        style={{ "--td": `${delay}s`, animationName: on ? undefined : "none" } as CSSProperties}
      >
        <span
          className="toggle-knob absolute top-1 left-1 size-4 rounded-full bg-white shadow"
          style={{ "--td": `${delay}s`, animationName: on ? undefined : "none" } as CSSProperties}
        />
      </span>
    </div>
  );
}

function TogglesDemo() {
  return (
    <div className="space-y-2.5" aria-hidden>
      <Toggle label="Hırsızlık" on delay={0} />
      <Toggle label="Cam kırılması" on delay={0.5} />
      <Toggle label="Gereksiz ek paket" on={false} />
    </div>
  );
}

function DialDemo() {
  return (
    <div className="grid h-full place-items-center" aria-hidden>
      <svg viewBox="0 0 100 100" className="size-36">
        <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(15,26,48,0.12)" strokeWidth="1" />
        {Array.from({ length: 24 }, (_, i) => (
          <line
            key={i}
            x1="50"
            y1="6"
            x2="50"
            y2={i % 6 === 0 ? "14" : "10"}
            stroke={i % 6 === 0 ? "#c8963c" : "rgba(15,26,48,0.3)"}
            strokeWidth={i % 6 === 0 ? 1.6 : 1}
            strokeLinecap="round"
            transform={`rotate(${i * 15} 50 50)`}
          />
        ))}
        <g className="dial-hand">
          <line x1="50" y1="50" x2="50" y2="14" stroke="#c8963c" strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="50" cy="14" r="2.6" fill="#c8963c" />
        </g>
        <text x="50" y="57" textAnchor="middle" className="fill-ink font-display" fontSize="19">
          7/24
        </text>
      </svg>
    </div>
  );
}

export function Bento() {
  return (
    <div className="grid gap-5 lg:grid-cols-6">
      <Tile index={0} className="lg:col-span-4">
        <TypingDemo />
      </Tile>
      <Tile index={1} className="lg:col-span-2">
        <JargonDemo />
      </Tile>
      <Tile index={2} className="lg:col-span-3">
        <TogglesDemo />
      </Tile>
      <Tile index={3} className="lg:col-span-3">
        <DialDemo />
      </Tile>
    </div>
  );
}
