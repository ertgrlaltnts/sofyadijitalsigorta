/** Products whose quote form asks the quote API for real prices. Each product page names its product in `form`. */
export type LiveQuoteKey = "health" | "accident" | "traffic" | "kasko" | "imm" | "dask" | "home" | "travel";

export const isVehicleProduct = (product: LiveQuoteKey): boolean => product === "traffic" || product === "kasko" || product === "imm";

/** How each product is named in a sentence or on a button. */
export const PRODUCT_LABEL: Record<LiveQuoteKey, string> = {
  kasko: "Kasko",
  traffic: "Trafik sigortası",
  health: "Tamamlayıcı sağlık",
  dask: "DASK",
  home: "Konut sigortası",
  travel: "Seyahat sigortası",
  imm: "İMM",
  accident: "Ferdi kaza",
};

/** The page headings, used when a quote is described to the agency. */
export const PRODUCT_SERVICE: Record<LiveQuoteKey, string> = {
  kasko: "Kasko Sigortası",
  traffic: "Trafik Sigortası",
  health: "Tamamlayıcı Sağlık Sigortası",
  dask: "DASK / Zorunlu Deprem Sigortası",
  home: "Konut Sigortası",
  travel: "Seyahat Sağlık Sigortası",
  imm: "İMM Sigortası",
  accident: "Ferdi Kaza Sigortası",
};

/** The file name of each product's icon in public/icons. */
export const PRODUCT_ICON: Record<LiveQuoteKey, string> = {
  kasko: "kasko",
  traffic: "trafik-sigortasi",
  health: "tamamlayici-saglik",
  dask: "dask",
  home: "konut-sigortasi",
  travel: "seyahat-sigortasi",
  imm: "imm",
  accident: "ferdi-kaza",
};

/** The order products are offered in. */
export const PRODUCT_ORDER = Object.keys(PRODUCT_LABEL) as LiveQuoteKey[];

export const isLiveQuoteKey = (value: unknown): value is LiveQuoteKey => typeof value === "string" && value in PRODUCT_LABEL;
