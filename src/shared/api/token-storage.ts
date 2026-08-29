import { STORAGE_KEYS } from '@/shared/constants/storage-keys'

// The only module allowed to touch localStorage for the GitHub access token.
// No business logic, no Pinia, no GitHub API calls — pure storage isolation.

export function getAccessToken(): string | null {
  return localStorage.getItem(STORAGE_KEYS.accessToken)
}

export function setAccessToken(token: string): void {
  localStorage.setItem(STORAGE_KEYS.accessToken, token)
}

export function clearAccessToken(): void {
  localStorage.removeItem(STORAGE_KEYS.accessToken)
}

export function hasAccessToken(): boolean {
  return getAccessToken() !== null
}
