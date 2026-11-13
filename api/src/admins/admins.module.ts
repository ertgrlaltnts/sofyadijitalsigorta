import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Admin, AdminSchema } from './admin.schema.js';
import { AdminsController } from './admins.controller.js';
import { AdminsService } from './admins.service.js';

@Module({
  imports: [MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }])],
  controllers: [AdminsController],
  providers: [AdminsService],
  exports: [AdminsService],
})
export class AdminsModule {}
