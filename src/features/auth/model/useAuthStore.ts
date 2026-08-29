import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import { useUserStore } from '@/entities/user'
import { setAccessToken, clearAccessToken, hasAccessToken } from '@/shared/api/token-storage'

import { buildAuthorizeUrl, exchangeCodeForToken } from '../api/authApi'

export type AuthStatus = 'idle' | 'loading' | 'error'

// Coordinates the OAuth session lifecycle. Deliberately does NOT hold its
// own copy of the current user — `entities/user`'s `useUserStore.currentUser`
// stays the single source of truth; this store only decides when to
// populate/clear it and manages the token.
export const useAuthStore = defineStore('auth', () => {
  const userStore = useUserStore()

  const status = ref<AuthStatus>('idle')
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => hasAccessToken() && userStore.currentUser !== null)

  // Full-page redirect to GitHub's authorization screen. Nothing to await —
  // the browser navigates away.
  function login(): void {
    window.location.assign(buildAuthorizeUrl())
  }

  // Called by the OAuth callback route once GitHub redirects back with
  // `?code=...`. Exchanges it for a token, stores it, and resolves who the
  // authenticated user is.
  async function handleCallback(code: string): Promise<boolean> {
    status.value = 'loading'
    error.value = null

    try {
      const tokenResponse = await exchangeCodeForToken(code)

      if (!tokenResponse.access_token) {
        throw new Error(tokenResponse.error_description ?? tokenResponse.error ?? 'GitHub did not return an access token')
      }

      setAccessToken(tokenResponse.access_token)

      const result = await userStore.loadCurrentUser()
      if (result === 'unauthorized') {
        // The token we just received was rejected — nothing to retry with.
        clearAccessToken()
        userStore.clearCurrentUser()
        error.value = 'Failed to load the authenticated user'
        status.value = 'error'
        return false
      }
      if (result === 'error') {
        // Keep the freshly-issued token — this is likely transient (e.g.
        // network hiccup) and a reload will retry via `initializeSession`.
        error.value = 'Failed to load the authenticated user'
        status.value = 'error'
        return false
      }

      status.value = 'idle'
      return true
    } catch (err) {
      clearAccessToken()
      userStore.clearCurrentUser()
      error.value = err instanceof Error ? err.message : 'GitHub sign-in failed'
      status.value = 'error'
      return false
    }
  }

  // Restores the session on app start if a token was already stored.
  // No-op if there is no token — never surfaces "logged in" without one.
  async function initializeSession(): Promise<void> {
    if (!hasAccessToken()) return

    status.value = 'loading'
    error.value = null

    const result = await userStore.loadCurrentUser()

    if (result === 'unauthorized') {
      // GitHub confirmed the stored token is no longer valid — clear it so
      // the app doesn't keep presenting a broken "authenticated" state.
      clearAccessToken()
      userStore.clearCurrentUser()
    }
    // On a generic 'error' (e.g. offline), keep the token: `currentUser`
    // stays null so the UI correctly shows "logged out" for this session,
    // and the next reload gets another chance to validate it.

    status.value = 'idle'
  }

  function logout(): void {
    clearAccessToken()
    userStore.clearCurrentUser()
  }

  return {
    status,
    error,
    isAuthenticated,
    login,
    handleCallback,
    initializeSession,
    logout,
  }
})
