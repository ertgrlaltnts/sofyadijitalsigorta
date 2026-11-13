import type { Schema } from 'mongoose';
import { ConversationSchema, MessageSchema } from '../conversations/conversation.schemas.js';
import { KnowledgeChunkSchema, KnowledgeEntrySchema } from '../knowledge/knowledge.schemas.js';
import { UnansweredQuestionSchema } from '../unanswered/unanswered.schema.js';
import { definedOnly } from './defined-only.js';

describe('şema tipleri', () => {
  const objectIdPaths: [string, Schema, string[]][] = [
    ['KnowledgeEntry', KnowledgeEntrySchema, ['categoryId', 'createdBy', 'updatedBy']],
    ['KnowledgeChunk', KnowledgeChunkSchema, ['entryId']],
    ['Message', MessageSchema, ['conversationId']],
    ['UnansweredQuestion', UnansweredQuestionSchema, ['resolvedEntryId']],
  ];

  it.each(objectIdPaths)('%s ilişki alanları ObjectId olarak tanımlı (Mixed olursa string sorgular eşleşmez)', (_name, schema, paths) => {
    for (const path of paths) expect(schema.path(path).instance).toBe('ObjectId');
  });

  it('Conversation alanları beklenen tiplerde', () => {
    expect(ConversationSchema.path('channel').instance).toBe('String');
  });
});

describe('definedOnly', () => {
  it('undefined alanları atar, null ve boş değerleri korur', () => {
    expect(definedOnly({ a: 1, b: undefined, c: null, d: '', e: false })).toEqual({ a: 1, c: null, d: '', e: false });
  });
});
