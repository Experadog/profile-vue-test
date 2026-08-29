<script setup lang="ts">
import { SearchUsersForm, useSearchUsers } from '@/features/search-users'
import { UsersSearchResults } from '@/widgets/users-search-results'
import { UsersResultsCount } from '@/widgets/users-results-count'

const { query, state, searchResult, searchError, search } = useSearchUsers()
</script>

<template>
  <section class="users-page">
    <SearchUsersForm v-model:query="query" :loading="state === 'loading'" @submit="search" />

    <UsersResultsCount v-if="searchResult" :total-count="searchResult.totalCount" />

    <UsersSearchResults
      :state="state"
      :users="searchResult?.users ?? []"
      :error-message="searchError"
      @retry="search"
    />
  </section>
</template>

<style scoped>
.users-page {
  display: flex;
  flex-direction: column;
  gap: 1.5em;
}
</style>
