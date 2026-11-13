const IBAN = /\bTR\d{2}(?:\s?\d{4}){5}\s?\d{2}\b/gi;
const CARD = /(?<!\d)\d(?:[ -]?\d){12,18}(?!\d)/g;
const TCKN = /(?<!\d)[1-9]\d{10}(?!\d)/g;
const PHONE =
  /(?<!\d)(?:(?:\+?90|0)[\s.-]?)?(?:\(?5\d{2}\)?[\s.-]?\d{3}[\s.-]?\d{2}[\s.-]?\d{2}|\(?[234]\d{2}\)?[\s.-]?\d{3}[\s.-]?\d{2}[\s.-]?\d{2})(?!\d)/g;

export function passesLuhn(digits: string): boolean {
  let sum = 0;
  let double = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let value = Number(digits[i]);
    if (double) {
      value *= 2;
      if (value > 9) value -= 9;
    }
    sum += value;
    double = !double;
  }
  return sum % 10 === 0;
}

export function isValidTckn(value: string): boolean {
  const d = Array.from(value, Number);
  const odd = d[0] + d[2] + d[4] + d[6] + d[8];
  const even = d[1] + d[3] + d[5] + d[7];
  const tenth = (((odd * 7 - even) % 10) + 10) % 10;
  const eleventh = d.slice(0, 10).reduce((a, b) => a + b, 0) % 10;
  return d[9] === tenth && d[10] === eleventh;
}

export function maskSensitive(text: string): string {
  return text
    .replace(IBAN, '[IBAN]')
    .replace(CARD, (match) => (passesLuhn(match.replace(/\D/g, '')) ? '[KART NO]' : match))
    .replace(TCKN, (match) => (isValidTckn(match) ? '[TC KİMLİK NO]' : match))
    .replace(PHONE, '[TELEFON]');
}
