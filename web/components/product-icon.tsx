import { existsSync } from "node:fs";
import { join } from "node:path";
import Image from "next/image";
import type { ReactNode } from "react";

const EXTENSIONS = ["svg", "png", "webp"] as const;

/** Placeholder line icons, shown until a file named after the product slug is dropped into public/icons. */
const FALLBACK: Record<string, ReactNode> = {
  kasko: (
    <>
      <path d="M5 15l1.5-4.6A2 2 0 0 1 8.4 9h7.2a2 2 0 0 1 1.9 1.4L19 15" />
      <rect x="3" y="15" width="18" height="4.5" rx="1.5" />
      <path d="M6.5 17.2h.01M17.5 17.2h.01" />
    </>
  ),
  "trafik-sigortasi": (
    <>
      <rect x="8" y="3" width="8" height="18" rx="3" />
      <path d="M12 7.5h.01M12 12h.01M12 16.5h.01" />
    </>
  ),
  dask: (
    <>
      <path d="M4 11l8-7 8 7" />
      <path d="M6 10v10h12V10" />
      <path d="M8.5 16l2-3.5 2 3 2-4.5" />
    </>
  ),
  "konut-sigortasi": (
    <>
      <path d="M4 11l8-7 8 7" />
      <path d="M6 10v10h12V10" />
      <path d="M10 20v-5h4v5" />
    </>
  ),
  "tamamlayici-saglik": (
    <>
      <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />
      <path d="M12 9.5v5M9.5 12h5" />
    </>
  ),
  "seyahat-sigortasi": <path d="M21 3L10 14M21 3l-7 18-4-7-7-4 18-7z" />,
  imm: (
    <>
      <path d="M12 3l8 3v6c0 4.5-3.2 8-8 9-4.8-1-8-4.5-8-9V6l8-3z" />
      <path d="M12 9v6M9 12h6" />
    </>
  ),
  "ferdi-kaza": (
    <>
      <circle cx="10" cy="8" r="3" />
      <path d="M4 20a6 6 0 0 1 12 0" />
      <path d="M18 5v6M15 8h6" />
    </>
  ),
  "ruhsat-teklif": (
    <>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5z" />
      <path d="M14 3v5h5" />
      <path d="M12 17v-6M9.5 13.5L12 11l2.5 2.5" />
    </>
  ),
};

function customIcon(slug: string): string | null {
  const ext = EXTENSIONS.find((e) => existsSync(join(process.cwd(), "public", "icons", `${slug}.${e}`)));
  return ext ? `/icons/${slug}.${ext}` : null;
}

/** The product's own icon from public/icons/<slug>.(svg|png|webp), or a placeholder when none exists yet. */
export function ProductIcon({ slug, className = "size-7" }: { slug: string; className?: string }) {
  const src = customIcon(slug);
  if (src) return <Image src={src} alt="" width={64} height={64} unoptimized className={`${className} object-contain`} />;

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden className={className}>
      {FALLBACK[slug]}
    </svg>
  );
}
