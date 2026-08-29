// Endpoint path constants/builders only. No fetching logic here — entity
// `api/` modules import these and pass them to `request()`.

export const GITHUB_OAUTH_BASE_URL = 'https://github.com'

export const GITHUB_ENDPOINTS = {
  user: (username: string) => `/users/${encodeURIComponent(username)}`,
  userRepos: (username: string) => `/users/${encodeURIComponent(username)}/repos`,
  authenticatedUser: () => '/user',
  authenticatedUserRepos: () => '/user/repos',
  searchUsers: () => '/search/users',
} as const

export const GITHUB_OAUTH_ENDPOINTS = {
  authorize: () => '/login/oauth/authorize',
} as const

// Same-origin path handled by a local Vite dev/preview server middleware
// (see `vite.config.ts`), which forwards the request server-side to
// `POST https://github.com/login/oauth/access_token`. That GitHub endpoint
// sends no CORS headers, so the browser cannot call it directly — see the
// comment on `githubOAuthProxyPlugin` in `vite.config.ts` for the full
// rationale. Must match the path registered there.
export const OAUTH_TOKEN_PROXY_PATH = '/api/github/oauth/token'
