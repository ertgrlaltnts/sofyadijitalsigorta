export interface Page<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export type EntryType = "faq" | "article";
export type IndexStatus = "pending" | "indexed" | "failed";
export type AnswerSource = "knowledge" | "general";
export type Channel = "web" | "playground";
export type Feedback = "up" | "down";
export type UnansweredStatus = "open" | "resolved" | "ignored";

export interface Category {
  id: string;
  name: string;
  slug: string;
  order: number;
  entryCount: number;
}

export interface KnowledgeListItem {
  id: string;
  title: string;
  type: EntryType;
  category: { id: string; name: string } | null;
  tags: string[];
  isActive: boolean;
  indexStatus: IndexStatus;
  indexError: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface KnowledgeDetail extends KnowledgeListItem {
  content: string;
}

export interface ReindexSummary {
  total: number;
  indexed: number;
  failed: number;
}

export interface SourceRef {
  entryId: string;
  chunkId: string;
  title: string;
  score: number;
}

export interface ConversationListItem {
  id: string;
  sessionId: string;
  channel: Channel;
  messageCount: number;
  lastMessageAt: string;
  createdAt: string;
  preview: string;
  knowledgeCount: number;
  generalCount: number;
  upCount: number;
  downCount: number;
}

export interface MessageView {
  id: string;
  role: "user" | "assistant";
  content: string;
  source: AnswerSource | null;
  sources: SourceRef[];
  feedback: Feedback | null;
  promptTokens: number | null;
  completionTokens: number | null;
  latencyMs: number | null;
  createdAt: string;
}

export interface ConversationDetail {
  id: string;
  sessionId: string;
  channel: Channel;
  messageCount: number;
  createdAt: string;
  lastMessageAt: string;
  messages: MessageView[];
}

export interface UnansweredItem {
  id: string;
  question: string;
  count: number;
  lastAskedAt: string;
  status: UnansweredStatus;
  resolvedEntryId: string | null;
}

export interface Settings {
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

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
}

export interface RetrievalDebug {
  threshold: number;
  error: string | null;
  chunks: (SourceRef & { text: string; used: boolean })[];
}

export type ChatEvent =
  | { type: "meta"; source: AnswerSource; sources: SourceRef[]; debug?: RetrievalDebug }
  | { type: "delta"; text: string }
  | { type: "done"; messageId: string }
  | { type: "error"; message: string };

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
