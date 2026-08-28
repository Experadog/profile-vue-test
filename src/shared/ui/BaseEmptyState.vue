<script setup lang="ts">
withDefaults(
  defineProps<{
    message?: string
  }>(),
  {
    message: 'No data',
  },
)
</script>

<template>
  <div class="base-empty-state" role="status">
    <slot>
      <p class="base-empty-state__message">{{ message }}</p>
    </slot>
  </div>
</template>

<style scoped>
.base-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
</style>
