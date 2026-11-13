import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Conversation, ConversationSchema, Message, MessageSchema } from '../conversations/conversation.schemas.js';
import { ConversationsModule } from '../conversations/conversations.module.js';
import { UnansweredQuestion, UnansweredQuestionSchema } from '../unanswered/unanswered.schema.js';
import { AnalyticsController } from './analytics.controller.js';
import { AnalyticsService } from './analytics.service.js';

@Module({
  imports: [
    ConversationsModule,
    MongooseModule.forFeature([
      { name: Conversation.name, schema: ConversationSchema },
      { name: Message.name, schema: MessageSchema },
      { name: UnansweredQuestion.name, schema: UnansweredQuestionSchema },
    ]),
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}
