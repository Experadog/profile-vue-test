import { LOCALES } from '@/shared/constants/locales'

import ky from './ky'
import ru from './ru'
import en from './en'

export const messages = {
  [LOCALES.ky]: ky,
  [LOCALES.ru]: ru,
  [LOCALES.en]: en,
}
