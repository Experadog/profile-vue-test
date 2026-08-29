<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import { BaseButton, BaseInput } from '@/shared/ui'
import type { User } from '@/entities/user'

import { useEditProfile } from '../model/useEditProfile'

const props = withDefaults(
  defineProps<{
    user: User
    // Whether the "Edit" trigger is shown at all — false for someone else's
    // profile, where the fields are visible but never editable.
    editable?: boolean
  }>(),
  {
    editable: true,
  },
)

const { t } = useI18n()
const { isEditing, form, isSaving, saveError, startEditing, cancelEditing, save } =
  useEditProfile(() => props.user)
</script>

<template>
  <div class="edit-profile-fields">
    <template v-if="!isEditing">
      <h1 class="edit-profile-fields__name">{{ user.name ?? user.login }}</h1>

      <div v-if="user.company || user.location" class="edit-profile-fields__tags">
        <span v-if="user.company" class="edit-profile-fields__tag">{{ user.company }}</span>
        <span v-if="user.location" class="edit-profile-fields__tag">{{ user.location }}</span>
      </div>

      <p v-if="user.bio" class="edit-profile-fields__bio">{{ user.bio }}</p>

      <BaseButton v-if="editable" type="button" @click="startEditing">
        {{ t('users.edit') }}
      </BaseButton>
    </template>

    <form v-else class="edit-profile-fields__form" @submit.prevent="save">
      <BaseInput
        id="edit-profile-name"
        v-model="form.name"
        :label="t('users.namePlaceholder')"
        :placeholder="t('users.namePlaceholder')"
        :disabled="isSaving"
      />
      <BaseInput
        id="edit-profile-bio"
        v-model="form.bio"
        :label="t('users.bioLabel')"
        :placeholder="t('users.bioPlaceholder')"
        :disabled="isSaving"
      />
      <BaseInput
        id="edit-profile-company"
        v-model="form.company"
        :label="t('users.companyLabel')"
        :placeholder="t('users.companyPlaceholder')"
        :disabled="isSaving"
      />
      <BaseInput
        id="edit-profile-location"
        v-model="form.location"
        :label="t('users.locationLabel')"
        :placeholder="t('users.locationPlaceholder')"
        :disabled="isSaving"
      />

      <p v-if="saveError" class="edit-profile-fields__error" role="alert">
        {{ t('users.updateError') }}
      </p>

      <div class="edit-profile-fields__actions">
        <BaseButton type="submit" :loading="isSaving">{{ t('users.save') }}</BaseButton>
        <BaseButton type="button" variant="secondary" :disabled="isSaving" @click="cancelEditing">
          {{ t('users.cancel') }}
        </BaseButton>
      </div>
    </form>
  </div>
</template>

<style scoped>
.edit-profile-fields {
  display: flex;
  flex-direction: column;
  gap: 0.5em;
}

.edit-profile-fields__name {
  margin: 0;
  font-size: 1.5em;
}

.edit-profile-fields__tags {
  display: flex;
  gap: 0.5em;
  flex-wrap: wrap;
}

.edit-profile-fields__tag {
  display: inline-flex;
  align-items: center;
  gap: 0.35em;
  padding: 0.25em 0.65em;
  border-radius: var(--radius-full);
  background: var(--color-surface-hover);
  color: var(--color-text-muted);
  font-size: 0.85em;
  width: fit-content;
}

.edit-profile-fields__bio {
  margin: 0;
}

.edit-profile-fields__form {
  display: flex;
  flex-direction: column;
  gap: 0.75em;
  max-width: 24em;
}

.edit-profile-fields__actions {
  display: flex;
  gap: 0.5em;
}

.edit-profile-fields__error {
  color: var(--color-danger);
}
</style>
