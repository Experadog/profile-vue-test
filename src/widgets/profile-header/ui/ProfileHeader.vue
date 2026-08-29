<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import { UserAvatar, type User } from '@/entities/user'
import { EditProfileFields } from '@/features/edit-profile'

defineProps<{
  user: User
  isOwnProfile: boolean
}>()

const { t } = useI18n()
</script>

<template>
  <header class="profile-header">
    <UserAvatar :src="user.avatarUrl" :email="user.email" :alt="user.login" :size="96" />

    <div class="profile-header__info">
      <p class="profile-header__login">@{{ user.login }}</p>

      <p v-if="user.email" class="profile-header__email">
        <span class="profile-header__field-label">{{ t('users.emailLabel') }}:</span>
        {{ user.email }}
      </p>

      <a
        :href="user.profileUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="profile-header__link"
      >
        {{ t('users.profileLink') }}
      </a>

      <EditProfileFields :user="user" :editable="isOwnProfile" />
    </div>
  </header>
</template>

<style scoped>
.profile-header {
  display: flex;
  gap: 1.5em;
  align-items: flex-start;
  flex-wrap: wrap;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 1.75em;
  box-shadow: var(--shadow-sm);
}

.profile-header__info {
  display: flex;
  flex-direction: column;
  gap: 0.35em;
}

.profile-header__login {
  color: var(--color-text-muted);
  font-size: 0.95em;
  font-weight: 500;
  margin: 0;
}

.profile-header__field-label {
  opacity: 0.7;
}

.profile-header__email {
  color: var(--color-text-muted);
  font-size: 0.9em;
  margin: 0;
}

.profile-header__link {
  display: inline-flex;
  align-items: center;
  gap: 0.35em;
  padding: 0.3em 0.75em;
  border-radius: var(--radius-full);
  background: var(--color-accent-subtle);
  color: var(--color-accent);
  font-size: 0.85em;
  font-weight: 500;
  width: fit-content;
  text-decoration: none;
}
</style>
