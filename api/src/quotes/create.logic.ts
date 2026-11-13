import type { IoLenientBody } from './io-api.client.js';

type Json = Record<string, any>;

/** Vehicle details the insurers' lookup did find, to prefill the manual vehicle step. */
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

export type CreateOutcome =
  | { kind: 'created'; quoteId: number }
  | { kind: 'needsVehicle'; vehicle: SuggestedVehicle }
  | { kind: 'unavailable' }
  | { kind: 'refused'; code: number; message: string };

/** The IO error codes, worded as the insurers' own site words them. */
const ERROR_MESSAGES: Record<number, string> = {
  6: 'Doğum tarihi bilgisi hatalı.',
  7: 'Tramer-EGM sorgusunda bir hata oluştu. Lütfen biraz sonra tekrar deneyin.',
  8: 'Bu bilgilerle teminat verilmemektedir.',
  14: 'Araç kodu girilmemiş, lütfen araç bilgilerini seçin.',
  15: 'Kimlik numarası hatalı.',
  17: 'Araç bilgilerinde eksiklik var, lütfen kontrol edin.',
  18: 'Kayıt bulunamadı.',
  21: 'Müşteri bilgilerinde hata var.',
  23: 'Sigortalı bilgilerinde hata var.',
  25: 'Tapu bilgilerinde eksiklik var, lütfen kontrol edin.',
  26: 'Riziko adresinde eksiklik var, lütfen kontrol edin.',
  27: 'Poliçe bulunamadı.',
  28: 'Risk bilgilerinde hata var.',
};
const VEHICLE_NOT_FOUND =
  'Bu plaka ve ruhsat bilgileriyle araç bulunamadı. Plakayı ve ruhsat seri/no bilgisini kontrol edin.';
const FALLBACK =
  'Teklif oluşturulamadı. Bilgilerinizi kontrol edip tekrar deneyin.';

const clean = (value: unknown): string | undefined => {
  const text =
    typeof value === 'string' || typeof value === 'number'
      ? String(value).trim()
      : '';
  return text ? text : undefined;
};

function suggestVehicle(vehicle: Json | undefined): SuggestedVehicle {
  if (!vehicle) return {};
  const suggestion: SuggestedVehicle = {
    vehicleCode: clean(vehicle.AracKodu),
    usageType: clean(vehicle.KullanimTarzi),
    usageStyle: clean(vehicle.KullanimSekli),
    brandName: clean(vehicle.Marka),
    typeName: clean(vehicle.MarkaTipi),
    modelYear: clean(vehicle.ModelYili),
    engineNo: clean(vehicle.MotorNo),
    chassisNo: clean(vehicle.SasiNo),
    seats: clean(vehicle.KisiSayisi),
    fuelType: clean(vehicle.YakitTipi),
  };
  return Object.fromEntries(
    Object.entries(suggestion).filter(([, value]) => value !== undefined),
  ) as SuggestedVehicle;
}

/** Reads the answer to `/api/teklif`: a quote was opened, more vehicle details are needed, or the request was refused. */
export function interpretCreate(
  body: IoLenientBody,
  manualVehicleSent: boolean,
): CreateOutcome {
  const failure = body.Hata as
    { HataKodu?: number; Mesaj?: string; HataMesaji?: string } | undefined;
  const code = Number(failure?.HataKodu ?? 0);
  const quoteId = Number(body.TeklifId);

  if (code === 0 && Number.isInteger(quoteId) && quoteId > 0)
    return { kind: 'created', quoteId };
  if ((code === 14 || code === 17) && !manualVehicleSent)
    return { kind: 'needsVehicle', vehicle: suggestVehicle(body.Arac) };
  if (body.__status >= 500 && !failure) return { kind: 'unavailable' };

  // The API words some refusals as "Hata: Egm bulunamadı"; say what it means for the customer instead.
  const stated = (clean(failure?.Mesaj) ?? clean(failure?.HataMesaji))?.replace(
    /^hata:\s*/i,
    '',
  );
  const message = /egm/i.test(stated ?? '')
    ? VEHICLE_NOT_FOUND
    : stated && stated.length <= 200
      ? stated
      : undefined;
  return {
    kind: 'refused',
    code,
    message: message ?? ERROR_MESSAGES[code] ?? FALLBACK,
  };
}
