const PROXY_BASE = "/api/proxy";

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly fieldErrors: Record<string, string> = {},
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface ErrorBody {
  message?: string;
  fieldErrors?: Record<string, string>;
}

type Query = Record<string, string | number | boolean | undefined | null>;

interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  query?: Query;
  signal?: AbortSignal;
}

function buildUrl(path: string, query?: Query): string {
  const url = `${PROXY_BASE}/${path.replace(/^\//, "")}`;
  if (!query) return url;
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== null && value !== "") params.set(key, String(value));
  }
  const search = params.toString();
  return search ? `${url}?${search}` : url;
}

function handleUnauthorized(): never {
  if (typeof window !== "undefined" && !window.location.pathname.startsWith("/giris")) {
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination -- sert yönlendirme oturum durumunu temizler
    window.location.href = `/giris?next=${encodeURIComponent(window.location.pathname)}`;
  }
  throw new ApiError(401, "Oturumunuz sona erdi. Lütfen tekrar giriş yapın.");
}

async function toApiError(response: Response): Promise<ApiError> {
  const body = (await response.json().catch(() => ({}))) as ErrorBody;
  return new ApiError(response.status, body.message ?? "Beklenmeyen bir hata oluştu.", body.fieldErrors);
}

export async function api<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, query, signal } = options;
  const isForm = body instanceof FormData;
  const response = await fetch(buildUrl(path, query), {
    method,
    signal,
    headers: body !== undefined && !isForm ? { "Content-Type": "application/json" } : undefined,
    body: body === undefined ? undefined : isForm ? body : JSON.stringify(body),
  });

  if (response.status === 401) handleUnauthorized();
  if (!response.ok) throw await toApiError(response);
  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

export interface SseMessage {
  event: string;
  data: string;
}

export async function streamPost(
  path: string,
  body: unknown,
  onMessage: (message: SseMessage) => void,
  signal?: AbortSignal,
): Promise<void> {
  const response = await fetch(buildUrl(path), {
    method: "POST",
    signal,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (response.status === 401) handleUnauthorized();
  if (!response.ok || !response.body) throw await toApiError(response);

  const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
  let buffer = "";
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += value;
    const frames = buffer.split("\n\n");
    buffer = frames.pop() ?? "";
    for (const frame of frames) {
      const event = /^event: (.*)$/m.exec(frame)?.[1];
      const data = /^data: (.*)$/m.exec(frame)?.[1];
      if (event && data) onMessage({ event, data });
    }
  }
}
