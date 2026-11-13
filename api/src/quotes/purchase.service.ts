import {
  BadGatewayException,
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import type { Env } from '../config/env.js';
import {
  IoApiClient,
  IoApiError,
  type IoLenientBody,
  type IoPriceCard,
} from './io-api.client.js';
import type { PurchaseDto } from './purchase.dto.js';
import {
  buildPurchaseRequest,
  interpretPurchase,
  interpretThreeDSecure,
  type ThreeDSecureState,
} from './purchase.logic.js';
import { BRANCH } from './products.js';
import { Quote, type PurchaseStatus } from './quote.schema.js';

const THREE_D_CACHE_MS = 10 * 60 * 1000;

export type PurchaseResult =
  | { status: 'issued'; policeNo: string }
  | { status: 'threeds'; url: string; value: string }
  | { status: 'declined'; message: string; callCenter: boolean }
  | { status: 'unknown'; message: string };

export interface PaymentConfig {
  enabled: boolean;
  threeDSecure: boolean;
}

const UNKNOWN_MESSAGE =
  'Ödeme sonucunu doğrulayamadık. Lütfen işlemi tekrar denemeyin; kartınızdan çekim olup olmadığını danışmanımız kontrol edip size dönecek.';

/**
 * Card payment for an offer. Safety rules: the premium and company always come from the insurer's own price card (never from the
 * browser), a quote can have only one payment in flight, and card data is only passed through (never stored, never logged).
 */
@Injectable()
export class PurchaseService {
  private readonly logger = new Logger(PurchaseService.name);
  private readonly purchaseEnabled: boolean;
  private threeD: { loadedAt: number; value: boolean } | null = null;

  constructor(
    private readonly io: IoApiClient,
    @InjectModel(Quote.name) private readonly quotes: Model<Quote>,
    config: ConfigService<Env, true>,
  ) {
    this.purchaseEnabled = config.get('PURCHASE_ENABLED', { infer: true });
  }

  private get enabled(): boolean {
    return this.purchaseEnabled && this.io.enabled;
  }

  async config(): Promise<PaymentConfig> {
    if (!this.enabled) return { enabled: false, threeDSecure: false };
    return { enabled: true, threeDSecure: await this.requiresThreeDSecure() };
  }

  async purchase(quoteId: string, dto: PurchaseDto): Promise<PurchaseResult> {
    if (!this.enabled)
      throw new ServiceUnavailableException(
        'Online ödeme şu an kullanılamıyor.',
      );

    const claimed = await this.claim(quoteId, dto.offerId);
    const previous = claimed.purchaseStatus ?? 'none';

    let card: IoPriceCard | undefined;
    let withThreeDSecure = false;
    try {
      const prices = await this.io.fetchPrices(
        BRANCH[claimed.product],
        claimed.ioQuoteId,
      );
      card = prices.Sirketler?.find(
        (item) => item.Id === dto.offerId && item.Prim > 0 && !item.Hata,
      );
      if (!card) {
        await this.setStatus(quoteId, previous);
        throw new BadRequestException(
          'Bu teklif artık geçerli değil. Lütfen teklifleri yenileyin.',
        );
      }
      // After the bank approved, the purchase is repeated without 3D; that is only valid for a payment that was waiting on 3D.
      const approved =
        dto.threeDSecureApproved === true && previous === 'awaiting3ds';
      withThreeDSecure = !approved && (await this.requiresThreeDSecure());
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      await this.setStatus(quoteId, previous);
      this.logger.warn(
        `Ödeme öncesi hata (${quoteId}): ${error instanceof Error ? error.message : String(error)}`,
      );
      throw new BadGatewayException(
        'Ödeme başlatılamadı. Lütfen birkaç dakika sonra tekrar deneyin.',
      );
    }

    let body: IoLenientBody;
    try {
      body = await this.io.purchase(
        buildPurchaseRequest({
          ioQuoteId: claimed.ioQuoteId,
          bransNo: BRANCH[claimed.product],
          channel: this.io.channel,
          card,
          withThreeDSecure,
          details: {
            holder: dto.cardHolder,
            number: dto.cardNumber,
            expiryMonth: dto.expiryMonth,
            expiryYear: dto.expiryYear,
            cvv: dto.cvv,
            holderTckn: dto.holderTckn,
          },
        }),
      );
    } catch (error) {
      await this.setStatus(quoteId, 'unknown');
      this.logger.error(
        `Ödeme sonucu bilinmiyor (${quoteId}, teklif ${dto.offerId}): ${error instanceof IoApiError ? error.message : 'bağlantı hatası'}`,
      );
      return { status: 'unknown', message: UNKNOWN_MESSAGE };
    }

    // A server error with no business answer: the charge may have gone through, so do not allow a second attempt.
    if (body.__status >= 500 && !body.Hata && body.PoliceKesildi !== true) {
      await this.setStatus(quoteId, 'unknown');
      this.logger.error(
        `Ödeme sonucu bilinmiyor (${quoteId}, teklif ${dto.offerId}): HTTP ${body.__status}`,
      );
      return { status: 'unknown', message: UNKNOWN_MESSAGE };
    }

    const outcome = interpretPurchase(body);
    if (outcome.kind === 'issued') {
      await this.quotes.updateOne(
        { _id: quoteId },
        {
          purchaseStatus: 'issued',
          purchaseOfferId: card.Id,
          purchaseCompany: card.SirketAdi,
          purchasePremium: card.Prim,
          policeNo: outcome.policeNo,
        },
      );
      this.logger.log(
        `Poliçe kesildi (${quoteId}, ${card.SirketAdi}, poliçe ${outcome.policeNo || '-'})`,
      );
      return { status: 'issued', policeNo: outcome.policeNo };
    }
    if (outcome.kind === 'threeds') {
      await this.setStatus(quoteId, 'awaiting3ds');
      return { status: 'threeds', url: outcome.url, value: outcome.value };
    }
    await this.setStatus(quoteId, 'failed');
    this.logger.warn(
      `Ödeme reddedildi (${quoteId}, teklif ${dto.offerId}): ${outcome.message}`,
    );
    return {
      status: 'declined',
      message: outcome.message,
      callCenter: outcome.callCenter,
    };
  }

  /** While the bank's window is open the browser asks here. The offer id comes from our record, not from the browser. */
  async threeDSecureStatus(quoteId: string): Promise<ThreeDSecureState> {
    const quote = await this.quotes.findById(quoteId).lean();
    if (!quote) throw new NotFoundException('Teklif bulunamadı.');
    if (quote.purchaseStatus === 'issued')
      return { state: 'issued', policeNo: quote.policeNo };
    if (quote.purchaseStatus !== 'awaiting3ds' || !quote.purchaseOfferId)
      throw new ConflictException('Bekleyen bir ödeme yok.');

    let state: ThreeDSecureState;
    try {
      state = interpretThreeDSecure(
        await this.io.checkThreeDSecure(quote.purchaseOfferId),
      );
    } catch (error) {
      this.logger.warn(
        `3D Secure kontrolü başarısız (${quoteId}): ${error instanceof Error ? error.message : String(error)}`,
      );
      return { state: 'waiting' };
    }

    if (state.state === 'issued') {
      await this.quotes.updateOne(
        { _id: quoteId },
        { purchaseStatus: 'issued', policeNo: state.policeNo },
      );
    } else if (state.state === 'failed') {
      await this.setStatus(quoteId, 'failed');
    }
    return state;
  }

  /** Link to the issued policy (`policy`) or the receipt (`receipt`). */
  async documentUrl(
    quoteId: string,
    kind: 'policy' | 'receipt',
  ): Promise<{ url: string }> {
    if (!this.enabled)
      throw new ServiceUnavailableException(
        'Online ödeme şu an kullanılamıyor.',
      );
    const quote = await this.quotes.findById(quoteId).lean();
    if (!quote || quote.purchaseStatus !== 'issued' || !quote.purchaseOfferId)
      throw new NotFoundException('Belge bulunamadı.');

    let url: string | null;
    try {
      url = await this.io.documentUrl(
        quote.purchaseOfferId,
        kind === 'policy' ? 't' : 'm',
      );
    } catch (error) {
      this.logger.warn(
        `Belge alınamadı (${quoteId}): ${error instanceof Error ? error.message : String(error)}`,
      );
      throw new BadGatewayException(
        'Belge şu an alınamıyor. Lütfen birkaç dakika sonra tekrar deneyin.',
      );
    }
    if (!url || !/^https:\/\//i.test(url))
      throw new NotFoundException('Belge henüz hazır değil.');
    return { url };
  }

  /** Atomically takes the quote's single payment slot; a second request while one is running (or after a policy) is refused. */
  private async claim(quoteId: string, offerId: number) {
    const claimed = await this.quotes
      .findOneAndUpdate(
        {
          _id: quoteId,
          $or: [
            { purchaseStatus: { $exists: false } },
            { purchaseStatus: { $in: ['none', 'failed', 'awaiting3ds'] } },
          ],
        },
        { $set: { purchaseStatus: 'processing', purchaseOfferId: offerId } },
        { returnDocument: 'before' },
      )
      .lean();
    if (claimed) {
      if (
        claimed.purchaseStatus === 'awaiting3ds' &&
        claimed.purchaseOfferId !== offerId
      ) {
        await this.setStatus(quoteId, 'awaiting3ds');
        throw new BadRequestException(
          'Bekleyen ödeme başka bir teklif için başlatılmış.',
        );
      }
      return claimed;
    }

    const quote = await this.quotes.findById(quoteId).lean();
    if (!quote) throw new NotFoundException('Teklif bulunamadı.');
    if (quote.purchaseStatus === 'issued')
      throw new ConflictException('Bu teklif için poliçe zaten kesildi.');
    if (quote.purchaseStatus === 'unknown')
      throw new ConflictException(UNKNOWN_MESSAGE);
    throw new ConflictException('Ödemeniz işleniyor. Lütfen bekleyin.');
  }

  private setStatus(quoteId: string, status: PurchaseStatus) {
    return this.quotes.updateOne({ _id: quoteId }, { purchaseStatus: status });
  }

  private async requiresThreeDSecure(): Promise<boolean> {
    if (this.threeD && Date.now() - this.threeD.loadedAt < THREE_D_CACHE_MS)
      return this.threeD.value;
    try {
      const value = await this.io.requiresThreeDSecure();
      this.threeD = { loadedAt: Date.now(), value };
      return value;
    } catch (error) {
      // Unknown: assume 3D is required, the safer way to take a card payment.
      this.logger.warn(
        `3D Secure ayarı okunamadı: ${error instanceof Error ? error.message : String(error)}`,
      );
      return true;
    }
  }
}
