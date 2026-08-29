<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

import { useUserStore, selectUserByLogin, selectIsOwnProfile } from '@/entities/user'
import { ProfileHeader } from '@/widgets/profile-header'
import { ProfileTabs } from '@/widgets/profile-tabs'
import { RepoList } from '@/widgets/repo-list'
import { BaseSpinner, BaseErrorState } from '@/shared/ui'
import { ROUTE_NAMES } from '@/shared/config/routes-names'

const route = useRoute()
const { t } = useI18n()

const userStore = useUserStore()

const username = computed(() => String(route.params.username))
const user = computed(() => selectUserByLogin(userStore, username.value))
const isOwnProfile = computed(() => selectIsOwnProfile(userStore, username.value))

// The public tab is what should be active whenever a profile is opened,
// including direct navigation to `/users/:username` — reset on every
// username change rather than only on mount. Typed as `string` to match
// `ProfileTabs`' generic tab-id model; RepoList treats anything but
// `'private'` as the public tab.
const activeTab = ref<string>('public')

function loadProfile(): void {
  activeTab.value = 'public'
  void userStore.fetchUser(username.value)
  // Resolves who "we" are so `isOwnProfile`/the private tab can be shown.
  // A no-op until an access token exists (pre-OAuth).
  void userStore.fetchCurrentUser()
}

onMounted(loadProfile)
watch(username, loadProfile)
</script>

<template>
  <section class="user-profile-page">
    <nav class="user-profile-page__breadcrumb" aria-label="breadcrumb">
      <router-link :to="{ name: ROUTE_NAMES.users }" class="user-profile-page__breadcrumb-link">
        {{ t('users.breadcrumbUsers') }}
      </router-link>
      <span class="user-profile-page__breadcrumb-sep" aria-hidden="true">/</span>
      <span class="user-profile-page__breadcrumb-current">@{{ username }}</span>
    </nav>

    <BaseSpinner v-if="userStore.userStatus === 'loading'" :label="t('common.loading')" />

    <BaseErrorState
      v-else-if="userStore.userStatus === 'error'"
      :message="userStore.userError ?? t('common.error')"
      :retry-label="t('common.retry')"
      @retry="loadProfile"
    />

    <template v-else-if="user">
      <ProfileHeader :user="user" :is-own-profile="isOwnProfile" />

      <ProfileTabs v-model="activeTab" :show-private-tab="isOwnProfile" />

      <!-- Keyed by username so switching profiles remounts the list instead
           of reusing another user's lazy-load/cache state. -->
      <RepoList :key="username" :username="username" :active-tab="activeTab" />
    </template>
  </section>
</template>

<style scoped>
.user-profile-page {
  display: flex;
  flex-direction: column;
  gap: 1.5em;
}

.user-profile-page__breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5em;
  font-size: 0.9em;
  color: var(--color-text-muted);
}

.user-profile-page__breadcrumb-link {
  color: var(--color-text-muted);
  text-decoration: none;
  transition: color 0.15s ease;
}

.user-profile-page__breadcrumb-link:hover {
  color: var(--color-accent);
}

.user-profile-page__breadcrumb-sep {
  color: var(--color-border);
}

.user-profile-page__breadcrumb-current {
  color: var(--color-text);
  font-weight: 500;
}
</style>
