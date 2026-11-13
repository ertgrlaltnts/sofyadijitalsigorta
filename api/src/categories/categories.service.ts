import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import { slugify } from '../common/slugify.js';
import { KnowledgeEntry } from '../knowledge/knowledge.schemas.js';
import type { CreateCategoryDto, UpdateCategoryDto } from './categories.dto.js';
import { Category, type CategoryDocument } from './category.schema.js';

export interface CategoryView {
  id: string;
  name: string;
  slug: string;
  order: number;
  entryCount: number;
}

const DEFAULT_CATEGORIES = [
  { name: 'Kasko', slug: 'kasko' },
  { name: 'Trafik Sigortası', slug: 'trafik-sigortasi' },
  { name: 'DASK', slug: 'dask' },
  { name: 'Konut', slug: 'konut' },
  { name: 'Sağlık / TSS', slug: 'saglik-tss' },
  { name: 'Seyahat', slug: 'seyahat' },
  { name: 'Genel', slug: 'genel' },
];

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private readonly model: Model<Category>,
    @InjectModel(KnowledgeEntry.name) private readonly entries: Model<KnowledgeEntry>,
  ) {}

  async list(): Promise<CategoryView[]> {
    const [categories, counts] = await Promise.all([
      this.model.find().sort({ order: 1, name: 1 }),
      this.entries.aggregate<{ _id: string; count: number }>([{ $group: { _id: '$categoryId', count: { $sum: 1 } } }]),
    ]);
    const countById = new Map(counts.map((row) => [String(row._id), row.count]));
    return categories.map((category) => this.toView(category, countById.get(category.id as string) ?? 0));
  }

  async create(dto: CreateCategoryDto): Promise<CategoryView> {
    const slug = slugify(dto.name);
    if (!slug) throw new ConflictException('Geçerli bir kategori adı girin.');
    await this.assertSlugFree(slug);
    const order = dto.order ?? (await this.model.countDocuments());
    const category = await this.model.create({ name: dto.name, slug, order });
    return this.toView(category, 0);
  }

  async update(id: string, dto: UpdateCategoryDto): Promise<CategoryView> {
    const category = await this.model.findById(id);
    if (!category) throw new NotFoundException('Kategori bulunamadı.');
    if (dto.name !== undefined && dto.name !== category.name) {
      const slug = slugify(dto.name);
      await this.assertSlugFree(slug, id);
      category.name = dto.name;
      category.slug = slug;
    }
    if (dto.order !== undefined) category.order = dto.order;
    await category.save();
    return this.toView(category, await this.entries.countDocuments({ categoryId: category._id }));
  }

  async remove(id: string): Promise<void> {
    if (await this.entries.exists({ categoryId: id })) {
      throw new ConflictException('Bu kategoriye bağlı bilgi kayıtları var. Önce kayıtları başka kategoriye taşıyın.');
    }
    const result = await this.model.findByIdAndDelete(id);
    if (!result) throw new NotFoundException('Kategori bulunamadı.');
  }

  async ensureDefaults(): Promise<number> {
    let created = 0;
    for (const [order, category] of DEFAULT_CATEGORIES.entries()) {
      const result = await this.model.updateOne({ slug: category.slug }, { $setOnInsert: { ...category, order } }, { upsert: true });
      created += result.upsertedCount;
    }
    return created;
  }

  private async assertSlugFree(slug: string, exceptId?: string): Promise<void> {
    const existing = await this.model.findOne({ slug });
    if (existing && existing.id !== exceptId) throw new ConflictException('Bu isimde bir kategori zaten var.');
  }

  private toView(category: CategoryDocument, entryCount: number): CategoryView {
    return { id: category.id as string, name: category.name, slug: category.slug, order: category.order, entryCount };
  }
}
