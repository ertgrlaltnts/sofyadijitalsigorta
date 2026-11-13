export interface Env {
  PORT: number;
  /** Number of reverse proxies in front of the API (0 when it is reached directly). */
  TRUST_PROXY: number;
  MONGODB_URI: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  OPENAI_API_KEY: string;
  OPENAI_CHAT_MODEL: string;
  OPENAI_EMBEDDING_MODEL: string;
  CORS_ORIGINS: string[];
  ADMIN_EMAIL: string;
  ADMIN_PASSWORD: string;
  IO_API_URL: string;
  IO_API_TOKEN: string;
  IO_FIRMA_KODU: string;
  IO_PROGRAM: string;
  IO_CHANNEL: number;
  PURCHASE_ENABLED: boolean;
}

function required(config: Record<string, unknown>, key: string): string {
  const value = config[key];
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`Ortam değişkeni eksik: ${key}`);
  }
  return value.trim();
}

function optional(
  config: Record<string, unknown>,
  key: string,
  fallback: string,
): string {
  const value = config[key];
  return typeof value === 'string' && value.trim() !== ''
    ? value.trim()
    : fallback;
}

export function loadEnv(config: Record<string, unknown>): Env {
  return {
    PORT: Number(optional(config, 'PORT', '4000')),
    TRUST_PROXY: Number(optional(config, 'TRUST_PROXY', '0')) || 0,
    MONGODB_URI: required(config, 'MONGODB_URI'),
    JWT_SECRET: required(config, 'JWT_SECRET'),
    JWT_EXPIRES_IN: optional(config, 'JWT_EXPIRES_IN', '7d'),
    OPENAI_API_KEY: required(config, 'OPENAI_API_KEY'),
    OPENAI_CHAT_MODEL: optional(config, 'OPENAI_CHAT_MODEL', 'gpt-4o-mini'),
    OPENAI_EMBEDDING_MODEL: optional(
      config,
      'OPENAI_EMBEDDING_MODEL',
      'text-embedding-3-small',
    ),
    CORS_ORIGINS: optional(config, 'CORS_ORIGINS', 'http://localhost:4002')
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean),
    ADMIN_EMAIL: required(config, 'ADMIN_EMAIL').toLowerCase(),
    ADMIN_PASSWORD: required(config, 'ADMIN_PASSWORD'),
    IO_API_URL: optional(
      config,
      'IO_API_URL',
      'https://online.sofyadijitalsigorta.com',
    ).replace(/\/$/, ''),
    // Empty disables the quote endpoints (they answer 503) instead of stopping the whole API.
    IO_API_TOKEN: optional(config, 'IO_API_TOKEN', ''),
    IO_FIRMA_KODU: optional(config, 'IO_FIRMA_KODU', '2286'),
    IO_PROGRAM: optional(config, 'IO_PROGRAM', 'io_dijital'),
    IO_CHANNEL: Number(optional(config, 'IO_CHANNEL', '1')),
    // Card payments on the website. Off until explicitly enabled, because a purchase issues a real policy and charges a real card.
    PURCHASE_ENABLED:
      optional(config, 'QUOTE_PURCHASE_ENABLED', 'false').toLowerCase() ===
      'true',
  };
}
