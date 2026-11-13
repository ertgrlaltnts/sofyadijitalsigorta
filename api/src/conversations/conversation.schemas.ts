import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { type HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';

export const CHANNELS = ['web', 'playground'] as const;
export type Channel = (typeof CHANNELS)[number];

export const ANSWER_SOURCES = ['knowledge', 'general'] as const;
export type AnswerSource = (typeof ANSWER_SOURCES)[number];

export type Feedback = 'up' | 'down';

@Schema({ collection: 'conversations', timestamps: true })
export class Conversation {
  @Prop({ required: true, index: true })
  sessionId: string;

  @Prop({ type: String, required: true, enum: CHANNELS })
  channel: Channel;

  @Prop({ default: 0 })
  messageCount: number;

  @Prop({ default: () => new Date(), index: true })
  lastMessageAt: Date;

  @Prop({ default: '' })
  userAgent: string;

  @Prop({ default: '' })
  ipHash: string;

  createdAt: Date;
  updatedAt: Date;
}

export type ConversationDocument = HydratedDocument<Conversation>;
export const ConversationSchema = SchemaFactory.createForClass(Conversation);
ConversationSchema.index({ sessionId: 1, channel: 1 }, { unique: true });

export class MessageSource {
  @Prop({ type: MongooseSchema.Types.ObjectId, required: true })
  entryId: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, required: true })
  chunkId: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  score: number;
}

@Schema({ collection: 'messages', timestamps: true })
export class Message {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Conversation', required: true, index: true })
  conversationId: Types.ObjectId;

  @Prop({ type: String, required: true, enum: ['user', 'assistant'] })
  role: 'user' | 'assistant';

  @Prop({ required: true })
  content: string;

  @Prop({ type: String, enum: ANSWER_SOURCES, default: null })
  source: AnswerSource | null;

  @Prop({ type: [{ type: Object }], default: [] })
  sources: { entryId: Types.ObjectId; chunkId: Types.ObjectId; title: string; score: number }[];

  @Prop({ type: Number, default: null })
  promptTokens: number | null;

  @Prop({ type: Number, default: null })
  completionTokens: number | null;

  @Prop({ type: Number, default: null })
  latencyMs: number | null;

  @Prop({ type: String, enum: ['up', 'down'], default: null })
  feedback: Feedback | null;

  createdAt: Date;
  updatedAt: Date;
}

export type MessageDocument = HydratedDocument<Message>;
export const MessageSchema = SchemaFactory.createForClass(Message);
MessageSchema.index({ createdAt: -1 });
