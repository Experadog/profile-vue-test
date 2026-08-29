import type { Repository } from './types'
import type { AsyncStatus, useRepositoryStore } from './repositoryStore'

type RepositoryStore = ReturnType<typeof useRepositoryStore>

export function selectPublicRepositories(store: RepositoryStore, username: string): Repository[] {
  return store.publicRepositoriesByOwner[username] ?? []
}

export function selectPublicStatus(store: RepositoryStore, username: string): AsyncStatus {
  return store.publicStatusByOwner[username] ?? 'idle'
}

export function selectPublicError(store: RepositoryStore, username: string): string | null {
  return store.publicErrorByOwner[username] ?? null
}
