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
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 1em 1.25em;
  transition: all 0.15s ease;
}

.repository-card:hover {
  border-color: var(--color-accent);
  box-shadow: var(--shadow-sm);
  transform: translateY(-1px);
}

.repository-card__name {
  font-weight: bold;
  font-size: 1.05em;
  color: var(--color-text);
  text-decoration: none;
}

.repository-card__name:hover {
  color: var(--color-accent);
}

.repository-card__owner {
  color: var(--color-text-muted);
  font-size: 0.85em;
  text-decoration: none;
}

.repository-card__owner:hover {
  color: var(--color-accent);
  text-decoration: underline;
}
</style>
