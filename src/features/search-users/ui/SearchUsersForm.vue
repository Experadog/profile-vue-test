<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import { BaseButton, BaseInput } from '@/shared/ui'

defineProps<{
  loading: boolean
}>()

const emit = defineEmits<{
  submit: []
}>()

const query = defineModel<string>('query', { required: true })
const { t } = useI18n()

function handleSubmit(): void {
  emit('submit')
}
</script>

<template>
  <form class="search-users-form" @submit.prevent="handleSubmit">
    <BaseInput
      id="search-users-query"
      v-model="query"
      :placeholder="t('users.searchPlaceholder')"
      :disabled="loading"
      :label="t('common.search')"
    />
    <BaseButton type="submit" :loading="loading" :disabled="!query.trim()">
      {{ t('common.search') }}
    </BaseButton>
  </form>
</template>

<style scoped>
.search-users-form {
  display: flex;
  align-items: flex-end;
  gap: 0.75em;
  flex-wrap: wrap;
}
</style>
