const dateTime = new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium", timeStyle: "short" });
const date = new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium" });
const relative = new Intl.RelativeTimeFormat("tr-TR", { numeric: "auto" });
const number = new Intl.NumberFormat("tr-TR");

export const formatDateTime = (value: string | Date): string => dateTime.format(new Date(value));
export const formatDate = (value: string | Date): string => date.format(new Date(value));
export const formatNumber = (value: number): string => number.format(value);
export const formatPercent = (value: number): string => `%${number.format(Math.round(value))}`;

const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["day", 86_400],
  ["hour", 3_600],
  ["minute", 60],
];

export function formatRelative(value: string | Date): string {
  const seconds = Math.round((new Date(value).getTime() - Date.now()) / 1000);
  for (const [unit, size] of UNITS) {
    if (Math.abs(seconds) >= size) return relative.format(Math.round(seconds / size), unit);
  }
  return "az önce";
}
