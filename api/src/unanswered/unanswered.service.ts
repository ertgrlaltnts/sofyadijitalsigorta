import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types, type Model, type QueryFilter } from 'mongoose';
import { IsIn, IsInt, IsMongoId, IsOptional, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import {
  UNANSWERED_STATUSES,
  UnansweredQuestion,
  type UnansweredQuestionDocument,
  type UnansweredStatus,
} from './unanswered.schema.js';

export class ListUnansweredQuery {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit = 20;

  @IsOptional()
  @IsIn(UNANSWERED_STATUSES)
  status?: UnansweredStatus;
}

export class UpdateUnansweredDto {
  @IsIn(UNANSWERED_STATUSES)
  status: UnansweredStatus;

  @IsOptional()
  @IsMongoId()
  resolvedEntryId?: string;
}

export interface UnansweredView {
  id: string;
  question: string;
  count: number;
  lastAskedAt: Date;
  status: UnansweredStatus;
  resolvedEntryId: string | null;
}

export function normalizeQuestion(text: string): string {
  return text
    .toLocaleLowerCase('tr-TR')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

@Injectable()
export class UnansweredService {
  constructor(@InjectModel(UnansweredQuestion.name) private readonly model: Model<UnansweredQuestion>) {}

  async record(question: string): Promise<void> {
    const normalizedQuestion = normalizeQuestion(question);
    if (!normalizedQuestion) return;
    const existing = await this.model.findOneAndUpdate(
      { normalizedQuestion },
      { $inc: { count: 1 }, $set: { lastAskedAt: new Date() }, $setOnInsert: { question, status: 'open' } },
      { upsert: true, returnDocument: 'after' },
    );
    if (existing.status === 'resolved') {
      await this.model.updateOne({ _id: existing._id }, { status: 'open', resolvedEntryId: null });
    }
  }

  async list(query: ListUnansweredQuery): Promise<{ items: UnansweredView[]; total: number; page: number; limit: number }> {
    const filter: QueryFilter<UnansweredQuestion> = query.status ? { status: query.status } : {};
    const [docs, total] = await Promise.all([
      this.model
        .find(filter)
        .sort({ count: -1, lastAskedAt: -1 })
        .skip((query.page - 1) * query.limit)
        .limit(query.limit),
      this.model.countDocuments(filter),
    ]);
    return { items: docs.map((doc) => this.toView(doc)), total, page: query.page, limit: query.limit };
  }

  async update(id: string, dto: UpdateUnansweredDto): Promise<UnansweredView> {
    const doc = await this.model.findByIdAndUpdate(
      id,
      {
        status: dto.status,
        resolvedEntryId: dto.status === 'resolved' && dto.resolvedEntryId ? new Types.ObjectId(dto.resolvedEntryId) : null,
      },
      { returnDocument: 'after' },
    );
    if (!doc) throw new NotFoundException('Soru bulunamadı.');
    return this.toView(doc);
  }

  private toView(doc: UnansweredQuestionDocument): UnansweredView {
    return {
      id: doc.id as string,
      question: doc.question,
      count: doc.count,
      lastAskedAt: doc.lastAskedAt,
      status: doc.status,
      resolvedEntryId: doc.resolvedEntryId?.toString() ?? null,
    };
  }
}
