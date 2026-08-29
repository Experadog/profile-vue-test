<script setup lang="ts">
withDefaults(
  defineProps<{
    label?: string
  }>(),
  {
    label: 'Loading…',
  },
)
</script>

<template>
  <span class="base-spinner" role="status" :aria-label="label">
    <span class="base-spinner__ring" aria-hidden="true" />
    <span class="base-spinner__label">{{ label }}</span>
  </span>
</template>

<style scoped>
.base-spinner {
  display: inline-flex;
  align-items: center;
  gap: 0.6em;
}

.base-spinner__ring {
  width: 1.25em;
  height: 1.25em;
  border: 0.15em solid var(--color-border);
  border-top-color: var(--color-accent);
  border-radius: 50%;
  animation: base-spinner-rotate 0.6s linear infinite;
}

.base-spinner__label {
  color: var(--color-text-muted);
  font-size: 0.9em;
}

@keyframes base-spinner-rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
