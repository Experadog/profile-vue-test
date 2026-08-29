<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import { SUPPORTED_LOCALES, type Locale } from '@/shared/constants/locales'
import { setStoredLocale } from '@/shared/lib/locale-storage'

// `useScope: 'global'` reads/writes the single app-wide locale created in
// `app/providers/with-i18n.ts` — this component never creates or imports
// that i18n instance itself (that would reach upward into `app/`), it only
// talks to the plugin already installed on the app.
const { t, locale } = useI18n({ useScope: 'global' })

function selectLocale(event: Event): void {
  const next = (event.target as HTMLSelectElement).value as Locale
  locale.value = next
  setStoredLocale(next)
}
</script>

<template>
  <select
    class="locale-switcher"
    :value="locale"
    :aria-label="t('common.language')"
    :title="t('common.language')"
    @change="selectLocale"
  >
    <option v-for="code in SUPPORTED_LOCALES" :key="code" :value="code">
      {{ code.toUpperCase() }}
    </option>
  </select>
</template>

<style scoped>
.locale-switcher {
  height: 2.25em;
  padding: 0 0.5em;
  border-radius: 0.5em;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text);
  cursor: pointer;
  font-size: 0.9rem;
}
</style>
