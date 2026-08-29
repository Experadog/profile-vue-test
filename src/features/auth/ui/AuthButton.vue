<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import { BaseButton } from '@/shared/ui'

import { useAuthStore } from '../model/useAuthStore'

const authStore = useAuthStore()
const { t } = useI18n()
</script>

<template>
  <BaseButton v-if="!authStore.isAuthenticated" type="button" @click="authStore.login">
    {{ t('common.login') }}
  </BaseButton>
  <BaseButton v-else type="button" @click="authStore.logout">
    {{ t('common.logout') }}
  </BaseButton>
</template>
