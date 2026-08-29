import { computed, reactive, ref, watch } from 'vue'

import { useUserStore, type User } from '@/entities/user'

export function useEditProfile(user: () => User) {
  const userStore = useUserStore()

  const isEditing = ref(false)
  const form = reactive({
    name: '',
    bio: '',
    company: '',
    location: '',
  })

  function resetForm(): void {
    const current = user()
    form.name = current.name ?? ''
    form.bio = current.bio ?? ''
    form.company = current.company ?? ''
    form.location = current.location ?? ''
  }

  // Keep the draft in sync whenever the underlying user changes (e.g. after
  // a successful save, or navigating between profiles) while not editing.
  watch(user, () => {
    if (!isEditing.value) resetForm()
  })

  const isSaving = computed(() => userStore.updateStatus === 'loading')
  const saveError = computed(() => userStore.updateError)

  function startEditing(): void {
    resetForm()
    isEditing.value = true
  }

  function cancelEditing(): void {
    isEditing.value = false
  }

  async function save(): Promise<void> {
    const ok = await userStore.updateProfile({
      name: form.name.trim() || undefined,
      bio: form.bio.trim() || undefined,
      company: form.company.trim() || undefined,
      location: form.location.trim() || undefined,
    })

    if (ok) {
      isEditing.value = false
    }
  }

  return {
    isEditing,
    form,
    isSaving,
    saveError,
    startEditing,
    cancelEditing,
    save,
  }
}
