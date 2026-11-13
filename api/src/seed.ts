import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { getModelToken } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import { AdminsService } from './admins/admins.service.js';
import { AppModule } from './app.module.js';
import { CategoriesService } from './categories/categories.service.js';
import { Category } from './categories/category.schema.js';
import type { Env } from './config/env.js';
import { KnowledgeEntry } from './knowledge/knowledge.schemas.js';
import { KnowledgeService } from './knowledge/knowledge.service.js';
import { SEED_ENTRIES } from './seed-data.js';
import { SettingsService } from './settings/settings.service.js';

async function seed(): Promise<void> {
  const app = await NestFactory.createApplicationContext(AppModule, { logger: ['error', 'warn'] });
  const logger = new Logger('Seed');
  const config = app.get<ConfigService<Env, true>>(ConfigService);

  const email = config.get('ADMIN_EMAIL', { infer: true });
  const admins = app.get(AdminsService);
  const adminCreated = await admins.ensureSeedAdmin(email, config.get('ADMIN_PASSWORD', { infer: true }));
  logger.log(adminCreated ? `Admin oluşturuldu: ${email}` : `Admin zaten var: ${email}`);

  const categoriesCreated = await app.get(CategoriesService).ensureDefaults();
  logger.log(`Yeni kategori sayısı: ${categoriesCreated}`);

  await app.get(SettingsService).get();
  logger.log('Varsayılan ayarlar hazır.');

  const adminId = (await admins.findByEmail(email))?.id as string;
  const categories = app.get<Model<Category>>(getModelToken(Category.name), { strict: false });
  const entries = app.get<Model<KnowledgeEntry>>(getModelToken(KnowledgeEntry.name), { strict: false });
  const knowledge = app.get(KnowledgeService);

  let created = 0;
  let failed = 0;
  for (const seedEntry of SEED_ENTRIES) {
    if (await entries.exists({ title: seedEntry.title })) continue;
    const category = await categories.findOne({ slug: seedEntry.categorySlug });
    if (!category) continue;
    const view = await knowledge.create(
      { title: seedEntry.title, content: seedEntry.content, type: 'faq', categoryId: category.id as string, tags: seedEntry.tags },
      adminId,
    );
    created++;
    if (view.indexStatus !== 'indexed') failed++;
  }
  logger.log(`Yeni bilgi kaydı: ${created}${failed ? ` (${failed} tanesi indekslenemedi, sonra "yeniden indeksle" çalıştırın)` : ''}`);

  await app.close();
}

await seed();
