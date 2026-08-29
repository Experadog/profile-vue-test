// Keys used for persisted browser storage (localStorage/sessionStorage).
// Centralized here so no feature hardcodes a raw string key.
export const STORAGE_KEYS = {
  accessToken: 'gh-profile:access-token',
  theme: 'gh-profile:theme',
  locale: 'gh-profile:locale',
} as const

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS]
