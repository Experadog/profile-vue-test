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
  gap: 0.35em;
}

.base-input__label {
  font-size: 0.85em;
  font-weight: 500;
  color: var(--color-text-muted);
}

.base-input__control {
  width: 100%;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
  color: var(--color-text);
  padding: 0.6em 0.75em;
  font-size: inherit;
  font-family: inherit;
  transition: all 0.15s ease;
}

.base-input__control:focus {
  outline: none;
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px var(--color-accent-subtle);
}

.base-input__control:disabled {
  cursor: not-allowed;
  opacity: 0.6;
  background: var(--color-surface-hover);
}
</style>
