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
  // a successful save, or navigating between profiles). Router reuses this
  // component instance across `/users/:username` navigations, so switching
  // to a *different* user must also force-close an still-open edit form —
  // otherwise it lingers open (and would still PATCH the authenticated
  // user, not whoever is currently being viewed). A successful save
  // reassigns `currentUser` with the same `login`, and `save()` itself
  // already sets `isEditing` to `false` in that case, so this doesn't
  // interfere with that path.
  watch(user, (newUser, oldUser) => {
    if (newUser?.login !== oldUser?.login) {
      isEditing.value = false
    }
    if (!isEditing.value) {
      resetForm()
    }
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
