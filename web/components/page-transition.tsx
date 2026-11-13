import { ViewTransition, type ReactNode } from "react";

/**
 * Wrap each page's content so route changes made through <AppLink> play the page-out / page-in animation.
 * The single root element matters: Next scrolls a page's Fragment into view after navigation, and with many
 * sibling nodes it scrolls to the wrong one.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter={{ nav: "page-in", default: "none" }} exit={{ nav: "page-out", default: "none" }} default="none">
      <div>{children}</div>
    </ViewTransition>
  );
}
