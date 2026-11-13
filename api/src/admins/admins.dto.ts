import { IsBoolean, IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateAdminDto {
  @IsEmail({}, { message: 'Geçerli bir e-posta girin.' })
  email: string;

  @IsString()
  @MinLength(2, { message: 'Ad en az 2 karakter olmalı.' })
  @MaxLength(80)
  name: string;

  @IsString()
  @MinLength(8, { message: 'Şifre en az 8 karakter olmalı.' })
  @MaxLength(100)
  password: string;
}

export class UpdateAdminDto {
  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'Ad en az 2 karakter olmalı.' })
  @MaxLength(80)
  name?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class ChangePasswordDto {
  @IsString()
  @MinLength(8, { message: 'Şifre en az 8 karakter olmalı.' })
  @MaxLength(100)
  password: string;
}
