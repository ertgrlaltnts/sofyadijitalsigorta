import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Env } from '../config/env.js';

/** A failure reported by the IO quote API, or while reaching it. `message` is safe to log, never to show users. */
export class IoApiError extends Error {
  constructor(
    message: string,
    readonly kind: 'identity' | 'upstream' = 'upstream',
  ) {
    super(message);
  }
}

type Json = Record<string, any>;

export interface IoPriceCard {
  Id: number;
  SirketKodu: string;
  SirketAdi: string;
  Prim: number;
  Doviz?: string;
  Taksit?: string;
  TaksitKodu?: string;
  TeklifNo?: string;
  AcenteKodu?: string;
  isWebServis?: boolean;
  SanalPos?: boolean;
  SatinAl?: boolean;
  Hata?: string;
  Teminat?: {
    Adi: string;
    Deger?: string;
    Aciklama?: string;
    Aktif?: boolean;
    Kodu?: string;
  }[];
}

/** What `lenient` calls return: the body plus the HTTP status, because payment answers are read even when they are 4xx. */
export type IoLenientBody = Json & { __status: number };

export interface IoPrices {
  TeklifCalisildi: boolean;
  SirketSayisi?: number;
  CalisilanSirketSayisi?: number;
  Sirketler?: IoPriceCard[];
}

const TIMEOUT_MS = 30_000;

/**
 * The only place that talks to the IO quote API (https://online.sofyadijitalsigorta.com). The bearer token never leaves the
 * server. Calls that are safe to repeat (identity check, price polling) are retried once on a network failure; creating a
 * quote is not, as a retry could open a second quote.
 */
@Injectable()
export class IoApiClient {
  private readonly logger = new Logger(IoApiClient.name);
  private readonly baseUrl: string;
  private readonly token: string;
  private readonly headers: Record<string, string>;
  readonly channel: number;

  constructor(config: ConfigService<Env, true>) {
    this.baseUrl = config.get('IO_API_URL', { infer: true });
    this.token = config.get('IO_API_TOKEN', { infer: true });
    this.channel = config.get('IO_CHANNEL', { infer: true });
    this.headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.token}`,
      xProgram: config.get('IO_PROGRAM', { infer: true }),
      xFirmaKodu: config.get('IO_FIRMA_KODU', { infer: true }),
    };
  }

  get enabled(): boolean {
    return this.token !== '';
  }

  /** Checks the ID number and birth date against Mernis. Returns the insured record to send with the quote. */
  async verifyIdentity(
    bransNo: number,
    person: { tckn: string; birthDate: string; phone: string },
  ): Promise<{ insured: Json; insuredStr?: string }> {
    const body = await this.send(
      'POST',
      '/api/sorgu/mernis',
      {
        Kanal: this.channel,
        BransNo: bransNo,
        Sigortali: {
          KimlikNo: person.tckn,
          DogumTarihi: person.birthDate,
          Cep: person.phone,
          KimlikTipi: '0',
        },
      },
      true,
    );
    const insured = body.Sigortali as Json | undefined;
    // A failed Mernis match comes back as 200 with an empty (masked) name.
    if (!insured?.AdUnvanYildizli)
      throw new IoApiError('Mernis eşleşmedi', 'identity');
    return {
      insured,
      insuredStr:
        typeof body.SigortaliStr === 'string' ? body.SigortaliStr : undefined,
    };
  }

  /** Insurers a policy can be transferred from. Only code and name leave this class; the API row carries credentials fields. */
  async listCompanies(): Promise<{ code: string; name: string }[]> {
    const body = await this.send(
      'GET',
      '/api/mobil/tumsirketler',
      undefined,
      true,
    );
    const rows = Array.isArray(body.Data) ? (body.Data as Json[]) : [];
    const seen = new Map<string, string>();
    for (const row of rows) {
      const code = String(row.SirketKodu ?? '').trim();
      const name = String(row.SirketAdi ?? '').trim();
      if (code && name && !seen.has(code)) seen.set(code, name);
    }
    return [...seen]
      .map(([code, name]) => ({ code, name }))
      .sort((a, b) => a.name.localeCompare(b.name, 'tr'));
  }

  /**
   * Opens a quote. Never retried (a retry could open a second quote). The answer is returned as it came, because "vehicle not
   * found" (HataKodu 14/17) is a normal outcome that asks the customer for more details.
   */
  createQuote(request: Json): Promise<IoLenientBody> {
    return this.sendLenient('POST', '/api/teklif', request);
  }

  /** A reference list (provinces, countries, occupations, address steps...): GET, or POST when a body is given. */
  async list(path: string, payload?: Json): Promise<Json[]> {
    const body = await this.send(payload ? 'POST' : 'GET', path, payload, true);
    if (Array.isArray(body)) return body as Json[];
    return Array.isArray(body.Data) ? (body.Data as Json[]) : [];
  }

  async fetchPrices(bransNo: number, quoteId: number): Promise<IoPrices> {
    const body = await this.send(
      'POST',
      '/api/teklif/primler',
      { BransNo: bransNo, TeklifId: quoteId, Sirketler: [] },
      true,
    );
    return body as IoPrices;
  }

  /** Whether the account requires 3D Secure on card payments (profile `Yetki.Guvenlik3D`). */
  async requiresThreeDSecure(): Promise<boolean> {
    const body = await this.send('GET', '/api/uye/profil', undefined, true);
    return body.Yetki?.Guvenlik3D === true;
  }

  /**
   * Sends the purchase. Never retried: a repeated call could charge the card twice. Business refusals (declined card, insurer
   * error) come back in the body, so the body is returned instead of thrown.
   */
  purchase(request: Json): Promise<IoLenientBody> {
    return this.sendLenient('POST', '/api/teklif/satinal', request);
  }

  /** Asks whether the customer finished the bank's 3D Secure step for this policy (offer) id. */
  checkThreeDSecure(policeId: number): Promise<IoLenientBody> {
    return this.sendLenient(
      'POST',
      `/api/3d/kontrol?Id=${encodeURIComponent(String(policeId))}&Kapat=false`,
    );
  }

  /** Print URL of an issued policy (`t`) or receipt (`m`). */
  async documentUrl(offerId: number, type: 't' | 'm'): Promise<string | null> {
    const body = await this.send(
      'GET',
      `/api/yazdir?id=${encodeURIComponent(String(offerId))}&tipi=${type}`,
      undefined,
      true,
    );
    const url = [body.Url, body.pdf, body.Pdf, body.downloadUrl].find(
      (value) => typeof value === 'string' && value.length > 0,
    );
    return typeof url === 'string' ? url : null;
  }

  private async sendLenient(
    method: 'GET' | 'POST',
    path: string,
    payload?: Json,
  ): Promise<IoLenientBody> {
    let response: Response;
    try {
      response = await fetch(`${this.baseUrl}${path}`, {
        method,
        headers: this.headers,
        ...(payload ? { body: JSON.stringify(payload) } : {}),
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
    } catch (error) {
      // The request may or may not have reached the insurer; callers must treat the outcome as unknown.
      throw new IoApiError(
        `${path.split('?')[0]} ulaşılamadı: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
    if (response.status === 401 || response.status === 403) {
      this.logger.error(
        `IO API ${path.split('?')[0]} ${response.status} döndü: token geçersiz ya da süresi dolmuş.`,
      );
    }
    const body = (await response.json().catch(() => null)) as Json | null;
    return {
      ...(body && typeof body === 'object' ? body : {}),
      __status: response.status,
    };
  }

  private async send(
    method: 'GET' | 'POST',
    path: string,
    payload: Json | undefined,
    retry: boolean,
  ): Promise<Json> {
    for (let attempt = 0; ; attempt++) {
      let response: Response;
      try {
        response = await fetch(`${this.baseUrl}${path}`, {
          method,
          headers: this.headers,
          ...(payload ? { body: JSON.stringify(payload) } : {}),
          signal: AbortSignal.timeout(TIMEOUT_MS),
        });
      } catch (error) {
        if (retry && attempt === 0) continue;
        throw new IoApiError(
          `${path} ulaşılamadı: ${error instanceof Error ? error.message : String(error)}`,
        );
      }

      if (response.status === 401 || response.status === 403) {
        this.logger.error(
          `IO API ${path} ${response.status} döndü: token geçersiz ya da süresi dolmuş, IP kaydı eksik olabilir.`,
        );
      }
      if (!response.ok) throw new IoApiError(`${path} HTTP ${response.status}`);

      const body = (await response.json().catch(() => null)) as Json | null;
      if (!body || typeof body !== 'object')
        throw new IoApiError(`${path} geçersiz yanıt`);
      const failure = body.Hata as
        { HataKodu?: number; HataMesaji?: string } | undefined;
      if (failure && Number(failure.HataKodu) > 0)
        throw new IoApiError(
          `${path} ${failure.HataKodu}: ${failure.HataMesaji ?? ''}`,
        );
      if (body.isSuccess === false)
        throw new IoApiError(`${path}: ${String(body.Message ?? 'başarısız')}`);
      return body;
    }
  }
}
