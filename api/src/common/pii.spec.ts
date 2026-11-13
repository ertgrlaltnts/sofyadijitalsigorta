import { maskSensitive } from './pii.js';

describe('maskSensitive', () => {
  it('geçerli TC kimlik numarasını maskeler', () => {
    expect(maskSensitive('TC: 10000000146 kayıtlı')).toBe('TC: [TC KİMLİK NO] kayıtlı');
  });

  it('geçersiz 11 haneli sayıyı olduğu gibi bırakır', () => {
    expect(maskSensitive('poliçe 12345678901')).toBe('poliçe 12345678901');
  });

  it('Luhn geçen kart numarasını maskeler', () => {
    expect(maskSensitive('kart 4111 1111 1111 1111 olsun')).toBe('kart [KART NO] olsun');
  });

  it('IBAN maskeler', () => {
    expect(maskSensitive('TR33 0006 1005 1978 6457 8413 26')).toBe('[IBAN]');
  });

  it('telefon numarasını maskeler', () => {
    expect(maskSensitive('Beni 0532 123 45 67 numarasından arayın')).toBe('Beni [TELEFON] numarasından arayın');
    expect(maskSensitive('+90 532 123 45 67')).toBe('[TELEFON]');
  });

  it('normal metne dokunmaz', () => {
    expect(maskSensitive('2020 model aracım için kasko istiyorum')).toBe('2020 model aracım için kasko istiyorum');
  });
});
