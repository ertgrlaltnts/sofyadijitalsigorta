import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model, Types } from 'mongoose';
import { OpenaiService } from '../openai/openai.service.js';
import { KnowledgeChunk, KnowledgeEntry } from './knowledge.schemas.js';

export interface RetrievedChunk {
  chunkId: string;
  entryId: string;
  title: string;
  text: string;
  score: number;
}

interface CachedChunk {
  chunkId: string;
  entryId: string;
  title: string;
  text: string;
  vector: Float32Array;
  titleVector?: Float32Array;
}

function dot(a: Float32Array, b: Float32Array): number {
  let sum = 0;
  for (let i = 0; i < a.length; i++) sum += a[i] * b[i];
  return sum;
}

function normalize(values: number[]): Float32Array {
  const vector = Float32Array.from(values);
  let norm = 0;
  for (const v of vector) norm += v * v;
  norm = Math.sqrt(norm) || 1;
  for (let i = 0; i < vector.length; i++) vector[i] /= norm;
  return vector;
}

@Injectable()
export class RetrievalService {
  private cache: Promise<CachedChunk[]> | null = null;

  constructor(
    @InjectModel(KnowledgeChunk.name) private readonly chunks: Model<KnowledgeChunk>,
    @InjectModel(KnowledgeEntry.name) private readonly entries: Model<KnowledgeEntry>,
    private readonly openai: OpenaiService,
  ) {}

  invalidate(): void {
    this.cache = null;
  }

  async retrieve(query: string, k: number): Promise<RetrievedChunk[]> {
    // "daSK" ile "dask" farklı skor veriyordu; sorgu küçük harfe çevrilir (Türkçe kurallarıyla).
    const [embedding] = await this.openai.embed([query.toLocaleLowerCase('tr')]);
    const queryVector = normalize(embedding);
    const cached = await this.load();

    // Başka bir modelle indekslenmiş (boyutu farklı) chunk'lar karşılaştırılamaz; yeniden indekslenene kadar atlanır.
    const scored = cached
      .filter((chunk) => chunk.vector.length === queryVector.length)
      .map((chunk): RetrievedChunk => {
        let score = dot(queryVector, chunk.vector);
        if (chunk.titleVector?.length === queryVector.length) score = Math.max(score, dot(queryVector, chunk.titleVector));
        return { chunkId: chunk.chunkId, entryId: chunk.entryId, title: chunk.title, text: chunk.text, score };
      });
    return scored.sort((a, b) => b.score - a.score).slice(0, k);
  }

  private load(): Promise<CachedChunk[]> {
    this.cache ??= this.readFromDb().catch((error: unknown) => {
      this.cache = null;
      throw error;
    });
    return this.cache;
  }

  private async readFromDb(): Promise<CachedChunk[]> {
    const chunks = await this.chunks.find({ isActive: true }).lean();
    const entryIds = [...new Set(chunks.map((chunk) => chunk.entryId.toString()))];
    const entries = await this.entries.find({ _id: { $in: entryIds }, isActive: true }, { title: 1 }).lean();
    const titles = new Map<string, string>(entries.map((entry) => [(entry._id as Types.ObjectId).toString(), entry.title]));

    return chunks
      .filter((chunk) => titles.has(chunk.entryId.toString()))
      .map((chunk) => ({
        chunkId: (chunk._id as Types.ObjectId).toString(),
        entryId: chunk.entryId.toString(),
        title: titles.get(chunk.entryId.toString()) ?? '',
        text: chunk.text,
        vector: normalize(chunk.embedding),
        titleVector: chunk.titleEmbedding?.length ? normalize(chunk.titleEmbedding) : undefined,
      }));
  }
}
