<script setup lang="ts">
import { useI18n } from 'vue-i18n'

defineProps<{
  totalCount: number
}>()

const { t } = useI18n()
</script>

<template>
  <p class="users-results-count">{{ t('users.resultsCount', { count: totalCount }) }}</p>
</template>

<style scoped>
.users-results-count {
  font-weight: bold;
}
</style>
