import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { IoApiClient } from './io-api.client.js';

export interface RefItem {
  code: string;
  name: string;
  /** Extra value some lists carry: the address number of a flat, the type code of a model. */
  extra?: string;
}

export const REFERENCE_KINDS = [
  'provinces',
  'countries',
  'brands',
  'models',
  'professions',
  'usage-types',
  'usage-styles',
  'address',
] as const;
export type ReferenceKind = (typeof REFERENCE_KINDS)[number];

export const ADDRESS_STEPS = [
  'Ilce',
  'Semt',
  'Mahalle',
  'Cadde',
  'Bina',
  'Daire',
] as const;
export type AddressStep = (typeof ADDRESS_STEPS)[number];

export interface ReferenceParams {
  scope?: string;
  brand?: string;
  year?: string;
  usageType?: string;
  step?: string;
  value?: string;
}

const CP1252: Record<string, number> = {
  '€': 0x80,
  '‚': 0x82,
  ƒ: 0x83,
  '„': 0x84,
  '…': 0x85,
  '†': 0x86,
  '‡': 0x87,
  ˆ: 0x88,
  '‰': 0x89,
  Š: 0x8a,
  '‹': 0x8b,
  Œ: 0x8c,
  Ž: 0x8e,
  '‘': 0x91,
  '’': 0x92,
  '“': 0x93,
  '”': 0x94,
  '•': 0x95,
  '–': 0x96,
  '—': 0x97,
  '˜': 0x98,
  '™': 0x99,
  š: 0x9a,
  '›': 0x9b,
  œ: 0x9c,
  ž: 0x9e,
  Ÿ: 0x9f,
};

/** Some old model names come double encoded ("SERÃ‡E" for "SERÇE"). Re-reads them as UTF-8; anything else is left alone. */
export function fixMojibake(text: string): string {
  if (!/[ÃÂÄÅ]/.test(text)) return text;
  const bytes: number[] = [];
  for (const char of text) {
    const code = char.codePointAt(0) ?? 0;
    if (code < 0x100) bytes.push(code);
    else if (CP1252[char] !== undefined) bytes.push(CP1252[char]);
    else return text;
  }
  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(
      Uint8Array.from(bytes),
    );
  } catch {
    return text;
  }
}

/** Checks the query of a `ref` request; anything unexpected is rejected before it can reach the IO API. */
export function parseReferenceQuery(
  kind: ReferenceKind,
  query: Record<string, unknown>,
): ReferenceParams {
  const pick = (
    name: string,
    pattern: RegExp,
    required: boolean,
  ): string | undefined => {
    const value =
      typeof query[name] === 'string' ? (query[name] as string) : '';
    if (!value && !required) return undefined;
    if (!pattern.test(value))
      throw new BadRequestException(`Geçersiz parametre: ${name}`);
    return value;
  };
  switch (kind) {
    case 'countries':
      return { scope: pick('scope', /^[AT]$/, false) };
    case 'models':
      return {
        brand: pick('brand', /^\d{1,4}$/, true),
        year: pick('year', /^\d{4}$/, false),
      };
    case 'usage-styles':
      return { usageType: pick('kt', /^\d{2}$/, true) };
    case 'address': {
      const step = pick('step', /^[A-Za-z]{3,8}$/, true);
      if (!(ADDRESS_STEPS as readonly string[]).includes(step ?? ''))
        throw new BadRequestException('Geçersiz parametre: step');
      return { step, value: pick('value', /^\d{1,12}$/, true) };
    }
    default:
      return {};
  }
}

/** The source lists a code under two names now and then (FORD and FORD/OTOSAN are both 053); a code picks the item, so keep the first. */
export function uniqueByCode(items: RefItem[]): RefItem[] {
  const seen = new Set<string>();
  return items.filter((item) =>
    seen.has(item.code) ? false : (seen.add(item.code), true),
  );
}

const HOUR_MS = 60 * 60 * 1000;
const MAX_CACHED = 500;
const text = (value: unknown): string =>
  typeof value === 'string' || typeof value === 'number'
    ? String(value).trim()
    : '';
const byName = (a: RefItem, b: RefItem) => a.name.localeCompare(b.name, 'tr');

/**
 * Reference lists the quote forms need (provinces, countries, brands, models, occupations, the address steps), read from the IO
 * API and cached. The browser never talks to the IO API; it asks for these through the public `ref` endpoint.
 */
@Injectable()
export class ReferenceService {
  private readonly logger = new Logger(ReferenceService.name);
  private readonly cache = new Map<
    string,
    { loadedAt: number; items: RefItem[] }
  >();

  constructor(private readonly io: IoApiClient) {}

  async get(kind: ReferenceKind, params: ReferenceParams): Promise<RefItem[]> {
    if (!this.io.enabled)
      throw new ServiceUnavailableException(
        'Online teklif şu an kullanılamıyor. Lütfen daha sonra tekrar deneyin.',
      );

    const key = `${kind}|${params.scope ?? ''}|${params.brand ?? ''}|${params.year ?? ''}|${params.usageType ?? ''}|${params.step ?? ''}|${params.value ?? ''}`;
    const hit = this.cache.get(key);
    if (hit && Date.now() - hit.loadedAt < HOUR_MS) return hit.items;

    let items: RefItem[];
    try {
      items = uniqueByCode(await this.load(kind, params));
    } catch (error) {
      this.logger.warn(
        `Liste alınamadı (${kind}): ${error instanceof Error ? error.message : String(error)}`,
      );
      throw new BadGatewayException(
        'Liste şu an alınamıyor. Lütfen birkaç dakika sonra tekrar deneyin.',
      );
    }
    // An empty list is not remembered: the insurer sometimes answers empty by mistake.
    if (items.length > 0) {
      if (this.cache.size >= MAX_CACHED)
        this.cache.delete(this.cache.keys().next().value as string);
      this.cache.set(key, { loadedAt: Date.now(), items });
    }
    return items;
  }

  private async load(
    kind: ReferenceKind,
    params: ReferenceParams,
  ): Promise<RefItem[]> {
    switch (kind) {
      case 'provinces':
        return (await this.io.list('/api/iller'))
          .map((row) => ({ code: text(row.IlKodu), name: text(row.IlAdi) }))
          .sort(byName);
      case 'countries': {
        const rows = await this.io.list('/api/ulkeler');
        // "A" lists the Schengen countries only; "T" (worldwide) covers all of them.
        const wanted =
          params.scope === 'A'
            ? rows.filter((row) => row.Kapsam === 'A')
            : rows;
        return wanted
          .map((row) => ({ code: text(row.UlkeKodu), name: text(row.UlkeAdi) }))
          .sort(byName);
      }
      case 'brands':
        return (await this.io.list('/api/bb', { st: 1 }))
          .map((row) => ({
            code: text(row.MarkaKodu),
            name: fixMojibake(text(row.MarkaAdi)),
          }))
          .sort(byName);
      case 'models':
        return (
          await this.io.list(
            `/api/teklif/markatip?markakodu=${params.brand}&modelyili=${params.year ?? ''}`,
          )
        )
          .map((row) => ({
            code: text(row.AracKodu),
            name: fixMojibake(text(row.TipAdi)),
            extra: text(row.TipKodu),
          }))
          .sort(byName);
      case 'professions':
        return (await this.io.list('/api/teklif/meslek'))
          .map((row) => ({ code: text(row.Kodu), name: text(row.Adi) }))
          .sort(byName);
      case 'usage-types':
        return (await this.io.list('/api/teklif/kt')).map((row) => ({
          code: text(row.Kodu),
          name: text(row.Adi),
        }));
      case 'usage-styles':
        return (
          await this.io.list(`/api/teklif/ks?kt=${params.usageType}`)
        ).map((row) => ({ code: text(row.Kodu), name: text(row.Adi) }));
      case 'address':
        return (
          await this.io.list(
            `/api/sorgu/adreskodu?st=${params.step}&deger=${params.value}`,
          )
        ).map((row) => this.addressItem(params.step as AddressStep, row));
    }
  }

  /** One row of the UAVT address chain, with a label a person can read. A flat's `AdresNo` is the 10-digit address code. */
  private addressItem(step: AddressStep, row: Record<string, any>): RefItem {
    const code = text(row.Kod);
    if (step === 'Cadde')
      return {
        code,
        name: [text(row.Adi), text(row.TipAciklama)].filter(Boolean).join(' '),
      };
    if (step === 'Bina') {
      const label = [
        text(row.BlokAdi),
        text(row.SiteAdi),
        row.DisKapiNo ? `No: ${text(row.DisKapiNo)}` : '',
      ]
        .filter(Boolean)
        .join(' · ');
      return { code, name: label || `Bina ${code}` };
    }
    if (step === 'Daire')
      return {
        code,
        name: row.IcKapiNo ? `Daire ${text(row.IcKapiNo)}` : `Daire ${code}`,
        extra: text(row.AdresNo),
      };
    return { code, name: text(row.Adi) };
  }
}
