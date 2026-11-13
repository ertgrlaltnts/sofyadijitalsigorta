import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { ParseObjectIdPipe } from '../common/parse-object-id.pipe.js';
import { ListConversationsQuery } from './conversations.dto.js';
import { ConversationsService, type ConversationDetail, type ConversationListItem } from './conversations.service.js';

@Controller('admin/conversations')
@UseGuards(JwtAuthGuard)
export class ConversationsController {
  constructor(private readonly conversations: ConversationsService) {}

  @Get()
  list(@Query() query: ListConversationsQuery): Promise<{ items: ConversationListItem[]; total: number; page: number; limit: number }> {
    return this.conversations.list(query);
  }

  @Get(':id')
  detail(@Param('id', ParseObjectIdPipe) id: string): Promise<ConversationDetail> {
    return this.conversations.detail(id);
  }
}
