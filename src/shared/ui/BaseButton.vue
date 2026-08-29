<script setup lang="ts">
withDefaults(
  defineProps<{
    type?: 'button' | 'submit' | 'reset'
    disabled?: boolean
    loading?: boolean
    // 'primary' — solid accent, for the main action. 'secondary' — for
    // less prominent actions (Cancel/Logout/Retry).
    variant?: 'primary' | 'secondary'
  }>(),
  {
    type: 'button',
    disabled: false,
    loading: false,
    variant: 'primary',
  },
)
</script>

<template>
  <button
    :type="type"
    class="base-button"
    :class="`base-button--${variant}`"
    :disabled="disabled || loading"
    :aria-busy="loading"
  >
    <slot />
  </button>
</template>

<style scoped>
.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5em;
  cursor: pointer;
  border-radius: var(--radius-sm);
  padding: 0.6em 1.1em;
  font-size: inherit;
  font-weight: 500;
  border: 1px solid transparent;
  transition: all 0.15s ease;
}

.base-button--primary {
  background: var(--color-accent);
  color: #ffffff;
  box-shadow: var(--shadow-sm);
}

.base-button--primary:hover:not(:disabled) {
  background: var(--color-accent-hover);
}

.base-button--secondary {
  background: transparent;
  color: var(--color-text);
  border-color: var(--color-border);
}

.base-button--secondary:hover:not(:disabled) {
  background: var(--color-surface-hover);
}

.base-button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}
</style>
