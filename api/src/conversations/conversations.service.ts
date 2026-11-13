import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types, type Model, type QueryFilter } from 'mongoose';
import type { ListConversationsQuery } from './conversations.dto.js';
import {
  Conversation,
  Message,
  type AnswerSource,
  type Channel,
  type ConversationDocument,
  type Feedback,
  type MessageDocument,
} from './conversation.schemas.js';

export interface HistoryMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface NewMessage {
  conversationId: string;
  role: 'user' | 'assistant';
  content: string;
  source?: AnswerSource;
  sources?: { entryId: string; chunkId: string; title: string; score: number }[];
  promptTokens?: number;
  completionTokens?: number;
  latencyMs?: number;
}

export interface ConversationListItem {
  id: string;
  sessionId: string;
  channel: Channel;
  messageCount: number;
  lastMessageAt: Date;
  createdAt: Date;
  preview: string;
  knowledgeCount: number;
  generalCount: number;
  upCount: number;
  downCount: number;
}

export interface MessageView {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  source: AnswerSource | null;
  sources: { entryId: string; chunkId: string; title: string; score: number }[];
  feedback: Feedback | null;
  promptTokens: number | null;
  completionTokens: number | null;
  latencyMs: number | null;
  createdAt: Date;
}

export interface ConversationDetail {
  id: string;
  sessionId: string;
  channel: Channel;
  messageCount: number;
  createdAt: Date;
  lastMessageAt: Date;
  messages: MessageView[];
}

interface ConversationStats {
  _id: Types.ObjectId;
  preview: string;
  knowledgeCount: number;
  generalCount: number;
  upCount: number;
  downCount: number;
}

@Injectable()
export class ConversationsService {
  constructor(
    @InjectModel(Conversation.name) private readonly conversations: Model<Conversation>,
    @InjectModel(Message.name) private readonly messages: Model<Message>,
  ) {}

  findOrCreate(sessionId: string, channel: Channel, userAgent: string, ipHash: string): Promise<ConversationDocument> {
    return this.conversations.findOneAndUpdate(
      { sessionId, channel },
      { $setOnInsert: { sessionId, channel, userAgent, ipHash, messageCount: 0, lastMessageAt: new Date() } },
      { upsert: true, returnDocument: 'after' },
    );
  }

  async recentMessages(conversationId: string, limit: number): Promise<HistoryMessage[]> {
    if (limit <= 0) return [];
    const docs = await this.messages.find({ conversationId }).sort({ createdAt: -1 }).limit(limit);
    return docs.reverse().map((doc) => ({ role: doc.role, content: doc.content }));
  }

  async addMessage(data: NewMessage): Promise<string> {
    const doc = await this.messages.create({
      ...data,
      conversationId: new Types.ObjectId(data.conversationId),
      sources: (data.sources ?? []).map((s) => ({
        entryId: new Types.ObjectId(s.entryId),
        chunkId: new Types.ObjectId(s.chunkId),
        title: s.title,
        score: s.score,
      })),
    });
    await this.conversations.updateOne({ _id: data.conversationId }, { $inc: { messageCount: 1 }, $set: { lastMessageAt: new Date() } });
    return doc.id as string;
  }

  async setFeedback(messageId: string, feedback: Feedback | null): Promise<void> {
    const result = await this.messages.updateOne({ _id: messageId, role: 'assistant' }, { feedback });
    if (result.matchedCount === 0) throw new NotFoundException('Mesaj bulunamadı.');
  }

  async list(query: ListConversationsQuery): Promise<{ items: ConversationListItem[]; total: number; page: number; limit: number }> {
    const filter: QueryFilter<Conversation> = {};
    if (query.channel) filter.channel = query.channel;
    if (query.from || query.to) {
      filter.lastMessageAt = {
        ...(query.from && { $gte: new Date(query.from) }),
        ...(query.to && { $lte: new Date(query.to) }),
      };
    }

    const messageFilter: QueryFilter<Message> = {};
    if (query.source) messageFilter.source = query.source;
    if (query.feedback) messageFilter.feedback = query.feedback;
    if (query.source || query.feedback) {
      filter._id = { $in: await this.messages.distinct('conversationId', messageFilter) };
    }

    const [docs, total] = await Promise.all([
      this.conversations
        .find(filter)
        .sort({ lastMessageAt: -1 })
        .skip((query.page - 1) * query.limit)
        .limit(query.limit),
      this.conversations.countDocuments(filter),
    ]);

    const stats = await this.statsFor(docs.map((doc) => doc._id));
    const items = docs.map((doc): ConversationListItem => {
      const s = stats.get(doc.id as string);
      return {
        id: doc.id as string,
        sessionId: doc.sessionId,
        channel: doc.channel,
        messageCount: doc.messageCount,
        lastMessageAt: doc.lastMessageAt,
        createdAt: doc.createdAt,
        preview: s?.preview ?? '',
        knowledgeCount: s?.knowledgeCount ?? 0,
        generalCount: s?.generalCount ?? 0,
        upCount: s?.upCount ?? 0,
        downCount: s?.downCount ?? 0,
      };
    });
    return { items, total, page: query.page, limit: query.limit };
  }

  async detail(id: string): Promise<ConversationDetail> {
    const conversation = await this.conversations.findById(id);
    if (!conversation) throw new NotFoundException('Sohbet bulunamadı.');
    const messages = await this.messages.find({ conversationId: conversation._id }).sort({ createdAt: 1 });
    return {
      id: conversation.id as string,
      sessionId: conversation.sessionId,
      channel: conversation.channel,
      messageCount: conversation.messageCount,
      createdAt: conversation.createdAt,
      lastMessageAt: conversation.lastMessageAt,
      messages: messages.map((m) => this.toMessageView(m)),
    };
  }

  private async statsFor(ids: Types.ObjectId[]): Promise<Map<string, ConversationStats>> {
    const rows = await this.messages.aggregate<ConversationStats>([
      { $match: { conversationId: { $in: ids } } },
      { $sort: { createdAt: 1, role: -1 } },
      {
        $group: {
          _id: '$conversationId',
          preview: { $first: { $cond: [{ $eq: ['$role', 'user'] }, '$content', ''] } },
          knowledgeCount: { $sum: { $cond: [{ $eq: ['$source', 'knowledge'] }, 1, 0] } },
          generalCount: { $sum: { $cond: [{ $eq: ['$source', 'general'] }, 1, 0] } },
          upCount: { $sum: { $cond: [{ $eq: ['$feedback', 'up'] }, 1, 0] } },
          downCount: { $sum: { $cond: [{ $eq: ['$feedback', 'down'] }, 1, 0] } },
        },
      },
    ]);
    return new Map(rows.map((row) => [row._id.toString(), row]));
  }

  private toMessageView(m: MessageDocument): MessageView {
    return {
      id: m.id as string,
      role: m.role,
      content: m.content,
      source: m.source,
      sources: m.sources.map((s) => ({
        entryId: s.entryId.toString(),
        chunkId: s.chunkId.toString(),
        title: s.title,
        score: s.score,
      })),
      feedback: m.feedback,
      promptTokens: m.promptTokens,
      completionTokens: m.completionTokens,
      latencyMs: m.latencyMs,
      createdAt: m.createdAt,
    };
  }
}
