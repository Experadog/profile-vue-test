import type { User } from './types'
import type { useUserStore } from './useUserStore'

type UserStore = ReturnType<typeof useUserStore>

export function selectUserByLogin(store: UserStore, login: string): User | undefined {
  return store.usersByLogin[login]
}

export function selectAllCachedUsers(store: UserStore): User[] {
  return Object.values(store.usersByLogin)
}

export function selectIsUserLoading(store: UserStore): boolean {
  return store.userStatus === 'loading'
}

export function selectIsSearchLoading(store: UserStore): boolean {
  return store.searchStatus === 'loading'
}

// A profile page is "own" only once we actually know who the authenticated
// user is (currentUser loaded) and the two logins match — never assume
// ownership while currentUser is unresolved.
export function selectIsOwnProfile(store: UserStore, username: string): boolean {
  return store.currentUser?.login === username
}
