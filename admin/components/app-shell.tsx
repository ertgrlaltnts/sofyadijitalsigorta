"use client";

import { useState, useSyncExternalStore } from "react";
import { CommandPalette } from "@/components/command-palette";
import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "sofya.sidebar.collapsed";
const listeners = new Set<() => void>();

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function readCollapsed(): boolean {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === null ? window.matchMedia("(max-width: 1023px)").matches : stored === "1";
}

function writeCollapsed(value: boolean): void {
  localStorage.setItem(STORAGE_KEY, value ? "1" : "0");
  listeners.forEach((listener) => listener());
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const collapsed = useSyncExternalStore(subscribe, readCollapsed, () => false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  const toggleSidebar = () => writeCollapsed(!collapsed);

  return (
    <div className="flex h-dvh overflow-hidden">
      <aside
        className={cn(
          "hidden shrink-0 border-r border-sidebar-border transition-[width] duration-200 ease-out md:block",
          collapsed ? "w-[72px]" : "w-64",
        )}
      >
        <Sidebar collapsed={collapsed} />
      </aside>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" showCloseButton={false} className="w-64 gap-0 border-sidebar-border bg-sidebar p-0">
          <SheetTitle className="sr-only">Menü</SheetTitle>
          <SheetDescription className="sr-only">Sayfa gezinme menüsü</SheetDescription>
          <Sidebar onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          onToggleSidebar={toggleSidebar}
          onOpenMobileMenu={() => setMobileOpen(true)}
          onOpenPalette={() => setPaletteOpen(true)}
        />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-7xl p-4 md:p-6 lg:p-8">{children}</div>
        </main>
      </div>

      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
    </div>
  );
}
