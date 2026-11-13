import 'reflect-metadata';
import { BadRequestException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate, type ValidationError } from 'class-validator';
import { interpretCreate } from './create.logic.js';
import type { IoLenientBody } from './io-api.client.js';
import { buildQuoteRequest, paymentAllowed } from './quote-request.builder.js';
import { CreateQuoteDto } from './quotes.dto.js';
import {
  fixMojibake,
  parseReferenceQuery,
  uniqueByCode,
} from './reference.service.js';
import type { IoPrices } from './io-api.client.js';
import { normalizeCurrency, toOffers } from './quotes.service.js';

const iso = (days: number) =>
  new Date(Date.now() + days * 86_400_000).toISOString().slice(0, 10);
const modelYear = String(new Date().getFullYear() - 1);

const person = {
  tckn: '10000000146',
  birthDate: '1990-05-17',
  phone: '5552090609',
  consent: true,
};
const manual = {
  usageType: '01',
  usageStyle: '1',
  vehicleCode: '1001502',
  engineNo: 'abc1234567',
  chassisNo: 'zfa1234567890abcd',
  seats: '5',
};
const building = {
  addressCode: '2004721110',
  holderRole: '1',
  structure: '1',
  buildYear: '2015',
  totalFloors: '2',
  area: 100,
};

const dto = (body: Record<string, unknown>) =>
  plainToInstance(CreateQuoteDto, { ...person, ...body });

/** Dotted paths of every failing field, e.g. "vehicle.plate". */
function paths(errors: ValidationError[], prefix = ''): string[] {
  return errors.flatMap((error) => {
    const path = prefix ? `${prefix}.${error.property}` : error.property;
    return [
      ...(error.constraints ? [path] : []),
      ...paths(error.children ?? [], path),
    ];
  });
}
const failing = async (body: Record<string, unknown>) =>
  paths(await validate(dto(body)));

const insured = { AdUnvanYildizli: 'AB*** CD***' };
const build = (body: Record<string, unknown>, insuredStr?: string) =>
  buildQuoteRequest(dto(body), { insured, insuredStr }, 1);

describe('vehicle products', () => {
  const plated = {
    noPlate: false,
    plate: '34 abc 123',
    registrationSeries: 'ab',
    registrationNo: '123456',
    payment: 'P',
  };

  it('accepts a plate with its registration document and normalises the plate', async () => {
    const value = dto({ product: 'traffic', vehicle: plated });
    expect(await failing({ product: 'traffic', vehicle: plated })).toEqual([]);
    expect(value.vehicle?.plate).toBe('34ABC123');
    expect(value.vehicle?.registrationSeries).toBe('AB');
  });

  it('rejects a malformed plate and registration number', async () => {
    const errors = await failing({
      product: 'traffic',
      vehicle: { ...plated, plate: 'ABC', registrationNo: '12' },
    });
    expect(errors).toEqual(
      expect.arrayContaining(['vehicle.plate', 'vehicle.registrationNo']),
    );
  });

  it('asks a car with no plate yet for its city and model year instead', async () => {
    expect(
      await failing({
        product: 'traffic',
        vehicle: { noPlate: true, payment: 'P' },
      }),
    ).toEqual(
      expect.arrayContaining(['vehicle.cityCode', 'vehicle.modelYear']),
    );
    expect(
      await failing({
        product: 'traffic',
        vehicle: {
          noPlate: true,
          cityCode: '34',
          modelYear,
          payment: 'P',
          manual,
        },
      }),
    ).toEqual([]);
  });

  it('needs an occupation for kasko and the limits for İMM', async () => {
    expect(await failing({ product: 'kasko', vehicle: plated })).toContain(
      'profession',
    );
    expect(await failing({ product: 'imm', vehicle: plated })).toContain('imm');
    expect(
      await failing({
        product: 'imm',
        vehicle: plated,
        imm: { limit: '11', moral: '0' },
      }),
    ).toContain('imm.limit');
  });

  it('sends a plated car as plate plus registration document', () => {
    const request = build({ product: 'traffic', vehicle: plated });
    expect(request).toMatchObject({
      BransNo: 0,
      OdemeSekli: 'P',
      Arac: {
        PlakamYok: false,
        Plaka: '34ABC123',
        TescilBelge: 'AB123456',
        KisaSureli: false,
      },
    });
    expect(request.Arac).not.toHaveProperty('AracKodu');
  });

  it('sends a car with no plate as "<city>YK" with the manual details, padding the city code', () => {
    const request = build({
      product: 'traffic',
      vehicle: {
        noPlate: true,
        cityCode: '6',
        modelYear,
        payment: 'P',
        manual,
      },
    });
    expect(request.Arac).toMatchObject({
      PlakamYok: true,
      Plaka: '06YK',
      IlKodu: '06',
      TescilBelge: '',
      ModelYili: modelYear,
      KullanimTarzi: '01',
      KullanimSekli: '1',
      AracKodu: '1001502',
      MotorNo: 'ABC1234567',
      SasiNo: 'ZFA1234567890ABCD',
      KisiSayisi: '5',
    });
    expect(request.Arac).not.toHaveProperty('YakitTipi');
  });

  it('adds occupation and fuel type for kasko, and the limits for İMM', () => {
    const kasko = build({
      product: 'kasko',
      profession: '01',
      vehicle: {
        noPlate: true,
        cityCode: '34',
        modelYear,
        payment: '6',
        manual: { ...manual, fuelType: '1' },
      },
    });
    expect(kasko).toMatchObject({
      BransNo: 1,
      OdemeSekli: '6',
      Sigortali: { Meslek: '01' },
      Arac: { YakitTipi: '1' },
    });
    const imm = build({
      product: 'imm',
      imm: { limit: '3', moral: '0' },
      vehicle: plated,
    });
    expect(imm).toMatchObject({
      BransNo: 22,
      Imm: { ImmBedel: '3', ManeviTazminat: '0' },
    });
  });

  it('allows instalments only where the insurers do', () => {
    expect(paymentAllowed('kasko', '6')).toBe(true);
    expect(paymentAllowed('traffic', '6')).toBe(false);
    expect(paymentAllowed('traffic', 'V')).toBe(true);
    expect(paymentAllowed('kasko', 'V')).toBe(false);
  });
});

describe('DASK and home', () => {
  const dask = {
    ...building,
    usage: '1',
    damage: '1',
    floor: '2',
    payment: 'P',
  };
  const home = {
    ...building,
    usageStyle: '1',
    usageType: '1',
    position: '3',
    coverChoice: 2,
    buildingValue: 3_500_000,
    contentsValue: 500_000,
    glassValue: 0,
    decorationValue: 0,
    payment: 'P',
  };

  it('accepts a complete new DASK policy and a complete home policy', async () => {
    expect(await failing({ product: 'dask', dask })).toEqual([]);
    expect(await failing({ product: 'home', home })).toEqual([]);
  });

  it('rejects a missing address, an unknown structure and a building older than 51 years', async () => {
    const errors = await failing({
      product: 'dask',
      dask: { ...dask, addressCode: '123', structure: '9', buildYear: '1900' },
    });
    expect(errors).toEqual(
      expect.arrayContaining([
        'dask.addressCode',
        'dask.structure',
        'dask.buildYear',
      ]),
    );
  });

  it('skips the building questions for a renewal, which needs only the old policy number', async () => {
    expect(
      await failing({
        product: 'dask',
        dask: { renewalPolicyNo: '12345678', payment: 'P' },
      }),
    ).toEqual([]);
    expect(
      await failing({
        product: 'dask',
        dask: { renewalPolicyNo: '1234', payment: 'P' },
      }),
    ).toContain('dask.renewalPolicyNo');
  });

  it('sends a new DASK policy with the building as text fields', () => {
    expect(build({ product: 'dask', dask })).toMatchObject({
      BransNo: 2,
      OdemeSekli: 'P',
      Dask: {
        PolicemYok: true,
        AdresKodu: '2004721110',
        SigortaEttirenSifati: '1',
        YapiTarzi: '1',
        InsaaYili: '2015',
        ToplamKatSayisi: '2',
        KullanimSekli: '1',
        BinaHasarDurumu: '1',
        BinadakiKonumu: '2',
        BrutM2: '100',
      },
    });
  });

  it('sends a DASK renewal with the insured record and only the old policy number', () => {
    const request = build(
      { product: 'dask', dask: { renewalPolicyNo: '12345678', payment: 'P' } },
      'ENCRYPTED',
    );
    expect(request).toMatchObject({
      BransNo: 2,
      SigortaliStr: 'ENCRYPTED',
      Link: '',
      Dask: { PolicemYok: false, DaskPoliceNo: '12345678' },
    });
    expect(request.Dask).not.toHaveProperty('AdresKodu');
  });

  it('prices only what is insured for a home policy', () => {
    const onlyHome = build({
      product: 'home',
      home: { ...home, coverChoice: 0 },
    });
    expect(onlyHome.Konut).toMatchObject({
      BedelSecimi: 0,
      BinaBedeli: 3_500_000,
      EsyaBedeli: 0,
      Enflasyon: 50,
      KullanimTarzi: '1',
      BinadakiKonumu: '3',
    });
    const onlyContents = build({
      product: 'home',
      home: { ...home, coverChoice: 1 },
    });
    expect(onlyContents.Konut).toMatchObject({
      BedelSecimi: 1,
      BinaBedeli: 0,
      EsyaBedeli: 500_000,
    });
    expect(onlyHome).toMatchObject({ BransNo: 4, DovizTipi: 'TL' });
  });
});

describe('travel', () => {
  const travel = {
    plan: '1',
    scope: 'A',
    destination: '3',
    startDate: iso(10),
    endDate: iso(20),
    payment: 'P',
  };

  it('accepts a normal trip', async () => {
    expect(await failing({ product: 'travel', travel })).toEqual([]);
  });

  it('rejects a trip that starts in the past, ends before it starts, or lasts over a year', async () => {
    expect(
      await failing({
        product: 'travel',
        travel: { ...travel, startDate: iso(-2) },
      }),
    ).toContain('travel.startDate');
    expect(
      await failing({
        product: 'travel',
        travel: { ...travel, endDate: iso(5) },
      }),
    ).toContain('travel.endDate');
    expect(
      await failing({
        product: 'travel',
        travel: { ...travel, endDate: iso(400) },
      }),
    ).toContain('travel.endDate');
  });

  it('sends the country for an international trip and the padded province for a domestic one', () => {
    expect(build({ product: 'travel', travel }).Seyahat).toMatchObject({
      PlanSecimi: '1',
      Kapsam: 'A',
      GidilenYer: '3',
      IlKodu: '',
    });
    const domestic = build({
      product: 'travel',
      travel: { ...travel, scope: 'Y', destination: '7' },
    }).Seyahat;
    expect(domestic).toMatchObject({
      Kapsam: 'Y',
      GidilenYer: '07',
      IlKodu: '07',
    });
  });
});

describe('interpretCreate', () => {
  const answer = (body: Record<string, unknown>): IoLenientBody => ({
    __status: 200,
    ...body,
  });

  it('recognises a quote that was opened', () => {
    expect(
      interpretCreate(answer({ TeklifId: 167, Hata: { HataKodu: 0 } }), false),
    ).toEqual({ kind: 'created', quoteId: 167 });
  });

  it('asks for the vehicle when the lookup could not find it (code 14 or 17), prefilled with what it found', () => {
    const outcome = interpretCreate(
      answer({
        TeklifId: 0,
        Hata: { HataKodu: 17 },
        Arac: {
          AracKodu: '1001502',
          Marka: 'FIAT',
          YakitTipi: '3',
          MotorNo: '',
        },
      }),
      false,
    );
    expect(outcome).toEqual({
      kind: 'needsVehicle',
      vehicle: { vehicleCode: '1001502', brandName: 'FIAT', fuelType: '3' },
    });
  });

  it('does not ask again once the vehicle details were sent', () => {
    expect(
      interpretCreate(answer({ TeklifId: 0, Hata: { HataKodu: 14 } }), true),
    ).toMatchObject({ kind: 'refused', code: 14 });
  });

  it('words refusals for the customer', () => {
    expect(
      interpretCreate(
        answer({ Hata: { HataKodu: 7, Mesaj: 'Hata: Egm bulunamadı' } }),
        false,
      ),
    ).toMatchObject({
      kind: 'refused',
      message: expect.stringContaining('araç bulunamadı'),
    });
    expect(
      interpretCreate(answer({ Hata: { HataKodu: 26 } }), false),
    ).toMatchObject({
      message: 'Riziko adresinde eksiklik var, lütfen kontrol edin.',
    });
    expect(
      interpretCreate(
        answer({ Hata: { HataKodu: 99, Mesaj: 'Hata: Adres hatalı' } }),
        false,
      ),
    ).toMatchObject({ message: 'Adres hatalı' });
  });

  it('treats a server error with no business answer as unavailable', () => {
    expect(interpretCreate({ __status: 502 }, false)).toEqual({
      kind: 'unavailable',
    });
  });
});

describe('reference lists', () => {
  it('accepts the expected query shapes only', () => {
    expect(
      parseReferenceQuery('models', { brand: '100', year: '2025' }),
    ).toEqual({ brand: '100', year: '2025' });
    expect(parseReferenceQuery('models', { brand: '100' })).toEqual({
      brand: '100',
      year: undefined,
    });
    expect(
      parseReferenceQuery('address', { step: 'Mahalle', value: '16616' }),
    ).toEqual({ step: 'Mahalle', value: '16616' });
    expect(parseReferenceQuery('usage-styles', { kt: '01' })).toEqual({
      usageType: '01',
    });
    expect(parseReferenceQuery('provinces', {})).toEqual({});
  });

  it('rejects anything that could reach the IO API as something else', () => {
    expect(() => parseReferenceQuery('models', { brand: '100&x=1' })).toThrow(
      BadRequestException,
    );
    expect(() => parseReferenceQuery('models', {})).toThrow(
      BadRequestException,
    );
    expect(() =>
      parseReferenceQuery('address', { step: 'Uavt', value: '1' }),
    ).toThrow(BadRequestException);
    expect(() =>
      parseReferenceQuery('address', { step: 'Ilce', value: '34;drop' }),
    ).toThrow(BadRequestException);
    expect(() => parseReferenceQuery('countries', { scope: 'Z' })).toThrow(
      BadRequestException,
    );
  });

  it('repairs double-encoded names and leaves everything else alone', () => {
    expect(fixMojibake('124 SERÃ‡E')).toBe('124 SERÇE');
    expect(fixMojibake('Ã–ZEL')).toBe('ÖZEL');
    expect(fixMojibake('RÖMORK')).toBe('RÖMORK');
    expect(fixMojibake('EGEA CROSS')).toBe('EGEA CROSS');
  });
});

describe('offers in several currencies', () => {
  const card = (id: number, premium: number, currency: string) => ({
    Id: id,
    SirketKodu: String(id),
    SirketAdi: `S${id}`,
    Prim: premium,
    Doviz: currency,
    Hata: '',
  });

  it('groups by currency instead of comparing euros with liras', () => {
    const prices = {
      TeklifCalisildi: true,
      Sirketler: [
        card(1, 562, 'TRY'),
        card(2, 15, 'EUR'),
        card(3, 4.85, 'EUR'),
        card(4, 5.5, 'EUR'),
      ],
    } as unknown as IoPrices;
    const offers = toOffers(prices);
    expect(offers.map((offer) => offer.id)).toEqual([3, 4, 2, 1]);
    expect(offers.map((offer) => offer.currency)).toEqual([
      'EUR',
      'EUR',
      'EUR',
      'TL',
    ]);
  });

  it('puts lira first when the groups are the same size, and calls every lira code TL', () => {
    const prices = {
      TeklifCalisildi: true,
      Sirketler: [
        card(1, 3, 'EUR'),
        card(2, 900, 'TRL'),
        card(3, 5, 'EUR'),
        card(4, 800, ''),
      ],
    } as unknown as IoPrices;
    expect(toOffers(prices).map((offer) => offer.id)).toEqual([4, 2, 1, 3]);
    expect(
      ['TL', 'TRY', 'TRL', '₺', undefined].map((code) =>
        normalizeCurrency(code),
      ),
    ).toEqual(['TL', 'TL', 'TL', 'TL', 'TL']);
    expect(normalizeCurrency(' usd ')).toBe('USD');
  });
});

describe('coverage text', () => {
  it('shows the explanation, not the insurer code, and falls back to the value when there is none', () => {
    const prices = {
      TeklifCalisildi: true,
      Sirketler: [
        {
          Id: 1,
          SirketKodu: '104',
          SirketAdi: 'DOĞA',
          Prim: 100,
          Hata: '',
          Teminat: [
            {
              Kodu: 'IMM',
              Adi: 'İhtiyari Mali Mesuliyet',
              Deger: '40',
              Aciklama: '10.000.000',
            },
            {
              Kodu: 'ManeviTazminat',
              Adi: 'Manevi Tazminat',
              Deger: 'E',
              Aciklama: 'Evet',
            },
            {
              Kodu: 'YAT',
              Adi: 'Yatarak Tedavi',
              Deger: 'Limitsiz',
              Aciklama: '',
            },
            { Kodu: 'NET', Adi: 'Network', Deger: 'x', Aciklama: 'x' },
          ],
        },
      ],
    } as unknown as IoPrices;
    expect(toOffers(prices)[0].coverages).toEqual([
      { name: 'İhtiyari Mali Mesuliyet', value: '10.000.000' },
      { name: 'Manevi Tazminat', value: 'Evet' },
      { name: 'Yatarak Tedavi', value: 'Limitsiz' },
    ]);
  });
});

describe('uniqueByCode', () => {
  it('keeps the first of two names for one code', () => {
    const items = [
      { code: '053', name: 'FORD' },
      { code: '053', name: 'FORD/OTOSAN' },
      { code: '100', name: 'TOFAS-FIAT' },
    ];
    expect(uniqueByCode(items).map((item) => item.name)).toEqual([
      'FORD',
      'TOFAS-FIAT',
    ]);
  });
});
