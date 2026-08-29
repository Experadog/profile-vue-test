import { computed, onUnmounted, ref, watch } from 'vue'

import { useUserStore } from '@/entities/user'

export type SearchUsersState = 'initial' | 'loading' | 'empty' | 'error' | 'success'

const SEARCH_DEBOUNCE_MS = 400

// Thin composable over entities/user: owns only the query string and the
// derived UX state. No API/cache logic lives here — that stays in the store.
export function useSearchUsers() {
  const userStore = useUserStore()
  const query = ref('')
  const hasSearched = ref(false)
  let debounceTimer: ReturnType<typeof setTimeout> | undefined

  const state = computed<SearchUsersState>(() => {
    if (!hasSearched.value) return 'initial'
    if (userStore.searchStatus === 'loading') return 'loading'
    if (userStore.searchStatus === 'error') return 'error'
    if (userStore.searchResult && userStore.searchResult.users.length === 0) return 'empty'
    if (userStore.searchStatus === 'success') return 'success'
    return 'initial'
  })

  function clearPendingSearch(): void {
    if (debounceTimer !== undefined) {
      clearTimeout(debounceTimer)
      debounceTimer = undefined
    }
  }

  async function search(): Promise<void> {
    clearPendingSearch()
    const trimmed = query.value.trim()
    if (!trimmed) return

    hasSearched.value = true
    await userStore.fetchSearchUsers(trimmed)
  }

  // Live search as the user types, debounced so we don't fire a request
  // per keystroke. Submitting via Enter or the Search button calls
  // `search()` directly (see SearchUsersForm's @submit), which clears any
  // pending debounce and runs immediately — so explicit submission is
  // never delayed by this.
  watch(query, (value) => {
    clearPendingSearch()

    if (!value.trim()) {
      hasSearched.value = false
      return
    }

    debounceTimer = setTimeout(() => {
      void search()
    }, SEARCH_DEBOUNCE_MS)
  })

  onUnmounted(clearPendingSearch)

  function reset(): void {
    clearPendingSearch()
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
