"use client";

import { Menu, PanelLeft, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserMenu } from "@/components/user-menu";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { breadcrumbsFor } from "@/lib/nav";

interface TopbarProps {
  onToggleSidebar: () => void;
  onOpenMobileMenu: () => void;
  onOpenPalette: () => void;
}

export function Topbar({ onToggleSidebar, onOpenMobileMenu, onOpenPalette }: TopbarProps) {
  const crumbs = breadcrumbsFor(usePathname());

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background/80 px-4 backdrop-blur md:px-6">
      <Button variant="ghost" size="icon" className="md:hidden" onClick={onOpenMobileMenu} aria-label="Menüyü aç">
        <Menu className="size-4" />
      </Button>
      <Button variant="ghost" size="icon" className="hidden md:inline-flex" onClick={onToggleSidebar} aria-label="Kenar çubuğunu daralt">
        <PanelLeft className="size-4" />
      </Button>

      <Breadcrumb className="min-w-0 flex-1">
        <BreadcrumbList className="flex-nowrap">
          {crumbs.map((crumb, index) => (
            <Fragment key={`${crumb.label}-${index}`}>
              {index > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem className={index < crumbs.length - 1 ? "hidden sm:inline-flex" : undefined}>
                {crumb.href ? (
                  <BreadcrumbLink render={<Link href={crumb.href} />}>{crumb.label}</BreadcrumbLink>
                ) : (
                  <BreadcrumbPage className="truncate">{crumb.label}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
            </Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>

      <Button
        variant="outline"
        onClick={onOpenPalette}
        className="hidden h-9 w-56 justify-start gap-2 px-3 text-muted-foreground sm:inline-flex"
      >
        <Search className="size-4" />
        <span className="flex-1 text-left font-normal">Ara…</span>
        <kbd className="rounded border bg-muted px-1.5 font-mono text-[10px] text-muted-foreground">Ctrl K</kbd>
      </Button>
      <Button variant="ghost" size="icon" className="sm:hidden" onClick={onOpenPalette} aria-label="Ara">
        <Search className="size-4" />
      </Button>
      <ThemeToggle />
      <UserMenu />
    </header>
  );
}
