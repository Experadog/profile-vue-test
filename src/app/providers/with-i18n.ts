import { createI18n } from 'vue-i18n'

import { DEFAULT_LOCALE } from '@/shared/constants/locales'
import { getStoredLocale } from '@/shared/lib/locale-storage'

import { messages } from '@/app/i18n'

export const i18n = createI18n({
  legacy: false,
  locale: getStoredLocale() ?? DEFAULT_LOCALE,
  fallbackLocale: DEFAULT_LOCALE,
  messages,
})
