import type { IoPriceCard } from './io-api.client.js';

type Json = Record<string, any>;

export interface CardDetails {
  holder: string;
  number: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  /** ID number of the card holder (the insurer's payment form asks for it). */
  holderTckn: string;
}

/**
 * The `/api/teklif/satinal` request, built as the IO documentation describes: the offer's own price card supplies
 * company, agency, quote number, premium and instalment, so none of them is taken from the browser.
 */
export function buildPurchaseRequest(input: {
  ioQuoteId: number;
  bransNo: number;
  channel: number;
  card: IoPriceCard;
  details: CardDetails;
  withThreeDSecure: boolean;
}): Json {
  const { card, details } = input;
  const police: Json = {
    Id: card.Id,
    SirketKodu: card.SirketKodu,
    AcenteKodu: card.AcenteKodu ?? '',
    TeklifNo: card.TeklifNo ?? '',
    isWebServis: card.isWebServis ?? false,
    SanalPos: card.SanalPos ?? false,
    SatinAl: true,
    Prim: card.Prim,
    Taksit: card.Taksit ?? '',
    TaksitKodu: card.TaksitKodu || '1',
    KartSahibi: details.holder,
    KimlikNo: details.holderTckn,
    KartNo: details.number,
    SonKullanimAy: details.expiryMonth,
    SonKullanimYil: details.expiryYear,
    Cvv2: details.cvv,
    KartTuru: '',
  };
  if (input.withThreeDSecure) police.Guvenlik3D = { Aktif: true, Onay: false };

  return {
    PerID: 0,
    TeklifId: input.ioQuoteId,
    BransNo: input.bransNo,
    Kanal: input.channel,
    TeklifDetay: {
      Id: card.Id,
      SirketKodu: card.SirketKodu,
      SirketAdi: card.SirketAdi,
      AcenteKodu: card.AcenteKodu ?? '',
    },
    Police: police,
  };
}

export type PurchaseOutcome =
  | { kind: 'issued'; policeNo: string }
  | { kind: 'threeds'; url: string; value: string }
  | { kind: 'declined'; message: string; callCenter: boolean };

const GENERIC_DECLINE =
  'Ödeme tamamlanamadı. Kart bilgilerinizi kontrol edip tekrar deneyin.';

const isHttps = (value: string) => {
  try {
    return new URL(value).protocol === 'https:';
  } catch {
    return false;
  }
};

/** The 3D Secure block can sit at `Police.Guvenlik3D` or deeper; this finds the first object with a `Url` and a `Value`. */
export function findThreeDSecure(
  node: unknown,
  depth = 0,
): { url: string; value: string } | null {
  if (!node || typeof node !== 'object' || depth > 8) return null;
  const item = node as Json;
  if (
    typeof item.Url === 'string' &&
    item.Url &&
    typeof item.Value === 'string' &&
    item.Value
  ) {
    return { url: item.Url, value: item.Value };
  }
  for (const child of Object.values(item)) {
    const found = findThreeDSecure(child, depth + 1);
    if (found) return found;
  }
  return null;
}

/** Reads the answer to `/api/teklif/satinal`: policy issued, 3D Secure needed, or refused. */
export function interpretPurchase(body: Json): PurchaseOutcome {
  if (body.PoliceKesildi === true) {
    const policeNo = String(
      body.PoliceNo ?? body.Police?.PoliceNo ?? '',
    ).trim();
    return { kind: 'issued', policeNo };
  }

  const threeDSecure = findThreeDSecure(body.Police ?? body);
  if (threeDSecure && isHttps(threeDSecure.url))
    return { kind: 'threeds', ...threeDSecure };

  const failure = body.Hata as
    { HataKodu?: number; Mesaj?: string; HataMesaji?: string } | undefined;
  const message = (failure?.Mesaj || failure?.HataMesaji || '').trim();
  return {
    kind: 'declined',
    message: message || GENERIC_DECLINE,
    callCenter: Number(failure?.HataKodu) === 32,
  };
}

export type ThreeDSecureState =
  | { state: 'waiting' }
  | { state: 'approved' }
  | { state: 'issued'; policeNo: string }
  | { state: 'failed'; message: string; callCenter: boolean };

const lower = (value: string) => value.toLocaleLowerCase('tr');
const isApproved = (node: unknown, depth = 0): boolean => {
  if (!node || typeof node !== 'object' || depth > 8) return false;
  const item = node as Json;
  if (item.Guvenlik3D?.Onay === true) return true;
  return Object.values(item).some((child) => isApproved(child, depth + 1));
};

/** Reads the answer to `/api/3d/kontrol`: still waiting for the bank, approved (purchase must be repeated), or failed. */
export function interpretThreeDSecure(body: Json): ThreeDSecureState {
  const data = (body.Data ?? body) as Json;
  const failure = (data?.Hata ?? body.Hata) as
    { HataKodu?: number; Mesaj?: string } | undefined;
  const code = Number(failure?.HataKodu ?? 0);
  const topMessage = typeof body.Message === 'string' ? body.Message : '';
  const message = (failure?.Mesaj || topMessage).trim();
  const status = Number(
    body.Statuscode ?? body.StatusCode ?? body.__status ?? 0,
  );

  if (data?.PoliceKesildi)
    return {
      state: 'issued',
      policeNo: String(data.PoliceNo ?? data.Police?.PoliceNo ?? '').trim(),
    };
  if (
    code === 200 ||
    lower(message).includes('onay alınmıştır') ||
    isApproved(data)
  )
    return { state: 'approved' };
  if (lower(message).includes('devam ediyor')) return { state: 'waiting' };
  if (status === 400 || code > 0)
    return {
      state: 'failed',
      message: message || GENERIC_DECLINE,
      callCenter: code === 32,
    };
  if (status === 200) return { state: 'waiting' };
  if (message) return { state: 'failed', message, callCenter: false };
  return { state: 'waiting' };
}
