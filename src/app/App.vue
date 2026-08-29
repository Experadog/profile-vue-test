<script setup lang="ts">
// Importing `useTheme` here (root component, always mounted first) is what
// restores the persisted theme and applies it to <html> before the first
// meaningful paint. Layout composition beyond this minimal shell — app
// header widget, etc. — is deferred to later milestones.
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

import { ThemeToggle, LocaleSwitcher } from '@/shared/ui'
import { useTheme } from '@/shared/composables/useTheme'
import { AuthButton, useAuthStore } from '@/features/auth'

useTheme()

const { t } = useI18n()

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
      <span class="app-shell__brand">{{ t('common.appName') }}</span>

      <div class="app-shell__actions">
        <LocaleSwitcher />
        <ThemeToggle />
        <AuthButton />
      </div>
    </header>

    <main class="app-shell__content">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.app-shell__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.85em 1.5em;
  background: var(--color-surface);
  box-shadow: var(--shadow-sm);
  position: sticky;
  top: 0;
  z-index: 10;
}

.app-shell__brand {
  font-weight: 700;
  font-size: 1.05em;
  letter-spacing: -0.01em;
  color: var(--color-text);
  white-space: nowrap;
}

.app-shell__actions {
  display: flex;
  align-items: center;
  gap: 0.5em;
  flex-wrap: wrap;
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

  .app-shell__header {
    padding: 0.65em 0.85em;
    flex-wrap: wrap;
    row-gap: 0.5em;
  }
}
</style>
