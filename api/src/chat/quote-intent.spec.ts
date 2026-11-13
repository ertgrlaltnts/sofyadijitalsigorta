import { detectQuoteIntent, fold } from './quote-intent.js';

describe('fold', () => {
  it('küçük harfe çevirir ve Türkçe harfleri sadeleştirir', () => {
    expect(fold('KASKO Sigortası İÇİN Şöyle')).toBe(
      'kasko sigortasi icin soyle',
    );
  });
});

describe('detectQuoteIntent', () => {
  it.each([
    ['Kasko nedir?', 'kasko'],
    ['Trafik sigortası zorunlu mu?', 'traffic'],
    ['DASK neleri kapsar?', 'dask'],
    ['Zorunlu deprem sigortası nedir', 'dask'],
    ['İMM ne işe yarar', 'imm'],
    ['Konut sigortası yangını karşılar mı', 'home'],
    ['Seyahat sağlık sigortası vize için geçerli mi', 'travel'],
    ['Tamamlayıcı sağlık sigortası nedir', 'health'],
    ['TSS kimler için', 'health'],
    ['Ferdi kaza sigortası neleri kapsar', 'accident'],
  ] as const)(
    '"%s" bilgi sorusu: ürün %s, açık talep değil',
    (message, product) => {
      expect(detectQuoteIntent(message)).toEqual({ product, explicit: false });
    },
  );

  it.each([
    ['Kasko teklifi almak istiyorum', 'kasko'],
    ['kasko fiyatı ne kadar tutar', 'kasko'],
    ['Trafik sigortası yaptırmak istiyorum', 'traffic'],
    ['DASK için fiyat öğrenmek istiyorum', 'dask'],
  ] as const)('"%s" teklif talebi: ürün %s', (message, product) => {
    expect(detectQuoteIntent(message)).toEqual({ product, explicit: true });
  });

  it('ürün söylemeden teklif isteyene ürün seçtirir', () => {
    expect(detectQuoteIntent('Nasıl teklif alabilirim?')).toEqual({
      product: null,
      explicit: true,
    });
    expect(detectQuoteIntent('teklif')).toEqual({
      product: null,
      explicit: true,
    });
  });

  it('devam sorusunda önceki mesajdaki ürünü kullanır', () => {
    expect(detectQuoteIntent('peki ne kadar tutar?', 'Kasko nedir?')).toEqual({
      product: 'kasko',
      explicit: true,
    });
    expect(detectQuoteIntent('teşekkürler', 'Kasko nedir?')).toEqual({
      product: null,
      explicit: false,
    });
  });

  it('iki ürünü anan karşılaştırma sorusunda ürün seçmez', () => {
    expect(
      detectQuoteIntent('Kasko ile trafik sigortası arasındaki fark nedir?'),
    ).toEqual({ product: null, explicit: false });
  });

  it('istemeyen kullanıcıya teklif sunmaz', () => {
    expect(
      detectQuoteIntent(
        'Kasko için teklif istemiyorum, sadece bilgi almak istiyorum',
      ).explicit,
    ).toBe(false);
  });

  it('sigorta dışı ve genel sorulara karışmaz', () => {
    expect(detectQuoteIntent('Trafik cezası ne kadar')).toEqual({
      product: null,
      explicit: false,
    });
    expect(detectQuoteIntent('Merhaba')).toEqual({
      product: null,
      explicit: false,
    });
  });
});
