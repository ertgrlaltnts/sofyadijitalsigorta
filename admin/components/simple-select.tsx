"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
}

interface SimpleSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  id?: string;
  invalid?: boolean;
}

export function SimpleSelect({ value, onValueChange, options, placeholder, className, id, invalid }: SimpleSelectProps) {
  return (
    <Select value={value} onValueChange={(next) => next !== null && onValueChange(next)} items={options}>
      <SelectTrigger id={id} aria-invalid={invalid} className={cn("w-full", className)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent alignItemWithTrigger={false}>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
