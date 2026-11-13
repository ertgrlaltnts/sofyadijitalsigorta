"use client";

import { useQuery } from "@tanstack/react-query";
import { FilePlus2, FileText, LogOut, Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useLogout } from "@/components/user-menu";
import { api } from "@/lib/api";
import { NAV_ITEMS } from "@/lib/nav";
import type { KnowledgeListItem, Page } from "@/lib/types";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const fold = (text: string): string => text.toLocaleLowerCase("tr-TR");

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter();
  const { setTheme } = useTheme();
  const logout = useLogout();
  const [input, setInput] = useState("");
  const [debounced, setDebounced] = useState("");

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onOpenChange]);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(input.trim()), 250);
    return () => clearTimeout(timer);
  }, [input]);

  const { data: results } = useQuery({
    queryKey: ["palette-search", debounced],
    queryFn: () => api<Page<KnowledgeListItem>>("admin/knowledge", { query: { search: debounced, limit: 6 } }),
    enabled: open && debounced.length >= 2,
  });

  const run = (action: () => void) => {
    onOpenChange(false);
    setInput("");
    action();
  };

  const query = fold(input.trim());
  const pages = NAV_ITEMS.filter((item) => !query || fold(`${item.label} ${item.keywords}`).includes(query));
  const showActions = !query || fold("yeni bilgi kaydı ekle oluştur").includes(query);

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange} className="sm:max-w-xl" title="Komut paleti" description="Sayfalara gidin veya bilgi tabanında arayın">
      <Command shouldFilter={false}>
        <CommandInput value={input} onValueChange={setInput} placeholder="Sayfa, işlem veya bilgi kaydı ara…" />
        <CommandList>
          <CommandEmpty>Sonuç bulunamadı.</CommandEmpty>

          {pages.length > 0 && (
            <CommandGroup heading="Sayfalar">
              {pages.map(({ href, label, icon: Icon }) => (
                <CommandItem key={href} value={href} onSelect={() => run(() => router.push(href))}>
                  <Icon /> {label}
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {results && results.items.length > 0 && (
            <>
              <CommandSeparator />
              <CommandGroup heading="Bilgi tabanı">
                {results.items.map((entry) => (
                  <CommandItem
                    key={entry.id}
                    value={`kayit-${entry.id}`}
                    onSelect={() => run(() => router.push(`/bilgi-tabani/${entry.id}`))}
                  >
                    <FileText /> <span className="flex-1 truncate">{entry.title}</span>
                    {entry.category && <span className="text-xs text-muted-foreground">{entry.category.name}</span>}
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}

          {showActions && (
            <>
              <CommandSeparator />
              <CommandGroup heading="Hızlı işlemler">
                <CommandItem value="yeni-kayit" onSelect={() => run(() => router.push("/bilgi-tabani/yeni"))}>
                  <FilePlus2 /> Yeni bilgi kaydı ekle
                </CommandItem>
                <CommandItem value="tema-acik" onSelect={() => run(() => setTheme("light"))}>
                  <Sun /> Açık temaya geç
                </CommandItem>
                <CommandItem value="tema-koyu" onSelect={() => run(() => setTheme("dark"))}>
                  <Moon /> Koyu temaya geç
                </CommandItem>
                <CommandItem value="tema-sistem" onSelect={() => run(() => setTheme("system"))}>
                  <Monitor /> Sistem temasını kullan
                </CommandItem>
                <CommandItem value="cikis" onSelect={() => run(() => void logout())}>
                  <LogOut /> Çıkış yap
                </CommandItem>
              </CommandGroup>
            </>
          )}
        </CommandList>
      </Command>
    </CommandDialog>
  );
}
