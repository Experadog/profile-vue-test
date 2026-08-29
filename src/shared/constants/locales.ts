export const LOCALES = {
  ky: 'ky',
  ru: 'ru',
  en: 'en',
} as const

export type Locale = (typeof LOCALES)[keyof typeof LOCALES]

export const SUPPORTED_LOCALES: Locale[] = Object.values(LOCALES)

export const DEFAULT_LOCALE: Locale = LOCALES.ru
