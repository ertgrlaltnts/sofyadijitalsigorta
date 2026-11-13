import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { ParseObjectIdPipe } from '../common/parse-object-id.pipe.js';
import { CreateCategoryDto, UpdateCategoryDto } from './categories.dto.js';
import { CategoriesService, type CategoryView } from './categories.service.js';

@Controller('admin/categories')
@UseGuards(JwtAuthGuard)
export class CategoriesController {
  constructor(private readonly categories: CategoriesService) {}

  @Get()
  list(): Promise<CategoryView[]> {
    return this.categories.list();
  }

  @Post()
  create(@Body() dto: CreateCategoryDto): Promise<CategoryView> {
    return this.categories.create(dto);
  }

  @Patch(':id')
  update(@Param('id', ParseObjectIdPipe) id: string, @Body() dto: UpdateCategoryDto): Promise<CategoryView> {
    return this.categories.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', ParseObjectIdPipe) id: string): Promise<void> {
    return this.categories.remove(id);
  }
}
