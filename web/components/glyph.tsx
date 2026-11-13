import type { ReactNode } from "react";
import type { CoverIcon } from "@/lib/product-pages";

/** Small line icons for the coverage cards. 24x24, drawn with currentColor. */
const GLYPHS: Record<CoverIcon, ReactNode> = {
  car: (
    <>
      <path d="M5 15l1.5-4.6A2 2 0 0 1 8.4 9h7.2a2 2 0 0 1 1.9 1.4L19 15" />
      <rect x="3" y="15" width="18" height="4.5" rx="1.5" />
      <path d="M6.5 17.2h.01M17.5 17.2h.01" />
    </>
  ),
  flame: <path d="M12 3c1 3.2 4.5 4.8 4.5 8.8a4.5 4.5 0 0 1-9 0c0-1.8.9-3 1.8-4 .3 1.1 1 1.7 1.8 1.8C11.3 8 11.5 5.5 12 3z" />,
  lock: (
    <>
      <rect x="5" y="10.5" width="14" height="10" rx="2.5" />
      <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5M12 14.5v2.5" />
    </>
  ),
  storm: (
    <>
      <path d="M7 15.5a4 4 0 0 1-.5-7.9A5.5 5.5 0 0 1 17 8.5a3.5 3.5 0 0 1 .5 7" />
      <path d="M9 18.5l-1 2.5M13 18.5l-1 2.5M17 18.5l-1 2.5" />
    </>
  ),
  glass: (
    <>
      <path d="M4 17.5l2.2-9a1.5 1.5 0 0 1 1.5-1.2h8.6a1.5 1.5 0 0 1 1.5 1.2l2.2 9z" />
      <path d="M9.5 7.3L8.5 17.5M14.5 7.3l1 10.2" />
    </>
  ),
  lifebuoy: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="3.5" />
      <path d="M5.6 5.6l3.9 3.9M18.4 5.6l-3.9 3.9M5.6 18.4l3.9-3.9M18.4 18.4l-3.9-3.9" />
    </>
  ),
  swap: <path d="M6 8h12l-3-3.5M18 16H6l3 3.5" />,
  wrench: <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />,
  shield: <path d="M12 3l8 3v6c0 4.5-3.2 8-8 9-4.8-1-8-4.5-8-9V6l8-3z" />,
  shieldCheck: (
    <>
      <path d="M12 3l8 3v6c0 4.5-3.2 8-8 9-4.8-1-8-4.5-8-9V6l8-3z" />
      <path d="M9 12l2 2 4-4" />
    </>
  ),
  heart: <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />,
  pulse: <path d="M3 12h4l2-5 4 10 2-5h6" />,
  cross: <path d="M10 4h4v6h6v4h-6v6h-4v-6H4v-4h6z" />,
  hospital: (
    <>
      <rect x="4" y="4" width="16" height="17" rx="2" />
      <path d="M12 8v6M9 11h6M10 21v-4h4v4" />
    </>
  ),
  home: (
    <>
      <path d="M4 11l8-7 8 7" />
      <path d="M6 10v10h12V10M10 20v-5h4v5" />
    </>
  ),
  building: (
    <>
      <rect x="5" y="3" width="14" height="18" rx="1.5" />
      <path d="M9 8h.01M15 8h.01M9 12h.01M15 12h.01M10 21v-4h4v4" />
    </>
  ),
  key: (
    <>
      <circle cx="8" cy="15" r="4" />
      <path d="M11 12l9-9M16 6l3 3" />
    </>
  ),
  water: <path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z" />,
  wave: <path d="M3 12h3l2-6 4 12 3-9 2 3h4" />,
  plane: <path d="M21 3L10 14M21 3l-7 18-4-7-7-4 18-7z" />,
  suitcase: (
    <>
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M4 7h16v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1zM4 12h16" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" />
    </>
  ),
  calendar: (
    <>
      <rect x="4" y="5" width="16" height="16" rx="2" />
      <path d="M4 10h16M8 3v4M16 3v4" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20a7 7 0 0 1 14 0" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20a6 6 0 0 1 12 0" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M16 14.5a5 5 0 0 1 5 5.5" />
    </>
  ),
  coin: (
    <>
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <circle cx="12" cy="12" r="2.5" />
      <path d="M6.5 12h.01M17.5 12h.01" />
    </>
  ),
  document: (
    <>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5z" />
      <path d="M14 3v5h5M9 13h6M9 17h6" />
    </>
  ),
  scale: (
    <>
      <path d="M12 4v16M7 20h10M5 7h14" />
      <path d="M5 7l-3 7a3 3 0 0 0 6 0zM19 7l-3 7a3 3 0 0 0 6 0z" />
    </>
  ),
  phone: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />,
  alert: (
    <>
      <path d="M12 4l9 16H3z" />
      <path d="M12 10v4M12 17h.01" />
    </>
  ),
};

export function Glyph({ name, className = "size-8" }: { name: CoverIcon; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden className={className}>
      {GLYPHS[name]}
    </svg>
  );
}
