import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types, type Model, type QueryFilter } from 'mongoose';
import { Category, type CategoryDocument } from '../categories/category.schema.js';
import { definedOnly } from '../common/defined-only.js';
import { OpenaiService } from '../openai/openai.service.js';
import { chunkEntry } from './chunker.js';
import type { BulkKnowledgeDto, CreateKnowledgeDto, ListKnowledgeQuery, UpdateKnowledgeDto } from './knowledge.dto.js';
import {
  KnowledgeChunk,
  KnowledgeEntry,
  type EntryType,
  type IndexStatus,
  type KnowledgeEntryDocument,
} from './knowledge.schemas.js';
import { RetrievalService } from './retrieval.service.js';

type ViewSource = Pick<
  KnowledgeEntry,
  'title' | 'type' | 'tags' | 'isActive' | 'indexStatus' | 'indexError' | 'createdAt' | 'updatedAt'
> & { id: string };

export interface KnowledgeView {
  id: string;
  title: string;
  type: EntryType;
  category: { id: string; name: string } | null;
  tags: string[];
  isActive: boolean;
  indexStatus: IndexStatus;
  indexError: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface KnowledgeDetailView extends KnowledgeView {
  content: string;
}

export interface Page<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export interface ReindexSummary {
  total: number;
  indexed: number;
  failed: number;
}

function escapeRegex(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

@Injectable()
export class KnowledgeService {
  private readonly logger = new Logger(KnowledgeService.name);

  constructor(
    @InjectModel(KnowledgeEntry.name) private readonly entries: Model<KnowledgeEntry>,
    @InjectModel(KnowledgeChunk.name) private readonly chunks: Model<KnowledgeChunk>,
    @InjectModel(Category.name) private readonly categories: Model<Category>,
    private readonly openai: OpenaiService,
    private readonly retrieval: RetrievalService,
  ) {}

  async list(query: ListKnowledgeQuery): Promise<Page<KnowledgeView>> {
    const filter: QueryFilter<KnowledgeEntry> = {};
    if (query.search) {
      const pattern = new RegExp(escapeRegex(query.search), 'i');
      filter.$or = [{ title: pattern }, { content: pattern }, { tags: pattern }];
    }
    if (query.categoryId) filter.categoryId = new Types.ObjectId(query.categoryId);
    if (query.type) filter.type = query.type;
    if (query.indexStatus) filter.indexStatus = query.indexStatus;
    if (query.isActive !== undefined) filter.isActive = query.isActive;

    const [docs, total] = await Promise.all([
      this.entries
        .find(filter, { content: 0 })
        .sort({ [query.sort]: query.order === 'asc' ? 1 : -1 })
        .collation({ locale: 'tr' })
        .skip((query.page - 1) * query.limit)
        .limit(query.limit)
        .populate('categoryId', 'name'),
      this.entries.countDocuments(filter),
    ]);
    return { items: docs.map((doc) => this.toView(doc)), total, page: query.page, limit: query.limit };
  }

  async get(id: string): Promise<KnowledgeDetailView> {
    const doc = await this.entries.findById(id).populate('categoryId', 'name');
    if (!doc) throw new NotFoundException('Kayıt bulunamadı.');
    return { ...this.toView(doc), content: doc.content };
  }

  async create(dto: CreateKnowledgeDto, adminId: string): Promise<KnowledgeDetailView> {
    await this.assertCategory(dto.categoryId);
    const doc = await this.entries.create({
      title: dto.title,
      content: dto.content,
      type: dto.type,
      tags: dto.tags,
      isActive: dto.isActive,
      categoryId: new Types.ObjectId(dto.categoryId),
      createdBy: new Types.ObjectId(adminId),
      updatedBy: new Types.ObjectId(adminId),
    });
    await this.index(doc);
    return this.get(doc.id as string);
  }

  async update(id: string, dto: UpdateKnowledgeDto, adminId: string): Promise<KnowledgeDetailView> {
    const doc = await this.entries.findById(id);
    if (!doc) throw new NotFoundException('Kayıt bulunamadı.');
    if (dto.categoryId) await this.assertCategory(dto.categoryId);

    const contentChanged =
      (dto.title !== undefined && dto.title !== doc.title) ||
      (dto.content !== undefined && dto.content !== doc.content) ||
      (dto.type !== undefined && dto.type !== doc.type);
    const activeChanged = dto.isActive !== undefined && dto.isActive !== doc.isActive;

    const { categoryId, ...rest } = dto;
    doc.set({ ...definedOnly(rest), updatedBy: new Types.ObjectId(adminId) });
    if (categoryId) doc.categoryId = new Types.ObjectId(categoryId);
    await doc.save();

    if (contentChanged || doc.indexStatus !== 'indexed') {
      await this.index(doc);
    } else if (activeChanged) {
      await this.chunks.updateMany({ entryId: doc._id }, { isActive: doc.isActive });
      this.retrieval.invalidate();
    }
    return this.get(id);
  }

  async setActive(id: string, isActive: boolean, adminId: string): Promise<KnowledgeDetailView> {
    return this.update(id, { isActive }, adminId);
  }

  async remove(id: string): Promise<void> {
    const doc = await this.entries.findByIdAndDelete(id);
    if (!doc) throw new NotFoundException('Kayıt bulunamadı.');
    await this.chunks.deleteMany({ entryId: doc._id });
    this.retrieval.invalidate();
  }

  async reindex(id: string): Promise<KnowledgeDetailView> {
    const doc = await this.entries.findById(id);
    if (!doc) throw new NotFoundException('Kayıt bulunamadı.');
    await this.index(doc);
    return this.get(id);
  }

  async reindexAll(): Promise<ReindexSummary> {
    const docs = await this.entries.find();
    let indexed = 0;
    for (const doc of docs) {
      if ((await this.index(doc)) === 'indexed') indexed++;
    }
    return { total: docs.length, indexed, failed: docs.length - indexed };
  }

  async bulk(dto: BulkKnowledgeDto): Promise<{ affected: number }> {
    const ids = dto.ids.map((id) => new Types.ObjectId(id));
    if (dto.action === 'delete') {
      const result = await this.entries.deleteMany({ _id: { $in: ids } });
      await this.chunks.deleteMany({ entryId: { $in: ids } });
      this.retrieval.invalidate();
      return { affected: result.deletedCount };
    }
    const isActive = dto.action === 'activate';
    const result = await this.entries.updateMany({ _id: { $in: ids } }, { isActive });
    await this.chunks.updateMany({ entryId: { $in: ids } }, { isActive });
    this.retrieval.invalidate();
    return { affected: result.modifiedCount };
  }

  private async index(doc: KnowledgeEntryDocument): Promise<IndexStatus> {
    try {
      const texts = chunkEntry(doc);
      // Başlık + etiketler ayrıca embed edilir: "dask" gibi kısa sorgular uzun "Soru+Cevap" metninden çok başlığa benzer.
      const titleText = [doc.title, ...doc.tags].join(' ');
      const embeddings = await this.openai.embed([...texts, titleText]);
      const titleEmbedding = embeddings[texts.length];
      await this.chunks.deleteMany({ entryId: doc._id });
      await this.chunks.insertMany(
        texts.map((text, chunkIndex) => ({
          entryId: doc._id,
          chunkIndex,
          text,
          embedding: embeddings[chunkIndex],
          titleEmbedding,
          isActive: doc.isActive,
        })),
      );
      doc.indexStatus = 'indexed';
      doc.indexError = null;
    } catch (error) {
      this.logger.error(`İndeksleme başarısız: ${doc.id as string}`, error instanceof Error ? error.stack : String(error));
      doc.indexStatus = 'failed';
      doc.indexError = error instanceof Error ? error.message.slice(0, 300) : 'Bilinmeyen hata';
    }
    await doc.save();
    this.retrieval.invalidate();
    return doc.indexStatus;
  }

  private async assertCategory(categoryId: string): Promise<void> {
    if (!(await this.categories.exists({ _id: categoryId }))) {
      throw new BadRequestException('Seçilen kategori bulunamadı.');
    }
  }

  private toView(doc: ViewSource): KnowledgeView {
    const { categoryId } = doc as unknown as { categoryId: CategoryDocument | Types.ObjectId | null };
    const populated = categoryId && 'name' in categoryId ? categoryId : null;
    return {
      id: doc.id as string,
      title: doc.title,
      type: doc.type,
      category: populated ? { id: populated.id as string, name: populated.name } : null,
      tags: doc.tags,
      isActive: doc.isActive,
      indexStatus: doc.indexStatus,
      indexError: doc.indexError,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}
