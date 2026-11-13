import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { type HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';

export const ENTRY_TYPES = ['faq', 'article'] as const;
export type EntryType = (typeof ENTRY_TYPES)[number];

export const INDEX_STATUSES = ['pending', 'indexed', 'failed'] as const;
export type IndexStatus = (typeof INDEX_STATUSES)[number];

@Schema({ collection: 'knowledge_entries', timestamps: true })
export class KnowledgeEntry {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ type: String, required: true, enum: ENTRY_TYPES })
  type: EntryType;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Category', required: true, index: true })
  categoryId: Types.ObjectId;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ default: true, index: true })
  isActive: boolean;

  @Prop({ type: String, enum: INDEX_STATUSES, default: 'pending' })
  indexStatus: IndexStatus;

  @Prop({ type: String, default: null })
  indexError: string | null;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Admin', default: null })
  createdBy: Types.ObjectId | null;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Admin', default: null })
  updatedBy: Types.ObjectId | null;

  createdAt: Date;
  updatedAt: Date;
}

export type KnowledgeEntryDocument = HydratedDocument<KnowledgeEntry>;
export const KnowledgeEntrySchema = SchemaFactory.createForClass(KnowledgeEntry);

@Schema({ collection: 'knowledge_chunks' })
export class KnowledgeChunk {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'KnowledgeEntry', required: true, index: true })
  entryId: Types.ObjectId;

  @Prop({ required: true })
  chunkIndex: number;

  @Prop({ required: true })
  text: string;

  @Prop({ type: [Number], required: true })
  embedding: number[];

  @Prop({ type: [Number] })
  titleEmbedding?: number[];

  @Prop({ default: true, index: true })
  isActive: boolean;
}

export type KnowledgeChunkDocument = HydratedDocument<KnowledgeChunk>;
export const KnowledgeChunkSchema = SchemaFactory.createForClass(KnowledgeChunk);
