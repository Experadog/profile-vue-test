<script setup lang="ts">
withDefaults(
  defineProps<{
    type?: string
    placeholder?: string
    disabled?: boolean
    label?: string
    id?: string
  }>(),
  {
    type: 'text',
    placeholder: undefined,
    disabled: false,
    label: undefined,
    id: undefined,
  },
)

const model = defineModel<string>({ default: '' })
</script>

<template>
  <div class="base-input">
    <label v-if="label" :for="id" class="base-input__label">{{ label }}</label>
    <input
      :id="id"
      v-model="model"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      class="base-input__control"
    />
  </div>
</template>

<style scoped>
.base-input {
  display: flex;
  flex-direction: column;
  gap: 0.25em;
}

.base-input__control {
  width: 100%;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background: var(--color-bg);
  color: var(--color-text);
  padding: 0.5em 0.6em;
}

.base-input__control:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}
</style>
