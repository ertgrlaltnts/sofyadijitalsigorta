"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface CurrentUser {
  id: string;
  email: string;
  name: string;
}

export function useMe() {
  return useQuery({ queryKey: ["me"], queryFn: () => api<CurrentUser>("auth/me"), staleTime: 5 * 60_000 });
}
