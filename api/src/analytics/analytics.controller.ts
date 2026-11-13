import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { AnalyticsService, type AnalyticsOverview } from './analytics.service.js';

class OverviewQuery {
  @IsOptional()
  @Transform(({ value }: { value: unknown }) => value === 'true' || value === true)
  @IsBoolean()
  includePlayground = false;
}

@Controller('admin/analytics')
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
  constructor(private readonly analytics: AnalyticsService) {}

  @Get('overview')
  overview(@Query() query: OverviewQuery): Promise<AnalyticsOverview> {
    return this.analytics.overview(query.includePlayground);
  }
}
