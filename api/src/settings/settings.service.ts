import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import { definedOnly } from '../common/defined-only.js';
import type { UpdateSettingsDto } from './settings.dto.js';
import { Settings } from './settings.schema.js';

export interface SettingsView {
  assistantName: string;
  welcomeMessage: string;
  suggestedQuestions: string[];
  systemPrompt: string;
  similarityThreshold: number;
  topK: number;
  historyLimit: number;
  temperature: number;
  allowGeneralAnswers: boolean;
  fallbackMessage: string;
  quoteUrl: string;
  contactPhone: string;
  contactWhatsapp: string;
  contactEmail: string;
  chatModel: string;
}

export interface PublicChatConfig {
  assistantName: string;
  welcomeMessage: string;
  suggestedQuestions: string[];
}

@Injectable()
export class SettingsService {
  constructor(@InjectModel(Settings.name) private readonly model: Model<Settings>) {}

  async get(): Promise<SettingsView> {
    const doc = await this.model.findOneAndUpdate({}, { $setOnInsert: {} }, { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true });
    return {
      assistantName: doc.assistantName,
      welcomeMessage: doc.welcomeMessage,
      suggestedQuestions: doc.suggestedQuestions,
      systemPrompt: doc.systemPrompt,
      similarityThreshold: doc.similarityThreshold,
      topK: doc.topK,
      historyLimit: doc.historyLimit,
      temperature: doc.temperature,
      allowGeneralAnswers: doc.allowGeneralAnswers,
      fallbackMessage: doc.fallbackMessage,
      quoteUrl: doc.quoteUrl,
      contactPhone: doc.contactPhone,
      contactWhatsapp: doc.contactWhatsapp,
      contactEmail: doc.contactEmail,
      chatModel: doc.chatModel,
    };
  }

  async update(dto: UpdateSettingsDto): Promise<SettingsView> {
    await this.get();
    await this.model.updateOne({}, { $set: definedOnly(dto) });
    return this.get();
  }

  async publicConfig(): Promise<PublicChatConfig> {
    const { assistantName, welcomeMessage, suggestedQuestions } = await this.get();
    return { assistantName, welcomeMessage, suggestedQuestions };
  }
}
