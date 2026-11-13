import { Transform } from 'class-transformer';
import {
  Equals,
  IsBoolean,
  IsInt,
  IsOptional,
  Matches,
  Min,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  type ValidatorConstraintInterface,
} from 'class-validator';
import { passesLuhn } from '../common/pii.js';
import { TcknConstraint } from './quotes.dto.js';

@ValidatorConstraint({ name: 'cardNumber' })
class CardNumberConstraint implements ValidatorConstraintInterface {
  validate(value: unknown): boolean {
    return (
      typeof value === 'string' &&
      /^\d{13,19}$/.test(value) &&
      passesLuhn(value)
    );
  }
  defaultMessage(): string {
    return 'Geçerli bir kart numarası girin.';
  }
}

@ValidatorConstraint({ name: 'cardExpiry' })
class CardExpiryConstraint implements ValidatorConstraintInterface {
  validate(year: unknown, args: ValidationArguments): boolean {
    const month = Number((args.object as PurchaseDto).expiryMonth);
    const value = Number(year);
    if (!Number.isInteger(value) || !Number.isInteger(month)) return false;
    const now = new Date();
    return (
      value > now.getFullYear() ||
      (value === now.getFullYear() && month >= now.getMonth() + 1)
    );
  }
  defaultMessage(): string {
    return 'Kartınızın son kullanma tarihi geçmiş.';
  }
}

const trim = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : value;
const digitsOnly = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.replace(/\D/g, '') : value;

/** Card details never touch the database or the logs: they are validated here and forwarded to the insurer once. */
export class PurchaseDto {
  @IsInt({ message: 'Geçersiz teklif.' })
  @Min(1, { message: 'Geçersiz teklif.' })
  offerId: number;

  @Transform(trim)
  @Matches(/^[\p{L} .'-]{6,60}$/u, {
    message: 'Kart üzerindeki ad soyadı girin.',
  })
  cardHolder: string;

  @Transform(digitsOnly)
  @Validate(CardNumberConstraint)
  cardNumber: string;

  @Matches(/^(0[1-9]|1[0-2])$/, {
    message: 'Ayı iki hane olarak girin (01-12).',
  })
  expiryMonth: string;

  @Matches(/^20\d{2}$/, { message: 'Yılı dört hane olarak girin.' })
  @Validate(CardExpiryConstraint)
  expiryYear: string;

  @Matches(/^\d{3,4}$/, { message: 'Güvenlik kodunu girin.' })
  cvv: string;

  @Validate(TcknConstraint)
  holderTckn: string;

  @Equals(true, {
    message: 'Devam etmek için sözleşme ve bilgilendirmeyi onaylamalısınız.',
  })
  consent: boolean;

  /** Set by the browser after the bank's 3D Secure window reports approval; the purchase is then repeated without 3D. */
  @IsOptional()
  @IsBoolean()
  threeDSecureApproved?: boolean;
}
