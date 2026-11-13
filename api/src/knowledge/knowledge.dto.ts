import { Transform, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsMongoId,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { ENTRY_TYPES, INDEX_STATUSES, type EntryType, type IndexStatus } from './knowledge.schemas.js';

const normalizeTags = ({ value }: { value: unknown }): unknown =>
  Array.isArray(value) ? [...new Set(value.map((tag) => String(tag).trim()).filter(Boolean))] : value;

export class CreateKnowledgeDto {
  @IsString()
  @MinLength(3, { message: 'Başlık en az 3 karakter olmalı.' })
  @MaxLength(200, { message: 'Başlık en fazla 200 karakter olabilir.' })
  title: string;

  @IsString()
  @MinLength(1, { message: 'İçerik boş olamaz.' })
  @MaxLength(100_000, { message: 'İçerik çok uzun.' })
  content: string;

  @IsIn(ENTRY_TYPES, { message: 'Geçersiz kayıt tipi.' })
  type: EntryType;

  @IsMongoId({ message: 'Geçerli bir kategori seçin.' })
  categoryId: string;

  @IsOptional()
  @Transform(normalizeTags)
  @IsArray()
  @ArrayMaxSize(20, { message: 'En fazla 20 etiket eklenebilir.' })
  @IsString({ each: true })
  @MaxLength(40, { each: true, message: 'Etiket en fazla 40 karakter olabilir.' })
  tags?: string[];

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateKnowledgeDto {
  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'Başlık en az 3 karakter olmalı.' })
  @MaxLength(200, { message: 'Başlık en fazla 200 karakter olabilir.' })
  title?: string;

  @IsOptional()
  @IsString()
  @MinLength(1, { message: 'İçerik boş olamaz.' })
  @MaxLength(100_000, { message: 'İçerik çok uzun.' })
  content?: string;

  @IsOptional()
  @IsIn(ENTRY_TYPES, { message: 'Geçersiz kayıt tipi.' })
  type?: EntryType;

  @IsOptional()
  @IsMongoId({ message: 'Geçerli bir kategori seçin.' })
  categoryId?: string;

  @IsOptional()
  @Transform(normalizeTags)
  @IsArray()
  @ArrayMaxSize(20, { message: 'En fazla 20 etiket eklenebilir.' })
  @IsString({ each: true })
  @MaxLength(40, { each: true, message: 'Etiket en fazla 40 karakter olabilir.' })
  tags?: string[];

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class SetActiveDto {
  @IsBoolean()
  isActive: boolean;
}

export const SORT_FIELDS = ['updatedAt', 'createdAt', 'title'] as const;

export class ListKnowledgeQuery {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit = 20;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  search?: string;

  @IsOptional()
  @IsMongoId()
  categoryId?: string;

  @IsOptional()
  @IsIn(ENTRY_TYPES)
  type?: EntryType;

  @IsOptional()
  @IsIn(INDEX_STATUSES)
  indexStatus?: IndexStatus;

  @IsOptional()
  @Transform(({ value }: { value: unknown }) => (value === 'true' ? true : value === 'false' ? false : value))
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsIn(SORT_FIELDS)
  sort: (typeof SORT_FIELDS)[number] = 'updatedAt';

  @IsOptional()
  @IsIn(['asc', 'desc'])
  order: 'asc' | 'desc' = 'desc';
}

export const BULK_ACTIONS = ['delete', 'activate', 'deactivate'] as const;

export class BulkKnowledgeDto {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMaxSize(200)
  @IsMongoId({ each: true })
  ids: string[];

  @IsIn(BULK_ACTIONS)
  action: (typeof BULK_ACTIONS)[number];
}
