import { STORAGE_KEYS } from '@/shared/constants/storage-keys'
import { THEMES, type Theme } from '@/shared/constants/themes'

// The only module allowed to touch localStorage for the persisted theme
// choice. No business logic, no DOM manipulation — pure storage isolation,
// mirroring `shared/api/token-storage.ts`.

function isTheme(value: string | null): value is Theme {
  return value === THEMES.light || value === THEMES.dark
}

export function getStoredTheme(): Theme | null {
  const value = localStorage.getItem(STORAGE_KEYS.theme)
  return isTheme(value) ? value : null
}

export function setStoredTheme(theme: Theme): void {
  localStorage.setItem(STORAGE_KEYS.theme, theme)
}
