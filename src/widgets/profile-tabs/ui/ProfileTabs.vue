<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { BaseTabs, type BaseTabItem } from '@/shared/ui'

const props = defineProps<{
  // Private tab only makes sense for the authenticated user's own
  // repositories — GitHub has no concept of "another user's private repos".
  showPrivateTab: boolean
}>()

// `BaseTabs` is a generic string-id tab switcher, so the model is typed
// `string` here too; `RepoList` narrows it back to the two known tab ids.
const activeTab = defineModel<string>({ required: true })
const { t } = useI18n()

const tabs = computed<BaseTabItem[]>(() => {
  const items: BaseTabItem[] = [{ id: 'public', label: t('users.tabPublic') }]
  if (props.showPrivateTab) {
    items.push({ id: 'private', label: t('users.tabPrivate') })
  }
  return items
})
</script>

<template>
  <BaseTabs :tabs="tabs" v-model="activeTab" />
</template>
