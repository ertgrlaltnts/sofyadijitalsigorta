import { CHUNK_SIZE, chunkEntry } from './chunker.js';

describe('chunkEntry', () => {
  it('SSS kaydını tek chunk olarak üretir', () => {
    const chunks = chunkEntry({ title: 'Kasko nedir?', content: 'Araç sigortasıdır.', type: 'faq' });
    expect(chunks).toEqual(['Soru: Kasko nedir?\nCevap: Araç sigortasıdır.']);
  });

  it('kısa dokümanı tek parça tutar ve başlık ekler', () => {
    const chunks = chunkEntry({ title: 'DASK', content: 'Birinci paragraf.\n\nİkinci paragraf.', type: 'article' });
    expect(chunks).toHaveLength(1);
    expect(chunks[0]).toBe('DASK\n\nBirinci paragraf.\n\nİkinci paragraf.');
  });

  it('uzun dokümanı örtüşmeli parçalara böler', () => {
    const paragraphs = Array.from({ length: 30 }, (_, i) => `Paragraf ${i}. ${'Sigorta bilgisi. '.repeat(15)}`);
    const chunks = chunkEntry({ title: 'Rehber', content: paragraphs.join('\n\n'), type: 'article' });
    expect(chunks.length).toBeGreaterThan(1);
    for (const chunk of chunks) expect(chunk.length).toBeLessThanOrEqual(CHUNK_SIZE + 400);
    const tail = chunks[0].slice(-60);
    expect(chunks[1]).toContain(tail.split(' ').slice(-3).join(' '));
  });

  it('paragraf sınırı olmayan çok uzun metni böler', () => {
    const chunks = chunkEntry({ title: 'Uzun', content: 'Cümle burada. '.repeat(500), type: 'article' });
    expect(chunks.length).toBeGreaterThan(1);
  });
});
