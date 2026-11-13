import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min, MaxLength, MinLength } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @MinLength(2, { message: 'Kategori adı en az 2 karakter olmalı.' })
  @MaxLength(60, { message: 'Kategori adı en fazla 60 karakter olabilir.' })
  name: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  order?: number;
}

export class UpdateCategoryDto {
  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'Kategori adı en az 2 karakter olmalı.' })
  @MaxLength(60, { message: 'Kategori adı en fazla 60 karakter olabilir.' })
  name?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  order?: number;
}
