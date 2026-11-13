import {
  Body,
  Controller,
  Get,
  Header,
  Ip,
  NotFoundException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Throttle } from '@nestjs/throttler';
import { createHash } from 'node:crypto';
import { ParseObjectIdPipe } from '../common/parse-object-id.pipe.js';
import type { Env } from '../config/env.js';
import type { ThreeDSecureState } from './purchase.logic.js';
import { PurchaseDto } from './purchase.dto.js';
import {
  PurchaseService,
  type PaymentConfig,
  type PurchaseResult,
} from './purchase.service.js';
import { CreateQuoteDto } from './quotes.dto.js';
import {
  parseReferenceQuery,
  ReferenceService,
  REFERENCE_KINDS,
  type ReferenceKind,
  type RefItem,
} from './reference.service.js';
import {
  QuotesService,
  type CreateQuoteResult,
  type QuoteResults,
} from './quotes.service.js';

/**
 * Public quote endpoints used by the website form (and reusable by the chat). Nothing from the IO API is passed through as is:
 * the browser only receives our own quote id, a short list of offers and the outcome of a payment.
 */
@Controller('quotes')
export class QuotesController {
  private readonly hashSalt: string;

  constructor(
    private readonly quotes: QuotesService,
    private readonly purchases: PurchaseService,
    private readonly reference: ReferenceService,
    config: ConfigService<Env, true>,
  ) {
    this.hashSalt = config.get('JWT_SECRET', { infer: true });
  }

  // Tight limit: every call checks an ID number against Mernis, so it must not be usable to probe ID/birth-date pairs.
  @Post()
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  create(
    @Body() dto: CreateQuoteDto,
    @Ip() ip: string,
  ): Promise<CreateQuoteResult> {
    const ipHash = createHash('sha256')
      .update(`${this.hashSalt}:${ip}`)
      .digest('hex');
    return this.quotes.create(dto, ipHash);
  }

  @Get('companies')
  @Throttle({ default: { limit: 30, ttl: 60_000 } })
  companies(): Promise<{ code: string; name: string }[]> {
    return this.quotes.transferCompanies();
  }

  /** Lists the quote forms need: provinces, countries, brands, models, occupations, vehicle usage, the address steps. */
  @Get('ref/:kind')
  @Throttle({ default: { limit: 120, ttl: 60_000 } })
  referenceList(
    @Param('kind') kind: string,
    @Query() query: Record<string, unknown>,
  ): Promise<RefItem[]> {
    if (!(REFERENCE_KINDS as readonly string[]).includes(kind))
      throw new NotFoundException('Liste bulunamadı.');
    return this.reference.get(
      kind as ReferenceKind,
      parseReferenceQuery(kind as ReferenceKind, query),
    );
  }

  /** Tells the browser whether card payment is on and whether the bank's 3D Secure window must be opened. */
  @Get('payment-config')
  @Throttle({ default: { limit: 30, ttl: 60_000 } })
  paymentConfig(): Promise<PaymentConfig> {
    return this.purchases.config();
  }

  @Get(':id')
  @Throttle({ default: { limit: 60, ttl: 60_000 } })
  results(@Param('id', ParseObjectIdPipe) id: string): Promise<QuoteResults> {
    return this.quotes.results(id);
  }

  // Card data arrives here. It is validated, forwarded to the insurer once and never stored or logged.
  @Post(':id/purchase')
  @Header('Cache-Control', 'no-store')
  @Throttle({ default: { limit: 6, ttl: 60_000 } })
  purchase(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() dto: PurchaseDto,
  ): Promise<PurchaseResult> {
    return this.purchases.purchase(id, dto);
  }

  @Get(':id/purchase/status')
  @Header('Cache-Control', 'no-store')
  @Throttle({ default: { limit: 60, ttl: 60_000 } })
  purchaseStatus(
    @Param('id', ParseObjectIdPipe) id: string,
  ): Promise<ThreeDSecureState> {
    return this.purchases.threeDSecureStatus(id);
  }

  @Get(':id/documents/:kind')
  @Header('Cache-Control', 'no-store')
  @Throttle({ default: { limit: 20, ttl: 60_000 } })
  document(
    @Param('id', ParseObjectIdPipe) id: string,
    @Param('kind') kind: string,
  ): Promise<{ url: string }> {
    if (kind !== 'policy' && kind !== 'receipt')
      throw new NotFoundException('Belge bulunamadı.');
    return this.purchases.documentUrl(id, kind);
  }
}
