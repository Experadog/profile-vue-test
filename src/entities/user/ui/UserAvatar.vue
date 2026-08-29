<script setup lang="ts">
import { computed } from 'vue'

import { buildGravatarUrl } from '@/shared/lib/gravatar'

const props = withDefaults(
  defineProps<{
    src?: string
    // Used to derive a Gravatar image when `src` (GitHub's avatar_url) is
    // unavailable. Optional — plenty of call sites have no email to offer.
    email?: string
    alt: string
    size?: number
  }>(),
  {
    src: undefined,
    email: undefined,
    size: 48,
  },
)

// GitHub always returns an avatar_url in practice, but the domain model
// still marks it optional — so fall back to Gravatar, then to the plain
// placeholder, rather than assuming it is always present.
const resolvedSrc = computed(() => {
  if (props.src) return props.src
  if (props.email) return buildGravatarUrl(props.email, props.size)
  return undefined
})
</script>

<template>
  <img
    v-if="resolvedSrc"
    :src="resolvedSrc"
    :alt="alt"
    class="user-avatar"
    :style="{ width: `${size}px`, height: `${size}px` }"
  />
  <span
    v-else
    class="user-avatar user-avatar--fallback"
    :style="{ width: `${size}px`, height: `${size}px` }"
    role="img"
    :aria-label="alt"
  />
</template>

<style scoped>
.user-avatar {
  display: inline-block;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--color-surface);
  box-shadow: 0 0 0 1px var(--color-border);
}

.user-avatar--fallback {
  background: currentColor;
  opacity: 0.15;
}
</style>
