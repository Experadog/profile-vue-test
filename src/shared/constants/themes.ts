export const THEMES = {
  light: 'light',
  dark: 'dark',
} as const

export type Theme = (typeof THEMES)[keyof typeof THEMES]

export const SUPPORTED_THEMES: Theme[] = Object.values(THEMES)

export const DEFAULT_THEME: Theme = THEMES.light
