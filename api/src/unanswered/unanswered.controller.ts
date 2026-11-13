import { Body, Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { ParseObjectIdPipe } from '../common/parse-object-id.pipe.js';
import { ListUnansweredQuery, UnansweredService, UpdateUnansweredDto, type UnansweredView } from './unanswered.service.js';

@Controller('admin/unanswered')
@UseGuards(JwtAuthGuard)
export class UnansweredController {
  constructor(private readonly unanswered: UnansweredService) {}

  @Get()
  list(@Query() query: ListUnansweredQuery): Promise<{ items: UnansweredView[]; total: number; page: number; limit: number }> {
    return this.unanswered.list(query);
  }

  @Patch(':id')
  update(@Param('id', ParseObjectIdPipe) id: string, @Body() dto: UpdateUnansweredDto): Promise<UnansweredView> {
    return this.unanswered.update(id, dto);
  }
}
