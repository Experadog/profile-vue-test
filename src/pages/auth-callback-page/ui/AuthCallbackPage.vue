<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'

import { useAuthStore } from '@/features/auth'
import { useUserStore } from '@/entities/user'
import { ROUTE_NAMES } from '@/shared/config/routes-names'
import { BaseSpinner, BaseErrorState } from '@/shared/ui'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const userStore = useUserStore()
const { t } = useI18n()

const failed = ref(false)

async function run(): Promise<void> {
  const code = typeof route.query.code === 'string' ? route.query.code : null

  if (!code) {
    failed.value = true
    return
  }

  const ok = await authStore.handleCallback(code)

  if (ok && userStore.currentUser) {
    void router.replace({
      name: ROUTE_NAMES.userProfile,
      params: { username: userStore.currentUser.login },
    })
    return
  }

  failed.value = true
}

function retry(): void {
  failed.value = false
  void run()
}

onMounted(run)
</script>

<template>
  <section class="auth-callback-page">
    <BaseSpinner v-if="!failed" :label="t('common.loading')" />

    <BaseErrorState
      v-else
      :message="authStore.error ?? t('common.error')"
      :retry-label="t('common.retry')"
      @retry="retry"
    />
  </section>
</template>

<style scoped>
.auth-callback-page {
  display: flex;
  justify-content: center;
  padding: 2em;
}
</style>
