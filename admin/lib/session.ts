export const SESSION_COOKIE = "sofya_token";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

export function apiUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";
}
