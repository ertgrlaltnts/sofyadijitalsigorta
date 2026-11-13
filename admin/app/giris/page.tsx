import type { Metadata } from "next";
import { Suspense } from "react";
import { BrandLogo } from "@/components/brand";
import { LoginForm } from "@/components/login-form";
import { ThemeToggle } from "@/components/theme-toggle";

export const metadata: Metadata = { title: "Giriş" };

export default function LoginPage() {
  return (
    <main className="relative grid min-h-dvh place-items-center overflow-hidden px-4">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60rem_40rem_at_50%_-10%,color-mix(in_oklch,var(--primary)_14%,transparent),transparent)]"
      />
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-[400px]">
        <div className="mb-8 flex justify-center">
          <BrandLogo />
        </div>
        <div className="rounded-2xl border bg-card p-8 shadow-soft">
          <h1 className="text-xl font-semibold tracking-tight">Yönetim paneline giriş</h1>
          <p className="mt-1 mb-6 text-sm text-muted-foreground">Devam etmek için hesabınızla oturum açın.</p>
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground">© {new Date().getFullYear()} Sofya Dijital Sigorta</p>
      </div>
    </main>
  );
}
