import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  Ip,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Throttle } from '@nestjs/throttler';
import { createHash } from 'node:crypto';
import type { Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { pipeSse } from '../common/sse.js';
import type { Env } from '../config/env.js';
import { ConversationsService } from '../conversations/conversations.service.js';
import {
  SettingsService,
  type PublicChatConfig,
} from '../settings/settings.service.js';
import { ChatRequestDto, FeedbackDto } from './chat.dto.js';
import { ChatService } from './chat.service.js';

@Controller()
export class ChatController {
  private readonly hashSalt: string;

  constructor(
    private readonly chat: ChatService,
    private readonly conversations: ConversationsService,
    private readonly settings: SettingsService,
    config: ConfigService<Env, true>,
  ) {
    this.hashSalt = config.get('JWT_SECRET', { infer: true });
  }

  @Post('chat')
  @Throttle({ default: { limit: 20, ttl: 60_000 } })
  async publicChat(
    @Body() dto: ChatRequestDto,
    @Res() res: Response,
    @Ip() ip: string,
    @Headers('user-agent') userAgent = '',
  ): Promise<void> {
    const ipHash = createHash('sha256')
      .update(`${this.hashSalt}:${ip}`)
      .digest('hex');
    await pipeSse(
      res,
      this.chat.respond({
        sessionId: dto.sessionId,
        message: dto.message,
        channel: 'web',
        userAgent: userAgent.slice(0, 300),
        ipHash,
      }),
    );
  }

  @Post('chat/feedback')
  @HttpCode(204)
  @Throttle({ default: { limit: 30, ttl: 60_000 } })
  feedback(@Body() dto: FeedbackDto): Promise<void> {
    return this.conversations.setFeedback(dto.messageId, dto.feedback);
  }

  @Get('chat/config')
  config(): Promise<PublicChatConfig> {
    return this.settings.publicConfig();
  }

  @Post('admin/playground')
  @UseGuards(JwtAuthGuard)
  async playground(
    @Body() dto: ChatRequestDto,
    @Res() res: Response,
    @Headers('user-agent') userAgent = '',
  ): Promise<void> {
    await pipeSse(
      res,
      this.chat.respond({
        sessionId: dto.sessionId,
        message: dto.message,
        channel: 'playground',
        userAgent: userAgent.slice(0, 300),
        ipHash: '',
        debug: true,
      }),
    );
  }
}
