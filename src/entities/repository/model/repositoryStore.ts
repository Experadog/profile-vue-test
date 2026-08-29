import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'

import { hasAccessToken } from '@/shared/api/token-storage'

import { getPublicRepositories, getAuthenticatedUserPrivateRepositories } from '../api/repositoryApi'
import { mapGithubRepositoryToRepository } from './mappers'
import type { Repository } from './types'

export type AsyncStatus = 'idle' | 'loading' | 'error' | 'success'

export const useRepositoryStore = defineStore('repository', () => {
  // Public repositories, cached per owner login — works identically for the
  // authenticated user's own public repos and for any other user's.
  const publicRepositoriesByOwner = reactive<Record<string, Repository[]>>({})
  const publicStatusByOwner = reactive<Record<string, AsyncStatus>>({})
  const publicErrorByOwner = reactive<Record<string, string | null>>({})

  // Private repositories only ever belong to the authenticated user — GitHub
  // has no endpoint that exposes another user's private repos — so there is
  // exactly one private list, not one per owner.
  const privateRepositories = ref<Repository[] | null>(null)
  const privateStatus = ref<AsyncStatus>('idle')
  const privateError = ref<string | null>(null)

  async function fetchPublicRepositories(username: string): Promise<void> {
    if (publicStatusByOwner[username] === 'success') return

    publicStatusByOwner[username] = 'loading'
    publicErrorByOwner[username] = null

    try {
      const dtos = await getPublicRepositories(username)
      publicRepositoriesByOwner[username] = dtos.map(mapGithubRepositoryToRepository)
      publicStatusByOwner[username] = 'success'
    } catch (err) {
      publicStatusByOwner[username] = 'error'
      publicErrorByOwner[username] = err instanceof Error ? err.message : 'Failed to load repositories'
    }
  }

  // No-op until an access token exists — mirrors `userStore.fetchCurrentUser`:
  // there is no authenticated session before OAuth is wired up.
  async function fetchPrivateRepositories(): Promise<void> {
    if (!hasAccessToken()) return
    if (privateStatus.value === 'success') return

    privateStatus.value = 'loading'
    privateError.value = null

    try {
      const dtos = await getAuthenticatedUserPrivateRepositories()
      privateRepositories.value = dtos.map(mapGithubRepositoryToRepository)
      privateStatus.value = 'success'
    } catch (err) {
      privateStatus.value = 'error'
      privateError.value = err instanceof Error ? err.message : 'Failed to load repositories'
    }
  }

  return {
    publicRepositoriesByOwner,
    publicStatusByOwner,
    publicErrorByOwner,
    privateRepositories,
    privateStatus,
    privateError,
    fetchPublicRepositories,
    fetchPrivateRepositories,
  }
})
