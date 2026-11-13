"use client";

import { X } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TagInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  id?: string;
  maxTags?: number;
}

export function TagInput({ value, onChange, placeholder = "Etiket yazıp Enter'a basın", id, maxTags = 20 }: TagInputProps) {
  const [draft, setDraft] = useState("");

  const commit = () => {
    const tag = draft.trim().replace(/,$/, "").trim();
    setDraft("");
    if (!tag || value.includes(tag) || value.length >= maxTags) return;
    onChange([...value, tag]);
  };

  return (
    <div
      className={cn(
        "flex min-h-9 flex-wrap items-center gap-1.5 rounded-lg border border-input px-2 py-1.5 transition-colors",
        "focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 dark:bg-input/30",
      )}
    >
      {value.map((tag) => (
        <Badge key={tag} variant="secondary" className="h-6 gap-1 pr-1 font-normal">
          {tag}
          <button
            type="button"
            onClick={() => onChange(value.filter((t) => t !== tag))}
            className="rounded-full p-0.5 hover:bg-foreground/10"
            aria-label={`${tag} etiketini kaldır`}
          >
            <X className="size-3" />
          </button>
        </Badge>
      ))}
      <input
        id={id}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            commit();
          } else if (e.key === "Backspace" && !draft && value.length > 0) {
            onChange(value.slice(0, -1));
          }
        }}
        onBlur={commit}
        placeholder={value.length === 0 ? placeholder : ""}
        className="min-w-24 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
      />
    </div>
  );
}
