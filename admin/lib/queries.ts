"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Category } from "@/lib/types";

export function useCategories() {
  return useQuery({ queryKey: ["categories"], queryFn: () => api<Category[]>("admin/categories"), staleTime: 60_000 });
}
