/** Client-side checks for the live quote form. The API repeats them; these only give instant feedback. */

export const MIN_AGE = 18;
export const MAX_AGE = 75;

export function isValidTckn(value: string): boolean {
  if (!/^[1-9]\d{10}$/.test(value)) return false;
  const d = Array.from(value, Number);
  const odd = d[0] + d[2] + d[4] + d[6] + d[8];
  const even = d[1] + d[3] + d[5] + d[7];
  const tenth = (((odd * 7 - even) % 10) + 10) % 10;
  const eleventh = d.slice(0, 10).reduce((sum, digit) => sum + digit, 0) % 10;
  return d[9] === tenth && d[10] === eleventh;
}

/** "5551112233", "0555 111 22 33" and "+90 555 ..." all become the ten digits the API expects. */
export function normalizePhone(value: string): string {
  return value.replace(/\D/g, "").replace(/^(90|0)(?=5)/, "");
}

/** Turns typed digits into "GG.AA.YYYY" as the user types. */
export function maskDate(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  return [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4)].filter(Boolean).join(".");
}

/** "04.08.1999" to "1999-08-04", or null when it is not a real calendar date. */
export function toIsoDate(value: string): string | null {
  const match = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(value);
  if (!match) return null;
  const [, day, month, year] = match;
  const date = new Date(`${year}-${month}-${day}T00:00:00Z`);
  const iso = `${year}-${month}-${day}`;
  return Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== iso ? null : iso;
}

export function ageOf(isoDate: string, today = new Date()): number {
  const [year, month, day] = isoDate.split("-").map(Number);
  let age = today.getFullYear() - year;
  if (today.getMonth() + 1 < month || (today.getMonth() + 1 === month && today.getDate() < day)) age -= 1;
  return age;
}

/** Luhn checksum, as card numbers use. */
export function isValidCardNumber(value: string): boolean {
  const number = value.replace(/\D/g, "");
  if (!/^\d{13,19}$/.test(number)) return false;
  let sum = 0;
  let double = false;
  for (let i = number.length - 1; i >= 0; i--) {
    let digit = Number(number[i]);
    if (double) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    double = !double;
  }
  return sum % 10 === 0;
}

/** "4111111111111111" to "4111 1111 1111 1111" while typing. */
export function maskCardNumber(value: string): string {
  return (value.replace(/\D/g, "").slice(0, 19).match(/.{1,4}/g) ?? []).join(" ");
}

/** "1228" to "12/28" while typing. */
export function maskExpiry(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
}

/** "12/28" to { month: "12", year: "2028" }, or null when it is malformed or already past. */
export function parseExpiry(value: string, today = new Date()): { month: string; year: string } | null {
  const match = /^(0[1-9]|1[0-2])\/(\d{2})$/.exec(value);
  if (!match) return null;
  const year = 2000 + Number(match[2]);
  const month = Number(match[1]);
  if (year < today.getFullYear() || (year === today.getFullYear() && month < today.getMonth() + 1)) return null;
  return { month: match[1], year: String(year) };
}
