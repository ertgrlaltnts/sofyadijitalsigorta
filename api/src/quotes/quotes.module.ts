import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IoApiClient } from './io-api.client.js';
import { Quote, QuoteSchema } from './quote.schema.js';
import { PurchaseService } from './purchase.service.js';
import { ReferenceService } from './reference.service.js';
import { QuotesController } from './quotes.controller.js';
import { QuotesService } from './quotes.service.js';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Quote.name, schema: QuoteSchema }]),
  ],
  controllers: [QuotesController],
  providers: [IoApiClient, QuotesService, PurchaseService, ReferenceService],
  exports: [QuotesService, IoApiClient],
})
export class QuotesModule {}
