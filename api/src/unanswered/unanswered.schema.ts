import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { type HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';

export const UNANSWERED_STATUSES = ['open', 'resolved', 'ignored'] as const;
export type UnansweredStatus = (typeof UNANSWERED_STATUSES)[number];

@Schema({ collection: 'unanswered_questions', timestamps: true })
export class UnansweredQuestion {
  @Prop({ required: true })
  question: string;

  @Prop({ required: true, unique: true })
  normalizedQuestion: string;

  @Prop({ default: 1 })
  count: number;

  @Prop({ default: () => new Date() })
  lastAskedAt: Date;

  @Prop({ type: String, enum: UNANSWERED_STATUSES, default: 'open', index: true })
  status: UnansweredStatus;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'KnowledgeEntry', default: null })
  resolvedEntryId: Types.ObjectId | null;

  createdAt: Date;
  updatedAt: Date;
}

export type UnansweredQuestionDocument = HydratedDocument<UnansweredQuestion>;
export const UnansweredQuestionSchema = SchemaFactory.createForClass(UnansweredQuestion);
