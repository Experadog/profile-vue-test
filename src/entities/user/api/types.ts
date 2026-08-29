// Raw GitHub REST API DTOs only — shapes exactly as GitHub returns them.
// Never used directly in UI; always passed through mappers.ts first.

export interface GitHubUserDto {
  login: string
  id: number
  avatar_url: string
  html_url: string
  name: string | null
  bio: string | null
  followers: number
  following: number
  public_repos: number
  created_at: string
  location: string | null
  company: string | null
  blog: string | null
  email: string | null
}

// Fields the authenticated user is allowed to edit via `PATCH /user`.
export interface GitHubUserUpdateDto {
  name?: string | null
  bio?: string | null
  company?: string | null
  location?: string | null
}

export interface GitHubUserSearchResponseDto {
  total_count: number
  incomplete_results: boolean
  items: GitHubUserDto[]
}
