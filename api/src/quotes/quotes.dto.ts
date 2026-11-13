import { Transform, Type } from 'class-transformer';
import {
  Equals,
  IsBoolean,
  IsDefined,
  IsIn,
  IsInt,
  IsOptional,
  Matches,
  Max,
  Min,
  Validate,
  ValidateIf,
  ValidateNested,
  ValidatorConstraint,
  type ValidatorConstraintInterface,
} from 'class-validator';
import { isValidTckn } from '../common/pii.js';
import {
  DaskDto,
  HomeDto,
  ImmDto,
  TravelDto,
  VehicleDto,
} from './product-details.dto.js';
import { QUOTE_PRODUCTS, type QuoteProduct } from './products.js';

/** Vefat bedeli codes as the IO quote site sends them (3 = 50.000 TL ... 13 = 5.000.000 TL). */
export const ACCIDENT_COVERAGES = ['3', '5', '7', '9', '11', '13'] as const;
export const HEALTH_PAYMENTS = ['P', '3', '6', '9'] as const;
export const ACCIDENT_PAYMENTS = ['P', 'V'] as const;
export const MIN_AGE = 18;
export const MAX_AGE = 75;

export function ageOn(birthDate: string, today = new Date()): number {
  const [year, month, day] = birthDate.split('-').map(Number);
  let age = today.getFullYear() - year;
  if (
    today.getMonth() + 1 < month ||
    (today.getMonth() + 1 === month && today.getDate() < day)
  )
    age -= 1;
  return age;
}

@ValidatorConstraint({ name: 'tckn' })
export class TcknConstraint implements ValidatorConstraintInterface {
  validate(value: unknown): boolean {
    return (
      typeof value === 'string' &&
      /^[1-9]\d{10}$/.test(value) &&
      isValidTckn(value)
    );
  }
  defaultMessage(): string {
    return 'Geçerli bir T.C. kimlik numarası girin.';
  }
}

@ValidatorConstraint({ name: 'futureDate' })
class FutureDateConstraint implements ValidatorConstraintInterface {
  validate(value: unknown): boolean {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value))
      return false;
    const date = new Date(`${value}T00:00:00Z`);
    if (
      Number.isNaN(date.getTime()) ||
      date.toISOString().slice(0, 10) !== value
    )
      return false;
    return date.getTime() >= Date.now() - 24 * 60 * 60 * 1000;
  }
  defaultMessage(): string {
    return 'Önceki poliçenin bitiş tarihini girin.';
  }
}

@ValidatorConstraint({ name: 'birthDate' })
class BirthDateConstraint implements ValidatorConstraintInterface {
  validate(value: unknown): boolean {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value))
      return false;
    const date = new Date(`${value}T00:00:00Z`);
    if (
      Number.isNaN(date.getTime()) ||
      date.toISOString().slice(0, 10) !== value
    )
      return false;
    const age = ageOn(value);
    return age >= MIN_AGE && age <= MAX_AGE;
  }
  defaultMessage(): string {
    return `Yaşınız ${MIN_AGE} ile ${MAX_AGE} arasında olmalıdır.`;
  }
}

const digitsOnly = ({ value }: { value: unknown }) =>
  typeof value === 'string'
    ? value.replace(/\D/g, '').replace(/^(90|0)(?=5)/, '')
    : value;

/** The policy being moved to us, for a "transfer" (renewal with another insurer) quote. */
export class TransferDto {
  @Matches(/^[A-Za-z0-9]{1,6}$/, { message: 'Önceki sigorta şirketini seçin.' })
  companyCode: string;

  @Matches(/^[\w./-]{1,20}$/, { message: 'Acente numarasını girin.' })
  agencyNo: string;

  @Matches(/^[\w./-]{1,30}$/, { message: 'Poliçe numarasını girin.' })
  policyNo: string;

  @Validate(FutureDateConstraint)
  endDate: string;
}

export class HealthDetailsDto {
  @IsInt({ message: 'Boyunuzu santimetre olarak girin.' })
  @Min(100, { message: 'Boy en az 100 cm olmalıdır.' })
  @Max(230, { message: 'Boy en fazla 230 cm olmalıdır.' })
  height: number;

  @IsInt({ message: 'Kilonuzu kilogram olarak girin.' })
  @Min(30, { message: 'Kilo en az 30 kg olmalıdır.' })
  @Max(250, { message: 'Kilo en fazla 250 kg olmalıdır.' })
  weight: number;

  /** `inpatient` = yatarak; `outpatient` = yatarak + ayakta. */
  @IsIn(['inpatient', 'outpatient'], { message: 'Teminat türünü seçin.' })
  cover: 'inpatient' | 'outpatient';

  /** Outpatient visit limit: 1 = 0~9, 2 = 10, 3 = unlimited. Ignored for inpatient. */
  @IsOptional()
  @IsIn([1, 2, 3], { message: 'Ayakta muayene limitini seçin.' })
  visits?: 1 | 2 | 3;

  /** Hospital network: 0 = dar, 1 = standart, 2 = kapsamlı. */
  @IsIn([0, 1, 2], { message: 'Hastane ağını seçin.' })
  network: 0 | 1 | 2;

  /** Birth (maternity) cover. */
  @IsBoolean({ message: 'Geçersiz değer.' })
  birthCover: boolean;

  /** P = peşin, otherwise the number of instalments. */
  @IsIn(HEALTH_PAYMENTS, { message: 'Ödeme şeklini seçin.' })
  payment: (typeof HEALTH_PAYMENTS)[number];

  @IsOptional()
  @ValidateNested()
  @Type(() => TransferDto)
  transfer?: TransferDto;
}

export class AccidentDetailsDto {
  @IsIn(ACCIDENT_COVERAGES, { message: 'Vefat bedelini seçin.' })
  coverage: (typeof ACCIDENT_COVERAGES)[number];

  @IsBoolean({ message: 'Geçersiz değer.' })
  earthquake: boolean;

  @IsBoolean({ message: 'Geçersiz değer.' })
  assistance: boolean;

  /** Treatment expenses cover (TedaviVar). */
  @IsBoolean({ message: 'Geçersiz değer.' })
  treatment: boolean;

  /** P = peşin, V = vadeli. */
  @IsIn(ACCIDENT_PAYMENTS, { message: 'Ödeme şeklini seçin.' })
  payment: (typeof ACCIDENT_PAYMENTS)[number];
}

export class CreateQuoteDto {
  @IsIn(QUOTE_PRODUCTS, { message: 'Geçersiz ürün.' })
  product: QuoteProduct;

  @Validate(TcknConstraint)
  tckn: string;

  @Validate(BirthDateConstraint)
  birthDate: string;

  @Transform(digitsOnly)
  @Matches(/^5\d{9}$/, {
    message: 'Cep telefonunu 5XX XXX XX XX biçiminde girin.',
  })
  phone: string;

  @Equals(true, {
    message: 'Devam etmek için aydınlatma metnini onaylamalısınız.',
  })
  consent: boolean;

  @ValidateIf((dto: CreateQuoteDto) => dto.product === 'health')
  @IsDefined({ message: 'Sağlık bilgileri eksik.' })
  @ValidateNested()
  @Type(() => HealthDetailsDto)
  health?: HealthDetailsDto;

  @ValidateIf((dto: CreateQuoteDto) => dto.product === 'accident')
  @IsDefined({ message: 'Ferdi kaza bilgileri eksik.' })
  @ValidateNested()
  @Type(() => AccidentDetailsDto)
  accident?: AccidentDetailsDto;

  @ValidateIf((dto: CreateQuoteDto) =>
    ['traffic', 'kasko', 'imm'].includes(dto.product),
  )
  @IsDefined({ message: 'Araç bilgileri eksik.' })
  @ValidateNested()
  @Type(() => VehicleDto)
  vehicle?: VehicleDto;

  /** Occupation code (from /api/teklif/meslek); kasko insurers price by it. */
  @ValidateIf((dto: CreateQuoteDto) => dto.product === 'kasko')
  @Matches(/^[A-Za-z0-9]{1,4}$/, { message: 'Mesleğinizi seçin.' })
  profession?: string;

  @ValidateIf((dto: CreateQuoteDto) => dto.product === 'imm')
  @IsDefined({ message: 'İMM bilgileri eksik.' })
  @ValidateNested()
  @Type(() => ImmDto)
  imm?: ImmDto;

  @ValidateIf((dto: CreateQuoteDto) => dto.product === 'dask')
  @IsDefined({ message: 'DASK bilgileri eksik.' })
  @ValidateNested()
  @Type(() => DaskDto)
  dask?: DaskDto;

  @ValidateIf((dto: CreateQuoteDto) => dto.product === 'home')
  @IsDefined({ message: 'Konut bilgileri eksik.' })
  @ValidateNested()
  @Type(() => HomeDto)
  home?: HomeDto;

  @ValidateIf((dto: CreateQuoteDto) => dto.product === 'travel')
  @IsDefined({ message: 'Seyahat bilgileri eksik.' })
  @ValidateNested()
  @Type(() => TravelDto)
  travel?: TravelDto;
}
