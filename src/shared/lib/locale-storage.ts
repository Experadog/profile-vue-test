import { STORAGE_KEYS } from '@/shared/constants/storage-keys'
import { SUPPORTED_LOCALES, type Locale } from '@/shared/constants/locales'

// The only module allowed to touch localStorage for the persisted locale
// choice. No business logic, no i18n instance access — pure storage
// isolation, mirroring `shared/lib/theme-storage.ts`.

function isLocale(value: string | null): value is Locale {
  return (SUPPORTED_LOCALES as string[]).includes(value ?? '')
}

export function getStoredLocale(): Locale | null {
  const value = localStorage.getItem(STORAGE_KEYS.locale)
  return isLocale(value) ? value : null
}

export function setStoredLocale(locale: Locale): void {
  localStorage.setItem(STORAGE_KEYS.locale, locale)
}
