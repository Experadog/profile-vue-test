<script setup lang="ts">
import UserAvatar from './UserAvatar.vue'
import type { User } from '../model/types'

defineProps<{
  user: User
}>()
</script>

<template>
  <article class="user-card">
    <UserAvatar :src="user.avatarUrl" :alt="user.login" :size="64" />
    <div class="user-card__info">
      <p class="user-card__login">{{ user.login }}</p>
      <p v-if="user.name" class="user-card__name">{{ user.name }}</p>
      <a :href="user.profileUrl" target="_blank" rel="noopener noreferrer" class="user-card__link">
        {{ user.profileUrl }}
      </a>
    </div>
  </article>
</template>

<style scoped>
.user-card {
  display: flex;
  gap: 0.75em;
  align-items: center;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 1em 1.25em;
  transition: all 0.15s ease;
}

.user-card:hover {
  border-color: var(--color-accent);
  box-shadow: var(--shadow-sm);
  transform: translateY(-1px);
}

.user-card__info {
  display: flex;
  flex-direction: column;
  gap: 0.15em;
}

.user-card__login {
  font-weight: bold;
  font-size: 1.05em;
  color: var(--color-text);
}

.user-card__name {
  color: var(--color-text-muted);
  font-size: 0.9em;
}

.user-card__link {
  color: var(--color-text-muted);
  font-size: 0.85em;
  text-decoration: none;
}

.user-card__link:hover {
  color: var(--color-accent);
  text-decoration: underline;
}
</style>
