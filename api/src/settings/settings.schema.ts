import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { HydratedDocument } from 'mongoose';
import { DEFAULT_SETTINGS } from './settings.defaults.js';

@Schema({ collection: 'settings', timestamps: true })
export class Settings {
  @Prop({ default: DEFAULT_SETTINGS.assistantName })
  assistantName: string;

  @Prop({ default: DEFAULT_SETTINGS.welcomeMessage })
  welcomeMessage: string;

  @Prop({ type: [String], default: DEFAULT_SETTINGS.suggestedQuestions })
  suggestedQuestions: string[];

  @Prop({ default: DEFAULT_SETTINGS.systemPrompt })
  systemPrompt: string;

  @Prop({ default: DEFAULT_SETTINGS.similarityThreshold })
  similarityThreshold: number;

  @Prop({ default: DEFAULT_SETTINGS.topK })
  topK: number;

  @Prop({ default: DEFAULT_SETTINGS.historyLimit })
  historyLimit: number;

  @Prop({ default: DEFAULT_SETTINGS.temperature })
  temperature: number;

  @Prop({ default: DEFAULT_SETTINGS.allowGeneralAnswers })
  allowGeneralAnswers: boolean;

  @Prop({ default: DEFAULT_SETTINGS.fallbackMessage })
  fallbackMessage: string;

  @Prop({ default: '' })
  quoteUrl: string;

  @Prop({ default: '' })
  contactPhone: string;

  @Prop({ default: '' })
  contactWhatsapp: string;

  @Prop({ default: '' })
  contactEmail: string;

  @Prop({ default: '' })
  chatModel: string;
}

export type SettingsDocument = HydratedDocument<Settings>;
export const SettingsSchema = SchemaFactory.createForClass(Settings);
