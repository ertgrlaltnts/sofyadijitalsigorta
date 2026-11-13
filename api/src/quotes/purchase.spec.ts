import 'reflect-metadata';
import {
  BadRequestException,
  ConflictException,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import type { ConfigService } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import type { Env } from '../config/env.js';
import {
  IoApiError,
  type IoLenientBody,
  type IoPriceCard,
} from './io-api.client.js';
import type { IoApiClient } from './io-api.client.js';
import { PurchaseDto } from './purchase.dto.js';
import {
  buildPurchaseRequest,
  findThreeDSecure,
  interpretPurchase,
  interpretThreeDSecure,
} from './purchase.logic.js';
import { PurchaseService } from './purchase.service.js';

const CARD_NUMBER = '4111111111111111';
const CVV = '737';
const nextYear = String(new Date().getFullYear() + 1);

const card = (overrides: Partial<IoPriceCard> = {}): IoPriceCard => ({
  Id: 1433,
  SirketKodu: '115',
  SirketAdi: 'ANA SİGORTA',
  Prim: 16583,
  Taksit: '1~10 Eşit Taksit',
  TaksitKodu: '3',
  TeklifNo: '99891866',
  AcenteKodu: '061002',
  isWebServis: false,
  SanalPos: false,
  Hata: '',
  ...overrides,
});

const dto = (overrides: Record<string, unknown> = {}) =>
  plainToInstance(PurchaseDto, {
    offerId: 1433,
    cardHolder: 'Ayşe Yılmaz',
    cardNumber: '4111 1111 1111 1111',
    expiryMonth: '12',
    expiryYear: nextYear,
    cvv: CVV,
    holderTckn: '10000000146',
    consent: true,
    ...overrides,
  });

describe('PurchaseDto', () => {
  const errorsOf = async (value: PurchaseDto) =>
    (await validate(value)).map((error) => error.property);

  it('accepts valid card details and strips spaces from the number', async () => {
    const value = dto();
    expect(await errorsOf(value)).toEqual([]);
    expect(value.cardNumber).toBe(CARD_NUMBER);
  });

  it('rejects a number that fails the Luhn check, an expired card and a missing consent', async () => {
    expect(await errorsOf(dto({ cardNumber: '4111111111111112' }))).toContain(
      'cardNumber',
    );
    expect(
      await errorsOf(
        dto({
          expiryMonth: '01',
          expiryYear: String(new Date().getFullYear() - 1),
        }),
      ),
    ).toContain('expiryYear');
    expect(await errorsOf(dto({ consent: false }))).toContain('consent');
  });
});

describe('buildPurchaseRequest', () => {
  const details = {
    holder: 'Ayşe Yılmaz',
    number: CARD_NUMBER,
    expiryMonth: '12',
    expiryYear: nextYear,
    cvv: CVV,
    holderTckn: '10000000146',
  };

  it('takes company, quote number, agency and premium from the insurer card', () => {
    const request = buildPurchaseRequest({
      ioQuoteId: 143,
      bransNo: 18,
      channel: 1,
      card: card(),
      details,
      withThreeDSecure: false,
    });
    expect(request).toMatchObject({
      TeklifId: 143,
      BransNo: 18,
      Kanal: 1,
      Police: {
        Id: 1433,
        SirketKodu: '115',
        AcenteKodu: '061002',
        TeklifNo: '99891866',
        Prim: 16583,
        SatinAl: true,
        TaksitKodu: '3',
        KartNo: CARD_NUMBER,
        SonKullanimAy: '12',
        Cvv2: CVV,
      },
    });
    expect(
      (request.Police as Record<string, unknown>).Guvenlik3D,
    ).toBeUndefined();
  });

  it('asks for 3D Secure on the first call only', () => {
    const request = buildPurchaseRequest({
      ioQuoteId: 143,
      bransNo: 18,
      channel: 1,
      card: card(),
      details,
      withThreeDSecure: true,
    });
    expect((request.Police as Record<string, unknown>).Guvenlik3D).toEqual({
      Aktif: true,
      Onay: false,
    });
  });
});

describe('interpretPurchase', () => {
  it('recognises an issued policy', () => {
    expect(
      interpretPurchase({
        PoliceKesildi: true,
        Police: { PoliceNo: ' P-100 ' },
      }),
    ).toEqual({ kind: 'issued', policeNo: 'P-100' });
  });

  it('finds the 3D Secure block wherever it sits, and only trusts https', () => {
    const body = {
      Police: {
        Guvenlik3D: { Url: 'https://bank.example/3d', Value: 'a=1&b=2' },
      },
    };
    expect(interpretPurchase(body)).toEqual({
      kind: 'threeds',
      url: 'https://bank.example/3d',
      value: 'a=1&b=2',
    });
    expect(
      findThreeDSecure({ x: { y: { Url: 'http://evil', Value: 'v' } } }),
    ).toEqual({ url: 'http://evil', value: 'v' });
    expect(
      interpretPurchase({
        Police: { Guvenlik3D: { Url: 'http://bank.example/3d', Value: 'a=1' } },
      }).kind,
    ).toBe('declined');
    expect(
      interpretPurchase({
        Police: { Guvenlik3D: { Url: 'javascript:alert(1)', Value: 'a=1' } },
      }).kind,
    ).toBe('declined');
  });

  it('turns a refusal into a message, flagging the call-center code', () => {
    expect(
      interpretPurchase({
        Hata: { HataKodu: 5, Mesaj: 'Kart limiti yetersiz.' },
      }),
    ).toEqual({
      kind: 'declined',
      message: 'Kart limiti yetersiz.',
      callCenter: false,
    });
    expect(
      interpretPurchase({
        Hata: { HataKodu: 32, Mesaj: 'Müşteri hizmetlerini arayın.' },
      }),
    ).toMatchObject({ callCenter: true });
    expect(interpretPurchase({})).toMatchObject({
      kind: 'declined',
      callCenter: false,
    });
  });
});

describe('interpretThreeDSecure', () => {
  it('maps the control answers', () => {
    expect(
      interpretThreeDSecure({
        Message: 'Kontrol devam ediyor.',
        Statuscode: 200,
      }),
    ).toEqual({ state: 'waiting' });
    expect(
      interpretThreeDSecure({
        Data: { Hata: { HataKodu: 200, Mesaj: 'Onay Alınmıştır.' } },
      }),
    ).toEqual({ state: 'approved' });
    expect(interpretThreeDSecure({ Message: 'Onay Alınmıştır.' })).toEqual({
      state: 'approved',
    });
    expect(
      interpretThreeDSecure({ Statuscode: 400, Message: 'Banka reddetti.' }),
    ).toEqual({
      state: 'failed',
      message: 'Banka reddetti.',
      callCenter: false,
    });
    expect(
      interpretThreeDSecure({
        __status: 400,
        Hata: { HataKodu: 7, Mesaj: 'İptal edildi.' },
      }),
    ).toMatchObject({ state: 'failed' });
    expect(
      interpretThreeDSecure({ PoliceKesildi: true, PoliceNo: 'P-9' }),
    ).toEqual({ state: 'issued', policeNo: 'P-9' });
  });
});

/** The slice of the Mongoose model PurchaseService uses, over one in-memory document. */
function fakeQuotes(initial: Record<string, unknown> = {}) {
  const doc: Record<string, any> = {
    _id: '64b000000000000000000001',
    product: 'health',
    ioQuoteId: 143,
    purchaseStatus: 'none',
    purchaseOfferId: null,
    policeNo: '',
    ...initial,
  };
  const lean = <T>(value: T) => ({ lean: () => Promise.resolve(value) });
  const apply = (update: Record<string, unknown>) =>
    Object.assign(doc, (update.$set as object) ?? update);
  return {
    doc,
    findById: () => lean({ ...doc }),
    findOneAndUpdate: (
      filter: { $or: { purchaseStatus?: { $in?: string[] } }[] },
      update: Record<string, unknown>,
    ) => {
      const allowed = filter.$or.flatMap(
        (clause) => clause.purchaseStatus?.$in ?? [],
      );
      if (!allowed.includes(doc.purchaseStatus)) return lean(null);
      const before = { ...doc };
      apply(update);
      return lean(before);
    },
    updateOne: (_filter: unknown, update: Record<string, unknown>) => {
      apply(update);
      return Promise.resolve();
    },
  };
}

function setup(
  options: {
    enabled?: boolean;
    threeD?: boolean;
    cards?: IoPriceCard[];
    purchase?: () => Promise<IoLenientBody>;
    check?: () => Promise<IoLenientBody>;
  } = {},
) {
  const quotes = fakeQuotes();
  const purchaseCalls: Record<string, any>[] = [];
  const io = {
    enabled: true,
    channel: 1,
    fetchPrices: () =>
      Promise.resolve({
        TeklifCalisildi: true,
        Sirketler: options.cards ?? [card()],
      }),
    requiresThreeDSecure: () => Promise.resolve(options.threeD ?? false),
    purchase: (request: Record<string, any>) => {
      purchaseCalls.push(request);
      return (
        options.purchase ??
        (() =>
          Promise.resolve({
            __status: 200,
            PoliceKesildi: true,
            PoliceNo: 'P-100',
          }))
      )();
    },
    checkThreeDSecure:
      options.check ??
      (() =>
        Promise.resolve({ __status: 200, Message: 'Kontrol devam ediyor.' })),
    documentUrl: () => Promise.resolve('https://docs.example/p.pdf'),
  };
  const config = {
    get: () => options.enabled ?? true,
  } as unknown as ConfigService<Env, true>;
  const service = new PurchaseService(
    io as unknown as IoApiClient,
    quotes as never,
    config,
  );
  return { service, quotes, purchaseCalls };
}

const ID = '64b000000000000000000001';

describe('PurchaseService', () => {
  afterEach(() => vi.restoreAllMocks());

  it('refuses everything while payments are switched off', async () => {
    const { service, purchaseCalls } = setup({ enabled: false });
    await expect(service.purchase(ID, dto())).rejects.toBeInstanceOf(
      ServiceUnavailableException,
    );
    expect(await service.config()).toEqual({
      enabled: false,
      threeDSecure: false,
    });
    expect(purchaseCalls).toHaveLength(0);
  });

  it('issues the policy and records it, charging the insurer card premium', async () => {
    const { service, quotes, purchaseCalls } = setup();
    expect(await service.purchase(ID, dto())).toEqual({
      status: 'issued',
      policeNo: 'P-100',
    });
    expect(purchaseCalls[0].Police.Prim).toBe(16583);
    expect(quotes.doc).toMatchObject({
      purchaseStatus: 'issued',
      purchaseCompany: 'ANA SİGORTA',
      purchasePremium: 16583,
      policeNo: 'P-100',
    });
  });

  it('rejects an offer id that is not one of the quote offers, before anything is sent', async () => {
    const { service, quotes, purchaseCalls } = setup();
    await expect(
      service.purchase(ID, dto({ offerId: 999 })),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(purchaseCalls).toHaveLength(0);
    expect(quotes.doc.purchaseStatus).toBe('none');
  });

  it('does not offer an insurer card that failed or has no premium', async () => {
    const { service, purchaseCalls } = setup({
      cards: [card({ Hata: 'İstek limitine ulaşıldı.', Prim: 0 })],
    });
    await expect(service.purchase(ID, dto())).rejects.toBeInstanceOf(
      BadRequestException,
    );
    expect(purchaseCalls).toHaveLength(0);
  });

  it('allows only one payment at a time and none after the policy is issued', async () => {
    let release: (value: IoLenientBody) => void = () => undefined;
    const { service, purchaseCalls } = setup({
      purchase: () =>
        new Promise<IoLenientBody>((resolve) => (release = resolve)),
    });
    const first = service.purchase(ID, dto());
    await new Promise((resolve) => setTimeout(resolve, 0));
    await expect(service.purchase(ID, dto())).rejects.toBeInstanceOf(
      ConflictException,
    );
    release({ __status: 200, PoliceKesildi: true, PoliceNo: 'P-1' });
    await first;
    await expect(service.purchase(ID, dto())).rejects.toBeInstanceOf(
      ConflictException,
    );
    expect(purchaseCalls).toHaveLength(1);
  });

  it('lets the customer retry after a refusal', async () => {
    const answers = [
      { __status: 200, Hata: { HataKodu: 5, Mesaj: 'Kart limiti yetersiz.' } },
      { __status: 200, PoliceKesildi: true, PoliceNo: 'P-2' },
    ];
    const { service, purchaseCalls } = setup({
      purchase: () => Promise.resolve(answers.shift() as IoLenientBody),
    });
    expect(await service.purchase(ID, dto())).toMatchObject({
      status: 'declined',
      message: 'Kart limiti yetersiz.',
    });
    expect(await service.purchase(ID, dto())).toEqual({
      status: 'issued',
      policeNo: 'P-2',
    });
    expect(purchaseCalls).toHaveLength(2);
  });

  it('locks the quote when the outcome is unknown, so the card cannot be charged twice', async () => {
    const { service, quotes, purchaseCalls } = setup({
      purchase: () => Promise.reject(new IoApiError('zaman aşımı')),
    });
    expect(await service.purchase(ID, dto())).toMatchObject({
      status: 'unknown',
    });
    expect(quotes.doc.purchaseStatus).toBe('unknown');
    await expect(service.purchase(ID, dto())).rejects.toBeInstanceOf(
      ConflictException,
    );
    expect(purchaseCalls).toHaveLength(1);
  });

  it('treats a server error with no business answer as unknown too', async () => {
    const { service, quotes } = setup({
      purchase: () => Promise.resolve({ __status: 502 }),
    });
    expect(await service.purchase(ID, dto())).toMatchObject({
      status: 'unknown',
    });
    expect(quotes.doc.purchaseStatus).toBe('unknown');
  });

  it('walks through 3D Secure: bank window, approval, repeat without 3D', async () => {
    const answers: IoLenientBody[] = [
      {
        __status: 200,
        Police: {
          Guvenlik3D: { Url: 'https://bank.example/3d', Value: 'a=1' },
        },
      },
      { __status: 200, PoliceKesildi: true, PoliceNo: 'P-3' },
    ];
    const checks: IoLenientBody[] = [
      { __status: 200, Message: 'Kontrol devam ediyor.' },
      { __status: 200, Message: 'Onay Alınmıştır.' },
    ];
    const { service, quotes, purchaseCalls } = setup({
      threeD: true,
      purchase: () => Promise.resolve(answers.shift() as IoLenientBody),
      check: () => Promise.resolve(checks.shift() as IoLenientBody),
    });

    expect(await service.purchase(ID, dto())).toEqual({
      status: 'threeds',
      url: 'https://bank.example/3d',
      value: 'a=1',
    });
    expect(purchaseCalls[0].Police.Guvenlik3D).toEqual({
      Aktif: true,
      Onay: false,
    });
    expect(quotes.doc.purchaseStatus).toBe('awaiting3ds');

    expect(await service.threeDSecureStatus(ID)).toEqual({ state: 'waiting' });
    expect(await service.threeDSecureStatus(ID)).toEqual({ state: 'approved' });

    expect(
      await service.purchase(ID, dto({ threeDSecureApproved: true })),
    ).toEqual({ status: 'issued', policeNo: 'P-3' });
    expect(purchaseCalls[1].Police.Guvenlik3D).toBeUndefined();
  });

  it('ignores the "3D approved" flag when no 3D payment was waiting', async () => {
    const { service, purchaseCalls } = setup({
      threeD: true,
      purchase: () =>
        Promise.resolve({
          __status: 200,
          Hata: { HataKodu: 5, Mesaj: 'Reddedildi.' },
        }),
    });
    await service.purchase(ID, dto({ threeDSecureApproved: true }));
    expect(purchaseCalls[0].Police.Guvenlik3D).toEqual({
      Aktif: true,
      Onay: false,
    });
  });

  it('hands out documents only for an issued policy', async () => {
    const { service } = setup();
    await expect(service.documentUrl(ID, 'policy')).rejects.toThrow();
    await service.purchase(ID, dto());
    expect(await service.documentUrl(ID, 'receipt')).toEqual({
      url: 'https://docs.example/p.pdf',
    });
  });

  it('never writes card data to the logs', async () => {
    const spies = [
      vi.spyOn(Logger.prototype, 'log'),
      vi.spyOn(Logger.prototype, 'warn'),
      vi.spyOn(Logger.prototype, 'error'),
    ];
    const { service } = setup({
      purchase: () => Promise.reject(new IoApiError('zaman aşımı')),
    });
    await service.purchase(ID, dto());
    const { service: other } = setup();
    await other.purchase(ID, dto());
    const logged = JSON.stringify(spies.flatMap((spy) => spy.mock.calls));
    expect(logged.length).toBeGreaterThan(10);
    expect(logged).not.toContain(CARD_NUMBER);
    expect(logged).not.toContain(CVV);
    expect(logged).not.toContain('10000000146');
  });
});
