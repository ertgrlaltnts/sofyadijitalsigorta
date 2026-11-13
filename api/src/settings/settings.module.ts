import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SettingsController } from './settings.controller.js';
import { Settings, SettingsSchema } from './settings.schema.js';
import { SettingsService } from './settings.service.js';

@Module({
  imports: [MongooseModule.forFeature([{ name: Settings.name, schema: SettingsSchema }])],
  controllers: [SettingsController],
  providers: [SettingsService],
  exports: [SettingsService],
})
export class SettingsModule {}
