import { Transform } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsEmail,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
} from 'class-validator';

const trim = ({ value }: { value: unknown }): unknown => (typeof value === 'string' ? value.trim() : value);
const trimList = ({ value }: { value: unknown }): unknown =>
  Array.isArray(value) ? value.map((item) => String(item).trim()).filter(Boolean) : value;

export class UpdateSettingsDto {
  @IsOptional()
  @Transform(trim)
  @IsString()
  @MinLength(2, { message: 'Asistan adı en az 2 karakter olmalı.' })
  @MaxLength(60)
  assistantName?: string;

  @IsOptional()
  @Transform(trim)
  @IsString()
  @MinLength(1, { message: 'Karşılama mesajı boş olamaz.' })
  @MaxLength(500)
  welcomeMessage?: string;

  @IsOptional()
  @Transform(trimList)
  @IsArray()
  @ArrayMaxSize(6, { message: 'En fazla 6 öneri sorusu eklenebilir.' })
  @IsString({ each: true })
  @MaxLength(120, { each: true, message: 'Öneri sorusu en fazla 120 karakter olabilir.' })
  suggestedQuestions?: string[];

  @IsOptional()
  @IsString()
  @MinLength(20, { message: 'Sistem promptu en az 20 karakter olmalı.' })
  @MaxLength(8000)
  systemPrompt?: string;

  @IsOptional()
  @IsNumber()
  @Min(0.2, { message: 'Benzerlik eşiği en az 0.2 olmalı.' })
  @Max(0.95, { message: 'Benzerlik eşiği en fazla 0.95 olmalı.' })
  similarityThreshold?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  topK?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(20)
  historyLimit?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(2)
  temperature?: number;

  @IsOptional()
  @IsBoolean()
  allowGeneralAnswers?: boolean;

  @IsOptional()
  @Transform(trim)
  @IsString()
  @MinLength(1, { message: 'Yönlendirme mesajı boş olamaz.' })
  @MaxLength(500)
  fallbackMessage?: string;

  @IsOptional()
  @Transform(trim)
  @ValidateIf((_, value: unknown) => value !== '')
  @IsUrl({ require_protocol: true }, { message: 'Geçerli bir bağlantı girin (https://...).' })
  quoteUrl?: string;

  @IsOptional()
  @Transform(trim)
  @IsString()
  @MaxLength(30)
  contactPhone?: string;

  @IsOptional()
  @Transform(trim)
  @IsString()
  @MaxLength(30)
  contactWhatsapp?: string;

  @IsOptional()
  @Transform(trim)
  @ValidateIf((_, value: unknown) => value !== '')
  @IsEmail({}, { message: 'Geçerli bir e-posta girin.' })
  contactEmail?: string;

  @IsOptional()
  @Transform(trim)
  @IsString()
  @MaxLength(80)
  chatModel?: string;
}
