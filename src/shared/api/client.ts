// HTTP client configuration for the whole app.
//
// Preference: native `fetch` over axios. This project's HTTP needs are a
// handful of read-only GitHub REST calls plus one OAuth token exchange —
// no request cancellation pipelines, no complex interceptor chains beyond
// "attach an auth header if present". Native `fetch` wrapped by `request.ts`
// covers that without adding a dependency. If interceptor/cancellation needs
// grow non-trivial later, swapping this module for an axios-based one is a
// contained change — nothing outside `shared/api` talks to fetch directly.

import { getAccessToken } from './token-storage'

export const GITHUB_API_BASE_URL = 'https://api.github.com'

const DEFAULT_HEADERS: Record<string, string> = {
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
}

export function buildHeaders(overrides?: Record<string, string>): Record<string, string> {
  const token = getAccessToken()

  return {
    ...DEFAULT_HEADERS,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...overrides,
  }
}
