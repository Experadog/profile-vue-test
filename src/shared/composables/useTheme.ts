import { readonly, ref } from 'vue'

import { DEFAULT_THEME, THEMES, type Theme } from '@/shared/constants/themes'
import { getStoredTheme, setStoredTheme } from '@/shared/lib/theme-storage'

// Module-level singleton: one theme state shared by every `useTheme()`
// caller, applied once per app instance rather than per component.
const theme = ref<Theme>(getStoredTheme() ?? DEFAULT_THEME)

function applyThemeToDocument(value: Theme): void {
  document.documentElement.setAttribute('data-theme', value)
}

// Applied as soon as this module is first imported (from `app/App.vue`,
// before the first paint) so there is no flash of the wrong theme, and so
// a stored theme survives a reload without any page-level wiring.
applyThemeToDocument(theme.value)

function setTheme(value: Theme): void {
  theme.value = value
  applyThemeToDocument(value)
  setStoredTheme(value)
}

function toggleTheme(): void {
  setTheme(theme.value === THEMES.light ? THEMES.dark : THEMES.light)
}

export function useTheme() {
  return {
    theme: readonly(theme),
    setTheme,
    toggleTheme,
  }
}
