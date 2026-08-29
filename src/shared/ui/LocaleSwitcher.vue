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
  <div class="locale-switcher">
    <select
      class="locale-switcher__control"
      :value="locale"
      :aria-label="t('common.language')"
      :title="t('common.language')"
      @change="selectLocale"
    >
      <option v-for="code in SUPPORTED_LOCALES" :key="code" :value="code">
        {{ code.toUpperCase() }}
      </option>
    </select>
  </div>
</template>

<style scoped>
.locale-switcher {
  position: relative;
  display: inline-flex;
  align-items: center;
}

.locale-switcher::after {
  content: '';
  position: absolute;
  right: 0.75em;
  top: 50%;
  width: 0.4em;
  height: 0.4em;
  border-right: 1.5px solid var(--color-text-muted);
  border-bottom: 1.5px solid var(--color-text-muted);
  transform: translateY(-70%) rotate(45deg);
  pointer-events: none;
}

.locale-switcher__control {
  height: 2.25em;
  width: 100%;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
  color: var(--color-text);
  padding: 0.5em 1.75em 0.5em 0.75em;
  font-size: inherit;
  font-family: inherit;
  cursor: pointer;
  appearance: none;
  transition: all 0.15s ease;
}

.locale-switcher__control:focus {
  outline: none;
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px var(--color-accent-subtle);
}
</style>
