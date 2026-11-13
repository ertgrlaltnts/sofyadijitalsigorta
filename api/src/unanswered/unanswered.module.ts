import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UnansweredController } from './unanswered.controller.js';
import { UnansweredQuestion, UnansweredQuestionSchema } from './unanswered.schema.js';
import { UnansweredService } from './unanswered.service.js';

@Module({
  imports: [MongooseModule.forFeature([{ name: UnansweredQuestion.name, schema: UnansweredQuestionSchema }])],
  controllers: [UnansweredController],
  providers: [UnansweredService],
  exports: [UnansweredService],
})
export class UnansweredModule {}
