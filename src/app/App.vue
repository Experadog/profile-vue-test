<script setup lang="ts">
// Importing `useTheme` here (root component, always mounted first) is what
// restores the persisted theme and applies it to <html> before the first
// meaningful paint. Layout composition beyond this minimal shell — app
// header widget, etc. — is deferred to later milestones.
import { onMounted } from 'vue'

import { ThemeToggle, LocaleSwitcher } from '@/shared/ui'
import { useTheme } from '@/shared/composables/useTheme'
import { AuthButton, useAuthStore } from '@/features/auth'

useTheme()

const authStore = useAuthStore()
// Restores the session from a stored access token (if any) before the user
// interacts with anything — same bootstrap role as `useTheme()` above.
onMounted(() => {
  void authStore.initializeSession()
})
</script>

<template>
  <div class="app-shell">
    <header class="app-shell__header">
      <LocaleSwitcher />
      <ThemeToggle />
      <AuthButton />
    </header>

    <main class="app-shell__content">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.app-shell__header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 0.5em;
  padding: 0.75em 1em;
  flex-wrap: wrap;
  border-bottom: 1px solid var(--color-border);
}

.app-shell__content {
  max-width: 48em;
  margin: 0 auto;
  padding: 1.5em 1em 3em;
}

@media (max-width: 30em) {
  .app-shell__content {
    padding: 1em 0.75em 2em;
  }
}
</style>
