import type { QuoteProduct } from '../quotes/products.js';

/** What a chat message says about getting a quote: which product it is about (if exactly one), and whether it asks for one. */
export interface QuoteIntent {
  product: QuoteProduct | null;
  /** The user asks to get quotes or a price, rather than asking a question about the insurance. */
  explicit: boolean;
}

export const NO_INTENT: QuoteIntent = { product: null, explicit: false };

/** How each product is named in a sentence ("Kasko için ..."). */
export const QUOTE_LABELS: Record<QuoteProduct, string> = {
  health: 'Tamamlayıcı sağlık sigortası',
  accident: 'Ferdi kaza sigortası',
  traffic: 'Trafik sigortası',
  kasko: 'Kasko',
  imm: 'İMM sigortası',
  dask: 'DASK',
  home: 'Konut sigortası',
  travel: 'Seyahat sigortası',
};

const TURKISH: Record<string, string> = {
  ı: 'i',
  ğ: 'g',
  ü: 'u',
  ş: 's',
  ö: 'o',
  ç: 'c',
  â: 'a',
  î: 'i',
  û: 'u',
};

/** Lower-case and strip the Turkish letters, so "Kasko Sigortası" and "kasko sigortasi" read the same. */
export const fold = (text: string): string =>
  text
    .toLocaleLowerCase('tr')
    .replace(/[ığüşöçâîû]/g, (char) => TURKISH[char] ?? char);

const PRODUCTS: [QuoteProduct, RegExp][] = [
  ['imm', /\bimm\b|ihtiyari mali|mali mesuliyet/],
  ['accident', /ferdi kaza/],
  // "seyahat sağlık sigortası" is travel insurance, not health insurance.
  ['health', /tamamlayici|\btss\b|ozel saglik|(?<!seyahat )saglik sigorta/],
  ['travel', /seyahat|yurt ?disi|schengen|vize sigorta/],
  ['dask', /\bdask\b|zorunlu deprem|deprem sigorta/],
  ['home', /konut sigorta|ev sigorta|\bkonut\b|yangin sigorta/],
  ['kasko', /\bkasko/],
  [
    'traffic',
    /trafik sigorta|trafik police|zorunlu trafik|\btrafik\b(?! ceza)/,
  ],
];

/** Phrases that ask for a quote or a price. A plain question ("fiyat nasıl belirlenir?") is not one. */
const ASKS_FOR_QUOTE =
  /\bteklif(?! nedir)|fiyat (al|ogren|bak|cikar|hesapla|ver)|ne kadar (tutar|tutuyor|olur|eder|oder|ode)|kac (para|tl|lira)|(almak|yaptirmak|yaptirayim|yenilemek|yenilet|sigortalatmak|sigortalatayim) ist|sigorta(m|mi)? (yaptir|yenile)/;

const DECLINES = /istemiyorum|gerek yok|vazgect|sadece bilgi|bilgi almak/;

/** Every product a text mentions. A text that names two ("kasko ile trafik farkı") is a comparison, not a quote request. */
function mentioned(folded: string): QuoteProduct[] {
  return PRODUCTS.filter(([, pattern]) => pattern.test(folded)).map(
    ([product]) => product,
  );
}

/**
 * Reads a chat message for the quote offer. `previous` is the user's message before it: a follow-up like "peki ne kadar tutar?"
 * has no product of its own and inherits the one the conversation was about.
 */
export function detectQuoteIntent(
  message: string,
  previous?: string,
): QuoteIntent {
  const text = fold(message);
  const explicit = ASKS_FOR_QUOTE.test(text) && !DECLINES.test(text);
  const found = mentioned(text);

  let product: QuoteProduct | null = found.length === 1 ? found[0] : null;
  if (found.length === 0 && explicit && previous) {
    const before = mentioned(fold(previous));
    if (before.length === 1) product = before[0];
  }
  return { product, explicit };
}
