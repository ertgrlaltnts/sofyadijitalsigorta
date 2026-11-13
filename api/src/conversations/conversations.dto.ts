import { Type } from 'class-transformer';
import { IsIn, IsInt, IsISO8601, IsOptional, Max, Min } from 'class-validator';
import { ANSWER_SOURCES, CHANNELS, type AnswerSource, type Channel } from './conversation.schemas.js';

export class ListConversationsQuery {
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
  @IsIn(CHANNELS)
  channel?: Channel;

  @IsOptional()
  @IsIn(ANSWER_SOURCES)
  source?: AnswerSource;

  @IsOptional()
  @IsIn(['up', 'down'])
  feedback?: 'up' | 'down';

  @IsOptional()
  @IsISO8601()
  from?: string;

  @IsOptional()
  @IsISO8601()
  to?: string;
}
