import { request } from '@/shared/api/request'
import { GITHUB_OAUTH_BASE_URL, GITHUB_OAUTH_ENDPOINTS, OAUTH_TOKEN_PROXY_PATH } from '@/shared/api/endpoints'
import { GITHUB_OAUTH_SCOPES } from '@/shared/constants/github-scopes'
import {
  GITHUB_OAUTH_CLIENT_ID,
  GITHUB_OAUTH_CLIENT_SECRET,
  GITHUB_OAUTH_REDIRECT_URI,
} from '@/shared/config/oauth'

import type { GitHubAccessTokenResponseDto } from './types'

// Builds the GitHub authorization-page URL for a full-page redirect —
// this is navigation, not a `request()` call.
export function buildAuthorizeUrl(): string {
  const url = new URL(GITHUB_OAUTH_ENDPOINTS.authorize(), GITHUB_OAUTH_BASE_URL)
  url.searchParams.set('client_id', GITHUB_OAUTH_CLIENT_ID)
  url.searchParams.set('redirect_uri', GITHUB_OAUTH_REDIRECT_URI)
  url.searchParams.set('scope', GITHUB_OAUTH_SCOPES.join(' '))
  return url.toString()
}

// Exchanges the authorization code GitHub redirected back with for an
// access token. This calls our *own* origin (`OAUTH_TOKEN_PROXY_PATH`), not
// `https://github.com/login/oauth/access_token` directly: GitHub's token
// endpoint never sends CORS headers, so a browser `fetch()` straight to it
// is blocked outright — see the comment on `githubOAuthProxyPlugin` in
// `vite.config.ts`. A local Vite middleware forwards this request to GitHub
// server-side (no CORS involved there) and relays the response back
// unchanged; the client secret is still supplied from the browser exactly
// as the assignment allows, only the network hop is routed differently.
export function exchangeCodeForToken(code: string): Promise<GitHubAccessTokenResponseDto> {
  return request<GitHubAccessTokenResponseDto>(window.location.origin, OAUTH_TOKEN_PROXY_PATH, {
    method: 'POST',
    headers: { Accept: 'application/json' },
    body: {
      client_id: GITHUB_OAUTH_CLIENT_ID,
      client_secret: GITHUB_OAUTH_CLIENT_SECRET,
      code,
      redirect_uri: GITHUB_OAUTH_REDIRECT_URI,
    },
  })
}
