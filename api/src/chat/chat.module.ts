import { Module } from '@nestjs/common';
import { ConversationsModule } from '../conversations/conversations.module.js';
import { KnowledgeModule } from '../knowledge/knowledge.module.js';
import { OpenaiModule } from '../openai/openai.module.js';
import { QuotesModule } from '../quotes/quotes.module.js';
import { SettingsModule } from '../settings/settings.module.js';
import { UnansweredModule } from '../unanswered/unanswered.module.js';
import { ChatController } from './chat.controller.js';
import { ChatService } from './chat.service.js';

@Module({
  imports: [
    ConversationsModule,
    KnowledgeModule,
    OpenaiModule,
    QuotesModule,
    SettingsModule,
    UnansweredModule,
  ],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
