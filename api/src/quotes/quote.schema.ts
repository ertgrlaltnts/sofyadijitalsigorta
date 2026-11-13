import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { HydratedDocument } from 'mongoose';

import { QUOTE_PRODUCTS, type QuoteProduct } from './products.js';

export const PURCHASE_STATUSES = [
  'none',
  'processing',
  'awaiting3ds',
  'issued',
  'failed',
  'unknown',
] as const;
export type PurchaseStatus = (typeof PURCHASE_STATUSES)[number];

/** Retention for quote records (KVKK data minimisation): they only link a visitor to the IO quote id while prices are polled. */
const RETENTION_SECONDS = 60 * 60 * 24 * 90;

/** Maps our public quote id to the IO quote. No phone number, name or full ID number is stored here. */
@Schema({
  collection: 'quotes',
  timestamps: { createdAt: true, updatedAt: false },
})
export class Quote {
  @Prop({ type: String, enum: QUOTE_PRODUCTS, required: true })
  product: QuoteProduct;

  @Prop({ required: true })
  ioQuoteId: number;

  /** First 3 and last 2 digits only, e.g. 502******14. */
  @Prop({ required: true })
  maskedTckn: string;

  @Prop({ required: true })
  consentAt: Date;

  @Prop({ default: '' })
  ipHash: string;

  /**
   * Payment progress. `unknown` means the request left but no answer came back: the card may have been charged, so the quote
   * is locked against another attempt until someone checks with the insurer.
   */
  @Prop({ type: String, enum: PURCHASE_STATUSES, default: 'none' })
  purchaseStatus: PurchaseStatus;

  @Prop({ type: Number, default: null })
  purchaseOfferId: number | null;

  @Prop({ default: '' })
  purchaseCompany: string;

  @Prop({ type: Number, default: null })
  purchasePremium: number | null;

  @Prop({ default: '' })
  policeNo: string;

  createdAt: Date;
}

export type QuoteDocument = HydratedDocument<Quote>;
export const QuoteSchema = SchemaFactory.createForClass(Quote);
QuoteSchema.index({ createdAt: 1 }, { expireAfterSeconds: RETENTION_SECONDS });
