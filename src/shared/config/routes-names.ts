// Central registry of route names, so pages/router register routes by name
// instead of hardcoded strings scattered across the app.

export const ROUTE_NAMES = {
  users: 'users',
  userProfile: 'user-profile',
  authCallback: 'auth-callback',
} as const
