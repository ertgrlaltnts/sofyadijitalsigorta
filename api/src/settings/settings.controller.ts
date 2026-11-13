import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { UpdateSettingsDto } from './settings.dto.js';
import { SettingsService, type SettingsView } from './settings.service.js';

@Controller('admin/settings')
@UseGuards(JwtAuthGuard)
export class SettingsController {
  constructor(private readonly settings: SettingsService) {}

  @Get()
  get(): Promise<SettingsView> {
    return this.settings.get();
  }

  @Patch()
  update(@Body() dto: UpdateSettingsDto): Promise<SettingsView> {
    return this.settings.update(dto);
  }
}
