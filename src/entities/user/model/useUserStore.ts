import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'

import { hasAccessToken } from '@/shared/api/token-storage'
import { isApiError } from '@/shared/api/errors'

import { getUser, searchUsers, getCurrentUser, updateCurrentUser } from '../api/userApi'
import { mapGithubUserToUser, mapGithubUserSearchResponseToUserSearchResult } from './mappers'
import type { User, UserSearchResult, UserProfileUpdate } from './types'

export type AsyncStatus = 'idle' | 'loading' | 'error' | 'success'

export const useUserStore = defineStore('user', () => {
  // Cache of already-fetched users, keyed by login. Prevents storing the
  // same user twice regardless of whether it came from `fetchUser` or a search.
  const usersByLogin = reactive<Record<string, User>>({})

  const userStatus = ref<AsyncStatus>('idle')
  const userError = ref<string | null>(null)

  const searchResult = ref<UserSearchResult | null>(null)
  const searchStatus = ref<AsyncStatus>('idle')
  const searchError = ref<string | null>(null)

  // The authenticated user (self). Kept separate from `usersByLogin` because
  // it carries fields (email) that only ever come back for `/user`, and its
  // lifecycle (login/logout, editing) is different from a browsed profile.
  const currentUser = ref<User | null>(null)
  const currentUserStatus = ref<AsyncStatus>('idle')
  const currentUserError = ref<string | null>(null)

  const updateStatus = ref<AsyncStatus>('idle')
  const updateError = ref<string | null>(null)

  function cacheUser(user: User): void {
    usersByLogin[user.login] = user
  }

  async function fetchUser(username: string): Promise<void> {
    const cached = usersByLogin[username]
    if (cached) {
      userStatus.value = 'success'
      userError.value = null
      return
    }

    userStatus.value = 'loading'
    userError.value = null

    try {
      const dto = await getUser(username)
      cacheUser(mapGithubUserToUser(dto))
      userStatus.value = 'success'
    } catch (error) {
      userStatus.value = 'error'
      userError.value = error instanceof Error ? error.message : 'Failed to load user'
    }
  }

  async function fetchSearchUsers(query: string, page = 1, perPage = 30): Promise<void> {
    searchStatus.value = 'loading'
    searchError.value = null

    try {
      const dto = await searchUsers(query, page, perPage)
      const result = mapGithubUserSearchResponseToUserSearchResult(dto)

      result.users.forEach(cacheUser)
      searchResult.value = result
      searchStatus.value = 'success'
    } catch (error) {
      searchStatus.value = 'error'
      searchError.value = error instanceof Error ? error.message : 'Failed to search users'
    }
  }

  // No-op (leaves status 'idle') until an access token exists — there is no
  // authenticated session before the OAuth flow is wired up, so calling
  // `/user` without a token would only ever surface a confusing 401.
  async function fetchCurrentUser(): Promise<void> {
    if (!hasAccessToken()) return

    if (currentUser.value) {
      currentUserStatus.value = 'success'
      currentUserError.value = null
      return
    }

    currentUserStatus.value = 'loading'
    currentUserError.value = null

    try {
      const dto = await getCurrentUser()
      const user = mapGithubUserToUser(dto)
      currentUser.value = user
      cacheUser(user)
      currentUserStatus.value = 'success'
    } catch (error) {
      currentUserStatus.value = 'error'
      currentUserError.value = error instanceof Error ? error.message : 'Failed to load profile'
    }
  }

  // Used by `features/auth` to (re)resolve the session: unlike
  // `fetchCurrentUser`, this always hits the network (no cache short-circuit)
  // and reports *why* it failed, so the auth flow can tell "token is
  // invalid/expired" (401) apart from a transient failure and react
  // accordingly, instead of just swallowing the error into a string.
  async function loadCurrentUser(): Promise<'success' | 'unauthorized' | 'error'> {
    currentUserStatus.value = 'loading'
    currentUserError.value = null

    try {
      const dto = await getCurrentUser()
      const user = mapGithubUserToUser(dto)
      currentUser.value = user
      cacheUser(user)
      currentUserStatus.value = 'success'
      return 'success'
    } catch (error) {
      currentUserStatus.value = 'error'

      if (isApiError(error) && error.status === 401) {
        currentUserError.value = null
        return 'unauthorized'
      }

      currentUserError.value = error instanceof Error ? error.message : 'Failed to load profile'
      return 'error'
    }
  }

  // Resets the authenticated-session slice of state (used on logout, and
  // when a stored token turns out to be invalid). Does not touch
  // `usersByLogin` — a browsed profile that happened to be the same person
  // is still valid cached data.
  function clearCurrentUser(): void {
    currentUser.value = null
    currentUserStatus.value = 'idle'
    currentUserError.value = null
  }

  async function updateProfile(update: UserProfileUpdate): Promise<boolean> {
    updateStatus.value = 'loading'
    updateError.value = null

    try {
      const dto = await updateCurrentUser({
        name: update.name,
        bio: update.bio,
        company: update.company,
        location: update.location,
      })
      const user = mapGithubUserToUser(dto)
      currentUser.value = user
      cacheUser(user)
      updateStatus.value = 'success'
      return true
    } catch (error) {
      updateStatus.value = 'error'
      updateError.value = error instanceof Error ? error.message : 'Failed to update profile'
      return false
    }
  }

  return {
    usersByLogin,
    userStatus,
    userError,
    searchResult,
    searchStatus,
    searchError,
    currentUser,
    currentUserStatus,
    currentUserError,
    updateStatus,
    updateError,
    fetchUser,
    fetchSearchUsers,
    fetchCurrentUser,
    loadCurrentUser,
    clearCurrentUser,
    updateProfile,
  }
})
