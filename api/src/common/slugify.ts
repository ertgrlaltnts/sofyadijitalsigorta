const TR_MAP: Record<string, string> = { ç: 'c', ğ: 'g', ı: 'i', ö: 'o', ş: 's', ü: 'u' };

export function slugify(text: string): string {
  return text
    .toLocaleLowerCase('tr-TR')
    .replace(/[çğıöşü]/g, (char) => TR_MAP[char] ?? char)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
