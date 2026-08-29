<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import { BaseButton } from '@/shared/ui'
import { UserAvatar, useUserStore } from '@/entities/user'
import { ROUTE_NAMES } from '@/shared/config/routes-names'

import { useAuthStore } from '../model/useAuthStore'

const authStore = useAuthStore()
const userStore = useUserStore()
const { t } = useI18n()
</script>

<template>
  <BaseButton v-if="!authStore.isAuthenticated" type="button" @click="authStore.login">
    {{ t('common.login') }}
  </BaseButton>

  <template v-else>
    <router-link
      v-if="userStore.currentUser"
      :to="{ name: ROUTE_NAMES.userProfile, params: { username: userStore.currentUser.login } }"
      class="auth-button__my-profile"
      :aria-label="`${t('common.myProfile')}: ${userStore.currentUser.login}`"
      :title="t('common.myProfile')"
    >
      <UserAvatar
        :src="userStore.currentUser.avatarUrl"
        :email="userStore.currentUser.email"
        :alt="userStore.currentUser.login"
        :size="28"
      />
      {{ userStore.currentUser.login }}
    </router-link>

    <BaseButton type="button" variant="secondary" @click="authStore.logout">
      {{ t('common.logout') }}
    </BaseButton>
  </template>
</template>

<style scoped>
.auth-button__my-profile {
  display: inline-flex;
  align-items: center;
  gap: 0.5em;
  padding: 0.3em 0.75em 0.3em 0.3em;
  border-radius: var(--radius-full);
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text);
  text-decoration: none;
  font-size: 0.9em;
  font-weight: 500;
  transition: all 0.15s ease;
}

.auth-button__my-profile:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
}
</style>
