<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import {
  useRepositoryStore,
  selectPublicRepositories,
  selectPublicStatus,
  selectPublicError,
  RepositoryCard,
} from '@/entities/repository'
import { BaseSpinner, BaseEmptyState, BaseErrorState } from '@/shared/ui'
import { useLazyOnActive } from '@/shared/composables/useLazyOnActive'

// One `RepoList` instance is scoped to a single `username` — the parent page
// keys it (`:key="username"`) so switching profiles remounts it instead of
// reusing lazy-load state across users.
const props = defineProps<{
  username: string
  activeTab: string
}>()

const { t } = useI18n()
const repositoryStore = useRepositoryStore()

const isPublicActive = computed(() => props.activeTab === 'public')
const isPrivateActive = computed(() => props.activeTab === 'private')

useLazyOnActive(isPublicActive, () => repositoryStore.fetchPublicRepositories(props.username))
useLazyOnActive(isPrivateActive, () => repositoryStore.fetchPrivateRepositories())

const publicRepos = computed(() => selectPublicRepositories(repositoryStore, props.username))
const publicStatus = computed(() => selectPublicStatus(repositoryStore, props.username))
const publicError = computed(() => selectPublicError(repositoryStore, props.username))

const privateRepos = computed(() => repositoryStore.privateRepositories ?? [])
const privateStatus = computed(() => repositoryStore.privateStatus)
const privateError = computed(() => repositoryStore.privateError)

const status = computed(() => (isPrivateActive.value ? privateStatus.value : publicStatus.value))
const error = computed(() => (isPrivateActive.value ? privateError.value : publicError.value))
const repositories = computed(() => (isPrivateActive.value ? privateRepos.value : publicRepos.value))

function retry(): void {
  if (isPrivateActive.value) {
    void repositoryStore.fetchPrivateRepositories()
  } else {
    void repositoryStore.fetchPublicRepositories(props.username)
  }
}
</script>

<template>
  <div class="repo-list">
    <BaseSpinner v-if="status === 'loading'" :label="t('common.loading')" />

    <BaseErrorState
      v-else-if="status === 'error'"
      :message="error ?? t('common.error')"
      :retry-label="t('common.retry')"
      @retry="retry"
    />

    <BaseEmptyState v-else-if="status === 'success' && repositories.length === 0" :message="t('common.empty')" />

    <ul v-else-if="repositories.length > 0" class="repo-list__items">
      <li v-for="repository in repositories" :key="repository.id">
        <RepositoryCard :repository="repository" />
      </li>
    </ul>
  </div>
</template>

<style scoped>
.repo-list__items {
  display: flex;
  flex-direction: column;
  gap: 0.75em;
  list-style: none;
  padding: 0;
  margin: 0;
}
</style>
