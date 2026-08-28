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
    <span class="base-spinner__circle" aria-hidden="true" />
  </span>
</template>

<style scoped>
.base-spinner {
  display: inline-flex;
}

.base-spinner__circle {
  width: 1em;
  height: 1em;
  border: 0.15em solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: base-spinner-rotate 0.6s linear infinite;
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
