import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { apiUrl, SESSION_COOKIE } from "@/lib/session";

const ALLOWED = /^(admin\/|auth\/me$)/;
const FORWARDED_REQUEST_HEADERS = ["content-type", "accept"];
const FORWARDED_RESPONSE_HEADERS = ["content-type", "cache-control"];

async function forward(request: NextRequest, ctx: RouteContext<"/api/proxy/[...path]">) {
  const { path } = await ctx.params;
  const target = path.join("/");
  if (!ALLOWED.test(target)) return NextResponse.json({ message: "Bulunamadı." }, { status: 404 });

  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return NextResponse.json({ message: "Oturum bulunamadı." }, { status: 401 });

  const headers = new Headers({ Authorization: `Bearer ${token}` });
  for (const name of FORWARDED_REQUEST_HEADERS) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }

  const hasBody = request.method !== "GET" && request.method !== "HEAD";
  let upstream: Response;
  try {
    upstream = await fetch(`${apiUrl()}/${target}${request.nextUrl.search}`, {
      method: request.method,
      headers,
      body: hasBody ? request.body : undefined,
      duplex: "half",
      cache: "no-store",
      signal: request.signal,
    } as RequestInit);
  } catch {
    return NextResponse.json({ message: "Sunucuya ulaşılamıyor." }, { status: 502 });
  }

  const responseHeaders = new Headers();
  for (const name of FORWARDED_RESPONSE_HEADERS) {
    const value = upstream.headers.get(name);
    if (value) responseHeaders.set(name, value);
  }
  responseHeaders.set("X-Accel-Buffering", "no");

  const response = new NextResponse(upstream.body, { status: upstream.status, headers: responseHeaders });
  if (upstream.status === 401) response.cookies.delete(SESSION_COOKIE);
  return response;
}

export {
  forward as GET,
  forward as POST,
  forward as PATCH,
  forward as PUT,
  forward as DELETE,
};
