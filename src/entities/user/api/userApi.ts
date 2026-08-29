import { request } from '@/shared/api/request'
import { GITHUB_API_BASE_URL } from '@/shared/api/client'
import { GITHUB_ENDPOINTS } from '@/shared/api/endpoints'

import type { GitHubUserDto, GitHubUserSearchResponseDto, GitHubUserUpdateDto } from './types'

export function getUser(username: string): Promise<GitHubUserDto> {
  return request<GitHubUserDto>(GITHUB_API_BASE_URL, GITHUB_ENDPOINTS.user(username))
}

// GET /user — the only endpoint that returns the authenticated user's email,
// since public user lookups never expose another user's email.
export function getCurrentUser(): Promise<GitHubUserDto> {
  return request<GitHubUserDto>(GITHUB_API_BASE_URL, GITHUB_ENDPOINTS.authenticatedUser())
}

// PATCH /user — updates name/bio/company/location for the authenticated
// user. Email is intentionally not accepted here (display-only per the spec).
export function updateCurrentUser(update: GitHubUserUpdateDto): Promise<GitHubUserDto> {
  return request<GitHubUserDto>(GITHUB_API_BASE_URL, GITHUB_ENDPOINTS.authenticatedUser(), {
    method: 'PATCH',
    body: update,
  })
}

export function searchUsers(
  query: string,
  page = 1,
  perPage = 30,
): Promise<GitHubUserSearchResponseDto> {
  return request<GitHubUserSearchResponseDto>(GITHUB_API_BASE_URL, GITHUB_ENDPOINTS.searchUsers(), {
    query: {
      q: query,
      page,
      per_page: perPage,
    },
  })
}
