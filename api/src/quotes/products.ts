/** Products the website can quote and sell, with the IO branch number (BransNo) of each. */
export const QUOTE_PRODUCTS = [
  'health',
  'accident',
  'traffic',
  'kasko',
  'imm',
  'dask',
  'home',
  'travel',
] as const;
export type QuoteProduct = (typeof QUOTE_PRODUCTS)[number];

export const BRANCH: Record<QuoteProduct, number> = {
  traffic: 0,
  kasko: 1,
  dask: 2,
  home: 4,
  travel: 6,
  accident: 13,
  health: 18,
  imm: 22,
};

/** Products that insure a vehicle: they take a plate (or a "no plate yet" vehicle) and may need manual vehicle details. */
export const VEHICLE_PRODUCTS = ['traffic', 'kasko', 'imm'] as const;
export const isVehicleProduct = (product: QuoteProduct): boolean =>
  (VEHICLE_PRODUCTS as readonly string[]).includes(product);

/** What the insurers' own forms offer as payment plans: kasko and health take instalments, the rest only cash or "vadeli". */
export const PAYMENTS = {
  instalments: ['P', '3', '6', '9'],
  deferred: ['P', 'V'],
} as const;
