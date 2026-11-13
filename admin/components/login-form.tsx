"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({
  email: z.string().min(1, "E-posta gerekli.").email("Geçerli bir e-posta girin."),
  password: z.string().min(1, "Şifre gerekli."),
});
type FormValues = z.infer<typeof schema>;

function safeNext(value: string | null): string {
  return value && value.startsWith("/") && !value.startsWith("//") ? value : "/";
}

export function LoginForm() {
  const router = useRouter();
  const next = safeNext(useSearchParams().get("next"));
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    const response = await fetch("/api/session/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (!response.ok) {
      const body = (await response.json().catch(() => ({}))) as { message?: string };
      setServerError(body.message ?? "Giriş yapılamadı.");
      return;
    }
    router.replace(next);
    router.refresh();
  });

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <div className="space-y-2">
        <Label htmlFor="email">E-posta</Label>
        <Input
          id="email"
          type="email"
          autoComplete="username"
          placeholder="ad@sirket.com"
          aria-invalid={!!errors.email}
          className="h-10"
          {...register("email")}
        />
        {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Şifre</Label>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          aria-invalid={!!errors.password}
          className="h-10"
          {...register("password")}
        />
        {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
      </div>
      {serverError && (
        <p role="alert" className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {serverError}
        </p>
      )}
      <Button type="submit" size="lg" className="h-10 w-full" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="animate-spin" />}
        Giriş yap
      </Button>
    </form>
  );
}
