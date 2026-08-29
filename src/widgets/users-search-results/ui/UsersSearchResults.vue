<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

import { UserCard, type User } from '@/entities/user'
import { BaseSpinner, BaseEmptyState, BaseErrorState } from '@/shared/ui'
import { ROUTE_NAMES } from '@/shared/config/routes-names'
import type { SearchUsersState } from '@/features/search-users'

defineProps<{
  state: SearchUsersState
  users: User[]
  errorMessage?: string | null
}>()

const emit = defineEmits<{
  retry: []
}>()

const router = useRouter()
const { t } = useI18n()

function goToProfile(login: string): void {
  router.push({ name: ROUTE_NAMES.userProfile, params: { username: login } })
}
</script>

<template>
  <div class="users-search-results">
    <BaseSpinner v-if="state === 'loading'" :label="t('common.loading')" />

    <BaseErrorState
      v-else-if="state === 'error'"
      :message="errorMessage ?? t('common.error')"
      :retry-label="t('common.retry')"
      @retry="emit('retry')"
    />

    <BaseEmptyState v-else-if="state === 'empty'" :message="t('common.empty')" />

    <BaseEmptyState v-else-if="state === 'initial'" :message="t('users.noQuery')" />

    <ul v-else-if="state === 'success'" class="users-search-results__list">
      <li v-for="user in users" :key="user.id">
        <button
          type="button"
          class="users-search-results__item"
          @click="goToProfile(user.login)"
        >
          <UserCard :user="user" />
        </button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.users-search-results__list {
  display: flex;
  flex-direction: column;
  gap: 1em;
  list-style: none;
  padding: 0;
  margin: 0;
}

.users-search-results__item {
  display: block;
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  color: inherit;
  border-radius: var(--radius-md);
}
</style>
