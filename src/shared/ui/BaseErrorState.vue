<script setup lang="ts">
withDefaults(
  defineProps<{
    message?: string
    retryLabel?: string
  }>(),
  {
    message: 'Something went wrong',
    retryLabel: 'Retry',
  },
)

const emit = defineEmits<{
  retry: []
}>()
</script>

<template>
  <div class="base-error-state" role="alert">
    <p class="base-error-state__message">{{ message }}</p>
    <button
      type="button"
      class="base-error-state__retry"
      @click="emit('retry')"
    >
      {{ retryLabel }}
    </button>
  </div>
</template>

<style scoped>
.base-error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5em;
  text-align: center;
}

.base-error-state__retry {
  cursor: pointer;
}
</style>
