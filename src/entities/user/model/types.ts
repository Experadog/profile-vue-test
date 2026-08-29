// Domain model — decoupled from the GitHub DTO shape. UI and other layers
// consume this, never `api/types.ts` directly.

export interface User {
  id: number
  login: string
  avatarUrl: string
  profileUrl: string
  followers: number
  following: number
  publicRepos: number
  createdAt: string
  name?: string
  bio?: string
  location?: string
  company?: string
  blog?: string
  // Present only for the authenticated user — GitHub's public user endpoint
  // never returns another user's email.
  email?: string
}

// Fields editable via the edit-profile feature. Deliberately excludes
// `email` — the assignment requires email to be display-only.
export interface UserProfileUpdate {
  name?: string
  bio?: string
  company?: string
  location?: string
}

export interface UserSearchResult {
  totalCount: number
  incompleteResults: boolean
  users: User[]
}
