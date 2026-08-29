<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { useTheme } from '@/shared/composables/useTheme'
import { THEMES } from '@/shared/constants/themes'

const { theme, toggleTheme } = useTheme()
const { t } = useI18n()

const isDark = computed(() => theme.value === THEMES.dark)
// The label always describes the action (what clicking does), not the
// current state — so it doubles as the button's visible text and its
// aria-label.
const label = computed(() => (isDark.value ? t('common.switchToLightTheme') : t('common.switchToDarkTheme')))
</script>

<template>
  <button type="button" class="theme-toggle" :aria-label="label" :title="label" @click="toggleTheme">
    <span aria-hidden="true">{{ isDark ? '☀️' : '🌙' }}</span>
  </button>
</template>

<style scoped>
.theme-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.25em;
  height: 2.25em;
  border-radius: 50%;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text);
  cursor: pointer;
  font-size: 1rem;
}
</style>
