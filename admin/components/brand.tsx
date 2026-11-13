import Image from "next/image";
import { cn } from "@/lib/utils";

/** Sofya's avatar in a gold ring: the compact mark, for the collapsed sidebar. */
export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative size-9 shrink-0 overflow-hidden rounded-full bg-[#0b1322] ring-1 ring-[#e2b86a]/70 shadow-[0_0_14px_rgba(226,184,106,0.3)]",
        className,
      )}
      aria-hidden
    >
      <Image src="/sofya-avatar.png" alt="" fill sizes="36px" className="object-cover" />
    </span>
  );
}

/**
 * The Sofya Dijital Sigorta logo. `onDark` is for surfaces that are always dark (the sidebar); otherwise the logo follows
 * the theme: the dark-lettered version on light, the light-lettered one on dark.
 */
export function BrandLogo({ className, onDark = false }: { className?: string; onDark?: boolean }) {
  const size = { width: 500, height: 250 };
  return (
    <span className={cn("flex items-center", className)}>
      {onDark ? (
        <Image src="/logo.png" alt="Sofya Dijital Sigorta" {...size} priority className="-ml-2 h-14 w-auto" />
      ) : (
        <>
          <Image src="/logo-dark.png" alt="Sofya Dijital Sigorta" {...size} priority className="h-24 w-auto dark:hidden" />
          <Image src="/logo.png" alt="Sofya Dijital Sigorta" {...size} priority className="hidden h-24 w-auto dark:block" />
        </>
      )}
    </span>
  );
}
