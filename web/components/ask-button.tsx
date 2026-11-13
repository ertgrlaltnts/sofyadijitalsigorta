"use client";

import type { ReactNode } from "react";
import { ASK_EVENT, OPEN_EVENT } from "@/lib/content";

/** Sends `question` to Sofya, or just opens her: the floating chat, on every page, answers. */
export function AskButton({ question, className, children, onClick }: { question?: string; className?: string; children: ReactNode; onClick?: () => void }) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        onClick?.();
        if (!question) window.dispatchEvent(new CustomEvent(OPEN_EVENT));
        else window.dispatchEvent(new CustomEvent(ASK_EVENT, { detail: question }));
      }}
    >
      {children}
    </button>
  );
}
