<script setup lang="ts">
import { ROUTE_NAMES } from '@/shared/config/routes-names'

import type { Repository } from '../model/types'

defineProps<{
  repository: Repository
}>()
</script>

<template>
  <article class="repository-card">
    <a
      :href="repository.htmlUrl"
      target="_blank"
      rel="noopener noreferrer"
      class="repository-card__name"
    >
      {{ repository.name }}
    </a>
    <!-- The owner is always a GitHub user this app can show a profile for,
         so route internally to our explorer instead of sending the user
         off to github.com. -->
    <router-link
      :to="{ name: ROUTE_NAMES.userProfile, params: { username: repository.ownerLogin } }"
      class="repository-card__owner"
    >
      {{ repository.ownerLogin }}
    </router-link>
  </article>
</template>

<style scoped>
.repository-card {
  display: flex;
  flex-direction: column;
  gap: 0.15em;
}

.repository-card__name {
  font-weight: bold;
}
</style>
