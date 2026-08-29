import { ref, watch, type Ref } from 'vue'

// Runs `loader` the first time `isActive` becomes true (e.g. a tab is
// opened), and never again automatically — repeat visits rely on whatever
// caching the loader itself does. Resetting `hasLoaded` back to false lets a
// consumer force a reload (e.g. after the active entity changes).
export function useLazyOnActive(isActive: Ref<boolean>, loader: () => void | Promise<void>) {
  const hasLoaded = ref(false)

  watch(
    isActive,
    (active) => {
      if (active && !hasLoaded.value) {
        hasLoaded.value = true
        void loader()
      }
    },
    { immediate: true },
  )

  function reset(): void {
    hasLoaded.value = false
  }

  return { hasLoaded, reset }
}
