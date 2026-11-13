"use client";

import type { PointerEvent, ReactNode } from "react";
import { AppLink } from "./app-link";

/**
 * A card link that publishes the pointer position as --x / --y so a `.spot` layer inside can follow the cursor.
 * Internal hrefs go through AppLink (page transition); `external` opens in a new tab.
 */
export function SpotlightLink({
  href,
  external = false,
  className,
  children,
}: {
  href: string;
  external?: boolean;
  className: string;
  children: ReactNode;
}) {
  const onPointerMove = (event: PointerEvent<HTMLAnchorElement>) => {
    const el = event.currentTarget;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--x", `${event.clientX - rect.left}px`);
    el.style.setProperty("--y", `${event.clientY - rect.top}px`);
  };

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className} onPointerMove={onPointerMove}>
        {children}
      </a>
    );
  }
  return (
    <AppLink href={href} className={className} onPointerMove={onPointerMove}>
      {children}
    </AppLink>
  );
}
