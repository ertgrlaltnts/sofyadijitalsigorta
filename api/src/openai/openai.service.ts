import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import type { Env } from '../config/env.js';

const EMBEDDING_BATCH_SIZE = 96;

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface StreamChatOptions {
  model?: string;
  temperature: number;
  messages: ChatMessage[];
  signal?: AbortSignal;
}

export interface ChatChunk {
  delta?: string;
  usage?: { promptTokens: number; completionTokens: number };
}

@Injectable()
export class OpenaiService {
  private readonly logger = new Logger(OpenaiService.name);
  private readonly client: OpenAI;
  private readonly fixedTemperatureModels = new Set<string>();
  readonly defaultChatModel: string;
  readonly embeddingModel: string;

  constructor(config: ConfigService<Env, true>) {
    this.client = new OpenAI({ apiKey: config.get('OPENAI_API_KEY', { infer: true }), timeout: 30_000, maxRetries: 2 });
    this.defaultChatModel = config.get('OPENAI_CHAT_MODEL', { infer: true });
    this.embeddingModel = config.get('OPENAI_EMBEDDING_MODEL', { infer: true });
  }

  async *streamChat(options: StreamChatOptions): AsyncGenerator<ChatChunk> {
    const model = options.model || this.defaultChatModel;
    const stream = await this.openStream(model, options);
    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content;
      if (delta) yield { delta };
      if (chunk.usage) {
        yield { usage: { promptTokens: chunk.usage.prompt_tokens, completionTokens: chunk.usage.completion_tokens } };
      }
    }
  }

  private async openStream(model: string, options: StreamChatOptions) {
    const request = {
      model,
      messages: options.messages,
      stream: true as const,
      stream_options: { include_usage: true },
    };
    const requestOptions = { signal: options.signal };
    if (this.fixedTemperatureModels.has(model)) return this.client.chat.completions.create(request, requestOptions);
    try {
      return await this.client.chat.completions.create({ ...request, temperature: options.temperature }, requestOptions);
    } catch (error) {
      if (error instanceof OpenAI.APIError && error.param === 'temperature') {
        this.fixedTemperatureModels.add(model);
        return this.client.chat.completions.create(request, requestOptions);
      }
      throw error;
    }
  }

  async embed(texts: string[]): Promise<number[][]> {
    const vectors: number[][] = [];
    for (let i = 0; i < texts.length; i += EMBEDDING_BATCH_SIZE) {
      const batch = texts.slice(i, i + EMBEDDING_BATCH_SIZE);
      try {
        const response = await this.client.embeddings.create({ model: this.embeddingModel, input: batch });
        vectors.push(...response.data.sort((a, b) => a.index - b.index).map((item) => item.embedding));
      } catch (error) {
        this.logger.error('Embedding isteği başarısız', error instanceof Error ? error.stack : String(error));
        throw error;
      }
    }
    return vectors;
  }
}
