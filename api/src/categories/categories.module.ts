import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { KnowledgeEntry, KnowledgeEntrySchema } from '../knowledge/knowledge.schemas.js';
import { CategoriesController } from './categories.controller.js';
import { CategoriesService } from './categories.service.js';
import { Category, CategorySchema } from './category.schema.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
      { name: KnowledgeEntry.name, schema: KnowledgeEntrySchema },
    ]),
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService],
})
export class CategoriesModule {}
