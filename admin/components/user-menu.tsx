"use client";

import { useQueryClient } from "@tanstack/react-query";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useMe } from "@/lib/hooks";

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toLocaleUpperCase("tr-TR"))
    .join("");
}

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();
  return async () => {
    await fetch("/api/session/logout", { method: "POST" });
    queryClient.clear();
    router.replace("/giris");
    router.refresh();
  };
}

export function UserMenu() {
  const { data: user } = useMe();
  const logout = useLogout();

  if (!user) return <Skeleton className="size-8 rounded-full" />;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="rounded-full" aria-label="Kullanıcı menüsü" />}>
        <Avatar className="size-8">
          <AvatarFallback className="bg-primary text-xs font-semibold text-primary-foreground">
            {initials(user.name)}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex flex-col gap-0.5 py-2">
            <span className="text-sm font-medium text-foreground">{user.name}</span>
            <span className="text-xs font-normal text-muted-foreground">{user.email}</span>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout}>
          <LogOut /> Çıkış yap
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
