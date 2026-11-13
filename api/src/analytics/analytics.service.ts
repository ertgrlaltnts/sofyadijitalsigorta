import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import { Conversation, Message } from '../conversations/conversation.schemas.js';
import { ConversationsService, type ConversationListItem } from '../conversations/conversations.service.js';
import { UnansweredQuestion } from '../unanswered/unanswered.schema.js';

const TIME_ZONE = 'Europe/Istanbul';
const UTC_OFFSET = '+03:00';
const DAYS = 30;
const DAY_MS = 86_400_000;

export interface AnalyticsOverview {
  kpis: {
    todayConversations: number;
    totalMessages: number;
    knowledgeRate: number | null;
    openUnanswered: number;
    positiveFeedbackRate: number | null;
  };
  daily: { date: string; knowledge: number; general: number }[];
  topUnanswered: { id: string; question: string; count: number }[];
  recentConversations: ConversationListItem[];
}

interface MessageTotals {
  total: number;
  knowledge: number;
  general: number;
  up: number;
  down: number;
}

interface DailyRow {
  _id: { day: string; source: 'knowledge' | 'general' };
  count: number;
}

const dayKey = (date: Date): string => new Intl.DateTimeFormat('en-CA', { timeZone: TIME_ZONE }).format(date);
const ratio = (part: number, whole: number): number | null => (whole === 0 ? null : Math.round((part / whole) * 1000) / 10);

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(Conversation.name) private readonly conversations: Model<Conversation>,
    @InjectModel(Message.name) private readonly messages: Model<Message>,
    @InjectModel(UnansweredQuestion.name) private readonly unanswered: Model<UnansweredQuestion>,
    private readonly conversationsService: ConversationsService,
  ) {}

  async overview(includePlayground: boolean): Promise<AnalyticsOverview> {
    const channelFilter = includePlayground ? {} : { channel: 'web' as const };
    const todayStart = new Date(`${dayKey(new Date())}T00:00:00${UTC_OFFSET}`);
    const since = new Date(todayStart.getTime() - (DAYS - 1) * DAY_MS);

    const inScope = (extra: Record<string, unknown> = {}) => [
      { $lookup: { from: 'conversations', localField: 'conversationId', foreignField: '_id', as: 'conversation' } },
      { $match: { ...(includePlayground ? {} : { 'conversation.channel': 'web' }), ...extra } },
    ];

    const [todayConversations, totalsRows, dailyRows, openUnanswered, topUnanswered, recent] = await Promise.all([
      this.conversations.countDocuments({ ...channelFilter, createdAt: { $gte: todayStart } }),
      this.messages.aggregate<MessageTotals>([
        ...inScope(),
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            knowledge: { $sum: { $cond: [{ $eq: ['$source', 'knowledge'] }, 1, 0] } },
            general: { $sum: { $cond: [{ $eq: ['$source', 'general'] }, 1, 0] } },
            up: { $sum: { $cond: [{ $eq: ['$feedback', 'up'] }, 1, 0] } },
            down: { $sum: { $cond: [{ $eq: ['$feedback', 'down'] }, 1, 0] } },
          },
        },
      ]),
      this.messages.aggregate<DailyRow>([
        ...inScope({ role: 'assistant', createdAt: { $gte: since } }),
        {
          $group: {
            _id: { day: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt', timezone: TIME_ZONE } }, source: '$source' },
            count: { $sum: 1 },
          },
        },
      ]),
      this.unanswered.countDocuments({ status: 'open' }),
      this.unanswered.find({ status: 'open' }).sort({ count: -1, lastAskedAt: -1 }).limit(5),
      this.conversationsService.list({ page: 1, limit: 5, ...(includePlayground ? {} : { channel: 'web' as const }) }),
    ]);

    const totals = totalsRows[0] ?? { total: 0, knowledge: 0, general: 0, up: 0, down: 0 };
    const byDay = new Map<string, { knowledge: number; general: number }>();
    for (const row of dailyRows) {
      const entry = byDay.get(row._id.day) ?? { knowledge: 0, general: 0 };
      entry[row._id.source] = row.count;
      byDay.set(row._id.day, entry);
    }

    const daily = Array.from({ length: DAYS }, (_, index) => {
      const date = dayKey(new Date(since.getTime() + index * DAY_MS));
      return { date, knowledge: byDay.get(date)?.knowledge ?? 0, general: byDay.get(date)?.general ?? 0 };
    });

    return {
      kpis: {
        todayConversations,
        totalMessages: totals.total,
        knowledgeRate: ratio(totals.knowledge, totals.knowledge + totals.general),
        openUnanswered,
        positiveFeedbackRate: ratio(totals.up, totals.up + totals.down),
      },
      daily,
      topUnanswered: topUnanswered.map((doc) => ({ id: doc.id as string, question: doc.question, count: doc.count })),
      recentConversations: recent.items,
    };
  }
}
