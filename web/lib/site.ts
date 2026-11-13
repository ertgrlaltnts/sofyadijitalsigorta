/** Canonical origin of the deployed site. Set NEXT_PUBLIC_SITE_URL per environment; no trailing slash. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.sofyadijitalsigorta.com").replace(/\/$/, "");

export const SITE_NAME = "Sofya Dijital Sigorta";

export const HOME_TITLE = "Kasko, Trafik, DASK Sigorta Teklifi | Sofya Dijital Sigorta";
export const HOME_DESCRIPTION =
  "Kasko, trafik, DASK, konut ve tamamlayıcı sağlık sigortası için Sofya'ya sorun. Teminatları sade bir dille öğrenin, hızla teklif alın.";

const SHARE_ALT = "Sofya Dijital Sigorta: yapay zeka sigorta danışmanı Sofya";
/** Share image (app/opengraph-image.jpg), stated explicitly so the URL always uses metadataBase. */
export const OG_IMAGES = [{ url: "/opengraph-image.jpg", width: 1200, height: 630, alt: SHARE_ALT }];
export const TWITTER_IMAGES = [{ url: "/twitter-image.jpg", width: 1200, height: 630, alt: SHARE_ALT }];
