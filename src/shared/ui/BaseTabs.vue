<script setup lang="ts">
export interface BaseTabItem {
  id: string
  label: string
}

defineProps<{
  tabs: BaseTabItem[]
}>()

const model = defineModel<string>({ required: true })

function selectTab(id: string): void {
  model.value = id
}
</script>

<template>
  <div class="base-tabs" role="tablist">
    <button
      v-for="tab in tabs"
      :id="`tab-${tab.id}`"
      :key="tab.id"
      type="button"
      role="tab"
      class="base-tabs__tab"
      :class="{ 'base-tabs__tab--active': tab.id === model }"
      :aria-selected="tab.id === model"
      :aria-controls="`panel-${tab.id}`"
      :tabindex="tab.id === model ? 0 : -1"
      @click="selectTab(tab.id)"
    >
      {{ tab.label }}
    </button>
  </div>
</template>

<style scoped>
.base-tabs {
  display: flex;
  gap: 1.5em;
  border-bottom: 1px solid var(--color-border);
}

.base-tabs__tab {
  cursor: pointer;
  border: none;
  border-bottom: 2px solid transparent;
  background: none;
  padding: 0.6em 0.1em;
  margin-bottom: -1px;
  font-size: inherit;
  font-family: inherit;
  font-weight: 500;
  color: var(--color-text-muted);
  transition: color 0.15s ease;
}

.base-tabs__tab--active {
  color: var(--color-accent);
  border-bottom-color: var(--color-accent);
}
</style>
