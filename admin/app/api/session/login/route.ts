import { NextResponse } from "next/server";
import { apiUrl, SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/session";

interface LoginResponse {
  accessToken: string;
  user: { id: string; email: string; name: string };
}

export async function POST(request: Request) {
  const credentials: unknown = await request.json().catch(() => null);

  let upstream: Response;
  try {
    upstream = await fetch(`${apiUrl()}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
      cache: "no-store",
    });
  } catch {
    return NextResponse.json({ message: "Sunucuya ulaşılamıyor. Lütfen daha sonra tekrar deneyin." }, { status: 502 });
  }

  if (!upstream.ok) {
    return NextResponse.json(await upstream.json().catch(() => ({ message: "Giriş yapılamadı." })), {
      status: upstream.status,
    });
  }

  const { accessToken, user } = (await upstream.json()) as LoginResponse;
  const response = NextResponse.json({ user });
  response.cookies.set(SESSION_COOKIE, accessToken, {
    httpOnly: true,
    sameSite: "lax",
    // Behind nginx the app itself sees plain http; the proxy says what the visitor used.
    secure: (request.headers.get("x-forwarded-proto") ?? new URL(request.url).protocol.replace(":", "")) === "https",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  return response;
}
