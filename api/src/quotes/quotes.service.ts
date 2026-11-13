import {
  BadGatewayException,
  BadRequestException,
  HttpException,
  Injectable,
  Logger,
  NotFoundException,
  ServiceUnavailableException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import {
  IoApiClient,
  IoApiError,
  type IoPriceCard,
  type IoPrices,
} from './io-api.client.js';
import { interpretCreate, type SuggestedVehicle } from './create.logic.js';
import { BRANCH, type QuoteProduct } from './products.js';
import {
  buildQuoteRequest,
  chosenPayment,
  paymentAllowed,
} from './quote-request.builder.js';
import type { CreateQuoteDto } from './quotes.dto.js';
import { Quote } from './quote.schema.js';

/** How long we keep polling before reporting what we have; some insurers never answer. */
const MAX_WAIT_MS = 120_000;

export interface Offer {
  id: number;
  companyCode: string;
  company: string;
  premium: number;
  currency: string;
  installment: string;
  coverages: { name: string; value: string }[];
}

/** What creating a quote answers: the quote id, or a request for the vehicle details the lookup could not find. */
export type CreateQuoteResult =
  { id: string } | { needsVehicle: true; vehicle: SuggestedVehicle };

export interface QuoteResults {
  status: 'running' | 'done';
  product: QuoteProduct;
  offers: Offer[];
  progress: { completed: number; total: number };
}

const maskTckn = (tckn: string): string =>
  `${tckn.slice(0, 3)}******${tckn.slice(-2)}`;

const LIRA = new Set(['TL', 'TRY', 'TRL', '₺']);

/** The API is not consistent about the lira ("TL", "TRY", "TRL"); everything else is the upper-case currency code. */
export const normalizeCurrency = (value?: string): string => {
  const code = (value ?? '').trim().toUpperCase();
  return !code || LIRA.has(code) ? 'TL' : code;
};

const toOffer = (card: IoPriceCard): Offer => ({
  id: card.Id,
  companyCode: card.SirketKodu,
  company: card.SirketAdi,
  premium: card.Prim,
  currency: normalizeCurrency(card.Doviz),
  installment: card.Taksit ?? '',
  coverages: (card.Teminat ?? [])
    // `Aciklama` is the text for people ("10.000.000", "Evet"); `Deger` can be the insurer's own code ("40", "E"). Health rows
    // carry the same text in both. Not filtered on "Aktif": several insurers send complete rows flagged inactive.
    .map((item) => ({
      code: item.Kodu,
      name: item.Adi,
      value: item.Aciklama?.trim() || item.Deger?.trim() || '',
    }))
    .filter((item) => item.code !== 'NET' && item.value)
    .map(({ name, value }) => ({ name, value })),
});

/**
 * Cards that carry a premium and no error. Insurers that failed or refused are left out. Prices in different currencies (travel
 * insurers quote in euros, some in lira) cannot be compared, so offers are grouped by currency: the commonest currency first
 * (lira on a tie), cheapest first within each.
 */
export function toOffers(prices: IoPrices): Offer[] {
  const offers = (prices.Sirketler ?? [])
    .filter((card) => card.Prim > 0 && !card.Hata)
    .map(toOffer);
  const sizes = new Map<string, number>();
  for (const offer of offers)
    sizes.set(offer.currency, (sizes.get(offer.currency) ?? 0) + 1);
  const rank = (currency: string) =>
    -(sizes.get(currency) ?? 0) * 2 - (currency === 'TL' ? 1 : 0);
  return offers.sort(
    (a, b) =>
      rank(a.currency) - rank(b.currency) ||
      a.currency.localeCompare(b.currency) ||
      a.premium - b.premium,
  );
}

const COMPANIES_TTL_MS = 60 * 60 * 1000;

@Injectable()
export class QuotesService {
  private readonly logger = new Logger(QuotesService.name);
  private companies: {
    loadedAt: number;
    list: { code: string; name: string }[];
  } | null = null;

  constructor(
    private readonly io: IoApiClient,
    @InjectModel(Quote.name) private readonly quotes: Model<Quote>,
  ) {}

  async create(
    dto: CreateQuoteDto,
    ipHash: string,
  ): Promise<CreateQuoteResult> {
    if (!this.io.enabled)
      throw new ServiceUnavailableException(
        'Online teklif şu an kullanılamıyor. Lütfen daha sonra tekrar deneyin.',
      );

    const payment = chosenPayment(dto);
    if (payment && !paymentAllowed(dto.product, payment)) {
      throw new BadRequestException({
        message: 'Seçilen ödeme şekli bu ürün için geçerli değil.',
        fieldErrors: { payment: 'Ödeme şeklini yeniden seçin.' },
      });
    }

    try {
      const { insured, insuredStr } = await this.io.verifyIdentity(
        BRANCH[dto.product],
        {
          tckn: dto.tckn,
          birthDate: dto.birthDate,
          phone: dto.phone,
        },
      );
      const answer = await this.io.createQuote(
        buildQuoteRequest(dto, { insured, insuredStr }, this.io.channel),
      );
      const outcome = interpretCreate(answer, !!dto.vehicle?.manual);

      if (outcome.kind === 'needsVehicle')
        return { needsVehicle: true, vehicle: outcome.vehicle };
      if (outcome.kind === 'unavailable')
        throw new IoApiError('/api/teklif sunucu hatası');
      if (outcome.kind === 'refused') {
        this.logger.warn(
          `Teklif reddedildi (${dto.product}): kod ${outcome.code} ${outcome.message}`,
        );
        throw new UnprocessableEntityException(outcome.message);
      }

      const quote = await this.quotes.create({
        product: dto.product,
        ioQuoteId: outcome.quoteId,
        maskedTckn: maskTckn(dto.tckn),
        consentAt: new Date(),
        ipHash,
      });
      return { id: quote.id as string };
    } catch (error) {
      throw this.toHttpError(error, 'create');
    }
  }

  /** Insurers offered in the "transfer" step; cached because the list almost never changes. */
  async transferCompanies(): Promise<{ code: string; name: string }[]> {
    if (!this.io.enabled)
      throw new ServiceUnavailableException(
        'Online teklif şu an kullanılamıyor. Lütfen daha sonra tekrar deneyin.',
      );
    if (
      this.companies &&
      Date.now() - this.companies.loadedAt < COMPANIES_TTL_MS
    )
      return this.companies.list;
    try {
      const list = await this.io.listCompanies();
      if (list.length > 0) this.companies = { loadedAt: Date.now(), list };
      return list;
    } catch (error) {
      throw this.toHttpError(error, 'companies');
    }
  }

  async results(id: string): Promise<QuoteResults> {
    const quote = await this.quotes.findById(id).lean();
    if (!quote) throw new NotFoundException('Teklif bulunamadı.');

    try {
      const prices = await this.io.fetchPrices(
        BRANCH[quote.product],
        quote.ioQuoteId,
      );
      const expired = Date.now() - quote.createdAt.getTime() > MAX_WAIT_MS;
      return {
        status: prices.TeklifCalisildi || expired ? 'done' : 'running',
        product: quote.product,
        offers: toOffers(prices),
        progress: {
          completed: prices.CalisilanSirketSayisi ?? 0,
          total: prices.SirketSayisi ?? 0,
        },
      };
    } catch (error) {
      throw this.toHttpError(error, 'results');
    }
  }

  private toHttpError(error: unknown, step: string): Error {
    if (error instanceof HttpException) return error;
    if (error instanceof IoApiError) {
      this.logger.warn(`Teklif (${step}) başarısız: ${error.message}`);
      if (error.kind === 'identity') {
        return new BadRequestException({
          message:
            'Kimlik bilgileri doğrulanamadı. T.C. kimlik numarası ve doğum tarihini kontrol edin.',
          fieldErrors: {
            tckn: 'Bilgiler eşleşmedi.',
            birthDate: 'Bilgiler eşleşmedi.',
          },
        });
      }
    } else {
      this.logger.error(
        `Teklif (${step}) beklenmeyen hata`,
        error instanceof Error ? error.stack : String(error),
      );
    }
    return new BadGatewayException(
      'Teklifler şu an alınamıyor. Lütfen birkaç dakika sonra tekrar deneyin.',
    );
  }
}
