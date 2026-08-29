// OAuth scopes requested during the GitHub authorization flow, per the
// technical assignment: reading the authenticated user's profile, general
// user data, and repository access.
export const GITHUB_OAUTH_SCOPES = ['read:user', 'user', 'repo'] as const

export type GithubOAuthScope = (typeof GITHUB_OAUTH_SCOPES)[number]
