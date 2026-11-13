import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateQuoteDto } from './quotes.dto.js';
import type { IoPrices } from './io-api.client.js';
import { buildQuoteRequest } from './quote-request.builder.js';
import { toOffers } from './quotes.service.js';

const VALID_TCKN = '10000000146';

const form = (extra: Record<string, unknown> = {}) =>
  plainToInstance(CreateQuoteDto, {
    product: 'health',
    tckn: VALID_TCKN,
    birthDate: '1990-05-17',
    phone: '0555 209 06 09',
    consent: true,
    health: {
      height: 182,
      weight: 96,
      cover: 'outpatient',
      visits: 2,
      network: 1,
      birthCover: false,
      payment: 'P',
    },
    ...extra,
  });

const errorsOf = async (dto: CreateQuoteDto) =>
  (await validate(dto)).map((error) => error.property);

describe('CreateQuoteDto', () => {
  it('accepts a valid health request and normalises the phone number', async () => {
    const dto = form();
    expect(await errorsOf(dto)).toEqual([]);
    expect(dto.phone).toBe('5552090609');
  });

  it('accepts a valid accident request', async () => {
    const dto = form({
      product: 'accident',
      health: undefined,
      accident: {
        coverage: '5',
        earthquake: true,
        assistance: false,
        treatment: false,
        payment: 'P',
      },
    });
    expect(await errorsOf(dto)).toEqual([]);
  });

  it('rejects an ID number with a bad checksum', async () => {
    expect(await errorsOf(form({ tckn: '12345678901' }))).toContain('tckn');
  });

  it('rejects minors and impossible dates', async () => {
    const year = new Date().getFullYear() - 5;
    expect(await errorsOf(form({ birthDate: `${year}-01-01` }))).toContain(
      'birthDate',
    );
    expect(await errorsOf(form({ birthDate: '1990-02-31' }))).toContain(
      'birthDate',
    );
  });

  it('requires consent and a mobile phone number', async () => {
    const errors = await errorsOf(
      form({ consent: false, phone: '2125550000' }),
    );
    expect(errors).toEqual(expect.arrayContaining(['consent', 'phone']));
  });

  it('requires the details of the chosen product', async () => {
    expect(await errorsOf(form({ health: undefined }))).toContain('health');
    expect(
      await errorsOf(
        form({
          product: 'accident',
          accident: {
            coverage: '1',
            earthquake: false,
            assistance: false,
            treatment: false,
            payment: 'P',
          },
        }),
      ),
    ).toContain('accident');
  });

  it('rejects implausible height and weight', async () => {
    const dto = form({
      health: {
        height: 20,
        weight: 96,
        cover: 'inpatient',
        network: 1,
        birthCover: false,
        payment: 'P',
      },
    });
    expect((await validate(dto))[0].children?.[0].property).toBe('height');
  });
});

describe('transfer details', () => {
  const health = (transfer: Record<string, unknown>) =>
    form({
      health: {
        height: 170,
        weight: 70,
        cover: 'inpatient',
        network: 1,
        birthCover: false,
        payment: 'P',
        transfer,
      },
    });
  const good = {
    companyCode: '045',
    agencyNo: '1234',
    policyNo: 'ABC-99',
    endDate: '2099-03-01',
  };

  it('accepts a complete previous policy', async () => {
    expect(await errorsOf(health(good))).toEqual([]);
  });

  it('rejects a missing policy number and a past end date', async () => {
    const errors = await validate(
      health({ ...good, policyNo: '', endDate: '2020-01-01' }),
    );
    // health -> transfer -> the failing fields
    const nested = errors[0].children?.[0].children?.map(
      (child) => child.property,
    );
    expect(nested).toEqual(expect.arrayContaining(['policyNo', 'endDate']));
  });
});

describe('buildQuoteRequest', () => {
  const insured = { AdUnvanYildizli: 'AB*** CD***', Cinsiyet: 'E' };

  it('maps a health form to Saglik with the outpatient plan', async () => {
    const request = buildQuoteRequest(form(), { insured }, 1);
    expect(request).toMatchObject({
      BransNo: 18,
      Kanal: 1,
      TeklifId: 0,
      Guncelle: false,
      Sigortali: { KimlikNo: VALID_TCKN, Cinsiyet: 'E' },
      OdemeSekli: 'P',
      Saglik: {
        Plan: 1,
        PlanTipi: 2,
        Boy: 182,
        Kilo: 96,
        Network: 1,
        DogumTeminati: false,
        Transfer: false,
        AileTeklifi: false,
      },
    });
    expect(request).not.toHaveProperty('OncekiPolice');
    expect(request).not.toHaveProperty('FerdiKaza');
  });

  it('sends no outpatient limit for an inpatient-only plan', () => {
    const request = buildQuoteRequest(
      form({
        health: {
          height: 170,
          weight: 70,
          cover: 'inpatient',
          visits: 3,
          network: 0,
          birthCover: false,
          payment: 'P',
        },
      }),
      { insured },
      1,
    );
    expect(request.Saglik).toMatchObject({ Plan: 0, PlanTipi: 0 });
  });

  it('sends network, birth cover, instalments and the previous policy for a transfer', () => {
    const transfer = {
      companyCode: '045',
      agencyNo: '1234',
      policyNo: 'ABC-99',
      endDate: '2027-03-01',
    };
    const request = buildQuoteRequest(
      form({
        health: {
          height: 170,
          weight: 70,
          cover: 'inpatient',
          network: 2,
          birthCover: true,
          payment: '6',
          transfer,
        },
      }),
      { insured },
      1,
    );
    expect(request).toMatchObject({
      OdemeSekli: '6',
      Saglik: { Network: 2, DogumTeminati: true, Transfer: true },
      OncekiPolice: {
        SirketKodu: '045',
        AcenteNo: '1234',
        PoliceNo: 'ABC-99',
        BitisTarihi: '2027-03-01',
      },
    });
  });

  it('maps an accident form to FerdiKaza paid up front', () => {
    const dto = form({
      product: 'accident',
      health: undefined,
      accident: {
        coverage: '7',
        earthquake: true,
        assistance: false,
        treatment: true,
        payment: 'V',
      },
    });
    const request = buildQuoteRequest(dto, { insured }, 1);
    expect(request).toMatchObject({
      BransNo: 13,
      OdemeSekli: 'V',
      FerdiKaza: {
        Teminat: '7',
        Deprem: true,
        Asistans: false,
        TedaviVar: true,
      },
    });
    expect(request).not.toHaveProperty('Saglik');
  });
});

describe('toOffers', () => {
  const card = (overrides: Record<string, unknown>) => ({
    Id: 1,
    SirketKodu: '115',
    SirketAdi: 'ANA SİGORTA',
    Prim: 1000,
    Hata: '',
    Taksit: 'Peşin',
    ...overrides,
  });

  it('keeps priced cards without errors, cheapest first', () => {
    const prices = {
      TeklifCalisildi: true,
      Sirketler: [
        card({ Id: 1, Prim: 21187.88, SirketAdi: 'ALLIANZ SIGORTA' }),
        card({ Id: 2, Prim: 0, Hata: 'İstek limitine ulaşıldı.' }),
        card({ Id: 3, Prim: 16583 }),
        card({ Id: 4, Prim: 900, Hata: 'Uyarı' }),
      ],
    } as IoPrices;
    expect(toOffers(prices).map((offer) => offer.id)).toEqual([3, 1]);
  });

  it('lists coverages that have a value even when the insurer flags them inactive, without the network entry', () => {
    const prices = {
      TeklifCalisildi: true,
      Sirketler: [
        card({
          Teminat: [
            {
              Adi: 'Yatarak Tedavi',
              Deger: 'Limitsiz',
              Aktif: true,
              Kodu: 'YAT',
            },
            { Adi: 'Network', Deger: '', Aktif: false, Kodu: 'NET' },
            { Adi: 'Diş Paketi', Deger: 'Yok', Aktif: false, Kodu: 'DIS' },
            { Adi: 'Ambulans', Deger: '  ', Aktif: true, Kodu: 'AMB' },
          ],
        }),
      ],
    } as IoPrices;
    expect(toOffers(prices)[0].coverages).toEqual([
      { name: 'Yatarak Tedavi', value: 'Limitsiz' },
      { name: 'Diş Paketi', value: 'Yok' },
    ]);
  });

  it('copes with a response that has no cards yet', () => {
    expect(toOffers({ TeklifCalisildi: false } as IoPrices)).toEqual([]);
  });
});
