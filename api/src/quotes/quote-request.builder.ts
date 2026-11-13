import type { CreateQuoteDto } from './quotes.dto.js';
import type { ManualVehicleDto, VehicleDto } from './product-details.dto.js';
import { BRANCH, PAYMENTS, type QuoteProduct } from './products.js';

type Json = Record<string, any>;

/** What the identity check returned: the insured record, and the encrypted copy some renewals must send back. */
export interface InsuredContext {
  insured: Json;
  insuredStr?: string;
}

/** Plate city codes are sent zero padded ("01"..."09"); the Cyprus codes (501-503) stay as they are. */
const padCity = (code: string): string =>
  code.length < 2 ? code.padStart(2, '0') : code;

/** The payment plan a product accepts, as its insurers' own forms offer it. */
export function paymentAllowed(
  product: QuoteProduct,
  payment: string,
): boolean {
  const list: readonly string[] =
    product === 'kasko' || product === 'health'
      ? PAYMENTS.instalments
      : PAYMENTS.deferred;
  return list.includes(payment);
}

/** The payment the customer picked, whichever product block carries it. */
export function chosenPayment(dto: CreateQuoteDto): string | undefined {
  return (
    dto.health ??
    dto.accident ??
    dto.vehicle ??
    dto.dask ??
    dto.home ??
    dto.travel
  )?.payment;
}

function buildManualVehicle(
  manual: ManualVehicleDto,
  product: QuoteProduct,
): Json {
  return {
    KullanimTarzi: manual.usageType,
    KullanimSekli: manual.usageStyle,
    AracKodu: manual.vehicleCode,
    MotorNo: manual.engineNo,
    SasiNo: manual.chassisNo,
    KisiSayisi: manual.seats,
    // Fuel type is a kasko question only.
    ...(product === 'kasko' && manual.fuelType
      ? { YakitTipi: manual.fuelType }
      : {}),
  };
}

function buildVehicle(vehicle: VehicleDto, product: QuoteProduct): Json {
  const base: Json = vehicle.noPlate
    ? {
        PlakamYok: true,
        Plaka: `${padCity(vehicle.cityCode ?? '')}YK`,
        IlKodu: padCity(vehicle.cityCode ?? ''),
        TescilBelge: '',
        KisaSureli: false,
      }
    : {
        PlakamYok: false,
        Plaka: vehicle.plate,
        TescilBelge: `${vehicle.registrationSeries}${vehicle.registrationNo}`,
        KisaSureli: false,
      };
  if (vehicle.modelYear) base.ModelYili = vehicle.modelYear;
  return vehicle.manual
    ? { ...base, ...buildManualVehicle(vehicle.manual, product) }
    : base;
}

/** The building questions of a new DASK or home policy (the IO field names differ slightly between the two). */
function buildBuilding(block: {
  addressCode?: string;
  holderRole?: string;
  structure?: string;
  buildYear?: string;
  totalFloors?: string;
  area?: number;
}): Json {
  return {
    AdresKodu: block.addressCode,
    SigortaEttirenSifati: block.holderRole,
    YapiTarzi: block.structure,
    InsaaYili: block.buildYear,
    ToplamKatSayisi: block.totalFloors,
    BrutM2: String(block.area ?? ''),
  };
}

/** Builds the `/api/teklif` request for a validated form and the insured record returned by the identity check. */
export function buildQuoteRequest(
  dto: CreateQuoteDto,
  context: InsuredContext,
  channel: number,
): Json {
  const request: Json = {
    BransNo: BRANCH[dto.product],
    Kanal: channel,
    TeklifId: 0,
    Guncelle: false,
    SigortaEttirenAyniMi: true,
    Sirketler: [],
    Sigortali: {
      KimlikNo: dto.tckn,
      DogumTarihi: dto.birthDate,
      Cep: dto.phone,
      ...context.insured,
    },
  };
  const payment = chosenPayment(dto);
  if (payment) request.OdemeSekli = payment;

  if (dto.product === 'health' && dto.health) {
    const { health } = dto;
    const outpatient = health.cover === 'outpatient';
    request.Saglik = {
      Plan: outpatient ? 1 : 0,
      PlanTipi: outpatient ? (health.visits ?? 2) : 0,
      Boy: health.height,
      Kilo: health.weight,
      Network: health.network,
      DogumTeminati: health.birthCover,
      Transfer: !!health.transfer,
      AileTeklifi: false,
    };
    if (health.transfer) {
      request.OncekiPolice = {
        SirketKodu: health.transfer.companyCode,
        AcenteNo: health.transfer.agencyNo,
        PoliceNo: health.transfer.policyNo,
        BitisTarihi: health.transfer.endDate,
      };
    }
  }

  if (dto.product === 'accident' && dto.accident) {
    request.FerdiKaza = {
      Teminat: dto.accident.coverage,
      Deprem: dto.accident.earthquake,
      Asistans: dto.accident.assistance,
      TedaviVar: dto.accident.treatment,
    };
  }

  if (dto.vehicle && ['traffic', 'kasko', 'imm'].includes(dto.product)) {
    request.Arac = buildVehicle(dto.vehicle, dto.product);
    if (dto.product === 'kasko') request.Sigortali.Meslek = dto.profession;
    if (dto.product === 'imm' && dto.imm)
      request.Imm = { ImmBedel: dto.imm.limit, ManeviTazminat: dto.imm.moral };
  }

  if (dto.product === 'dask' && dto.dask) {
    const { dask } = dto;
    if (dask.renewalPolicyNo) {
      // A renewal sends the insured's encrypted record back and only the old policy number.
      request.Dask = { PolicemYok: false, DaskPoliceNo: dask.renewalPolicyNo };
      request.SigortaliStr = context.insuredStr;
      request.Link = '';
    } else {
      request.Dask = {
        PolicemYok: true,
        ...buildBuilding(dask),
        KullanimSekli: dask.usage,
        BinaHasarDurumu: dask.damage,
        BinadakiKonumu: dask.floor,
      };
    }
  }

  if (dto.product === 'home' && dto.home) {
    const { home } = dto;
    request.DovizTipi = 'TL';
    request.Konut = {
      PolicemYok: true,
      DaskPolicesiVar: false,
      ...buildBuilding(home),
      KullanimSekli: home.usageStyle,
      KullanimTarzi: home.usageType,
      BinadakiKonumu: home.position,
      BinaHasarDurumu: '',
      BedelSecimi: home.coverChoice,
      // The home itself is only priced when it is insured, the contents likewise.
      BinaBedeli: home.coverChoice === 1 ? 0 : home.buildingValue,
      EsyaBedeli: home.coverChoice === 0 ? 0 : home.contentsValue,
      Enflasyon: 50,
      CamBedeli: home.glassValue,
      DekorasyonBedeli: home.decorationValue,
    };
  }

  if (dto.product === 'travel' && dto.travel) {
    const { travel } = dto;
    const domestic = travel.scope === 'Y';
    request.Seyahat = {
      PlanSecimi: travel.plan,
      Kapsam: travel.scope,
      GidilenYer: domestic ? padCity(travel.destination) : travel.destination,
      IlKodu: domestic ? padCity(travel.destination) : '',
      GidisTarihi: travel.startDate,
      DonusTarihi: travel.endDate,
    };
  }

  return request;
}
