import { computed, ref } from 'vue'

import { useUserStore } from '@/entities/user'

export type SearchUsersState = 'initial' | 'loading' | 'empty' | 'error' | 'success'

// Thin composable over entities/user: owns only the query string and the
// derived UX state. No API/cache logic lives here — that stays in the store.
export function useSearchUsers() {
  const userStore = useUserStore()
  const query = ref('')
  const hasSearched = ref(false)

  const state = computed<SearchUsersState>(() => {
    if (!hasSearched.value) return 'initial'
    if (userStore.searchStatus === 'loading') return 'loading'
    if (userStore.searchStatus === 'error') return 'error'
    if (userStore.searchResult && userStore.searchResult.users.length === 0) return 'empty'
    if (userStore.searchStatus === 'success') return 'success'
    return 'initial'
  })

  async function search(): Promise<void> {
    const trimmed = query.value.trim()
    if (!trimmed) return

    hasSearched.value = true
    await userStore.fetchSearchUsers(trimmed)
  }

  function reset(): void {
    query.value = ''
    hasSearched.value = false
  }

  return {
    query,
    state,
    searchResult: computed(() => userStore.searchResult),
    searchError: computed(() => userStore.searchError),
    search,
    reset,
  }
}
