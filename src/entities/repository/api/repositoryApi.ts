import { request } from '@/shared/api/request'
import { GITHUB_API_BASE_URL } from '@/shared/api/client'
import { GITHUB_ENDPOINTS } from '@/shared/api/endpoints'

import type { GitHubRepositoryDto } from './types'

// `GET /users/:username/repos` only ever returns a user's PUBLIC
// repositories — true for any username, including the authenticated user's
// own login. Safe to use for both "another user's public repos" and
// "my own public repos".
export function getPublicRepositories(username: string): Promise<GitHubRepositoryDto[]> {
  return request<GitHubRepositoryDto[]>(GITHUB_API_BASE_URL, GITHUB_ENDPOINTS.userRepos(username))
}

// `GET /user/repos` is the only endpoint that can return private
// repositories, and only for the authenticated user (their own token) —
// there is no GitHub endpoint that exposes another user's private repos.
// `visibility=private` + `affiliation=owner` scopes it to repos the
// authenticated user actually owns, not ones they merely collaborate on.
export function getAuthenticatedUserPrivateRepositories(): Promise<GitHubRepositoryDto[]> {
  return request<GitHubRepositoryDto[]>(GITHUB_API_BASE_URL, GITHUB_ENDPOINTS.authenticatedUserRepos(), {
    query: {
      visibility: 'private',
      affiliation: 'owner',
    },
  })
}
