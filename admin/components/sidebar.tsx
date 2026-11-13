"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo, BrandMark } from "@/components/brand";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { NAV_ITEMS, type NavItem } from "@/lib/nav";
import { cn } from "@/lib/utils";

interface SidebarProps {
  collapsed?: boolean;
  onNavigate?: () => void;
}

function isActive(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

function NavLink({ item, collapsed, active, onNavigate }: { item: NavItem; collapsed: boolean; active: boolean; onNavigate?: () => void }) {
  const Icon = item.icon;
  const link = (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      aria-label={collapsed ? item.label : undefined}
      className={cn(
        "relative flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium text-sidebar-foreground/75 transition-colors duration-150 outline-none",
        "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring",
        active && "bg-sidebar-accent text-sidebar-accent-foreground",
        collapsed && "justify-center px-0",
      )}
    >
      {active && <span className="absolute top-2 bottom-2 left-0 w-0.5 rounded-full bg-sidebar-primary" />}
      <Icon className={cn("size-[18px] shrink-0", active && "text-sidebar-primary")} />
      {!collapsed && <span className="truncate">{item.label}</span>}
    </Link>
  );

  if (!collapsed) return link;
  return (
    <Tooltip>
      <TooltipTrigger render={link} />
      <TooltipContent side="right">{item.label}</TooltipContent>
    </Tooltip>
  );
}

export function Sidebar({ collapsed = false, onNavigate }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className={cn("flex h-16 items-center border-b border-sidebar-border px-4", collapsed && "justify-center px-0")}>
        {collapsed ? <BrandMark /> : <BrandLogo onDark />}
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3" aria-label="Ana menü">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            collapsed={collapsed}
            active={isActive(pathname, item.href)}
            onNavigate={onNavigate}
          />
        ))}
      </nav>
      {!collapsed && (
        <p className="border-t border-sidebar-border px-5 py-4 text-xs text-sidebar-foreground/50">
          Sofya Dijital Sigorta · Yönetim Paneli
        </p>
      )}
    </div>
  );
}
