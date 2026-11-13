import type { FieldValues, Path, UseFormSetError } from "react-hook-form";
import { toast } from "sonner";
import { ApiError } from "@/lib/api";

export function applyApiError<T extends FieldValues>(error: unknown, setError?: UseFormSetError<T>): void {
  if (!(error instanceof ApiError)) {
    toast.error("Beklenmeyen bir hata oluştu.");
    return;
  }
  const entries = Object.entries(error.fieldErrors);
  if (setError && entries.length > 0) {
    for (const [field, message] of entries) setError(field as Path<T>, { type: "server", message });
    return;
  }
  toast.error(error.message);
}

export const errorMessage = (error: unknown): string => (error instanceof ApiError ? error.message : "Beklenmeyen bir hata oluştu.");
