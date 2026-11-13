import type { QuoteRequest, SuggestedVehicle } from "./quote-api";
import type { LiveQuoteKey } from "./quote-products";
import { isVehicleProduct } from "./quote-products";
import { ageOf, isValidTckn, MAX_AGE, MIN_AGE, normalizePhone, toIsoDate } from "./quote-validation";

/** One screen of a quote form. A product's form is a list of these, ending with the identity step. */
export type StepId = "cover" | "profile" | "vehicle" | "vehicle-details" | "imm" | "address" | "building" | "sums" | "travel" | "person";

export type Errors = Record<string, string | undefined>;

export interface Draft {
  health: {
    cover: "inpatient" | "outpatient";
    visits: 1 | 2 | 3;
    network: 0 | 1 | 2;
    birthCover: boolean;
    payment: "P" | "3" | "6" | "9";
    height: string;
    weight: string;
    transfer: boolean;
    tCompany: string;
    tAgency: string;
    tPolicy: string;
    tEnd: string;
  };
  accident: { coverage: string; earthquake: boolean; assistance: boolean; treatment: boolean; payment: "P" | "V" };
  vehicle: {
    noPlate: boolean;
    plate: string;
    series: string;
    regNo: string;
    cityCode: string;
    modelYear: string;
    payment: "P" | "V" | "3" | "6" | "9";
    profession: string;
    usageType: string;
    usageStyle: string;
    brandCode: string;
    vehicleCode: string;
    engineNo: string;
    chassisNo: string;
    seats: string;
    fuelType: string;
  };
  imm: { limit: string; moral: string };
  /** The chosen UAVT address, step by step; `addressCode` is the flat's ten-digit address number. */
  address: { il: string; ilce: string; semt: string; mahalle: string; cadde: string; bina: string; daire: string; addressCode: string };
  /** The building questions of DASK and home insurance. */
  property: {
    renewal: boolean;
    renewalPolicyNo: string;
    holderRole: string;
    structure: string;
    buildYear: string;
    totalFloors: string;
    area: string;
    usage: string;
    damage: string;
    floor: string;
    usageStyle: string;
    usageType: string;
    position: string;
    coverChoice: 0 | 1 | 2;
    buildingValue: string;
    contentsValue: string;
    glassValue: string;
    decorationValue: string;
  };
  travel: { scope: "A" | "T" | "Y"; destination: string; plan: string; startDate: string; endDate: string };
  person: { tckn: string; birth: string; phone: string; consent: boolean };
}

export const initialDraft = (): Draft => ({
  health: { cover: "outpatient", visits: 2, network: 1, birthCover: false, payment: "P", height: "", weight: "", transfer: false, tCompany: "", tAgency: "", tPolicy: "", tEnd: "" },
  accident: { coverage: "7", earthquake: false, assistance: true, treatment: false, payment: "P" },
  vehicle: {
    noPlate: false,
    plate: "",
    series: "",
    regNo: "",
    cityCode: "",
    modelYear: "",
    payment: "P",
    profession: "",
    usageType: "",
    usageStyle: "",
    brandCode: "",
    vehicleCode: "",
    engineNo: "",
    chassisNo: "",
    seats: "",
    fuelType: "",
  },
  imm: { limit: "", moral: "0" },
  address: { il: "", ilce: "", semt: "", mahalle: "", cadde: "", bina: "", daire: "", addressCode: "" },
  property: {
    renewal: false,
    renewalPolicyNo: "",
    holderRole: "",
    structure: "",
    buildYear: "",
    totalFloors: "",
    area: "",
    usage: "",
    damage: "",
    floor: "",
    usageStyle: "",
    usageType: "",
    position: "",
    coverChoice: 2,
    buildingValue: "",
    contentsValue: "",
    glassValue: "",
    decorationValue: "",
  },
  travel: { scope: "A", destination: "", plan: "1", startDate: "", endDate: "" },
  person: { tckn: "", birth: "", phone: "", consent: false },
});

const FLOW: Record<LiveQuoteKey, StepId[]> = {
  health: ["cover", "profile", "person"],
  accident: ["cover", "person"],
  traffic: ["vehicle", "person"],
  kasko: ["vehicle", "person"],
  imm: ["vehicle", "imm", "person"],
  dask: ["address", "building", "person"],
  home: ["address", "building", "sums", "person"],
  travel: ["travel", "person"],
};

/**
 * The steps this form currently has. A car with no plate always needs its details typed in, and so does one the insurers'
 * lookup could not find (`needsVehicle`); a DASK renewal skips the building questions.
 */
export function stepsFor(product: LiveQuoteKey, draft: Draft, needsVehicle: boolean): StepId[] {
  let steps = [...FLOW[product]];
  if (isVehicleProduct(product) && (draft.vehicle.noPlate || needsVehicle)) steps.splice(steps.indexOf("vehicle") + 1, 0, "vehicle-details");
  if (product === "dask" && draft.property.renewal) steps = steps.filter((step) => step !== "building");
  return steps;
}

export const STEP_SUBTITLE: Record<LiveQuoteKey, Partial<Record<StepId, string>>> & { default: Record<StepId, string> } = {
  health: { cover: "Teminatınızı belirleyelim", profile: "Sizi ve poliçenizi tanıyalım" },
  accident: { cover: "Teminatınızı seçin" },
  traffic: {},
  kasko: {},
  imm: {},
  dask: { address: "Binanızın adresini seçin" },
  home: { address: "Konutunuzun adresini seçin" },
  travel: {},
  default: {
    cover: "Teminatınızı belirleyelim",
    profile: "Sizi ve poliçenizi tanıyalım",
    vehicle: "Aracınızı tanıyalım",
    "vehicle-details": "Araç bilgilerini tamamlayalım",
    imm: "İMM bedelini seçin",
    address: "Adresinizi seçin",
    building: "Binanızı tanıyalım",
    sums: "Sigorta bedellerini belirleyin",
    travel: "Yolculuğunuzu tanıyalım",
    person: "Teklif için kimlik bilgileriniz",
  },
};

export const subtitleOf = (product: LiveQuoteKey, step: StepId): string => STEP_SUBTITLE[product][step] ?? STEP_SUBTITLE.default[step];

const money = (value: string): number => Number(value.replace(/\D/g, "") || 0);
const todayIso = () => new Date().toISOString().slice(0, 10);

export function validateStep(step: StepId, product: LiveQuoteKey, draft: Draft): Errors {
  const found: Errors = {};
  const need = (key: string, ok: boolean, message: string) => {
    if (!ok) found[key] = message;
  };

  if (step === "profile") {
    const { health } = draft;
    const height = Number(health.height);
    const weight = Number(health.weight);
    need("height", Number.isInteger(height) && height >= 100 && height <= 230, "Boyunuzu cm olarak yazın (100-230).");
    need("weight", Number.isInteger(weight) && weight >= 30 && weight <= 250, "Kilonuzu kg olarak yazın (30-250).");
    if (health.transfer) {
      need("tCompany", !!health.tCompany, "Önceki sigorta şirketini seçin.");
      need("tAgency", !!health.tAgency.trim(), "Acente numarasını yazın.");
      need("tPolicy", !!health.tPolicy.trim(), "Poliçe numarasını yazın.");
      const iso = toIsoDate(health.tEnd);
      need("tEnd", !!iso && iso >= todayIso(), iso ? "Bitiş tarihi geçmişte olamaz." : "Bitiş tarihini GG.AA.YYYY biçiminde yazın.");
    }
  }

  if (step === "vehicle") {
    const { vehicle } = draft;
    if (vehicle.noPlate) {
      need("cityCode", !!vehicle.cityCode, "Plaka il kodunu seçin.");
      need("modelYear", !!vehicle.modelYear, "Model yılını seçin.");
    } else {
      need("plate", /^(0[1-9]|[1-7]\d|8[01])[A-Z]{1,3}\d{2,4}$/.test(vehicle.plate), "Geçerli bir plaka yazın (örn. 34 ABC 123).");
      need("series", /^[A-Z]{2}$/.test(vehicle.series), "Ruhsat seri harfleri 2 harf olmalıdır.");
      need("regNo", /^\d{6}$/.test(vehicle.regNo), "Ruhsat numarası 6 hane olmalıdır.");
    }
    if (product === "kasko") need("profession", !!vehicle.profession, "Mesleğinizi seçin.");
  }

  if (step === "vehicle-details") {
    const { vehicle } = draft;
    need("usageType", !!vehicle.usageType, "Kullanım tarzını seçin.");
    need("usageStyle", !!vehicle.usageStyle, "Kullanım şeklini seçin.");
    if (!vehicle.noPlate) need("modelYear", !!vehicle.modelYear, "Model yılını seçin.");
    need("brandCode", !!vehicle.brandCode, "Markayı seçin.");
    need("vehicleCode", !!vehicle.vehicleCode, "Modeli seçin.");
    need("engineNo", /^[A-Za-z0-9]{1,30}$/.test(vehicle.engineNo), "Motor numarasını yazın.");
    need("chassisNo", /^[A-Za-z0-9]{17}$/.test(vehicle.chassisNo), "Şasi numarası 17 karakter olmalıdır.");
    need("seats", /^\d{1,3}$/.test(vehicle.seats) && Number(vehicle.seats) > 0, "Koltuk sayısını yazın.");
    if (product === "kasko") need("fuelType", !!vehicle.fuelType, "Yakıt tipini seçin.");
  }

  if (step === "imm") {
    need("limit", !!draft.imm.limit, "İMM bedelini seçin.");
    need("moral", !!draft.imm.moral, "Manevi tazminatı seçin.");
  }

  if (step === "address") {
    if (product === "dask" && draft.property.renewal) need("renewalPolicyNo", /^\d{8}$/.test(draft.property.renewalPolicyNo), "DASK poliçe numarası 8 hane olmalıdır.");
    else need("addressCode", /^\d{10}$/.test(draft.address.addressCode), "Adresinizi daireye kadar seçin.");
  }

  if (step === "building") {
    const { property } = draft;
    const year = Number(property.buildYear);
    need("holderRole", !!property.holderRole, "Sigorta ettiren sıfatını seçin.");
    need("structure", !!property.structure, "Yapı tarzını seçin.");
    need("buildYear", year >= new Date().getFullYear() - 51 && year <= new Date().getFullYear(), "İnşaat yılını seçin.");
    need("totalFloors", !!property.totalFloors, "Toplam kat sayısını seçin.");
    need("area", Number(property.area) >= 1 && Number(property.area) <= 10_000, "Brüt metrekareyi yazın.");
    if (product === "dask") {
      need("usage", !!property.usage, "Kullanım şeklini seçin.");
      need("damage", !!property.damage, "Bina hasar durumunu seçin.");
      need("floor", !!property.floor, "Bulunduğu katı seçin.");
    } else {
      need("usageStyle", !!property.usageStyle, "Kullanım şeklini seçin.");
      need("usageType", !!property.usageType, "Kullanım tarzını seçin.");
      need("position", !!property.position, "Binadaki konumu seçin.");
    }
  }

  if (step === "sums") {
    const { property } = draft;
    if (property.coverChoice !== 1) need("buildingValue", money(property.buildingValue) > 0, "Konutun yeniden yapım bedelini yazın.");
    if (property.coverChoice !== 0) need("contentsValue", money(property.contentsValue) > 0, "Eşyalarınızın toplam bedelini yazın.");
  }

  if (step === "travel") {
    const { travel } = draft;
    need("destination", !!travel.destination, travel.scope === "Y" ? "Gidilecek şehri seçin." : "Gidilecek ülkeyi seçin.");
    need("startDate", !!travel.startDate && travel.startDate >= todayIso(), travel.startDate ? "Gidiş tarihi bugünden önce olamaz." : "Gidiş tarihini seçin.");
    const days = travel.startDate && travel.endDate ? (Date.parse(travel.endDate) - Date.parse(travel.startDate)) / 86_400_000 : NaN;
    need("endDate", days >= 0 && days <= 365, travel.endDate ? "Dönüş tarihi gidişten önce olamaz; yolculuk bir yılı geçemez." : "Dönüş tarihini seçin.");
  }

  if (step === "person") {
    const { person } = draft;
    need("tckn", isValidTckn(person.tckn), "Geçerli bir 11 haneli T.C. kimlik numarası yazın.");
    const iso = toIsoDate(person.birth);
    need("birth", !!iso && ageOf(iso) >= MIN_AGE && ageOf(iso) <= MAX_AGE, iso ? `Yaşınız ${MIN_AGE} ile ${MAX_AGE} arasında olmalıdır.` : "Doğum tarihinizi GG.AA.YYYY biçiminde yazın.");
    need("phone", /^5\d{9}$/.test(normalizePhone(person.phone)), "Cep telefonunuzu 5XX XXX XX XX biçiminde yazın.");
    need("consent", person.consent, "Devam etmek için onay vermelisiniz.");
  }

  return found;
}

/** Prefills the manual vehicle fields with what the insurers' lookup did find. */
export function applySuggestion(draft: Draft, suggestion: SuggestedVehicle): Draft {
  const { vehicle } = draft;
  return {
    ...draft,
    vehicle: {
      ...vehicle,
      usageType: suggestion.usageType ?? vehicle.usageType,
      usageStyle: suggestion.usageStyle ?? vehicle.usageStyle,
      vehicleCode: suggestion.vehicleCode ?? vehicle.vehicleCode,
      brandCode: suggestion.vehicleCode ? suggestion.vehicleCode.slice(0, 3) : vehicle.brandCode,
      modelYear: vehicle.modelYear || suggestion.modelYear || "",
      engineNo: suggestion.engineNo ?? vehicle.engineNo,
      chassisNo: suggestion.chassisNo ?? vehicle.chassisNo,
      seats: suggestion.seats ?? vehicle.seats,
      fuelType: suggestion.fuelType ?? vehicle.fuelType,
    },
  };
}

/** Where a server-side field error belongs on the form, so the right step can be shown again. */
export const SERVER_FIELD: Record<string, { key: string; step: StepId }> = {
  tckn: { key: "tckn", step: "person" },
  birthDate: { key: "birth", step: "person" },
  phone: { key: "phone", step: "person" },
  consent: { key: "consent", step: "person" },
  payment: { key: "payment", step: "person" },
  profession: { key: "profession", step: "vehicle" },
  "health.height": { key: "height", step: "profile" },
  "health.weight": { key: "weight", step: "profile" },
  "health.transfer.companyCode": { key: "tCompany", step: "profile" },
  "health.transfer.agencyNo": { key: "tAgency", step: "profile" },
  "health.transfer.policyNo": { key: "tPolicy", step: "profile" },
  "health.transfer.endDate": { key: "tEnd", step: "profile" },
  "vehicle.plate": { key: "plate", step: "vehicle" },
  "vehicle.registrationSeries": { key: "series", step: "vehicle" },
  "vehicle.registrationNo": { key: "regNo", step: "vehicle" },
  "vehicle.cityCode": { key: "cityCode", step: "vehicle" },
  "vehicle.modelYear": { key: "modelYear", step: "vehicle" },
  "vehicle.manual.engineNo": { key: "engineNo", step: "vehicle-details" },
  "vehicle.manual.chassisNo": { key: "chassisNo", step: "vehicle-details" },
  "vehicle.manual.seats": { key: "seats", step: "vehicle-details" },
  "vehicle.manual.vehicleCode": { key: "vehicleCode", step: "vehicle-details" },
  "dask.renewalPolicyNo": { key: "renewalPolicyNo", step: "address" },
  "dask.addressCode": { key: "addressCode", step: "address" },
  "home.addressCode": { key: "addressCode", step: "address" },
  "travel.startDate": { key: "startDate", step: "travel" },
  "travel.endDate": { key: "endDate", step: "travel" },
};

export function buildRequest(product: LiveQuoteKey, draft: Draft): QuoteRequest {
  const { person } = draft;
  const base = { product, tckn: person.tckn, birthDate: toIsoDate(person.birth) ?? "", phone: normalizePhone(person.phone), consent: person.consent };

  if (product === "accident") return { ...base, accident: draft.accident };

  if (product === "health") {
    const { health } = draft;
    return {
      ...base,
      health: {
        height: Number(health.height),
        weight: Number(health.weight),
        cover: health.cover,
        ...(health.cover === "outpatient" ? { visits: health.visits } : {}),
        network: health.network,
        birthCover: health.birthCover,
        payment: health.payment,
        ...(health.transfer
          ? { transfer: { companyCode: health.tCompany, agencyNo: health.tAgency.trim(), policyNo: health.tPolicy.trim(), endDate: toIsoDate(health.tEnd) ?? "" } }
          : {}),
      },
    };
  }

  if (isVehicleProduct(product)) {
    const { vehicle } = draft;
    // The manual details go along whenever that step was shown: for a car with no plate, or one the lookup could not find.
    const manual = vehicle.vehicleCode
      ? {
          usageType: vehicle.usageType,
          usageStyle: vehicle.usageStyle,
          vehicleCode: vehicle.vehicleCode,
          engineNo: vehicle.engineNo,
          chassisNo: vehicle.chassisNo,
          seats: vehicle.seats,
          ...(product === "kasko" ? { fuelType: vehicle.fuelType } : {}),
        }
      : undefined;
    return {
      ...base,
      vehicle: {
        noPlate: vehicle.noPlate,
        ...(vehicle.noPlate
          ? { cityCode: vehicle.cityCode }
          : { plate: vehicle.plate, registrationSeries: vehicle.series, registrationNo: vehicle.regNo }),
        ...(vehicle.modelYear ? { modelYear: vehicle.modelYear } : {}),
        payment: vehicle.payment,
        ...(manual ? { manual } : {}),
      },
      ...(product === "kasko" ? { profession: vehicle.profession } : {}),
      ...(product === "imm" ? { imm: draft.imm } : {}),
    };
  }

  if (product === "travel") {
    const { travel } = draft;
    return { ...base, travel: { plan: travel.plan, scope: travel.scope, destination: travel.destination, startDate: travel.startDate, endDate: travel.endDate, payment: "P" } };
  }

  const { property, address } = draft;
  if (product === "dask") {
    if (property.renewal) return { ...base, dask: { renewalPolicyNo: property.renewalPolicyNo, payment: "P" } };
    return {
      ...base,
      dask: {
        addressCode: address.addressCode,
        holderRole: property.holderRole,
        structure: property.structure,
        buildYear: property.buildYear,
        totalFloors: property.totalFloors,
        usage: property.usage,
        damage: property.damage,
        floor: property.floor,
        area: Number(property.area),
        payment: "P",
      },
    };
  }

  return {
    ...base,
    home: {
      addressCode: address.addressCode,
      holderRole: property.holderRole,
      structure: property.structure,
      buildYear: property.buildYear,
      totalFloors: property.totalFloors,
      area: Number(property.area),
      usageStyle: property.usageStyle,
      usageType: property.usageType,
      position: property.position,
      coverChoice: property.coverChoice,
      buildingValue: money(property.buildingValue),
      contentsValue: money(property.contentsValue),
      glassValue: money(property.glassValue),
      decorationValue: money(property.decorationValue),
      payment: "P",
    },
  };
}
