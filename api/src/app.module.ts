import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AdminsModule } from './admins/admins.module.js';
import { AnalyticsModule } from './analytics/analytics.module.js';
import { AuthModule } from './auth/auth.module.js';
import { CategoriesModule } from './categories/categories.module.js';
import { ChatModule } from './chat/chat.module.js';
import { loadEnv, type Env } from './config/env.js';
import { ConversationsModule } from './conversations/conversations.module.js';
import { KnowledgeModule } from './knowledge/knowledge.module.js';
import { QuotesModule } from './quotes/quotes.module.js';
import { SettingsModule } from './settings/settings.module.js';
import { UnansweredModule } from './unanswered/unanswered.module.js';

@Module({
  imports: [
    // Production reads .env (server-only secrets, git-ignored) first, then the committed .env.production; the first file wins for a
    // key that appears in both. Development reads only the git-ignored .env.
    ConfigModule.forRoot({
      isGlobal: true,
      validate: loadEnv,
      envFilePath: process.env.NODE_ENV === 'production' ? ['.env', '.env.production'] : ['.env'],
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService<Env, true>) => ({ uri: config.get('MONGODB_URI', { infer: true }) }),
    }),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 300 }]),
    AdminsModule,
    AuthModule,
    CategoriesModule,
    KnowledgeModule,
    SettingsModule,
    ConversationsModule,
    UnansweredModule,
    ChatModule,
    AnalyticsModule,
    QuotesModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
