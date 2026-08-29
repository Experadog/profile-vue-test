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
}

.profile-header__info {
  display: flex;
  flex-direction: column;
  gap: 0.35em;
}

.profile-header__login {
  font-weight: bold;
  margin: 0;
}

.profile-header__field-label {
  opacity: 0.7;
}

.profile-header__email,
.profile-header__link {
  margin: 0;
}
</style>
