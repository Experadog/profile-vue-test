<script setup lang="ts">
import BaseButton from './BaseButton.vue'

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
    <BaseButton type="button" variant="secondary" @click="emit('retry')">
      {{ retryLabel }}
    </BaseButton>
  </div>
</template>

<style scoped>
.base-error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1em;
  text-align: center;
  padding: 3em 1.5em;
  border: 1px dashed var(--color-border);
  border-radius: var(--radius-md);
}

.base-error-state__message {
  color: var(--color-danger);
  margin: 0;
}
</style>
