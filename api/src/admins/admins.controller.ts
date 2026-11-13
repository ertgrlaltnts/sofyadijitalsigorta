import { BadRequestException, Body, Controller, Get, HttpCode, Param, Patch, Post, UseGuards } from '@nestjs/common';
import type { AuthUser } from '../auth/auth.types.js';
import { CurrentUser } from '../auth/current-user.decorator.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { ChangePasswordDto, CreateAdminDto, UpdateAdminDto } from './admins.dto.js';
import { AdminsService, type AdminView } from './admins.service.js';

@Controller('admin/admins')
@UseGuards(JwtAuthGuard)
export class AdminsController {
  constructor(private readonly admins: AdminsService) {}

  @Get()
  list(): Promise<AdminView[]> {
    return this.admins.list();
  }

  @Post()
  create(@Body() dto: CreateAdminDto): Promise<AdminView> {
    return this.admins.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAdminDto, @CurrentUser() user: AuthUser): Promise<AdminView> {
    if (dto.isActive === false && id === user.id) {
      throw new BadRequestException('Kendi hesabınızı pasif yapamazsınız.');
    }
    return this.admins.update(id, dto);
  }

  @Patch(':id/password')
  @HttpCode(204)
  changePassword(@Param('id') id: string, @Body() dto: ChangePasswordDto): Promise<void> {
    return this.admins.changePassword(id, dto.password);
  }
}
