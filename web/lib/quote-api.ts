import { API_URL } from "./chat-api";
import type { LiveQuoteKey } from "./quote-products";

export interface Offer {
  id: number;
  companyCode: string;
  company: string;
  premium: number;
  currency: string;
  installment: string;
  coverages: { name: string; value: string }[];
}

export interface QuoteResults {
  status: "running" | "done";
  product: LiveQuoteKey;
  offers: Offer[];
  progress: { completed: number; total: number };
}

/** Vehicle details the insurers' lookup could not fill in, or that a car without a plate always needs. */
export interface ManualVehicle {
  usageType: string;
  usageStyle: string;
  vehicleCode: string;
  engineNo: string;
  chassisNo: string;
  seats: string;
  fuelType?: string;
}

export interface QuoteRequest {
  product: LiveQuoteKey;
  tckn: string;
  birthDate: string;
  phone: string;
  consent: boolean;
  health?: {
    height: number;
    weight: number;
    cover: "inpatient" | "outpatient";
    visits?: 1 | 2 | 3;
    network: 0 | 1 | 2;
    birthCover: boolean;
    payment: "P" | "3" | "6" | "9";
    transfer?: { companyCode: string; agencyNo: string; policyNo: string; endDate: string };
  };
  accident?: { coverage: string; earthquake: boolean; assistance: boolean; treatment: boolean; payment: "P" | "V" };
  vehicle?: {
    noPlate: boolean;
    plate?: string;
    registrationSeries?: string;
    registrationNo?: string;
    cityCode?: string;
    modelYear?: string;
    payment: "P" | "V" | "3" | "6" | "9";
    manual?: ManualVehicle;
  };
  profession?: string;
  imm?: { limit: string; moral: string };
  dask?: {
    renewalPolicyNo?: string;
    addressCode?: string;
    holderRole?: string;
    structure?: string;
    buildYear?: string;
    totalFloors?: string;
    usage?: string;
    damage?: string;
    floor?: string;
    area?: number;
    payment: "P" | "V";
  };
  home?: {
    addressCode: string;
    holderRole: string;
    structure: string;
    buildYear: string;
    totalFloors: string;
    area: number;
    usageStyle: string;
    usageType: string;
    position: string;
    coverChoice: 0 | 1 | 2;
    buildingValue: number;
    contentsValue: number;
    glassValue: number;
    decorationValue: number;
    payment: "P" | "V";
  };
  travel?: { plan: string; scope: "A" | "T" | "Y"; destination: string; startDate: string; endDate: string; payment: "P" | "V" };
}

/** Vehicle details the lookup did find, to prefill the manual vehicle step. */
export interface SuggestedVehicle {
  vehicleCode?: string;
  usageType?: string;
  usageStyle?: string;
  brandName?: string;
  typeName?: string;
  modelYear?: string;
  engineNo?: string;
  chassisNo?: string;
  seats?: string;
  fuelType?: string;
}

/** What creating a quote answers: its id, or a request for the vehicle details the lookup could not find. */
export type CreateQuoteResponse = { id: string } | { needsVehicle: true; vehicle: SuggestedVehicle };

export interface RefItem {
  code: string;
  name: string;
  /** The address number of a flat, or the type code of a model. */
  extra?: string;
}

/** An API failure with a message that is fine to show, plus per-field messages when the API validated the form. */
export class QuoteError extends Error {
  constructor(
    message: string,
    readonly fieldErrors: Record<string, string> = {},
  ) {
    super(message);
  }
}

const NETWORK_ERROR = "Sunucuya ulaşılamadı. Bağlantınızı kontrol edip tekrar deneyin.";
const RATE_LIMIT_ERROR = "Kısa sürede çok fazla deneme yaptınız. Bir dakika bekleyip tekrar deneyin.";

async function request<T>(path: string, init: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, init);
  } catch {
    throw new QuoteError(NETWORK_ERROR);
  }
  if (response.status === 429) throw new QuoteError(RATE_LIMIT_ERROR);
  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { message?: string; fieldErrors?: Record<string, string> } | null;
    throw new QuoteError(body?.message ?? "Bir sorun oluştu. Lütfen tekrar deneyin.", body?.fieldErrors);
  }
  return (await response.json()) as T;
}

export function createQuote(body: QuoteRequest, signal?: AbortSignal): Promise<CreateQuoteResponse> {
  return request("/quotes", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(body),
    signal,
  });
}

/**
 * Card details may only be typed on a secure page that talks to a secure API: https everywhere, with localhost allowed for
 * development. Anything else (for example the dev server opened by its network address over http) falls back to WhatsApp.
 */
export const isSafeForCards = (): boolean =>
  typeof window !== "undefined" && window.isSecureContext && (API_URL.startsWith("https://") || /^http:\/\/(localhost|127\.0\.0\.1)(:|\/|$)/.test(API_URL));

export interface PaymentConfig {
  enabled: boolean;
  /** Whether the bank's 3D Secure window must be opened (so the browser has to open it on the click). */
  threeDSecure: boolean;
}

export interface PurchaseRequest {
  offerId: number;
  cardHolder: string;
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  holderTckn: string;
  consent: boolean;
  threeDSecureApproved?: boolean;
}

export type PurchaseResult =
  | { status: "issued"; policeNo: string }
  | { status: "threeds"; url: string; value: string }
  | { status: "declined"; message: string; callCenter: boolean }
  | { status: "unknown"; message: string };

export type ThreeDSecureState =
  | { state: "waiting" }
  | { state: "approved" }
  | { state: "issued"; policeNo: string }
  | { state: "failed"; message: string; callCenter: boolean };

export function fetchPaymentConfig(signal?: AbortSignal): Promise<PaymentConfig> {
  return request("/quotes/payment-config", { headers: { Accept: "application/json" }, signal });
}

/** Card details go to our API over HTTPS and nowhere else; they are not kept in storage on either side. */
export function purchaseOffer(quoteId: string, body: PurchaseRequest, signal?: AbortSignal): Promise<PurchaseResult> {
  return request(`/quotes/${encodeURIComponent(quoteId)}/purchase`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
    signal,
  });
}

export function fetchPurchaseStatus(quoteId: string, signal?: AbortSignal): Promise<ThreeDSecureState> {
  return request(`/quotes/${encodeURIComponent(quoteId)}/purchase/status`, { headers: { Accept: "application/json" }, cache: "no-store", signal });
}

export function fetchDocumentUrl(quoteId: string, kind: "policy" | "receipt"): Promise<{ url: string }> {
  return request(`/quotes/${encodeURIComponent(quoteId)}/documents/${kind}`, { headers: { Accept: "application/json" }, cache: "no-store" });
}

/** A reference list (provinces, countries, brands, models, occupations, vehicle usage, address steps). */
export function fetchRef(kind: string, params: Record<string, string> = {}, signal?: AbortSignal): Promise<RefItem[]> {
  const query = new URLSearchParams(params).toString();
  return request(`/quotes/ref/${kind}${query ? `?${query}` : ""}`, { headers: { Accept: "application/json" }, signal });
}

/** Insurers a policy can be transferred from. */
export function fetchTransferCompanies(signal?: AbortSignal): Promise<{ code: string; name: string }[]> {
  return request("/quotes/companies", { headers: { Accept: "application/json" }, signal });
}

export function fetchQuoteResults(id: string, signal?: AbortSignal): Promise<QuoteResults> {
  return request(`/quotes/${encodeURIComponent(id)}`, { headers: { Accept: "application/json" }, signal });
}

/** Logo file (in public/partners) of an insurer, by the code the quote API uses. Insurers without a logo get initials. */
const LOGOS: Record<string, string> = {
  "004": "aksigorta",
  "005": "gig-sigorta",
  "007": "anadolu-sigorta",
  "017": "unico-sigorta",
  "040": "axasigorta",
  "045": "allianzsigorta",
  "054": "hdisigorta",
  "093": "neovasigorta",
  "104": "doga-sigorta",
  "110": "quicksigorta",
  "115": "anasigorta",
  "126": "hepiyisigorta",
  "127": "emaa-sigorta",
};

export const logoOf = (companyCode: string): string | undefined => (LOGOS[companyCode] ? `/partners/${LOGOS[companyCode]}.png` : undefined);

const SYMBOLS: Record<string, string> = { TL: "₺", TRY: "₺", TRL: "₺", "₺": "₺", EUR: "€", USD: "$", GBP: "£" };

/** The API is not consistent about the lira ("TL", "TRY", "TRL"); show those as ₺, and the common foreign currencies by symbol. */
export const currencySymbol = (currency = "TL"): string => SYMBOLS[currency.trim().toUpperCase()] ?? currency.trim();

export const formatAmount = (amount: number): string => new Intl.NumberFormat("tr-TR", { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(amount);

export const formatPremium = (amount: number, currency = "TL"): string => `${formatAmount(amount)} ${currencySymbol(currency)}`;
