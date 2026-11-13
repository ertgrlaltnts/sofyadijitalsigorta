import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { IsMongoId } from 'class-validator';
import type { AuthUser } from '../auth/auth.types.js';
import { CurrentUser } from '../auth/current-user.decorator.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { ParseObjectIdPipe } from '../common/parse-object-id.pipe.js';
import { extractDocument, type UploadedDocument } from './document-text.js';
import { BulkKnowledgeDto, CreateKnowledgeDto, ListKnowledgeQuery, SetActiveDto, UpdateKnowledgeDto } from './knowledge.dto.js';
import {
  KnowledgeService,
  type KnowledgeDetailView,
  type KnowledgeView,
  type Page,
  type ReindexSummary,
} from './knowledge.service.js';

class UploadDto {
  @IsMongoId({ message: 'Geçerli bir kategori seçin.' })
  categoryId: string;
}

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

@Controller('admin/knowledge')
@UseGuards(JwtAuthGuard)
export class KnowledgeController {
  constructor(private readonly knowledge: KnowledgeService) {}

  @Get()
  list(@Query() query: ListKnowledgeQuery): Promise<Page<KnowledgeView>> {
    return this.knowledge.list(query);
  }

  @Post()
  create(@Body() dto: CreateKnowledgeDto, @CurrentUser() user: AuthUser): Promise<KnowledgeDetailView> {
    return this.knowledge.create(dto, user.id);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: MAX_UPLOAD_BYTES } }))
  async upload(
    @UploadedFile() file: UploadedDocument | undefined,
    @Body() dto: UploadDto,
    @CurrentUser() user: AuthUser,
  ): Promise<KnowledgeDetailView> {
    if (!file) throw new BadRequestException('Dosya seçilmedi.');
    const { title, content } = await extractDocument(file);
    return this.knowledge.create({ title, content, type: 'article', categoryId: dto.categoryId }, user.id);
  }

  @Post('reindex-all')
  @HttpCode(200)
  reindexAll(): Promise<ReindexSummary> {
    return this.knowledge.reindexAll();
  }

  @Post('bulk')
  @HttpCode(200)
  bulk(@Body() dto: BulkKnowledgeDto): Promise<{ affected: number }> {
    return this.knowledge.bulk(dto);
  }

  @Get(':id')
  get(@Param('id', ParseObjectIdPipe) id: string): Promise<KnowledgeDetailView> {
    return this.knowledge.get(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() dto: UpdateKnowledgeDto,
    @CurrentUser() user: AuthUser,
  ): Promise<KnowledgeDetailView> {
    return this.knowledge.update(id, dto, user.id);
  }

  @Patch(':id/active')
  setActive(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() dto: SetActiveDto,
    @CurrentUser() user: AuthUser,
  ): Promise<KnowledgeDetailView> {
    return this.knowledge.setActive(id, dto.isActive, user.id);
  }

  @Post(':id/reindex')
  @HttpCode(200)
  reindex(@Param('id', ParseObjectIdPipe) id: string): Promise<KnowledgeDetailView> {
    return this.knowledge.reindex(id);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', ParseObjectIdPipe) id: string): Promise<void> {
    return this.knowledge.remove(id);
  }
}
