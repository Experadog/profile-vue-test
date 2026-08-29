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
}

.user-card__info {
  display: flex;
  flex-direction: column;
  gap: 0.15em;
}

.user-card__login {
  font-weight: bold;
}
</style>
