/**
 * Faint circuit-board backdrop for the home hero: a masked grid, dots at the crossings and a few
 * traces with a slow gold pulse travelling along them. Kept at very low contrast on purpose.
 */

const TRACES = [
  { d: "M0 150 H190 L240 200 H430 L470 240 H620", nodes: [[190, 150], [430, 200], [620, 240]] },
  { d: "M1200 110 H1020 L970 160 H830 L790 200 H690", nodes: [[1020, 110], [830, 160], [690, 200]] },
  { d: "M0 650 H150 L200 600 H350 L390 560 H520", nodes: [[150, 650], [350, 600], [520, 560]] },
  { d: "M1200 690 H1070 L1020 640 H910 L870 600 H760", nodes: [[1070, 690], [910, 640], [760, 600]] },
] as const;

export function TechPattern() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="tech-grid absolute inset-0" />
      <div className="tech-dots absolute inset-0" />

      <svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full">
        {TRACES.map((trace, i) => (
          <g key={trace.d}>
            <path d={trace.d} fill="none" stroke="rgba(150,175,230,0.14)" strokeWidth="1" />
            <path
              d={trace.d}
              pathLength={1000}
              fill="none"
              stroke="rgba(240,201,122,0.75)"
              strokeWidth="1.4"
              strokeLinecap="round"
              className="trace-pulse"
              style={{ "--td": `${i * 2.2}s` } as React.CSSProperties}
            />
            {trace.nodes.map(([cx, cy]) => (
              <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="3" fill="#0b1322" stroke="rgba(150,175,230,0.28)" strokeWidth="1" />
            ))}
          </g>
        ))}
      </svg>

      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-night to-transparent" />
    </div>
  );
}
