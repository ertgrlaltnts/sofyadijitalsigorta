import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from '../categories/category.schema.js';
import { OpenaiModule } from '../openai/openai.module.js';
import { KnowledgeController } from './knowledge.controller.js';
import { KnowledgeChunk, KnowledgeChunkSchema, KnowledgeEntry, KnowledgeEntrySchema } from './knowledge.schemas.js';
import { KnowledgeService } from './knowledge.service.js';
import { RetrievalService } from './retrieval.service.js';

@Module({
  imports: [
    OpenaiModule,
    MongooseModule.forFeature([
      { name: KnowledgeEntry.name, schema: KnowledgeEntrySchema },
      { name: KnowledgeChunk.name, schema: KnowledgeChunkSchema },
      { name: Category.name, schema: CategorySchema },
    ]),
  ],
  controllers: [KnowledgeController],
  providers: [KnowledgeService, RetrievalService],
  exports: [KnowledgeService, RetrievalService],
})
export class KnowledgeModule {}
