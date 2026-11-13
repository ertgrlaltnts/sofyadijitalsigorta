import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  Matches,
  Max,
  Min,
  Validate,
  ValidateIf,
  ValidateNested,
  ValidationArguments,
  ValidatorConstraint,
  type ValidatorConstraintInterface,
} from 'class-validator';

const upper = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.toUpperCase().replace(/[\s-]/g, '') : value;
const isoDay = (value: unknown): Date | null => {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value))
    return null;
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isNaN(date.getTime()) ||
    date.toISOString().slice(0, 10) !== value
    ? null
    : date;
};
const startOfToday = () => {
  const now = new Date();
  return Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
};

/** A model/construction year: a four-digit year no older than `back` years and no later than next year. */
@ValidatorConstraint({ name: 'recentYear' })
class RecentYearConstraint {
  validate(value: unknown, args: ValidationArguments): boolean {
    const back = Number(args.constraints[0] ?? 60);
    const year = Number(value);
    const current = new Date().getFullYear();
    return (
      /^\d{4}$/.test(String(value)) &&
      year >= current - back &&
      year <= current + 1
    );
  }
  defaultMessage(args: ValidationArguments): string {
    return Number(args.constraints[0] ?? 60) <= 2
      ? 'Model yılı son iki yıl içinde olmalıdır.'
      : 'Geçerli bir yıl seçin.';
  }
}

@ValidatorConstraint({ name: 'tripStart' })
class TripStartConstraint implements ValidatorConstraintInterface {
  validate(value: unknown): boolean {
    const date = isoDay(value);
    return !!date && date.getTime() >= startOfToday();
  }
  defaultMessage(): string {
    return 'Gidiş tarihi bugünden önce olamaz.';
  }
}

@ValidatorConstraint({ name: 'tripEnd' })
class TripEndConstraint implements ValidatorConstraintInterface {
  validate(value: unknown, args: ValidationArguments): boolean {
    const end = isoDay(value);
    const start = isoDay((args.object as TravelDto).startDate);
    if (!end || !start) return false;
    const days = (end.getTime() - start.getTime()) / 86_400_000;
    return days >= 0 && days <= 365;
  }
  defaultMessage(): string {
    return 'Dönüş tarihi gidişten önce olamaz ve yolculuk bir yılı geçemez.';
  }
}

/** Details the insurers' vehicle lookup could not fill in (HataKodu 14/17), or that a car without a plate always needs. */
export class ManualVehicleDto {
  /** Tramer usage type (KT), from /api/teklif/kt. */
  @Matches(/^\d{2}$/, { message: 'Kullanım tarzını seçin.' })
  usageType: string;

  /** Usage style (KS), from /api/teklif/ks. */
  @Matches(/^\d{1,3}$/, { message: 'Kullanım şeklini seçin.' })
  usageStyle: string;

  /** Brand code + type code, as listed by the brand/model lookups. */
  @Matches(/^\d{4,8}$/, { message: 'Marka ve modeli seçin.' })
  vehicleCode: string;

  @Transform(upper)
  @Matches(/^[A-Z0-9]{1,30}$/, { message: 'Motor numarasını girin.' })
  engineNo: string;

  @Transform(upper)
  @Matches(/^[A-Z0-9]{17}$/, {
    message: 'Şasi numarası 17 karakter olmalıdır.',
  })
  chassisNo: string;

  @Matches(/^\d{1,3}$/, { message: 'Koltuk sayısını girin.' })
  seats: string;

  /** Fuel type (kasko only): 1 benzin ... 6 benzin-hybrid. */
  @IsOptional()
  @Matches(/^[1-6]$/, { message: 'Yakıt tipini seçin.' })
  fuelType?: string;
}

export class VehicleDto {
  /** "Plakam henüz çıkmadı". */
  @IsBoolean({ message: 'Geçersiz değer.' })
  noPlate: boolean;

  @ValidateIf((v: VehicleDto) => !v.noPlate)
  @Transform(upper)
  @Matches(/^(0[1-9]|[1-7]\d|8[01])[A-Z]{1,3}\d{2,4}$/, {
    message: 'Geçerli bir plaka girin (örn. 34ABC123).',
  })
  plate?: string;

  @ValidateIf((v: VehicleDto) => !v.noPlate)
  @Transform(upper)
  @Matches(/^[A-Z]{2}$/, {
    message: 'Ruhsat seri harfleri iki harf olmalıdır.',
  })
  registrationSeries?: string;

  @ValidateIf((v: VehicleDto) => !v.noPlate)
  @Matches(/^\d{6}$/, { message: 'Ruhsat numarası 6 hane olmalıdır.' })
  registrationNo?: string;

  /** Plate city code, for a car that has no plate yet (the plate then becomes "34YK"). */
  @ValidateIf((v: VehicleDto) => v.noPlate)
  @Matches(/^(0?[1-9]|[1-7]\d|8[01]|50[1-3])$/, {
    message: 'Plaka il kodunu seçin.',
  })
  cityCode?: string;

  @ValidateIf((v: VehicleDto) => v.noPlate || v.modelYear !== undefined)
  @Validate(RecentYearConstraint, [60])
  modelYear?: string;

  /** P = peşin; V = vadeli (traffic, İMM); 3/6/9 = instalments (kasko). */
  @IsIn(['P', 'V', '3', '6', '9'], { message: 'Ödeme şeklini seçin.' })
  payment: 'P' | 'V' | '3' | '6' | '9';

  @IsOptional()
  @ValidateNested()
  @Type(() => ManualVehicleDto)
  manual?: ManualVehicleDto;
}

export class ImmDto {
  /** İMM limit code, 1 = 250.000 ... 10 = 25.000.000. */
  @IsIn(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'], {
    message: 'İMM bedelini seçin.',
  })
  limit: string;

  /** Moral compensation: 0 = none, 1 = 250.000, 2 = 500.000, 3 = 1.000.000. */
  @IsIn(['0', '1', '2', '3'], { message: 'Manevi tazminatı seçin.' })
  moral: string;
}

/** The building questions DASK and home insurance share. */
class BuildingDto {
  /** UAVT address code: the AdresNo of the chosen flat, ten digits. */
  @Matches(/^\d{10}$/, { message: 'Adresinizi seçin.' })
  addressCode: string;

  /** Policyholder's relation to the building: 0 yok ... 7 diğer. */
  @IsIn(['0', '1', '2', '3', '4', '5', '6', '7'], {
    message: 'Sigorta ettiren sıfatını seçin.',
  })
  holderRole: string;

  @IsIn(['1', '2', '3'], { message: 'Yapı tarzını seçin.' })
  structure: string;

  @Validate(RecentYearConstraint, [51])
  buildYear: string;

  @IsIn(['1', '2', '3', '4'], { message: 'Toplam kat sayısını seçin.' })
  totalFloors: string;

  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? Number(value) : value,
  )
  @IsInt({ message: 'Brüt metrekareyi girin.' })
  @Min(1, { message: 'Brüt metrekareyi girin.' })
  @Max(10_000, { message: 'Brüt metrekare en fazla 10.000 olabilir.' })
  area: number;
}

export class DaskDto {
  /** Existing DASK policy number (8 digits) when renewing; the building questions are then skipped. */
  @IsOptional()
  @Matches(/^\d{8}$/, { message: 'DASK poliçe numarası 8 hane olmalıdır.' })
  renewalPolicyNo?: string;

  @ValidateIf((d: DaskDto) => !d.renewalPolicyNo)
  @Matches(/^\d{10}$/, { message: 'Adresinizi seçin.' })
  addressCode?: string;

  @ValidateIf((d: DaskDto) => !d.renewalPolicyNo)
  @IsIn(['0', '1', '2', '3', '4', '5', '6', '7'], {
    message: 'Sigorta ettiren sıfatını seçin.',
  })
  holderRole?: string;

  @ValidateIf((d: DaskDto) => !d.renewalPolicyNo)
  @IsIn(['1', '2', '3'], { message: 'Yapı tarzını seçin.' })
  structure?: string;

  @ValidateIf((d: DaskDto) => !d.renewalPolicyNo)
  @Validate(RecentYearConstraint, [51])
  buildYear?: string;

  @ValidateIf((d: DaskDto) => !d.renewalPolicyNo)
  @IsIn(['1', '2', '3', '4'], { message: 'Toplam kat sayısını seçin.' })
  totalFloors?: string;

  /** DASK usage: 1 mesken, 2 ticarethane, 3 diğer. */
  @ValidateIf((d: DaskDto) => !d.renewalPolicyNo)
  @IsIn(['1', '2', '3'], { message: 'Kullanım şeklini seçin.' })
  usage?: string;

  /** Damage state: 1 hasarsız ... 4 pertotal. */
  @ValidateIf((d: DaskDto) => !d.renewalPolicyNo)
  @IsIn(['1', '2', '3', '4'], { message: 'Bina hasar durumunu seçin.' })
  damage?: string;

  /** Floor the flat is on: -4 (and below) ... 11 (and above). */
  @ValidateIf((d: DaskDto) => !d.renewalPolicyNo)
  @Matches(/^(-4|-3|-2|-1|[1-9]|10|11)$/, { message: 'Bulunduğu katı seçin.' })
  floor?: string;

  @ValidateIf((d: DaskDto) => !d.renewalPolicyNo)
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? Number(value) : value,
  )
  @IsInt({ message: 'Brüt metrekareyi girin.' })
  @Min(1, { message: 'Brüt metrekareyi girin.' })
  @Max(10_000, { message: 'Brüt metrekare en fazla 10.000 olabilir.' })
  area?: number;

  @IsIn(['P', 'V'], { message: 'Ödeme şeklini seçin.' })
  payment: 'P' | 'V';
}

export class HomeDto extends BuildingDto {
  /** Home usage style: 1 ikametgah ... 6 en az 3 ay boş. */
  @IsIn(['1', '2', '3', '4', '5', '6'], { message: 'Kullanım şeklini seçin.' })
  usageStyle: string;

  /** Home type: 1 apartman dairesi, 2 çiftlik evi, 3 müstakil ev. */
  @IsIn(['1', '2', '3'], { message: 'Kullanım tarzını seçin.' })
  usageType: string;

  /** Position in the building: 0 bodrum ... 6 tamamı. */
  @IsIn(['0', '1', '2', '3', '4', '5', '6'], {
    message: 'Binadaki konumu seçin.',
  })
  position: string;

  /** What to insure: 0 the home, 1 the contents, 2 both. */
  @IsIn([0, 1, 2], { message: 'Neyi sigortalatmak istediğinizi seçin.' })
  coverChoice: 0 | 1 | 2;

  @IsInt({ message: 'Bina bedelini girin.' })
  @Min(0, { message: 'Bedel eksi olamaz.' })
  @Max(500_000_000, { message: 'Bedel çok yüksek.' })
  buildingValue: number;

  @IsInt({ message: 'Eşya bedelini girin.' })
  @Min(0, { message: 'Bedel eksi olamaz.' })
  @Max(500_000_000, { message: 'Bedel çok yüksek.' })
  contentsValue: number;

  @IsInt({ message: 'Cam bedelini girin.' })
  @Min(0, { message: 'Bedel eksi olamaz.' })
  @Max(50_000_000, { message: 'Bedel çok yüksek.' })
  glassValue: number;

  @IsInt({ message: 'Dekorasyon bedelini girin.' })
  @Min(0, { message: 'Bedel eksi olamaz.' })
  @Max(50_000_000, { message: 'Bedel çok yüksek.' })
  decorationValue: number;

  @IsIn(['P', 'V'], { message: 'Ödeme şeklini seçin.' })
  payment: 'P' | 'V';
}

export class TravelDto {
  /** 1 = dar paket, 2 = geniş paket. */
  @IsIn(['1', '2'], { message: 'Paketi seçin.' })
  plan: string;

  /** A = Avrupa (Schengen), T = tüm dünya, Y = yurt içi. */
  @IsIn(['A', 'T', 'Y'], { message: 'Seyahat bölgesini seçin.' })
  scope: 'A' | 'T' | 'Y';

  /** Country code (/api/ulkeler) or, for domestic trips, the province code. */
  @Matches(/^\d{1,3}$/, { message: 'Gidilecek yeri seçin.' })
  destination: string;

  @Validate(TripStartConstraint)
  startDate: string;

  @Validate(TripEndConstraint)
  endDate: string;

  @IsIn(['P', 'V'], { message: 'Ödeme şeklini seçin.' })
  payment: 'P' | 'V';
}
